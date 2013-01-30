var transitionTo = function(node) {
	$('#adventure').empty();
	$('#adventure').append(buildNode(node));
}

var buildHtml = function(text, properties) {
	if(properties) {
		return $('<span>')
			.append(text)
			.addClass('format-text')
			.click(function(e) {
				transitionTo(Adventure.nodes[properties.clickDestination]);
			})
	} else if(text) {
		return $('<span>')
			.append(text)
			.addClass('raw-text');
	} else {
		return $('');
	}
}

var buildNode = function(node) {
	var output = $(document.createElement('div'));
	var linkExp =  /\[([^\[\]\|]+)\|(\w+)\]/g;
	var text = node.text;

	var lastIndex = 0;
	while((regArray = linkExp.exec(text)) !== null) {
		
		output.append(buildHtml(text.substring(lastIndex, regArray.index)));
		// regArray[1] : disp text, regArray[2] : property name
		output.append(buildHtml(regArray[1], node.properties[regArray[2]]));

		lastIndex = linkExp.lastIndex;
	}
	output.append(buildHtml(text.substring(lastIndex)));

	return output;
}

transitionTo(Adventure.nodes[Adventure.startNode]);


