/*
 * Transitions functions.
 * the initialize() function is called once
 * the step() function is called at a given frequency and take the return of initialize() as arg.
 */
var Transitions = {
	fade: {
		initialize: function(elements, params) {
			setDefaults(params, {delay: 0});
			this.time = 0;
			this.elements = elements;
			this.delay = params.delay
			this.duration = params.duration;
		},
		step: function(dt) {
			this.time = this.time+dt;
			if(this.time > this.delay) {
				var elapsed = this.time-this.delay;
				var total = this.duration-this.delay;
				$(this.elements).css({opacity: 1 - (elapsed/total)});
			}
		}
	},
	fly: {
		initialize: function(elements, params) {
			setDefaults(params, {force: 0.05});
			this.force = params.force;
			splitElements(elements);
			makeAbsolute(elements.find('.char'));
			this.elements = elements.find('.char');
			Transitions.fade.initialize(elements, params);
		},
		step: function(dt) {
			var force = this.force;
			this.elements.each(function() {
				var pos = $V([parseFloat(this.style.left),parseFloat(this.style.top)]);
				var dir = pos.subtract(State.mouse);
				pos = pos.add(dir.toUnitVector().x(dt*force));
				this.style.left = pos.e(1)+'px';
				this.style.top = pos.e(2)+'px';
			});
			Transitions.fade.step(dt);
		}
	}
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
	},

	obfuscated: function(element, parameter) {
		splitElement(element);
		$(element).find('.char').each(function(i, elt) {
			$(elt).data('realValue', $(elt).text());
			$(elt).data('quality', 0);
			updateChar(elt);
		});
	},

	waveable: function(element, parameter) {
		$(element).children().each(function(i, elt) {
			// if (!$(elt).data('quality')) {
			// 	$(elt).data('quality',1);
			// };
			$(elt).mouseenter(function() {
				var quality = $(elt).data('quality');
				var step = (1-quality)/5;
				$(elt).data('quality', quality+step);
				updateChar(elt);
			});
		});
	}
}

var updateChar = function(chr) {
	if(Math.random() > $(chr).data('quality')) {
		$(chr).text(random_character());
	} else {
		$(chr).text($(chr).data('realValue'));
	}
}

/*
 * Functions executed when entering a node
 */
var NodeFunctions = {
	setTrue: function(node, parameter) {setValue(parameter, true)},
	setFalse: function(node, parameter) {setValue(parameter, false)}
}

/*
 * Current state (include current transition)
 */
var State = {}

/*
 * Called once at the begining
 */
var init = function() {
	var valid = validateAdventure(Adventure);
	if(valid == null) {
		$('#adventure').append(buildNode(Adventure.nodes[Adventure.startNode]));
	} else {
		alert(valid)
	}

	State.mouse = $V([0,0]);
	$(document).mousemove(function(event) {
		State.mouse.setElements([event.pageX, event.pageY]);
/*        State.mouse.x = event.pageX;
        State.mouse.y = event.pageY;*/
    });

	State.lastUpdate = Date.now();
	State.interval = setInterval(function() {
		var now = Date.now();
		var dt = now - State.lastUpdate;
		State.lastUpdate = Date.now();
		update(dt);
	}, 16.6667);
}

/*
 * Called every few millis
 */
var update = function(dt) {
	if(State.transition) {
		State.transition.step(dt);
	}
}

/*
 * Move to another node
 */
var transitionTo = function(node) {
	setDefaults(node, {onEnter : {}});
	setDefaults(node.onEnter, {transition: {}});
	setDefaults(node.onEnter.transition, {type: "fade", duration: 500});
	var transition = Transitions[node.onEnter.transition.type];
	var transitionParameters = node.onEnter.transition;


	transition.initialize($('.node'), transitionParameters);
	State.transition = transition;
	setTimeout(function() {
		State.transition = null;
		$('#adventure').empty();
		$('#adventure').append(buildNode(node));
	}, transitionParameters.duration);
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
 * Split html element by char
 */
var splitElement = function(element) {
	var original = $(element).clone();
	$(element).empty();
	var text = $(original).text();
	for(chr in text) {
		$(element).append($('<span>'+text[chr]+'</span>').addClass('char').addClass('splitted'));
	};
}

/*
 * Join each splitted element
 */
var joinElement = function(element) {
	$(element).find('.splitted').each(function() {
		$(this).parent().append($(this).text());
		$(this).remove();
	});
}

/*
 * Split multiple element by char
 */
var splitElements = function(elements) {
	$(elements).find('.adventure-text').each(function() {
		splitElement(this);
	});
}

/*
 * Join multiple elements
 */
var joinElements = function(elements) {
	$(elements).find('.adventure-text').each(function() {
		joinElement(this);
	});
}

/*
 * Build html element for a string
 */
var buildStringHtml = function(text) {
	return $('<span>').append(text);
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
	var output = $('<div>').addClass('node');
	/* Execute onEnter */
	for(onEnterFunc in node.onEnter) {
		if(NodeFunctions[onEnterFunc]) {
			NodeFunctions[onEnterFunc](node, node.onEnter[onEnterFunc]);
		}
	}

	/* Build the html itself */
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

function random_character() {
	return String.fromCharCode(Math.random() * (126 - 32) + 32);
}

/*
 * Source : http://james.padolsey.com/javascript/deep-copying-of-objects-and-arrays/
 */
function deepCopy(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var out = [], i = 0, len = obj.length;
        for ( ; i < len; i++ ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    if (typeof obj === 'object') {
        var out = {}, i;
        for ( i in obj ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    return obj;
}

/*
 * Fill an object with defaults values
 */
var setDefaults = function(object, defaults) {
	for (key in defaults)
		if(!object.hasOwnProperty(key))
			object[key] = deepCopy(defaults[key])
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

init();
