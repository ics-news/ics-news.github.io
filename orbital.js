
const orbital = document.getElementById('orbital');
const centreX = orbital.offsetWidth / 2;
const centreY = orbital.offsetHeight / 2;


const scale           = orbital.offsetWidth / 500;
const idealRadius     = 180 * scale;
const discoveryRadius =  55 * scale;
const idealHalf       =  30 * scale;
const discHalf        =  18 * scale;


const idealNodes = document.querySelectorAll('.ideal-node');

const discoveryNodes = document.querySelectorAll('.discovery-node');



// ── Orbit path SVG ────────────────────────────────────────────────────────
const svg = document.getElementById('orbit-svg');
const NS  = 'http://www.w3.org/2000/svg';

const idealRing = document.createElementNS(NS, 'circle');
idealRing.setAttribute('cx', centreX);
idealRing.setAttribute('cy', centreY);
idealRing.setAttribute('r',  idealRadius);
idealRing.setAttribute('fill', 'none');
idealRing.setAttribute('stroke', '#00000018');
idealRing.setAttribute('stroke-width', '1');
idealRing.setAttribute('stroke-dasharray', '4 6');
svg.appendChild(idealRing);

const discoveryRings = {};
['I','D','E','A','L','S'].forEach(function(key) {
  const ring = document.createElementNS(NS, 'circle');
  ring.setAttribute('r',    discoveryRadius);
  ring.setAttribute('fill', 'none');
  ring.setAttribute('stroke', '#00000010');
  ring.setAttribute('stroke-width', '1');
  ring.setAttribute('stroke-dasharray', '3 5');
  svg.appendChild(ring);
  discoveryRings[key] = ring;
});

idealNodes.forEach(function(node) {
  node.style.setProperty('--node-color', IDEALS[node.dataset.ideal].color);
});

const parentCounts = {};
discoveryNodes.forEach(function(node) {
  const p = node.dataset.parent;
  if (parentCounts[p] === undefined) parentCounts[p] = 0;
  node._localIndex = parentCounts[p]++;
  const color = IDEALS[p].color;
  node.style.setProperty('--node-color', color);
  node.style.borderColor = color;
  const encodedName = node.dataset.name.replace(/ /g, '%20');
  node.style.backgroundImage = `url("assets/discoveries/${encodedName}.png")`;
});

idealNodes.forEach(function(node) {
  node.style.width    = (60 * scale) + 'px';
  node.style.height   = (60 * scale) + 'px';
  node.style.fontSize = (1.3 * scale) + 'rem';
});
discoveryNodes.forEach(function(node) {
  node.style.width  = (36 * scale) + 'px';
  node.style.height = (36 * scale) + 'px';
});

let rotationAngle = 0;
let discoveryAngle = 0;

function animate() {
  rotationAngle += 0.003;
  discoveryAngle += 0.006;

  idealNodes.forEach(function(node, index) {
    const angle = (index / idealNodes.length) * 2 * Math.PI
                  - Math.PI / 2
                  + rotationAngle;

    const x = centreX + idealRadius * Math.cos(angle);
    const y = centreY + idealRadius * Math.sin(angle);

    node.style.left = (x - idealHalf) + 'px';
    node.style.top  = (y - idealHalf) + 'px';

    node._cx = x;
    node._cy = y;

    discoveryRings[node.dataset.ideal].setAttribute('cx', x);
    discoveryRings[node.dataset.ideal].setAttribute('cy', y);
  });

  discoveryNodes.forEach(function(node) {
    const parentIdeal = node.dataset.parent;
    const parent = document.querySelector(
      `.ideal-node[data-ideal="${parentIdeal}"]`
    );

    const total = parentCounts[parentIdeal];
    const angle = (node._localIndex / total) * 2 * Math.PI + discoveryAngle;

    const x = parent._cx + discoveryRadius * Math.cos(angle);
    const y = parent._cy + discoveryRadius * Math.sin(angle);

    node.style.left = (x - discHalf) + 'px';
    node.style.top  = (y - discHalf) + 'px';
  });

  requestAnimationFrame(animate);
}


animate();



const popup     = document.getElementById('popup');
const popTag    = document.getElementById('popup-tag');
const popTitle  = document.getElementById('popup-title');
const popBody   = document.getElementById('popup-body');
const popLink   = document.getElementById('popup-link');
const popClose  = document.getElementById('popup-close');


idealNodes.forEach(function(node) {
  node.addEventListener('click', function() {

    const key  = node.dataset.ideal;
    const data = IDEALS[key];

    
    popTag.textContent   = 'IDEAL';
    popTag.style.color   = data.color;
    popTitle.textContent = data.name;
    popTitle.style.color = data.color;
    popBody.textContent  = data.desc
      + ' Discoveries: ' + data.discoveries.map(function(d) { return d.name; }).join(' · ');
    popLink.href = NEWS_URLS[data.name];

    const popImg = document.getElementById('popup-img');
    popImg.style.display = 'none';
    popup.classList.remove('popup-split');

    popup.classList.remove('hidden');
  });
});

discoveryNodes.forEach(function(node) {
  node.addEventListener('click', function() {

    const key       = node.dataset.parent;
    const data      = IDEALS[key];
    const discovery = data.discoveries.find(function(d) { return d.name === node.dataset.name; });

    popTag.textContent   = 'DISCOVERY';
    popTag.style.color   = data.color;
    popTitle.textContent = discovery.name;
    popTitle.style.color = data.color;
    popBody.textContent  = discovery.desc;
    popLink.href         = NEWS_URLS[data.name];

    const popImg = document.getElementById('popup-img');
    const encodedName = node.dataset.name.replace(/ /g, '%20');
    popImg.src = 'assets/discoveries/' + encodedName + '.png';
    popImg.style.display = 'block';
    popup.classList.add('popup-split');

    popup.classList.remove('hidden');
  });
});

popClose.addEventListener('click', function() {
  popup.classList.add('hidden');
});