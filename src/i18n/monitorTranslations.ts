import type { AuditAction, Language } from '../types/tracker';

export interface MonitorStrings {
  kpi: {
    totalActive: string;
    totalActiveSub: (base: number, custom: number) => string;
    pendingBills: string;
    pendingBillsSub: string;
    bindingRules: string;
    bindingRulesSub: string;
    localMods: string;
    localModsSub: (modified: number, added: number) => string;
  };
  toolbar: {
    title: string;
    subtitle: string;
    addNew: string;
    exportJson: string;
    importJson: string;
    resetBaseline: string;
    exportSuccess: string;
    resetSuccess: string;
    importSuccess: (added: number, updated: number) => string;
  };
  watchlist: {
    title: string;
    subtitle: string;
    modePending: string;
    modeAllBills: string;
    modeAllRecords: string;
    searchPlaceholder: string;
    editButton: string;
    checkOnlineButton: string;
    modifiedTag: string;
    customTag: string;
    emptyPending: string;
    emptySearch: string;
    sourcePage: (p: number) => string;
    customPostTracker: string;
  };
  editor: {
    createTitle: string;
    editTitle: string;
    subtitle: string;
    sectionJurisdiction: string;
    countryEn: string;
    countryPt: string;
    countryCode: string;
    region: string;
    subdivisionEn: string;
    subdivisionPt: string;
    optionalHint: string;
    sectionIssuer: string;
    issuerEn: string;
    issuerPt: string;
    issuerCategory: string;
    sectionResource: string;
    titleEn: string;
    titlePt: string;
    dateEn: string;
    datePt: string;
    year: string;
    status: string;
    sourcePage: string;
    machineTranslated: string;
    sectionRisks: string;
    risksHint: string;
    sectionRecs: string;
    recEnPlaceholder: string;
    recPtPlaceholder: string;
    addRecRow: string;
    removeRecRow: string;
    cancel: string;
    save: string;
    validationRequired: string;
    saveCreatedToast: string;
    saveUpdatedToast: string;
    prefilledBanner: string;
  };
  gemini: {
    title: string;
    subtitle: string;
    badge: string;
    selectBillLabel: string;
    customQueryOption: string;
    queryLabel: string;
    queryPlaceholder: string;
    runButton: string;
    runningButton: string;
    offlineNoticeTitle: string;
    offlineNoticeBody: string;
    summaryHeading: string;
    proposedDiffHeading: string;
    currentStatusLabel: string;
    suggestedStatusLabel: string;
    suggestedDateLabel: string;
    suggestedNoteLabel: string;
    sourcesHeading: string;
    noSources: string;
    humanGateNote: string;
    reviewLoadButton: string;
    errorPrefix: string;
  };
  audit: {
    title: string;
    subtitle: string;
    showLog: string;
    hideLog: string;
    emptyLog: string;
    colTimestamp: string;
    colAction: string;
    colJurisdiction: string;
    colRecord: string;
    colSummary: string;
    actions: Record<AuditAction, string>;
  };
  modals: {
    importTitle: string;
    importSummary: (total: number, added: number, updated: number, unchanged: number) => string;
    importConfirm: string;
    resetTitle: string;
    resetBody: string;
    resetConfirm: string;
    cancel: string;
  };
}

export const MONITOR_STRINGS: Record<Language, MonitorStrings> = {
  pt: {
    kpi: {
      totalActive: 'Registros Ativos',
      totalActiveSub: (base, custom) =>
        custom > 0 ? `${base} base IAPP + ${custom} customizados` : `${base} base IAPP Out/2026 íntegra`,
      pendingBills: 'Projetos em Tramitação',
      pendingBillsSub: 'Status pending_bill aguardando desfecho',
      bindingRules: 'Leis & Regras Judiciais',
      bindingRulesSub: 'Leis promulgadas + ordens/regras de tribunais',
      localMods: 'Alterações Locais',
      localModsSub: (modified, added) => `${modified} editados · ${added} adicionados localmente`,
    },
    toolbar: {
      title: 'Governança de Dados & Portabilidade Offline',
      subtitle: 'Todas as edições são salvas em localStorage e sincronizadas imediatamente nas Abas 1 e 2.',
      addNew: 'Nova Norma / Registro',
      exportJson: 'Exportar Base JSON',
      importJson: 'Importar JSON',
      resetBaseline: 'Restaurar Base Original (119)',
      exportSuccess: 'Backup JSON exportado com sucesso.',
      resetSuccess: 'Base restaurada para os 119 registros originais IAPP (Out/2026).',
      importSuccess: (added, updated) =>
        `Backup aplicado: ${added} adicionados, ${updated} atualizados.`,
    },
    watchlist: {
      title: 'Watchlist Legislativo & Atualizador Rápido',
      subtitle: 'Acompanhe projetos de lei em tramitação e atualize status, datas, riscos ou recomendações.',
      modePending: 'Projetos Pendentes',
      modeAllBills: 'Todos os Projetos & Leis',
      modeAllRecords: 'Todos os Registros',
      searchPlaceholder: 'Filtrar watchlist por título, estado, país ou órgão emissor...',
      editButton: 'Atualizar Status / Editar',
      checkOnlineButton: 'Verificar Online (Gemini Grounding)',
      modifiedTag: 'Editado localmente',
      customTag: 'Adicionado localmente',
      emptyPending: 'Nenhum projeto com status pending_bill no momento.',
      emptySearch: 'Nenhum registro corresponde ao filtro da watchlist.',
      sourcePage: (p) => `IAPP p. ${p}`,
      customPostTracker: 'Pós-tracker (local)',
    },
    editor: {
      createTitle: 'Nova Norma / Registro Bilíngue',
      editTitle: 'Editar Registro Normativo',
      subtitle: 'Preencha os campos obrigatórios em Português e Inglês para manter a paridade bilíngue.',
      sectionJurisdiction: '1. Jurisdição',
      countryEn: 'País / Jurisdição (EN) *',
      countryPt: 'País / Jurisdição (PT) *',
      countryCode: 'Código ISO (ex: US, BR, EU) *',
      region: 'Região *',
      subdivisionEn: 'Estado / Subdivisão (EN)',
      subdivisionPt: 'Estado / Subdivisão (PT)',
      optionalHint: 'Opcional',
      sectionIssuer: '2. Órgão Emissor',
      issuerEn: 'Nome do Emissor (EN) *',
      issuerPt: 'Nome do Emissor (PT) *',
      issuerCategory: 'Categoria do Emissor *',
      sectionResource: '3. Metadados do Ato Normativo',
      titleEn: 'Título do Recurso / Norma (EN) *',
      titlePt: 'Título do Recurso / Norma (PT) *',
      dateEn: 'Data de Exibição (EN)',
      datePt: 'Data de Exibição (PT)',
      year: 'Ano (vazio = Sem data)',
      status: 'Status Normativo *',
      sourcePage: 'Página IAPP (0 = adição pós-tracker)',
      machineTranslated: 'Sinalizar tradução assistida (Copilot/MT)',
      sectionRisks: '4. Riscos Identificados (marque os aplicáveis ou deixe vazio para N/A)',
      risksHint: 'Deixar sem seleção preserva o registro como N/A nas análises de risco.',
      sectionRecs: '5. Recomendações Práticas (PT e EN em paralelo)',
      recEnPlaceholder: 'Recomendação em inglês (EN)...',
      recPtPlaceholder: 'Recomendação em português (PT)...',
      addRecRow: 'Adicionar recomendação',
      removeRecRow: 'Remover',
      cancel: 'Cancelar',
      save: 'Salvar Alteração',
      validationRequired:
        'Preencha os campos obrigatórios: País (EN e PT), Código ISO, Emissor (EN e PT) e Título (EN e PT).',
      saveCreatedToast: 'Novo registro adicionado e sincronizado com as Abas 1 e 2.',
      saveUpdatedToast: 'Registro atualizado e sincronizado com as Abas 1 e 2.',
      prefilledBanner:
        'Proposta carregada da verificação Gemini Grounding. Revise os campos em PT e EN antes de clicar em Salvar Alteração.',
    },
    gemini: {
      title: 'Assistente de Verificação Legislativa (Gemini + Google Search)',
      subtitle: 'Consulte desenvolvimentos recentes na web com fontes verificáveis e revisão humana obrigatória.',
      badge: 'Human-in-the-Loop',
      selectBillLabel: 'Selecionar projeto/registro da base',
      customQueryOption: 'Consulta personalizada (livre)',
      queryLabel: 'Consulta de verificação',
      queryPlaceholder: 'Ex: New York AB A11723 generative AI status',
      runButton: 'Verificar via Google Search',
      runningButton: 'Consultando fontes...',
      offlineNoticeTitle: 'Modo Offline Ativo',
      offlineNoticeBody:
        'Modo Offline Ativo: A verificação web via Gemini está desativada; utilize o editor manual e o backup JSON normalmente.',
      summaryHeading: 'Resumo Fundamentado (Google Search)',
      proposedDiffHeading: 'Proposta de Atualização (Diff Sugerido)',
      currentStatusLabel: 'Status Atual',
      suggestedStatusLabel: 'Status Sugerido',
      suggestedDateLabel: 'Data Sugerida',
      suggestedNoteLabel: 'Nota / Recomendação Sugerida',
      sourcesHeading: 'Fontes Verificáveis',
      noSources: 'Nenhuma URL de fonte retornada para esta consulta.',
      humanGateNote:
        'Revisão obrigatória: resultados de IA nunca alteram a base automaticamente. Revise os campos no formulário antes de salvar.',
      reviewLoadButton: 'Revisar e Aplicar no Formulário',
      errorPrefix: 'Erro na verificação online:',
    },
    audit: {
      title: 'Histórico de Atualizações Locais',
      subtitle: 'Registro auditável de adições, edições, importações JSON e restaurações locais.',
      showLog: 'Exibir histórico',
      hideLog: 'Ocultar histórico',
      emptyLog: 'Nenhuma alteração local registrada até o momento.',
      colTimestamp: 'Data / Hora',
      colAction: 'Ação',
      colJurisdiction: 'Jurisdição',
      colRecord: 'Registro',
      colSummary: 'Resumo da Alteração',
      actions: {
        created: 'Criado',
        updated: 'Atualizado',
        imported: 'Importado',
        reset: 'Restaurado',
      },
    },
    modals: {
      importTitle: 'Confirmar Importação de Backup JSON',
      importSummary: (total, added, updated, unchanged) =>
        `O arquivo validado contém ${total} registros: ${added} novos, ${updated} atualizados e ${unchanged} inalterados em relação à base atual.`,
      importConfirm: 'Aplicar Backup JSON',
      resetTitle: 'Restaurar Base Original (119 registros)?',
      resetBody:
        'Esta ação removerá todas as edições e adições locais salvas em localStorage e restaurará integralmente os 119 registros originais IAPP (Outubro de 2026).',
      resetConfirm: 'Sim, Restaurar 119 Originais',
      cancel: 'Cancelar',
    },
  },
  en: {
    kpi: {
      totalActive: 'Total Active Records',
      totalActiveSub: (base, custom) =>
        custom > 0 ? `${base} IAPP base + ${custom} custom` : `${base} IAPP Oct 2026 baseline intact`,
      pendingBills: 'Pending Bills Tracked',
      pendingBillsSub: 'Active pending_bill records awaiting outcome',
      bindingRules: 'Enacted Laws & Court Rules',
      bindingRulesSub: 'Enacted statutes + judicial standing orders',
      localMods: 'Local Modifications',
      localModsSub: (modified, added) => `${modified} edited · ${added} added locally`,
    },
    toolbar: {
      title: 'Data Governance & Offline Portability',
      subtitle: 'All edits persist automatically in localStorage and sync live across Tabs 1 and 2.',
      addNew: 'Add New Norm / Record',
      exportJson: 'Export JSON Backup',
      importJson: 'Import JSON Backup',
      resetBaseline: 'Reset to 119 Baseline',
      exportSuccess: 'JSON backup exported successfully.',
      resetSuccess: 'Dataset restored to the original 119 IAPP (Oct 2026) baseline.',
      importSuccess: (added, updated) =>
        `Backup imported: ${added} added, ${updated} updated.`,
    },
    watchlist: {
      title: 'Legislative Watchlist & Quick Status Updater',
      subtitle: 'Track pending legislative bills and update status, dates, risks, or practical recommendations.',
      modePending: 'Pending Bills',
      modeAllBills: 'All Bills (Pending, Enacted, Died)',
      modeAllRecords: 'All Records',
      searchPlaceholder: 'Filter watchlist by title, state, country, or issuer...',
      editButton: 'Update Status / Edit',
      checkOnlineButton: 'Check Online via Gemini Grounding',
      modifiedTag: 'Edited locally',
      customTag: 'Added locally',
      emptyPending: 'No records currently have pending_bill status.',
      emptySearch: 'No watchlist records match your current search.',
      sourcePage: (p) => `IAPP p. ${p}`,
      customPostTracker: 'Post-tracker (local)',
    },
    editor: {
      createTitle: 'Add New Bilingual Normative Record',
      editTitle: 'Edit Normative Record',
      subtitle: 'Provide required fields in both English and Portuguese to maintain full bilingual parity.',
      sectionJurisdiction: '1. Jurisdiction',
      countryEn: 'Country / Jurisdiction (EN) *',
      countryPt: 'Country / Jurisdiction (PT) *',
      countryCode: 'ISO Code (e.g., US, BR, EU) *',
      region: 'Region *',
      subdivisionEn: 'State / Subdivision (EN)',
      subdivisionPt: 'State / Subdivision (PT)',
      optionalHint: 'Optional',
      sectionIssuer: '2. Issuing Body',
      issuerEn: 'Issuer Name (EN) *',
      issuerPt: 'Issuer Name (PT) *',
      issuerCategory: 'Issuer Category *',
      sectionResource: '3. Resource Metadata',
      titleEn: 'Resource / Bill Title (EN) *',
      titlePt: 'Resource / Bill Title (PT) *',
      dateEn: 'Display Date (EN)',
      datePt: 'Display Date (PT)',
      year: 'Year (blank = Undated)',
      status: 'Normative Status *',
      sourcePage: 'Source Page (0 = post-tracker addition)',
      machineTranslated: 'Flag as machine-translated (Copilot/MT)',
      sectionRisks: '4. Identified Risks (select applicable codes or leave empty for N/A)',
      risksHint: 'Leaving all unchecked keeps the record explicitly classified as N/A in risk analytics.',
      sectionRecs: '5. Practical Recommendations (parallel EN & PT)',
      recEnPlaceholder: 'Recommendation in English (EN)...',
      recPtPlaceholder: 'Recommendation in Portuguese (PT)...',
      addRecRow: 'Add recommendation',
      removeRecRow: 'Remove',
      cancel: 'Cancel',
      save: 'Save Change',
      validationRequired:
        'Please complete required fields: Country (EN & PT), ISO Code, Issuer Name (EN & PT), and Title (EN & PT).',
      saveCreatedToast: 'New record added and synced across Tabs 1 and 2.',
      saveUpdatedToast: 'Record updated and synced across Tabs 1 and 2.',
      prefilledBanner:
        'Proposal loaded from Gemini Grounding verification. Review EN and PT fields before clicking Save Change.',
    },
    gemini: {
      title: 'Legislative Verification Assistant (Gemini + Google Search)',
      subtitle: 'Check recent legislative developments on the web with verifiable source URLs and mandatory human review.',
      badge: 'Human-in-the-Loop',
      selectBillLabel: 'Select bill / record from tracker',
      customQueryOption: 'Custom free-text query',
      queryLabel: 'Verification query',
      queryPlaceholder: 'e.g., New York AB A11723 generative AI status',
      runButton: 'Verify with Google Search',
      runningButton: 'Checking sources...',
      offlineNoticeTitle: 'Offline Mode Active',
      offlineNoticeBody:
        'Offline Mode Active: Web verification via Gemini is disabled; use the manual editor and JSON backup normally.',
      summaryHeading: 'Grounded Summary (Google Search)',
      proposedDiffHeading: 'Proposed Update (Suggested Diff)',
      currentStatusLabel: 'Current Status',
      suggestedStatusLabel: 'Suggested Status',
      suggestedDateLabel: 'Suggested Date',
      suggestedNoteLabel: 'Suggested Note / Recommendation',
      sourcesHeading: 'Verifiable Sources',
      noSources: 'No source URLs were returned for this query.',
      humanGateNote:
        'Mandatory human review: AI outputs never modify the dataset automatically. Review and edit the pre-filled form before saving.',
      reviewLoadButton: 'Review & Load into Editor',
      errorPrefix: 'Online verification error:',
    },
    audit: {
      title: 'Local Update Audit Log',
      subtitle: 'Auditable history of local additions, status updates, JSON imports, and baseline resets.',
      showLog: 'Show log',
      hideLog: 'Hide log',
      emptyLog: 'No local modifications recorded yet.',
      colTimestamp: 'Timestamp',
      colAction: 'Action',
      colJurisdiction: 'Jurisdiction',
      colRecord: 'Record',
      colSummary: 'Change Summary',
      actions: {
        created: 'Created',
        updated: 'Updated',
        imported: 'Imported',
        reset: 'Reset',
      },
    },
    modals: {
      importTitle: 'Confirm JSON Backup Import',
      importSummary: (total, added, updated, unchanged) =>
        `Validated backup contains ${total} records: ${added} new, ${updated} updated, and ${unchanged} unchanged relative to your current dataset.`,
      importConfirm: 'Apply JSON Backup',
      resetTitle: 'Reset to 119 Original Baseline?',
      resetBody:
        'This will clear all local edits and custom additions stored in localStorage and restore the original 119 IAPP (October 2026) records.',
      resetConfirm: 'Yes, Reset to 119 Baseline',
      cancel: 'Cancel',
    },
  },
};
