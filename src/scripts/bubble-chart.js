define( ['snap', 'config', 'scale-utils', 'axis', 'grid-lines', 'bubble-point'], 
function( Snap, Config, ScaleUtils, axis, gridLines, bubblePoint ){

  return Snap.plugin(function( Snap, Element, Paper ){

    Paper.prototype.bubbleChart = function( startX, startY, width, height, dataSet ){

      var paper = this,
          xKey = "has GINI",
          yKey = "has HDI",
          radiusKey = "has Population",
          xRange = dataSet.getRange( xKey ),
          yRange = dataSet.getRange( yKey ),
          radiusRange = dataSet.getRange( radiusKey ),
          xAxis, yAxis,
          xScale, yScale, radiusScale,
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

      // Draw the bubbles
      var xIndex = dataSet.keys[ xKey ],
          yIndex = dataSet.keys[ yKey ],
          radiusIndex = dataSet.keys[ radiusKey ],
          xValue = 0, yValue = 0, radiusValue = 0;

      radiusScale = new ScaleUtils.Scale( Config.BUBBLE_MIN_AREA, Config.BUBBLE_MAX_AREA, radiusRange.min, radiusRange.max );

      var pointGroup = paper.g();
      dataSet.rows.forEach(function( row ){

        xValue = row[ xIndex ];
        yValue = row[ yIndex ];
        radiusValue = row[ radiusIndex ];

        pointGroup.append( paper.bubblePoint( xScale.getPixel( xValue ), yScale.getPixel( yValue ), radiusScale.getPixel( radiusValue ) ) );

      });

      // Append to group
      bubbleChart.append( yAxis );
      bubbleChart.append( xAxis );
      bubbleChart.append( gridLines );
      bubbleChart.append( pointGroup );

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
            scale = xScale = new ScaleUtils.Scale( x, length, tickMin - tickRange * Config.X_RANGE_PADDING, tickMax + tickRange * 0.1 );
            break;

          case "vertical":
            axisCls = "fm-y-axis";
            tickSize = length;
            // Swap the max and min so min sits at the bottom rather than top
            scale = yScale = new ScaleUtils.Scale( y, length, tickMax, tickMin );
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

    };

  });

} );