define(function() {
  return {
    sortDataByValue: function(a, b) {
      return b.value - a.value
    },
    tableToJSON: function( container ) {

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
      while( ++i < l ){
        ds.rows[ i - 1 ] = new Array( ll );
        ii = -1;
        while( ++ii < ll ){
          value = container.rows[i].cells[ii].textContent;
          if( !isNaN( value ) ){
            value = parseFloat( value, 10 );
          }
          ds.rows[ i - 1 ][ ii ] = value;
        }
      }

      return ds;

      function DataSet(){
        this.keys = null;
        this.rows = null;
      }
      DataSet.prototype = {
        "constructor": DataSet
      };

    }
  }
});