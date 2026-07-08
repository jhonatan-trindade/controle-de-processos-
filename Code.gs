/**
 * Controle de Processos — Web App (Google Apps Script)
 *
 * Os dados ficam gravados numa planilha Google. No primeiro acesso o script
 * cria automaticamente a planilha "Controle de Processos" e importa os dados
 * iniciais (DADOS_INICIAIS). Para usar uma planilha existente, defina a
 * propriedade de script SPREADSHEET_ID em: Configurações do projeto >
 * Propriedades do script.
 */

var NOME_ABA = 'Processos';
var CABECALHOS = ['Processo', 'Descrição', 'Status', 'Data de mudança de Status', 'Prazo', 'Obs'];

// Dados importados da planilha Controle_de_Processos.xlsx (aba "Tabela").
// Datas no formato yyyy-MM-dd; "-" indica campo sem valor.
var DADOS_INICIAIS = [
  ['1400.01.0031537/2026-36', 'Of 344/206-LIGABOM Solic.para participação de militares integrantes da Câm.Técnica do Projeto RESPAD', 'Em Andamento', '2026-07-08', '2026-07-09', 'Email enviado para a LIGABOM, Ofício assinado pela CG. Enviar email resposta Maj Lucas Pacheco'],
  ['GD NAC', 'Proposta de treinamento de GD para NACs', 'Em Andamento', '2026-06-26', '-', 'Feito e repassado para o Cap Gomes em 26/06'],
  ['1400.01.0019793/2026-31', 'Relatórios de Período Chuvoso dos COBs e o Relatório Consolidado do CEB 2025/2026', 'Em Andamento', '2026-07-06', '2026-07-10', 'Comissão para revisão da Resolução do NAC (TC Patrick e Cap Tiago Costa)'],
  ['1400.01.0036499/2026-19', 'Proposta de alteração da Resolução dos NAC', 'Em Andamento', '2026-06-25', '-', 'Minuta em confecção. LER  e produzir relatório para uso pessoal'],
  ['1400.01.0037182/2026-08', 'Proposta de Alteração da Resolução do CEB', 'Em Andamento', '2026-06-25', '2026-07-08', 'Em confecção. LER  e produzir relatório para uso pessoal. PRAZO 30/06'],
  ['1400.01.0017270/2026-58', 'abc@itamaraty.gov.br Cooperação humanitária. Brasil-ONU. Desastres. OCHA. INSARAG. IEC. QUITO', 'Consulta', '2026-06-26', '-', 'Manter sob controle'],
  ['1400.01.0053751/2024-15', 'Indicadores para atividade especializada', 'Consulta', '2026-06-26', '-', 'Manter sob controle'],
  ['1400.01.0028716/2026-58', 'Semana da Prevenção 2026', 'Em Andamento', '2026-06-26', '-', 'Aguardar ordem para finalizar'],
  ['1400.01.0038621/2026-52', 'Empenho em Missão Internacional de Busca e Salvamento VENEZUELA (Caixa SEI INSARAG)', 'Em Andamento', '2026-06-26', '-', 'Acompanhar e juntar informações em DRIVE específico'],
  ['Venezuela 06/26', 'Drive da Missão Venezuela (1400.01.0038621/2026-52)', 'Em Andamento', '2026-06-26', '-', 'Juntar informações e fotos'],
  ['1400.01.0040469/2026-14', 'Minuta de Memorando sobre Banco de Gestão de Capacidades Operacionais (nome sob júdice)', 'Em Andamento', '2026-07-03', '-', 'Despachado com TC Patrick'],
  ['1400.01.0019619/2026-73', 'Solicitação de Informações Institucionais – Projeto RESPAD (Formalização de ACTs estaduais)', 'Não iniciado', '2026-07-06', '-', 'Conhecer'],
  ['1400.01.0041371/2026-07', 'Pedido de recompensa - Semana da Prevenção', 'Em Andamento', '2026-07-08', '-', 'Enviado para assinatura do TC Dias'],
  ['1400.01.0041106/2026-81', 'Seminário em Brumadinho', 'Em Andamento', '2026-07-08', '2026-07-10', 'OS Feita, pendente efetivo do CEB e BEMAD e viatura'],
  ['-', 'Caminhão Roll On Roll Off', 'Não iniciado', '2026-07-07', '-', 'Verificar especificação']
];

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Controle de Processos')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Retorna a planilha de dados, criando e semeando na primeira execução. */
function obterPlanilha_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SPREADSHEET_ID');
  if (id) {
    try {
      return SpreadsheetApp.openById(id);
    } catch (e) {
      // ID inválido ou planilha excluída: cria uma nova abaixo.
    }
  }
  var ss = SpreadsheetApp.create('Controle de Processos');
  var aba = ss.getSheets()[0].setName(NOME_ABA);
  semearDados_(aba);
  props.setProperty('SPREADSHEET_ID', ss.getId());
  return ss;
}

function obterAba_() {
  var ss = obterPlanilha_();
  var aba = ss.getSheetByName(NOME_ABA);
  if (!aba) {
    aba = ss.insertSheet(NOME_ABA);
    semearDados_(aba);
  }
  return aba;
}

function semearDados_(aba) {
  aba.getRange(1, 1, 1, CABECALHOS.length).setValues([CABECALHOS]).setFontWeight('bold');
  aba.setFrozenRows(1);
  if (DADOS_INICIAIS.length) {
    var linhas = DADOS_INICIAIS.map(function (r) {
      return [r[0], r[1], r[2], paraCelula_(r[3]), paraCelula_(r[4]), r[5]];
    });
    aba.getRange(2, 1, linhas.length, CABECALHOS.length).setValues(linhas);
  }
  aba.getRange(2, 4, Math.max(DADOS_INICIAIS.length, 1000), 2).setNumberFormat('dd/mm/yyyy');
  aba.setColumnWidth(1, 190);
  aba.setColumnWidth(2, 420);
  aba.setColumnWidth(3, 120);
  aba.setColumnWidth(4, 120);
  aba.setColumnWidth(5, 100);
  aba.setColumnWidth(6, 420);
}

/** 'yyyy-MM-dd' -> Date (para gravar na célula); qualquer outro valor vira texto. */
function paraCelula_(v) {
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
    var p = v.split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }
  return v === '' || v === null || v === undefined ? '-' : v;
}

/** Valor da célula -> string para o cliente (datas viram 'yyyy-MM-dd'). */
function deCelula_(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return v === null || v === undefined ? '' : String(v);
}

/** Lê todos os processos. Chamado pelo cliente. */
function obterProcessos() {
  var aba = obterAba_();
  var ultima = aba.getLastRow();
  var processos = [];
  if (ultima >= 2) {
    var valores = aba.getRange(2, 1, ultima - 1, CABECALHOS.length).getValues();
    valores.forEach(function (r, i) {
      var vazio = r.every(function (c) { return c === '' || c === null; });
      if (vazio) return;
      processos.push({
        linha: i + 2,
        processo: deCelula_(r[0]),
        descricao: deCelula_(r[1]),
        status: deCelula_(r[2]),
        dataStatus: deCelula_(r[3]),
        prazo: deCelula_(r[4]),
        obs: deCelula_(r[5])
      });
    });
  }
  return {
    processos: processos,
    urlPlanilha: obterPlanilha_().getUrl()
  };
}

/**
 * Cria (sem p.linha) ou atualiza (com p.linha) um processo.
 * Campos: processo, descricao, status, dataStatus, prazo, obs.
 */
function salvarProcesso(p) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var aba = obterAba_();
    var valores = [[
      p.processo || '-',
      p.descricao || '',
      p.status || 'Não iniciado',
      paraCelula_(p.dataStatus || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd')),
      paraCelula_(p.prazo),
      p.obs || ''
    ]];
    var linha = Number(p.linha);
    if (linha >= 2) {
      aba.getRange(linha, 1, 1, CABECALHOS.length).setValues(valores);
    } else {
      linha = aba.getLastRow() + 1;
      aba.getRange(linha, 1, 1, CABECALHOS.length).setValues(valores);
      aba.getRange(linha, 4, 1, 2).setNumberFormat('dd/mm/yyyy');
    }
    return obterProcessos();
  } finally {
    lock.releaseLock();
  }
}

/** Troca rápida de status: grava o status e a data de mudança (hoje). */
function alterarStatus(linha, status) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var aba = obterAba_();
    linha = Number(linha);
    if (!(linha >= 2)) throw new Error('Linha inválida.');
    aba.getRange(linha, 3).setValue(status);
    aba.getRange(linha, 4).setValue(new Date()).setNumberFormat('dd/mm/yyyy');
    return obterProcessos();
  } finally {
    lock.releaseLock();
  }
}

/** Exclui a linha do processo. */
function excluirProcesso(linha) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var aba = obterAba_();
    linha = Number(linha);
    if (!(linha >= 2)) throw new Error('Linha inválida.');
    aba.deleteRow(linha);
    return obterProcessos();
  } finally {
    lock.releaseLock();
  }
}
