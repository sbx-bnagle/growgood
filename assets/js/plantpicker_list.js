const listPlants = function( plants, container ) {
  let list_staging = '';
  Object.keys(plants).forEach(key => {
    let plant = plants[key];
    // format a couple of values for display
    if (plant.xerophytic == 'FALSE'){
      plant.xerophytic = "<span class='datum-icon'>&#10008;</span>";
    } else if (plant.xerophytic == 'TRUE'){
      plant.xerophytic = "<span class='datum-icon'>&#9787;</span>";
    }
    if (plant.easy == 'FALSE'){
      plant.easy = "<span class='datum-icon'>&#10008;</span>";
    } else if (plant.easy == 'TRUE'){
      plant.easy = "<span class='datum-icon'>&#9787;</span>";
    }
    if (plant.appearance.color_bloom !== undefined){
      plant.appearance.color_bloom = plant.appearance.color_bloom.split(', ');
      let color_strings_collected = '';
      plant.appearance.color_bloom.forEach(function(color){
        if(color != ''){
          let color_string = `<span class='color-pill color-pill-${color}'>${color}</span>`;
          color_strings_collected = color_strings_collected + color_string;
        }
      });
      plant.appearance.color_bloom = color_strings_collected;
    }
    if (plant.appearance.color_fall !== undefined){
      plant.appearance.color_fall = plant.appearance.color_fall.split(', ');
      let color_strings_collected = '';
      plant.appearance.color_fall.forEach(function(color){
        if(color != ''){
          let color_string = `<span class='color-pill color-pill-${color}'>${color}</span>`;
          color_strings_collected = color_strings_collected + color_string;
        }
      });
      plant.appearance.color_fall = color_strings_collected;
    }
    let lineItem = `
    <li>
      <div class='plant-header'>
        <input id='${plant.slug}__count' class='plant-counter' type='number' placeholder='0' data-slug='${plant.slug}' min='0'>
        <h3 class='datum-name'>${plant.name.common}, <em>${plant.name.latin}</em></h3>
      </div>
      <span class='datum datum-img'>
        <iframe src='https://drive.google.com/file/d/${plant.imgID}/preview' style='grid-column: 1/-1; width: 100%; height: 300px'></iframe>
      </span>
      <span class='datum datum-top'>
        <span class='datum-summary'>                                                         ${plant.description.summary}</span>
      </span>
      <span class='datum'>
        <span class='datum-eco'><span class='datum-label'>Native</span>                      ${plant.attributes.native ? plant.attributes.native : '—'}</span>
        <span class='datum-zone'><span class='datum-label'>Zone</span>                       ${plant.reqs.zone ? plant.reqs.zone : '—'}</span>
      </span>
      <span class='datum'>
        <span class='datum-condition'><span class='datum-label'>Exposure</span>              ${plant.reqs.light ? plant.reqs.light : '—'}</span>
        <span class='datum-condition'><span class='datum-label'>Watering</span>              ${plant.reqs.water ? plant.reqs.water : '—'}</span>
        <span class='datum-condition'><span class='datum-label'>Soil</span>                  ${plant.reqs.soil ? plant.reqs.soil : '—'}</span>
      </span>
      <span class='datum'>
        <span class='datum-visual'><span class='datum-label'>Category</span>                 ${plant.appearance.cat ? plant.appearance.cat : '—'}</span>
        <span class='datum-visual'><span class='datum-label'>Growth Habit</span>             ${plant.appearance.habit ? plant.appearance.habit : '—'}</span>
        <span class='datum-visual'><span class='datum-label'>Height (ft)</span>              ${plant.height.min}–${plant.height.max}</span>
        <span class='datum-visual'><span class='datum-label'>Spread (ft)</span>              ${plant.spread.min}–${plant.spread.max}</span>
      </span>
      <span class='datum'>
        <span class='datum-feature'><span class='datum-label'>Xerophytic</span>              ${plant.xerophytic}</span> 
        <span class='datum-feature'><span class='datum-label'>Low Maintenance</span>         ${plant.easy}</span>
        <span class='datum-feature'><span class='datum-label'>Attributes</span>              ${plant.attributes.general ? plant.attributes.general : '—'}</span>   
      </span>
      <span class='datum'>
        <span class='datum-color'><span class='datum-label'>Bloom Color</span>               ${plant.appearance.color_bloom ? plant.appearance.color_bloom : '—'}</span>
        <span class='datum-color'><span class='datum-label'>Fall Color</span>                ${plant.appearance.color_fall ? plant.appearance.color_fall : '—'}</span>
      </span>

      <span class='datum'>
        <span class='datum-season'>
          <span class='datum-label'>Seasonal Interest: Bloom, Fall, Seedhead</span>            ${siTimeline(plant.si.bloom)}</span>
        <span class='datum-season'>                                                            ${siTimeline(plant.si.fall)}</span>
        <span class='datum-season'>                                                            ${siTimeline(plant.si.seedhead)}</span>
      </span>
      <a href='#' class='details_open' data-slug='${plant.slug}'>More Details</a>
    </li>`;
    list_staging += lineItem;
    container.innerHTML = list_staging;    
  });
}


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


export{ listPlants };









