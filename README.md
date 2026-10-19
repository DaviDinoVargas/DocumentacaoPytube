# Documentação do DinoTube

Documentação técnica e demonstrativa do **DinoTube**, aplicativo desktop para assistir, baixar e organizar vídeos em uma biblioteca pessoal.

**Página:** https://davidinovargas.github.io/DocumentacaoPytube/  
**Aplicativo:** [DaviDinoVargas/pytube](https://github.com/DaviDinoVargas/pytube)

O conteúdo acompanha a proposta da documentação da Locadora: páginas temáticas, explicação da arquitetura e do domínio, fluxos técnicos e exemplos extraídos do projeto. A navegação inclui visões demonstrativas e interativas para layouts, temas e etapas do download.

## Conteúdo

- Visão geral e primeiros passos
- Arquitetura, domínio e consulta da biblioteca
- Provedores, downloads, player e fila
- Demonstrações dos seis layouts e temas
- Armazenamento, migração, backups e manutenção
- Acessibilidade, estratégia de testes e configuração
- Dependências, empacotamento e limites conhecidos

Os dados usados nas ilustrações da biblioteca são fictícios e identificados como exemplos. As descrições funcionais foram conferidas no código-fonte e no README do DinoTube em 19 de outubro de 2026.

## Abrir localmente

O site não requer dependências de build. Para evitar restrições do navegador ao carregar arquivos locais, sirva a pasta por HTTP:

```powershell
python -m http.server 8000
```

Abra http://localhost:8000. Também é possível abrir `index.html` diretamente no navegador.

A fonte Inter está em `assets/inter-latin-wght-normal.woff2` e é distribuída sob a [SIL Open Font License 1.1](assets/OFL.txt), com aviso de copyright incluído.

## Publicação

O workflow `.github/workflows/deploy-pages.yml` prepara os arquivos estáticos e publica no GitHub Pages a cada push na `main`. Para a primeira publicação, configure **Settings → Pages → Build and deployment → Source: GitHub Actions** no repositório.

## Estrutura

```text
index.html                     shell do site
assets/styles.css              identidade visual, tema claro/escuro e responsividade
assets/docs.js                 conteúdo das páginas
assets/app.js                  navegação, busca e demonstrações
assets/favicon.svg             ícone
assets/inter-latin-wght-normal.woff2
assets/OFL.txt                 licença da fonte Inter
.github/workflows/deploy-pages.yml
```

## Atualizar a documentação

Confira o fluxo no código em `A:\pytube\pytube`. Mantenha as ilustrações claramente identificadas, evite divulgar números de execução que não foram medidos e atualize a data de referência se a documentação for revisada com uma versão posterior do projeto.
