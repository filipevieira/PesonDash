# Próximos Passos (Backlog / Roadmap)

Este documento foi criado para registrar o "Save State" do seu projeto. Caso passe muito tempo, inicie a continuação exatamente a partir dos pontos abaixo:

## O Ponto de Parada (Abril 2026)
O ecossistema foi dividido em 3: A raiz (estática e pronta), a pasta `/bkp` e o laboratório pesado em `/dev`. A raiz está impecável.

No `/dev`, as fundações do **Firebase V8** e o Botão de Login via Google Auth foram conectadas ao Javascript. Contudo, paramos **antes** de ligar os dados do Calendário no painel!

---

## 🚀 ROADMAP: O Que Falta Codificar 

### 1. Extrator do Google Calendar (No `/dev`)
- [ ] O Javascript atualmente obtém o `googleAccessToken` invisivelmente durante o Auth no Box do Google.
- [ ] **Mudar o Layout:** Falta criar um "Caixote" (Widget) de HTML em `index.html` (e remover possivelmente o portal de Notícias) especificamente designado para a Agenda.
- [ ] **Requisição AJAX (Fetch):** Falta escrever no `app.js` a função Javascript que faz uma requisição HTTP REST para `https://www.googleapis.com/calendar/v3/calendars/primary/events` injetando o Header: `Authorization: Bearer + googleAccessToken`.
- [ ] Renderizar o JSON resultante no Layout da Tela em uma lista moderna e limpa.

### 2. Sincronização LocalStorage com Firebase DB
- [ ] Atualmente, as preferências da pessoa (Menu Lateral > Configurações de Ligas "NFL, F1, NHL") são salvas no `localStorage`.
- [ ] Com a chegada do Firebase, falta conectar a função Salvar a raiz do RealtimeDB (`db.ref('users/' + user.uid + '/sports').set(mySports)`), para que suas configurações voem para a nuvem automaticamente e acompanhem o painel independente de onde for aberto.

### 3. Renovações de UI Futuras
- [ ] Criar transições de desbotamento mais elaboradas ao navegar entre sub-painéis esportivos. (Prioridade Baixa)
