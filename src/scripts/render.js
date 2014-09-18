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

      var rightCircle = paper.circle( 200, 100, 20 ).attr({
        "cursor": "pointer",
        "fill": "#f00"
      });

      var leftCircle = paper.circle( 300, 100, 20 ).attr({
        "cursor": "pointer",
        "fill": "#f00"
      });

      var bottomCircle = paper.circle( 200, 200, 20 ).attr({
        "cursor": "pointer",
        "fill": "#f00"
      });

      var topCircle = paper.circle( 300, 200, 20 ).attr({
        "cursor": "pointer",
        "fill": "#f00"
      });

      rightCircle.mouseover(function( e ){
        tooltip.render("Tooltip placed to the right", "<9000");
        tooltip.setPosition( e.offsetX, e.offsetY, "right" );
        tooltip.show();
      });
      rightCircle.mousemove(function( e ){
        tooltip.setPosition( e.offsetX, e.offsetY );
      });
      rightCircle.mouseout(function(){
        tooltip.hide();
      });

      leftCircle.mouseover(function( e ){
        tooltip.render("Tooltip placed to the left", "<9000");
        tooltip.setPosition( e.offsetX, e.offsetY, "left" );
        tooltip.show();
      });
      leftCircle.mousemove(function( e ){
        tooltip.setPosition( e.offsetX, e.offsetY );
      });
      leftCircle.mouseout(function(){
        tooltip.hide();
      });

      bottomCircle.mouseover(function( e ){
        tooltip.render("Tooltip placed below", "<9000");
        tooltip.setPosition( e.offsetX, e.offsetY, "bottom" );
        tooltip.show();
      });
      bottomCircle.mousemove(function( e ){
        tooltip.setPosition( e.offsetX, e.offsetY );
      });
      bottomCircle.mouseout(function(){
        tooltip.hide();
      });

      topCircle.mouseover(function( e ){
        tooltip.render("Tooltip placed above", "<9000");
        tooltip.setPosition( e.offsetX, e.offsetY, "top" );
        tooltip.show();
      });
      topCircle.mousemove(function( e ){
        tooltip.setPosition( e.offsetX, e.offsetY );
      });
      topCircle.mouseout(function(){
        tooltip.hide();
      });


    }
  };
});