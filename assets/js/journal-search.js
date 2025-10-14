/**
  * Lunr search for posts
  *
  * @description
  *
  * @param  config         
  * An object of configuration settings:
  *
  *
  * @return new instance of AppendText
  */




let searchTerm;
const entryList   = document.getElementById('js_entry-list');
const searchInput = document.getElementById('search-input');

const showResults = function (results, store) {
  if (results.length) { // If there are results...

    let appendString = '<span class="close">&times;</span>';
    appendString += '<h2 class="search__title">Search results for: '+searchTerm+'</h2>';
    appendString += '<ul id="search__results">';
    for (var i = 0; i < results.length; i++) {  // Iterate over them and generate html
      var item = store[results[i].ref];
      appendString += '<li><a href="' + item.url + '"><h3 class="entry__title">' + item.title + '</h3></a>';
      appendString += '<p class="entry__desc">' + item.content.substring(0, 250) + '...</p></li>';
    }
    appendString += '</ul>';

    // searchResults.innerHTML = appendString;
    entryList.innerHTML = appendString

    // Use fuse.js create list of fuzzy matched keywords from query
    let fuse = new Fuse(store, {
      includeMatches: true,
      keys: ['title', 'content'],
      threshold: 0.6,
      minMatchCharLength: searchTerm.length - 1
    });
    let fuseResult = fuse.search(searchTerm);

    // for each results -> matches -> indices
    // slice the match.value and push the string into fuzzyTerms
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

    // Use mark.js to highlight the keyword
    let searchResults = document.getElementById('search__results');
    let markInstance = new Mark(searchResults);
    markInstance.mark(fuzzyTerms, {'accuracy': 'complementary'});
  } else {
    searchResults.innerHTML = '<li>No results found</li>';
  }
}


const getQuery = function () {
  searchTerm = searchInput.value;
}



document.getElementById('search-form').addEventListener('submit', function(event) {
  event.preventDefault();   
  getQuery();

  if (searchTerm) {
    document.getElementById('search-input').setAttribute("value", searchTerm);

    // Initalize lunr.js with the fields to search.
    // The title field is given more weight with the "boost" parameter
    var idx = lunr(function () {
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

    var results = idx.search(searchTerm+'~1'); // Perform search with Lunr.js
    showResults(results, window.store);

    searchInput.value = '';
    searchInput.blur();
    const selectBttn = document.getElementById('js_cat_select_bttn');
    selectBttn.classList.add('cat_select_unavailable');
    selectBttn.disabled = true;
  }
});








