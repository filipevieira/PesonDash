# PersonDash

Um dashboard pessoal leve e responsivo, focado em alta compatibilidade (Retro-Moderno) ideal para rodar em dispositivos Android antigos.

## Estrutura
- `index.html`: Arquivo principal em HTML simples.
- `style.css`: Estilização segura e limpa sem utilizar mecânicas restritas em navegadores antigos.
- `app.js`: Lógica do sistema utilizando JavaScript puro (ES5).

## Deploy para o GitHub Pages (fvds.dev/dash)

Este projeto já está **100% configurado para o GitHub Pages**, inclusive para subdiretórios como `/dash`. 
Como o código não possui etapas complexas de sub-processamento de Build (ex: Vite ou React) e todas as rotas (scripts e CSS) já foram declaradas através de caminhos **completamente relativos** (exemplo: `href="style.css"` ao invés de `href="/style.css"`), as páginas rodarão de primeira.

**Passo-a-passo para hospedar no Github Pages:**
1. Crie um novo repositório limpo no GitHub (ex: `PersonDash` ou como preferir nomear).
2. Hospede todos estes arquivos na raíz da branch principal (`main`).
3. Vá nas configurações (Settings) do seu repositório no Github > Pages.
4. Escolha a sua Branch principal (main) e pasta `/root` e clique em Save.

Para atrelar ao seu subdomínio customizado `fvds.dev/dash`, certifique-se de preencher o link na área de **Custom Domain** se for o caso, ou apenas coloque o nome do repositório como `dash`, fazendo com que ele fique sob o domínio principal de desenvolvedor se as configurações globais do GitHub permitirem.
