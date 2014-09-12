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
      keys = Array.prototype.map.call( container.rows[0].cells, function( cell ){
        return cell.textContent;
      } );
      ds.keys = keys.slice(0);
      ll = keys.length;

      l = container.rows.length;
      // Minus the column header
      ds.series = new Array( l - 1 );
      while( ++i < l ){
        ds.series[ i - 1 ] = new Array( ll );
        ii = -1;
        while( ++ii < ll ){
          value = container.rows[i].cells[ii].textContent;
          if( !isNaN( value ) ){
            value = parseFloat( value, 10 );
          }
          ds.series[ i - 1 ][ ii ] = value;
        }
      }

      return ds;

      function DataSet(){
        this.keys = null;
        this.series = null;
      }
      DataSet.prototype = {
        "constructor": DataSet
      };

    }
  }
});