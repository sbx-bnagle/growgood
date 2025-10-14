/**
  * Search and filter
  *
  * @description
  *
  * @param  config         
  * An object of configuration settings:
  *
  *
  * @return new instance of AppendText
  */



// dom elements and other vars that need globalish scope
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

let searchTerm;

const cat_select      = document.getElementById('js_cat_select');
const cat_select_bttn = document.getElementById('js_cat_select_bttn');
const cat_select_menu = document.getElementById('js_cat_select_menu');
const cat_select_item = document.getElementsByClassName('js_cat_menuitem');
const cntrl_bar       = document.getElementById('js_controlbar');
const searchInput     = document.getElementById('search-input');
const searchForm      = document.getElementById('search-form');
const header          = document.getElementById('js_header');
const entryList      = document.getElementById('js_entry-list');
const entryListUL     = document.getElementById('js_entry-list-ul');
const entries         = document.getElementsByClassName('js_entry');





// Functions
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------


// grab the current search query
const queryGet = function () {
  searchTerm = searchInput.value;
}

// open the filter menu
const menuOpen = function() {
  if( !cat_select_menu.style.display || cat_select_menu.style.display == 'none') {
    cat_select_menu.style.display = 'block';
  }
  else {
    cat_select_menu.style.display = 'none';
  }
}

// close the filter menu
const menuClose = function() {
  if( cat_select_menu.style.display == 'block') {
    cat_select_menu.style.display = 'none';
  }
}

// scroll to top of entry list
const entriesToTop = function() {
  document.body.style.overflow = 'hidden';
  entryList.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
  document.body.style.overflow = 'auto';
}

// update filter menu to display selected cat (category)
const menuUpdate = function( cat ) {
  for (let i = 0; i < cat_select_item.length; i++) {
    if ( cat == cat_select_item[i].dataset.cat) {
      cat_select_item[i].classList.add('selected');
    } else if ( cat_select_item[i].classList.contains('selected') ) {
      cat_select_item[i].classList.remove('selected');
    }
  }
}

// apply category filters
const filterApply = function( cat ) {
  entryList.style.height = entryList.offsetHeight + 'px';
  for (let i = 0; i < entries.length; i++) {    
    entries[i].classList.remove('js_visible');
    entries[i].classList.add('js_hidden');
    setTimeout(() => {
      if ( cat == entries[i].dataset.cat ) {
        if ( entries[i].classList.contains('js_hidden'))  { entries[i].classList.remove('js_hidden'); }
        if (!entries[i].classList.contains('js_visible')) { entries[i].classList.add('js_visible'); }
      } 
    }, 350);
  }
  entryList.style.height = 'auto';
}

// remove category filters
const filtersRemove = function() {
  entryList.style.height = entryList.offsetHeight + 'px';
  for (let i = 0; i < entries.length; i++) {
    entries[i].classList.remove('js_visible');
    entries[i].classList.add('js_hidden');
    entries[i].classList.remove('js_hidden');
    entries[i].classList.add('js_visible');
  }
  entryList.style.height = 'auto';
}


// Create and append the search result listings
// the results will be hidden until you run filterApply for the animated reveal
// the filter cat for these is 'search-result'
const resultsInsert = function( results, store ) {
  let appendSearchItems = '';
  let appendSearchHead = '';
  if (results.length) {
    appendSearchHead += '<span id="js_search-close" class="search__close js_searchStuff">&times;</span>';
    appendSearchHead += '<h2 class="search__title js_searchStuff">Search results for: '+searchTerm+'</h2>';
    for (let i = 0; i < results.length; i++) {  
      let item = store[results[i].ref];
      appendSearchItems += '<li class="js_hidden js_entry js_searchStuff" data-cat="search-result"><a href="' + item.url + '"><h2 class="entry__title">' + item.title + '</h2></a>';
      appendSearchItems += '<p class="entry__desc">' + item.content.substring(0, 250) + '...</p></li>';
    }
  } else {
    appendSearchHead += '<h2 class="search__title js_searchStuff">No results found</h2>';
  }
  entryList.insertAdjacentHTML('afterbegin', appendSearchHead);
  entryListUL.innerHTML += appendSearchItems;

  // event listener for close button
  let close = document.getElementById('js_search-close');
  close.addEventListener('click', () => {
    searchClear();
    filtersRemove();
    filterbttnOn();
    entriesToTop();
    menuUpdate('all');
  });
}


// Use fuse.js create list of fuzzy matched keywords from query
const fuseresultsGet = function ( store ) {
  let fuse = new Fuse(store, {
    includeMatches: true,
    keys: ['title', 'content'],
    threshold: 0.6,
    minMatchCharLength: searchTerm.length - 1
  });
  let fuseResult = fuse.search(searchTerm);
  return fuseResult;
}


// Create an array of matched terms from the fuseResults
const fusetermsGet = function ( fuseResult ) {
  let fuzzyTerms = [];
  fuseResult.forEach(resultItem => {
    const matches = resultItem.matches;
    matches.forEach(match => {
      match.indices.forEach(indexPair => {
        let [start, end] = indexPair;
        let matchedTerm = match.value.slice(start,end);
        fuzzyTerms.push(matchedTerm);
      });
    });
  });
  return fuzzyTerms;
}


// Pass the fuzzily matched terms from fuse to mark.js for highlighting
const fusetermsHighlight = function( fuzzyTerms ) {
  let markInstance = new Mark(entryListUL);
  markInstance.mark(fuzzyTerms, {'accuracy': 'complementary'});
}


// Set search value on searchbox input
const searchvalueSet = function() {
  searchInput.setAttribute("value", searchTerm);
}


// Perform lunr.js search
const lunrSearch = function() {
  let idx = lunr(function () {
    this.field('title', { boost: 10 });
    this.field('content');
    for ( let i = 0; i < window.store.length; i++ ) { 
      this.add({
        'id': i,
        'title': window.store[i].title,
        'content': window.store[i].content
      });
    }
  });
  var lunrResults = idx.search(searchTerm+'~1');
  return lunrResults;
}


// Clear out search input
const searchinputClean = function() {
  searchInput.value = '';
  searchInput.blur();
}


// Disable filter select button
const filterbttnOff = function() {
  cat_select_bttn.classList.add('cat_select_unavailable');
  cat_select_bttn.disabled = true;
}


// Enable filter select button
const filterbttnOn = function() {
  cat_select_bttn.classList.remove('cat_select_unavailable');
  cat_select_bttn.disabled = false;
}

// Remove all generated 'search-stuff'
const searchClear = function() {
  let searchStuff = document.getElementsByClassName('js_searchStuff');
  Array.from(searchStuff).forEach((thing) => {
    thing.remove();
  });
}



// Event listening/Method Chaining
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

// on submit of search form
searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  queryGet();
  searchClear();
  if( searchTerm ) {
    // get relevant fuzzy matches with fuse
    let fuzzyTerms = fuseresultsGet( window.store );
    fuzzyTerms     = fusetermsGet( fuzzyTerms );
    // Do search and insert results
    let results = lunrSearch();
    results = resultsInsert(results, window.store);
    // Highlight matched keywords
    fusetermsHighlight( fuzzyTerms );
    // display stuff
    // filtering results as if 'search-result' is the entries category
    filterApply( 'search-result' );
    // scroll results to top
    entriesToTop();
    // turn off filter button and reset search input
    searchinputClean();
    filterbttnOff();
  }
});


// THIS HAS BEEN MOVED TO resultsInsert() WHERE THE CLOSE BUTTON IS CREATED
// on click of search close
// let close = document.getElementById('js_search-close');
// close.addEventListener('click', () => {
//   searchClear();
//   filtersRemove();
//   filterbttnOn();
// });

// on click of the filter menu button
cat_select_bttn.addEventListener('click', () => {
  menuOpen();
});

// on click of anything else when the filter menu is open
document.addEventListener('click', function(e) {    
  if (cat_select && !cat_select.contains(e.target)) {
    menuClose();
  }
});

// on click of item from the filter menu
Array.from(cat_select_item).forEach((item) => {
  item.addEventListener('click', () => {
    let cat = item.dataset.cat;
    if( cat == 'all' ){
      filtersRemove();
    } else {
      filterApply(cat);
    }
    entriesToTop();
    menuUpdate(cat);
  });
});









