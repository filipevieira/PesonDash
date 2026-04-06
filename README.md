# PersonDash HQ

**O PersonDash** é um painel tático de informações esportivas, meteorológicas e de notícias focado exclusivamente para rodar como um Display Ininterrupto (Always-On) em navegadores legados e lentos (Especialmente o **Samsung Galaxy Tab 10.1** usando o antigo Android WebKit). 

Por não possuir um Backend de servidor, tudo é resolvido 100% no *Client-Side* através de `Vanilla Javascript (ES5)` para garantir compatibilidade retroativa de 10 anos.

## Arquitetura & APIs Utilizadas
A alma do projeto é bater em endpoints não-oficiais (ou livres) de alta velocidade:

1. **APIs Esportivas (ESPN Cortex):**
   - Utilizamos os endpoints profundos da ESPN: `https://site.api.espn.com/apis/site/v2/sports/[LIGA]/[SUBLIGA]/scoreboard`
   - O Javascript intercepta os JSONs e formata de acordo com a nossa `SPORTS_MAP`.
   - **Exceção (F1):** A Fórmula 1 não utiliza o `/scoreboard`, e sim o `/standings` apontando diretamente para o Campeonato de Pilotos (Driver Standings), ignorando o Mundial de Construtores.
2. **Clima (Open-Meteo):**
   - API Estritamente Gratuita e sem necessidade de Tokens OAuth.
   - Fornece Temperatura atual, Umidade e Vento na hora.
3. **News (Google News RSS - Proxy):**
   - Para evadir os bloqueios mortais de CORS do tablet, o G1 Notícias é convertido de RSS para JSON usando em cascata pela API do `rss2json`.
4. **Infraestrutura em Nuvem (Firebase V8):**
   - Adotado o **SDK Legado V8.10.1** via CDN do Google. Novas versões do Firebase (v9/v10) fragmentam a compilação em módulos (ES6) que crashariam o display no momento de carga no aparelho Antigo.
   - O Firebase armazena escopos do GitHub Pages pra prover as lógicas futuras de Tokens de Agenda Privada Oauth2.

## Organização de Pastas

Para evitarmos o risco de quebrar o visor principal em atualizações severas, usamos a seguinte Bifurcação de Ambientes:

- **`/ (Diretório Raiz):`** A rocha inquebrável. É a tela principal que você carrega. Estética de ponta (Dark/Light Modes, Ticker inteligente), porém operando o Login Estático Dinâmico Matemático (Dia + Min/Ano). Não tem vínculos OAUTH.
- **`/dev (O Laboratório):`** Onde os novos motores são costurados. Esta filial abriga a Engine do **Firebase Authentication** com o botão "Google Sign-In". É usada de ponta-de-lança para interceptar acessos da API do Google Calendar.
- **`/bkp:`** Arquivos Históricos Originais gerados no "Fork" do V13/V14.

## A "Blindagem" Essencial de Memória
A maior dor de tablets antigos é o envenenamento por Cache de longo prazo, onde o navegador recusa buscar novas linhas do Github Pages.
- Na cabeça do `index.html` nós usamos metatags de `Cache-Control: no-cache, no-store`.
- No carregamento lógico invocamos arquivos físicos com "Cache Busters" Dinâmicos (Exe: `style.css?v=28373`), forçando o WebKit a efetuar um *Hard Reload* sempre e prevenindo despejo de memória vazando.
