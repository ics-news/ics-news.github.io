// ── CSV fetch 
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


const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRga-yt0dFE0ubFnEH5JuaHeuFjf6QEafFr8hZz-jAUm_oM-DoPd9PIkTorJVnEEmkKNfRaOoSUtGB1/pub?output=csv';
const API_KEY = 'AIzaSyB7Tx3Q31AWVH4S-dkHJWfuQbsbiDD0O1Y';

async function fetchFolderContents(folderUrl) {
  const folderId = getFolderID(folderUrl);
  const endpoint = `https://www.googleapis.com/drive/v3/files`
    + `?q='${folderId}'+in+parents+and+trashed=false`
    + `&fields=files(id,name,mimeType)`
    + `&key=${API_KEY}`;

  const res  = await fetch(endpoint);
  const data = await res.json();
  return data.files;

let ITEMS = [];
let activeYear = 'All';

const gallery     = document.getElementById('gallery');
const filtersEl   = document.getElementById('filters');
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');



function getFolderID(url) {
  const match = url.match(/\/folders\/([^/?#]+)/);
  return match ? match[1] : null;
}}

async function fetchCSV(csvUrl) {
  const res = await fetch(csvUrl);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return parseCSV(await res.text());
}

// ── Convert a GDrive link to a URL the browser can load directly
//    They can't be used directly in <img src> or window.open so
//    extract the file ID and build the correct format for each media type.
function resolveDriveUrl(rawUrl, type) {
  const match = rawUrl.match(/\/file\/d\/([^/?#]+)/);
  if (!match) return rawUrl; // not a Drive link — use as-is
  const id = match[1];
  // Images: uc?export=view gives a direct, embeddable image URL
  // Videos: /preview gives a Drive-hosted player page that opens cleanly in a new tab
  return type === 'video'
    ? `https://drive.google.com/file/d/${id}/preview`
    : `https://lh3.googleusercontent.com/d/${id}`;
}

// ── Turn a raw sheet row into something the page can render ────
// function normalizeItem(row) {
//   const type   = (row.Type || '').toLowerCase() === 'video' ? 'video' : 'image';
//   const rawUrl = (row.URL || '').trim();
//   const url    = resolveDriveUrl(rawUrl, type);
//   return { type, url, year: row.Year || '', caption: row.Caption || '' };
// }

async function normalizeFolder(row) {
  const files = await fetchFolderContents(row.URL);
  return files.map(file => ({
    type:    file.mimeType.startsWith('video') ? 'video' : 'image',
    url:     file.mimeType.startsWith('video')
              ? `https://drive.google.com/file/d/${file.id}/preview`
              : `https://lh3.googleusercontent.com/d/${file.id}`,
    year:    row.Year,
    caption: row.Caption
  }));
}

// ── Year filter buttons, built from whatever years actually appear ──
function buildFilters() {
  const years = [...new Set(ITEMS.map(i => i.year).filter(Boolean))]
    .sort()
    .reverse(); // "2024/2025" sorts after "2023/2024" — newest first

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

    const meta = item.year
    ? `${item.year} · ${item.type === 'video' ? 'Video' : 'Photo'}`
    : (item.type === 'video' ? 'Video' : 'Photo');

    if (item.type === 'video') {
      card.innerHTML = `
        <div class="archive-thumb-wrap">
        <div class="archive-thumb-video"><span class="archive-play-icon"></span></div>
        </div>
        <div class="archive-body">
        ${item.caption ? `<p class="archive-caption">${item.caption}</p>` : ''}
        <p class="archive-year">${meta}</p>
        </div>
    `;
      // Video links vary by host (Drive, etc.) — open in a new tab rather than embed
    card.addEventListener('click', () => window.open(item.url, '_blank', 'noopener'));
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
    card.addEventListener('click', () => openLightbox(item.url));
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

// ── Loading / error states ──────────────────────────────────────
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
        Resource display might be down. Check back later.
    </p>
    </div>`;
}

// ── Load ────────────────────────────────────────────────────────
async function load() {
  showLoading();
  try {
    const rows = await fetchCSV(SHEET_CSV_URL);
    const nested = await Promise.all(rows.map(normalizeFolder));
    ALL_ITEMS = nested.flat().filter(i => i.url);
    buildFilters();
    renderGrid();
  } catch (err) {
    showError('Could not load  ');
    console.log( err.message)
  }
}
load();