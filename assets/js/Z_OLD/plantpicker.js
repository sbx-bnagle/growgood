
// TO DO
// -----------------------------------------------------------------------------------------
// X  Create a plant object with constructor
// 2. Add plants to a selected plant list 
// 3. Additional views/info for the selected plant list
// 4. Export option for selected plant list
// 5. Make plant list filterable 
// 6. Make sure plant list is alphabetized

// FOR FILTERS
// 1. Add Zones
// 2. Break seasonal interest into three groups: bloom time, fall color, and seedheads
//    the chart will be a combination of these three plus an indication if it's evergreen
// 3. Hover states on the pills
// 4. Add action to button to reset filters

// REFINEMENTS
// 01. Stop window scroll when select pane is open
// X   Click outside select pane to close
// 03. Review names, establish better patterns
// X   Possibly break js file down into smaller components
// 05. Get counter info out of the plant list function, do async or callback
// 06. Take care of authorization errors in console (that don't seem to do anything)
// 07. Make sure Leah can sign in with her account
// 08. Way to stay signed-in?
// 09. Scroll to top of plant picker list once authorized
// 10. Hover states on the pill boxes
// 11. Zones as Ranges



// Set Up Vars, set initial states
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------



// const plantlist  = document.getElementById('plantlist');




// Functions
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------





// LISTENERS
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

// Listen to the count adjuster to update count and +/- from selected pane

// Listen to toggle selectPane visibility
selectedPaneTitle.addEventListener('click', () => {
  selectedToggle();
});

// Listen for update to counters to update selected plants
// Stuffed in listPlants() since the counters aren't available until its called
// More elegant way of doing this?
// Possibly as a function down here that's called at the end of listPlants()?


// Dual range slider listeners
fromSliderH.oninput = () => controlFromSlider(fromSliderH, toSliderH, fromInputH);
toSliderH.oninput = () => controlToSlider(fromSliderH, toSliderH, toInputH);
fromInputH.oninput = () => controlFromInput(fromSliderH, fromInputH, toInputH, toSliderH);
toInputH.oninput = () => controlToInput(toSliderH, fromInputH, toInputH, toSliderH);
fromSliderS.oninput = () => controlFromSlider(fromSliderS, toSliderS, fromInputS);
toSliderS.oninput = () => controlToSlider(fromSliderS, toSliderS, toInputS);
fromInputS.oninput = () => controlFromInput(fromSliderS, fromInputS, toInputS, toSliderS);
toInputS.oninput = () => controlToInput(toSliderS, fromInputS, toInputS, toSliderS);
