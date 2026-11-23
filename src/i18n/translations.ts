import type {
  IssuerCategory,
  Language,
  ResourceStatus,
  RiskCode,
  SortOption,
} from '../types/tracker';

export const ALL_RISK_CODES: RiskCode[] = [
  'hallucinations',
  'confidentiality_leakage',
  'bias_perpetuation',
  'absence_transparency_trust',
  'diminished_human_judgment',
  'problematic_billing',
  'ip_infringement',
  'rapid_tech_change',
  'cybersecurity_risks',
  'ai_fabricated_evidence',
  'lack_data_oversight',
  'inaccurate_misleading_info',
  'ambiguous_regulatory_landscape',
  'manipulation',
  'environmental_degradation',
];

export const ALL_ISSUER_CATEGORIES: IssuerCategory[] = [
  'bar_association',
  'court_judiciary',
  'legislature',
  'government_agency',
  'international_body',
  'research_institute',
];

export const ALL_RESOURCE_STATUSES: ResourceStatus[] = [
  'active_guidance',
  'court_rule_order',
  'enacted_law',
  'pending_bill',
  'died_bill',
];

export const RISK_LABELS: Record<RiskCode, { en: string; pt: string }> = {
  hallucinations: { en: 'Hallucinations', pt: 'Alucinações' },
  confidentiality_leakage: {
    en: 'Leakage of client or confidential information',
    pt: 'Vazamento de informações confidenciais ou de clientes',
  },
  bias_perpetuation: { en: 'Bias perpetuation', pt: 'Perpetuação de vieses' },
  absence_transparency_trust: {
    en: 'Absence of transparency/trust',
    pt: 'Ausência de transparência/confiança',
  },
  diminished_human_judgment: {
    en: 'Diminished human judgment',
    pt: 'Redução do julgamento humano',
  },
  problematic_billing: {
    en: 'Problematic billing practices',
    pt: 'Práticas problemáticas de cobrança/honorários',
  },
  ip_infringement: {
    en: 'IP infringement',
    pt: 'Violação de propriedade intelectual',
  },
  rapid_tech_change: {
    en: 'Uncertainty caused by rapid technological change',
    pt: 'Incerteza causada pela rápida mudança tecnológica',
  },
  cybersecurity_risks: {
    en: 'Cybersecurity risks',
    pt: 'Riscos de cibersegurança',
  },
  ai_fabricated_evidence: {
    en: 'AI-fabricated evidence',
    pt: 'Provas fabricadas por IA',
  },
  lack_data_oversight: {
    en: 'Lack of data oversight',
    pt: 'Falta de supervisão de dados',
  },
  inaccurate_misleading_info: {
    en: 'Inaccurate or misleading information',
    pt: 'Informações imprecisas ou enganosas',
  },
  ambiguous_regulatory_landscape: {
    en: 'Ambiguous regulatory and legal landscape',
    pt: 'Cenário regulatório e jurídico ambíguo',
  },
  manipulation: { en: 'Manipulation', pt: 'Manipulação' },
  environmental_degradation: {
    en: 'Environmental degradation',
    pt: 'Degradação ambiental',
  },
};

export const RISK_SHORT_LABELS: Record<RiskCode, { en: string; pt: string }> = {
  hallucinations: { en: 'Hallucinations', pt: 'Alucinações' },
  confidentiality_leakage: { en: 'Confidentiality', pt: 'Confidencialidade' },
  bias_perpetuation: { en: 'Bias', pt: 'Vieses' },
  absence_transparency_trust: { en: 'Transparency', pt: 'Transparência' },
  diminished_human_judgment: { en: 'Human Judgment', pt: 'Julg. Humano' },
  problematic_billing: { en: 'Billing / Fees', pt: 'Honorários' },
  ip_infringement: { en: 'IP Rights', pt: 'Prop. Intelect.' },
  rapid_tech_change: { en: 'Tech Change', pt: 'Mudança Tec.' },
  cybersecurity_risks: { en: 'Cybersecurity', pt: 'Cibersegurança' },
  ai_fabricated_evidence: { en: 'AI Evidence', pt: 'Provas IA' },
  lack_data_oversight: { en: 'Data Oversight', pt: 'Sup. Dados' },
  inaccurate_misleading_info: { en: 'Inaccurate Info', pt: 'Info Imprecisa' },
  ambiguous_regulatory_landscape: { en: 'Reg. Ambiguity', pt: 'Ambig. Regul.' },
  manipulation: { en: 'Manipulation', pt: 'Manipulação' },
  environmental_degradation: { en: 'Environment', pt: 'Meio Ambiente' },
};

export const ISSUER_CATEGORY_LABELS: Record<IssuerCategory, { en: string; pt: string }> = {
  bar_association: { en: 'Bar Association', pt: 'Ordem / Associação de Advogados' },
  court_judiciary: { en: 'Court / Judiciary', pt: 'Tribunal / Judiciário' },
  legislature: { en: 'Legislature', pt: 'Poder Legislativo' },
  government_agency: { en: 'Government Agency', pt: 'Órgão Governamental' },
  international_body: {
    en: 'International / Supranational Body',
    pt: 'Organismo Internacional / Supranacional',
  },
  research_institute: { en: 'Research Institute', pt: 'Instituto de Pesquisa' },
};

export const STATUS_LABELS: Record<ResourceStatus, { en: string; pt: string }> = {
  active_guidance: { en: 'Active Guidance', pt: 'Diretriz Ativa' },
  court_rule_order: { en: 'Court Rule / Order', pt: 'Regra / Ordem Judicial' },
  enacted_law: { en: 'Enacted Law', pt: 'Lei Promulgada' },
  pending_bill: { en: 'Pending Bill', pt: 'Projeto de Lei em Tramitação' },
  died_bill: { en: 'Died / Archived Bill', pt: 'Projeto de Lei Arquivado' },
};

export const REGION_LABELS: Record<string, { en: string; pt: string }> = {
  'North America': { en: 'North America', pt: 'América do Norte' },
  Europe: { en: 'Europe', pt: 'Europa' },
  'Asia-Pacific': { en: 'Asia-Pacific', pt: 'Ásia-Pacífico' },
  'Latin America': { en: 'Latin America', pt: 'América Latina' },
};

export const SORT_LABELS: Record<SortOption, { en: string; pt: string }> = {
  country_asc: { en: 'Country (A–Z)', pt: 'País (A–Z)' },
  year_desc: { en: 'Year (Newest first)', pt: 'Ano (Mais recente)' },
  year_asc: { en: 'Year (Oldest first)', pt: 'Ano (Mais antigo)' },
  source_page_asc: { en: 'Source Page (1–43)', pt: 'Página da Fonte (1–43)' },
};

export interface UIStrings {
  appTitle: string;
  appSubtitle: string;
  exportOfflineHtml: string;
  exportingOfflineHtml: string;
  exportSuccessToast: string;
  exportErrorToast: string;
  tabs: {
    explorer: string;
    analytics: string;
    monitor: string;
  };
  kpi: {
    filteredEntries: string;
    ofTotal: string;
    jurisdictions: string;
    jurisdictionsSub: string;
    subdivisions: string;
    subdivisionsSub: string;
    legislation: string;
    legislationSub: string;
  };
  scopes: {
    all: string;
    nonUs: string;
    us: string;
    europe: string;
    legislation: string;
  };
  filters: {
    searchPlaceholder: string;
    searchAriaLabel: string;
    clearSearch: string;
    region: string;
    allRegions: string;
    country: string;
    allCountries: string;
    subdivision: string;
    allSubdivisions: string;
    issuerCategory: string;
    allIssuerCategories: string;
    status: string;
    allStatuses: string;
    risk: string;
    allRisks: string;
    naRisksOption: string;
    year: string;
    allYears: string;
    yearNotSpecified: string;
    sortBy: string;
    clearAll: string;
    activeFiltersCount: (n: number) => string;
    resultsSummary: (shown: number, total: number) => string;
    expandAll: string;
    collapseAll: string;
  };
  card: {
    sourcePage: (page: number) => string;
    machineTranslatedNotice: string;
    issuerLabel: string;
    risksHeading: string;
    risksNaInSource: string;
    recommendationsHeading: string;
    showMoreRecs: (count: number) => string;
    showLessRecs: string;
    compare: string;
    selectedForCompare: string;
    maxCompareReached: string;
    filterByRiskHint: string;
  };
  emptyState: {
    title: string;
    description: string;
    resetButton: string;
  };
  comparator: {
    dockSelected: (count: number) => string;
    dockHint: string;
    clear: string;
    compareAction: (count: number) => string;
    modalTitle: string;
    modalSubtitle: string;
    bilingualToggle: string;
    copyMarkdown: string;
    copiedToast: string;
    copyErrorToast: string;
    close: string;
    removeColumn: string;
    rowJurisdiction: string;
    rowIssuer: string;
    rowStatusDate: string;
    rowRisks: string;
    rowRecommendations: string;
    sharedRiskTag: string;
    noSubdivision: string;
    portugueseLabel: string;
    englishLabel: string;
  };
  stage2: {
    badge: string;
    title: string;
    description: string;
    datasetReadyTitle: string;
    plannedModulesTitle: string;
    modules: { title: string; detail: string }[];
    methodologyTitle: string;
    methodologyPoints: string[];
    livePreviewLabel: string;
    usShareLabel: string;
    nonUsShareLabel: string;
    naRiskShareLabel: string;
    explicitRiskShareLabel: string;
  };
  stage3: {
    badge: string;
    title: string;
    description: string;
    plannedCapabilitiesTitle: string;
    capabilities: { title: string; detail: string }[];
    storageStatusTitle: string;
    storageKeyLabel: string;
    billsBreakdownTitle: string;
    enactedCount: string;
    pendingCount: string;
    diedCount: string;
    guidanceRulesCount: string;
  };
  footer: {
    attribution: string;
    loadedRecordsLabel: string;
    dataIntegrityOk: string;
    dataIntegrityWarn: string;
  };
}

export const UI_STRINGS: Record<Language, UIStrings> = {
  pt: {
    appTitle: 'AI Legal Ethics & Responsibilities Tracker',
    appSubtitle: 'Base Comparativa IAPP (Outubro de 2026)',
    exportOfflineHtml: 'Exportar HTML Offline',
    exportingOfflineHtml: 'Gerando HTML...',
    exportSuccessToast: 'Arquivo standalone rastreador-etica-juridica-ia-offline.html gerado com sucesso.',
    exportErrorToast: 'Não foi possível gerar o arquivo HTML offline.',
    tabs: {
      explorer: 'Explorador & Comparador',
      analytics: 'Painel Analítico',
      monitor: 'Monitor Legislativo',
    },
    kpi: {
      filteredEntries: 'Registros Filtrados',
      ofTotal: 'de',
      jurisdictions: 'Jurisdições',
      jurisdictionsSub: 'Países e blocos supranacionais',
      subdivisions: 'Estados / Subdivisões',
      subdivisionsSub: 'Subdivisões distintas no recorte',
      legislation: 'Leis & Projetos',
      legislationSub: 'Promulgadas, em tramitação e arquivadas',
    },
    scopes: {
      all: 'Todos',
      nonUs: 'Não-EUA',
      us: 'Estados Unidos',
      europe: 'Europa / UE',
      legislation: 'Leis & Projetos',
    },
    filters: {
      searchPlaceholder:
        'Buscar em PT ou EN por título, órgão emissor, país, estado, risco ou recomendação...',
      searchAriaLabel: 'Busca textual completa em português e inglês',
      clearSearch: 'Limpar busca',
      region: 'Região',
      allRegions: 'Todas as regiões',
      country: 'País / Jurisdição',
      allCountries: 'Todos os países',
      subdivision: 'Estado / Subdivisão',
      allSubdivisions: 'Todas as subdivisões',
      issuerCategory: 'Categoria do Emissor',
      allIssuerCategories: 'Todas as categorias',
      status: 'Status Normativo',
      allStatuses: 'Todos os status',
      risk: 'Categoria de Risco',
      allRisks: 'Todos os riscos (inclui N/A)',
      naRisksOption: 'N/A (Nenhum risco explícito listado na fonte)',
      year: 'Ano',
      allYears: 'Todos os anos',
      yearNotSpecified: 'Não especificado',
      sortBy: 'Ordenação',
      clearAll: 'Limpar filtros',
      activeFiltersCount: (n) => `${n} ${n === 1 ? 'filtro ativo' : 'filtros ativos'}`,
      resultsSummary: (shown, total) =>
        `Exibindo ${shown} de ${total} registros normativos`,
      expandAll: 'Expandir recomendações',
      collapseAll: 'Recolher recomendações',
    },
    card: {
      sourcePage: (page) => `IAPP p. ${page}`,
      machineTranslatedNotice: '* Traduzido via Copilot/MT na fonte IAPP',
      issuerLabel: 'Emissor',
      risksHeading: 'Riscos Identificados',
      risksNaInSource: 'Riscos: N/A na fonte',
      recommendationsHeading: 'Recomendações Práticas',
      showMoreRecs: (count) =>
        `Ver mais ${count} ${count === 1 ? 'recomendação' : 'recomendações'}`,
      showLessRecs: 'Recolher recomendações',
      compare: 'Comparar',
      selectedForCompare: 'Selecionado',
      maxCompareReached: 'Limite de 3 registros para comparação simultânea',
      filterByRiskHint: 'Clique para filtrar por este risco',
    },
    emptyState: {
      title: 'Nenhum registro encontrado com os filtros atuais',
      description:
        'Tente ajustar os termos de busca ou remover alguns filtros combinados para visualizar mais jurisdições.',
      resetButton: 'Limpar todos os filtros',
    },
    comparator: {
      dockSelected: (count) => `${count}/3 selecionados para comparação`,
      dockHint: 'Selecione ao menos 2 registros para comparar lado a lado',
      clear: 'Limpar',
      compareAction: (count) => `Comparar Lado a Lado (${count}/3)`,
      modalTitle: 'Comparador Jurisdicional Lado a Lado',
      modalSubtitle:
        'Análise estruturada de escopo normativo, riscos identificados e recomendações práticas',
      bilingualToggle: 'Modo Bilíngue (PT + EN)',
      copyMarkdown: 'Copiar Comparação (Markdown)',
      copiedToast: 'Tabela comparativa em Markdown copiada para a área de transferência.',
      copyErrorToast: 'Não foi possível copiar para a área de transferência.',
      close: 'Fechar',
      removeColumn: 'Remover da comparação',
      rowJurisdiction: 'Jurisdição & Subdivisão',
      rowIssuer: 'Órgão Emissor & Categoria',
      rowStatusDate: 'Status Normativo & Data',
      rowRisks: 'Riscos Identificados',
      rowRecommendations: 'Recomendações Práticas Completas',
      sharedRiskTag: 'Comum',
      noSubdivision: 'Âmbito nacional / geral',
      portugueseLabel: 'Português (PT)',
      englishLabel: 'Inglês (EN)',
    },
    stage2: {
      badge: 'Etapa 2 · Arquitetura Preparada',
      title: 'Painel Analítico & Inteligência Regulatória',
      description:
        'Esta aba receberá na Etapa 2 visualizações interativas conectadas diretamente ao acervo compartilhado de 119 registros, permitindo análise executiva por geografia, linha do tempo (2020–2027) e frequência de riscos.',
      datasetReadyTitle: 'Resumo Estrutural da Base Compartilhada',
      plannedModulesTitle: 'Módulos Analíticos Previstos (Etapa 2)',
      modules: [
        {
          title: 'Distribuição Geográfica & Concentração Jurisdicional',
          detail:
            'Comparativo entre as 24 jurisdições (22 países, Europa/UE e Estados Unidos), com desagregação entre normas federais, estaduais e supranacionais.',
        },
        {
          title: 'Evolução Cronológica (2020–2027)',
          detail:
            'Série histórica de publicação e atualização de pareceres éticos, ordens judiciais e projetos de lei, evidenciando a aceleração regulatória em 2024–2026.',
        },
        {
          title: 'Matriz de Frequência de Riscos & Cruzamento por Emissor',
          detail:
            'Ranking dos 15 códigos normalizados de risco (ex.: alucinações, vazamento confidencial, honorários) segmentado por Ordens de Advogados, Tribunais e Legislativos.',
        },
      ],
      methodologyTitle: 'Notas Metodológicas Críticas',
      methodologyPoints: [
        'Concentração amostral nos EUA: 71 dos 119 registros (59,7%) pertencem aos Estados Unidos (nível federal e estadual), enquanto 48 registros (40,3%) cobrem 23 jurisdições fora dos EUA. Os gráficos da Etapa 2 incluirão recorte explícito EUA vs. Não-EUA para evitar distorção comparativa.',
        'Registros sem risco explícito (N/A): 51 dos 119 registros (42,9%) — majoritariamente ordens judiciais e projetos de lei — não listam códigos de risco explícitos na fonte IAPP (risks: []). A frequência de riscos indicará sempre o denominador válido (n = 68 com riscos listados vs. N = 119 total).',
        'Tradução assistida na fonte: 22 registros originalmente publicados em idiomas não ingleses trazem a sinalização de tradução assistida (isMachineTranslated: true) preservada do documento original da IAPP.',
      ],
      livePreviewLabel: 'Métricas verificadas em tempo real da base compartilhada',
      usShareLabel: 'Registros nos EUA',
      nonUsShareLabel: 'Registros Não-EUA',
      naRiskShareLabel: 'Registros com Riscos N/A',
      explicitRiskShareLabel: 'Registros com Riscos Listados',
    },
    stage3: {
      badge: 'Etapa 3 · Arquitetura Preparada',
      title: 'Monitor Legislativo & Gestão Offline de Atualizações',
      description:
        'Esta aba habilitará na Etapa 3 o acompanhamento estruturado de projetos de lei, novas diretrizes de ordens de advogados e alterações de status normativo, com persistência automática em localStorage e backup/restauração em JSON.',
      plannedCapabilitiesTitle: 'Funcionalidades Previstas (Etapa 3)',
      capabilities: [
        {
          title: 'Atualização Estruturada de Projetos de Lei & Diretrizes',
          detail:
            'Fluxo guiado para registrar mudanças de tramitação (ex.: Pending Bill → Enacted Law ou Died Bill) e adicionar novos documentos normativos preservando o esquema bilíngue PT/EN.',
        },
        {
          title: 'Persistência Offline Integrada via localStorage',
          detail:
            'Armazenamento automático na chave compartilhada ai_legal_ethics_tracker_v1, propagando atualizações instantaneamente para o Explorador (Aba 1) e para o Painel Analítico (Aba 2).',
        },
        {
          title: 'Backup, Restauração JSON & Snapshot HTML Portátil',
          detail:
            'Exportação e importação validada de arquivos JSON para auditoria e transferência entre estações corporativas, combinada ao botão Exportar HTML Offline do cabeçalho.',
        },
      ],
      storageStatusTitle: 'Estado Atual do Repositório Compartilhado',
      storageKeyLabel: 'Chave de persistência configurada',
      billsBreakdownTitle: 'Panorama Atual de Atos Normativos na Base',
      enactedCount: 'Leis Promulgadas',
      pendingCount: 'Projetos em Tramitação',
      diedCount: 'Projetos Arquivados',
      guidanceRulesCount: 'Diretrizes & Regras Judiciais',
    },
    footer: {
      attribution:
        'Fonte: IAPP AI Legal Ethics and Responsibilities Tracker (Atualizado em outubro de 2026). Ferramenta informativa de referência; não constitui aconselhamento jurídico.',
      loadedRecordsLabel: 'Registros carregados',
      dataIntegrityOk: 'Base íntegra',
      dataIntegrityWarn: 'Base modificada',
    },
  },
  en: {
    appTitle: 'AI Legal Ethics & Responsibilities Tracker',
    appSubtitle: 'IAPP Global Reference Dataset (October 2026)',
    exportOfflineHtml: 'Export Offline HTML',
    exportingOfflineHtml: 'Exporting HTML...',
    exportSuccessToast: 'Standalone file ai-legal-ethics-tracker-offline.html generated successfully.',
    exportErrorToast: 'Unable to generate the offline HTML file.',
    tabs: {
      explorer: 'Explorer & Comparator',
      analytics: 'Analytics Dashboard',
      monitor: 'Legislative Monitor',
    },
    kpi: {
      filteredEntries: 'Filtered Entries',
      ofTotal: 'of',
      jurisdictions: 'Jurisdictions',
      jurisdictionsSub: 'Countries & supranational bodies',
      subdivisions: 'States / Subdivisions',
      subdivisionsSub: 'Distinct subdivisions in view',
      legislation: 'Bills & Legislation',
      legislationSub: 'Enacted, pending & archived bills',
    },
    scopes: {
      all: 'All',
      nonUs: 'Non-US',
      us: 'United States',
      europe: 'Europe / EU',
      legislation: 'Pending & Enacted Laws',
    },
    filters: {
      searchPlaceholder:
        'Search in EN or PT across title, issuer, country, state, risk, or recommendation...',
      searchAriaLabel: 'Full-text search in English and Portuguese',
      clearSearch: 'Clear search',
      region: 'Region',
      allRegions: 'All regions',
      country: 'Country / Jurisdiction',
      allCountries: 'All countries',
      subdivision: 'State / Subdivision',
      allSubdivisions: 'All subdivisions',
      issuerCategory: 'Issuer Category',
      allIssuerCategories: 'All categories',
      status: 'Normative Status',
      allStatuses: 'All statuses',
      risk: 'Risk Category',
      allRisks: 'All risks (includes N/A)',
      naRisksOption: 'N/A (No explicit risk listed in tracker)',
      year: 'Year',
      allYears: 'All years',
      yearNotSpecified: 'Not specified',
      sortBy: 'Sort by',
      clearAll: 'Clear All Filters',
      activeFiltersCount: (n) => `${n} active ${n === 1 ? 'filter' : 'filters'}`,
      resultsSummary: (shown, total) =>
        `Showing ${shown} of ${total} normative records`,
      expandAll: 'Expand recommendations',
      collapseAll: 'Collapse recommendations',
    },
    card: {
      sourcePage: (page) => `IAPP p. ${page}`,
      machineTranslatedNotice: '* Translated via Copilot/MT in IAPP source',
      issuerLabel: 'Issuer',
      risksHeading: 'Identified Risks',
      risksNaInSource: 'Risks: N/A in source',
      recommendationsHeading: 'Practical Recommendations',
      showMoreRecs: (count) =>
        `Show ${count} more ${count === 1 ? 'recommendation' : 'recommendations'}`,
      showLessRecs: 'Collapse recommendations',
      compare: 'Compare',
      selectedForCompare: 'Selected',
      maxCompareReached: 'Maximum of 3 records can be compared side-by-side',
      filterByRiskHint: 'Click to filter by this risk',
    },
    emptyState: {
      title: 'No matching records found',
      description:
        'Try broadening your search query or clearing one or more active filters to view additional jurisdictions.',
      resetButton: 'Clear All Filters',
    },
    comparator: {
      dockSelected: (count) => `${count}/3 selected to compare`,
      dockHint: 'Select at least 2 records to compare side-by-side',
      clear: 'Clear',
      compareAction: (count) => `Compare Side-by-Side (${count}/3)`,
      modalTitle: 'Side-by-Side Jurisdictional Comparator',
      modalSubtitle:
        'Structured comparison of normative status, identified risks, and practical recommendations',
      bilingualToggle: 'Bilingual PT + EN View',
      copyMarkdown: 'Copy Comparison (Markdown)',
      copiedToast: 'Markdown comparison table copied to clipboard.',
      copyErrorToast: 'Could not copy to clipboard.',
      close: 'Close',
      removeColumn: 'Remove from comparison',
      rowJurisdiction: 'Jurisdiction & Subdivision',
      rowIssuer: 'Issuing Body & Category',
      rowStatusDate: 'Normative Status & Date',
      rowRisks: 'Identified Risks',
      rowRecommendations: 'Full Practical Recommendations',
      sharedRiskTag: 'Shared',
      noSubdivision: 'National / general scope',
      portugueseLabel: 'Portuguese (PT)',
      englishLabel: 'English (EN)',
    },
    stage2: {
      badge: 'Stage 2 · Architecture Ready',
      title: 'Analytics Dashboard & Regulatory Intelligence',
      description:
        'Stage 2 will introduce interactive geographic, chronological (2020–2027), and risk-frequency visualizations powered directly by the shared 119-entry dataset.',
      datasetReadyTitle: 'Shared Dataset Structural Snapshot',
      plannedModulesTitle: 'Planned Analytical Modules (Stage 2)',
      modules: [
        {
          title: 'Geographic Distribution & Jurisdictional Concentration',
          detail:
            'Breakdown across all 24 jurisdictions (22 countries, Europe/EU, and United States) separating federal, state/provincial, and supranational issuances.',
        },
        {
          title: 'Chronological Trend Analysis (2020–2027)',
          detail:
            'Time-series tracking of bar ethics opinions, court standing orders, and legislative bills highlighting the 2024–2026 regulatory surge.',
        },
        {
          title: 'Risk-Frequency Matrix & Issuer Cross-Tabulation',
          detail:
            'Frequency ranking across all 15 normalized risk codes segmented by Bar Associations, Courts/Judiciary, and Legislatures.',
        },
      ],
      methodologyTitle: 'Critical Methodological Notes',
      methodologyPoints: [
        'U.S. sample concentration: 71 of 119 entries (59.7%) originate from the United States (federal and state levels), while 48 entries (40.3%) cover 23 non-U.S. jurisdictions. Stage 2 charts will expose explicit U.S. vs. Non-U.S. toggles to prevent comparative skew.',
        'N/A risk entries: 51 of 119 entries (42.9%)—predominantly court orders and legislative bills—do not list explicit risk categories in the IAPP source (risks: []). Risk frequency metrics will transparently show both the valid denominator (n = 68 with listed risks) and the full corpus (N = 119).',
        'Source machine-translation flagging: 22 non-English source instruments preserve the IAPP Copilot/MT machine-translation indicator (isMachineTranslated: true) for legal verification rigor.',
      ],
      livePreviewLabel: 'Live verified metrics from the shared store',
      usShareLabel: 'United States Entries',
      nonUsShareLabel: 'Non-US Entries',
      naRiskShareLabel: 'Entries with N/A Risks',
      explicitRiskShareLabel: 'Entries with Listed Risks',
    },
    stage3: {
      badge: 'Stage 3 · Architecture Ready',
      title: 'Legislative Monitor & Offline Update Management',
      description:
        'Stage 3 will enable structured offline updates to pending bills and guidance, automatic localStorage persistence, and validated JSON backup/restore workflows.',
      plannedCapabilitiesTitle: 'Planned Capabilities (Stage 3)',
      capabilities: [
        {
          title: 'Structured Updates to Bills & Ethical Guidance',
          detail:
            'Guided workflow to log legislative status transitions (e.g., Pending Bill → Enacted Law or Died Bill) and append new bilingual PT/EN records.',
        },
        {
          title: 'Unified Offline localStorage Persistence',
          detail:
            'Automatic synchronization via the shared ai_legal_ethics_tracker_v1 key so every edit immediately updates Tab 1 (Explorer) and Tab 2 (Analytics).',
        },
        {
          title: 'JSON Backup/Restore & Portable HTML Snapshots',
          detail:
            'Schema-validated JSON import/export for team distribution across offline corporate workstations, paired with the header Export Offline HTML action.',
        },
      ],
      storageStatusTitle: 'Shared Store Synchronization Status',
      storageKeyLabel: 'Configured persistence key',
      billsBreakdownTitle: 'Current Legislative & Normative Mix',
      enactedCount: 'Enacted Laws',
      pendingCount: 'Pending Bills',
      diedCount: 'Archived / Died Bills',
      guidanceRulesCount: 'Guidance & Court Orders',
    },
    footer: {
      attribution:
        'Source: IAPP AI Legal Ethics and Responsibilities Tracker (Updated October 2026). Informational reference tool; does not constitute legal advice.',
      loadedRecordsLabel: 'Loaded records',
      dataIntegrityOk: 'Complete dataset',
      dataIntegrityWarn: 'Modified dataset',
    },
  },
};
