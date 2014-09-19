define(function() {

  var TOOLTIP_OFFSET_X = 10;
  var TOOLTIP_OFFSET_Y = 20;
  var TOOLTIP_PADDING_TOP = 10;
  var TOOLTIP_PADDING_BOTTOM = 10;
  var TOOLTIP_PADDING_LEFT = 10;
  var TOOLTIP_PADDING_RIGHT = 10;
  var TOOLTIP_BORDER_RADIUS = 4;

  var TEXT_SIZE_SMALL = "12px";
  var FONT_FAMILY = "'Lato', sans-serif";

  function Tooltip(paper) {

    this._paper = paper;
    this._parent = paper.node;
    this._styles = Tooltip.STYLES_PRIMARY;
    this._tooltipArrow = null;
    this._tooltipBG = null;
    this._tooltipPlacement = "right";
    this._tooltipText = null;

    this.node = null;

  }

  Tooltip.prototype = {

    /**
     * Repositions the arrow based on the tooltipPlacement
     * @private
     * @param  {String} tooltipPlacement Can be left, right, top or bottom
     */
    "_positionTooltipArrow": function( tooltipPlacement ){

      var transformMatrix = Snap.matrix();
      var tooltipBGBBox = this._tooltipBG.getBBox();

      switch( tooltipPlacement ){

        case "left":
          transformMatrix.translate(tooltipBGBBox.width+4, tooltipBGBBox.height/2);
          transformMatrix.rotate(180);
          this._tooltipArrow.transform( transformMatrix.toTransformString() );
          break;

        case "right":
          transformMatrix.translate(-4, tooltipBGBBox.height/2);
          this._tooltipArrow.transform( transformMatrix.toTransformString() );
          break;

        case "top":
          transformMatrix.translate( tooltipBGBBox.width/2, tooltipBGBBox.height+4 );
          transformMatrix.rotate( -90 );
          this._tooltipArrow.transform( transformMatrix.toTransformString() );
          break;

        case "bottom":
          transformMatrix.translate( tooltipBGBBox.width/2, -4 );
          transformMatrix.rotate( 90 );
          this._tooltipArrow.transform( transformMatrix.toTransformString() );
          break;

      }

      this._tooltipPlacement = tooltipPlacement;

    },

    /**
     * @constructor
     */
    "constructor": Tooltip,

    /**
     * Returns the styles of the current tooltip
     * @return {Object} Styles
     */
    "getStyles": function(){
      return this._styles;
    },

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
      this._tooltipArrow = null;
      this._tooltipBG = null;
      this._tooltipText = null;
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
      var tooltipText = paper.text( TOOLTIP_PADDING_LEFT, TOOLTIP_PADDING_TOP, name + ": " + value );
      tooltipText.attr({
        "dy": parseInt(TEXT_SIZE_SMALL,10),
        "fill": "#fff",
        "font-family": FONT_FAMILY,
        "font-size": TEXT_SIZE_SMALL
      });
      this._tooltipText = tooltipText;

      // Render the background
      tmpBBox = tooltipText.getBBox();
      var tooltipBG = paper.rect( 0, 0, tmpBBox.width + TOOLTIP_PADDING_RIGHT + TOOLTIP_PADDING_LEFT, tmpBBox.height + TOOLTIP_PADDING_TOP + TOOLTIP_PADDING_BOTTOM, TOOLTIP_BORDER_RADIUS );
      tooltipBG.attr({
        "fill": "#3C3C3C"
      });
      this._tooltipBG = tooltipBG;

      // Render the arrow
      var tooltipArrow = paper.polygon([-3.5,0.2,6.5,-5,6.5,5]);
      var tooltipArrowMask = paper.rect(-6,-6,11,12).attr("fill", "#fff");
      tooltipArrow.attr({
        "fill": "#3C3C3C",
        "mask": tooltipArrowMask
      });
      this._tooltipArrow = tooltipArrow;
      this._positionTooltipArrow( this._tooltipPlacement );

      // Add to the group
      this.node.append( tooltipBG );
      this.node.append( tooltipText );
      this.node.append( tooltipArrow );

      this.setStyles( this._styles );

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

      var tooltipArrowBBox = this._tooltipArrow.getBBox(),
          tooltipBGBBox = this._tooltipBG.getBBox();

      switch( tooltipPlacement ){

        case "left":
          x = x - tooltipArrowBBox.width - tooltipBGBBox.width - TOOLTIP_OFFSET_X;
          y = y - tooltipBGBBox.height/2;
          break;

        case "right":
          x = x + tooltipArrowBBox.width + TOOLTIP_OFFSET_X;
          y = y - tooltipBGBBox.height/2;
          break;
        
        case "bottom":
          x = x - tooltipBGBBox.width/2;
          y = y + tooltipArrowBBox.height + TOOLTIP_OFFSET_Y;
          break;

        case "top":
          x = x - tooltipBGBBox.width/2;
          y = y - tooltipBGBBox.height - tooltipArrowBBox.height - TOOLTIP_OFFSET_Y + 10;
          break;

      }

      this.node.transform("T" + x + "," + y );

    },

    /**
     * Sets the styles of the tooltip
     * @param  {Object} styles
     */
    "setStyles": function( styles ){

      if( styles === undefined ){ return; }

      if( typeof styles.arrow === "object" ){
        this._tooltipArrow.attr( styles.arrow );
      }

      if( typeof styles.background === "object" ){
        this._tooltipBG.attr( styles.background );
      }

      if( typeof styles.text === "object" ){
        this._tooltipText.attr( styles.text );
      }

      this._styles = styles;

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

  Tooltip.STYLES_PRIMARY = {
    "arrow": {
      "fill": "#3C3C3C",
      "stroke": "none"
    },
    "background": {
      "fill": "#3C3C3C",
      "stroke": "none"
    },
    "text": {
      "fill": "#fff"
    }
  };

  Tooltip.STYLES_SECONDARY = {
    "arrow": {
      "fill": "#fff",
      "stroke": "#3C3C3C",
      "stroke-width": "2px"
    },
    "background": {
      "fill": "#fff",
      "stroke": "#3C3C3C",
      "stroke-width": "2px"
    },
    "text": {
      "fill": "#3C3C3C"
    }
  };

  var dataColours = ["#ECB53E", "#8AC37E", "#88B25B", "#459C76", "#32AFE5", "#2A7FB9", "#385F8C", "#AE74AF", "#744589", "#A7305D", "#D03B43", "#DC8336"];
  dataColours.forEach(function( colour, index ){

    Tooltip[ "STYLES_COLOR_WHEEL_" + String.fromCharCode( 65 + index ) ] = {
      "arrow": {
        "fill": colour,
        "stroke": "none"
      },
      "background": {
        "fill": colour,
        "stroke": "none"
      },
      "text": {
        "fill": "#fff"
      }
    };

  });

  return Tooltip;

});