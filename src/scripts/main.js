require.config({
  paths: {
    snap: "../../bower_components/Snap.svg/dist/snap.svg"
  },
  shim: {
    "snap": {
      exports: "Snap"
    }
  }
});

require(['render'], function(renderer) {
  var container = document.querySelector('[data-factmint-visualization="test"]');

  window[container.id] = {
    allowNegativeMargin: false
  }

  renderer();
});