// Build the seasonal interest timeline
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------

const siTimeline = function ( times ){
  times = times.split(", ");
  let timeline = "<div class = si-timeline>";
  let segments = {
    mar_e: 'Early Spring',
    mar_l: 'Early Spring',
    apr_e: 'Mid Spring',
    apr_l: 'Mid Spring',
    may_e: 'Late Spring',
    may_l: 'Late Spring',
    jun_e: 'Early Summer',
    jun_l: 'Early Summer',
    jul_e: 'Mid Summer',
    jul_l: 'Mid Summer',
    aug_e: 'Late Summer',
    aug_l: 'Late Summer',
    sept_e: 'Early Fall',
    sept_l: 'Early Fall',
    oct_e: 'Mid Fall',
    oct_l: 'Mid Fall',
    nov_e: 'Late Fall',
    nov_l: 'Late Fall',
    dec_e: 'Early Winter',
    dec_l: 'Early Winter',
    jan_e: 'Mid Winter',
    jan_l: 'Mid Winter',
    feb_e: 'Late Winter',
    feb_l: 'Late Winter'
  }
  Object.keys(segments).forEach(key => {
    const value = segments[key];
    if (times.includes(value)) {
      timeline += `<div class='timeline_seg ${key}'><div class='si_yes'>&nbsp;</div></div>`;
    } else {
      timeline += `<div class='timeline_seg ${key}'><div class='si_no'>&nbsp;</div></div>`;
    }
  });
  timeline += '</div>';
  return timeline;
}




// Overview/fact plant listing
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------

const listPlants = function( plants ) {
  let list = '';
  Object.keys(plants).forEach(key => {
    const plant = plants[key];
    let lineItem = `
    <li>
      <div class='plant-header'>
        <input id='${plant.slug}__count' class='plant-counter' type='number' placeholder='0' data-slug='${plant.slug}' min='0'>
        <h3 class='datum-name'>${plant.name.common}, <em>${plant.name.latin}</em></h3>
      </div>
      <span class='datum datum-img'>
        <iframe src='https://drive.google.com/file/d/${plant.imgID}/preview' style='grid-column: 1/-1; width: 100%; height: 300px'></iframe>
      </span>
      <span class='datum'>
        <p>${plant.description.summary}</p>
        <span class='datum-eco'><span class='datum-label'>Native</span>                ${plant.attributes.native}</span>
      </span>
      <span class='datum'>
        <span class='datum-condition'><span class='datum-label'>Exposure</span>        ${plant.reqs.light}</span>
        <span class='datum-condition'><span class='datum-label'>Watering</span>        ${plant.reqs.water}</span>
        <span class='datum-condition'><span class='datum-label'>Soil</span>            ${plant.reqs.soil}</span>
        <span class='datum-condition'><span class='datum-label'>Zone</span>            ${plant.reqs.zone}</span>
      </span>
      <span class='datum'>
        <span class='datum-visual'><span class='datum-label'>Category</span>           ${plant.appearance.category}</span>
        <span class='datum-visual'><span class='datum-label'>Growth Habit</span>       ${plant.appearance.habit}</span>
        <span class='datum-visual'><span class='datum-label'>Height (in)</span>        ${plant.appearance.height_min} – ${plant.appearance.height_max}</span>
        <span class='datum-visual'><span class='datum-label'>Spread (in)</span>        ${plant.appearance.spread_min} – ${plant.appearance.spread_max}</span>
      </span>
      <span class='datum'>
        <span class='datum-feature'><span class='datum-label'>Xerophytic</span>        ${plant.attributes.xerophytic}</span>
        <span class='datum-feature'><span class='datum-label'>Low Maintenance</span>   ${plant.attributes.easy}</span>
        <span class='datum-feature'><span class='datum-label'>Attributes</span>        ${plant.attributes.general}</span>
      </span>
      <span class='datum-color'><span class='datum-label'>Color</span>                 ${plant.appearance.color}</span>
      <span class='datum-season'><span class='datum-label'>Seasonal Interest</span>    ${siTimeline(plant.si)}</span>
      <a href='#' class='details_open' data-slug='${plant.slug}'>More Details</a>
      </li>`;
      list += lineItem;
      plantlist.innerHTML = list;
      counters = document.getElementsByClassName('plant-counter');
      Array.from(counters).forEach( c => {
        c.addEventListener('input', (e)=>{
          plantCountUpdate(e.target.dataset.slug);
        });
      });
      detailsOpenButtons = document.getElementsByClassName('details_open');
      Array.from(detailsOpenButtons).forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          detailsPopulate();
        });
      });
  });
}




// Plant Details
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------