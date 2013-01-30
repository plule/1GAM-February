var parseText = function(text) {
	var output = $(document.createElement('div'));
	var linkExp =  /\[([^\[\]\|]+)\|(\w+)\]/g;
	
	var lastIndex = 0;
	while((regArray = linkExp.exec(text)) !== null) {
		
		var rawText = text.substring(lastIndex, regArray.index);
		if(rawText) {
			output.append($('<span>')
						  .append(rawText)
						  .addClass('raw-text'))
		}
		
		output.append($('<span>')
					  .append(regArray[1])
					  .addClass('format-text'));

		lastIndex = linkExp.lastIndex;
	}
	var rawText = text.substring(lastIndex);
	if(rawText) {
		output.append($('<span>')
					  .append(rawText)
					  .addClass('raw-text'));
	}

	return output;
}

var CurrentNode = Adventure.nodes[Adventure.startNode];

var output = parseText(CurrentNode.text);
$('#adventure').append(output);//adventure.nodes.roomNode.text);
