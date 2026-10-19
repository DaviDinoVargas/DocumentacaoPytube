(() => {
  const docs = window.DINOTUBE_DOCS || [];
  const nav = document.querySelector('#nav');
  const content = document.querySelector('#content');
  const search = document.querySelector('#search');
  const repoLink = document.querySelector('.repo-link');
  const groups = [...new Set(docs.map(page => page.group))];
  const sourceFiles = {
    'visao-geral':['README.md','app/bootstrap.py'],
    'primeiros-passos':['README.md','main.py','requirements.txt'],
    arquitetura:['app/bootstrap.py','app/ui/main_window.py','app/ui/workers.py'],
    dominio:['app/domain/models.py','app/domain/query.py','app/domain/states.py'],
    provedores:['app/infrastructure/providers/base.py','app/infrastructure/providers/chain.py','app/infrastructure/providers/quality.py'],
    downloads:['app/services/download_service.py','app/infrastructure/media/ffmpeg.py','tests/integration/test_downloads.py'],
    player:['app/domain/playback.py','app/ui/player/shortcuts.py','app/ui/player/player_widget.py'],
    layouts:['app/domain/layouts.py','app/ui/pages/settings_page.py','README.md'],
    biblioteca:['app/domain/queue.py','app/domain/recommend.py','app/ui/pages/library_page.py'],
    armazenamento:['app/services/storage_service.py','app/repositories/base.py','app/repositories/sqlite_store.py','app/repositories/json_store.py'],
    'backup-manutencao':['app/services/backup_service.py','app/services/maintenance_service.py','tests/integration/test_backup.py'],
    temas:['app/styles/tokens.py','app/styles/contrast.py','app/styles/theme_manager.py','tests/ui/test_theme_structure_ui.py'],
    acessibilidade:['app/ui/player/shortcuts.py','tests/ui/test_accessibility.py','README.md'],
    testes:['pytest.ini','tests/conftest.py','tests/integration/test_downloads.py'],
    configuracao:['app/services/settings_service.py','app/services/provider_service.py','app/ui/pages/settings_page.py','app/i18n.py'],
    dependencias:['requirements.txt','requirements-dev.txt','app/domain/models.py','app/services/library_service.py'],
    empacotamento:['DinoTube.spec','packaging/build_windows.bat','third_party/ffmpeg/README.txt'],
    'decisoes-limites':['README.md','app/infrastructure/providers/chain.py','app/services/storage_service.py']
  };
  let toastTimer;

  function norm(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  }

  function renderNav(query = '') {
    const q = norm(query.trim());
    const visible = docs.filter(page => !q || norm(`${page.title} ${page.eyebrow} ${page.lead} ${page.body}`).includes(q));
    nav.innerHTML = groups.map(group => {
      const pages = visible.filter(page => page.group === group);
      return pages.length ? `<div class="nav-group">${group}</div>${pages.map(page => {
        const index = docs.indexOf(page) + 1;
        return `<a class="nav-link${location.hash === `#${page.id}` ? ' active' : ''}" href="#${page.id}" data-page="${page.id}"><span class="nav-number">${String(index).padStart(2, '0')}</span><span>${page.title}</span></a>`;
      }).join('')}` : '';
    }).join('');
  }

  function drawDownloadDemo() {
    const root = document.querySelector('#download-demo');
    if (!root) return;
    const stages = ['queued', 'resolving', 'downloading', 'merging', 'finalizing', 'completed'];
    const labels = ['Fila', 'Resolver', 'Baixar', 'Juntar', 'Validar', 'Pronto'];
    let stage = Number(root.dataset.stage || 2);
    const pct = [0, 8, 62, 83, 96, 100][stage];
    root.innerHTML = `<div class="download-head"><b>${stages[stage]}</b><span>${pct}% &nbsp;·&nbsp; Exemplo local</span></div><div class="download-track"><span style="width:${pct}%"></span></div><div class="download-stages">${labels.map((label, i) => `<div class="download-stage${i <= stage ? ' on' : ''}">${label}</div>`).join('')}</div>`;
  }

  const layoutExamples = [
    {key:'classic', name:'Biblioteca clássica', desc:'Menu lateral, player central, relacionados abaixo e detalhes opcionais.', feature:'MENU LATERAL · PLAYER CENTRAL'},
    {key:'streaming', name:'Streaming', desc:'Abas no topo, início com destaque e fileiras horizontais de vídeos.', feature:'DESTAQUE · FILEIRAS HORIZONTAIS'},
    {key:'cinema', name:'Modo cinema', desc:'Player amplo; cabeçalho e controles recolhem durante a reprodução.', feature:'PLAYER AMPLO · CONTROLES DISCRETOS'},
    {key:'manager', name:'Gerenciador', desc:'Árvore de navegação, tabela com filtros e painel de prévia.', feature:'TABELA · FILTROS · PRÉVIA'},
    {key:'workstation', name:'Estação de trabalho', desc:'Biblioteca ao lado do player, painel de detalhes e barra de estado.', feature:'PAINÉIS · NOTAS · DETALHES'},
    {key:'compact', name:'Compacto e flutuante', desc:'Janela pequena, controles essenciais e fila sempre à mão.', feature:'JANELA PEQUENA · FILA'}
  ];

  function drawLayouts(selected = 'classic') {
    const root = document.querySelector('#layout-demo');
    if (!root) return;
    root.dataset.layout = selected;
    const control = document.querySelector('#layout-controls');
    control.innerHTML = layoutExamples.map(item => `<button type="button" class="${item.key === selected ? 'active' : ''}" data-layout-choice="${item.key}" aria-pressed="${item.key === selected}">${item.name.split(' ')[0]}</button>`).join('');
    const item = layoutExamples.find(x => x.key === selected) || layoutExamples[0];
    document.querySelector('#layout-name').textContent = item.name;
    document.querySelector('#layout-description').textContent = item.desc;
    document.querySelector('#layout-feature').textContent = item.feature;
  }

  const palettes = [
    {name:'Floresta',colors:['#14251f','#234333','#c1f17c','#85cfa2']},
    {name:'Oceano',colors:['#11212b','#1b4254','#7fd5db','#95b8ef']},
    {name:'Nord',colors:['#202834','#3a4657','#89b8c2','#b48ead']},
    {name:'Dracula',colors:['#282a36','#44475a','#bd93f9','#ff79c6']},
    {name:'Terminal',colors:['#101a12','#233427','#88e765','#c4dca2']},
    {name:'Editorial',colors:['#f4efe5','#e5dccb','#873e2d','#49563e']},
    {name:'Pastel',colors:['#282536','#403a50','#f1b5c6','#a5d8cb']},
    {name:'Terra',colors:['#2b201b','#584034','#e7a875','#bfce87']}
  ];

  function drawPalettes(selected = 'Floresta') {
    const root = document.querySelector('#theme-swatches');
    if (!root) return;
    root.innerHTML = palettes.map(p => `<button type="button" class="swatch${p.name === selected ? ' active' : ''}" data-palette="${p.name}" aria-pressed="${p.name === selected}"><span class="swatch-colors">${p.colors.map(color => `<i style="background:${color}"></i>`).join('')}</span>${p.name}</button>`).join('');
  }

  function renderPage(id) {
    const page = docs.find(item => item.id === id) || docs[0];
    if (!page) return;
    const sources = (sourceFiles[page.id] || []).map(path => `<a href="https://github.com/DaviDinoVargas/pytube/blob/main/${path}" target="_blank" rel="noreferrer"><code>${path}</code><span>↗</span></a>`).join('');
    content.innerHTML = `<div class="page-intro"><p class="eyebrow">${page.eyebrow}</p><h1 class="page-title">${page.title}</h1><p class="page-lead">${page.lead}</p></div>${page.body}<section class="source-panel" aria-label="Fontes no código"><div><p class="eyebrow">LEITURA DIRETA</p><h2>Fontes no código</h2><p>Arquivos usados para conferir esta página.</p></div><div class="source-links">${sources}</div></section>`;
    document.title = `${page.title} · DinoTube`;
    document.querySelector('#crumb-current').textContent = page.title;
    renderNav(search.value);
    history.replaceState(null, '', `#${page.id}`);
    document.body.classList.remove('nav-open');
    document.querySelector('#menu-toggle').setAttribute('aria-expanded', 'false');
    window.scrollTo({top: 0, behavior: 'smooth'});
    drawDownloadDemo();
    drawLayouts();
    drawPalettes();
  }

  function showSearchResults(query) {
    const q = norm(query.trim());
    const matches = docs.filter(page => norm(`${page.title} ${page.eyebrow} ${page.lead} ${page.body}`).includes(q));
    const safeQuery = query.replace(/[&<>"']/g, '');
    content.innerHTML = `<div class="page-intro"><p class="eyebrow">PESQUISA</p><h1 class="page-title">Resultados para “${safeQuery}”</h1><p class="page-lead">${matches.length} tópico${matches.length === 1 ? '' : 's'} encontrado${matches.length === 1 ? '' : 's'} nesta documentação.</p></div>${matches.length ? `<div class="card-grid">${matches.map(page => `<a class="card search-result" href="#${page.id}" data-result="${page.id}"><span class="eyebrow">${page.eyebrow}</span><h3>${page.title}</h3><p>${page.lead}</p><small>ABRIR TÓPICO →</small></a>`).join('')}</div>` : '<div class="empty-results">Nenhum tópico corresponde à busca. Tente outra palavra, como “player”, “tema” ou “backup”.</div>'}`;
    document.title = `Busca: ${query} · DinoTube`;
    document.querySelector('#crumb-current').textContent = 'Busca';
    renderNav(query);
  }

  function toast(message) {
    const el = document.querySelector('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2100);
  }

  function openPage(id) {
    search.value = '';
    renderNav();
    renderPage(id);
  }

  nav.addEventListener('click', event => {
    const link = event.target.closest('[data-page]');
    if (!link) return;
    event.preventDefault();
    openPage(link.dataset.page);
  });

  content.addEventListener('click', event => {
    const go = event.target.closest('[data-go]');
    if (go) { openPage(go.dataset.go); return; }
    const result = event.target.closest('[data-result]');
    if (result) { openPage(result.dataset.result); return; }
    const download = event.target.closest('[data-download]');
    if (download) {
      const root = document.querySelector('#download-demo');
      const current = Number(root.dataset.stage || 2);
      root.dataset.stage = download.dataset.download === 'reset' ? 0 : (current + 1) % 6;
      drawDownloadDemo();
      return;
    }
    const layout = event.target.closest('[data-layout-choice]');
    if (layout) { drawLayouts(layout.dataset.layoutChoice); return; }
    const palette = event.target.closest('[data-palette]');
    if (palette) {
      const p = palettes.find(item => item.name === palette.dataset.palette);
      if (p) {
        const light = p.name === 'Editorial';
        document.body.classList.remove('light');
        document.querySelector('#theme-label').textContent = light ? 'Claro' : 'Escuro';
        const root = document.documentElement.style;
        root.setProperty('--bg', p.colors[0]);
        root.setProperty('--side', light ? '#eee7d9' : p.colors[0]);
        root.setProperty('--surface', p.colors[1]);
        root.setProperty('--surface2', light ? '#d9cfbc' : `color-mix(in srgb, ${p.colors[1]} 78%, ${p.colors[0]})`);
        root.setProperty('--line', light ? '#c9bda9' : `color-mix(in srgb, ${p.colors[1]} 64%, ${p.colors[2]})`);
        root.setProperty('--text', light ? '#29251f' : '#edf2e9');
        root.setProperty('--muted', light ? '#655d50' : '#9eadaa');
        root.setProperty('--dim', light ? '#837967' : '#6f817d');
        root.setProperty('--accent', p.colors[2]);
        root.setProperty('--mint', p.colors[3]);
        root.setProperty('--accent-ink', light ? '#fff9f0' : '#172018');
        drawPalettes(p.name);
        toast(`Paleta conceitual “${p.name}” aplicada à documentação`);
      }
    }
  });

  search.addEventListener('input', () => {
    renderNav(search.value);
    if (search.value.trim()) showSearchResults(search.value);
    else openPage(location.hash.slice(1) || docs[0].id);
  });
  search.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      const first = content.querySelector('[data-result]');
      if (first) openPage(first.dataset.result);
    }
    if (event.key === 'Escape') { search.value = ''; openPage(location.hash.slice(1) || docs[0].id); search.blur(); }
  });

  document.querySelector('#theme-toggle').addEventListener('click', () => {
    document.documentElement.removeAttribute('style');
    document.body.classList.toggle('light');
    const light = document.body.classList.contains('light');
    document.querySelector('#theme-label').textContent = light ? 'Claro' : 'Escuro';
    try { localStorage.setItem('dinotube-docs-theme', light ? 'light' : 'dark'); } catch {}
  });

  document.querySelector('#menu-toggle').addEventListener('click', event => {
    const open = document.body.classList.toggle('nav-open');
    event.currentTarget.setAttribute('aria-expanded', String(open));
  });
  document.querySelector('#scrim').addEventListener('click', () => document.body.classList.remove('nav-open'));

  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      search.focus();
      search.select();
    }
  });
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    document.querySelector('#reading-progress').style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  }, {passive:true});
  window.addEventListener('hashchange', () => renderPage(location.hash.slice(1)));

  try {
    if (localStorage.getItem('dinotube-docs-theme') === 'light') {
      document.body.classList.add('light');
      document.querySelector('#theme-label').textContent = 'Claro';
    }
  } catch {}
  repoLink.href = 'https://github.com/DaviDinoVargas/DocumentacaoPytube';
  renderPage(location.hash.slice(1) || docs[0].id);
})();
