define(["Config"], function( Config ) {

  function Tooltip(paper) {

    this._arrow = null;
    this._orientation = "left";
    this._paper = paper;
    this._parent = paper.node;

    this.node = null;

  }

  Tooltip.prototype = {

    "constructor": Tooltip,

    "hide": function() {
      if (!this.node) {
        return;
      }
      this.node.attr("display", "none");
    },

    "remove": function() {
      this._arrow = null;
      this.node.remove();
      this.node = null;
    },

    "render": function(name, value) {

      var paper = this._paper;
      var tmpBBox = null;

      if (this.node !== null) {
        this.remove();
      }
      this.node = paper.g();

      // Render the text
      var tooltipText = paper.text( 10, 10, name + ": " + value );
      tooltipText.attr({
        "dy": parseInt(Config.TEXT_SIZE_SMALL,10),
        "fill": "#fff",
        "font-family": Config.FONT_FAMILY,
        "font-size": Config.TEXT_SIZE_SMALL
      });

      // Render the background
      tmpBBox = tooltipText.getBBox();
      var tooltipBG = paper.rect( 0, 0, tmpBBox.width + 20, tmpBBox.height + 20, 4, 4 );
      tooltipBG.attr({
        "fill": "#333"
      });

      // Render the arrow
      tmpBBox = tooltipBG.getBBox();
      var tooltipArrow = paper.polygon([-5,0.2,5,-5,5,5]);
      tooltipArrow.transform("t-5," + tmpBBox.height/2);
      tooltipArrow.attr({
        "fill": "#333"
      });
      this._arrow = tooltipArrow;

      // Add to the group
      this.node.append( tooltipBG );
      this.node.append( tooltipText );
      this.node.append( tooltipArrow );

    },

    "setPosition": function(x, y, orientation) {

      if (!this.node) {
        return;
      }

      var tooltipBG = this.node.node.children[0];

      if( orientation === undefined ){
        orientation = "left";
      }

      if( orientation !== this._orientation ){

        var tooltipArrow = this._arrow;

        switch( orientation ){

          case "left":

            break;

          case "right":
            break;

          case "top":
            break;

          case "bottom":
            break;

        }

        this._orientation = orientation;

      }

      x = x + Config.TOOLTIP_OFFSET_X;
      y = y + Config.TOOLTIP_OFFSET_Y - tooltipBG.getBBox().height/2;

      this.node.transform("T" + x + "," + y );
    },

    "show": function() {
      if (!this.node) {
        return;
      }
      this.node.parent().append( this.node );
      this.node.attr("display", "block");
    }

  };

  return Tooltip;

});