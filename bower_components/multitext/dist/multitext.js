define(['snap'],
function(Snap) {
	return Snap.plugin(function (Snap, Element, Paper, glob) {
	    Paper.prototype.multitext = function (x, y, text) {
	        text = text.split("\n");
	        var multitext = this.text(x, y, text);
	        multitext.selectAll("tspan:nth-child(n+2)").attr({
	            dy: "1.8em",
	            x: x
	        });
	        return multitext;
	    };
	});
});