$.fn.makeAbsolute = function(rebase) {
    return $(this.get().reverse()).each(function() { //omg this reverse is ugly
        var el = $(this);
        var pos = el.position();
        el.css({ position: "absolute",
            marginLeft: 0, marginTop: 0,
            top: pos.top, left: pos.left });
        if (rebase)
            el.remove().appendTo("body");
    });
}

var makeAbsolute = function(elements) {
	$(elements).each(function(i, element) {
		element.tempPos = $(element).position();
	});
	$(elements).each(function(i, element) {
		$(element).css({ position: "absolute",
					  marginLeft: 0, marginTop: 0,
					  top: element.tempPos.top, left: element.tempPos.left });
	});
}

/* Quick hack to avoid multiple call to callback function when using fadeout*/
var mFade = function(element, time, callback) {
	element.fadeOut(time);
	setTimeout(callback, time);
}

/*
 * Move to another node
 */
var transitionTo = function(node) {
	makeAbsolute($('.char'));
	mFade($(':not(.clicked).adventure-text'), 200, function() {
		mFade($('.adventure-text.clicked'), 200, function() {
			$('#adventure').empty();
			$('#adventure').append(buildNode(node));
			$('#adventure').hide(); // todo : why
			$('#adventure').fadeIn(200);
		});
	});;
}

/*
 * Flag management
 */
var Flags = {};

var addCallback = function(element, func) {
	if(!element.callbacks) {
		element.callbacks = [];
	}
	element.callbacks.push(func);
}

var setValue = function(flagString, value) {
	flags = flagString.split(',');
	for (i in flags) {
		Flags[flags[i]] = value;
	}
}

var allTrue = function(flagString) {
	flags = flagString.split(',');
	for(i in flags) {
		if(!Flags[flags[i]]) { return false };
	}
	return true;
}

/*
 * Functions executed when entering a node
 */
var NodeFunctions = {
	setTrue: function(node, parameter) {setValue(parameter, true)},
	setFalse: function(node, parameter) {setValue(parameter, false)}
}

/*
 * Function executed to add property to element (clickable, etc...)
 */
var PropertyFunctions = {
	clickDestination: function(element, parameter) {
		element.addClass('clickable')
			.click(function(e) {
				$(element).addClass('clicked');
				for(i in element.callbacks) {
					element.callbacks[i]();
				}
				transitionTo(Adventure.nodes[parameter]);
			});
	},

	setTrue: function(element, parameter) {
		addCallback(element, function() {setValue(parameter, true)});
	},

	setFalse: function(element, parameter) {
		addCallback(element, function() {setValue(parameter, true)});
	},

	visibleIf: function(element, parameter) {
		if(!allTrue(parameter)) {
			$(element).hide();
		}
	},

	visibleUnless: function(element, parameter) {
		if(allTrue(parameter)) {
			$(element).hide();
		}
	}
}

/*
 * Build html element for a string separing each character
 */
var buildStringHtml = function(text) {
	var output = $('<span>');
	for(chr in text) {
		output.append($('<span>'+text[chr]+'</span>').addClass('char'));
	}
	return output;
}

/*
 * Build html element of a element (formatted or not)
 */
var buildHtml = function(text, properties) {
	if(!text) { return $('')};
	var output = buildStringHtml(text).addClass('adventure-text');
	for (var property in properties) {
		if(PropertyFunctions[property]) {
			PropertyFunctions[property](output, properties[property]);
		}
	}
	return output;
}

/*
 * Build html element of a complete node
 */
var buildNode = function(node) {
	/* Execute onEnter */
	for(onEnterFunc in node.onEnter) {
		if(NodeFunctions[onEnterFunc]) {
			NodeFunctions[onEnterFunc](node, node.onEnter[onEnterFunc]);
		}
	}

/*	console.log("Flags :");
	console.log(Flags);*/

	/* Build the html itself */
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

/*
 * Rough check of the consistency of the adventure
 */
var validateAdventure = function(adventure) {
	if(!adventure.nodes) {
		return "Adventure must have a nodes member";
	} else if(!adventure.startNode) {
		return "Adventure must have a startNode member";
	} else if(!adventure.nodes[adventure.startNode]) {
		return "The startNode does not exists";
	} else {
		for (var nodeName in adventure.nodes) {
			node = adventure.nodes[nodeName]
			if(!node.text) {
				return "The node '"+nodeName+"' doesn't not have any text";
			} else if(node.properties) {
				for (var propertyNode in node.properties) {
					for (var property in node.properties[propertyNode]) {
						if(property == "clickDestination" && !adventure.nodes[
							node.properties[propertyNode][property]
						]) {
							return "The node '"+nodeName+"' have a property '"+propertyNode+"' with clickDestination pointing to '"+node.properties[propertyNode][property]+"' wich is not a node.";
						}
					}
				}
			}
		}
	}
	return null;
}

var valid = validateAdventure(Adventure);
if(valid == null) {
	$('#adventure').append(buildNode(Adventure.nodes[Adventure.startNode]));
} else {
	alert(valid)
}
