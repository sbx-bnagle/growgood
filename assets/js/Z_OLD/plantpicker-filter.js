
// Vars
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

let plantsFiltered = {};

const filterForm = document.getElementById('plantQuery');
const filterPane = document.getElementById('plantfilter');
const closeButton = document.getElementById('filter_close');
const openButton = document.getElementById('filter_open');
const plantlist = document.getElementById('plantlist');

// Dual range selector items
const fromSliderH = document.querySelector('#fromSliderH');
const toSliderH = document.querySelector('#toSliderH');
const fromInputH = document.querySelector('#fromInputH');
const toInputH = document.querySelector('#toInputH');
const fromSliderS = document.querySelector('#fromSliderS');
const toSliderS = document.querySelector('#toSliderS');
const fromInputS = document.querySelector('#fromInputS');
const toInputS = document.querySelector('#toInputS');
fillSlider(fromSliderH, toSliderH, '#1a1a1a', '#1a1a1a', toSliderH);
fillSlider(fromSliderS, toSliderS, '#1a1a1a', '#1a1a1a', toSliderS);
setToggleAccessible(toSliderH);
setToggleAccessible(toSliderS);



// Functions
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

// Compile filters for plant query
const queryCompile = function ( form ){
  // Create a FormData object from the form
	let data = new FormData(form);
	// Iterate over the key-value pairs in the FormData object
  // for (const [name, value] of formData.entries()) {
  //   console.log(`${name}: ${value}`);
  // }
	//convert FormData to a plain object
  data = Object.fromEntries(data.entries());

  let query = new PlantQuery(data);

  queryCompare(query);
  return true;
}















// Compare query against plant objects
const queryCompare = function ( query ){
  

  // MAPPING IT OUT
  // -------------------------------------------------------------------------

  // qkeys
  // will only be there if value included
  // appearance (object)
  // attributes (object)
  // easy       ('TRUE'/'FALSE')
  // name       (object)
  // reqs       (object)
  // xerophytic ('TRUE'/'FALSE')
  


  // pkey
  // ... Each plant as slug


  // plants[pkey], each plant object
  // appearance  (object)
  // attributes  (object)
  // easy        ('TRUE'/'FALSE')
  // name        (object)
  // reqs        (object)
  // xerophytic ('TRUE'/'FALSE')

  // + some we don't need here
  // slug        (object)
  // biz         (object)
  // description (object)
  // imgID       (object)
  // maintenance (object)


  // QUESTIONS
  // -------------------------------------------------------------------------




  // -------------------------------------------------------------------------


  // Copy all of plants into plantsFiltered
  // will chisel away at this as we move through the query
  plantsFiltered = plants;

  // iterate throuugh the query object at the top level and compare to the plant object
  // if no matches remove plant from plantsFiltered
  Object.keys(query).forEach(qkey => {
    Object.keys(plantsFiltered).forEach(pkey => {


      // split value into an array (may need to make exceptions)
      //  only helpful with the lists, possibly only do with certain pkeys?
      
      let match = false;

      if( qkey=='xerophytic' || qkey=='easy' ){
        if( plantsFiltered[pkey][qkey]=='TRUE'){
          match = true;
        } else {
          console.log('xerophytic/easy');
          delete plantsFiltered[pkey];
        }
      }
      else if ( qkey=='name' ){
        if( query.name.common.length > 0 ){
          let toMatch = Object.values(plantsFiltered[pkey][qkey]);
          let qName = query.name.common; //chose common, but both latin/common are the txt input at this point
          let fuseOpt = { threshold: 0.2 };
          let fuse = new Fuse(toMatch, fuseOpt);
          let result = fuse.search(qName);
          if (result.length > 0) {
            match = true;
          } else {
            console.log('name');
            delete plantsFiltered[pkey];
          }
        }
      }
      else if ( qkey=='height' ){
        if ( Number(query.height.min) <= Number(plantsFiltered[pkey].height.max) && Number(plantsFiltered[pkey].height.min) <= Number(query.height.max) ){
          match = true;
        } else {
          console.log('height');
          delete plantsFiltered[pkey];
        }
      }
      else if ( qkey=='spread' ){
        if ( Number(query.spread.min) <= Number(plantsFiltered[pkey].spread.max) && Number(plantsFiltered[pkey].spread.min) <= Number(query.spread.max) ){
          match = true;
        } else {
          console.log('spread');
          delete plantsFiltered[pkey];
        }
      }
      else if ( qkey=='si' && query[qkey].length > 0 ){
        // if there's a match && match = true
        // else: delete plantsFiltered[pkey];
        // NEED TO GET THE MONTHS FROM TOCOMPARE BEFORE COMPARING
        let toCompare = plantsFiltered[pkey].si;
        toCompare = toCompare.split(', ');
        if( toCompare.includes('Early Spring') ){
          let toDelete = toCompare.indexOf('Early Spring');
          toCompare.splice(toDelete, 1);
          toCompare.push('mar_e', 'mar_l');
        }
        if( toCompare.includes('Mid Spring') ){
          let toDelete = toCompare.indexOf('Mid Spring');
          toCompare.splice(toDelete, 1);
          toCompare.push('apr_e', 'apr_l');
        }
        if( toCompare.includes('Late Spring') ){
          let toDelete = toCompare.indexOf('Late Spring');
          toCompare.splice(toDelete, 1);
          toCompare.push('may_e', 'may_l');
        }
        if( toCompare.includes('Early Summer') ){
          let toDelete = toCompare.indexOf('Early Summer');
          toCompare.splice(toDelete, 1);
          toCompare.push('jun_e', 'jun_l');
        }
        if( toCompare.includes('Mid Summer') ){
          let toDelete = toCompare.indexOf('Mid Summer');
          toCompare.splice(toDelete, 1);
          toCompare.push('jul_e', 'jul_l');
        }
        if( toCompare.includes('Late Summer') ){
          let toDelete = toCompare.indexOf('Late Summer');
          toCompare.splice(toDelete, 1);
          toCompare.push('aug_e', 'aug_l');
        }
        if( toCompare.includes('Early Fall') ){
          let toDelete = toCompare.indexOf('Early Fall');
          toCompare.splice(toDelete, 1);
          toCompare.push('sept_e', 'sept_l');
        }
        if( toCompare.includes('Mid Fall') ){
          let toDelete = toCompare.indexOf('Mid Fall');
          toCompare.splice(toDelete, 1);
          toCompare.push('oct_e', 'oct_l');
        }
        if( toCompare.includes('Late Fall') ){
          let toDelete = toCompare.indexOf('Late Fall');
          toCompare.splice(toDelete, 1);
          toCompare.push('nov_e', 'nov_l');
        }
        if( toCompare.includes('Early Winter') ){
          let toDelete = toCompare.indexOf('Early Winter');
          toCompare.splice(toDelete, 1);
          toCompare.push('dec_e', 'dec_l');
        }
        if( toCompare.includes('Mid Winter') ){
          let toDelete = toCompare.indexOf('Mid Winter');
          toCompare.splice(toDelete, 1);
          toCompare.push('jan_e', 'jan_l');
        }
        if( toCompare.includes('Late Winter') ){
          let toDelete = toCompare.indexOf('Late Winter');
          toCompare.splice(toDelete, 1);
          toCompare.push('feb_e', 'feb_l');
        }
        if( query[qkey].some( value => toCompare.includes(value) ) ){
          console.log(query[qkey]);
          match = true;
        } else {
          console.log('si');
          console.log(query[qkey]);
          delete plantsFiltered[pkey];
        }
      }
      else if ( qkey=='reqs' || qkey=='appearance' ){     
        Object.keys(query[qkey]).forEach(qqkey => {
          if( plantsFiltered[pkey] ){
            if( query[qkey][qqkey].length > 0 ){
              let toCompare = plantsFiltered[pkey][qkey][qqkey];
              toCompare = toCompare.split(', ');
              if(Array.isArray( query[qkey][qqkey]) ){
                if( query[qkey][qqkey].some( value => toCompare.includes(value) ) ){
                  match = true;
                } else {
                  console.log('reqs/appearance');
                  delete plantsFiltered[pkey];
                }
              }   
            } 
          } 
        });  
      } 
    }); // plantsFiltered
  }); // query
  updatePlantlist(plantsFiltered);
}


// Switch out the plants in the plantlist
const updatePlantlist = function ( plants ){
  // fade out
  plantlist.classList.remove('pl-visible');
  plantlist.classList.add('pl-hidden');
  // update list of plants
  listPlants(plants);
  // scroll to top
  document.body.style.overflow = 'hidden';
  plantlist.scrollIntoView();
  document.body.style.overflow = 'auto';
  // fade in
  setTimeout(() => {
    plantlist.classList.remove('pl-hidden');
    plantlist.classList.add('pl-visible');
  }, 1000);
}
























const closeFilter = function() {
	filterPane.classList.remove('filter_open');
	filterPane.classList.add('filter_closed');
}

const openFilter = function(e) {
	filterPane.classList.remove('filter_closed');
	filterPane.classList.add('filter_open');
	e.stopPropagation();
}



// Dual range functions from
// https://medium.com/@predragdavidovic10/native-dual-range-slider-html-css-javascript-91e778134816
// -----------------------------------------------------------------------------------------

function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#1a1a1a', '#1a1a1a', controlSlider);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromSlider.value = from;
    }
}
    
function controlToInput(toSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#1a1a1a', '#1a1a1a', controlSlider);
    setToggleAccessible(toInput);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
    }
}

function controlFromSlider(fromSlider, toSlider, fromInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, '#1a1a1a', '#1a1a1a', toSlider);
  if (from > to) {
    fromSlider.value = to;
    fromInput.value = to;
  } else {
    fromInput.value = from;
  }
}

function controlToSlider(fromSlider, toSlider, toInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, '#1a1a1a', '#1a1a1a', toSlider);
  setToggleAccessible(toSlider);
  if (from <= to) {
    toSlider.value = to;
    toInput.value = to;
  } else {
    toInput.value = from;
    toSlider.value = from;
  }
}

function getParsed(currentFrom, currentTo) {
  const from = parseInt(currentFrom.value, 10);
  const to = parseInt(currentTo.value, 10);
  return [from, to];
}

function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
    const rangeDistance = to.max-to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
      ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
      ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget) {
  const toSlider = document.querySelector('#toSlider');
  if (Number(currentTarget.value) <= 0 ) {
    toSliderH.style.zIndex = 2;
    toSliderS.style.zIndex = 2;
  } else {
    toSliderH.style.zIndex = 0;
    toSliderS.style.zIndex = 0;
  }
}




// Event Listeners
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

filterForm.addEventListener('submit', (e) => {
	e.preventDefault();
	queryCompile( e.target );
});

closeButton.addEventListener('click', (e) => {
	closeFilter();
});

document.addEventListener('click', function(e) {
  if (filterPane && !filterPane.contains(e.target) && filterPane.classList.contains('filter_open')) {
		closeFilter();
  }
});

openButton.addEventListener('click', (e) => {
	openFilter(e);
});




