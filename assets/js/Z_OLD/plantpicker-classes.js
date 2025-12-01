// Plant Class
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

class Plant {
  constructor( row ) {
    // internal
    this.count = 0;
    this.slug = row[2];
    this.imgID = row[3];

    // singular attributes
    this.xerophytic = row[21];
    this.easy = row[22]; 

    // name
    this.name = {};
    this.name.common = row[0];
    this.name.latin = row[1];

    // reqs
    this.reqs = {};
    this.reqs.light = row[4];
    this.reqs.water = row[5];
    this.reqs.soil = row[6];
    this.reqs.zone = row[7];

    // appearance
    this.appearance = {};
    this.appearance.cat = row[8];
    this.appearance.habit = row[9];
    this.appearance.flower = row[10];
    this.appearance.leaf = row[11];
    this.appearance.color = row[16];

    // height
    this.height = {};
    this.height.min = row[12];
    this.height.max = row[13];

    // spread
    this.spread = {};
    this.spread.min  = row[14];
    this.spread.max  = row[15];

    // seasonal interest
    this.si = row[17];

    // attributes
    this.attributes = {};
    this.attributes.general = row[18];
    this.attributes.native = row[19];
    this.attributes.context = row[20];

    // biz
    this.biz = {};
    this.biz.vendor = row[23];
    // ADD EST COST?

    // Description
    this.description = {};
    this.description.summary = row[24];
    this.description.lifespan = row[25];
    this.description.extended = row[26];

    // Maintenance
    this.maintenance = {};
    this.maintenance.general = row[27];
    this.maintenance.winter_late = row[28];
    this.maintenance.spring_early = row[29];
    this.maintenance.spring_mid = row[30];
    this.maintenance.spring_late = row[31];
    this.maintenance.summer_early = row[32];
    this.maintenance.summer_mid = row[33];
    this.maintenance.summer_late = row[34];
    this.maintenance.fall_early = row[35];
    this.maintenance.fall_mid = row[36];
    this.maintenance.fall_late = row[37];
    this.maintenance.winter_early = row[38];

  }
}


// Plant Query Class
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

class PlantQuery {
  constructor( data ) {

    // name
    this.name = {};
    this.name.common = data.name;
    this.name.latin = data.name;


    // reqs
    this.reqs = {};

    this.reqs.light = [];
    data.sun__full_sun    && this.reqs.light.push('full sun');
    data.sun__part_sun    && this.reqs.light.push('part sun');
    data.sun__light_shade && this.reqs.light.push('light shade');
    data.sun__shade       && this.reqs.light.push('shade');

    this.reqs.water = [];
    data.water__dry       && this.reqs.water.push('dry');
    data.water__medium    && this.reqs.water.push('medium');
    data.water__average   && this.reqs.water.push('average');
    data.water__wet       && this.reqs.water.push('wet');
    data.water__moist     && this.reqs.water.push('moist/well-drained');

    this.reqs.soil = [];
    data.soil__clay       && this.reqs.soil.push('clay');
    data.soil__sand       && this.reqs.soil.push('sand');
    data.soil__silt       && this.reqs.soil.push('silt');
    data.soil__loam       && this.reqs.soil.push('loam');
    data.soil__peat       && this.reqs.soil.push('peat');
    data.soil__chalk      && this.reqs.soil.push('chalk');
    data.soil__rocky      && this.reqs.soil.push('rocky');
    data.soil__poor       && this.reqs.soil.push('poor');
    data.soil__acidic     && this.reqs.soil.push('acidic');
    data.soil__high_organic  && this.reqs.soil.push('high organic');

    this.reqs.zone = [];
    data.zone__3a         && this.reqs.zone.push('3a');
    data.zone__3b         && this.reqs.zone.push('3b');
    data.zone__4a         && this.reqs.zone.push('4a');
    data.zone__4b         && this.reqs.zone.push('4b');
    data.zone__5a         && this.reqs.zone.push('5a');
    data.zone__5b         && this.reqs.zone.push('5b');
    data.zone__6a         && this.reqs.zone.push('6a');
    data.zone__6b         && this.reqs.zone.push('6b');
    data.zone__7a         && this.reqs.zone.push('7a');
    data.zone__7b         && this.reqs.zone.push('7b');
    data.zone__8a         && this.reqs.zone.push('8a');
    data.zone__8b         && this.reqs.zone.push('8b');


    // appearance
    this.appearance = {};

    this.appearance.cat = [];
    data.cat__bulb        && this.appearance.cat.push('bulb');
    data.cat__grass       && this.appearance.cat.push('grass');
    data.cat__shrub       && this.appearance.cat.push('shrub');
    data.cat__cover       && this.appearance.cat.push('cover');
    data.cat__sedge       && this.appearance.cat.push('sedge');
    data.cat__vine        && this.appearance.cat.push('vine');
    data.cat__flower      && this.appearance.cat.push('flower');

    this.appearance.habit = [];
    data.habit__verticle  && this.appearance.habit.push('verticle');
    data.habit__vase      && this.appearance.habit.push('vase');
    data.habit__mound     && this.appearance.habit.push('mound');
    data.habit__irregular && this.appearance.habit.push('irregular');
    data.habit__clump     && this.appearance.habit.push('clump');

    this.appearance.flower = [];
    data.flower__plume    && this.appearance.flower.push('plume');
    data.flower__buttons  && this.appearance.flower.push('buttons');
    data.flower__see_through && this.appearance.flower.push('see-through');
    data.flower__spire_spike && this.appearance.flower.push('spire/spike');

    this.appearance.leaf = [];
    data.leaf__fine       && this.appearance.leaf.push('fine');
    data.leaf__bold       && this.appearance.leaf.push('bold');
    data.leaf__linear     && this.appearance.leaf.push('linear');
    data.leaf__dark       && this.appearance.leaf.push('dark');
    data.leaf__dark_green && this.appearance.leaf.push('dark green');
    data.leaf__blue_green && this.appearance.leaf.push('blue green');
    data.leaf__evergreen  && this.appearance.leaf.push('evergreen');
    data.leaf__fall_color && this.appearance.leaf.push('fall color');
    data.leaf__light_green   && this.appearance.leaf.push('light green');

    this.appearance.color = [];
    data.color__yellow    && this.appearance.color.push('yellow');
    data.color__orange    && this.appearance.color.push('orange');
    data.color__red       && this.appearance.color.push('red');
    data.color__blue      && this.appearance.color.push('blue');
    data.color__white     && this.appearance.color.push('white');
    data.color__purple    && this.appearance.color.push('purple');
    data.color__pink      && this.appearance.color.push('pink');

    this.height = {};
    data.height__min      && (this.height.min = data.height__min);
    data.height__max      && (this.height.max = data.height__max);

    this.spread = {};
    data.spread__min      && (this.spread.min = data.spread__min);
    data.spread__max      && (this.spread.max = data.spread__max);


    // 'seasonal interest'
    this.si = []; 
    data.si__mar_e        && this.si.push('mar_e');
    data.si__mar_l        && this.si.push('mar_l');
    data.si__apr_e        && this.si.push('apr_e');
    data.si__apr_l        && this.si.push('apr_l');
    data.si__may_e        && this.si.push('may_e');
    data.si__may_l        && this.si.push('may_l');
    data.si__jun_e        && this.si.push('jun_e');
    data.si__jun_l        && this.si.push('jun_l');
    data.si__jul_e        && this.si.push('jul_e');
    data.si__jul_l        && this.si.push('jul_l');
    data.si__aug_e        && this.si.push('aug_e');
    data.si__aug_l        && this.si.push('aug_l');
    data.si__sept_e       && this.si.push('sept_e');
    data.si__sept_l       && this.si.push('sept_l');
    data.si__oct_e        && this.si.push('oct_e');
    data.si__oct_l        && this.si.push('oct_l');
    data.si__nov_e        && this.si.push('nov_e');
    data.si__nov_l        && this.si.push('nov_l');
    data.si__dec_e        && this.si.push('dec_e');
    data.si__dec_l        && this.si.push('dec_l');
    data.si__jan_e        && this.si.push('jan_e');
    data.si__jan_l        && this.si.push('jan_l');
    data.si__feb_e        && this.si.push('feb_e');
    data.si__feb_l        && this.si.push('feb_l');


    // attributes
    this.attributes = {};

    this.attributes.general = [];
    data.general__seedheads    && this.attributes.general.push('attractive seedheads');
    data.general__fragrant     && this.attributes.general.push('fragrant');
    data.general__bloomtime    && this.attributes.general.push('long bloomtime');
    data.general__groundcover  && this.attributes.general.push('groundcover');
    data.general__border       && this.attributes.general.push('border');
    data.general__textural     && this.attributes.general.push('textural');
    data.general__specimen     && this.attributes.general.push('specimen');
    data.general__cutdry       && this.attributes.general.push('cut and dry');
    data.general__workhorse    && this.attributes.general.push('workhorse');
    data.general__deer         && this.attributes.general.push('deer resistant');
    data.general__pollinator   && this.attributes.general.push('pollinator friendly');
    data.general__edible       && this.attributes.general.push('edible');

    this.attributes.native = [];
    data.native__central_usa_plains              && this.attributes.native.push('Central USA Plains');
    data.native__eastern_mississippi_alluvial    && this.attributes.native.push('Eastern Mississippi Alluvial');
    data.native__eastern_mixed_wood_plains       && this.attributes.native.push('Eastern Mixed Wood Plains');
    data.native__great_plains_temperate_prairie  && this.attributes.native.push('Great Plains Temperate Prairie');
    data.native__northern_atlantic_highlands     && this.attributes.native.push('Northern Atlantic Highlands');
    data.native__southeastern_usa_plains         && this.attributes.native.push('Southeastern USA Plains');
    data.native__northern_mixed_wood_shield      && this.attributes.native.push('Northern Mixed Wood Shield');

    this.attributes.context = [];
    data.context__parkway      && this.attributes.context.push('parkway');
    data.context__raingarden   && this.attributes.context.push('raingarden');
    data.context__container    && this.attributes.context.push('container');
    data.context__woodland     && this.attributes.context.push('woodland');
    data.context__prairie      && this.attributes.context.push('prairie');

    data.xerophytic            && (this.xerophytic = 'TRUE');
    data.easy                  && (this.easy = 'TRUE');

    // biz
    // can add later if more are included
  }
}