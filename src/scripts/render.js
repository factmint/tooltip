define(['config', 'snap', 'tooltip'],
function(Config, Snap, Tooltip) {
  return function() {
    var containers = document.querySelectorAll('[data-factmint-visualization="test"]');
    for (var i = 0; i < containers.length; i++) {
      var containerComputedStyle = window.getComputedStyle(containers[i]);
      var width = parseInt(containerComputedStyle.getPropertyValue("width"));
      var height = parseInt(containerComputedStyle.getPropertyValue("height")) - 6; // 6 accounts for overflow scrollbars

      var options = (window[containers[i].id]) ? window[containers[i].id] : {};

      var spillOverMargin;
      if (! options.allowNegativeMargin ||
        options.allowNegativeMargin === 'off') {
        spillOverMargin = 0;
      } else {
        spillOverMargin = width * 0.2;
      }
      
      var svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svgNode.style.height = (height + spillOverMargin * 2) + 'px';
      svgNode.style.width = (width + spillOverMargin * 2) + 'px';
      svgNode.style.margin = (spillOverMargin * -1) + 'px';
      containers[i].appendChild(svgNode);

      var paper = Snap(svgNode);

      svgNode.setAttribute("viewBox", "0 0 " + (width + spillOverMargin * 2) + " " + (height + spillOverMargin * 2));
      // paper.bubbleChart( 10, 10, 500, 400, data);
      

      var tooltip = new Tooltip( paper );
      tooltip.render( "Label", "100mm" );
      tooltip.setPosition( 200, 100 );

      var testCircle = paper.circle( 100, 100, 20 ).attr({
        "cursor": "pointer",
        "fill": "#f00"
      });

      testCircle.mouseover(function( e ){
        tooltip.setPosition( e.offsetX, e.offsetY );
        tooltip.show();
      });
      testCircle.mousemove(function( e ){
        tooltip.setPosition( e.offsetX, e.offsetY );
      });
      testCircle.mouseout(function(){
        tooltip.hide();
      });




    }
  };
});