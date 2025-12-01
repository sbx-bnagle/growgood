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
    this.appearance.color_bloom = row[16];
    this.appearance.color_fall = row[18];
    // this.appearance.si_bloom = row[17];  
    // this.appearance.si_fall = row[19];
    // this.appearance.si_seedhead = row[19];

    // si
    this.si = {};
    this.si.bloom = row[17];
    this.si.fall = row[19];
    this.si.seedhead = row[20];

    // height
    this.height = {};
    this.height.min = row[12];
    this.height.max = row[13];

    // spread
    this.spread = {};
    this.spread.min  = row[14];
    this.spread.max  = row[15];

    // attributes
    this.attributes = {};
    this.attributes.general = row[21];
    this.attributes.native = row[22];
    this.attributes.context = row[23];

    // singular attributes
    this.xerophytic = row[24];
    this.easy = row[25]; 

    // biz
    this.biz = {};
    this.biz.vendor = row[26];
    // ADD EST COST?
    // OTHER USEFUL INFO?

    // Description
    this.description = {};
    this.description.summary = row[27];
    this.description.lifespan = row[28];
    this.description.extended = row[29];

    // Maintenance
    this.maintenance = {};
    this.maintenance.general = row[30];
    this.maintenance.winter_late = row[31];
    this.maintenance.spring_early = row[32];
    this.maintenance.spring_mid = row[33];
    this.maintenance.spring_late = row[34];
    this.maintenance.summer_early = row[35];
    this.maintenance.summer_mid = row[36];
    this.maintenance.summer_late = row[37];
    this.maintenance.fall_early = row[38];
    this.maintenance.fall_mid = row[39];
    this.maintenance.fall_late = row[40];
    this.maintenance.winter_early = row[41];

  }
}


// Plant Query Class
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

class PlantQuery {
  constructor( data ) {
    console.log(data);

    // name
    this.name = {};
    this.name.common = data.name;
    this.name.latin = data.name;


    // reqs
    this.reqs = {};

    this.reqs.light = [];
    data.sun__full_sun    && this.reqs.light.push('full sun');
    data.sun__part_sun    && this.reqs.light.push('part sun');
    data.sun__part_shade  && this.reqs.light.push('part shade');
    data.sun__shade       && this.reqs.light.push('shade');

    this.reqs.water = [];
    data.water__dry       && this.reqs.water.push('dry');
    data.water__average   && this.reqs.water.push('average');
    data.water__wet       && this.reqs.water.push('wet');
    data.water__moist     && this.reqs.water.push('moist/well-drained');

    this.reqs.soil = [];
    data.soil__poor       && this.reqs.soil.push('rocky/poor');
    data.soil__organic    && this.reqs.soil.push('high organic');
    data.soil__acidic     && this.reqs.soil.push('acidic');
    data.soil__alkaline   && this.reqs.soil.push('alkaline');
    data.soil__clay       && this.reqs.soil.push('clay');
    data.soil__sand       && this.reqs.soil.push('sand');
    data.soil__loam       && this.reqs.soil.push('loam');

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
    data.cat__grass       && this.appearance.cat.push('grass');
    data.cat__bulb        && this.appearance.cat.push('bulb');
    data.cat__flower      && this.appearance.cat.push('flower');
    data.cat__shrub       && this.appearance.cat.push('shrub');
    data.cat__cover       && this.appearance.cat.push('cover');
    data.cat__sedge       && this.appearance.cat.push('sedge');
    data.cat__vine        && this.appearance.cat.push('vine');
    data.cat__fern        && this.appearance.cat.push('fern');
    
    this.appearance.habit = [];
    data.habit__verticle  && this.appearance.habit.push('verticle');
    data.habit__vase      && this.appearance.habit.push('vase');
    data.habit__mound     && this.appearance.habit.push('mound');
    data.habit__irregular && this.appearance.habit.push('irregular');
    data.habit__clump     && this.appearance.habit.push('clump');
    data.habit__arc       && this.appearance.habit.push('arc');

    this.appearance.flower = [];
    data.flower__spire_spike && this.appearance.flower.push('spire/spike');
    data.flower__plume    && this.appearance.flower.push('plume');
    data.flower__see_through && this.appearance.flower.push('see-through');
    data.flower__buttons  && this.appearance.flower.push('buttons');
    data.flower__spray    && this.appearance.flower.push('spray');
    data.flower__vertical && this.appearance.flower.push('vertical');
    
    this.appearance.leaf = [];
    data.leaf__dark_green && this.appearance.leaf.push('dark green');
    data.leaf__fine       && this.appearance.leaf.push('fine');
    data.leaf__bold       && this.appearance.leaf.push('bold');
    data.leaf__blue_green && this.appearance.leaf.push('blue green');
    data.leaf__light_green&& this.appearance.leaf.push('light green');
    data.leaf__evergreen  && this.appearance.leaf.push('evergreen');
    data.leaf__linear     && this.appearance.leaf.push('linear');
    data.leaf__dark       && this.appearance.leaf.push('dark');
    data.leaf__fall_color && this.appearance.leaf.push('fall color');
    data.leaf__gray_green && this.appearance.leaf.push('gray green');  

    this.appearance.bloom_color = [];
    data.bloom_color__yellow    && this.appearance.bloom_color.push('yellow');
    data.bloom_color__orange    && this.appearance.bloom_color.push('orange');
    data.bloom_color__red       && this.appearance.bloom_color.push('red');
    data.bloom_color__blue      && this.appearance.bloom_color.push('blue');
    data.bloom_color__white     && this.appearance.bloom_color.push('white');
    data.bloom_color__purple    && this.appearance.bloom_color.push('purple');
    data.bloom_color__pink      && this.appearance.bloom_color.push('pink');

    this.appearance.fall_color = [];
    data.fall_color__yellow     && this.appearance.fall_color.push('yellow');
    data.fall_color__orange     && this.appearance.fall_color.push('orange');
    data.fall_color__red        && this.appearance.fall_color.push('red');
    data.fall_color__blue       && this.appearance.fall_color.push('blue');
    data.fall_color__white      && this.appearance.fall_color.push('white');
    data.fall_color__purple     && this.appearance.fall_color.push('purple');
    data.fall_color__pink       && this.appearance.fall_color.push('pink');

    this.height = {};
    data.height__min      && (this.height.min = data.height__min);
    data.height__max      && (this.height.max = data.height__max);

    this.spread = {};
    data.spread__min      && (this.spread.min = data.spread__min);
    data.spread__max      && (this.spread.max = data.spread__max);


    // 'seasonal interest'
    this.si = {};

    this.si.bloom = []; 
    data.si_bloom__mar_e             && this.si.bloom.push('mar_e');
    data.si_bloom__mar_l        && this.si.bloom.push('mar_l');
    data.si_bloom__apr_e        && this.si.bloom.push('apr_e');
    data.si_bloom__apr_l        && this.si.bloom.push('apr_l');
    data.si_bloom__may_e        && this.si.bloom.push('may_e');
    data.si_bloom__may_l        && this.si.bloom.push('may_l');
    data.si_bloom__jun_e        && this.si.bloom.push('jun_e');
    data.si_bloom__jun_l        && this.si.bloom.push('jun_l');
    data.si_bloom__jul_e        && this.si.bloom.push('jul_e');
    data.si_bloom__jul_l        && this.si.bloom.push('jul_l');
    data.si_bloom__aug_e        && this.si.bloom.push('aug_e');
    data.si_bloom__aug_l        && this.si.bloom.push('aug_l');
    data.si_bloom__sept_e       && this.si.bloom.push('sept_e');
    data.si_bloom__sept_l       && this.si.bloom.push('sept_l');
    data.si_bloom__oct_e        && this.si.bloom.push('oct_e');
    data.si_bloom__oct_l        && this.si.bloom.push('oct_l');
    data.si_bloom__nov_e        && this.si.bloom.push('nov_e');
    data.si_bloom__nov_l        && this.si.bloom.push('nov_l');
    data.si_bloom__dec_e        && this.si.bloom.push('dec_e');
    data.si_bloom__dec_l        && this.si.bloom.push('dec_l');
    data.si_bloom__jan_e        && this.si.bloom.push('jan_e');
    data.si_bloom__jan_l        && this.si.bloom.push('jan_l');
    data.si_bloom__feb_e        && this.si.bloom.push('feb_e');
    data.si_bloom__feb_l        && this.si.bloom.push('feb_l');

    this.si.fall = []; 
    data.si_fall__mar_e        && this.si.fall.push('mar_e');
    data.si_fall__mar_l        && this.si.fall.push('mar_l');
    data.si_fall__apr_e        && this.si.fall.push('apr_e');
    data.si_fall__apr_l        && this.si.fall.push('apr_l');
    data.si_fall__may_e        && this.si.fall.push('may_e');
    data.si_fall__may_l        && this.si.fall.push('may_l');
    data.si_fall__jun_e        && this.si.fall.push('jun_e');
    data.si_fall__jun_l        && this.si.fall.push('jun_l');
    data.si_fall__jul_e        && this.si.fall.push('jul_e');
    data.si_fall__jul_l        && this.si.fall.push('jul_l');
    data.si_fall__aug_e        && this.si.fall.push('aug_e');
    data.si_fall__aug_l        && this.si.fall.push('aug_l');
    data.si_fall__sept_e       && this.si.fall.push('sept_e');
    data.si_fall__sept_l       && this.si.fall.push('sept_l');
    data.si_fall__oct_e        && this.si.fall.push('oct_e');
    data.si_fall__oct_l        && this.si.fall.push('oct_l');
    data.si_fall__nov_e        && this.si.fall.push('nov_e');
    data.si_fall__nov_l        && this.si.fall.push('nov_l');
    data.si_fall__dec_e        && this.si.fall.push('dec_e');
    data.si_fall__dec_l        && this.si.fall.push('dec_l');
    data.si_fall__jan_e        && this.si.fall.push('jan_e');
    data.si_fall__jan_l        && this.si.fall.push('jan_l');
    data.si_fall__feb_e        && this.si.fall.push('feb_e');
    data.si_fall__feb_l        && this.si.fall.push('feb_l');

    this.si.seedhead = []; 
    data.si_seedhead__mar_e    && this.si.seedhead.push('mar_e');
    data.si_seedhead__mar_l    && this.si.seedhead.push('mar_l');
    data.si_seedhead__apr_e    && this.si.seedhead.push('apr_e');
    data.si_seedhead__apr_l    && this.si.seedhead.push('apr_l');
    data.si_seedhead__may_e    && this.si.seedhead.push('may_e');
    data.si_seedhead__may_l    && this.si.seedhead.push('may_l');
    data.si_seedhead__jun_e    && this.si.seedhead.push('jun_e');
    data.si_seedhead__jun_l    && this.si.seedhead.push('jun_l');
    data.si_seedhead__jul_e    && this.si.seedhead.push('jul_e');
    data.si_seedhead__jul_l    && this.si.seedhead.push('jul_l');
    data.si_seedhead__aug_e    && this.si.seedhead.push('aug_e');
    data.si_seedhead__aug_l    && this.si.seedhead.push('aug_l');
    data.si_seedhead__sept_e   && this.si.seedhead.push('sept_e');
    data.si_seedhead__sept_l   && this.si.seedhead.push('sept_l');
    data.si_seedhead__oct_e    && this.si.seedhead.push('oct_e');
    data.si_seedhead__oct_l    && this.si.seedhead.push('oct_l');
    data.si_seedhead__nov_e    && this.si.seedhead.push('nov_e');
    data.si_seedhead__nov_l    && this.si.seedhead.push('nov_l');
    data.si_seedhead__dec_e    && this.si.seedhead.push('dec_e');
    data.si_seedhead__dec_l    && this.si.seedhead.push('dec_l');
    data.si_seedhead__jan_e    && this.si.seedhead.push('jan_e');
    data.si_seedhead__jan_l    && this.si.seedhead.push('jan_l');
    data.si_seedhead__feb_e    && this.si.seedhead.push('feb_e');
    data.si_seedhead__feb_l    && this.si.seedhead.push('feb_l');


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
    data.general__cutflower    && this.attributes.general.push('good cut flower');

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
    this.biz = {};

    this.biz.vendor = [];
    data.vendor__mwg           && this.biz.vendor.push('Midwest Groundcovers');
    data.vendor__ncn           && this.biz.vendor.push('Northcreek Nurseries, PA');


    // description
    this.description = {};

    data.description__summary  && (this.description.summary = data.description__summary);
    data.description__lifespan && (this.description.lifespan = data.description__lifespan);
    data.description__extended && (this.description.extended = data.description__extended);


    // maintenance
    this.maintenance = {};
    data.maintenance__general       && (this.maintenance.general = data.maintenance__general);
    data.maintenance__winter_late   && (this.maintenance.winter_late = data.maintenance__winter_late );
    data.maintenance__spring_early  && (this.maintenance.spring_early = data.maintenance__spring_early);
    data.maintenance__spring_mid    && (this.maintenance.spring_mid = data.maintenance__spring_mid);
    data.maintenance__spring_late   && (this.maintenance.spring_late = data.maintenance__spring_late);
    data.maintenance__summer_early  && (this.maintenance.summer_early = data.maintenance__summer_early);
    data.maintenance__summer_mid    && (this.maintenance.summer_mid = data.maintenance__summer_mid);
    data.maintenance__summer_late   && (this.maintenance.summer_late = data.maintenance__summer_late);
    data.maintenance__fall_early    && (this.maintenance.fall_early = data.maintenance__fall_early);
    data.maintenance__fall_mid      && (this.maintenance.fall_mid = data.maintenance__fall_mid);
    data.maintenance__fall_late     && (this.maintenance.fall_late = data.maintenance__fall_late);
    data.maintenance__winter_early  && (this.maintenance.winter_early = data.maintenance__winter_early);

  }
}

// export{ Plant, PlantQuery };