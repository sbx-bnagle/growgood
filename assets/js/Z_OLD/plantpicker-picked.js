let selectedRef = [];
let counters;

const selectedPane = document.getElementById('plants-selected');
const selectedPaneTitle = document.getElementById('selected-title');
const plantpicks = document.getElementById('plantpicks');



// Functions
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------


// Toggle selectPane visibility
const selectedToggle = function () {
 if( selectedPane.classList.contains('closed') ) {
  selectedPane.classList.remove('closed');
  selectedPane.classList.add('open');
 } else if ( selectedPane.classList.contains('open') ) {
  selectedPane.classList.remove('open');
  selectedPane.classList.add('closed');
 }
}

// Update plant object count
const plantCountUpdate = function( slug ) {
 let plantCounter = document.getElementById(slug+'__count');
 plants[slug].count = plantCounter.value;
 if ( plantCounter.value == 0 ){
  selectedRefRemove(slug);
 } else if ( plantCounter.value > 0 && !selectedRef.includes(slug) ){
  selectedRefAdd(slug);
 } else {
  selectedListUpdate();
 }
}

// Add selected plant object/array of references
const selectedRefAdd = function( slug ){
  selectedRef.push( slug );
  selectedListUpdate();
}

// Remove selected plant object/array of references
const selectedRefRemove = function( slug ){
  let slugIndex = selectedRef.indexOf(slug);
  if (slugIndex > -1) {
    selectedRef.splice(slugIndex, 1); 
  }
  selectedListUpdate();
}

// Update selected plant list
const selectedListUpdate = function( slug ){
  let list = '';
  selectedRef.forEach( ref => {
    let lineItem = `
    <li><span class='picks-count'>${plants[ref].count}</span>
    <span class='picks-name'>
    ${plants[ref].nameCommon}, 
    <em>${plants[ref].nameLatin}</em>
    </span>
    </li>`;
    list += lineItem;
    plantpicks.innerHTML = list;
  });
}