/**
  * Dropdown menu for the mobile nav
  *
  * @description
  *
  * @param  config         
  * An object of configuration settings:
  *
  *
  * @return new instance of AppendText
  */



// Get inputs to watch
// --------------------------------------------------------------------------------

const toggle = document.getElementById('js-dd__toggle');
const pane   = document.getElementById('js-dd__pane');



// Function
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

const paneOpen = function(){
  pane.classList.remove('js-dd__pane-hidden');
  pane.classList.add('js-dd__pane-visible');
  toggle.classList.remove('js-dd__toggle-closed');
  toggle.classList.add('js-dd__toggle-open');
}

const paneClose = function(){
  pane.classList.remove('js-dd__pane-visible');
  pane.classList.add('js-dd__pane-hidden');
  toggle.classList.remove('js-dd__toggle-open');
  toggle.classList.add('js-dd__toggle-closed');
}



// Event Handlers
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

toggle.addEventListener('click', ()=>{
  if(pane.classList.contains('js-dd__pane-visible')) {
    paneClose();
  } else {
    paneOpen();
  }
  return false;
});
  

