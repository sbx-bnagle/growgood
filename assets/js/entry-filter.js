/**
  * Filter Post Entries by Category
  *
  * @description
  *
  * @param  config         
  * An object of configuration settings:
  *
  *
  * @return new instance of AppendText
  */





// Get the relevant elements
// ----------------------------------------------------------------------------

const cat_select      = document.getElementById('js_cat_select');
const cat_select_bttn = document.getElementById('js_cat_select_bttn');
const cat_select_menu = document.getElementById('js_cat_select_menu');
const cat_select_item = document.getElementsByClassName('js_cat_menuitem');
const entry_list      = document.getElementById('js_entry-list');
const cntrl_bar       = document.getElementById('js_controlbar');
const header          = document.getElementById('js_header');
const entries         = document.getElementsByClassName('js_entry');




// Functions
// ----------------------------------------------------------------------------

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

// update entries and related styles/animations
const entryUpdate = function(cat) {
  document.body.style.overflow = 'hidden';
  entry_list .scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
  document.body.style.overflow = 'auto';
  for (let i = 0; i < cat_select_item.length; i++) {
    if ( cat == cat_select_item[i].dataset.cat) {
      cat_select_item[i].classList.add('selected');
    } else if ( cat_select_item[i].classList.contains('selected') ) {
      cat_select_item[i].classList.remove('selected');
    }
  }
  if ( cat == 'all' ){
    entry_list.style.height = entry_list.offsetHeight + 'px';
    for (let i = 0; i < entries.length; i++) {
      entries[i].classList.remove('js_visible');
      entries[i].classList.add('js_hidden');
      entries[i].classList.remove('js_hidden');
      entries[i].classList.add('js_visible');
    }
    entry_list.style.height = 'auto';
    return;
  }
  for (let i = 0; i < entries.length; i++) {
    entry_list.style.height = entry_list.offsetHeight + 'px';
    entries[i].classList.remove('js_visible');
    entries[i].classList.add('js_hidden');
    setTimeout(() => {
      if ( cat == entries[i].dataset.cat ) {
        if ( entries[i].classList.contains('js_hidden'))  { entries[i].classList.remove('js_hidden'); }
        if (!entries[i].classList.contains('js_visible')) { entries[i].classList.add('js_visible'); }
      } 
      entry_list.style.height = 'auto';
    }, 350);
  }
}




// Attach event listeners
// ----------------------------------------------------------------------------

// open menu when button is clicked
cat_select_bttn.addEventListener('click', () => {
  menuOpen();
});

// close menu when anything outside the filter display is clicked
document.addEventListener('click', function(e) {    
  if (cat_select && !cat_select.contains(e.target)) {
    menuClose();
  }
});

// filter entries when category is clicked
Array.from(cat_select_item).forEach((item) => {
  item.addEventListener('click', () => {
    // console.log('item.dataset.cat: '+item.dataset.cat)
    entryUpdate(item.dataset.cat);
  });
});









