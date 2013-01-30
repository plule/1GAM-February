var transitionTo = function(node) {
	$('#adventure').fadeOut(200, function() {
		$('#adventure').empty();
		$('#adventure').append(buildNode(node));
		$('#adventure').fadeIn(200);
	});
}

var PropertyFunctions = {
	clickDestination: function(element, parameter) {
		element.addClass('clickable')
			.click(function(e) {
				transitionTo(Adventure.nodes[parameter]);
			});
	}
}

var buildHtml = function(text, properties) {
	if(!text) { return $('')};
	var output = $('<span>').append(text).addClass('adventure-text');
	for (var property in properties) {
		if(PropertyFunctions[property]) {
			PropertyFunctions[property](output, properties[property]);
		}
	}
	return output;
}

var buildNode = function(node) {
	var output = $(document.createElement('div'));
	var linkExp =  /\[([^\[\]\|]+)\|(\w+)\]/g;
	var text = node.text;

	var lastIndex = 0;
	while((regArray = linkExp.exec(text)) !== null) {
		
		output.append(buildHtml(text.substring(lastIndex, regArray.index), {}));
		// regArray[1] : disp text, regArray[2] : property name
		output.append(buildHtml(regArray[1], node.properties[regArray[2]]));

		lastIndex = linkExp.lastIndex;
	}
	output.append(buildHtml(text.substring(lastIndex), {}));
	return output;
}

transitionTo(Adventure.nodes[Adventure.startNode]);


