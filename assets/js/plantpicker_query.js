// Compile filters for plant query
const compile = function ( form ){
  // Create a FormData object from the form
  let data = new FormData(form);
  //convert FormData to a plain object
  data = Object.fromEntries(data.entries());
  let query = new PlantQuery(data);
  compare(query);
  return true;
}


// Compare query against plant objects
const compare = function ( query ){
  // Copy all of plants into Plants_Staging
  // will chisel away at this as we move through the query
  Plants_Staging = Plants;

  // iterate throuugh the query object at the top level and compare to the plant object
  // if no matches remove plant from Plants_Staging
  Object.keys(query).forEach(qkey => {
    Object.keys(Plants_Staging).forEach(pkey => {
      // split value into an array (may need to make exceptions)
      //  only helpful with the lists, possibly only do with certain pkeys?  
      console.log(qkey);
      let match = false;
      if( qkey=='xerophytic' || qkey=='easy' ){
        if( Plants_Staging[pkey][qkey]=='TRUE'){
          match = true;
        } else {
          console.log('xerophytic/easy');
          delete Plants_Staging[pkey];
        }
      }
      else if ( qkey=='name' ){
        if( query.name.common.length > 0 ){
          let toMatch = Object.values(Plants_Staging[pkey][qkey]);
          let qName = query.name.common; //chose common, but both latin/common are the txt input at this point
          let fuseOpt = { threshold: 0.2 };
          let fuse = new Fuse(toMatch, fuseOpt);
          let result = fuse.search(qName);
          if (result.length > 0) {
            match = true;
          } else {
            console.log('name');
            delete Plants_Staging[pkey];
          }
        }
      }
      else if ( qkey=='height' ){
        if ( Number(query.height.min) <= Number(Plants_Staging[pkey].height.max) && Number(Plants_Staging[pkey].height.min) <= Number(query.height.max) ){
          match = true;
        } else {
          console.log('height');
          delete Plants_Staging[pkey];
        }
      }
      else if ( qkey=='spread' ){
        if ( Number(query.spread.min) <= Number(Plants_Staging[pkey].spread.max) && Number(Plants_Staging[pkey].spread.min) <= Number(query.spread.max) ){
          match = true;
        } else {
          console.log('spread');
          delete Plants_Staging[pkey];
        }
      }
      // THIS NEEDS TO BE FIXED
      // ************************************************************************
      // ************************************************************************
      // ************************************************************************
      // ************************************************************************
      else if ( qkey=='si' && query[qkey].length > 0 ){
        // if there's a match && match = true
        // else: delete Plants_Staging[pkey];
        // NEED TO GET THE MONTHS FROM TOCOMPARE BEFORE COMPARING
        let toCompare = Plants_Staging[pkey].si;
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
          delete Plants_Staging[pkey];
        }
      }
      else if ( qkey=='reqs' || qkey=='appearance' ){     
        Object.keys(query[qkey]).forEach(qqkey => {
          if( Plants_Staging[pkey] ){
            if( query[qkey][qqkey].length > 0 ){
              let toCompare = Plants_Staging[pkey][qkey][qqkey];
              toCompare = toCompare.split(', ');
              if(Array.isArray( query[qkey][qqkey]) ){
                if( query[qkey][qqkey].some( value => toCompare.includes(value) ) ){
                  match = true;
                } else {
                  console.log('reqs/appearance');
                  delete Plants_Staging[pkey];
                }
              }   
            } 
          } 
        });  
      } 
    }); // Plants_Staging
  }); // query
  // updatePlantlist(Plants_Staging);
}







// export queryCompile (everything else is chained and doesn't need to be public)
export{ compile };





