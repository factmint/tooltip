define(function() {
  return {
    sortDataByValue: function(a, b) {
      return b.value - a.value
    },
    tableToJSON: function( container ) {


      function DataSet(){

        this._cacheRange = null;

        this.keys = null;
        this.rows = null;

      }
      DataSet.prototype = {

        "constructor": DataSet,

        "getRange": function( key ){

          var index = -1;

          if( typeof key === "string" ){
            index = this.keys[ key ];
          } else {
            index = key;
          }

          // Check the cache
          if( !this._cacheRange[ index ] ){

            var min = Number.MAX_VALUE,
                max = Number.MIN_VALUE,
                value = 0;

            this.rows.forEach(function( row ){

              value = row[ index ];

              if( value < min ){ min = value; }
              if( value > max ){ max = value; }

            });

            this._cacheRange[ index ] = {
              "max": max,
              "min": min
            };

          }

          return this._cacheRange[ index ];

        }

      };



      var keys, i = 0, l, ii = -1, ll,
          ds = new DataSet(),
          value;

      // Get the table column headers
      ds.keys = {};
      Array.prototype.forEach.call( container.rows[0].cells, function( cell, index ){
        ds.keys[ cell.textContent ] = index;
      } );
      ll = container.rows[0].cells.length;

      l = container.rows.length;
      // Minus the column header
      ds.rows = new Array( l - 1 );
      ds._cacheRange = new Array( l - 1 );
      while( ++i < l ){
        ds.rows[ i - 1 ] = new Array( ll );
        ii = -1;
        while( ++ii < ll ){
          value = container.rows[i].cells[ii].textContent;
          if( !isNaN( value ) ){
            value = parseFloat( value );
          }
          ds.rows[ i - 1 ][ ii ] = value;
        }
      }

      return ds;

    }
  }
});