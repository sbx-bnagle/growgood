



// Include drop downs
// ----------------------------------------------------------------------------
var dropdowns = document.getElementsByClassName('js-drop');

if (dropdowns.length > 0) {
	var menus = [];

	Array.prototype.forEach.call(dropdowns, function(el) {
		menus.push(new Dropdown({'hook': el.id, 'menu': el.dataset.menu}));	
	});

	Array.prototype.forEach.call(menus, function(m) {
		m.init();
	}); 
}




// Include scroll to top buttons
// ----------------------------------------------------------------------------
var bttn = document.getElementsByClassName('js-to-top');

if (bttn.length > 0) {
	const to_top = new toTop({});
	to_top.init();
}




// Load embedded video when click on cover image
// ----------------------------------------------------------------------------

var videocovers = document.getElementsByClassName('js-videocover');

// if length is > 0
if (videocovers.length > 0) {

	var videoloader = function( el ) {
		var embedCode = el.dataset.embed;
		el.innerHTML = "<div>" + embedCode + "</div>";
	}

	Array.prototype.forEach.call(videocovers, function(el) {
		el.addEventListener("click", function(e){
			videoloader(el);
		});	
	});


}




// Set up search bar
// ----------------------------------------------------------------------------

var searchTrig = document.getElementById("js-search-trig");
var searchTrigMob = document.getElementById("js-search-trig-mobile");
var searchBar = document.getElementById("js-searchbar");
var searchBarMob = document.getElementById("js-searchbar-mobile");
var searchClose = document.getElementById("js-searchbar-close");
var searchCloseMob = document.getElementById("js-searchbar-close-mobile");
var body = document.body;

var triggerToggle = function() {
	this.classList.toggle("active");
	if (searchBar.style.maxWidth || searchBarMob.style.maxWidth) {
  		searchBar.style.maxWidth = null;
  		searchBarMob.style.maxWidth = null;
	} else {
  		searchBar.style.maxWidth = "calc(75vw + 26px)";
  		searchBarMob.style.maxWidth = "100vw";
	} 
}

var closeSearch = function() {
	console.log('sc');
	if (searchBar.style.maxWidth || searchBarMob.style.maxWidth) {
		console.log('if');
  		searchBar.style.maxWidth = null;
  		searchBarMob.style.maxWidth = null;
	} 
}

searchTrig.addEventListener("click", triggerToggle);
searchTrigMob.addEventListener("click", triggerToggle);
searchClose.addEventListener("click", closeSearch);
searchCloseMob.addEventListener("click", closeSearch);


body.addEventListener("click", function(event) {
    if (event.target === searchBarMob || searchBarMob.contains(event.target) || event.target === searchTrigMob || searchTrigMob.contains(event.target) || event.target === searchBar || searchBar.contains(event.target) || event.target === searchTrig || searchTrig.contains(event.target)) {
        return false;
    } else {
    	closeSearch();
    }
});





// Pagination with list.js (https://listjs.com/)
// ----------------------------------------------------------------------------


// // Get list.js up and running if needed
// const perPage = 25;
// const itemCount = document.getElementById('js-upcoming-events').getElementsByClassName('list')[0].getElementsByTagName('li').length;

// if( itemCount > perPage ){

// 	const options = {
// 	  page: perPage,
// 	  pagination: [{
// 	      outerWindow: 1	 
// 	    }]
// 	};

// 	const upcomingList = new List('js-upcoming-events', options);


// 	// Add prev and next buttons
// 	let prev, 
// 			next,
// 			current;

// 	// Find total pages
// 	const pageCount = Math.ceil(upcomingList.size() / perPage);

// 	// Grab and add relevant elements
// 	const pagination = document.getElementById('js-pagination');
// 	pagination.insertAdjacentHTML('beforebegin', '<div id="js-prev" class="btn-prev"> Prev </div>');
// 	pagination.insertAdjacentHTML('afterend', '<div id="js-next" class="btn-next"> Next </div>');

// 	// function to set everything up and update as needed
// 	const position = function(){
// 		prev = document.getElementById('js-prev');
// 		next = document.getElementById('js-next');
// 		current = Math.ceil(upcomingList.i / perPage);
// 	}

// 	// call the function to set up values
// 	position();

// 	// set up event listeners
// 	prev.addEventListener("click", function(){
// 		if(current > 1) {
// 			upcomingList.show(upcomingList.i - perPage, upcomingList.page);
// 			position();
// 		}
// 	});
// 	next.addEventListener("click", function(){
// 		if(current < pageCount) {
// 			upcomingList.show(upcomingList.i + perPage, upcomingList.page);
// 			position();
// 		} 	
// 	});
	
// }
