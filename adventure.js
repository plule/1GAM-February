Adventure = {
    nodes: {
        beginNode: {
            text: "You begin. Go to [The Hall|hall]. Go to [The Room|room].",
            properties: {
				hall: {clickDestination: "hallNode"},
				room: {clickDestination: "roomNode"}
            }
		},
        roomNode: {
            text: "You room. Go to [The Hall|hall]. Go to [The Beginning|begin].",
            properties: {
				hall: {clickDestination: "hallNode"},
				begin: {clickDestination: "beginNode"}
            }
        },
		hallNode: {
			text: "You hall. Go to [The Beginning|begin]. Go to [The Room|room].",
            properties: {
				begin: {clickDestination: "beginNode"},
				room: {clickDestination: "roomNode"}
            }
		}
    },
	startNode: 'beginNode'
}
