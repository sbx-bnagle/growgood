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




// Set up gardenolator
// ----------------------------------------------------------------------------

// const gardenolator = document.querySelector('.js-gardenolator');

