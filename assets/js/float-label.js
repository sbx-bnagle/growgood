/**
  * Set classes for floating labels
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

const inputs = document.getElementsByClassName('js_float-label');





// Function
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

const floatControl = function( input ){
  if( document.activeElement == input ){
    input.nextElementSibling.classList.remove('js_unfloat');
    input.nextElementSibling.classList.add('js_float');
  } else if ( !input.value ) { 
    console.log('HERE');
    input.nextElementSibling.classList.remove('js_float');
    input.nextElementSibling.classList.add('js_unfloat');
  }
}



// Event Handlers
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

Array.from(inputs).forEach((input) => {
  input.addEventListener('input', (e) => {
    floatControl(e.target);
  });
});

Array.from(inputs).forEach((input) => {
  input.addEventListener('focus', (e) => {
    floatControl(e.target);
  });
});

Array.from(inputs).forEach((input) => {
  input.addEventListener('focusout', (e) => {
    floatControl(e.target);
  });
});

