Adventure = {
    nodes: {
		windNode : {
			text: "How many roads must a man walk down\n\
Before you call him a man?\n\
Yes, 'n' how many seas must a white dove sail\n\
Before she sleeps in the sand?\n\
Yes, 'n' how many [times|blowin] must the cannon balls fly\n\
Before they're forever banned?\n\
The answer, my friend, is blowin' in the wind,\n\
The answer is blowin' in the wind.",
			properties: {
				blowin: {
					clickDestination: "beginNode",
					transition: {type: "fly", duration: 2000, force: 0.05}
				}
			}
		},
        beginNode: {
            text: "You begin. Go to [The Hall|hall]. Go to [The Room|room].\
[ You don't have explored everything yet.|notEveryThingDiscovered]\
[ You already have visited The Room.|alreadyVisitedRoom]\
[ You already have visited The Hall.|alreadyVisitedHall]\
[ You have visited everything.|everythingVisited]",
            properties: {
				hall: {
					clickDestination: "hallNode",
					transition: {type: "fade", duration: 200}
				},
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
			onEnter: {setTrue: "visitedHall,testFlag"}
		}
    },
	startNode: 'windNode'
}
