Adventure = {
    nodes: {
        beginNode: {
            text: "You begin. Go to [The Hall|hall]. Go to [The Room|room].\
[ You don't have explored everything yet.|notEveryThingDiscovered]\
[ You already have visited The Room.|alreadyVisitedRoom]\
[ You already have visited The Hall.|alreadyVisitedHall]\
[ You have visited everything.|everythingVisited]",
            properties: {
				hall: {clickDestination: "hallNode"},
				room: {clickDestination: "roomNode", setTrue: "visitedRoom"},
				alreadyVisitedRoom: {visibleIf: "visitedRoom"},
				alreadyVisitedHall: {visibleIf: "visitedHall"},
				notEveryThingDiscovered: {visibleUnless: "visitedHall,visitedRoom"},
				everythingVisited: {visibleIf: "visitedHall,visitedRoom"}
            }
		},
        roomNode: {
            text: "You room. Go to [The Hall|hall]. Go to [The Beginning|begin]. [Look, this text is strange.|decayingText]",
            properties: {
				hall: {clickDestination: "hallNode"},
				begin: {clickDestination: "beginNode"},
				decayingText: {obfuscated: true, waveable: true}
            }
        },
		hallNode: {
			text: "You hall. Go to [The Beginning|begin]. Go to [The Room|room].",
            properties: {
				begin: {clickDestination: "beginNode"},
				room: {clickDestination: "roomNode", setTrue: "visitedRoom"}
            },
			onEnter: {
				setTrue: "visitedHall,testFlag",
				transition: {duration: 50}
			}
		}
    },
	startNode: 'beginNode'
}
