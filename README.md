# Controle de Processos — Web App (Google Apps Script)

Web app em tema escuro para acompanhar processos, substituindo a planilha `Controle_de_Processos.xlsx` por uma experiência visual melhor. Os dados continuam gravados numa planilha Google (criada automaticamente), então nada se perde.

## Funcionalidades

- **Dashboard com resumo**: cards com total de processos, contagem por status, prazos vencidos e prazos que vencem nos próximos 2 dias. Clique num card de status para filtrar por ele.
- **Filtros dinâmicos**: busca por texto (processo, descrição, observações), filtro por status e por período da data de mudança de status. Tudo instantâneo, sem recarregar.
- **Alerta visual de prazos**: prazos vencidos em vermelho, prazos nos próximos 2 dias em amarelo.
- **Edição direta no app**: criar, editar e excluir processos (com confirmação), além de troca rápida de status direto na tabela (a data de mudança é atualizada automaticamente).
- **Links clicáveis**: informe o link do SEI e o número do processo vira um link que abre o processo direto no SEI. Há também uma coluna **Links relacionados** (um link por linha, opcionalmente `Rótulo | https://endereço`) — qualquer endereço é reconhecido como link clicável, não como texto.
- **Arquivamento**: arquive processos concluídos/inativos; eles saem da lista principal e ficam na aba **Arquivados**, de onde podem ser desarquivados.
- **Ordenação**: clique no cabeçalho de qualquer coluna para ordenar.
- **Dados já importados**: os 15 processos da planilha original estão embutidos em `Code.gs` (`DADOS_INICIAIS`) e são gravados na planilha Google no primeiro acesso.

## Arquivos

| Arquivo | Descrição |
|---|---|
| `Code.gs` | Código do servidor: criação/semeadura da planilha, leitura e gravação dos processos |
| `Index.html` | Interface do web app (tema escuro, filtros, tabela, formulários) |
| `appsscript.json` | Manifesto do projeto (fuso `America/Sao_Paulo`, runtime V8, config do web app) |

## Como importar para o Google Apps Script

Usando a extensão **Google Apps Script GitHub Assistant** (Chrome):

1. Acesse [script.google.com](https://script.google.com) e crie um **novo projeto** (standalone).
2. Com a extensão instalada e conectada à sua conta GitHub, selecione este repositório e o branch desejado.
3. Clique em **Pull** (⬇) para trazer `Code.gs`, `Index.html` e `appsscript.json` para o projeto.
   - Para o `appsscript.json` ser sincronizado, ative em **Configurações do projeto** a opção *"Mostrar o arquivo de manifesto appsscript.json no editor"*.

## Como publicar o web app

1. No editor do Apps Script: **Implantar > Nova implantação**.
2. Tipo: **App da Web**.
   - *Executar como*: **Eu**.
   - *Quem pode acessar*: **Apenas eu** (ou ajuste conforme sua necessidade).
3. Autorize as permissões solicitadas (acesso a Planilhas/Drive — necessário para criar e gravar na planilha de dados).
4. Abra a URL gerada. **No primeiro acesso**, o app cria a planilha "Controle de Processos" no seu Drive e importa os dados iniciais automaticamente.

## Usando uma planilha existente (opcional)

Se preferir apontar para uma planilha Google já existente (com a aba `Processos`): o app usa as colunas Processo, Link, Descrição, Status, Data de mudança de Status, Prazo, Links relacionados, Obs e Arquivado. Qualquer coluna que falte é criada automaticamente no primeiro acesso, sem apagar os dados existentes.

1. Em **Configurações do projeto > Propriedades do script**, crie a propriedade `SPREADSHEET_ID` com o ID da planilha.
2. O app passa a ler e gravar nela.

## Observações

- A planilha de dados pode continuar sendo aberta e editada normalmente (link "Abrir planilha ↗" no topo do app).
- Os quatro status — **Em Andamento**, **Concluído**, **Consulta** e **Não iniciado** — são sempre oferecidos no formulário e nos filtros; status já existentes na planilha também aparecem.
- Processos concluídos não geram alerta de prazo.
