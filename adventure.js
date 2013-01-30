Adventure = {
    nodes: {
        start: {
            text: "You start. Go to [hall|hall]. Go to [room|room].",
            properties: {
				hall: {clickDestination: "hall"},
				room: {clickDestination: "room"}
            }
		},
        room: {
            text: "You room. Go to [hall|hall]. Go to [start|start].",
            properties: {
				hall: {clickDestination: "hall"},
				start: {clickDestination: "start"}
            }
        },
		hall: {
			text: "You hall. Go to [start|start]. Go to [room|room].",
            properties: {
				start: {clickDestination: "start"},
				room: {clickDestination: "room"}
            }
		}
    },
	startNode: 'start'
}
