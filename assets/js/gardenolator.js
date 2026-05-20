/**
  * Garden area calculator
  *
  * @description
  *
  * @param  config         
  * An object of configuration settings:
  *
  * @return 
  */




// DOM References
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

const PRICE_PER_SQFT  = 4.25;
const DELIVERY_FEE    = 25;
const TYPE_CLASSES    = ['type-none', 'type-I', 'type-II', 'type-III'];

const modal           = document.querySelector('.js-gardenolator');
const closeBtn        = document.getElementById('gardenolator-close');
const openBtn         = document.getElementById('gadenolator-open');
const plotForm        = document.getElementById('plotter__dimensions');
const plot            = document.getElementById('plot');
const typeRadios      = document.querySelectorAll('#plotter__kits input');
const lengthInput     = document.getElementById('plotter__x-axis');
const widthInput      = document.getElementById('plotter__y-axis');
const updateBtn       = document.getElementById('plotter__amounts-update');
const quantityInputs  = [
  document.getElementById('item-quantity'),
  document.getElementById('item2-quantity'),
  document.getElementById('item3-quantity'),
];
const totalQuantityEl = document.getElementById('total__quantity');
const totalPriceEl    = document.getElementById('total-price');
const typeCurrentEl   = document.getElementById('plotter__drawcurrent');
const drawtypes       = document.getElementsByClassName('drawtype');
const drawframe       = document.getElementById('plotter__plot-wrapper');
const cart            = document.querySelector('.order__purchase');

let squares     = [];
let activeType  = 'type-I';
let isSelecting = false;
let startX, startY, selectionBox;




// Plot
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

const calcSquareSize = (rows, cols) => {
  const containerW = drawframe.offsetWidth;
  const containerH = drawframe.offsetHeight;

  if (!containerW || !containerH) {
    return `calc(90vw / ${cols})`;
  }

  const size = Math.min(
    containerW * 0.9 / cols,
    containerH * 0.9 / rows
  );
  return `${Math.max(16, Math.min(60, size))}px`;
};

const createPlot = (rows, cols) => {
  const size = calcSquareSize(rows, cols);
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < rows; i++) {
    const row = document.createElement('div');
    row.className  = 'plotter__row';
    row.style.height = size;

    for (let j = 0; j < cols; j++) {
      const sq = document.createElement('div');
      sq.className   = 'plotter__sq type-none';
      sq.style.cssText = `height:${size}; width:${size};`;
      sq.dataset.x   = j;
      sq.dataset.y   = i;
      sq.dataset.type = 'X';
      row.appendChild(sq);
    }
    fragment.appendChild(row);
  }

  plot.innerHTML = '';
  plot.appendChild(fragment);
  squares = Array.from(plot.getElementsByClassName('plotter__sq'));
};




// Square painting
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

const paintSquare = (sq) => {
  const alreadyActive = sq.classList.contains(activeType);
  TYPE_CLASSES.forEach(t => sq.classList.remove(t));

  if (alreadyActive) {
    sq.classList.add('type-none');
    sq.dataset.type = 'X';
  } else {
    sq.classList.add(activeType);
    sq.dataset.type = activeType.split('-').at(-1);
  }
};

const checkCollision = (rect1, rect2) => !(
  rect2.left   > rect1.right  ||
  rect2.right  < rect1.left   ||
  rect2.top    > rect1.bottom ||
  rect2.bottom < rect1.top
);




// Order & pricing
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

const updateOrderTotals = () => {
  let totalQty   = 0;
  let totalPrice = DELIVERY_FEE;

  quantityInputs.forEach(input => {
    const qty   = parseInt(input.value) || 0;
    const price = qty * PRICE_PER_SQFT;
    totalQty   += qty;
    totalPrice += price;

    const li      = input.closest('li');
    const priceEl = li?.querySelector('.item-price');
    if (priceEl) priceEl.textContent = `$${price.toFixed(2)}`;
  });

  totalQuantityEl.textContent = totalQty;
  totalPriceEl.textContent    = `$${totalPrice.toFixed(2)}`;
};

const syncPlotToOrder = () => {
  quantityInputs[0].value = document.querySelectorAll('.type-I').length;
  quantityInputs[1].value = document.querySelectorAll('.type-II').length;
  quantityInputs[2].value = document.querySelectorAll('.type-III').length;

  quantityInputs.forEach((input) => {
    input.classList.add('input-highlight');
    input.addEventListener('animationend', () => {
      input.classList.remove('input-highlight');
    }, { once: true });
  });

  const scrollPos = cart.offsetTop - 108;
  window.scrollTo(0, scrollPos);

  updateOrderTotals();
  toggleModal();
};




// Modal
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

const toggleModal = () => {
  const isOpen = modal.classList.toggle('display-block');
  modal.classList.toggle('display-none', !isOpen);
  // document.body.classList.toggle('no-scroll', isOpen);
  if (isOpen) {
    document.documentElement.classList.add('lenis-stopped');
  } else {
    document.documentElement.classList.remove('lenis-stopped');
  }
};




// Draw type selector
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

const changeDrawtype = (el) => {
  Array.from(drawtypes).forEach(d => d.classList.remove('current'));
  el.classList.add('current');
  activeType = el.dataset.type;
  const label = { 'type-I': 'Type I', 'type-II': 'Type II', 'type-III': 'Type III' };
  typeCurrentEl.querySelector('h4').textContent = `Fill With: ${label[activeType] ?? activeType}`;
};




// Mouse draw events (registered once)
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

document.addEventListener('mousedown', (e) => {
  if (!squares.length) return;
  isSelecting = true;
  selectionBox?.remove();

  if (e.target.classList.contains('plotter__sq')) {
    paintSquare(e.target);
  }

  const frame = drawframe.getBoundingClientRect();
  startX = e.clientX - frame.left;
  startY = e.clientY - frame.top + drawframe.scrollTop;

  selectionBox = document.createElement('div');
  selectionBox.style.cssText = `
    border: 1px dashed #000;
    position: absolute;
    left: ${startX}px;
    top: ${startY}px;
    z-index: 9999;
  `;
  drawframe.appendChild(selectionBox);
});

document.addEventListener('mousemove', (e) => {
  if (!isSelecting || !selectionBox) return;

  const frame    = drawframe.getBoundingClientRect();
  const currentX = e.clientX - frame.left;
  const currentY = e.clientY - frame.top + drawframe.scrollTop;

  selectionBox.style.width  = `${Math.abs(currentX - startX)}px`;
  selectionBox.style.height = `${Math.abs(currentY - startY)}px`;
  selectionBox.style.left   = `${Math.min(currentX, startX)}px`;
  selectionBox.style.top    = `${Math.min(currentY, startY)}px`;

  const selRect = selectionBox.getBoundingClientRect();
  squares.forEach(sq => {
    if (checkCollision(selRect, sq.getBoundingClientRect())) {
      TYPE_CLASSES.forEach(t => sq.classList.remove(t));
      sq.classList.add(activeType);
      sq.dataset.type = activeType.split('-').at(-1);
    }
  });
});

document.addEventListener('mouseup', () => {
  isSelecting = false;
  selectionBox?.remove();
  selectionBox = null;
});




// Event listeners
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

closeBtn.addEventListener('click', toggleModal);
openBtn.addEventListener('click', toggleModal);
updateBtn.addEventListener('click', syncPlotToOrder);

plotForm.addEventListener('submit', (e) => {
  e.preventDefault();
  createPlot(widthInput.value, lengthInput.value);
});

for (const radio of typeRadios) {
  radio.addEventListener('change', (e) => { activeType = e.target.value; });
}

Array.from(drawtypes).forEach(d => {
  d.addEventListener('click', (e) => changeDrawtype(e.target.closest('.drawtype')));
});

quantityInputs.forEach(input => {
  input.addEventListener('change', updateOrderTotals);
});


