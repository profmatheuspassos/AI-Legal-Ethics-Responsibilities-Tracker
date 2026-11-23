/**
 * Builds the zero-dependency classic-script IIFE runtime embedded inside the
 * standalone offline HTML document.
 *
 * Guarantees:
 * - Zero ES modules (no module scripts, no static module syntax, no external scripts)
 * - Full Tab 1 (Explorer & Comparator), Tab 2 (Complete Analytics & Regulatory Heatmap),
 *   Tab 3 (Legislative Monitor), live PT | EN switcher, and 119 / 119 footer badge
 * - Executes after DOM readiness inside try { ... } catch (err) with visible diagnostic UI
 */
export const OFFLINE_EXPORT_SCRIPT = `(function() {
  'use strict';

  var ALL_RISK_CODES = [
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
    'environmental_degradation'
  ];

  var ALL_STATUSES = [
    'active_guidance',
    'court_rule_order',
    'enacted_law',
    'pending_bill',
    'died_bill'
  ];

  var ALL_ISSUERS = [
    'bar_association',
    'court_judiciary',
    'legislature',
    'government_agency',
    'international_body',
    'research_institute'
  ];

  var REGIONS = ['North America', 'Europe', 'Asia-Pacific', 'Latin America'];
  var LEGISLATION_STATUSES = ['enacted_law', 'pending_bill', 'died_bill'];
  var CANONICAL_YEARS = [2020, 2023, 2024, 2025, 2026, 2027];
  var US_FEDERAL_KEY = '__US_FEDERAL_NULL__';

  var STATUS_COLORS = {
    active_guidance: '#059669',
    court_rule_order: '#4338ca',
    enacted_law: '#0f172a',
    pending_bill: '#d97706',
    died_bill: '#e11d48'
  };

  var ISSUER_COLORS = {
    bar_association: '#3730a3',
    court_judiciary: '#0284c7',
    legislature: '#d97706',
    government_agency: '#059669',
    international_body: '#7c3aed',
    research_institute: '#64748b'
  };

  var RISK_LABELS = {
    hallucinations: { en: 'Hallucinations', pt: 'Alucina\\u00e7\\u00f5es' },
    confidentiality_leakage: { en: 'Leakage of client or confidential information', pt: 'Vazamento de informa\\u00e7\\u00f5es confidenciais ou de clientes' },
    bias_perpetuation: { en: 'Bias perpetuation', pt: 'Perpetua\\u00e7\\u00e3o de vieses' },
    absence_transparency_trust: { en: 'Absence of transparency/trust', pt: 'Aus\\u00eancia de transpar\\u00eancia/confian\\u00e7a' },
    diminished_human_judgment: { en: 'Diminished human judgment', pt: 'Redu\\u00e7\\u00e3o do julgamento humano' },
    problematic_billing: { en: 'Problematic billing practices', pt: 'Pr\\u00e1ticas problem\\u00e1ticas de cobran\\u00e7a/honor\\u00e1rios' },
    ip_infringement: { en: 'IP infringement', pt: 'Viola\\u00e7\\u00e3o de propriedade intelectual' },
    rapid_tech_change: { en: 'Uncertainty caused by rapid technological change', pt: 'Incerteza causada pela r\\u00e1pida mudan\\u00e7a tecnol\\u00f3gica' },
    cybersecurity_risks: { en: 'Cybersecurity risks', pt: 'Riscos de ciberseguran\\u00e7a' },
    ai_fabricated_evidence: { en: 'AI-fabricated evidence', pt: 'Provas fabricadas por IA' },
    lack_data_oversight: { en: 'Lack of data oversight', pt: 'Falta de supervis\\u00e3o de dados' },
    inaccurate_misleading_info: { en: 'Inaccurate or misleading information', pt: 'Informa\\u00e7\\u00f5es imprecisas ou enganosas' },
    ambiguous_regulatory_landscape: { en: 'Ambiguous regulatory and legal landscape', pt: 'Cen\\u00e1rio regulat\\u00f3rio e jur\\u00eddico amb\\u00edguo' },
    manipulation: { en: 'Manipulation', pt: 'Manipula\\u00e7\\u00e3o' },
    environmental_degradation: { en: 'Environmental degradation', pt: 'Degrada\\u00e7\\u00e3o ambiental' }
  };

  var RISK_SHORT = {
    hallucinations: { en: 'Hallucinations', pt: 'Alucina\\u00e7\\u00f5es' },
    confidentiality_leakage: { en: 'Confidentiality', pt: 'Confidencialidade' },
    bias_perpetuation: { en: 'Bias', pt: 'Vieses' },
    absence_transparency_trust: { en: 'Transparency', pt: 'Transpar\\u00eancia' },
    diminished_human_judgment: { en: 'Human Judgment', pt: 'Julg. Humano' },
    problematic_billing: { en: 'Billing / Fees', pt: 'Honor\\u00e1rios' },
    ip_infringement: { en: 'IP Rights', pt: 'Prop. Intelect.' },
    rapid_tech_change: { en: 'Tech Change', pt: 'Mudan\\u00e7a Tec.' },
    cybersecurity_risks: { en: 'Cybersecurity', pt: 'Ciberseguran\\u00e7a' },
    ai_fabricated_evidence: { en: 'AI Evidence', pt: 'Provas IA' },
    lack_data_oversight: { en: 'Data Oversight', pt: 'Sup. Dados' },
    inaccurate_misleading_info: { en: 'Inaccurate Info', pt: 'Info Imprecisa' },
    ambiguous_regulatory_landscape: { en: 'Reg. Ambiguity', pt: 'Ambig. Regul.' },
    manipulation: { en: 'Manipulation', pt: 'Manipula\\u00e7\\u00e3o' },
    environmental_degradation: { en: 'Environment', pt: 'Meio Ambiente' }
  };

  var STATUS_LABELS = {
    active_guidance: { en: 'Active Guidance', pt: 'Diretriz Ativa' },
    court_rule_order: { en: 'Court Rule / Order', pt: 'Regra / Ordem Judicial' },
    enacted_law: { en: 'Enacted Law', pt: 'Lei Promulgada' },
    pending_bill: { en: 'Pending Bill', pt: 'Projeto de Lei em Tramita\\u00e7\\u00e3o' },
    died_bill: { en: 'Died / Archived Bill', pt: 'Projeto de Lei Arquivado' }
  };

  var ISSUER_LABELS = {
    bar_association: { en: 'Bar Association', pt: 'Ordem / Associa\\u00e7\\u00e3o de Advogados' },
    court_judiciary: { en: 'Court / Judiciary', pt: 'Tribunal / Judici\\u00e1rio' },
    legislature: { en: 'Legislature', pt: 'Poder Legislativo' },
    government_agency: { en: 'Government Agency', pt: '\\u00d3rg\\u00e3o Governamental' },
    international_body: { en: 'International / Supranational Body', pt: 'Organismo Internacional / Supranacional' },
    research_institute: { en: 'Research Institute', pt: 'Instituto de Pesquisa' }
  };

  var REGION_LABELS = {
    'North America': { en: 'North America', pt: 'Am\\u00e9rica do Norte' },
    'Europe': { en: 'Europe', pt: 'Europa' },
    'Asia-Pacific': { en: 'Asia-Pacific', pt: '\\u00c1sia-Pac\\u00edfico' },
    'Latin America': { en: 'Latin America', pt: 'Am\\u00e9rica Latina' }
  };

  var SORT_LABELS = {
    country_asc: { en: 'Country (A-Z)', pt: 'Pa\\u00eds (A-Z)' },
    year_desc: { en: 'Year (Newest first)', pt: 'Ano (Mais recente)' },
    year_asc: { en: 'Year (Oldest first)', pt: 'Ano (Mais antigo)' },
    source_page_asc: { en: 'Source Page (1-43)', pt: 'P\\u00e1gina da Fonte (1-43)' }
  };

  var I18N = {
    pt: {
      appTitle: 'AI Legal Ethics & Responsibilities Tracker',
      appSub: 'Base Comparativa IAPP (Outubro de 2026)',
      offlineBadge: 'Vers\\u00e3o Standalone Offline',
      tabs: {
        explorer: 'Explorador & Comparador',
        analytics: 'Painel Anal\\u00edtico',
        monitor: 'Monitor Legislativo'
      },
      kpi: {
        filtered: 'Registros Filtrados',
        ofTotal: 'de',
        jurisdictions: 'Jurisdi\\u00e7\\u00f5es',
        jurisdictionsSub: 'Pa\\u00edses e blocos supranacionais',
        subdivisions: 'Estados / Subdivis\\u00f5es',
        subdivisionsSub: 'Subdivis\\u00f5es distintas no recorte',
        legislation: 'Leis & Projetos',
        legislationSub: 'Promulgadas, em tramita\\u00e7\\u00e3o e arquivadas'
      },
      scopes: {
        all: 'Todos',
        non_us: 'N\\u00e3o-EUA',
        us: 'Estados Unidos',
        europe: 'Europa / UE',
        legislation: 'Leis & Projetos'
      },
      filters: {
        searchPlaceholder: 'Buscar em PT ou EN por t\\u00edtulo, \\u00f3rg\\u00e3o emissor, pa\\u00eds, estado, risco ou recomenda\\u00e7\\u00e3o...',
        region: 'Regi\\u00e3o',
        allRegions: 'Todas as regi\\u00f5es',
        country: 'Pa\\u00eds / Jurisdi\\u00e7\\u00e3o',
        allCountries: 'Todos os pa\\u00edses',
        subdivision: 'Estado / Subdivis\\u00e3o',
        allSubdivisions: 'Todas as subdivis\\u00f5es',
        issuer: 'Categoria do Emissor',
        allIssuers: 'Todas as categorias',
        status: 'Status Normativo',
        allStatuses: 'Todos os status',
        risk: 'Categoria de Risco',
        allRisks: 'Todos os riscos (inclui N/A)',
        naRisk: 'N/A (Nenhum risco expl\\u00edcito listado na fonte)',
        year: 'Ano',
        allYears: 'Todos os anos',
        yearUnspecified: 'N\\u00e3o especificado',
        sortBy: 'Ordena\\u00e7\\u00e3o',
        clearAll: 'Limpar filtros',
        expandAll: 'Expandir recomenda\\u00e7\\u00f5es',
        collapseAll: 'Recolher recomenda\\u00e7\\u00f5es',
        showing: function(a, b) { return 'Exibindo ' + a + ' de ' + b + ' registros normativos'; },
        activeFilters: function(n) { return n + (n === 1 ? ' filtro ativo' : ' filtros ativos'); }
      },
      card: {
        sourcePage: function(p) { return 'IAPP p. ' + p; },
        mtNotice: '* Traduzido via Copilot/MT na fonte IAPP',
        issuerLabel: 'Emissor',
        risksHeading: 'Riscos Identificados',
        risksNa: 'Riscos: N/A na fonte',
        recsHeading: 'Recomenda\\u00e7\\u00f5es Pr\\u00e1ticas',
        showMore: function(n) { return 'Ver mais ' + n + (n === 1 ? ' recomenda\\u00e7\\u00e3o' : ' recomenda\\u00e7\\u00f5es'); },
        showLess: 'Recolher recomenda\\u00e7\\u00f5es',
        compare: 'Comparar',
        selected: 'Selecionado',
        filterRiskHint: 'Clique para filtrar por este risco',
        emptyTitle: 'Nenhum registro encontrado com os filtros atuais',
        emptyDesc: 'Ajuste os termos de busca ou limpe os filtros para visualizar mais jurisdi\\u00e7\\u00f5es.'
      },
      comparator: {
        dockCount: function(n) { return n + '/3 selecionados para compara\\u00e7\\u00e3o'; },
        dockHint: 'Selecione ao menos 2 registros para comparar lado a lado',
        clear: 'Limpar',
        openBtn: function(n) { return 'Comparar Lado a Lado (' + n + '/3)'; },
        title: 'Comparador Jurisdicional Lado a Lado',
        subtitle: 'An\\u00e1lise estruturada de escopo normativo, riscos identificados e recomenda\\u00e7\\u00f5es pr\\u00e1ticas',
        bilingual: 'Modo Bil\\u00edngue (PT + EN)',
        copyMd: 'Copiar Compara\\u00e7\\u00e3o (Markdown)',
        copiedToast: 'Tabela comparativa em Markdown copiada para a \\u00e1rea de transfer\\u00eancia.',
        copyErrToast: 'N\\u00e3o foi poss\\u00edvel copiar automaticamente.',
        close: 'Fechar',
        remove: 'Remover',
        rowJurisdiction: 'Jurisdi\\u00e7\\u00e3o & Subdivis\\u00e3o',
        rowIssuer: '\\u00d3rg\\u00e3o Emissor & Categoria',
        rowStatusDate: 'Status Normativo & Data',
        rowRisks: 'Riscos Identificados',
        rowRecs: 'Recomenda\\u00e7\\u00f5es Pr\\u00e1ticas Completas',
        shared: 'Comum',
        noSub: '\\u00c2mbito nacional / geral',
        dimension: 'Dimens\\u00e3o'
      },
      analytics: {
        caveatsTitle: 'Notas Metodol\\u00f3gicas & Limita\\u00e7\\u00f5es da Amostra',
        hideNotes: 'Ocultar notas',
        showNotes: 'Exibir notas',
        usTitle: 'Concentra\\u00e7\\u00e3o Jurisdicional nos EUA',
        usBody: function(us, total, nonUs) {
          return us + ' dos ' + total + ' registros (' + ((us / total) * 100).toFixed(1) + '%) t\\u00eam origem em \\u00f3rg\\u00e3os federais, estaduais e locais dos Estados Unidos (ordens de advogados, tribunais e legislativos), enquanto ' + nonUs + ' registros (' + ((nonUs / total) * 100).toFixed(1) + '%) abrangem 22 pa\\u00edses fora dos EUA mais a se\\u00e7\\u00e3o supranacional Europa. Volumes maiores nos EUA refletem maior granularidade de reporte subnacional, e n\\u00e3o aus\\u00eancia de governan\\u00e7a global.';
        },
        naTitle: 'Registros sem Risco Classificado (N/A na Fonte)',
        naBody: function(na, total) {
          return na + ' dos ' + total + ' registros (' + ((na / total) * 100).toFixed(1) + '%) possuem lista de riscos vazia, correspondendo a "N/A" na coluna "Risks identified" do PDF original da IAPP (comum em projetos de lei e ordens judiciais). Esses registros ainda trazem obriga\\u00e7\\u00f5es substantivas em "Recomenda\\u00e7\\u00f5es" e s\\u00e3o exibidos explicitamente como categoria N/A distinta nas an\\u00e1lises de risco, sem omiss\\u00e3o.';
        },
        scopeAll: 'Todos',
        scopeNonUs: 'Apenas N\\u00e3o-EUA',
        scopeUs: 'Apenas EUA',
        scopeEurope: 'Europa',
        reset: 'Limpar filtros',
        kpiAnalyzed: 'Registros Analisados',
        kpiOfDataset: function(pct, total) { return pct + '% da base total (' + total + ')'; },
        kpiJurisdictions: 'Jurisdi\\u00e7\\u00f5es Representadas',
        kpiSubdivisions: function(n) { return n + ' estados / subdivis\\u00f5es distintas'; },
        kpiTopRisk: 'Principal Risco Identificado',
        kpiTopRiskSub: function(n) { return n + (n === 1 ? ' registro cita este risco' : ' registros citam este risco'); },
        kpiNoRisk: 'Nenhum risco classificado neste recorte',
        kpiCoverage: 'Cobertura de Riscos Expl\\u00edcitos',
        kpiCoverageSub: function(c, cp, na, nap) { return c + ' classificados (' + cp + '%) \\u00b7 ' + na + ' N/A (' + nap + '%)'; },
        geoTitle: 'Distribui\\u00e7\\u00e3o Geogr\\u00e1fica & Subnacional',
        geoSub: 'Empilhado por status normativo. Clique em qualquer barra ou segmento para detalhar os registros.',
        geoGlobal: 'Jurisdi\\u00e7\\u00f5es Globais (23 Pa\\u00edses + Europa)',
        geoUs: 'Detalhamento Subnacional dos EUA',
        excludeUs: 'Excluir EUA',
        regionalLabel: 'Resumo por Regi\\u00e3o (clique para inspecionar)',
        federalLabel: 'Federal / Nacional (N\\u00e3o especificado)',
        entriesUnit: 'registros',
        emptySlice: 'Nenhum registro corresponde ao recorte anal\\u00edtico atual.',
        emptyUsSlice: 'Nenhum registro dos Estados Unidos presente no recorte atual.',
        timeTitle: 'Evolu\\u00e7\\u00e3o Cronol\\u00f3gica (2020-2027+)',
        timeSub: 'Distribui\\u00e7\\u00e3o anual dos atos normativos com coluna separada para registros sem data especificada.',
        stackBy: 'Empilhar por:',
        stackStatus: 'Status Normativo',
        stackIssuer: 'Categoria do Emissor',
        undatedLabel: 'Sem data / N/A',
        undatedShort: 'Sem data',
        totalLabel: 'Total',
        risksTitle: 'Incid\\u00eancia de Categorias de Risco (15 Riscos + N/A)',
        risksSub: 'Contagem de registros que citam cada risco normalizado e propor\\u00e7\\u00e3o sobre o recorte analisado.',
        multiRiskNote: 'Nota: um mesmo registro pode citar m\\u00faltiplos riscos simultaneamente; os percentuais n\\u00e3o somam 100%.',
        naBarLabel: 'N/A \\u2014 Nenhum risco expl\\u00edcito listado na fonte IAPP',
        naDivider: 'Registros sem classifica\\u00e7\\u00e3o expl\\u00edcita de risco na fonte',
        hmTitle: 'Matriz de Calor Regulat\\u00f3ria (Jurisdi\\u00e7\\u00e3o / Regi\\u00e3o \\u00d7 Categoria de Risco)',
        hmSub: 'Concentra\\u00e7\\u00e3o cruzada dos 15 riscos normalizados e da coluna N/A. Clique em qualquer c\\u00e9lula n\\u00e3o nula para detalhar.',
        hmRegion: 'Por Regi\\u00e3o (4)',
        hmCountries: 'Top 15 Pa\\u00edses + Europa',
        hmUsStates: 'Top 15 Estados dos EUA',
        hmNaShort: 'N/A',
        hmNaFull: 'N/A (Sem risco expl\\u00edcito listado)',
        hmTotalCol: 'Registros',
        hmRowPct: '% da linha',
        hmColPct: '% da coluna',
        hmClickHint: 'Clique na c\\u00e9lula para detalhar',
        hmEmpty: 'N\\u00e3o h\\u00e1 dados suficientes neste recorte para montar a matriz.',
        drawerCount: function(n) { return n + (n === 1 ? ' registro correspondente' : ' registros correspondentes'); },
        inspectInExplorer: 'Abrir no Explorador (Aba 1)',
        closeDrawer: 'Fechar'
      },
      stage3: {
        kpiTotal: 'Registros Ativos',
        kpiTotalSub: function(base, custom) { return custom > 0 ? (base + ' base IAPP + ' + custom + ' customizados') : (base + ' base IAPP Out/2026 \\u00edntegra'); },
        kpiPending: 'Projetos em Tramita\\u00e7\\u00e3o',
        kpiPendingSub: 'Status pending_bill aguardando desfecho',
        kpiBinding: 'Leis & Regras Judiciais',
        kpiBindingSub: 'Leis promulgadas + ordens/regras de tribunais',
        kpiMods: 'Altera\\u00e7\\u00f5es Locais',
        kpiModsSub: function(m, a) { return m + ' editados \\u00b7 ' + a + ' adicionados localmente'; },
        toolbarTitle: 'Governan\\u00e7a de Dados & Portabilidade Offline',
        toolbarSub: 'Todas as edi\\u00e7\\u00f5es s\\u00e3o salvas em localStorage e sincronizadas imediatamente nas Abas 1 e 2.',
        addNew: '+ Nova Norma / Registro',
        exportJson: 'Exportar Base JSON',
        importJson: 'Importar JSON',
        resetBaseline: 'Restaurar Base Original (119)',
        exportToast: 'Backup JSON exportado com sucesso.',
        resetToast: 'Base restaurada para os 119 registros originais IAPP (Out/2026).',
        importToast: function(a, u) { return 'Backup aplicado: ' + a + ' adicionados, ' + u + ' atualizados.'; },
        wlTitle: 'Watchlist Legislativo & Atualizador R\\u00e1pido',
        wlSub: 'Acompanhe projetos de lei em tramita\\u00e7\\u00e3o e atualize status, datas, riscos ou recomenda\\u00e7\\u00f5es.',
        wlPending: 'Projetos Pendentes',
        wlBills: 'Todos os Projetos & Leis',
        wlAll: 'Todos os Registros',
        wlSearch: 'Filtrar watchlist por t\\u00edtulo, estado, pa\\u00eds ou \\u00f3rg\\u00e3o emissor...',
        wlEdit: 'Atualizar Status / Editar',
        wlModTag: 'Editado localmente',
        wlCustomTag: 'Adicionado localmente',
        wlEmpty: 'Nenhum registro corresponde ao filtro da watchlist.',
        wlPostTracker: 'P\\u00f3s-tracker (local)',
        offlineTitle: 'Assistente de Verifica\\u00e7\\u00e3o Legislativa (Gemini + Google Search)',
        offlineBody: 'Modo Offline Ativo: A verifica\\u00e7\\u00e3o web via Gemini est\\u00e1 desativada; utilize o editor manual e o backup JSON normalmente.',
        edCreate: 'Nova Norma / Registro Bil\\u00edngue',
        edEdit: 'Editar Registro Normativo',
        edSub: 'Preencha os campos obrigat\\u00f3rios em Portugu\\u00eas e Ingl\\u00eas para manter a paridade bil\\u00edngue.',
        edSecJur: '1. Jurisdi\\u00e7\\u00e3o',
        edCountryEn: 'Pa\\u00eds / Jurisdi\\u00e7\\u00e3o (EN) *',
        edCountryPt: 'Pa\\u00eds / Jurisdi\\u00e7\\u00e3o (PT) *',
        edCode: 'C\\u00f3digo ISO (ex: US, BR, EU) *',
        edRegion: 'Regi\\u00e3o *',
        edSubEn: 'Estado / Subdivis\\u00e3o (EN)',
        edSubPt: 'Estado / Subdivis\\u00e3o (PT)',
        edSecIss: '2. \\u00d3rg\\u00e3o Emissor',
        edIssEn: 'Nome do Emissor (EN) *',
        edIssPt: 'Nome do Emissor (PT) *',
        edIssCat: 'Categoria do Emissor *',
        edSecRes: '3. Metadados do Ato Normativo',
        edTitleEn: 'T\\u00edtulo do Recurso / Norma (EN) *',
        edTitlePt: 'T\\u00edtulo do Recurso / Norma (PT) *',
        edDateEn: 'Data de Exibi\\u00e7\\u00e3o (EN)',
        edDatePt: 'Data de Exibi\\u00e7\\u00e3o (PT)',
        edYear: 'Ano (vazio = Sem data)',
        edStatus: 'Status Normativo *',
        edPage: 'P\\u00e1gina IAPP (0 = adi\\u00e7\\u00e3o p\\u00f3s-tracker)',
        edMt: 'Sinalizar tradu\\u00e7\\u00e3o assistida (Copilot/MT)',
        edSecRisks: '4. Riscos Identificados (marque os aplic\\u00e1veis ou deixe vazio para N/A)',
        edSecRecs: '5. Recomenda\\u00e7\\u00f5es Pr\\u00e1ticas (PT e EN em paralelo)',
        edRecPtPh: 'Recomenda\\u00e7\\u00e3o em portugu\\u00eas (PT)...',
        edRecEnPh: 'Recomenda\\u00e7\\u00e3o em ingl\\u00eas (EN)...',
        edAddRec: '+ Adicionar recomenda\\u00e7\\u00e3o',
        edCancel: 'Cancelar',
        edSave: 'Salvar Altera\\u00e7\\u00e3o',
        edErrReq: 'Preencha os campos obrigat\\u00f3rios: Pa\\u00eds (EN e PT), C\\u00f3digo ISO, Emissor (EN e PT) e T\\u00edtulo (EN e PT).',
        edCreatedToast: 'Novo registro adicionado e sincronizado com as Abas 1 e 2.',
        edUpdatedToast: 'Registro atualizado e sincronizado com as Abas 1 e 2.',
        auditTitle: 'Hist\\u00f3rico de Atualiza\\u00e7\\u00f5es Locais',
        auditSub: 'Registro audit\\u00e1vel de adi\\u00e7\\u00f5es, edi\\u00e7\\u00f5es, importa\\u00e7\\u00f5es JSON e restaura\\u00e7\\u00f5es locais.',
        auditShow: 'Exibir hist\\u00f3rico',
        auditHide: 'Ocultar hist\\u00f3rico',
        auditEmpty: 'Nenhuma altera\\u00e7\\u00e3o local registrada at\\u00e9 o momento.',
        colTime: 'Data / Hora',
        colAction: 'A\\u00e7\\u00e3o',
        colJur: 'Jurisdi\\u00e7\\u00e3o',
        colRec: 'Registro',
        colSum: 'Resumo da Altera\\u00e7\\u00e3o',
        actions: { created: 'Criado', updated: 'Atualizado', imported: 'Importado', reset: 'Restaurado' },
        impTitle: 'Confirmar Importa\\u00e7\\u00e3o de Backup JSON',
        impSum: function(tot, a, u, un) { return 'O arquivo validado cont\\u00e9m ' + tot + ' registros: ' + a + ' novos, ' + u + ' atualizados e ' + un + ' inalterados.'; },
        impConfirm: 'Aplicar Backup JSON',
        impErrJson: 'JSON inv\\u00e1lido ou estrutura incompat\\u00edvel com o esquema TrackerEntry (PT/EN).',
        resTitle: 'Restaurar Base Original (119 registros)?',
        resBody: 'Esta a\\u00e7\\u00e3o remover\\u00e1 todas as edi\\u00e7\\u00f5es e adi\\u00e7\\u00f5es locais e restaurar\\u00e1 integralmente os 119 registros originais IAPP (Outubro de 2026).',
        resConfirm: 'Sim, Restaurar 119 Originais'
      },
      footer: {
        attr: 'Fonte: IAPP AI Legal Ethics and Responsibilities Tracker (Atualizado em outubro de 2026). Ferramenta informativa de refer\\u00eancia; n\\u00e3o constitui aconselhamento jur\\u00eddico.',
        loaded: 'Registros carregados'
      }
    },
    en: {
      appTitle: 'AI Legal Ethics & Responsibilities Tracker',
      appSub: 'IAPP Global Reference Dataset (October 2026)',
      offlineBadge: 'Standalone Offline Export',
      tabs: {
        explorer: 'Explorer & Comparator',
        analytics: 'Analytics Dashboard',
        monitor: 'Legislative Monitor'
      },
      kpi: {
        filtered: 'Filtered Entries',
        ofTotal: 'of',
        jurisdictions: 'Jurisdictions',
        jurisdictionsSub: 'Countries & supranational bodies',
        subdivisions: 'States / Subdivisions',
        subdivisionsSub: 'Distinct subdivisions in view',
        legislation: 'Bills & Legislation',
        legislationSub: 'Enacted, pending & archived bills'
      },
      scopes: {
        all: 'All',
        non_us: 'Non-US',
        us: 'United States',
        europe: 'Europe / EU',
        legislation: 'Pending & Enacted Laws'
      },
      filters: {
        searchPlaceholder: 'Search in EN or PT across title, issuer, country, state, risk, or recommendation...',
        region: 'Region',
        allRegions: 'All regions',
        country: 'Country / Jurisdiction',
        allCountries: 'All countries',
        subdivision: 'State / Subdivision',
        allSubdivisions: 'All subdivisions',
        issuer: 'Issuer Category',
        allIssuers: 'All categories',
        status: 'Normative Status',
        allStatuses: 'All statuses',
        risk: 'Risk Category',
        allRisks: 'All risks (includes N/A)',
        naRisk: 'N/A (No explicit risk listed in tracker)',
        year: 'Year',
        allYears: 'All years',
        yearUnspecified: 'Not specified',
        sortBy: 'Sort by',
        clearAll: 'Clear All Filters',
        expandAll: 'Expand recommendations',
        collapseAll: 'Collapse recommendations',
        showing: function(a, b) { return 'Showing ' + a + ' of ' + b + ' normative records'; },
        activeFilters: function(n) { return n + ' active ' + (n === 1 ? 'filter' : 'filters'); }
      },
      card: {
        sourcePage: function(p) { return 'IAPP p. ' + p; },
        mtNotice: '* Translated via Copilot/MT in IAPP source',
        issuerLabel: 'Issuer',
        risksHeading: 'Identified Risks',
        risksNa: 'Risks: N/A in source',
        recsHeading: 'Practical Recommendations',
        showMore: function(n) { return 'Show ' + n + ' more ' + (n === 1 ? 'recommendation' : 'recommendations'); },
        showLess: 'Collapse recommendations',
        compare: 'Compare',
        selected: 'Selected',
        filterRiskHint: 'Click to filter by this risk',
        emptyTitle: 'No matching records found',
        emptyDesc: 'Try broadening your search query or clearing one or more active filters.'
      },
      comparator: {
        dockCount: function(n) { return n + '/3 selected to compare'; },
        dockHint: 'Select at least 2 records to compare side-by-side',
        clear: 'Clear',
        openBtn: function(n) { return 'Compare Side-by-Side (' + n + '/3)'; },
        title: 'Side-by-Side Jurisdictional Comparator',
        subtitle: 'Structured comparison of normative status, identified risks, and practical recommendations',
        bilingual: 'Bilingual PT + EN View',
        copyMd: 'Copy Comparison (Markdown)',
        copiedToast: 'Markdown comparison table copied to clipboard.',
        copyErrToast: 'Could not copy automatically.',
        close: 'Close',
        remove: 'Remove',
        rowJurisdiction: 'Jurisdiction & Subdivision',
        rowIssuer: 'Issuing Body & Category',
        rowStatusDate: 'Normative Status & Date',
        rowRisks: 'Identified Risks',
        rowRecs: 'Full Practical Recommendations',
        shared: 'Shared',
        noSub: 'National / general scope',
        dimension: 'Dimension'
      },
      analytics: {
        caveatsTitle: 'Methodological Notes & Sample Caveats',
        hideNotes: 'Hide notes',
        showNotes: 'Show notes',
        usTitle: 'U.S. Jurisdictional Concentration',
        usBody: function(us, total, nonUs) {
          return us + ' of ' + total + ' entries (' + ((us / total) * 100).toFixed(1) + '%) originate from United States federal, state, and local bar, court, and legislative bodies, whereas ' + nonUs + ' entries (' + ((nonUs / total) * 100).toFixed(1) + '%) cover 22 non-U.S. countries plus the supranational Europe section. Higher U.S. counts reflect denser sub-national reporting rather than an absence of global governance.';
        },
        naTitle: 'Unclassified Risk Entries (N/A in Source)',
        naBody: function(na, total) {
          return na + ' of ' + total + ' entries (' + ((na / total) * 100).toFixed(1) + '%) have an empty risk array, corresponding to "N/A" in the original IAPP PDF "Risks identified" column (common in legislative bills and court standing orders). These records still carry substantive obligations in "Recommendations" and are explicitly shown as a distinct N/A category in risk analytics rather than omitted.';
        },
        scopeAll: 'All',
        scopeNonUs: 'Non-U.S. Only',
        scopeUs: 'United States Only',
        scopeEurope: 'Europe',
        reset: 'Reset Filters',
        kpiAnalyzed: 'Records Analyzed',
        kpiOfDataset: function(pct, total) { return pct + '% of ' + total + ' total records'; },
        kpiJurisdictions: 'Jurisdictions Represented',
        kpiSubdivisions: function(n) { return n + ' distinct states / subdivisions'; },
        kpiTopRisk: 'Top Identified Risk',
        kpiTopRiskSub: function(n) { return n + (n === 1 ? ' entry cites this risk' : ' entries cite this risk'); },
        kpiNoRisk: 'No classified risks in this slice',
        kpiCoverage: 'Explicit Risk Coverage',
        kpiCoverageSub: function(c, cp, na, nap) { return c + ' classified (' + cp + '%) \\u00b7 ' + na + ' N/A (' + nap + '%)'; },
        geoTitle: 'Geographic & Sub-National Distribution',
        geoSub: 'Stacked by normative status. Click any bar or segment to inspect matching records.',
        geoGlobal: 'Global Jurisdictions (23 Countries + Europe)',
        geoUs: 'U.S. Sub-National Breakdown',
        excludeUs: 'Exclude U.S.',
        regionalLabel: 'Regional Summary (click to inspect)',
        federalLabel: 'Federal / National (Unspecified)',
        entriesUnit: 'entries',
        emptySlice: 'No entries match the current analytics slice.',
        emptyUsSlice: 'No United States entries are present in the current analytics slice.',
        timeTitle: 'Chronological Evolution (2020-2027+)',
        timeSub: 'Annual breakdown of normative instruments with a dedicated rightmost column for undated entries.',
        stackBy: 'Stack by:',
        stackStatus: 'Normative Status',
        stackIssuer: 'Issuer Category',
        undatedLabel: 'Undated / N/A',
        undatedShort: 'Undated',
        totalLabel: 'Total',
        risksTitle: 'Risk Category Incidence (15 Normalized Risks + N/A)',
        risksSub: 'Number of records citing each normalized risk category and percentage of analyzed entries.',
        multiRiskNote: 'Note: individual records may cite multiple risks simultaneously; percentages do not sum to 100%.',
        naBarLabel: 'N/A \\u2014 No explicit risk listed in IAPP source',
        naDivider: 'Records without explicit risk tags in the source tracker',
        hmTitle: 'Regulatory Heatmap Matrix (Jurisdiction / Region \\u00d7 Risk Category)',
        hmSub: 'Cross-tabulated concentration across all 15 normalized risk codes plus N/A. Click any non-zero cell to drill down.',
        hmRegion: 'By Region (4)',
        hmCountries: 'Top 15 Countries + Europe',
        hmUsStates: 'Top 15 U.S. States',
        hmNaShort: 'N/A',
        hmNaFull: 'N/A (No explicit risk listed)',
        hmTotalCol: 'Entries',
        hmRowPct: 'Row %',
        hmColPct: 'Col %',
        hmClickHint: 'Click cell to inspect',
        hmEmpty: 'No entries available in this slice to render the matrix.',
        drawerCount: function(n) { return n + (n === 1 ? ' matching record' : ' matching records'); },
        inspectInExplorer: 'Inspect in Explorer (Tab 1)',
        closeDrawer: 'Close'
      },
      stage3: {
        kpiTotal: 'Total Active Records',
        kpiTotalSub: function(base, custom) { return custom > 0 ? (base + ' IAPP base + ' + custom + ' custom') : (base + ' IAPP Oct 2026 baseline intact'); },
        kpiPending: 'Pending Bills Tracked',
        kpiPendingSub: 'Active pending_bill records awaiting outcome',
        kpiBinding: 'Enacted Laws & Court Rules',
        kpiBindingSub: 'Enacted statutes + judicial standing orders',
        kpiMods: 'Local Modifications',
        kpiModsSub: function(m, a) { return m + ' edited \\u00b7 ' + a + ' added locally'; },
        toolbarTitle: 'Data Governance & Offline Portability',
        toolbarSub: 'All edits persist automatically in localStorage and sync live across Tabs 1 and 2.',
        addNew: '+ Add New Norm / Record',
        exportJson: 'Export JSON Backup',
        importJson: 'Import JSON Backup',
        resetBaseline: 'Reset to 119 Baseline',
        exportToast: 'JSON backup exported successfully.',
        resetToast: 'Dataset restored to the original 119 IAPP (Oct 2026) baseline.',
        importToast: function(a, u) { return 'Backup imported: ' + a + ' added, ' + u + ' updated.'; },
        wlTitle: 'Legislative Watchlist & Quick Status Updater',
        wlSub: 'Track pending legislative bills and update status, dates, risks, or practical recommendations.',
        wlPending: 'Pending Bills',
        wlBills: 'All Bills (Pending, Enacted, Died)',
        wlAll: 'All Records',
        wlSearch: 'Filter watchlist by title, state, country, or issuer...',
        wlEdit: 'Update Status / Edit',
        wlModTag: 'Edited locally',
        wlCustomTag: 'Added locally',
        wlEmpty: 'No watchlist records match your current filter.',
        wlPostTracker: 'Post-tracker (local)',
        offlineTitle: 'Legislative Verification Assistant (Gemini + Google Search)',
        offlineBody: 'Offline Mode Active: Web verification via Gemini is disabled; use the manual editor and JSON backup normally.',
        edCreate: 'Add New Bilingual Normative Record',
        edEdit: 'Edit Normative Record',
        edSub: 'Provide required fields in both English and Portuguese to maintain full bilingual parity.',
        edSecJur: '1. Jurisdiction',
        edCountryEn: 'Country / Jurisdiction (EN) *',
        edCountryPt: 'Country / Jurisdiction (PT) *',
        edCode: 'ISO Code (e.g., US, BR, EU) *',
        edRegion: 'Region *',
        edSubEn: 'State / Subdivision (EN)',
        edSubPt: 'State / Subdivision (PT)',
        edSecIss: '2. Issuing Body',
        edIssEn: 'Issuer Name (EN) *',
        edIssPt: 'Issuer Name (PT) *',
        edIssCat: 'Issuer Category *',
        edSecRes: '3. Resource Metadata',
        edTitleEn: 'Resource / Bill Title (EN) *',
        edTitlePt: 'Resource / Bill Title (PT) *',
        edDateEn: 'Display Date (EN)',
        edDatePt: 'Display Date (PT)',
        edYear: 'Year (blank = Undated)',
        edStatus: 'Normative Status *',
        edPage: 'Source Page (0 = post-tracker addition)',
        edMt: 'Flag as machine-translated (Copilot/MT)',
        edSecRisks: '4. Identified Risks (select applicable codes or leave empty for N/A)',
        edSecRecs: '5. Practical Recommendations (parallel EN & PT)',
        edRecPtPh: 'Recommendation in Portuguese (PT)...',
        edRecEnPh: 'Recommendation in English (EN)...',
        edAddRec: '+ Add recommendation',
        edCancel: 'Cancel',
        edSave: 'Save Change',
        edErrReq: 'Please complete required fields: Country (EN & PT), ISO Code, Issuer Name (EN & PT), and Title (EN & PT).',
        edCreatedToast: 'New record added and synced across Tabs 1 and 2.',
        edUpdatedToast: 'Record updated and synced across Tabs 1 and 2.',
        auditTitle: 'Local Update Audit Log',
        auditSub: 'Auditable history of local additions, status updates, JSON imports, and baseline resets.',
        auditShow: 'Show log',
        auditHide: 'Hide log',
        auditEmpty: 'No local modifications recorded yet.',
        colTime: 'Timestamp',
        colAction: 'Action',
        colJur: 'Jurisdiction',
        colRec: 'Record',
        colSum: 'Change Summary',
        actions: { created: 'Created', updated: 'Updated', imported: 'Imported', reset: 'Reset' },
        impTitle: 'Confirm JSON Backup Import',
        impSum: function(tot, a, u, un) { return 'Validated backup contains ' + tot + ' records: ' + a + ' new, ' + u + ' updated, and ' + un + ' unchanged.'; },
        impConfirm: 'Apply JSON Backup',
        impErrJson: 'Invalid JSON or incompatible TrackerEntry bilingual schema.',
        resTitle: 'Reset to 119 Original Baseline?',
        resBody: 'This will clear all local edits and custom additions and restore the original 119 IAPP (October 2026) records.',
        resConfirm: 'Yes, Reset to 119 Baseline'
      },
      footer: {
        attr: 'Source: IAPP AI Legal Ethics and Responsibilities Tracker (Updated October 2026). Informational reference tool; does not constitute legal advice.',
        loaded: 'Loaded records'
      }
    }
  };

  function esc(val) {
    return String(val == null ? '' : val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function norm(val) {
    var s = String(val || '');
    if (s.normalize) {
      s = s.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
    }
    return s.toLowerCase();
  }

  function isLeg(e) {
    return LEGISLATION_STATUSES.indexOf(e.resource.status) !== -1;
  }

  function flagFromCode(code) {
    if (!code || code.length !== 2 || !String.fromCodePoint) return '';
    var u = code.toUpperCase();
    try {
      return String.fromCodePoint(127397 + u.charCodeAt(0), 127397 + u.charCodeAt(1));
    } catch (_e) {
      return '';
    }
  }

  function compareStrings(a, b, lang) {
    var sa = String(a || '');
    var sb = String(b || '');
    try {
      return sa.localeCompare(sb, lang === 'pt' ? 'pt-BR' : 'en-US', { sensitivity: 'base', numeric: true });
    } catch (_e) {
      return sa < sb ? -1 : (sa > sb ? 1 : 0);
    }
  }

  var STORAGE_ENTRIES = 'ai_legal_ethics_tracker_v1';
  var STORAGE_AUDIT = 'ai_legal_ethics_audit_v1';
  var STORAGE_LANG = 'ai_legal_ethics_tracker_lang_v1';

  var state = {
    entries: [],
    baseline: [],
    baselineMap: {},
    auditLog: [],
    lang: 'pt',
    activeTab: 'explorer',
    filters: {
      search: '',
      scope: 'all',
      region: 'all',
      countryCode: 'all',
      subdivision: 'all',
      issuerCategory: 'all',
      status: 'all',
      risk: 'all',
      year: 'all',
      sort: 'country_asc'
    },
    expandedCards: {},
    expandAll: false,
    compareIds: [],
    comparatorOpen: false,
    bilingualCompare: false,
    analytics: {
      caveatsOpen: true,
      scope: 'all',
      region: 'all',
      status: 'all',
      issuerCategory: 'all',
      geoMode: 'global',
      excludeUs: false,
      timelineStack: 'status',
      heatmapMode: 'region'
    },
    monitor: {
      watchlistMode: 'pending',
      search: '',
      auditOpen: true,
      editor: null,
      editorError: '',
      importError: '',
      pendingImport: null,
      resetConfirm: false
    },
    drawer: null,
    toast: null,
    toastTimer: null
  };

  function safeStorageGet(k) {
    try { return window.localStorage ? window.localStorage.getItem(k) : null; } catch (_e) { return null; }
  }

  function safeStorageSet(k, v) {
    try { if (window.localStorage) window.localStorage.setItem(k, v); } catch (_e) {}
  }

  function safeStorageRemove(k) {
    try { if (window.localStorage) window.localStorage.removeItem(k); } catch (_e) {}
  }

  function canonicalEntryStr(e) {
    return JSON.stringify({
      id: e.id,
      sourcePage: e.sourcePage,
      jurisdiction: e.jurisdiction,
      issuer: e.issuer,
      resource: e.resource,
      risks: (e.risks || []).map(function(r) { return r.code; }).sort(),
      recommendations: e.recommendations
    });
  }

  function computeDiffStats() {
    var added = {};
    var modified = {};
    var addedCount = 0;
    var modCount = 0;
    for (var i = 0; i < state.entries.length; i++) {
      var e = state.entries[i];
      var baseStr = state.baselineMap[e.id];
      if (!baseStr) {
        added[e.id] = true;
        addedCount++;
      } else if (canonicalEntryStr(e) !== baseStr) {
        modified[e.id] = true;
        modCount++;
      }
    }
    return {
      baselineCount: state.baseline.length || 119,
      totalActive: state.entries.length,
      customAdded: addedCount,
      modifiedBase: modCount,
      totalMods: addedCount + modCount,
      addedMap: added,
      modMap: modified
    };
  }

  function makeAuditId() {
    return 'aud_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  function persistEntries() {
    safeStorageSet(STORAGE_ENTRIES, JSON.stringify(state.entries));
  }

  function pushAudit(item) {
    state.auditLog = [item].concat(state.auditLog).slice(0, 200);
    safeStorageSet(STORAGE_AUDIT, JSON.stringify(state.auditLog));
  }

  function summarizeDiff(prev, next) {
    if (!prev) {
      return {
        pt: 'Novo registro adicionado (' + STATUS_LABELS[next.resource.status].pt + ')',
        en: 'New record added (' + STATUS_LABELS[next.resource.status].en + ')'
      };
    }
    var ptP = [], enP = [];
    if (prev.resource.status !== next.resource.status) {
      var sDiff = prev.resource.status + ' -> ' + next.resource.status;
      ptP.push(sDiff);
      enP.push(sDiff);
    }
    if (prev.resource.dateDisplay.pt !== next.resource.dateDisplay.pt || prev.resource.year !== next.resource.year) {
      ptP.push('Data: ' + next.resource.dateDisplay.pt);
      enP.push('Date: ' + next.resource.dateDisplay.en);
    }
    if (prev.resource.title.pt !== next.resource.title.pt || prev.resource.title.en !== next.resource.title.en) {
      ptP.push('T\\u00edtulo atualizado');
      enP.push('Title updated');
    }
    if (JSON.stringify(prev.recommendations) !== JSON.stringify(next.recommendations)) {
      ptP.push('Recomenda\\u00e7\\u00f5es (' + next.recommendations.pt.length + ')');
      enP.push('Recommendations (' + next.recommendations.en.length + ')');
    }
    if (!ptP.length) return { pt: 'Metadados atualizados', en: 'Metadata updated' };
    return { pt: ptP.join(' \\u00b7 '), en: enP.join(' \\u00b7 ') };
  }

  function createBlankDraft() {
    var yr = new Date().getFullYear();
    return {
      mode: 'create',
      id: 'custom-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6),
      sourcePage: 0,
      countryCode: 'US',
      countryEn: '',
      countryPt: '',
      regionEn: 'North America',
      subEn: '',
      subPt: '',
      issuerEn: '',
      issuerPt: '',
      issuerCategory: 'legislature',
      titleEn: '',
      titlePt: '',
      dateEn: '',
      datePt: '',
      year: String(yr),
      status: 'pending_bill',
      isMt: false,
      risks: [],
      recs: [{ pt: '', en: '' }]
    };
  }

  function entryToDraft(e) {
    var rLen = Math.max(e.recommendations.en.length, e.recommendations.pt.length, 1);
    var recs = [];
    for (var i = 0; i < rLen; i++) {
      recs.push({ pt: e.recommendations.pt[i] || '', en: e.recommendations.en[i] || '' });
    }
    return {
      mode: 'edit',
      id: e.id,
      sourcePage: e.sourcePage,
      countryCode: e.jurisdiction.countryCode,
      countryEn: e.jurisdiction.country.en,
      countryPt: e.jurisdiction.country.pt,
      regionEn: REGION_LABELS[e.jurisdiction.region.en] ? e.jurisdiction.region.en : 'North America',
      subEn: e.jurisdiction.subdivision ? e.jurisdiction.subdivision.en : '',
      subPt: e.jurisdiction.subdivision ? e.jurisdiction.subdivision.pt : '',
      issuerEn: e.issuer.name.en,
      issuerPt: e.issuer.name.pt,
      issuerCategory: e.issuer.category,
      titleEn: e.resource.title.en,
      titlePt: e.resource.title.pt,
      dateEn: e.resource.dateDisplay.en,
      datePt: e.resource.dateDisplay.pt,
      year: e.resource.year !== null ? String(e.resource.year) : '',
      status: e.resource.status,
      isMt: Boolean(e.resource.isMachineTranslated),
      risks: (e.risks || []).map(function(r) { return r.code; }),
      recs: recs
    };
  }

  function downloadBackupJsonOffline() {
    var payload = {
      metadata: {
        exportedAt: new Date().toISOString(),
        baseEdition: 'IAPP Oct 2026',
        totalEntries: state.entries.length
      },
      entries: state.entries,
      auditLog: state.auditLog
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'ai-legal-ethics-tracker-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
    showToast(I18N[state.lang].stage3.exportToast);
  }

  function validateBackupTextOffline(rawText) {
    if (!rawText || rawText.length > 10 * 1024 * 1024) return null;
    var parsed;
    try { parsed = JSON.parse(rawText); } catch (_e) { return null; }
    var list = Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.entries) ? parsed.entries : null);
    if (!list || !list.length) return null;
    var valid = [];
    var seen = {};
    for (var i = 0; i < list.length; i++) {
      var o = list[i];
      if (!o || typeof o !== 'object' || typeof o.id !== 'string' || !o.id.trim()) return null;
      if (!o.jurisdiction || !o.jurisdiction.country || typeof o.jurisdiction.country.en !== 'string' || typeof o.jurisdiction.country.pt !== 'string') return null;
      if (!o.issuer || !o.issuer.name || typeof o.issuer.name.en !== 'string' || typeof o.issuer.name.pt !== 'string' || ALL_ISSUERS.indexOf(o.issuer.category) === -1) return null;
      if (!o.resource || !o.resource.title || typeof o.resource.title.en !== 'string' || typeof o.resource.title.pt !== 'string' || ALL_STATUSES.indexOf(o.resource.status) === -1) return null;
      if (!Array.isArray(o.risks) || !o.recommendations || !Array.isArray(o.recommendations.en) || !Array.isArray(o.recommendations.pt)) return null;
      if (!seen[o.id]) {
        seen[o.id] = true;
        valid.push(o);
      }
    }
    var curMap = {};
    for (var j = 0; j < state.entries.length; j++) curMap[state.entries[j].id] = canonicalEntryStr(state.entries[j]);
    var added = 0, updated = 0, unchanged = 0;
    for (var k = 0; k < valid.length; k++) {
      var prevStr = curMap[valid[k].id];
      if (!prevStr) added++;
      else if (prevStr !== canonicalEntryStr(valid[k])) updated++;
      else unchanged++;
    }
    var aud = (parsed && Array.isArray(parsed.auditLog)) ? parsed.auditLog.slice(0, 200) : [];
    return { entries: valid, auditLog: aud, total: valid.length, added: added, updated: updated, unchanged: unchanged };
  }

  var drillRegistry = {};
  var drillSeq = 0;

  function registerDrill(payload) {
    drillSeq += 1;
    var key = 'd' + drillSeq;
    drillRegistry[key] = payload;
    return key;
  }

  function resetExplorerFilters(patch) {
    state.filters = {
      search: '',
      scope: 'all',
      region: 'all',
      countryCode: 'all',
      subdivision: 'all',
      issuerCategory: 'all',
      status: 'all',
      risk: 'all',
      year: 'all',
      sort: 'country_asc'
    };
    if (patch) {
      for (var k in patch) {
        if (Object.prototype.hasOwnProperty.call(patch, k) && patch[k] !== undefined) {
          state.filters[k] = patch[k];
        }
      }
    }
  }

  function showToast(msg) {
    state.toast = msg;
    if (state.toastTimer) clearTimeout(state.toastTimer);
    renderToastOnly();
    state.toastTimer = setTimeout(function() {
      state.toast = null;
      renderToastOnly();
    }, 3000);
  }

  function renderToastOnly() {
    var el = document.getElementById('offline-toast');
    if (!el) return;
    if (state.toast) {
      el.textContent = state.toast;
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  }

  function matchesSearch(entry, rawQuery) {
    var trimmed = String(rawQuery || '').trim();
    if (!trimmed) return true;
    var tokens = norm(trimmed).split(/\\s+/).filter(Boolean);
    if (!tokens.length) return true;
    var parts = [
      entry.resource.title.en,
      entry.resource.title.pt,
      entry.issuer.name.en,
      entry.issuer.name.pt,
      entry.jurisdiction.country.en,
      entry.jurisdiction.country.pt,
      entry.jurisdiction.countryCode,
      entry.jurisdiction.region.en,
      entry.jurisdiction.region.pt,
      entry.resource.dateDisplay.en,
      entry.resource.dateDisplay.pt
    ];
    if (entry.jurisdiction.subdivision) {
      parts.push(entry.jurisdiction.subdivision.en, entry.jurisdiction.subdivision.pt);
    }
    for (var i = 0; i < entry.risks.length; i++) {
      parts.push(entry.risks[i].label.en, entry.risks[i].label.pt, entry.risks[i].code);
    }
    for (var j = 0; j < entry.recommendations.en.length; j++) parts.push(entry.recommendations.en[j]);
    for (var k = 0; k < entry.recommendations.pt.length; k++) parts.push(entry.recommendations.pt[k]);
    var hay = norm(parts.join(' '));
    for (var t = 0; t < tokens.length; t++) {
      if (hay.indexOf(tokens[t]) === -1) return false;
    }
    return true;
  }

  function getFilteredExplorerEntries() {
    var f = state.filters;
    var lang = state.lang;
    var out = state.entries.filter(function(e) {
      if (f.scope === 'non_us' && e.jurisdiction.countryCode === 'US') return false;
      if (f.scope === 'us' && e.jurisdiction.countryCode !== 'US') return false;
      if (f.scope === 'europe' && e.jurisdiction.region.en !== 'Europe') return false;
      if (f.scope === 'legislation' && !isLeg(e)) return false;
      if (f.region !== 'all' && e.jurisdiction.region.en !== f.region) return false;
      if (f.countryCode !== 'all' && e.jurisdiction.countryCode !== f.countryCode) return false;
      if (f.subdivision !== 'all') {
        if (!e.jurisdiction.subdivision || e.jurisdiction.subdivision.en !== f.subdivision) return false;
      }
      if (f.issuerCategory !== 'all' && e.issuer.category !== f.issuerCategory) return false;
      if (f.status !== 'all' && e.resource.status !== f.status) return false;
      if (f.risk === 'na_no_risks') {
        if (e.risks.length !== 0) return false;
      } else if (f.risk !== 'all') {
        var foundRisk = false;
        for (var i = 0; i < e.risks.length; i++) {
          if (e.risks[i].code === f.risk) { foundRisk = true; break; }
        }
        if (!foundRisk) return false;
      }
      if (f.year === 'not_specified') {
        if (e.resource.year !== null) return false;
      } else if (f.year !== 'all') {
        if (e.resource.year !== Number(f.year)) return false;
      }
      if (!matchesSearch(e, f.search)) return false;
      return true;
    });

    out.sort(function(a, b) {
      if (f.sort === 'country_asc') {
        var c = compareStrings(a.jurisdiction.country[lang], b.jurisdiction.country[lang], lang);
        if (c !== 0) return c;
        var sA = a.jurisdiction.subdivision ? a.jurisdiction.subdivision[lang] : '';
        var sB = b.jurisdiction.subdivision ? b.jurisdiction.subdivision[lang] : '';
        var s = compareStrings(sA, sB, lang);
        if (s !== 0) return s;
        return compareStrings(a.resource.title[lang], b.resource.title[lang], lang);
      }
      if (f.sort === 'year_desc' || f.sort === 'year_asc') {
        var yA = a.resource.year;
        var yB = b.resource.year;
        if (yA === null && yB === null) return compareStrings(a.jurisdiction.country[lang], b.jurisdiction.country[lang], lang);
        if (yA === null) return 1;
        if (yB === null) return -1;
        if (yA !== yB) return f.sort === 'year_desc' ? (yB - yA) : (yA - yB);
        return compareStrings(a.jurisdiction.country[lang], b.jurisdiction.country[lang], lang);
      }
      if (f.sort === 'source_page_asc') {
        if (a.sourcePage !== b.sourcePage) return a.sourcePage - b.sourcePage;
        return compareStrings(a.jurisdiction.country[lang], b.jurisdiction.country[lang], lang);
      }
      return 0;
    });
    return out;
  }

  function getAnalyticsSlice() {
    var af = state.analytics;
    return state.entries.filter(function(e) {
      if (af.scope === 'non_us' && e.jurisdiction.countryCode === 'US') return false;
      if (af.scope === 'us' && e.jurisdiction.countryCode !== 'US') return false;
      if (af.scope === 'europe' && e.jurisdiction.region.en !== 'Europe') return false;
      if (af.region !== 'all' && e.jurisdiction.region.en !== af.region) return false;
      if (af.status !== 'all' && e.resource.status !== af.status) return false;
      if (af.issuerCategory !== 'all' && e.issuer.category !== af.issuerCategory) return false;
      return true;
    });
  }

  function analyticsExplorerBasePatch() {
    var af = state.analytics;
    var p = {};
    if (af.scope !== 'all') p.scope = af.scope;
    if (af.region !== 'all') p.region = af.region;
    if (af.status !== 'all') p.status = af.status;
    if (af.issuerCategory !== 'all') p.issuerCategory = af.issuerCategory;
    return p;
  }

  function mergeObj(a, b) {
    var res = {};
    var k;
    for (k in a) if (Object.prototype.hasOwnProperty.call(a, k)) res[k] = a[k];
    for (k in b) if (Object.prototype.hasOwnProperty.call(b, k)) res[k] = b[k];
    return res;
  }

  function countExplorerActiveFilters() {
    var f = state.filters;
    var n = 0;
    if (f.search.trim()) n++;
    if (f.scope !== 'all') n++;
    if (f.region !== 'all') n++;
    if (f.countryCode !== 'all') n++;
    if (f.subdivision !== 'all') n++;
    if (f.issuerCategory !== 'all') n++;
    if (f.status !== 'all') n++;
    if (f.risk !== 'all') n++;
    if (f.year !== 'all') n++;
    return n;
  }

  function countAnalyticsActiveFilters() {
    var af = state.analytics;
    var n = 0;
    if (af.scope !== 'all') n++;
    if (af.region !== 'all') n++;
    if (af.status !== 'all') n++;
    if (af.issuerCategory !== 'all') n++;
    return n;
  }

  function buildHeaderHtml() {
    var t = I18N[state.lang];
    return '' +
      '<header class="site-header">' +
        '<div class="container">' +
          '<div class="header-top">' +
            '<div class="brand">' +
              '<div class="brand-mark">AI</div>' +
              '<div>' +
                '<h1 class="brand-title">' + esc(t.appTitle) + '</h1>' +
                '<p class="brand-sub">' + esc(t.appSub) + '</p>' +
              '</div>' +
            '</div>' +
            '<div class="header-actions">' +
              '<span class="offline-badge">\\u25cf ' + esc(t.offlineBadge) + '</span>' +
              '<div class="lang-switch" role="group" aria-label="Language">' +
                '<button type="button" class="lang-btn' + (state.lang === 'pt' ? ' active' : '') + '" data-action="set-lang" data-lang="pt">PT</button>' +
                '<button type="button" class="lang-btn' + (state.lang === 'en' ? ' active' : '') + '" data-action="set-lang" data-lang="en">EN</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<nav class="nav-tabs" role="tablist">' +
            '<button type="button" class="tab-btn' + (state.activeTab === 'explorer' ? ' active' : '') + '" data-action="set-tab" data-tab="explorer">' + esc(t.tabs.explorer) + '</button>' +
            '<button type="button" class="tab-btn' + (state.activeTab === 'analytics' ? ' active' : '') + '" data-action="set-tab" data-tab="analytics">' + esc(t.tabs.analytics) + '</button>' +
            '<button type="button" class="tab-btn' + (state.activeTab === 'monitor' ? ' active' : '') + '" data-action="set-tab" data-tab="monitor">' + esc(t.tabs.monitor) + '</button>' +
          '</nav>' +
        '</div>' +
      '</header>';
  }

  function buildExplorerHtml() {
    var lang = state.lang;
    var t = I18N[lang];
    var f = state.filters;
    var filtered = getFilteredExplorerEntries();
    var total = state.entries.length;

    // KPI counts
    var countrySet = {};
    var subSet = {};
    var legCount = 0;
    for (var i = 0; i < filtered.length; i++) {
      var e = filtered[i];
      countrySet[e.jurisdiction.countryCode] = true;
      if (e.jurisdiction.subdivision && e.jurisdiction.subdivision.en) {
        subSet[e.jurisdiction.countryCode + '::' + e.jurisdiction.subdivision.en] = true;
      }
      if (isLeg(e)) legCount++;
    }

    // Scope counts across all entries
    var sc = { all: total, non_us: 0, us: 0, europe: 0, legislation: 0 };
    var countryMap = {};
    var yearMap = {};
    var hasUndated = false;
    for (var j = 0; j < state.entries.length; j++) {
      var rec = state.entries[j];
      if (rec.jurisdiction.countryCode === 'US') sc.us++; else sc.non_us++;
      if (rec.jurisdiction.region.en === 'Europe') sc.europe++;
      if (isLeg(rec)) sc.legislation++;
      var cc = rec.jurisdiction.countryCode;
      if (!countryMap[cc]) countryMap[cc] = { code: cc, label: rec.jurisdiction.country[lang], count: 0 };
      countryMap[cc].count++;
      if (rec.resource.year !== null) yearMap[rec.resource.year] = true; else hasUndated = true;
    }

    var countryList = Object.keys(countryMap).map(function(k) { return countryMap[k]; }).sort(function(a, b) {
      return compareStrings(a.label, b.label, lang);
    });

    var subMap = {};
    for (var s = 0; s < state.entries.length; s++) {
      var se = state.entries[s];
      if (f.countryCode !== 'all' && se.jurisdiction.countryCode !== f.countryCode) continue;
      if (se.jurisdiction.subdivision && se.jurisdiction.subdivision.en) {
        var sv = se.jurisdiction.subdivision.en;
        if (!subMap[sv]) subMap[sv] = { val: sv, label: se.jurisdiction.subdivision[lang], count: 0 };
        subMap[sv].count++;
      }
    }
    var subList = Object.keys(subMap).map(function(k) { return subMap[k]; }).sort(function(a, b) {
      return compareStrings(a.label, b.label, lang);
    });

    var years = Object.keys(yearMap).map(Number).sort(function(a, b) { return b - a; });
    var activeFilterCount = countExplorerActiveFilters();

    var kpiHtml = '' +
      '<div class="kpi-grid">' +
        '<div class="kpi-card">' +
          '<div class="kpi-label">' + esc(t.kpi.filtered) + '</div>' +
          '<div class="kpi-value tabular-nums">' + filtered.length + ' <span style="font-size:15px;font-weight:500;color:#64748b">' + esc(t.kpi.ofTotal) + ' ' + total + '</span></div>' +
          '<div class="kpi-sub">' + esc(t.filters.activeFilters(activeFilterCount)) + '</div>' +
        '</div>' +
        '<div class="kpi-card">' +
          '<div class="kpi-label">' + esc(t.kpi.jurisdictions) + '</div>' +
          '<div class="kpi-value tabular-nums">' + Object.keys(countrySet).length + '</div>' +
          '<div class="kpi-sub">' + esc(t.kpi.jurisdictionsSub) + '</div>' +
        '</div>' +
        '<div class="kpi-card">' +
          '<div class="kpi-label">' + esc(t.kpi.subdivisions) + '</div>' +
          '<div class="kpi-value tabular-nums">' + Object.keys(subSet).length + '</div>' +
          '<div class="kpi-sub">' + esc(t.kpi.subdivisionsSub) + '</div>' +
        '</div>' +
        '<div class="kpi-card">' +
          '<div class="kpi-label">' + esc(t.kpi.legislation) + '</div>' +
          '<div class="kpi-value tabular-nums">' + legCount + '</div>' +
          '<div class="kpi-sub">' + esc(t.kpi.legislationSub) + '</div>' +
        '</div>' +
      '</div>';

    var scopeKeys = ['all', 'non_us', 'us', 'europe', 'legislation'];
    var scopesHtml = scopeKeys.map(function(sk) {
      return '<button type="button" class="scope-pill' + (f.scope === sk ? ' active' : '') + '" data-action="exp-scope" data-val="' + sk + '">' +
        esc(t.scopes[sk]) + '<span class="scope-count tabular-nums">' + sc[sk] + '</span></button>';
    }).join('');

    var filterBarHtml = '' +
      '<section class="card card-pad">' +
        '<div class="scope-row">' +
          '<div class="pill-group">' + scopesHtml + '</div>' +
          (activeFilterCount > 0
            ? '<button type="button" class="btn btn-sm" data-action="exp-reset">' + esc(t.filters.clearAll) + ' (' + activeFilterCount + ')</button>'
            : '') +
        '</div>' +
        '<div class="search-wrap">' +
          '<input id="exp-search-input" class="search-input" type="text" value="' + esc(f.search) + '" placeholder="' + esc(t.filters.searchPlaceholder) + '" />' +
          (f.search ? '<button type="button" class="search-clear" data-action="exp-clear-search" aria-label="Clear">\\u00d7</button>' : '') +
        '</div>' +
        '<div class="filter-grid">' +
          '<div class="field-group"><label class="field-label">' + esc(t.filters.region) + '</label>' +
            '<select class="select-input" data-filter="region">' +
              '<option value="all">' + esc(t.filters.allRegions) + '</option>' +
              REGIONS.map(function(r) { return '<option value="' + esc(r) + '"' + (f.region === r ? ' selected' : '') + '>' + esc(REGION_LABELS[r][lang]) + '</option>'; }).join('') +
            '</select></div>' +
          '<div class="field-group"><label class="field-label">' + esc(t.filters.country) + '</label>' +
            '<select class="select-input" data-filter="countryCode">' +
              '<option value="all">' + esc(t.filters.allCountries) + '</option>' +
              countryList.map(function(c) { return '<option value="' + esc(c.code) + '"' + (f.countryCode === c.code ? ' selected' : '') + '>' + esc(c.label) + ' (' + c.count + ')</option>'; }).join('') +
            '</select></div>' +
          '<div class="field-group"><label class="field-label">' + esc(t.filters.subdivision) + '</label>' +
            '<select class="select-input" data-filter="subdivision">' +
              '<option value="all">' + esc(t.filters.allSubdivisions) + '</option>' +
              subList.map(function(sb) { return '<option value="' + esc(sb.val) + '"' + (f.subdivision === sb.val ? ' selected' : '') + '>' + esc(sb.label) + ' (' + sb.count + ')</option>'; }).join('') +
            '</select></div>' +
          '<div class="field-group"><label class="field-label">' + esc(t.filters.issuer) + '</label>' +
            '<select class="select-input" data-filter="issuerCategory">' +
              '<option value="all">' + esc(t.filters.allIssuers) + '</option>' +
              ALL_ISSUERS.map(function(ic) { return '<option value="' + ic + '"' + (f.issuerCategory === ic ? ' selected' : '') + '>' + esc(ISSUER_LABELS[ic][lang]) + '</option>'; }).join('') +
            '</select></div>' +
          '<div class="field-group"><label class="field-label">' + esc(t.filters.status) + '</label>' +
            '<select class="select-input" data-filter="status">' +
              '<option value="all">' + esc(t.filters.allStatuses) + '</option>' +
              ALL_STATUSES.map(function(st) { return '<option value="' + st + '"' + (f.status === st ? ' selected' : '') + '>' + esc(STATUS_LABELS[st][lang]) + '</option>'; }).join('') +
            '</select></div>' +
          '<div class="field-group"><label class="field-label">' + esc(t.filters.risk) + '</label>' +
            '<select class="select-input" data-filter="risk">' +
              '<option value="all">' + esc(t.filters.allRisks) + '</option>' +
              '<option value="na_no_risks"' + (f.risk === 'na_no_risks' ? ' selected' : '') + '>' + esc(t.filters.naRisk) + '</option>' +
              ALL_RISK_CODES.map(function(rc) { return '<option value="' + rc + '"' + (f.risk === rc ? ' selected' : '') + '>' + esc(RISK_LABELS[rc][lang]) + '</option>'; }).join('') +
            '</select></div>' +
          '<div class="field-group"><label class="field-label">' + esc(t.filters.year) + '</label>' +
            '<select class="select-input" data-filter="year">' +
              '<option value="all">' + esc(t.filters.allYears) + '</option>' +
              years.map(function(yr) { return '<option value="' + yr + '"' + (String(f.year) === String(yr) ? ' selected' : '') + '>' + yr + '</option>'; }).join('') +
              (hasUndated ? '<option value="not_specified"' + (f.year === 'not_specified' ? ' selected' : '') + '>' + esc(t.filters.yearUnspecified) + '</option>' : '') +
            '</select></div>' +
          '<div class="field-group"><label class="field-label">' + esc(t.filters.sortBy) + '</label>' +
            '<select class="select-input" data-filter="sort">' +
              ['country_asc', 'year_desc', 'year_asc', 'source_page_asc'].map(function(so) {
                return '<option value="' + so + '"' + (f.sort === so ? ' selected' : '') + '>' + esc(SORT_LABELS[so][lang]) + '</option>';
              }).join('') +
            '</select></div>' +
        '</div>' +
      '</section>';

    var resultsHeader = '' +
      '<div class="results-bar">' +
        '<div><strong>' + esc(t.filters.showing(filtered.length, total)) + '</strong></div>' +
        '<button type="button" class="btn btn-sm" data-action="exp-toggle-expand-all">' +
          esc(state.expandAll ? t.filters.collapseAll : t.filters.expandAll) +
        '</button>' +
      '</div>';

    var cardsHtml;
    if (filtered.length === 0) {
      cardsHtml = '' +
        '<div class="card card-pad" style="text-align:center;padding:42px 20px">' +
          '<h3 style="margin:0 0 6px;font-size:16px">' + esc(t.card.emptyTitle) + '</h3>' +
          '<p style="margin:0 0 16px;color:#64748b">' + esc(t.card.emptyDesc) + '</p>' +
          '<button type="button" class="btn btn-dark" data-action="exp-reset">' + esc(t.filters.clearAll) + '</button>' +
        '</div>';
    } else {
      cardsHtml = '<div class="cards-grid">' + filtered.map(function(entry) {
        var isSel = state.compareIds.indexOf(entry.id) !== -1;
        var maxReached = state.compareIds.length >= 3 && !isSel;
        var isExp = state.expandAll || Boolean(state.expandedCards[entry.id]);
        var recs = entry.recommendations[lang] || [];
        var visibleRecs = isExp ? recs : recs.slice(0, 3);
        var extraCount = recs.length - visibleRecs.length;

        var risksBlock = entry.risks.length === 0
          ? '<span class="badge badge-muted">' + esc(t.card.risksNa) + '</span>'
          : '<div class="risk-list">' + entry.risks.map(function(r) {
              return '<button type="button" class="risk-chip rc-' + esc(r.code) + '" data-action="exp-risk-chip" data-risk="' + esc(r.code) + '" title="' + esc(t.card.filterRiskHint) + '">' + esc(r.label[lang]) + '</button>';
            }).join('') + '</div>';

        return '' +
          '<article class="res-card' + (isSel ? ' selected' : '') + '">' +
            '<div class="res-meta-top">' +
              '<div class="jurisdiction-line">' +
                '<span class="country-code">' + esc(entry.jurisdiction.countryCode) + '</span>' +
                '<span>' + esc(flagFromCode(entry.jurisdiction.countryCode)) + ' ' + esc(entry.jurisdiction.country[lang]) +
                  (entry.jurisdiction.subdivision ? ' \\u00b7 ' + esc(entry.jurisdiction.subdivision[lang]) : '') +
                '</span>' +
                '<span class="badge badge-muted">' + esc(entry.jurisdiction.region[lang]) + '</span>' +
              '</div>' +
              '<span class="badge st-' + esc(entry.resource.status) + '">' + esc(STATUS_LABELS[entry.resource.status][lang]) + '</span>' +
            '</div>' +
            '<h3 class="res-title">' + esc(entry.resource.title[lang]) + '</h3>' +
            '<div class="res-issuer">' +
              '<span><strong>' + esc(t.card.issuerLabel) + ':</strong> ' + esc(entry.issuer.name[lang]) + '</span>' +
              '<span class="badge badge-muted">' + esc(ISSUER_LABELS[entry.issuer.category][lang]) + '</span>' +
              '<span class="badge badge-muted">' + esc(entry.resource.dateDisplay[lang]) + ' \\u00b7 ' + esc(t.card.sourcePage(entry.sourcePage)) + '</span>' +
              (entry.resource.isMachineTranslated ? '<span class="badge badge-mt">' + esc(t.card.mtNotice) + '</span>' : '') +
            '</div>' +
            '<div>' +
              '<div class="section-mini-title">' + esc(t.card.risksHeading) + '</div>' +
              risksBlock +
            '</div>' +
            '<div>' +
              '<div class="section-mini-title">' + esc(t.card.recsHeading) + ' (' + recs.length + ')</div>' +
              '<ul class="rec-list">' + visibleRecs.map(function(rc) { return '<li>' + esc(rc) + '</li>'; }).join('') + '</ul>' +
            '</div>' +
            '<div class="card-footer">' +
              '<div>' +
                (recs.length > 3
                  ? '<button type="button" class="link-btn" data-action="exp-toggle-card" data-id="' + esc(entry.id) + '">' +
                      esc(isExp ? t.card.showLess : t.card.showMore(extraCount)) +
                    '</button>'
                  : '') +
              '</div>' +
              '<button type="button" class="btn btn-sm' + (isSel ? ' btn-primary' : '') + '" data-action="toggle-compare" data-id="' + esc(entry.id) + '"' + (maxReached ? ' disabled' : '') + '>' +
                (isSel ? '\\u2713 ' + esc(t.card.selected) : '+ ' + esc(t.card.compare)) +
              '</button>' +
            '</div>' +
          '</article>';
      }).join('') + '</div>';
    }

    return '<div class="section-stack">' + kpiHtml + filterBarHtml + resultsHeader + cardsHtml + '</div>';
  }

  function buildAnalyticsHtml() {
    var lang = state.lang;
    var t = I18N[lang];
    var at = t.analytics;
    var af = state.analytics;
    var all = state.entries;
    var totalAll = all.length;

    // Global corpus counts for methodological caveats
    var totalUs = 0;
    var totalNonUs = 0;
    var totalEurope = 0;
    var totalNa = 0;
    for (var i = 0; i < all.length; i++) {
      if (all[i].jurisdiction.countryCode === 'US') totalUs++; else totalNonUs++;
      if (all[i].jurisdiction.region.en === 'Europe') totalEurope++;
      if (all[i].risks.length === 0) totalNa++;
    }

    var slice = getAnalyticsSlice();
    var sliceLen = slice.length;
    var basePatch = analyticsExplorerBasePatch();

    // 1. Methodological Caveats Banner
    var caveatsHtml = '' +
      '<section class="caveat-banner">' +
        '<div class="caveat-header">' +
          '<h2 class="caveat-title">\\u26a0 ' + esc(at.caveatsTitle) + '</h2>' +
          '<button type="button" class="btn btn-sm" data-action="an-toggle-caveats">' +
            esc(af.caveatsOpen ? at.hideNotes : at.showNotes) +
          '</button>' +
        '</div>' +
        (af.caveatsOpen
          ? '<div class="caveat-grid">' +
              '<div class="caveat-box"><h4>' + esc(at.usTitle) + '</h4><p>' + esc(at.usBody(totalUs, totalAll, totalNonUs)) + '</p></div>' +
              '<div class="caveat-box"><h4>' + esc(at.naTitle) + '</h4><p>' + esc(at.naBody(totalNa, totalAll)) + '</p></div>' +
            '</div>'
          : '') +
      '</section>';

    // 2. Slice Controls
    var anActiveCount = countAnalyticsActiveFilters();
    var anScopes = [
      { key: 'all', label: at.scopeAll, count: totalAll },
      { key: 'non_us', label: at.scopeNonUs, count: totalNonUs },
      { key: 'us', label: at.scopeUs, count: totalUs },
      { key: 'europe', label: at.scopeEurope, count: totalEurope }
    ];
    var sliceControlsHtml = '' +
      '<section class="card card-pad">' +
        '<div class="scope-row">' +
          '<div class="pill-group">' +
            anScopes.map(function(sc) {
              return '<button type="button" class="scope-pill' + (af.scope === sc.key ? ' active' : '') + '" data-action="an-scope" data-val="' + sc.key + '">' +
                esc(sc.label) + '<span class="scope-count tabular-nums">' + sc.count + '</span></button>';
            }).join('') +
          '</div>' +
          (anActiveCount > 0
            ? '<button type="button" class="btn btn-sm" data-action="an-reset">' + esc(at.reset) + ' (' + anActiveCount + ')</button>'
            : '') +
        '</div>' +
        '<div class="filter-grid-3">' +
          '<div class="field-group"><label class="field-label">' + esc(t.filters.region) + '</label>' +
            '<select class="select-input" data-an-filter="region">' +
              '<option value="all">' + esc(t.filters.allRegions) + '</option>' +
              REGIONS.map(function(r) { return '<option value="' + esc(r) + '"' + (af.region === r ? ' selected' : '') + '>' + esc(REGION_LABELS[r][lang]) + '</option>'; }).join('') +
            '</select></div>' +
          '<div class="field-group"><label class="field-label">' + esc(t.filters.status) + '</label>' +
            '<select class="select-input" data-an-filter="status">' +
              '<option value="all">' + esc(t.filters.allStatuses) + '</option>' +
              ALL_STATUSES.map(function(st) { return '<option value="' + st + '"' + (af.status === st ? ' selected' : '') + '>' + esc(STATUS_LABELS[st][lang]) + '</option>'; }).join('') +
            '</select></div>' +
          '<div class="field-group"><label class="field-label">' + esc(t.filters.issuer) + '</label>' +
            '<select class="select-input" data-an-filter="issuerCategory">' +
              '<option value="all">' + esc(t.filters.allIssuers) + '</option>' +
              ALL_ISSUERS.map(function(ic) { return '<option value="' + ic + '"' + (af.issuerCategory === ic ? ' selected' : '') + '>' + esc(ISSUER_LABELS[ic][lang]) + '</option>'; }).join('') +
            '</select></div>' +
        '</div>' +
      '</section>';

    // 3. Dynamic KPI Strip
    var kCountries = {};
    var kSubs = {};
    var kRiskCounts = {};
    var kNaCount = 0;
    for (var k = 0; k < slice.length; k++) {
      var ke = slice[k];
      kCountries[ke.jurisdiction.countryCode] = true;
      if (ke.jurisdiction.subdivision && ke.jurisdiction.subdivision.en) {
        kSubs[ke.jurisdiction.countryCode + '::' + ke.jurisdiction.subdivision.en] = true;
      }
      if (ke.risks.length === 0) {
        kNaCount++;
      } else {
        var seenK = {};
        for (var r = 0; r < ke.risks.length; r++) {
          var rc = ke.risks[r].code;
          if (!seenK[rc]) {
            seenK[rc] = true;
            kRiskCounts[rc] = (kRiskCounts[rc] || 0) + 1;
          }
        }
      }
    }
    var topRiskCode = null;
    var topRiskCount = 0;
    for (var ri = 0; ri < ALL_RISK_CODES.length; ri++) {
      var code = ALL_RISK_CODES[ri];
      var cnt = kRiskCounts[code] || 0;
      if (cnt > topRiskCount) {
        topRiskCount = cnt;
        topRiskCode = code;
      }
    }
    var classifiedCount = sliceLen - kNaCount;
    var sharePct = totalAll > 0 ? ((sliceLen / totalAll) * 100).toFixed(1) : '0.0';
    var classPct = sliceLen > 0 ? ((classifiedCount / sliceLen) * 100).toFixed(1) : '0.0';
    var naPct = sliceLen > 0 ? ((kNaCount / sliceLen) * 100).toFixed(1) : '0.0';

    var anKpiHtml = '' +
      '<div class="kpi-grid">' +
        '<div class="kpi-card">' +
          '<div class="kpi-label">' + esc(at.kpiAnalyzed) + '</div>' +
          '<div class="kpi-value tabular-nums">' + sliceLen + '</div>' +
          '<div class="kpi-sub">' + esc(at.kpiOfDataset(sharePct, totalAll)) + '</div>' +
        '</div>' +
        '<div class="kpi-card">' +
          '<div class="kpi-label">' + esc(at.kpiJurisdictions) + '</div>' +
          '<div class="kpi-value tabular-nums">' + Object.keys(kCountries).length + '</div>' +
          '<div class="kpi-sub">' + esc(at.kpiSubdivisions(Object.keys(kSubs).length)) + '</div>' +
        '</div>' +
        '<div class="kpi-card">' +
          '<div class="kpi-label">' + esc(at.kpiTopRisk) + '</div>' +
          '<div class="kpi-value kpi-value-sm">' + esc(topRiskCode ? RISK_LABELS[topRiskCode][lang] : 'N/A') + '</div>' +
          '<div class="kpi-sub">' + esc(topRiskCode ? at.kpiTopRiskSub(topRiskCount) : at.kpiNoRisk) + '</div>' +
        '</div>' +
        '<div class="kpi-card">' +
          '<div class="kpi-label">' + esc(at.kpiCoverage) + '</div>' +
          '<div class="kpi-value tabular-nums">' + classPct + '%</div>' +
          '<div class="split-bar">' +
            '<div style="width:' + classPct + '%;background:#4338ca"></div>' +
            '<div style="width:' + naPct + '%;background:#cbd5e1"></div>' +
          '</div>' +
          '<div class="kpi-sub">' + esc(at.kpiCoverageSub(classifiedCount, classPct, kNaCount, naPct)) + '</div>' +
        '</div>' +
      '</div>';

    // 4. Visualization 1: Geographic & Sub-National Distribution
    var geoHtml = buildGeographicVizHtml(slice, basePatch, at, lang);

    // 5. Visualization 2: Chronological Evolution (SVG)
    var timeHtml = buildChronologicalVizHtml(slice, basePatch, at, lang);

    // 6. Visualization 3: Risk Category Incidence (15 Risks + N/A)
    var riskHtml = buildRiskIncidenceVizHtml(slice, basePatch, at, lang);

    // 7. Visualization 4: Regulatory Heatmap Matrix
    var heatmapHtml = buildHeatmapVizHtml(slice, basePatch, at, lang);

    return '<div class="section-stack">' + caveatsHtml + sliceControlsHtml + anKpiHtml + geoHtml + timeHtml + riskHtml + heatmapHtml + '</div>';
  }

  function buildGeographicVizHtml(slice, basePatch, at, lang) {
    var af = state.analytics;
    var statusLegend = '<div class="legend-row">' + ALL_STATUSES.map(function(st) {
      return '<span class="legend-item"><span class="legend-dot" style="background:' + STATUS_COLORS[st] + '"></span>' + esc(STATUS_LABELS[st][lang]) + '</span>';
    }).join('') + '</div>';

    // Regional summary strip (shown in global mode)
    var regionalStripHtml = '';
    if (af.geoMode === 'global') {
      regionalStripHtml = '<div style="margin-bottom:6px" class="section-mini-title">' + esc(at.regionalLabel) + '</div>' +
        '<div class="region-strip">' +
        REGIONS.map(function(reg) {
          var regEntries = slice.filter(function(e) { return e.jurisdiction.region.en === reg; });
          var pct = slice.length > 0 ? ((regEntries.length / slice.length) * 100).toFixed(1) : '0.0';
          var dKey = registerDrill({
            title: { pt: REGION_LABELS[reg].pt, en: REGION_LABELS[reg].en },
            entries: regEntries,
            explorerPatch: mergeObj(basePatch, { region: reg })
          });
          return '<button type="button" class="region-card" data-action="open-drill" data-drill="' + dKey + '"' + (regEntries.length === 0 ? ' disabled' : '') + '>' +
            '<div class="region-name">' + esc(REGION_LABELS[reg][lang]) + '</div>' +
            '<div class="region-val tabular-nums">' + regEntries.length + ' <span style="font-size:12px;font-weight:500;color:#64748b">(' + pct + '%)</span></div>' +
          '</button>';
        }).join('') +
        '</div>';
    }

    // Build rows
    var rows = [];
    var working;
    if (af.geoMode === 'global') {
      working = af.excludeUs ? slice.filter(function(e) { return e.jurisdiction.countryCode !== 'US'; }) : slice;
      var cMap = {};
      for (var i = 0; i < working.length; i++) {
        var e = working[i];
        var cc = e.jurisdiction.countryCode;
        if (!cMap[cc]) {
          cMap[cc] = {
            key: cc,
            code: cc,
            labelPt: e.jurisdiction.country.pt,
            labelEn: e.jurisdiction.country.en,
            total: 0,
            byStatus: {},
            entries: [],
            patch: mergeObj(basePatch, { countryCode: cc })
          };
        }
        cMap[cc].total++;
        cMap[cc].byStatus[e.resource.status] = (cMap[cc].byStatus[e.resource.status] || 0) + 1;
        cMap[cc].entries.push(e);
      }
      rows = Object.keys(cMap).map(function(k) { return cMap[k]; });
    } else {
      working = slice.filter(function(e) { return e.jurisdiction.countryCode === 'US'; });
      var sMap = {};
      for (var j = 0; j < working.length; j++) {
        var ue = working[j];
        var sub = ue.jurisdiction.subdivision;
        var sk = sub ? sub.en : US_FEDERAL_KEY;
        if (!sMap[sk]) {
          sMap[sk] = {
            key: sk,
            code: 'US',
            labelPt: sub ? sub.pt : I18N.pt.analytics.federalLabel,
            labelEn: sub ? sub.en : I18N.en.analytics.federalLabel,
            total: 0,
            byStatus: {},
            entries: [],
            patch: sub ? mergeObj(basePatch, { countryCode: 'US', subdivision: sub.en }) : mergeObj(basePatch, { countryCode: 'US' })
          };
        }
        sMap[sk].total++;
        sMap[sk].byStatus[ue.resource.status] = (sMap[sk].byStatus[ue.resource.status] || 0) + 1;
        sMap[sk].entries.push(ue);
      }
      rows = Object.keys(sMap).map(function(k) { return sMap[k]; });
    }

    rows.sort(function(a, b) {
      if (b.total !== a.total) return b.total - a.total;
      return compareStrings(lang === 'pt' ? a.labelPt : a.labelEn, lang === 'pt' ? b.labelPt : b.labelEn, lang);
    });

    var maxTotal = rows.length > 0 ? rows[0].total : 1;
    var denom = working.length || 1;

    var barsHtml;
    if (rows.length === 0) {
      barsHtml = '<p style="color:#64748b;text-align:center;padding:20px 0">' + esc(af.geoMode === 'us' ? at.emptyUsSlice : at.emptySlice) + '</p>';
    } else {
      barsHtml = '<div class="hbar-list">' + rows.map(function(row) {
        var rowLabel = lang === 'pt' ? row.labelPt : row.labelEn;
        var rowDrillKey = registerDrill({
          title: { pt: row.labelPt, en: row.labelEn },
          entries: row.entries,
          explorerPatch: row.patch
        });
        var widthPct = (row.total / maxTotal) * 100;
        var segsHtml = ALL_STATUSES.map(function(st) {
          var count = row.byStatus[st] || 0;
          if (!count) return '';
          var segPct = (count / row.total) * widthPct;
          var segEntries = row.entries.filter(function(e) { return e.resource.status === st; });
          var segDrillKey = registerDrill({
            title: {
              pt: row.labelPt + ' \\u00b7 ' + STATUS_LABELS[st].pt,
              en: row.labelEn + ' \\u00b7 ' + STATUS_LABELS[st].en
            },
            entries: segEntries,
            explorerPatch: mergeObj(row.patch, { status: st })
          });
          var tip = esc(rowLabel + ' \\u00b7 ' + STATUS_LABELS[st][lang] + ': ' + count + ' ' + at.entriesUnit);
          return '<button type="button" class="hbar-seg" style="width:' + segPct.toFixed(2) + '%;background:' + STATUS_COLORS[st] + '" data-action="open-drill" data-drill="' + segDrillKey + '" data-tip="' + tip + '"></button>';
        }).join('');

        var share = ((row.total / denom) * 100).toFixed(1);
        return '' +
          '<div class="hbar-row">' +
            '<button type="button" class="hbar-label-btn" data-action="open-drill" data-drill="' + rowDrillKey + '" title="' + esc(rowLabel) + '">' +
              (af.geoMode === 'global' ? '<span class="country-code">' + esc(row.code) + '</span>' : '') +
              '<span>' + esc(rowLabel) + '</span>' +
            '</button>' +
            '<div class="hbar-track">' + segsHtml + '</div>' +
            '<div class="hbar-val tabular-nums">' + row.total + ' <span style="color:#94a3b8;font-weight:500">(' + share + '%)</span></div>' +
          '</div>';
      }).join('') + '</div>';
    }

    return '' +
      '<section class="card card-pad">' +
        '<div class="chart-header">' +
          '<div>' +
            '<h2 class="chart-title">' + esc(at.geoTitle) + '</h2>' +
            '<p class="chart-sub">' + esc(at.geoSub) + '</p>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
            '<div class="seg-toggle">' +
              '<button type="button" class="seg-btn' + (af.geoMode === 'global' ? ' active' : '') + '" data-action="an-geo-mode" data-val="global">' + esc(at.geoGlobal) + '</button>' +
              '<button type="button" class="seg-btn' + (af.geoMode === 'us' ? ' active' : '') + '" data-action="an-geo-mode" data-val="us">' + esc(at.geoUs) + '</button>' +
            '</div>' +
            (af.geoMode === 'global'
              ? '<button type="button" class="btn btn-sm' + (af.excludeUs ? ' btn-dark' : '') + '" data-action="an-toggle-exclude-us">' +
                  (af.excludeUs ? '\\u2713 ' : '') + esc(at.excludeUs) +
                '</button>'
              : '') +
          '</div>' +
        '</div>' +
        regionalStripHtml +
        statusLegend +
        barsHtml +
      '</section>';
  }

  function buildChronologicalVizHtml(slice, basePatch, at, lang) {
    var stackBy = state.analytics.timelineStack;
    var segKeys = stackBy === 'status' ? ALL_STATUSES : ALL_ISSUERS;
    var segColors = stackBy === 'status' ? STATUS_COLORS : ISSUER_COLORS;
    var segLabels = stackBy === 'status' ? STATUS_LABELS : ISSUER_LABELS;

    var yearSet = {};
    for (var i = 0; i < CANONICAL_YEARS.length; i++) yearSet[CANONICAL_YEARS[i]] = true;
    for (var j = 0; j < slice.length; j++) {
      if (slice[j].resource.year !== null) yearSet[slice[j].resource.year] = true;
    }
    var sortedYears = Object.keys(yearSet).map(Number).sort(function(a, b) { return a - b; });

    function makeBucket(key, yearVal, isUndated, entries) {
      var segs = segKeys.map(function(sk) {
        var matching = entries.filter(function(e) {
          return stackBy === 'status' ? e.resource.status === sk : e.issuer.category === sk;
        });
        return { key: sk, count: matching.length, entries: matching };
      });
      return { key: key, year: yearVal, isUndated: isUndated, total: entries.length, segments: segs, entries: entries };
    }

    var buckets = sortedYears.map(function(yr) {
      return makeBucket(String(yr), yr, false, slice.filter(function(e) { return e.resource.year === yr; }));
    });
    buckets.push(makeBucket('not_specified', null, true, slice.filter(function(e) { return e.resource.year === null; })));

    var maxVal = 1;
    for (var b = 0; b < buckets.length; b++) {
      if (buckets[b].total > maxVal) maxVal = buckets[b].total;
    }
    var yMax = Math.ceil(maxVal / 5) * 5;
    if (yMax < 5) yMax = 5;

    var svgW = 760;
    var svgH = 290;
    var padL = 42;
    var padR = 20;
    var padT = 26;
    var padB = 46;
    var plotW = svgW - padL - padR;
    var plotH = svgH - padT - padB;
    var nCols = buckets.length;
    var colSlot = plotW / nCols;
    var barW = Math.min(54, colSlot * 0.56);

    var gridHtml = '';
    for (var g = 0; g <= 4; g++) {
      var val = Math.round((yMax / 4) * g);
      var gy = padT + plotH - (val / yMax) * plotH;
      gridHtml += '<line x1="' + padL + '" y1="' + gy.toFixed(1) + '" x2="' + (svgW - padR) + '" y2="' + gy.toFixed(1) + '" stroke="#e2e8f0" stroke-dasharray="' + (g === 0 ? '' : '3,3') + '" />';
      gridHtml += '<text x="' + (padL - 8) + '" y="' + (gy + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="#64748b">' + val + '</text>';
    }

    // Dashed separator before Undated column
    var sepX = padL + (nCols - 1) * colSlot;
    var sepHtml = '<line x1="' + sepX.toFixed(1) + '" y1="' + (padT - 8) + '" x2="' + sepX.toFixed(1) + '" y2="' + (padT + plotH + 14) + '" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4" />';

    var barsSvg = '';
    for (var idx = 0; idx < buckets.length; idx++) {
      var bkt = buckets[idx];
      var cx = padL + idx * colSlot + colSlot / 2;
      var bx = cx - barW / 2;
      var curY = padT + plotH;

      var yearPatch = bkt.isUndated ? { year: 'not_specified' } : { year: String(bkt.year) };
      var colDrillKey = registerDrill({
        title: bkt.isUndated
          ? { pt: I18N.pt.analytics.undatedLabel, en: I18N.en.analytics.undatedLabel }
          : { pt: 'Ano ' + bkt.year, en: 'Year ' + bkt.year },
        entries: bkt.entries,
        explorerPatch: mergeObj(basePatch, yearPatch)
      });

      var tipLines = [(bkt.isUndated ? at.undatedLabel : String(bkt.year)) + ' — ' + at.totalLabel + ': ' + bkt.total];
      for (var s = 0; s < bkt.segments.length; s++) {
        var sg = bkt.segments[s];
        if (!sg.count) continue;
        tipLines.push(segLabels[sg.key][lang] + ': ' + sg.count);
      }
      var colTip = esc(tipLines.join(' | '));

      for (var s2 = 0; s2 < bkt.segments.length; s2++) {
        var seg = bkt.segments[s2];
        if (!seg.count) continue;
        var sh = (seg.count / yMax) * plotH;
        curY -= sh;
        var segPatch = stackBy === 'status'
          ? mergeObj(basePatch, mergeObj(yearPatch, { status: seg.key }))
          : mergeObj(basePatch, mergeObj(yearPatch, { issuerCategory: seg.key }));
        var segDrillKey = registerDrill({
          title: {
            pt: (bkt.isUndated ? I18N.pt.analytics.undatedLabel : String(bkt.year)) + ' \\u00b7 ' + segLabels[seg.key].pt,
            en: (bkt.isUndated ? I18N.en.analytics.undatedLabel : String(bkt.year)) + ' \\u00b7 ' + segLabels[seg.key].en
          },
          entries: seg.entries,
          explorerPatch: segPatch
        });
        barsSvg += '<rect class="svg-bar-rect" x="' + bx.toFixed(1) + '" y="' + curY.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + Math.max(1.5, sh).toFixed(1) + '" fill="' + segColors[seg.key] + '" rx="2" data-action="open-drill" data-drill="' + segDrillKey + '" data-tip="' + colTip + '" />';
      }

      // Count label on top
      if (bkt.total > 0) {
        barsSvg += '<text x="' + cx.toFixed(1) + '" y="' + (curY - 6).toFixed(1) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0f172a" style="cursor:pointer" data-action="open-drill" data-drill="' + colDrillKey + '">' + bkt.total + '</text>';
      } else {
        barsSvg += '<text x="' + cx.toFixed(1) + '" y="' + (padT + plotH - 6).toFixed(1) + '" text-anchor="middle" font-size="10.5" fill="#94a3b8">0</text>';
      }

      // X-axis label
      var xLabel = bkt.isUndated ? at.undatedShort : String(bkt.year);
      barsSvg += '<text x="' + cx.toFixed(1) + '" y="' + (padT + plotH + 22).toFixed(1) + '" text-anchor="middle" font-size="11.5" font-weight="' + (bkt.isUndated ? '700' : '600') + '" fill="' + (bkt.isUndated ? '#475569' : '#334155') + '">' + esc(xLabel) + '</text>';
    }

    var legendHtml = '<div class="legend-row">' + segKeys.map(function(sk) {
      return '<span class="legend-item"><span class="legend-dot" style="background:' + segColors[sk] + '"></span>' + esc(segLabels[sk][lang]) + '</span>';
    }).join('') + '</div>';

    return '' +
      '<section class="card card-pad">' +
        '<div class="chart-header">' +
          '<div>' +
            '<h2 class="chart-title">' + esc(at.timeTitle) + '</h2>' +
            '<p class="chart-sub">' + esc(at.timeSub) + '</p>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
            '<span style="font-size:12px;color:#64748b;font-weight:600">' + esc(at.stackBy) + '</span>' +
            '<div class="seg-toggle">' +
              '<button type="button" class="seg-btn' + (stackBy === 'status' ? ' active' : '') + '" data-action="an-time-stack" data-val="status">' + esc(at.stackStatus) + '</button>' +
              '<button type="button" class="seg-btn' + (stackBy === 'issuer' ? ' active' : '') + '" data-action="an-time-stack" data-val="issuer">' + esc(at.stackIssuer) + '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        legendHtml +
        '<div class="svg-wrap">' +
          '<svg class="timeline-svg" viewBox="0 0 ' + svgW + ' ' + svgH + '" role="img" aria-label="' + esc(at.timeTitle) + '">' +
            gridHtml + sepHtml + barsSvg +
          '</svg>' +
        '</div>' +
      '</section>';
  }

  function buildRiskIncidenceVizHtml(slice, basePatch, at, lang) {
    var map = {};
    for (var i = 0; i < ALL_RISK_CODES.length; i++) map[ALL_RISK_CODES[i]] = [];
    var naEntries = [];
    for (var j = 0; j < slice.length; j++) {
      var e = slice[j];
      if (e.risks.length === 0) {
        naEntries.push(e);
      } else {
        var seen = {};
        for (var r = 0; r < e.risks.length; r++) {
          var rc = e.risks[r].code;
          if (!seen[rc]) {
            seen[rc] = true;
            if (map[rc]) map[rc].push(e);
          }
        }
      }
    }

    var items = ALL_RISK_CODES.map(function(code) {
      return { code: code, entries: map[code], count: map[code].length };
    }).sort(function(a, b) { return b.count - a.count; });

    var maxCount = Math.max(naEntries.length, items.length ? items[0].count : 0, 1);
    var denom = slice.length || 1;

    var rowsHtml = items.map(function(item) {
      var pct = ((item.count / denom) * 100).toFixed(1);
      var w = (item.count / maxCount) * 100;
      var dKey = registerDrill({
        title: { pt: RISK_LABELS[item.code].pt, en: RISK_LABELS[item.code].en },
        entries: item.entries,
        explorerPatch: mergeObj(basePatch, { risk: item.code })
      });
      return '' +
        '<div class="hbar-row">' +
          '<button type="button" class="hbar-label-btn" data-action="open-drill" data-drill="' + dKey + '"' + (item.count === 0 ? ' disabled' : '') + ' title="' + esc(RISK_LABELS[item.code][lang]) + '">' +
            esc(RISK_LABELS[item.code][lang]) +
          '</button>' +
          '<div class="hbar-track">' +
            '<button type="button" class="hbar-seg" style="width:' + w.toFixed(2) + '%;background:#4338ca" data-action="open-drill" data-drill="' + dKey + '"' + (item.count === 0 ? ' disabled' : '') + ' data-tip="' + esc(RISK_LABELS[item.code][lang] + ': ' + item.count + ' (' + pct + '%)') + '"></button>' +
          '</div>' +
          '<div class="hbar-val tabular-nums">' + item.count + ' <span style="color:#94a3b8;font-weight:500">(' + pct + '%)</span></div>' +
        '</div>';
    }).join('');

    var naPct = ((naEntries.length / denom) * 100).toFixed(1);
    var naW = (naEntries.length / maxCount) * 100;
    var naDrillKey = registerDrill({
      title: { pt: I18N.pt.analytics.naBarLabel, en: I18N.en.analytics.naBarLabel },
      entries: naEntries,
      explorerPatch: mergeObj(basePatch, { risk: 'na_no_risks' })
    });

    return '' +
      '<section class="card card-pad">' +
        '<div class="chart-header">' +
          '<div>' +
            '<h2 class="chart-title">' + esc(at.risksTitle) + '</h2>' +
            '<p class="chart-sub">' + esc(at.risksSub) + '</p>' +
            '<p style="margin:4px 0 0;font-size:11.5px;color:#64748b;font-style:italic">' + esc(at.multiRiskNote) + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="hbar-list">' + rowsHtml + '</div>' +
        '<div class="na-divider">' + esc(at.naDivider) + '</div>' +
        '<div class="hbar-row">' +
          '<button type="button" class="hbar-label-btn" data-action="open-drill" data-drill="' + naDrillKey + '"' + (naEntries.length === 0 ? ' disabled' : '') + ' title="' + esc(at.naBarLabel) + '">' +
            esc(at.naBarLabel) +
          '</button>' +
          '<div class="hbar-track">' +
            '<button type="button" class="hbar-seg" style="width:' + naW.toFixed(2) + '%;background:#64748b" data-action="open-drill" data-drill="' + naDrillKey + '"' + (naEntries.length === 0 ? ' disabled' : '') + ' data-tip="' + esc(at.naBarLabel + ': ' + naEntries.length + ' (' + naPct + '%)') + '"></button>' +
          '</div>' +
          '<div class="hbar-val tabular-nums">' + naEntries.length + ' <span style="color:#94a3b8;font-weight:500">(' + naPct + '%)</span></div>' +
        '</div>' +
      '</section>';
  }

  function heatColor(count, maxVal, isNa) {
    if (!count) return { bg: 'transparent', fg: '#cbd5e1' };
    var ratio = Math.min(1, count / Math.max(1, maxVal));
    if (isNa) {
      if (ratio < 0.25) return { bg: '#f1f5f9', fg: '#334155' };
      if (ratio < 0.5) return { bg: '#e2e8f0', fg: '#1e293b' };
      if (ratio < 0.75) return { bg: '#94a3b8', fg: '#ffffff' };
      return { bg: '#475569', fg: '#ffffff' };
    }
    if (ratio < 0.2) return { bg: '#eef2ff', fg: '#3730a3' };
    if (ratio < 0.4) return { bg: '#c7d2fe', fg: '#312e81' };
    if (ratio < 0.65) return { bg: '#818cf8', fg: '#ffffff' };
    if (ratio < 0.85) return { bg: '#4f46e5', fg: '#ffffff' };
    return { bg: '#312e81', fg: '#ffffff' };
  }

  function buildHeatmapVizHtml(slice, basePatch, at, lang) {
    var mode = state.analytics.heatmapMode;
    var groups = [];

    if (mode === 'region') {
      groups = REGIONS.map(function(reg) {
        return {
          key: reg,
          labelPt: REGION_LABELS[reg].pt,
          labelEn: REGION_LABELS[reg].en,
          entries: slice.filter(function(e) { return e.jurisdiction.region.en === reg; }),
          patch: mergeObj(basePatch, { region: reg })
        };
      });
    } else if (mode === 'countries') {
      var cMap = {};
      for (var i = 0; i < slice.length; i++) {
        var e = slice[i];
        var cc = e.jurisdiction.countryCode;
        if (!cMap[cc]) {
          cMap[cc] = {
            key: cc,
            code: cc,
            labelPt: e.jurisdiction.country.pt,
            labelEn: e.jurisdiction.country.en,
            entries: [],
            patch: mergeObj(basePatch, { countryCode: cc })
          };
        }
        cMap[cc].entries.push(e);
      }
      groups = Object.keys(cMap).map(function(k) { return cMap[k]; })
        .sort(function(a, b) { return b.entries.length - a.entries.length || compareStrings(a.labelEn, b.labelEn, 'en'); })
        .slice(0, 15);
    } else {
      var usSlice = slice.filter(function(e) { return e.jurisdiction.countryCode === 'US'; });
      var sMap = {};
      for (var j = 0; j < usSlice.length; j++) {
        var ue = usSlice[j];
        var sub = ue.jurisdiction.subdivision;
        var sk = sub ? sub.en : US_FEDERAL_KEY;
        if (!sMap[sk]) {
          sMap[sk] = {
            key: sk,
            labelPt: sub ? sub.pt : I18N.pt.analytics.federalLabel,
            labelEn: sub ? sub.en : I18N.en.analytics.federalLabel,
            entries: [],
            patch: sub ? mergeObj(basePatch, { countryCode: 'US', subdivision: sub.en }) : mergeObj(basePatch, { countryCode: 'US' })
          };
        }
        sMap[sk].entries.push(ue);
      }
      groups = Object.keys(sMap).map(function(k) { return sMap[k]; })
        .sort(function(a, b) { return b.entries.length - a.entries.length || compareStrings(a.labelEn, b.labelEn, 'en'); })
        .slice(0, 15);
    }

    var allCols = ALL_RISK_CODES.concat(['na_no_risks']);
    var colTotals = {};
    for (var c = 0; c < allCols.length; c++) colTotals[allCols[c]] = 0;

    var maxCell = 1;
    var matrix = groups.map(function(grp) {
      var cellMap = {};
      for (var c2 = 0; c2 < allCols.length; c2++) cellMap[allCols[c2]] = [];
      for (var m = 0; m < grp.entries.length; m++) {
        var en = grp.entries[m];
        if (en.risks.length === 0) {
          cellMap.na_no_risks.push(en);
          colTotals.na_no_risks++;
        } else {
          var seen = {};
          for (var r = 0; r < en.risks.length; r++) {
            var rc = en.risks[r].code;
            if (!seen[rc]) {
              seen[rc] = true;
              if (cellMap[rc]) {
                cellMap[rc].push(en);
                colTotals[rc]++;
              }
            }
          }
        }
      }
      for (var c3 = 0; c3 < allCols.length; c3++) {
        if (cellMap[allCols[c3]].length > maxCell) maxCell = cellMap[allCols[c3]].length;
      }
      return { grp: grp, cells: cellMap };
    });

    var tableHtml;
    if (groups.length === 0 || slice.length === 0) {
      tableHtml = '<p style="color:#64748b;text-align:center;padding:24px 0">' + esc(at.hmEmpty) + '</p>';
    } else {
      var headCols = allCols.map(function(col) {
        var isNa = col === 'na_no_risks';
        var shortLabel = isNa ? at.hmNaShort : RISK_SHORT[col][lang];
        var fullLabel = isNa ? at.hmNaFull : RISK_LABELS[col][lang];
        return '<th class="hm-col-head' + (isNa ? ' hm-na-col' : '') + '" title="' + esc(fullLabel) + '">' +
          '<div>' + esc(shortLabel) + '</div>' +
          '<span class="hm-col-total tabular-nums">' + colTotals[col] + '</span>' +
        '</th>';
      }).join('');

      var bodyRows = matrix.map(function(row) {
        var g = row.grp;
        var rowLabel = lang === 'pt' ? g.labelPt : g.labelEn;
        var rowDrillKey = registerDrill({
          title: { pt: g.labelPt, en: g.labelEn },
          entries: g.entries,
          explorerPatch: g.patch
        });

        var cellsHtml = allCols.map(function(col) {
          var isNa = col === 'na_no_risks';
          var cellEntries = row.cells[col];
          var cnt = cellEntries.length;
          if (!cnt) {
            return '<td class="' + (isNa ? 'hm-na-col' : '') + '"><span class="hm-cell-zero">0</span></td>';
          }
          var colStyle = heatColor(cnt, maxCell, isNa);
          var rowPct = g.entries.length > 0 ? ((cnt / g.entries.length) * 100).toFixed(1) : '0.0';
          var colPct = colTotals[col] > 0 ? ((cnt / colTotals[col]) * 100).toFixed(1) : '0.0';
          var colNamePt = isNa ? I18N.pt.analytics.hmNaFull : RISK_LABELS[col].pt;
          var colNameEn = isNa ? I18N.en.analytics.hmNaFull : RISK_LABELS[col].en;
          var colName = lang === 'pt' ? colNamePt : colNameEn;
          var cellDrillKey = registerDrill({
            title: { pt: g.labelPt + ' \\u00d7 ' + colNamePt, en: g.labelEn + ' \\u00d7 ' + colNameEn },
            entries: cellEntries,
            explorerPatch: mergeObj(g.patch, { risk: isNa ? 'na_no_risks' : col })
          });
          var tip = esc(rowLabel + ' \\u00d7 ' + colName + ' | ' + cnt + ' ' + at.entriesUnit + ' | ' + at.hmRowPct + ': ' + rowPct + '% | ' + at.hmColPct + ': ' + colPct + '%');
          return '<td class="' + (isNa ? 'hm-na-col' : '') + '">' +
            '<button type="button" class="hm-cell-btn tabular-nums" style="background:' + colStyle.bg + ';color:' + colStyle.fg + '" data-action="open-drill" data-drill="' + cellDrillKey + '" data-tip="' + tip + '">' + cnt + '</button>' +
          '</td>';
        }).join('');

        return '<tr>' +
          '<td class="hm-sticky">' +
            '<button type="button" class="hbar-label-btn" data-action="open-drill" data-drill="' + rowDrillKey + '"' + (g.entries.length === 0 ? ' disabled' : '') + '>' +
              (g.code ? '<span class="country-code">' + esc(g.code) + '</span>' : '') +
              '<span>' + esc(rowLabel) + '</span>' +
            '</button>' +
          '</td>' +
          '<td class="tabular-nums" style="font-weight:700;background:#f8fafc">' + g.entries.length + '</td>' +
          cellsHtml +
        '</tr>';
      }).join('');

      tableHtml = '' +
        '<div class="heatmap-scroll">' +
          '<table class="heatmap-table">' +
            '<thead><tr>' +
              '<th class="hm-sticky">' + esc(mode === 'region' ? at.hmRegion : (mode === 'countries' ? at.hmCountries : at.hmUsStates)) + '</th>' +
              '<th>' + esc(at.hmTotalCol) + '</th>' +
              headCols +
            '</tr></thead>' +
            '<tbody>' + bodyRows + '</tbody>' +
          '</table>' +
        '</div>';
    }

    return '' +
      '<section class="card card-pad">' +
        '<div class="chart-header">' +
          '<div>' +
            '<h2 class="chart-title">' + esc(at.hmTitle) + '</h2>' +
            '<p class="chart-sub">' + esc(at.hmSub) + '</p>' +
          '</div>' +
          '<div class="seg-toggle">' +
            '<button type="button" class="seg-btn' + (mode === 'region' ? ' active' : '') + '" data-action="an-hm-mode" data-val="region">' + esc(at.hmRegion) + '</button>' +
            '<button type="button" class="seg-btn' + (mode === 'countries' ? ' active' : '') + '" data-action="an-hm-mode" data-val="countries">' + esc(at.hmCountries) + '</button>' +
            '<button type="button" class="seg-btn' + (mode === 'us_states' ? ' active' : '') + '" data-action="an-hm-mode" data-val="us_states">' + esc(at.hmUsStates) + '</button>' +
          '</div>' +
        '</div>' +
        tableHtml +
      '</section>';
  }

  function buildStage3Html() {
    var lang = state.lang;
    var t = I18N[lang].stage3;
    var m = state.monitor;
    var stats = computeDiffStats();

    var pending = 0, binding = 0, allBills = 0;
    for (var i = 0; i < state.entries.length; i++) {
      var st = state.entries[i].resource.status;
      if (st === 'pending_bill') pending++;
      if (st === 'enacted_law' || st === 'court_rule_order') binding++;
      if (isLeg(state.entries[i])) allBills++;
    }

    var kpiHtml = '' +
      '<div class="kpi-grid">' +
        '<div class="kpi-card">' +
          '<div class="kpi-label">' + esc(t.kpiTotal) + '</div>' +
          '<div class="kpi-value tabular-nums">' + stats.totalActive + '</div>' +
          '<div class="kpi-sub">' + esc(t.kpiTotalSub(stats.baselineCount, stats.customAdded)) + '</div>' +
        '</div>' +
        '<div class="kpi-card">' +
          '<div class="kpi-label" style="color:#b45309">' + esc(t.kpiPending) + '</div>' +
          '<div class="kpi-value tabular-nums" style="color:#b45309">' + pending + '</div>' +
          '<div class="kpi-sub">' + esc(t.kpiPendingSub) + '</div>' +
        '</div>' +
        '<div class="kpi-card">' +
          '<div class="kpi-label" style="color:#3730a3">' + esc(t.kpiBinding) + '</div>' +
          '<div class="kpi-value tabular-nums">' + binding + '</div>' +
          '<div class="kpi-sub">' + esc(t.kpiBindingSub) + '</div>' +
        '</div>' +
        '<div class="kpi-card">' +
          '<div class="kpi-label" style="color:#047857">' + esc(t.kpiMods) + '</div>' +
          '<div class="kpi-value tabular-nums" style="color:#047857">' + stats.totalMods + '</div>' +
          '<div class="kpi-sub">' + esc(t.kpiModsSub(stats.modifiedBase, stats.customAdded)) + '</div>' +
        '</div>' +
      '</div>';

    var toolbarHtml = '' +
      '<section class="card card-pad">' +
        '<div class="toolbar-row">' +
          '<div>' +
            '<h2 class="chart-title">' + esc(t.toolbarTitle) + '</h2>' +
            '<p class="chart-sub">' + esc(t.toolbarSub) + '</p>' +
          '</div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:8px">' +
            '<button type="button" class="btn btn-primary" data-action="mon-add-new">' + esc(t.addNew) + '</button>' +
            '<button type="button" class="btn" data-action="mon-export-json">' + esc(t.exportJson) + '</button>' +
            '<button type="button" class="btn" data-action="mon-trigger-import">' + esc(t.importJson) + '</button>' +
            '<input id="mon-import-file" type="file" accept=".json,application/json" style="display:none" />' +
            '<button type="button" class="btn btn-danger" data-action="mon-open-reset">' + esc(t.resetBaseline) + '</button>' +
          '</div>' +
        '</div>' +
        (m.importError ? '<div class="alert-error" style="margin-top:12px">' + esc(m.importError) + '</div>' : '') +
      '</section>';

    // Watchlist filtering
    var q = norm(m.search);
    var wlList = state.entries.filter(function(e) {
      if (m.watchlistMode === 'pending' && e.resource.status !== 'pending_bill') return false;
      if (m.watchlistMode === 'all_bills' && !isLeg(e)) return false;
      if (q) {
        var hay = norm([
          e.resource.title.en, e.resource.title.pt,
          e.jurisdiction.country.en, e.jurisdiction.country.pt,
          e.jurisdiction.subdivision ? e.jurisdiction.subdivision.en : '',
          e.jurisdiction.subdivision ? e.jurisdiction.subdivision.pt : '',
          e.issuer.name.en, e.issuer.name.pt
        ].join(' '));
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    var wlRowsHtml = wlList.length === 0
      ? '<div style="padding:32px 20px;text-align:center;color:#64748b;font-size:13px">' + esc(t.wlEmpty) + '</div>'
      : wlList.map(function(e) {
          var isAdded = Boolean(stats.addedMap[e.id]);
          var isMod = Boolean(stats.modMap[e.id]);
          return '' +
            '<div class="watchlist-row">' +
              '<div class="watchlist-main">' +
                '<div class="jurisdiction-line">' +
                  '<span class="country-code">' + esc(e.jurisdiction.countryCode) + '</span>' +
                  '<span>' + esc(flagFromCode(e.jurisdiction.countryCode)) + ' ' + esc(e.jurisdiction.country[lang]) +
                    (e.jurisdiction.subdivision ? ' \\u00b7 ' + esc(e.jurisdiction.subdivision[lang]) : '') +
                  '</span>' +
                  '<span class="badge st-' + esc(e.resource.status) + '">' + esc(STATUS_LABELS[e.resource.status][lang]) + '</span>' +
                  '<span class="badge badge-muted">' + esc(e.resource.dateDisplay[lang]) + ' \\u00b7 ' + esc(e.sourcePage > 0 ? I18N[lang].card.sourcePage(e.sourcePage) : t.wlPostTracker) + '</span>' +
                  (isAdded ? '<span class="badge act-created">' + esc(t.wlCustomTag) + '</span>' : '') +
                  (isMod ? '<span class="badge act-updated">' + esc(t.wlModTag) + '</span>' : '') +
                '</div>' +
                '<div style="font-weight:700;font-size:14px">' + esc(e.resource.title[lang]) + '</div>' +
                '<div style="font-size:12px;color:#64748b">' + esc(e.issuer.name[lang]) + ' \\u00b7 ' + esc(ISSUER_LABELS[e.issuer.category][lang]) + '</div>' +
              '</div>' +
              '<button type="button" class="btn btn-sm" data-action="mon-edit" data-id="' + esc(e.id) + '">' + esc(t.wlEdit) + '</button>' +
            '</div>';
        }).join('');

    var watchlistHtml = '' +
      '<section class="card" style="overflow:hidden">' +
        '<div class="card-pad" style="background:#f8fafc">' +
          '<div class="chart-header" style="margin-bottom:10px">' +
            '<div>' +
              '<h2 class="chart-title">' + esc(t.wlTitle) + '</h2>' +
              '<p class="chart-sub">' + esc(t.wlSub) + '</p>' +
            '</div>' +
            '<div class="seg-toggle">' +
              '<button type="button" class="seg-btn' + (m.watchlistMode === 'pending' ? ' active' : '') + '" data-action="mon-wl-mode" data-val="pending">' + esc(t.wlPending) + ' (' + pending + ')</button>' +
              '<button type="button" class="seg-btn' + (m.watchlistMode === 'all_bills' ? ' active' : '') + '" data-action="mon-wl-mode" data-val="all_bills">' + esc(t.wlBills) + ' (' + allBills + ')</button>' +
              '<button type="button" class="seg-btn' + (m.watchlistMode === 'all_records' ? ' active' : '') + '" data-action="mon-wl-mode" data-val="all_records">' + esc(t.wlAll) + ' (' + state.entries.length + ')</button>' +
            '</div>' +
          '</div>' +
          '<div class="search-wrap" style="margin-top:0">' +
            '<input id="mon-search-input" class="search-input" type="text" value="' + esc(m.search) + '" placeholder="' + esc(t.wlSearch) + '" />' +
            (m.search ? '<button type="button" class="search-clear" data-action="mon-clear-search">\\u00d7</button>' : '') +
          '</div>' +
        '</div>' +
        '<div class="watchlist-items">' + wlRowsHtml + '</div>' +
      '</section>';

    var offlineGeminiNoticeHtml = '' +
      '<section class="card card-pad">' +
        '<h2 class="chart-title" style="margin-bottom:10px">' + esc(t.offlineTitle) + '</h2>' +
        '<div class="offline-notice-box">' + esc(t.offlineBody) + '</div>' +
      '</section>';

    // Audit Log
    var auditBodyHtml = '';
    if (m.auditOpen) {
      if (!state.auditLog.length) {
        auditBodyHtml = '<div style="padding:24px;text-align:center;color:#64748b;font-size:12.5px">' + esc(t.auditEmpty) + '</div>';
      } else {
        auditBodyHtml = '<div style="overflow-x:auto"><table class="audit-table"><thead><tr>' +
          '<th>' + esc(t.colTime) + '</th><th>' + esc(t.colAction) + '</th><th>' + esc(t.colJur) + '</th><th>' + esc(t.colRec) + '</th><th>' + esc(t.colSum) + '</th>' +
          '</tr></thead><tbody>' +
          state.auditLog.map(function(a) {
            var ts = a.timestamp;
            try { ts = new Date(a.timestamp).toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US'); } catch (_e) {}
            return '<tr>' +
              '<td class="tabular-nums" style="white-space:nowrap;font-family:monospace;font-size:11px">' + esc(ts) + '</td>' +
              '<td><span class="badge act-' + esc(a.action) + '">' + esc(t.actions[a.action] || a.action) + '</span></td>' +
              '<td>' + esc(a.jurisdiction ? a.jurisdiction[lang] : '') + '</td>' +
              '<td style="font-weight:600">' + esc(a.entryTitle ? a.entryTitle[lang] : '') + '</td>' +
              '<td style="font-family:monospace;font-size:11px;color:#475569">' + esc(a.summary ? a.summary[lang] : '') + '</td>' +
            '</tr>';
          }).join('') +
          '</tbody></table></div>';
      }
    }

    var auditHtml = '' +
      '<section class="card" style="overflow:hidden">' +
        '<div class="card-pad" style="background:#f8fafc;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">' +
          '<div>' +
            '<h2 class="chart-title">' + esc(t.auditTitle) + ' <span class="badge badge-muted tabular-nums">' + state.auditLog.length + '</span></h2>' +
            '<p class="chart-sub">' + esc(t.auditSub) + '</p>' +
          '</div>' +
          '<button type="button" class="btn btn-sm" data-action="mon-toggle-audit">' + esc(m.auditOpen ? t.auditHide : t.auditShow) + '</button>' +
        '</div>' +
        auditBodyHtml +
      '</section>';

    return '<div class="section-stack">' + kpiHtml + toolbarHtml + watchlistHtml + offlineGeminiNoticeHtml + auditHtml + '</div>';
  }

  function buildStage3ModalsHtml() {
    var lang = state.lang;
    var t = I18N[lang].stage3;
    var m = state.monitor;
    var out = '';

    // Bilingual Normative Editor Modal
    if (m.editor) {
      var d = m.editor;
      out += '' +
        '<div class="modal-backdrop" data-action="mon-close-editor-bg">' +
          '<div class="modal-panel" style="max-width:920px" role="dialog" aria-modal="true">' +
            '<div class="modal-header">' +
              '<div>' +
                '<h2 class="chart-title">' + esc(d.mode === 'create' ? t.edCreate : t.edEdit) + '</h2>' +
                '<p class="chart-sub">' + esc(t.edSub) + '</p>' +
              '</div>' +
              '<button type="button" class="btn btn-sm" data-action="mon-close-editor">' + esc(t.edCancel) + '</button>' +
            '</div>' +
            '<form id="mon-editor-form" class="modal-body" style="display:flex;flex-direction:column;gap:18px">' +
              (m.editorError ? '<div class="alert-error">' + esc(m.editorError) + '</div>' : '') +
              '<fieldset class="fieldset-block">' +
                '<legend class="fieldset-legend">' + esc(t.edSecJur) + '</legend>' +
                '<div class="form-grid-4">' +
                  '<div class="field-group"><label class="field-label">' + esc(t.edCountryEn) + '</label><input class="text-input" data-ed-field="countryEn" value="' + esc(d.countryEn) + '" /></div>' +
                  '<div class="field-group"><label class="field-label">' + esc(t.edCountryPt) + '</label><input class="text-input" data-ed-field="countryPt" value="' + esc(d.countryPt) + '" /></div>' +
                  '<div class="field-group"><label class="field-label">' + esc(t.edCode) + '</label><input class="text-input" data-ed-field="countryCode" maxlength="6" value="' + esc(d.countryCode) + '" /></div>' +
                  '<div class="field-group"><label class="field-label">' + esc(t.edRegion) + '</label><select class="select-input" data-ed-field="regionEn">' +
                    REGIONS.map(function(r) { return '<option value="' + esc(r) + '"' + (d.regionEn === r ? ' selected' : '') + '>' + esc(REGION_LABELS[r][lang]) + '</option>'; }).join('') +
                  '</select></div>' +
                '</div>' +
                '<div class="form-grid-2">' +
                  '<div class="field-group"><label class="field-label">' + esc(t.edSubEn) + '</label><input class="text-input" data-ed-field="subEn" value="' + esc(d.subEn) + '" /></div>' +
                  '<div class="field-group"><label class="field-label">' + esc(t.edSubPt) + '</label><input class="text-input" data-ed-field="subPt" value="' + esc(d.subPt) + '" /></div>' +
                '</div>' +
              '</fieldset>' +
              '<fieldset class="fieldset-block">' +
                '<legend class="fieldset-legend">' + esc(t.edSecIss) + '</legend>' +
                '<div class="form-grid-3">' +
                  '<div class="field-group"><label class="field-label">' + esc(t.edIssEn) + '</label><input class="text-input" data-ed-field="issuerEn" value="' + esc(d.issuerEn) + '" /></div>' +
                  '<div class="field-group"><label class="field-label">' + esc(t.edIssPt) + '</label><input class="text-input" data-ed-field="issuerPt" value="' + esc(d.issuerPt) + '" /></div>' +
                  '<div class="field-group"><label class="field-label">' + esc(t.edIssCat) + '</label><select class="select-input" data-ed-field="issuerCategory">' +
                    ALL_ISSUERS.map(function(ic) { return '<option value="' + ic + '"' + (d.issuerCategory === ic ? ' selected' : '') + '>' + esc(ISSUER_LABELS[ic][lang]) + '</option>'; }).join('') +
                  '</select></div>' +
                '</div>' +
              '</fieldset>' +
              '<fieldset class="fieldset-block">' +
                '<legend class="fieldset-legend">' + esc(t.edSecRes) + '</legend>' +
                '<div class="form-grid-2">' +
                  '<div class="field-group"><label class="field-label">' + esc(t.edTitleEn) + '</label><input class="text-input" data-ed-field="titleEn" value="' + esc(d.titleEn) + '" /></div>' +
                  '<div class="field-group"><label class="field-label">' + esc(t.edTitlePt) + '</label><input class="text-input" data-ed-field="titlePt" value="' + esc(d.titlePt) + '" /></div>' +
                '</div>' +
                '<div class="form-grid-4">' +
                  '<div class="field-group"><label class="field-label">' + esc(t.edStatus) + '</label><select class="select-input" data-ed-field="status">' +
                    ALL_STATUSES.map(function(st) { return '<option value="' + st + '"' + (d.status === st ? ' selected' : '') + '>' + esc(STATUS_LABELS[st][lang]) + '</option>'; }).join('') +
                  '</select></div>' +
                  '<div class="field-group"><label class="field-label">' + esc(t.edDateEn) + '</label><input class="text-input" data-ed-field="dateEn" value="' + esc(d.dateEn) + '" placeholder="Nov. 2026" /></div>' +
                  '<div class="field-group"><label class="field-label">' + esc(t.edDatePt) + '</label><input class="text-input" data-ed-field="datePt" value="' + esc(d.datePt) + '" placeholder="Nov. de 2026" /></div>' +
                  '<div class="field-group"><label class="field-label">' + esc(t.edYear) + '</label><input class="text-input" type="number" data-ed-field="year" value="' + esc(d.year) + '" placeholder="2026" /></div>' +
                '</div>' +
                '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">' +
                  '<div class="field-group" style="width:220px"><label class="field-label">' + esc(t.edPage) + '</label><input class="text-input" type="number" min="0" data-ed-field="sourcePage" value="' + esc(d.sourcePage) + '" /></div>' +
                  '<label style="display:inline-flex;align-items:center;gap:6px;font-size:12px;cursor:pointer"><input type="checkbox" data-ed-mt="1"' + (d.isMt ? ' checked' : '') + ' /> ' + esc(t.edMt) + '</label>' +
                '</div>' +
              '</fieldset>' +
              '<fieldset class="fieldset-block">' +
                '<legend class="fieldset-legend">' + esc(t.edSecRisks) + '</legend>' +
                '<div class="risk-check-grid">' +
                  ALL_RISK_CODES.map(function(rc) {
                    var chk = d.risks.indexOf(rc) !== -1;
                    return '<label class="risk-check-item' + (chk ? ' checked' : '') + '">' +
                      '<input type="checkbox" data-ed-risk="' + rc + '"' + (chk ? ' checked' : '') + ' />' +
                      '<span>' + esc(RISK_LABELS[rc][lang]) + '</span>' +
                    '</label>';
                  }).join('') +
                '</div>' +
              '</fieldset>' +
              '<fieldset class="fieldset-block">' +
                '<div style="display:flex;align-items:center;justify-content:space-between">' +
                  '<legend class="fieldset-legend" style="width:auto;border:0;padding:0">' + esc(t.edSecRecs) + '</legend>' +
                  '<button type="button" class="link-btn" data-action="mon-ed-add-rec">' + esc(t.edAddRec) + '</button>' +
                '</div>' +
                d.recs.map(function(pair, idx) {
                  return '<div class="rec-pair-row">' +
                    '<textarea class="textarea-input" rows="2" data-ed-rec-idx="' + idx + '" data-ed-rec-lang="pt" placeholder="' + esc(t.edRecPtPh) + '">' + esc(pair.pt) + '</textarea>' +
                    '<textarea class="textarea-input" rows="2" data-ed-rec-idx="' + idx + '" data-ed-rec-lang="en" placeholder="' + esc(t.edRecEnPh) + '">' + esc(pair.en) + '</textarea>' +
                    '<button type="button" class="btn btn-sm" data-action="mon-ed-del-rec" data-idx="' + idx + '">\\u00d7</button>' +
                  '</div>';
                }).join('') +
              '</fieldset>' +
              '<div style="display:flex;justify-content:flex-end;gap:8px;padding-top:12px;border-top:1px solid #e2e8f0">' +
                '<button type="button" class="btn" data-action="mon-close-editor">' + esc(t.edCancel) + '</button>' +
                '<button type="submit" class="btn btn-primary">' + esc(t.edSave) + '</button>' +
              '</div>' +
            '</form>' +
          '</div>' +
        '</div>';
    }

    // Import Confirmation Modal
    if (m.pendingImport) {
      var pi = m.pendingImport;
      out += '' +
        '<div class="modal-backdrop">' +
          '<div class="modal-panel" style="max-width:460px" role="dialog" aria-modal="true">' +
            '<div class="modal-header"><h3 class="chart-title">' + esc(t.impTitle) + '</h3></div>' +
            '<div class="modal-body">' +
              '<p style="margin:0 0 16px;color:#475569;font-size:13px">' + esc(t.impSum(pi.total, pi.added, pi.updated, pi.unchanged)) + '</p>' +
              '<div style="display:flex;justify-content:flex-end;gap:8px">' +
                '<button type="button" class="btn" data-action="mon-cancel-import">' + esc(t.edCancel) + '</button>' +
                '<button type="button" class="btn btn-primary" data-action="mon-confirm-import">' + esc(t.impConfirm) + '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    // Reset Baseline Confirmation Modal
    if (m.resetConfirm) {
      out += '' +
        '<div class="modal-backdrop">' +
          '<div class="modal-panel" style="max-width:460px" role="dialog" aria-modal="true">' +
            '<div class="modal-header"><h3 class="chart-title">' + esc(t.resTitle) + '</h3></div>' +
            '<div class="modal-body">' +
              '<p style="margin:0 0 16px;color:#475569;font-size:13px">' + esc(t.resBody) + '</p>' +
              '<div style="display:flex;justify-content:flex-end;gap:8px">' +
                '<button type="button" class="btn" data-action="mon-cancel-reset">' + esc(t.edCancel) + '</button>' +
                '<button type="button" class="btn btn-danger-solid" data-action="mon-confirm-reset">' + esc(t.resConfirm) + '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    return out;
  }

  function getSelectedCompareEntries() {
    var byId = {};
    for (var i = 0; i < state.entries.length; i++) byId[state.entries[i].id] = state.entries[i];
    var out = [];
    for (var j = 0; j < state.compareIds.length; j++) {
      if (byId[state.compareIds[j]]) out.push(byId[state.compareIds[j]]);
    }
    return out;
  }

  function buildCompareDockHtml() {
    var sel = getSelectedCompareEntries();
    if (!sel.length) return '';
    var lang = state.lang;
    var ct = I18N[lang].comparator;
    return '' +
      '<div class="compare-dock">' +
        '<div class="dock-inner">' +
          '<div class="dock-chips">' +
            '<span style="font-size:12.5px;font-weight:700">' + esc(ct.dockCount(sel.length)) + '</span>' +
            sel.map(function(e) {
              return '<span class="dock-chip">' +
                '<span class="dock-chip-text">' + esc(e.jurisdiction.countryCode) + ' \\u00b7 ' + esc(e.resource.title[lang]) + '</span>' +
                '<button type="button" class="dock-chip-x" data-action="remove-compare" data-id="' + esc(e.id) + '" aria-label="' + esc(ct.remove) + '">\\u00d7</button>' +
              '</span>';
            }).join('') +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px">' +
            '<button type="button" class="btn btn-sm" data-action="clear-compare">' + esc(ct.clear) + '</button>' +
            '<button type="button" class="btn btn-sm btn-primary" data-action="open-comparator"' + (sel.length < 2 ? ' disabled' : '') + '>' +
              esc(ct.openBtn(sel.length)) +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function buildComparatorModalHtml() {
    if (!state.comparatorOpen) return '';
    var sel = getSelectedCompareEntries();
    if (sel.length < 2) return '';
    var lang = state.lang;
    var t = I18N[lang];
    var ct = t.comparator;
    var bi = state.bilingualCompare;

    // Count shared risks across selected entries
    var riskFreq = {};
    for (var i = 0; i < sel.length; i++) {
      var seen = {};
      for (var r = 0; r < sel[i].risks.length; r++) {
        var rc = sel[i].risks[r].code;
        if (!seen[rc]) {
          seen[rc] = true;
          riskFreq[rc] = (riskFreq[rc] || 0) + 1;
        }
      }
    }

    function locHtml(obj) {
      if (!bi) return esc(obj[lang]);
      return '<div><strong>PT:</strong> ' + esc(obj.pt) + '</div><div style="margin-top:3px;color:#475569"><strong>EN:</strong> ' + esc(obj.en) + '</div>';
    }

    return '' +
      '<div class="modal-backdrop" data-action="close-comparator-bg">' +
        '<div class="modal-panel" role="dialog" aria-modal="true">' +
          '<div class="modal-header">' +
            '<div>' +
              '<h2 class="chart-title">' + esc(ct.title) + '</h2>' +
              '<p class="chart-sub">' + esc(ct.subtitle) + '</p>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
              '<button type="button" class="btn btn-sm' + (bi ? ' btn-dark' : '') + '" data-action="toggle-bilingual-compare">' + (bi ? '\\u2713 ' : '') + esc(ct.bilingual) + '</button>' +
              '<button type="button" class="btn btn-sm btn-primary" data-action="copy-compare-md">' + esc(ct.copyMd) + '</button>' +
              '<button type="button" class="btn btn-sm" data-action="close-comparator">' + esc(ct.close) + '</button>' +
            '</div>' +
          '</div>' +
          '<div class="modal-body">' +
            '<table class="compare-table">' +
              '<thead><tr>' +
                '<th class="compare-row-label">' + esc(ct.dimension) + '</th>' +
                sel.map(function(e) {
                  return '<th>' +
                    '<div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start">' +
                      '<div>' + locHtml(e.resource.title) + '</div>' +
                      '<button type="button" class="btn btn-sm" data-action="remove-compare" data-id="' + esc(e.id) + '">\\u00d7</button>' +
                    '</div>' +
                  '</th>';
                }).join('') +
              '</tr></thead>' +
              '<tbody>' +
                '<tr><td class="compare-row-label">' + esc(ct.rowJurisdiction) + '</td>' +
                  sel.map(function(e) {
                    return '<td><span class="country-code">' + esc(e.jurisdiction.countryCode) + '</span> ' + locHtml(e.jurisdiction.country) +
                      '<div style="margin-top:4px;font-size:12px;color:#64748b">' + (e.jurisdiction.subdivision ? locHtml(e.jurisdiction.subdivision) : esc(ct.noSub)) + '</div></td>';
                  }).join('') +
                '</tr>' +
                '<tr><td class="compare-row-label">' + esc(ct.rowIssuer) + '</td>' +
                  sel.map(function(e) {
                    return '<td>' + locHtml(e.issuer.name) + '<div style="margin-top:6px"><span class="badge badge-muted">' + esc(ISSUER_LABELS[e.issuer.category][lang]) + '</span></div></td>';
                  }).join('') +
                '</tr>' +
                '<tr><td class="compare-row-label">' + esc(ct.rowStatusDate) + '</td>' +
                  sel.map(function(e) {
                    return '<td><span class="badge st-' + esc(e.resource.status) + '">' + esc(STATUS_LABELS[e.resource.status][lang]) + '</span>' +
                      '<div style="margin-top:6px">' + locHtml(e.resource.dateDisplay) + ' \\u00b7 ' + esc(t.card.sourcePage(e.sourcePage)) + '</div></td>';
                  }).join('') +
                '</tr>' +
                '<tr><td class="compare-row-label">' + esc(ct.rowRisks) + '</td>' +
                  sel.map(function(e) {
                    if (!e.risks.length) return '<td><span class="badge badge-muted">' + esc(t.card.risksNa) + '</span></td>';
                    return '<td><div class="risk-list">' + e.risks.map(function(r) {
                      var isShared = (riskFreq[r.code] || 0) >= 2;
                      var lbl = bi ? (RISK_LABELS[r.code].pt + ' / ' + RISK_LABELS[r.code].en) : r.label[lang];
                      return '<span class="risk-chip rc-' + esc(r.code) + '">' + esc(lbl) + (isShared ? '<span class="shared-tag">' + esc(ct.shared) + '</span>' : '') + '</span>';
                    }).join('') + '</div></td>';
                  }).join('') +
                '</tr>' +
                '<tr><td class="compare-row-label">' + esc(ct.rowRecs) + '</td>' +
                  sel.map(function(e) {
                    if (!bi) {
                      return '<td><ul class="rec-list">' + e.recommendations[lang].map(function(rc) { return '<li>' + esc(rc) + '</li>'; }).join('') + '</ul></td>';
                    }
                    return '<td><div style="font-weight:700;margin-bottom:4px">PT</div><ul class="rec-list">' +
                      e.recommendations.pt.map(function(rc) { return '<li>' + esc(rc) + '</li>'; }).join('') +
                      '</ul><div style="font-weight:700;margin:10px 0 4px">EN</div><ul class="rec-list">' +
                      e.recommendations.en.map(function(rc) { return '<li>' + esc(rc) + '</li>'; }).join('') +
                      '</ul></td>';
                  }).join('') +
                '</tr>' +
              '</tbody>' +
            '</table>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function buildComparisonMarkdown() {
    var sel = getSelectedCompareEntries();
    var lang = state.lang;
    var t = I18N[lang];
    var ct = t.comparator;
    var bi = state.bilingualCompare;
    function mc(s) { return String(s || '').replace(/\\|/g, '\\\\|').replace(/\\r?\\n/g, ' '); }
    function fmt(obj) { return bi ? (mc(obj.pt) + ' / ' + mc(obj.en)) : mc(obj[lang]); }

    var rows = [
      [ct.dimension].concat(sel.map(function(e) { return mc(e.resource.title[lang]); })),
      ['---'].concat(sel.map(function() { return '---'; })),
      ['**' + ct.rowJurisdiction + '**'].concat(sel.map(function(e) {
        return '[' + e.jurisdiction.countryCode + '] ' + fmt(e.jurisdiction.country) + (e.jurisdiction.subdivision ? ' - ' + fmt(e.jurisdiction.subdivision) : '');
      })),
      ['**' + ct.rowIssuer + '**'].concat(sel.map(function(e) {
        return fmt(e.issuer.name) + ' (' + ISSUER_LABELS[e.issuer.category][lang] + ')';
      })),
      ['**' + ct.rowStatusDate + '**'].concat(sel.map(function(e) {
        return STATUS_LABELS[e.resource.status][lang] + ' | ' + fmt(e.resource.dateDisplay) + ' (IAPP p. ' + e.sourcePage + ')';
      })),
      ['**' + ct.rowRisks + '**'].concat(sel.map(function(e) {
        if (!e.risks.length) return t.card.risksNa;
        return e.risks.map(function(r) { return bi ? mc(RISK_LABELS[r.code].pt + ' / ' + RISK_LABELS[r.code].en) : mc(r.label[lang]); }).join('; ');
      })),
      ['**' + ct.rowRecs + '**'].concat(sel.map(function(e) {
        return e.recommendations[lang].map(function(rc, idx) { return (idx + 1) + '. ' + mc(rc); }).join('<br>');
      }))
    ];
    return rows.map(function(r) { return '| ' + r.join(' | ') + ' |'; }).join('\\n') + '\\n\\n_' + t.footer.attr + '_';
  }

  function copyTextSafe(text) {
    var ct = I18N[state.lang].comparator;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        showToast(ct.copiedToast);
      }, function() {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var ct = I18N[state.lang].comparator;
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(ok ? ct.copiedToast : ct.copyErrToast);
    } catch (_e) {
      showToast(ct.copyErrToast);
    }
  }

  function buildDrawerHtml() {
    if (!state.drawer) return '';
    var lang = state.lang;
    var t = I18N[lang];
    var at = t.analytics;
    var d = state.drawer;
    var title = d.title ? d.title[lang] : '';

    return '' +
      '<div class="drawer-backdrop" data-action="close-drawer-bg">' +
        '<aside class="drawer-panel" role="dialog" aria-modal="true">' +
          '<div class="drawer-header">' +
            '<div class="drawer-title-row">' +
              '<div>' +
                '<h3 class="chart-title">' + esc(title) + '</h3>' +
                '<p class="chart-sub">' + esc(at.drawerCount(d.entries.length)) + '</p>' +
              '</div>' +
              '<button type="button" class="btn btn-sm" data-action="close-drawer">' + esc(at.closeDrawer) + '</button>' +
            '</div>' +
            '<div>' +
              '<button type="button" class="btn btn-primary" style="width:100%" data-action="drawer-inspect">' + esc(at.inspectInExplorer) + ' \\u2192</button>' +
            '</div>' +
          '</div>' +
          '<div class="drawer-body">' +
            d.entries.map(function(e) {
              var risksHtml = e.risks.length === 0
                ? '<span class="badge badge-muted">' + esc(t.card.risksNa) + '</span>'
                : '<div class="risk-list">' + e.risks.map(function(r) {
                    return '<span class="risk-chip rc-' + esc(r.code) + '">' + esc(r.label[lang]) + '</span>';
                  }).join('') + '</div>';
              return '' +
                '<div class="drawer-item">' +
                  '<div class="res-meta-top">' +
                    '<div class="jurisdiction-line">' +
                      '<span class="country-code">' + esc(e.jurisdiction.countryCode) + '</span>' +
                      '<span>' + esc(e.jurisdiction.country[lang]) + (e.jurisdiction.subdivision ? ' \\u00b7 ' + esc(e.jurisdiction.subdivision[lang]) : '') + '</span>' +
                    '</div>' +
                    '<span class="badge st-' + esc(e.resource.status) + '">' + esc(STATUS_LABELS[e.resource.status][lang]) + '</span>' +
                  '</div>' +
                  '<div style="font-weight:700;font-size:14px">' + esc(e.resource.title[lang]) + '</div>' +
                  '<div style="font-size:12px;color:#475569">' + esc(e.issuer.name[lang]) + ' \\u00b7 ' + esc(e.resource.dateDisplay[lang]) + ' \\u00b7 ' + esc(t.card.sourcePage(e.sourcePage)) + '</div>' +
                  risksHtml +
                  '<ul class="rec-list">' + e.recommendations[lang].slice(0, 3).map(function(rc) { return '<li>' + esc(rc) + '</li>'; }).join('') + '</ul>' +
                '</div>';
            }).join('') +
          '</div>' +
        '</aside>' +
      '</div>';
  }

  function buildFooterHtml() {
    var lang = state.lang;
    var t = I18N[lang].footer;
    var hasDock = state.compareIds.length > 0;
    var stats = computeDiffStats();
    var countText;
    if (stats.totalMods === 0) {
      countText = stats.totalActive + ' / ' + stats.baselineCount;
    } else {
      var parts = [stats.baselineCount + ' base'];
      if (stats.customAdded > 0) parts.push('+ ' + stats.customAdded + (lang === 'pt' ? ' custom' : ' custom'));
      if (stats.modifiedBase > 0) parts.push(stats.modifiedBase + (lang === 'pt' ? ' editados' : ' edited'));
      countText = stats.totalActive + ' (' + parts.join(' \\u00b7 ') + ')';
    }
    return '' +
      '<footer class="site-footer' + (hasDock ? ' has-dock' : '') + '">' +
        '<div class="container footer-inner">' +
          '<div>' + esc(t.attr) + '</div>' +
          '<div class="count-badge tabular-nums">\\u2713 ' + esc(t.loaded) + ': ' + esc(countText) + '</div>' +
        '</div>' +
      '</footer>';
  }

  function render() {
    var root = document.getElementById('app-root');
    if (!root) return;

    // Preserve search input cursor if focused
    var activeEl = document.activeElement;
    var focusId = activeEl && (activeEl.id === 'exp-search-input' || activeEl.id === 'mon-search-input') ? activeEl.id : null;
    var selStart = focusId ? activeEl.selectionStart : null;

    drillRegistry = {};
    drillSeq = 0;

    document.documentElement.lang = state.lang;
    document.title = I18N[state.lang].appTitle;

    var mainBody = '';
    if (state.activeTab === 'explorer') mainBody = buildExplorerHtml();
    else if (state.activeTab === 'analytics') mainBody = buildAnalyticsHtml();
    else mainBody = buildStage3Html();

    root.innerHTML = '' +
      '<div class="app-shell">' +
        buildHeaderHtml() +
        '<main class="main-content"><div class="container">' + mainBody + '</div></main>' +
        buildFooterHtml() +
        buildCompareDockHtml() +
        buildComparatorModalHtml() +
        buildDrawerHtml() +
        buildStage3ModalsHtml() +
        '<div id="offline-toast" class="toast" style="display:' + (state.toast ? 'block' : 'none') + '">' + esc(state.toast || '') + '</div>' +
        '<div id="offline-tooltip" class="floating-tooltip"></div>' +
      '</div>';

    if (focusId) {
      var input = document.getElementById(focusId);
      if (input) {
        input.focus();
        if (selStart !== null && input.setSelectionRange) {
          input.setSelectionRange(selStart, selStart);
        }
      }
    }
  }

  function bindEvents() {
    var root = document.getElementById('app-root');
    if (!root) return;

    root.addEventListener('click', function(ev) {
      var target = ev.target;
      if (target && target.getAttribute) {
        if (target.getAttribute('data-action') === 'close-comparator-bg') {
          state.comparatorOpen = false;
          render();
          return;
        }
        if (target.getAttribute('data-action') === 'close-drawer-bg') {
          state.drawer = null;
          render();
          return;
        }
        if (target.getAttribute('data-action') === 'mon-close-editor-bg') {
          state.monitor.editor = null;
          state.monitor.editorError = '';
          render();
          return;
        }
      }

      var btn = target && target.closest ? target.closest('[data-action]') : null;
      if (!btn || btn.disabled) return;
      var action = btn.getAttribute('data-action');

      if (action === 'set-lang') {
        var nextLang = btn.getAttribute('data-lang');
        if (nextLang === 'pt' || nextLang === 'en') {
          state.lang = nextLang;
          safeStorageSet(STORAGE_LANG, nextLang);
          render();
        }
      } else if (action === 'set-tab') {
        state.activeTab = btn.getAttribute('data-tab') || 'explorer';
        state.drawer = null;
        render();
        window.scrollTo(0, 0);
      } else if (action === 'exp-scope') {
        state.filters.scope = btn.getAttribute('data-val') || 'all';
        render();
      } else if (action === 'exp-reset') {
        resetExplorerFilters();
        render();
      } else if (action === 'exp-clear-search') {
        state.filters.search = '';
        render();
      } else if (action === 'exp-toggle-expand-all') {
        state.expandAll = !state.expandAll;
        if (!state.expandAll) state.expandedCards = {};
        render();
      } else if (action === 'exp-toggle-card') {
        var cid = btn.getAttribute('data-id');
        if (state.expandAll) {
          state.expandAll = false;
          state.expandedCards = {};
        } else {
          state.expandedCards[cid] = !state.expandedCards[cid];
        }
        render();
      } else if (action === 'exp-risk-chip') {
        state.filters.risk = btn.getAttribute('data-risk') || 'all';
        render();
        window.scrollTo(0, 0);
      } else if (action === 'toggle-compare') {
        var id = btn.getAttribute('data-id');
        var idx = state.compareIds.indexOf(id);
        if (idx !== -1) state.compareIds.splice(idx, 1);
        else if (state.compareIds.length < 3) state.compareIds.push(id);
        render();
      } else if (action === 'remove-compare') {
        var rid = btn.getAttribute('data-id');
        state.compareIds = state.compareIds.filter(function(x) { return x !== rid; });
        if (state.compareIds.length < 2) state.comparatorOpen = false;
        render();
      } else if (action === 'clear-compare') {
        state.compareIds = [];
        state.comparatorOpen = false;
        render();
      } else if (action === 'open-comparator') {
        if (state.compareIds.length >= 2) {
          state.comparatorOpen = true;
          render();
        }
      } else if (action === 'close-comparator') {
        state.comparatorOpen = false;
        render();
      } else if (action === 'toggle-bilingual-compare') {
        state.bilingualCompare = !state.bilingualCompare;
        render();
      } else if (action === 'copy-compare-md') {
        copyTextSafe(buildComparisonMarkdown());
      } else if (action === 'an-toggle-caveats') {
        state.analytics.caveatsOpen = !state.analytics.caveatsOpen;
        render();
      } else if (action === 'an-scope') {
        state.analytics.scope = btn.getAttribute('data-val') || 'all';
        render();
      } else if (action === 'an-reset') {
        state.analytics.scope = 'all';
        state.analytics.region = 'all';
        state.analytics.status = 'all';
        state.analytics.issuerCategory = 'all';
        render();
      } else if (action === 'an-geo-mode') {
        state.analytics.geoMode = btn.getAttribute('data-val') || 'global';
        render();
      } else if (action === 'an-toggle-exclude-us') {
        state.analytics.excludeUs = !state.analytics.excludeUs;
        render();
      } else if (action === 'an-time-stack') {
        state.analytics.timelineStack = btn.getAttribute('data-val') || 'status';
        render();
      } else if (action === 'an-hm-mode') {
        state.analytics.heatmapMode = btn.getAttribute('data-val') || 'region';
        render();
      } else if (action === 'open-drill') {
        var dk = btn.getAttribute('data-drill');
        if (dk && drillRegistry[dk] && drillRegistry[dk].entries.length > 0) {
          state.drawer = drillRegistry[dk];
          render();
        }
      } else if (action === 'close-drawer') {
        state.drawer = null;
        render();
      } else if (action === 'drawer-inspect') {
        if (state.drawer) {
          resetExplorerFilters(state.drawer.explorerPatch || {});
          state.drawer = null;
          state.activeTab = 'explorer';
          render();
          window.scrollTo(0, 0);
        }
      } else if (action === 'mon-wl-mode') {
        state.monitor.watchlistMode = btn.getAttribute('data-val') || 'pending';
        render();
      } else if (action === 'mon-clear-search') {
        state.monitor.search = '';
        render();
      } else if (action === 'mon-toggle-audit') {
        state.monitor.auditOpen = !state.monitor.auditOpen;
        render();
      } else if (action === 'mon-add-new') {
        state.monitor.editor = createBlankDraft();
        state.monitor.editorError = '';
        render();
      } else if (action === 'mon-edit') {
        var eid = btn.getAttribute('data-id');
        var found = null;
        for (var fi = 0; fi < state.entries.length; fi++) {
          if (state.entries[fi].id === eid) { found = state.entries[fi]; break; }
        }
        if (found) {
          state.monitor.editor = entryToDraft(found);
          state.monitor.editorError = '';
          render();
        }
      } else if (action === 'mon-close-editor') {
        state.monitor.editor = null;
        state.monitor.editorError = '';
        render();
      } else if (action === 'mon-ed-add-rec') {
        if (state.monitor.editor) {
          state.monitor.editor.recs.push({ pt: '', en: '' });
          render();
        }
      } else if (action === 'mon-ed-del-rec') {
        if (state.monitor.editor) {
          var rIdx = Number(btn.getAttribute('data-idx'));
          if (state.monitor.editor.recs.length <= 1) state.monitor.editor.recs = [{ pt: '', en: '' }];
          else state.monitor.editor.recs.splice(rIdx, 1);
          render();
        }
      } else if (action === 'mon-export-json') {
        downloadBackupJsonOffline();
      } else if (action === 'mon-trigger-import') {
        var fileEl = document.getElementById('mon-import-file');
        if (fileEl) fileEl.click();
      } else if (action === 'mon-cancel-import') {
        state.monitor.pendingImport = null;
        render();
      } else if (action === 'mon-confirm-import') {
        var pi = state.monitor.pendingImport;
        if (pi) {
          state.entries = pi.entries;
          persistEntries();
          pushAudit({
            id: makeAuditId(),
            timestamp: new Date().toISOString(),
            action: 'imported',
            entryId: 'backup_import',
            jurisdiction: { pt: 'Base Global', en: 'Global Dataset' },
            entryTitle: { pt: 'Importa\\u00e7\\u00e3o JSON (' + pi.total + ' registros)', en: 'JSON Backup Import (' + pi.total + ' records)' },
            summary: { pt: '+' + pi.added + ' adicionados \\u00b7 ' + pi.updated + ' atualizados', en: '+' + pi.added + ' added \\u00b7 ' + pi.updated + ' updated' }
          });
          state.monitor.pendingImport = null;
          showToast(I18N[state.lang].stage3.importToast(pi.added, pi.updated));
          render();
        }
      } else if (action === 'mon-open-reset') {
        state.monitor.resetConfirm = true;
        render();
      } else if (action === 'mon-cancel-reset') {
        state.monitor.resetConfirm = false;
        render();
      } else if (action === 'mon-confirm-reset') {
        state.entries = JSON.parse(JSON.stringify(state.baseline));
        safeStorageSet(STORAGE_ENTRIES, JSON.stringify(state.entries));
        state.compareIds = [];
        state.monitor.resetConfirm = false;
        pushAudit({
          id: makeAuditId(),
          timestamp: new Date().toISOString(),
          action: 'reset',
          entryId: 'baseline_119',
          jurisdiction: { pt: 'Base Global', en: 'Global Dataset' },
          entryTitle: { pt: 'Restaura\\u00e7\\u00e3o da Base Original (119 registros)', en: 'Reset to Original Baseline (119 records)' },
          summary: { pt: 'Edi\\u00e7\\u00f5es locais removidas; base IAPP Out/2026 restaurada', en: 'Local edits cleared; IAPP Oct 2026 baseline restored' }
        });
        showToast(I18N[state.lang].stage3.resetToast);
        render();
      }
    });

    root.addEventListener('submit', function(ev) {
      var form = ev.target;
      if (!form || form.id !== 'mon-editor-form') return;
      ev.preventDefault();
      var d = state.monitor.editor;
      if (!d) return;
      var cEn = String(d.countryEn || '').trim();
      var cPt = String(d.countryPt || '').trim();
      var cCode = String(d.countryCode || '').trim().toUpperCase();
      var iEn = String(d.issuerEn || '').trim();
      var iPt = String(d.issuerPt || '').trim();
      var tEn = String(d.titleEn || '').trim();
      var tPt = String(d.titlePt || '').trim();
      if (!cEn || !cPt || !cCode || !iEn || !iPt || !tEn || !tPt) {
        state.monitor.editorError = I18N[state.lang].stage3.edErrReq;
        render();
        return;
      }
      var yRaw = String(d.year || '').trim();
      var yr = yRaw === '' ? null : Number(yRaw);
      if (yr !== null && (!isFinite(yr) || yr < 1990 || yr > 2050)) yr = null;
      var pg = Number(d.sourcePage);
      if (!isFinite(pg) || pg < 0) pg = 0;
      var subEn = String(d.subEn || '').trim();
      var subPt = String(d.subPt || '').trim();
      var regObj = REGION_LABELS[d.regionEn] || { en: d.regionEn, pt: d.regionEn };
      var recsEn = [], recsPt = [];
      for (var ri = 0; ri < d.recs.length; ri++) {
        var rEn = String(d.recs[ri].en || '').trim();
        var rPt = String(d.recs[ri].pt || '').trim();
        if (rEn || rPt) {
          recsEn.push(rEn || rPt);
          recsPt.push(rPt || rEn);
        }
      }
      var saved = {
        id: d.id,
        sourcePage: Math.floor(pg),
        jurisdiction: {
          countryCode: cCode,
          country: { en: cEn, pt: cPt },
          subdivision: (subEn || subPt) ? { en: subEn || subPt, pt: subPt || subEn } : null,
          region: { en: regObj.en, pt: regObj.pt }
        },
        issuer: {
          name: { en: iEn, pt: iPt },
          category: d.issuerCategory
        },
        resource: {
          title: { en: tEn, pt: tPt },
          dateDisplay: {
            en: String(d.dateEn || '').trim() || (yr ? String(yr) : 'Not specified'),
            pt: String(d.datePt || '').trim() || (yr ? String(yr) : 'N\\u00e3o especificado')
          },
          year: yr,
          status: d.status,
          isMachineTranslated: Boolean(d.isMt)
        },
        risks: d.risks.map(function(rc) { return { code: rc, label: { en: RISK_LABELS[rc].en, pt: RISK_LABELS[rc].pt } }; }),
        recommendations: { en: recsEn, pt: recsPt }
      };

      var prevEntry = null;
      var prevIdx = -1;
      for (var ei = 0; ei < state.entries.length; ei++) {
        if (state.entries[ei].id === saved.id) { prevIdx = ei; prevEntry = state.entries[ei]; break; }
      }
      var actType;
      if (prevIdx !== -1) {
        state.entries[prevIdx] = saved;
        actType = 'updated';
      } else {
        state.entries = [saved].concat(state.entries);
        actType = 'created';
      }
      persistEntries();
      pushAudit({
        id: makeAuditId(),
        timestamp: new Date().toISOString(),
        action: actType,
        entryId: saved.id,
        jurisdiction: {
          pt: saved.jurisdiction.subdivision ? (saved.jurisdiction.country.pt + ' \\u00b7 ' + saved.jurisdiction.subdivision.pt) : saved.jurisdiction.country.pt,
          en: saved.jurisdiction.subdivision ? (saved.jurisdiction.country.en + ' \\u00b7 ' + saved.jurisdiction.subdivision.en) : saved.jurisdiction.country.en
        },
        entryTitle: { pt: saved.resource.title.pt, en: saved.resource.title.en },
        summary: summarizeDiff(prevEntry, saved)
      });
      state.monitor.editor = null;
      state.monitor.editorError = '';
      showToast(actType === 'created' ? I18N[state.lang].stage3.edCreatedToast : I18N[state.lang].stage3.edUpdatedToast);
      render();
    });

    root.addEventListener('input', function(ev) {
      var target = ev.target;
      if (!target) return;
      if (target.id === 'exp-search-input') {
        state.filters.search = target.value;
        render();
        return;
      }
      if (target.id === 'mon-search-input') {
        state.monitor.search = target.value;
        render();
        return;
      }
      if (state.monitor.editor && target.getAttribute) {
        var ef = target.getAttribute('data-ed-field');
        if (ef) {
          state.monitor.editor[ef] = target.value;
          return;
        }
        var recIdx = target.getAttribute('data-ed-rec-idx');
        var recLang = target.getAttribute('data-ed-rec-lang');
        if (recIdx !== null && recLang && state.monitor.editor.recs[Number(recIdx)]) {
          state.monitor.editor.recs[Number(recIdx)][recLang] = target.value;
        }
      }
    });

    root.addEventListener('change', function(ev) {
      var target = ev.target;
      if (!target || !target.getAttribute) return;
      if (target.id === 'mon-import-file') {
        state.monitor.importError = '';
        var f = target.files && target.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function() {
          var res = validateBackupTextOffline(typeof reader.result === 'string' ? reader.result : '');
          if (!res) state.monitor.importError = I18N[state.lang].stage3.impErrJson;
          else state.monitor.pendingImport = res;
          render();
        };
        reader.readAsText(f);
        target.value = '';
        return;
      }
      if (state.monitor.editor) {
        var ef = target.getAttribute('data-ed-field');
        if (ef) {
          state.monitor.editor[ef] = target.value;
          return;
        }
        if (target.getAttribute('data-ed-mt')) {
          state.monitor.editor.isMt = Boolean(target.checked);
          return;
        }
        var rc = target.getAttribute('data-ed-risk');
        if (rc) {
          var arr = state.monitor.editor.risks;
          var pos = arr.indexOf(rc);
          if (target.checked && pos === -1) arr.push(rc);
          else if (!target.checked && pos !== -1) arr.splice(pos, 1);
          render();
          return;
        }
      }
      var fk = target.getAttribute('data-filter');
      if (fk) {
        state.filters[fk] = target.value;
        if (fk === 'countryCode') state.filters.subdivision = 'all';
        render();
        return;
      }
      var afk = target.getAttribute('data-an-filter');
      if (afk) {
        state.analytics[afk] = target.value;
        render();
      }
    });

    root.addEventListener('mousemove', function(ev) {
      var tipEl = document.getElementById('offline-tooltip');
      if (!tipEl) return;
      var host = ev.target && ev.target.closest ? ev.target.closest('[data-tip]') : null;
      if (host) {
        tipEl.textContent = host.getAttribute('data-tip') || '';
        tipEl.style.display = 'block';
        var x = ev.clientX + 14;
        var y = ev.clientY + 14;
        if (x + 280 > window.innerWidth) x = Math.max(8, ev.clientX - 280);
        if (y + 90 > window.innerHeight) y = Math.max(8, ev.clientY - 70);
        tipEl.style.left = x + 'px';
        tipEl.style.top = y + 'px';
      } else {
        tipEl.style.display = 'none';
      }
    });

    document.addEventListener('keydown', function(ev) {
      if (ev.key === 'Escape') {
        if (state.monitor.editor) { state.monitor.editor = null; render(); }
        else if (state.drawer) { state.drawer = null; render(); }
        else if (state.comparatorOpen) { state.comparatorOpen = false; render(); }
      }
    });
  }

  function showDiagnosticError(err) {
    var root = document.getElementById('app-root') || document.body;
    var msg = err && err.stack ? err.stack : String(err || 'Unknown runtime error');
    root.innerHTML = '' +
      '<div class="error-panel">' +
        '<h2 style="margin:0 0 8px">Offline Tracker Initialization Error</h2>' +
        '<p style="margin:0 0 10px">The standalone file encountered an error while rendering. Details below:</p>' +
        '<pre>' + esc(msg) + '</pre>' +
      '</div>';
  }

  function init() {
    try {
      var embedded = window.__TRACKER_OFFLINE_ENTRIES__;
      var base = Array.isArray(window.__TRACKER_OFFLINE_BASELINE__) && window.__TRACKER_OFFLINE_BASELINE__.length
        ? window.__TRACKER_OFFLINE_BASELINE__
        : embedded;
      var embeddedAudit = Array.isArray(window.__TRACKER_OFFLINE_AUDIT__) ? window.__TRACKER_OFFLINE_AUDIT__ : [];
      var initLang = window.__TRACKER_OFFLINE_LANG__;

      if (!Array.isArray(embedded) || embedded.length === 0) {
        throw new Error('Embedded dataset (__TRACKER_OFFLINE_ENTRIES__) is missing or empty.');
      }

      state.baseline = base;
      state.baselineMap = {};
      for (var bi = 0; bi < base.length; bi++) {
        state.baselineMap[base[bi].id] = canonicalEntryStr(base[bi]);
      }

      // Load localStorage edits if present, else use exported snapshot
      var storedEntries = null;
      var rawStored = safeStorageGet(STORAGE_ENTRIES);
      if (rawStored) {
        try {
          var parsedStored = JSON.parse(rawStored);
          if (Array.isArray(parsedStored) && parsedStored.length > 0 && parsedStored[0].id && parsedStored[0].jurisdiction) {
            storedEntries = parsedStored;
          }
        } catch (_e) {}
      }
      state.entries = storedEntries || embedded;

      var storedAudit = null;
      var rawAudit = safeStorageGet(STORAGE_AUDIT);
      if (rawAudit) {
        try {
          var parsedAudit = JSON.parse(rawAudit);
          if (Array.isArray(parsedAudit)) storedAudit = parsedAudit;
        } catch (_e) {}
      }
      state.auditLog = storedAudit || embeddedAudit;

      var storedLang = safeStorageGet(STORAGE_LANG);
      if (storedLang === 'pt' || storedLang === 'en') state.lang = storedLang;
      else state.lang = initLang === 'en' ? 'en' : 'pt';

      bindEvents();
      render();
    } catch (err) {
      showDiagnosticError(err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();`;
