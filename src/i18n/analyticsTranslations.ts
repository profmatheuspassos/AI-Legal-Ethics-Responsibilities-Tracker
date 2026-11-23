import type { Language } from '../types/tracker';

export interface AnalyticsStrings {
  caveats: {
    title: string;
    toggleHide: string;
    toggleShow: string;
    usTitle: string;
    usBody: (usCount: number, total: number, nonUsCount: number) => string;
    naTitle: string;
    naBody: (naCount: number, total: number) => string;
  };
  filters: {
    scopeAll: string;
    scopeNonUs: string;
    scopeUs: string;
    scopeEurope: string;
    region: string;
    allRegions: string;
    status: string;
    allStatuses: string;
    issuer: string;
    allIssuers: string;
    reset: string;
  };
  kpi: {
    recordsAnalyzed: string;
    ofDataset: (pct: string, total: number) => string;
    jurisdictionsRepresented: string;
    subdivisionsSub: (subCount: number) => string;
    topRisk: string;
    topRiskEntries: (count: number) => string;
    noRisksInSlice: string;
    riskCoverage: string;
    riskCoverageSub: (classified: number, classifiedPct: string, naCount: number, naPct: string) => string;
  };
  geo: {
    title: string;
    subtitle: string;
    modeGlobal: string;
    modeUs: string;
    excludeUsToggle: string;
    regionalSummaryLabel: string;
    federalUnspecifiedLabel: string;
    entriesUnit: string;
    emptySlice: string;
    emptyUsSlice: string;
    clickHint: string;
    shareOfView: string;
  };
  timeline: {
    title: string;
    subtitle: string;
    stackByLabel: string;
    stackByStatus: string;
    stackByIssuer: string;
    undatedLabel: string;
    undatedShort: string;
    totalLabel: string;
    clickHint: string;
    emptySlice: string;
  };
  risks: {
    title: string;
    subtitle: string;
    multiRiskNote: string;
    naBarLabel: string;
    naDividerLabel: string;
    entriesOfSlice: (count: number, pct: string) => string;
    clickHint: string;
  };
  heatmap: {
    title: string;
    subtitle: string;
    rowModeRegion: string;
    rowModeCountries: string;
    rowModeUsStates: string;
    naColumnShort: string;
    naColumnFull: string;
    totalColumn: string;
    intensityLow: string;
    intensityHigh: string;
    rowShareLabel: string;
    colShareLabel: string;
    clickCellHint: string;
    emptyMatrix: string;
  };
  drawer: {
    matchingRecords: (count: number) => string;
    inspectInExplorer: string;
    close: string;
    recommendationsLabel: string;
    risksLabel: string;
    risksNa: string;
    sourcePage: (page: number) => string;
  };
}

export const ANALYTICS_STRINGS: Record<Language, AnalyticsStrings> = {
  pt: {
    caveats: {
      title: 'Notas Metodológicas & Limitações da Amostra',
      toggleHide: 'Ocultar notas',
      toggleShow: 'Exibir notas',
      usTitle: 'Concentração Jurisdicional nos EUA',
      usBody: (usCount, total, nonUsCount) =>
        `${usCount} dos ${total} registros (${((usCount / total) * 100).toFixed(1)}%) têm origem em órgãos federais, estaduais e locais dos Estados Unidos (ordens de advogados, tribunais e legislativos), enquanto ${nonUsCount} registros (${((nonUsCount / total) * 100).toFixed(1)}%) abrangem 22 países fora dos EUA mais a seção supranacional Europa. Volumes maiores nos EUA refletem maior granularidade de reporte subnacional, e não ausência de governança global.`,
      naTitle: 'Registros sem Risco Classificado (N/A na Fonte)',
      naBody: (naCount, total) =>
        `${naCount} dos ${total} registros (${((naCount / total) * 100).toFixed(1)}%) possuem lista de riscos vazia, correspondendo a "N/A" na coluna "Risks identified" do PDF original da IAPP (comum em projetos de lei e ordens judiciais). Esses registros ainda trazem obrigações substantivas em "Recomendações" e são exibidos explicitamente como categoria N/A distinta nas análises de risco, sem omissão.`,
    },
    filters: {
      scopeAll: 'Todos',
      scopeNonUs: 'Apenas Não-EUA',
      scopeUs: 'Apenas EUA',
      scopeEurope: 'Europa',
      region: 'Região',
      allRegions: 'Todas as regiões',
      status: 'Status Normativo',
      allStatuses: 'Todos os status',
      issuer: 'Categoria do Emissor',
      allIssuers: 'Todas as categorias',
      reset: 'Limpar filtros',
    },
    kpi: {
      recordsAnalyzed: 'Registros Analisados',
      ofDataset: (pct, total) => `${pct}% da base total (${total})`,
      jurisdictionsRepresented: 'Jurisdições Representadas',
      subdivisionsSub: (subCount) => `${subCount} estados / subdivisões distintas`,
      topRisk: 'Principal Risco Identificado',
      topRiskEntries: (count) => `${count} ${count === 1 ? 'registro cita este risco' : 'registros citam este risco'}`,
      noRisksInSlice: 'Nenhum risco classificado neste recorte',
      riskCoverage: 'Cobertura de Riscos Explícitos',
      riskCoverageSub: (classified, classifiedPct, naCount, naPct) =>
        `${classified} classificados (${classifiedPct}%) · ${naCount} N/A (${naPct}%)`,
    },
    geo: {
      title: 'Distribuição Geográfica & Subnacional',
      subtitle: 'Empilhado por status normativo. Clique em qualquer barra ou segmento para detalhar os registros.',
      modeGlobal: 'Jurisdições Globais (23 Países + Europa)',
      modeUs: 'Detalhamento Subnacional dos EUA',
      excludeUsToggle: 'Excluir EUA',
      regionalSummaryLabel: 'Resumo por Região (clique para inspecionar)',
      federalUnspecifiedLabel: 'Federal / Nacional (Não especificado)',
      entriesUnit: 'registros',
      emptySlice: 'Nenhum registro corresponde ao recorte analítico atual.',
      emptyUsSlice: 'Nenhum registro dos Estados Unidos presente no recorte atual.',
      clickHint: 'Clique para detalhar',
      shareOfView: 'do recorte exibido',
    },
    timeline: {
      title: 'Evolução Cronológica (2020–2027+)',
      subtitle: 'Distribuição anual dos atos normativos com coluna separada para registros sem data especificada.',
      stackByLabel: 'Empilhar por:',
      stackByStatus: 'Status Normativo',
      stackByIssuer: 'Categoria do Emissor',
      undatedLabel: 'Sem data / N/A',
      undatedShort: 'Sem data',
      totalLabel: 'Total',
      clickHint: 'Clique em uma coluna ou segmento para detalhar',
      emptySlice: 'Nenhum registro no recorte atual.',
    },
    risks: {
      title: 'Incidência de Categorias de Risco (15 Riscos + N/A)',
      subtitle: 'Contagem de registros que citam cada risco normalizado e proporção sobre o recorte analisado.',
      multiRiskNote: 'Nota: um mesmo registro pode citar múltiplos riscos simultaneamente; os percentuais não somam 100%.',
      naBarLabel: 'N/A — Nenhum risco explícito listado na fonte IAPP',
      naDividerLabel: 'Registros sem classificação explícita de risco na fonte',
      entriesOfSlice: (count, pct) => `${count} (${pct}%)`,
      clickHint: 'Clique em qualquer barra para abrir o painel de registros',
    },
    heatmap: {
      title: 'Matriz de Calor Regulatória (Jurisdição / Região × Categoria de Risco)',
      subtitle: 'Concentração cruzada dos 15 riscos normalizados e da coluna N/A. Clique em qualquer célula não nula para detalhar.',
      rowModeRegion: 'Por Região (4)',
      rowModeCountries: 'Top 15 Países + Europa',
      rowModeUsStates: 'Top 15 Estados dos EUA',
      naColumnShort: 'N/A',
      naColumnFull: 'N/A (Sem risco explícito listado)',
      totalColumn: 'Registros',
      intensityLow: '0',
      intensityHigh: 'Máx.',
      rowShareLabel: '% da linha',
      colShareLabel: '% da coluna',
      clickCellHint: 'Clique na célula para detalhar',
      emptyMatrix: 'Não há dados suficientes neste recorte para montar a matriz.',
    },
    drawer: {
      matchingRecords: (count) =>
        `${count} ${count === 1 ? 'registro correspondente' : 'registros correspondentes'}`,
      inspectInExplorer: 'Abrir no Explorador (Aba 1)',
      close: 'Fechar painel',
      recommendationsLabel: 'Recomendações',
      risksLabel: 'Riscos',
      risksNa: 'Riscos: N/A na fonte',
      sourcePage: (page) => `IAPP p. ${page}`,
    },
  },
  en: {
    caveats: {
      title: 'Methodological Notes & Sample Caveats',
      toggleHide: 'Hide notes',
      toggleShow: 'Show notes',
      usTitle: 'U.S. Jurisdictional Concentration',
      usBody: (usCount, total, nonUsCount) =>
        `${usCount} of ${total} entries (${((usCount / total) * 100).toFixed(1)}%) originate from United States federal, state, and local bar, court, and legislative bodies, whereas ${nonUsCount} entries (${((nonUsCount / total) * 100).toFixed(1)}%) cover 22 non-U.S. countries plus the supranational Europe section. Higher U.S. counts reflect denser sub-national reporting rather than an absence of global governance.`,
      naTitle: 'Unclassified Risk Entries (N/A in Source)',
      naBody: (naCount, total) =>
        `${naCount} of ${total} entries (${((naCount / total) * 100).toFixed(1)}%) have an empty risk array, corresponding to "N/A" in the original IAPP PDF "Risks identified" column (common in legislative bills and court standing orders). These records still carry substantive obligations in "Recommendations" and are explicitly shown as a distinct N/A category in risk analytics rather than omitted.`,
    },
    filters: {
      scopeAll: 'All',
      scopeNonUs: 'Non-U.S. Only',
      scopeUs: 'United States Only',
      scopeEurope: 'Europe',
      region: 'Region',
      allRegions: 'All regions',
      status: 'Normative Status',
      allStatuses: 'All statuses',
      issuer: 'Issuer Category',
      allIssuers: 'All categories',
      reset: 'Reset Filters',
    },
    kpi: {
      recordsAnalyzed: 'Records Analyzed',
      ofDataset: (pct, total) => `${pct}% of ${total} total records`,
      jurisdictionsRepresented: 'Jurisdictions Represented',
      subdivisionsSub: (subCount) => `${subCount} distinct states / subdivisions`,
      topRisk: 'Top Identified Risk',
      topRiskEntries: (count) => `${count} ${count === 1 ? 'entry cites this risk' : 'entries cite this risk'}`,
      noRisksInSlice: 'No classified risks in this slice',
      riskCoverage: 'Explicit Risk Coverage',
      riskCoverageSub: (classified, classifiedPct, naCount, naPct) =>
        `${classified} classified (${classifiedPct}%) · ${naCount} N/A (${naPct}%)`,
    },
    geo: {
      title: 'Geographic & Sub-National Distribution',
      subtitle: 'Stacked by normative status. Click any bar or segment to inspect matching records.',
      modeGlobal: 'Global Jurisdictions (23 Countries + Europe)',
      modeUs: 'U.S. Sub-National Breakdown',
      excludeUsToggle: 'Exclude U.S.',
      regionalSummaryLabel: 'Regional Summary (click to inspect)',
      federalUnspecifiedLabel: 'Federal / National (Unspecified)',
      entriesUnit: 'entries',
      emptySlice: 'No entries match the current analytics slice.',
      emptyUsSlice: 'No United States entries are present in the current analytics slice.',
      clickHint: 'Click to inspect',
      shareOfView: 'of shown view',
    },
    timeline: {
      title: 'Chronological Evolution (2020–2027+)',
      subtitle: 'Annual breakdown of normative instruments with a dedicated rightmost column for undated entries.',
      stackByLabel: 'Stack by:',
      stackByStatus: 'Normative Status',
      stackByIssuer: 'Issuer Category',
      undatedLabel: 'Undated / N/A',
      undatedShort: 'Undated',
      totalLabel: 'Total',
      clickHint: 'Click any column or segment to inspect',
      emptySlice: 'No entries in the current slice.',
    },
    risks: {
      title: 'Risk Category Incidence (15 Normalized Risks + N/A)',
      subtitle: 'Number of records citing each normalized risk category and percentage of analyzed entries.',
      multiRiskNote: 'Note: individual records may cite multiple risks simultaneously; percentages do not sum to 100%.',
      naBarLabel: 'N/A — No explicit risk listed in IAPP source',
      naDividerLabel: 'Records without explicit risk tags in the source tracker',
      entriesOfSlice: (count, pct) => `${count} (${pct}%)`,
      clickHint: 'Click any bar to inspect matching records',
    },
    heatmap: {
      title: 'Regulatory Heatmap Matrix (Jurisdiction / Region × Risk Category)',
      subtitle: 'Cross-tabulated concentration across all 15 normalized risk codes plus N/A. Click any non-zero cell to drill down.',
      rowModeRegion: 'By Region (4)',
      rowModeCountries: 'Top 15 Countries + Europe',
      rowModeUsStates: 'Top 15 U.S. States',
      naColumnShort: 'N/A',
      naColumnFull: 'N/A (No explicit risk listed)',
      totalColumn: 'Entries',
      intensityLow: '0',
      intensityHigh: 'Max',
      rowShareLabel: 'Row %',
      colShareLabel: 'Col %',
      clickCellHint: 'Click cell to inspect',
      emptyMatrix: 'No entries available in this slice to render the matrix.',
    },
    drawer: {
      matchingRecords: (count) =>
        `${count} ${count === 1 ? 'matching record' : 'matching records'}`,
      inspectInExplorer: 'Inspect in Explorer (Tab 1)',
      close: 'Close drawer',
      recommendationsLabel: 'Recommendations',
      risksLabel: 'Risks',
      risksNa: 'Risks: N/A in source',
      sourcePage: (page) => `IAPP p. ${page}`,
    },
  },
};
