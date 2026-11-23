import { AlertCircle, Plus, Save, Sparkles, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { MONITOR_STRINGS } from '../../i18n/monitorTranslations';
import {
  ALL_ISSUER_CATEGORIES,
  ALL_RESOURCE_STATUSES,
  ALL_RISK_CODES,
  ISSUER_CATEGORY_LABELS,
  REGION_LABELS,
  RISK_LABELS,
  STATUS_LABELS,
} from '../../i18n/translations';
import type {
  IssuerCategory,
  Language,
  ResourceStatus,
  RiskCode,
  TrackerEntry,
} from '../../types/tracker';

const REGIONS = ['North America', 'Europe', 'Asia-Pacific', 'Latin America'] as const;

export interface EditorDraft {
  mode: 'create' | 'edit';
  entry: TrackerEntry;
  fromGemini?: boolean;
}

interface NormativeEditorModalProps {
  draft: EditorDraft;
  language: Language;
  onSave: (entry: TrackerEntry) => void;
  onClose: () => void;
}

interface RecPair {
  en: string;
  pt: string;
}

function buildInitialRecPairs(entry: TrackerEntry): RecPair[] {
  const len = Math.max(entry.recommendations.en.length, entry.recommendations.pt.length, 1);
  const pairs: RecPair[] = [];
  for (let i = 0; i < len; i++) {
    pairs.push({
      en: entry.recommendations.en[i] ?? '',
      pt: entry.recommendations.pt[i] ?? '',
    });
  }
  return pairs;
}

export function createBlankEntry(): TrackerEntry {
  const id = `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  return {
    id,
    sourcePage: 0,
    jurisdiction: {
      countryCode: 'US',
      country: { en: '', pt: '' },
      subdivision: null,
      region: { en: 'North America', pt: 'América do Norte' },
    },
    issuer: {
      name: { en: '', pt: '' },
      category: 'legislature',
    },
    resource: {
      title: { en: '', pt: '' },
      dateDisplay: { en: '', pt: '' },
      year: new Date().getFullYear(),
      status: 'pending_bill',
      isMachineTranslated: false,
    },
    risks: [],
    recommendations: {
      en: [''],
      pt: [''],
    },
  };
}

export function NormativeEditorModal({
  draft,
  language,
  onSave,
  onClose,
}: NormativeEditorModalProps) {
  const t = MONITOR_STRINGS[language].editor;
  const base = draft.entry;

  const [countryEn, setCountryEn] = useState(base.jurisdiction.country.en);
  const [countryPt, setCountryPt] = useState(base.jurisdiction.country.pt);
  const [countryCode, setCountryCode] = useState(base.jurisdiction.countryCode);
  const [regionEn, setRegionEn] = useState<string>(
    REGION_LABELS[base.jurisdiction.region.en] ? base.jurisdiction.region.en : 'North America'
  );
  const [subdivisionEn, setSubdivisionEn] = useState(base.jurisdiction.subdivision?.en ?? '');
  const [subdivisionPt, setSubdivisionPt] = useState(base.jurisdiction.subdivision?.pt ?? '');

  const [issuerEn, setIssuerEn] = useState(base.issuer.name.en);
  const [issuerPt, setIssuerPt] = useState(base.issuer.name.pt);
  const [issuerCategory, setIssuerCategory] = useState<IssuerCategory>(base.issuer.category);

  const [titleEn, setTitleEn] = useState(base.resource.title.en);
  const [titlePt, setTitlePt] = useState(base.resource.title.pt);
  const [dateEn, setDateEn] = useState(base.resource.dateDisplay.en);
  const [datePt, setDatePt] = useState(base.resource.dateDisplay.pt);
  const [yearStr, setYearStr] = useState(base.resource.year !== null ? String(base.resource.year) : '');
  const [status, setStatus] = useState<ResourceStatus>(base.resource.status);
  const [sourcePageStr, setSourcePageStr] = useState(String(base.sourcePage));
  const [isMachineTranslated, setIsMachineTranslated] = useState(
    base.resource.isMachineTranslated
  );

  const [selectedRisks, setSelectedRisks] = useState<RiskCode[]>(
    base.risks.map((r) => r.code)
  );
  const [recPairs, setRecPairs] = useState<RecPair[]>(() => buildInitialRecPairs(base));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleRisk = (code: RiskCode) => {
    setSelectedRisks((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const updateRecPair = (index: number, field: 'en' | 'pt', value: string) => {
    setRecPairs((prev) =>
      prev.map((row, idx) => (idx === index ? { ...row, [field]: value } : row))
    );
  };

  const addRecPair = () => {
    setRecPairs((prev) => [...prev, { en: '', pt: '' }]);
  };

  const removeRecPair = (index: number) => {
    setRecPairs((prev) => (prev.length <= 1 ? [{ en: '', pt: '' }] : prev.filter((_, i) => i !== index)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cEn = countryEn.trim();
    const cPt = countryPt.trim();
    const cCode = countryCode.trim().toUpperCase();
    const iEn = issuerEn.trim();
    const iPt = issuerPt.trim();
    const tEn = titleEn.trim();
    const tPt = titlePt.trim();

    if (!cEn || !cPt || !cCode || !iEn || !iPt || !tEn || !tPt) {
      setErrorMsg(t.validationRequired);
      return;
    }

    const parsedYear = yearStr.trim() === '' ? null : Number(yearStr.trim());
    const validYear =
      parsedYear !== null && Number.isInteger(parsedYear) && parsedYear >= 1990 && parsedYear <= 2050
        ? parsedYear
        : null;

    const parsedPage = Number(sourcePageStr.trim());
    const validPage = Number.isFinite(parsedPage) && parsedPage >= 0 ? Math.floor(parsedPage) : 0;

    const subEn = subdivisionEn.trim();
    const subPt = subdivisionPt.trim();
    const subdivision =
      subEn || subPt ? { en: subEn || subPt, pt: subPt || subEn } : null;

    const regionLabel = REGION_LABELS[regionEn] ?? { en: regionEn, pt: regionEn };

    const cleanedRecsEn: string[] = [];
    const cleanedRecsPt: string[] = [];
    for (const pair of recPairs) {
      const enVal = pair.en.trim();
      const ptVal = pair.pt.trim();
      if (enVal || ptVal) {
        cleanedRecsEn.push(enVal || ptVal);
        cleanedRecsPt.push(ptVal || enVal);
      }
    }

    const entryToSave: TrackerEntry = {
      id: base.id,
      sourcePage: validPage,
      jurisdiction: {
        countryCode: cCode,
        country: { en: cEn, pt: cPt },
        subdivision,
        region: { en: regionLabel.en, pt: regionLabel.pt },
      },
      issuer: {
        name: { en: iEn, pt: iPt },
        category: issuerCategory,
      },
      resource: {
        title: { en: tEn, pt: tPt },
        dateDisplay: {
          en: dateEn.trim() || (validYear ? String(validYear) : 'Not specified'),
          pt: datePt.trim() || (validYear ? String(validYear) : 'Não especificado'),
        },
        year: validYear,
        status,
        isMachineTranslated,
      },
      risks: selectedRisks.map((code) => ({
        code,
        label: { en: RISK_LABELS[code].en, pt: RISK_LABELS[code].pt },
      })),
      recommendations: {
        en: cleanedRecsEn,
        pt: cleanedRecsPt,
      },
    };

    onSave(entryToSave);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="normative-editor-title"
    >
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50">
          <div>
            <h2
              id="normative-editor-title"
              className="text-base sm:text-lg font-bold text-slate-900"
            >
              {draft.mode === 'create' ? t.createTitle : t.editTitle}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">{t.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
            aria-label={t.cancel}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {draft.fromGemini && (
            <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 flex items-start gap-2.5 text-xs text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>{t.prefilledBanner}</span>
            </div>
          )}

          {errorMsg && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 flex items-start gap-2.5 text-xs text-rose-800 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Jurisdiction */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-200 w-full">
              {t.sectionJurisdiction}
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.countryEn}
                </label>
                <input
                  type="text"
                  value={countryEn}
                  onChange={(e) => setCountryEn(e.target.value)}
                  placeholder="United States"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.countryPt}
                </label>
                <input
                  type="text"
                  value={countryPt}
                  onChange={(e) => setCountryPt(e.target.value)}
                  placeholder="Estados Unidos"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.countryCode}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                  placeholder="US"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono uppercase focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.region}
                </label>
                <select
                  value={regionEn}
                  onChange={(e) => setRegionEn(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  {REGIONS.map((reg) => (
                    <option key={reg} value={reg}>
                      {REGION_LABELS[reg][language]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.subdivisionEn}{' '}
                  <span className="font-normal text-slate-400">({t.optionalHint})</span>
                </label>
                <input
                  type="text"
                  value={subdivisionEn}
                  onChange={(e) => setSubdivisionEn(e.target.value)}
                  placeholder="New York"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.subdivisionPt}{' '}
                  <span className="font-normal text-slate-400">({t.optionalHint})</span>
                </label>
                <input
                  type="text"
                  value={subdivisionPt}
                  onChange={(e) => setSubdivisionPt(e.target.value)}
                  placeholder="Nova York"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </fieldset>

          {/* Section 2: Issuer */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-200 w-full">
              {t.sectionIssuer}
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.issuerEn}
                </label>
                <input
                  type="text"
                  value={issuerEn}
                  onChange={(e) => setIssuerEn(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.issuerPt}
                </label>
                <input
                  type="text"
                  value={issuerPt}
                  onChange={(e) => setIssuerPt(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.issuerCategory}
                </label>
                <select
                  value={issuerCategory}
                  onChange={(e) => setIssuerCategory(e.target.value as IssuerCategory)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  {ALL_ISSUER_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {ISSUER_CATEGORY_LABELS[cat][language]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Section 3: Resource Metadata */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-200 w-full">
              {t.sectionResource}
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.titleEn}
                </label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.titlePt}
                </label>
                <input
                  type="text"
                  value={titlePt}
                  onChange={(e) => setTitlePt(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.status}
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ResourceStatus)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white font-semibold focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  {ALL_RESOURCE_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {STATUS_LABELS[st][language]} ({st})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.dateEn}
                </label>
                <input
                  type="text"
                  value={dateEn}
                  onChange={(e) => setDateEn(e.target.value)}
                  placeholder="Nov. 2026"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.datePt}
                </label>
                <input
                  type="text"
                  value={datePt}
                  onChange={(e) => setDatePt(e.target.value)}
                  placeholder="Nov. de 2026"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.year}
                </label>
                <input
                  type="number"
                  min={1990}
                  max={2050}
                  value={yearStr}
                  onChange={(e) => setYearStr(e.target.value)}
                  placeholder="2026"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm tabular-nums focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="w-48">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.sourcePage}
                </label>
                <input
                  type="number"
                  min={0}
                  max={999}
                  value={sourcePageStr}
                  onChange={(e) => setSourcePageStr(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm tabular-nums focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer mt-4">
                <input
                  type="checkbox"
                  checked={isMachineTranslated}
                  onChange={(e) => setIsMachineTranslated(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>{t.machineTranslated}</span>
              </label>
            </div>
          </fieldset>

          {/* Section 4: Risks */}
          <fieldset className="space-y-2.5">
            <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-200 w-full">
              {t.sectionRisks}
            </legend>
            <p className="text-xs text-slate-500">{t.risksHint}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {ALL_RISK_CODES.map((code) => {
                const checked = selectedRisks.includes(code);
                return (
                  <label
                    key={code}
                    className={`flex items-start gap-2 rounded-lg border px-2.5 py-2 text-xs cursor-pointer transition-colors ${
                      checked
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleRisk(code)}
                      className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="leading-snug">{RISK_LABELS[code][language]}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Section 5: Recommendations */}
          <fieldset className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <legend className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.sectionRecs}
              </legend>
              <button
                type="button"
                onClick={addRecPair}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addRecRow}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {recPairs.map((pair, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <textarea
                    rows={2}
                    value={pair.pt}
                    onChange={(e) => updateRecPair(idx, 'pt', e.target.value)}
                    placeholder={t.recPtPlaceholder}
                    className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                  <textarea
                    rows={2}
                    value={pair.en}
                    onChange={(e) => updateRecPair(idx, 'en', e.target.value)}
                    placeholder={t.recEnPlaceholder}
                    className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeRecPair(idx)}
                    className="self-start p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title={t.removeRecRow}
                    aria-label={t.removeRecRow}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </fieldset>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white pb-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-700 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-800 transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{t.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
