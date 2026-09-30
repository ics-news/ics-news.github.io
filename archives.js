const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRga-yt0dFE0ubFnEH5JuaHeuFjf6QEafFr8hZz-jAUm_oM-DoPd9PIkTorJVnEEmkKNfRaOoSUtGB1/pub?output=csv';
// ═══════════════════════════════════════════════════════════════

let ITEMS = [];
let activeYear = 'All';

const gallery     = document.getElementById('gallery');
const filtersEl   = document.getElementById('filters');
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

// ── CSV fetch helpers ──────────────────────────────────────────
function splitCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') { inQuotes = !inQuotes; }
    else if (line[i] === ',' && !inQuotes) { result.push(current); current = ''; }
    else { current += line[i]; }
  }
  result.push(current);
  return result.map(v => v.replace(/^"|"$/g, '').trim());
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = splitCSVLine(lines[0]);
  return lines.slice(1)
    .filter(l => l.trim())
    .map(line => {
      const vals = splitCSVLine(line);
      const obj = {};
      headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim(); });
      return obj;
    });
}

async function fetchCSV(csvUrl) {
  const res = await fetch(csvUrl);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return parseCSV(await res.text());
}


function resolveDriveUrl(rawUrl, type) {
  let driveUrl;
  try {
    driveUrl = new URL(rawUrl);
  } catch {
    return rawUrl;
  }

  if (!driveUrl.hostname.endsWith('drive.google.com')) return rawUrl;

  const pathMatch = driveUrl.pathname.match(/\/file\/d\/([^/]+)/);
  const id = pathMatch?.[1] || driveUrl.searchParams.get('id');
  if (!id) return rawUrl;

  if (type === 'video') {
    return `https://drive.google.com/file/d/${id}/preview`;
  }

  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w1200`;
}

function normalizeItem(row) {
  const rawUrl = (row.URL || '').trim();
  let type = 'image';

  const explicitType = (row.Type || '').trim().toLowerCase();
  if (['video', 'movie', 'clip'].includes(explicitType)) {
    type = 'video';
  } else if (['image', 'photo', 'picture'].includes(explicitType)) {
    type = 'image';
  } else {
    // Auto-detect by extension when the URL itself reveals it.
    const videoExtensions = /\.(mov|mp4|webm|m4v|avi|mkv|flv|wmv|3gp)$/i;
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg|heic|heif)$/i;

    if (videoExtensions.test(rawUrl)) {
      type = 'video';
    } else if (imageExtensions.test(rawUrl)) {
      type = 'image';
    } else if (rawUrl.includes('drive.google.com')) {
      // Google Drive share links hide the original extension, so default to image
      // to keep photo previews inside the page instead of misclassifying them as video.
      type = 'drive';
    }
  }

  const url = resolveDriveUrl(rawUrl, type);
  const openUrl = type === 'drive' ? resolveDriveUrl(rawUrl, 'video') : url;
  
  return { type, url, openUrl, year: row.Year || '', caption: row.Caption || '' };
  
}

// ── Year filter buttons
function buildFilters() {
  const years = [...new Set(ITEMS.map(i => i.year).filter(Boolean))]
    .sort()
    .reverse(); // "2024/2025" sorts after "2023/2024" 

  filtersEl.innerHTML = '';
  ['All', ...years].forEach(year => {
    const btn = document.createElement('button');
    btn.className   = 'filter-btn' + (year === activeYear ? ' active' : '');
    btn.textContent = year;
    btn.addEventListener('click', () => {
      activeYear = year;
      filtersEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGrid();
    });
    filtersEl.appendChild(btn);
  });
}

// ── Render the grid for whichever year is currently selected ────
function renderGrid() {
  const items = activeYear === 'All' ? ITEMS : ITEMS.filter(i => i.year === activeYear);

  if (!items.length) {
    gallery.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;">Nothing here yet!</div>`;
    return;
  }

  gallery.innerHTML = '';
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'archive-card';

    const mediaLabel = item.type === 'video' ? 'Video' : item.type === 'drive' ? 'Media' : 'Photo';
    const meta = item.year ? `${item.year} · ${mediaLabel}` : mediaLabel;

    if (item.type === 'video') {
  card.innerHTML = `
    <div class="archive-thumb-wrap">
      <div class="archive-thumb-video">
        <span class="archive-play-icon"></span>
      </div>
    </div>
    <div class="archive-body">
      ${item.caption ? `<p class="archive-caption">${item.caption}</p>` : ''}
      <p class="archive-year">${item.year || ''} · Open media</p>
    </div>
  `;

  card.addEventListener('click', () => {
    window.open(item.url, '_blank', 'noopener');
  });
} else {
      card.innerHTML = `
        <div class="archive-thumb-wrap">
          <img src="${item.url}" alt="${item.caption}" loading="lazy">
        </div>
        <div class="archive-body">
          ${item.caption ? `<p class="archive-caption">${item.caption}</p>` : ''}
          <p class="archive-year">${meta}</p>
        </div>
      `;
      card.addEventListener('click', () => {
        if (item.type === 'drive') {
          window.open(item.openUrl, '_blank', 'noopener');
        } else {
          openLightbox(item.url);
        }
      });
    }

    gallery.appendChild(card);
  });
}

function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add('open');
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxImg.src = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

function showLoading() {
  gallery.innerHTML = `
    <div class="archive-loading" style="grid-column: 1 / -1;">
      <div class="dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
      Loading the archives
    </div>`;
}

function showError(msg) {
  gallery.innerHTML = `
    <div class="archive-error" style="grid-column: 1 / -1;">
      <p>${msg}</p>
      <p style="margin-top:0.75rem;font-size:0.85rem;">
        The display resource  might be down. Check back later.
        If this issue persists:
      </p>
      <a href="mailto:icskumasi.news@gmail.com" >Contact us</a>.
    </div>`;
}





async function load() {
  showLoading();
  try {
    const rows = await fetchCSV(SHEET_CSV_URL);
    ITEMS = rows.map(normalizeItem).filter(i => i.url);
    buildFilters();
    renderGrid();
  } catch (err) {
    showError('Could not load the archives.');
    console.warn(err.message);
  }
}


load();