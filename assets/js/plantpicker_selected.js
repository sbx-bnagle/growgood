let refList = [];

// Toggle selectPane visibility
const paneToggle = function ( pane ) {
 if( pane.classList.contains('closed') ) {
  pane.classList.remove('closed');
  pane.classList.add('open');
 } else if ( pane.classList.contains('open') ) {
  pane.classList.remove('open');
  pane.classList.add('closed');
 }
}

// Update plant object count
const plantCountUpdate = function( slug ) {
 let plantCounter = document.getElementById(slug+'__count');
 Plants[slug].count = plantCounter.value;
 if ( plantCounter.value == 0 ){
  refRemove(slug);
 } else if ( plantCounter.value > 0 && !refList.includes(slug) ){
  refAdd(slug);
 } else {
  selectedListUpdate();
 }
}

// Add selected plant object/array of references
const refAdd = function( slug ){
  refList.push( slug );
  selectedListUpdate();
}

// Remove selected plant object/array of references
const refRemove = function( slug ){
  let slugIndex = refList.indexOf(slug);
  if (slugIndex > -1) {
    refList.splice(slugIndex, 1); 
  }
  selectedListUpdate();
}

// Update selected plant list
const selectedListUpdate = function( slug ){
  let list = '';
  if(refList.length) {
    refList.forEach( ref => {
      let lineItem = `
      <li><span class='picks-count'>${Plants[ref].count}</span>
      <span class='picks-name'>
      ${Plants[ref].name.common}, 
      <em>${Plants[ref].name.latin}</em>
      </span>
      </li>`;
      list += lineItem;
      plantpicks.innerHTML = list;
    });
  } else {
    plantpicks.innerHTML = '';
  }
}

export { paneToggle, plantCountUpdate };