var originalLocation = 0;
var circleInterval;

function circleAnimation(time) {

	originalLocation++;
	document.getElementById("circle").style.left = originalLocation + "px";

	if (time < 4000) {
		circleInterval = requestAnimationFrame(circleAnimation);
	} 

	else {
		document.getElementById("circle").style.backgroundColor = "dimgrey";
		cancelAnimationFrame(circleInterval);
	}
}

circleInterval = requestAnimationFrame(circleAnimation);