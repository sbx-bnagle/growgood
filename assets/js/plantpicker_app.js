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
// --  grey out query button until plants load




// Import Modules
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
// import { Plant, PlantQuery } from './plantpicker_plant-classes.js';
import * as query from './plantpicker_query.js';
import * as range from './plantpicker_query-range.js';
import * as list from './plantpicker_list.js';
import * as detail from './plantpicker_details.js';
import * as selected from './plantpicker_selected.js';


class PlantPicker {
  constructor( plant_data ) {

    // Properties and some initial function calls
    // -----------------------------------------------------------------------------------------
    
    this.list  = document.getElementById('plantlist');                      //previously plantlist
    this.list_counters = document.getElementsByClassName('plant-counter');  //previously counters

    // create the list of plants (items below depend on it)
    list.listPlants( plant_data, this.list );

    // this.selectedRef = [];
    this.selected = document.getElementById('plants-selected');             //previously plants-selected
    this.selected_title = document.getElementById('selected-title');        //previously selectedPaneTitle
    this.selected_list = document.getElementById('plantpicks');             //previously plantpicks

    this.query = document.getElementById('plantfilter');                    //previously filterPane
    this.query_form = document.getElementById('plantQuery');                //previously filterForm
    this.query_close = document.getElementById('filter_close');             //previously closeButton
    this.query_open = document.getElementById('filter_open');               //previously openButton
    this.query_ht_slider_from = document.getElementById('fromSliderH');     //previously fromSliderH
    this.query_ht_slider_to = document.getElementById('toSliderH');         //previously toSliderH
    this.query_ht_input_from = document.getElementById('fromInputH');       //previously fromInputH
    this.query_ht_input_to = document.getElementById('toInputH');           //previously toInputH
    this.query_sp_slider_from = document.getElementById('fromSliderS');     //previously fromSliderS
    this.query_sp_slider_to = document.getElementById('toSliderS');         //previously toSliderS
    this.query_sp_input_from = document.getElementById('fromInputS');       //previously fromInputS
    this.query_sp_input_to = document.getElementById('toInputS');           //previously toInputS

    // some initial settings for the dual range sliders
    range.fillSlider( fromSliderH, toSliderH, '#1a1a1a', '#1a1a1a', toSliderH );
    range.fillSlider( fromSliderS, toSliderS, '#1a1a1a', '#1a1a1a', toSliderS );
    range.setToggleAccessible( toSliderH );
    range.setToggleAccessible( toSliderS );

    this.details = document.getElementById('details_pane');                 //previously detailsPane
    this.details_content = document.getElementById('details_content'); 
    this.details_open = document.getElementsByClassName('details_open');    //previously detailsOpenButtons
    this.details_close = document.getElementById('details_close');          //previously detailsCloseButton
    // details_open needs to be reset whenever listPlants() is called
    
    
    





    // Methods
    // -----------------------------------------------------------------------------------------
    
    // helper/general functions, what else?

    // open/close for either query or details
    this.openPane = function(e, type) {
      let pane;
      if( type=='query' ){
        pane = this.query;
      } else if( type=='detail' ){
        pane = this.details;
      }
      pane.classList.remove('display-none');
      pane.classList.add('display-block');
      e.stopPropagation();
    }

   this.closePane = function(type) {
      let pane;
      if( type=='query' ){
        pane = this.query;
      } else if( type=='detail' ){
        pane = this.details;
      }
      pane.classList.remove('display-block');
      pane.classList.add('display-none');
    }








    // Listeners
    // -----------------------------------------------------------------------------------------

    // update the counters on the slider when input
    Array.from(this.list_counters).forEach( c => {
      c.addEventListener('input', (e)=>{
        selected.plantCountUpdate(e.target.dataset.slug);
      });
    });

    // Listen to toggle selectPane visibility
    this.selected_title.addEventListener('click', () => {
      selected.paneToggle( this.selected );
    });

    // click anywhere else to close selected
    document.addEventListener('click', (e) => {
      if (this.selected && !this.selected.contains(e.target) && this.selected.classList.contains('open')) {
        selected.paneToggle( this.selected );
      }
    });

    // Dual range slider listeners
    this.query_ht_slider_from.oninput = () => range.controlFromSlider(this.query_ht_slider_from, this.query_ht_slider_to, this.query_ht_input_from);
    this.query_ht_slider_to.oninput = () => range.controlToSlider(this.query_ht_slider_from, this.query_ht_slider_to, this.query_ht_input_to);
    this.query_ht_input_from.oninput = () => range.controlFromInput(this.query_ht_slider_from, this.query_ht_input_from, this.query_ht_input_to, this.query_ht_slider_to);
    this.query_ht_input_to.oninput = () => range.controlToInput(this.query_ht_slider_to, this.query_ht_input_from, this.query_ht_input_to, this.query_ht_slider_to);
    this.query_sp_slider_from.oninput = () => range.controlFromSlider(this.query_sp_slider_from, this.query_sp_slider_to, this.query_sp_input_from);
    this.query_sp_slider_to.oninput = () => range.controlToSlider(this.query_sp_slider_from, this.query_sp_slider_to, this.query_sp_input_to);
    this.query_sp_input_from.oninput = () => range.controlFromInput(this.query_sp_slider_from, this.query_sp_input_from, this.query_sp_input_to, this.query_sp_slider_to);
    this.query_sp_input_to.oninput = () => range.controlToInput(this.query_sp_slider_to, this.query_sp_input_from, this.query_sp_input_to, this.query_sp_slider_to);

    // compile/process query when submitted
    this.query_form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.list.classList.remove('pl-visible');
      this.list.classList.add('pl-hidden');
      query.compile( e.target );
      list.listPlants( Plants_Staging, this.list );
      document.body.style.overflow = 'hidden';
      this.list.scrollIntoView();
      document.body.style.overflow = 'auto';
      setTimeout(() => {
        this.list.classList.remove('pl-hidden');
        this.list.classList.add('pl-visible');
        this.details_open = document.getElementsByClassName('details_open');
        this.detail_open_listener();
      }, 1000);
    });


    // close query pane when button clicked
    this.query_close.addEventListener('click', (e) => {
      this.closePane('query');
    });

    // close query pane when anywhere else clicked
    document.addEventListener('click', (e) => {
      if (this.query && !this.query.contains(e.target) && this.query.classList.contains('display-block')) {
        this.closePane('query');
      }
    });

    // open query pane when button clicked
    this.query_open.addEventListener('click', (e) => {
      this.openPane(e, 'query');
    });

    // close details pane when button clicked
    this.details_close.addEventListener('click', (e) => {
      this.closePane('detail');
    });

    // close details pane when anywhere else clicked
    document.addEventListener('click', (e) => {
      if (this.details && !this.details.contains(e.target) && this.details.classList.contains('display-block')) {
        this.closePane('detail');
      }
    });

    // open details pane when link clicked
    // defined as a function so it can be recalled 
    // when the list is updated
    this.detail_open_listener = function(){
      Array.from(this.details_open).forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          detail.populate('SLUG', this.details_content);
          this.openPane(e, 'detail');
        });
      });
    }
    this.detail_open_listener();




  } // end constructor()
} // end PlantPicker{}


export{ PlantPicker };









