require.config({
  paths: {
    snap: "../../bower_components/Snap.svg/dist/snap.svg",
    "axis": "../../bower_components/axis/dist/axis",
    "grid-lines": "../../bower_components/grid-lines/dist/grid-lines",
    "scale-utils": "../../bower_components/scale-utils/dist/scale-utils",
    "number-utils": "../../bower_components/number-utils/dist/number-utils",
    "tick-mark": "../../bower_components/tick-mark/dist/tick-mark",
    "bubble-point": "../../bower_components/bubble-point/dist/bubble-point",
    "color-utils": "../../bower_components/color-utils/dist/color",
    "grouped-tooltip": "../../bower_components/grouped-tooltip/dist/grouped-tooltip"
  },
  shim: {
    "snap": {
      exports: "Snap"
    }
  }
});

require(['render'], function(renderer) {
  var container = document.querySelector('[data-factmint-visualization="bubble"]');

  window[container.id] = {
    allowNegativeMargin: false
  }

  renderer();
});