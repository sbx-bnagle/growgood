




// Functions
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------

// Populate details
const detailsPopulate = function( plant ){
  detailsOpen();
}

// Open details pane
const detailsOpen = function(){
  console.log('OPEN!');
  console.log(detailsPane);
  console.log(detailsPane.classList);
  detailsPane.classList.remove('details_closed');
  detailsPane.classList.add('details_open');
  console.log(detailsPane.classList);
}

// Close details pane
const detailsClose = function(){
  detailsPane.classList.remove('details_open');
  detailsPane.classList.add('details_closed');
}





// Listener
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------

// Open when details link clicked (and prevent default)
// Close when close button clicked
// Close when anywhere off the pane is clicked

detailsCloseButton.addEventListener('click', (e) => {
  detailsClose();
});

// open button listener in listPlants in template folder

document.addEventListener('click', function(e) {
  if (detailsPane && !detailsPane.contains(e.target) && detailsPane.classList.contains('details_open')) {
    detailsClose();
  }
});