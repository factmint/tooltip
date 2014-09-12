define( ['snap', 'config', 'scale-utils', 'axis', 'grid-lines', 'bubble-point'], 
function( Snap, Config, ScaleUtils, axis, gridLines, bubblePoint ){

  return Snap.plugin(function( Snap, Element, Paper ){

    Paper.prototype.bubbleChart = function( startX, startY, width, height, data ){

      var paper = this,
          xRange = getXRange(),
          yRange = getYRange(),
          xAxis, yAxis,
          gridLines,
          yOffsetX = 0,
          bubbleChart = paper.g();

      // Render the y axis
      yAxis = drawAxis( yRange, startX, startY, height, "vertical", "asd" );
      // Workout y overflow
      yOffsetX = startX - yAxis.getBBox().x;
      yAxis.transform( "t " + yOffsetX + " 0" );

      // Render the x axis
      xAxis = drawAxis( xRange, startX + yOffsetX, yAxis.startPoints[0].y, width - yOffsetX, "horizontal", "sssss" );

      // Draw the gridlines
      gridLines = paper.gridLines( startX, startY, yAxis.startPoints, xAxis.getBBox().width, 'horizontal');
      gridLines.transform( "t " + yOffsetX + " 0" );

      // Append to group
      bubbleChart.append( yAxis );
      bubbleChart.append( xAxis );
      bubbleChart.append( gridLines );

      return bubbleChart;


      /**
       * Draws an axis
       * @param  {Object} range       Contains min and max
       * @param  {Number} x           
       * @param  {Number} y           
       * @param  {Number} length      Width/Height
       * @param  {String} orientation Vertical/Horizontal
       * @param  {String} label       
       * @return {Snap.Group}             
       */
      function drawAxis( range, x, y, length, orientation, label ){

        var axisCls = "",
            tickMarks = ScaleUtils.getTickMarks( range.min, range.max, Config.TARGET_MARKER_COUNT ),
            scale, tickSize,
            tickMin = tickMarks[0],
            tickMax = tickMarks[ tickMarks.length - 1 ];

        switch( orientation ){

          case "horizontal":
            var tickRange = tickMax - tickMin;
            axisCls = "fm-x-axis";
            tickSize = Config.SMALL_MARKER_SIZE;
            scale = new ScaleUtils.Scale( x, length, tickMin - tickRange * Config.X_RANGE_PADDING, tickMax + tickRange * 0.1 );
            break;

          case "vertical":
            axisCls = "fm-y-axis";
            tickSize = length;
            // Swap the max and min so min sits at the bottom rather than top
            scale = new ScaleUtils.Scale( y, length, tickMax, tickMin );
            break;

        }

        // startX, startY, scale, tickMarkValues, tickMarkSize, orientation, label
        var axis = paper.axis(
          x,
          y,
          scale,
          tickMarks,
          tickSize,
          orientation,
          label
        ).addClass( axisCls );

        return axis;

      }

      function getXRange() {
        return {
          "min": -100,
          "max": 270
        }
      }

      function getYRange() {
        return {
          "min": -40,
          "max": 300
        }
      }


    };

  });

} );