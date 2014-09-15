define( ['snap', 'config', 'scale-utils', 'color-utils', 'axis', 'grid-lines', 'bubble-point', 'grouped-tooltip'], 
function( Snap, Config, ScaleUtils, Color, axis, gridLines, bubblePoint, GroupedTooltip ){

  return Snap.plugin(function( Snap, Element, Paper ){

    Paper.prototype.bubbleChart = function( startX, startY, width, height, dataSet ){

      var paper = this,
          // Keys
          xKey = "has GINI",
          yKey = "has HDI",
          radiusKey = "has Population",
          // Ranges
          xRange = dataSet.getRange( xKey ),
          yRange = dataSet.getRange( yKey ),
          radiusRange = dataSet.getRange( radiusKey ),
          // Axes
          xAxis, yAxis,
          // Scales
          xScale, yScale, radiusScale,
          // Other bits
          gridLines,
          yOffsetX = 0,
          bubbleChart = paper.g(),
          bubbleColors = null;

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

       // Generate the colours
      bubbleColors = Color.harmonious( dataSet.rows.length );

      // Draw the bubbles
      var xIndex = dataSet.keys[ xKey ],
          yIndex = dataSet.keys[ yKey ],
          radiusIndex = dataSet.keys[ radiusKey ],
          xValue = 0, yValue = 0, radiusValue = 0;

      radiusScale = new ScaleUtils.Scale( Config.BUBBLE_MIN_AREA, Config.BUBBLE_MAX_AREA, radiusRange.min, radiusRange.max );

      var pointGroup = paper.g(),
          pointBubble;
      dataSet.rows.forEach(function( row, index ){

        xValue = row[ xIndex ];
        yValue = row[ yIndex ];
        radiusValue = row[ radiusIndex ];

        pointBubble = paper.bubblePoint( xScale.getPixel( xValue ), yScale.getPixel( yValue ), radiusScale.getPixel( radiusValue ) );
        pointBubble.addClass( bubbleColors[ index ] )
                .attr("stroke", pointBubble.attr("fill"))
                .data( "row", row )
                .data( "dataset", dataSet );

        setupBubbleEvents( pointBubble );

        pointGroup.append( pointBubble );

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

      /**
       * THIS NEEDS TIDYING
       */
      function onBubbleClick(){

        var tooltip = this.data("tooltip");

        if( this.hasClass("fm-scatter-bubble--active") ){

          this.removeClass("fm-scatter-bubble--active");
          tooltip.hide();

        } else {

          var data = this.data("row"),
              dataset = this.data("dataset");

            console.log(data,dataset);

          if( !tooltip ){
            tooltip = new GroupedTooltip( paper.node.parentNode );
            tooltip.render({
              "groups": [{
                "Size": 10
              }],
              "title": "example title"
            });
            this.data("tooltip", tooltip);
          }

          this.addClass("fm-scatter-bubble--active");
          var pos = this.node.getBoundingClientRect();
          tooltip.setPosition( pos.left, pos.top );
          tooltip.show();

        }

      }


      /**
       * Adds any events to the bubble point
       * @param  {Snap.Circle} bubblePoint
       * @param  {Array} data        
       */
      function setupBubbleEvents( bubblePoint ){
        
        bubblePoint.click( onBubbleClick );
        
      }


    };

  });

} );