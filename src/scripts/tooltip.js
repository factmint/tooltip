define(["Config"], function( Config ) {

  function Tooltip(paper) {

    this._arrow = null;
    this._paper = paper;
    this._parent = paper.node;
    this._tooltipBG = null;
    this._tooltipPlacement = "right";

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
      this._tooltipBG = tooltipBG;

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

      this.hide();

    },

    "setPosition": function(x, y, tooltipPlacement) {

      if (!this.node) {
        return;
      }

      if( tooltipPlacement === undefined ){
        tooltipPlacement = this._tooltipPlacement;
      } else {
        this._tooltipPlacement = tooltipPlacement;
      }

      var tooltipArrow = this._arrow,
          tooltipBGBBox = this._tooltipBG.getBBox(),
          transformMatrix = Snap.matrix();

      switch( tooltipPlacement ){

        case "left":
          transformMatrix.translate(tooltipBGBBox.width+5, tooltipBGBBox.height/2);
          transformMatrix.rotate(180);
          tooltipArrow.transform( transformMatrix.toTransformString() );
          x = x - Config.TOOLTIP_OFFSET_X - tooltipBGBBox.width;
          y = y + Config.TOOLTIP_OFFSET_Y - tooltipBGBBox.height/2;
          break;

        case "right":
          transformMatrix.translate(-5, tooltipBGBBox.height/2);
          tooltipArrow.transform( transformMatrix.toTransformString() );
          x = x + Config.TOOLTIP_OFFSET_X;
          y = y + Config.TOOLTIP_OFFSET_Y - tooltipBGBBox.height/2;
          break;
        
        case "bottom":
          transformMatrix.translate( tooltipBGBBox.width/2, -5 );
          transformMatrix.rotate( 90 );
          tooltipArrow.transform( transformMatrix.toTransformString() );
          x = x - tooltipBGBBox.width/2;
          y = y + 30;
          break;

        case "top":
          transformMatrix.translate( tooltipBGBBox.width/2, tooltipBGBBox.height+5 );
          transformMatrix.rotate( -90 );
          tooltipArrow.transform( transformMatrix.toTransformString() );
          x = x - tooltipBGBBox.width/2;
          y = y - tooltipBGBBox.height - 20;
          break;

      }

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