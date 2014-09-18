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

    /**
     * Repositions the arrow based on the tooltipPlacement
     * @private
     * @param  {String} tooltipPlacement Can be left, right, top or bottom
     */
    "_positionTooltipArrow": function( tooltipPlacement ){

      var transformMatrix = Snap.matrix(),
          tooltipBGBBox = this._tooltipBG.getBBox();

      switch( tooltipPlacement ){

        case "left":
          transformMatrix.translate(tooltipBGBBox.width+5, tooltipBGBBox.height/2);
          transformMatrix.rotate(180);
          this._arrow.transform( transformMatrix.toTransformString() );
          break;

        case "right":
          transformMatrix.translate(-5, tooltipBGBBox.height/2);
          this._arrow.transform( transformMatrix.toTransformString() );
          break;

        case "top":
          transformMatrix.translate( tooltipBGBBox.width/2, tooltipBGBBox.height+5 );
          transformMatrix.rotate( -90 );
          this._arrow.transform( transformMatrix.toTransformString() );
          break;

        case "bottom":
          transformMatrix.translate( tooltipBGBBox.width/2, -5 );
          transformMatrix.rotate( 90 );
          this._arrow.transform( transformMatrix.toTransformString() );
          break;

      }

      this._tooltipPlacement = tooltipPlacement;

    },

    /**
     * @constructor
     */
    "constructor": Tooltip,

    /**
     * Hides the tooltip
     */
    "hide": function() {
      if (!this.node) {
        return;
      }
      this.node.attr("display", "none");
    },

    /**
     * Removes the tooltip from the dom
     */
    "remove": function() {
      this._arrow = null;
      this._tooltipBG = null;
      this.node.remove();
      this.node = null;
    },

    /**
     * Renders the tooltip
     * @param  {String/Number} name  
     * @param  {String/Number} value
     */
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
      tooltipArrow.attr({
        "fill": "#333"
      });
      this._arrow = tooltipArrow;
      this._positionTooltipArrow( this._tooltipPlacement );

      // Add to the group
      this.node.append( tooltipBG );
      this.node.append( tooltipText );
      this.node.append( tooltipArrow );

      this.hide();

    },

    /**
     * Sets the position for the tooltip to go
     * @param  {Number} x                
     * @param  {Number} y                
     * @param  {String} tooltipPlacement The position for the tooltip to go
     */
    "setPosition": function(x, y, tooltipPlacement) {

      if (!this.node) {
        return;
      }

      if( tooltipPlacement === undefined ){
        tooltipPlacement = this._tooltipPlacement;
      } else if( tooltipPlacement !== this._tooltipPlacement ) {
        this._positionTooltipArrow( tooltipPlacement );
      }

      var tooltipArrowBBox = this._arrow.getBBox(),
          tooltipBGBBox = this._tooltipBG.getBBox();

      switch( tooltipPlacement ){

        case "left":
          x = x - tooltipArrowBBox.width - tooltipBGBBox.width - Config.TOOLTIP_OFFSET_X;
          y = y - tooltipBGBBox.height/2;
          break;

        case "right":
          x = x + tooltipArrowBBox.width + Config.TOOLTIP_OFFSET_X;
          y = y - tooltipBGBBox.height/2;
          break;
        
        case "bottom":
          x = x - tooltipBGBBox.width/2;
          y = y + tooltipArrowBBox.height + Config.TOOLTIP_OFFSET_Y;
          break;

        case "top":
          x = x - tooltipBGBBox.width/2;
          y = y - tooltipBGBBox.height - tooltipArrowBBox.height - Config.TOOLTIP_OFFSET_Y + 10;
          break;

      }

      this.node.transform("T" + x + "," + y );

    },

    /**
     * Show the tooltip
     */
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