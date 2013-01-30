Adventure = {
    nodes: {
        roomNode: {
            text: "[text|textLink][textagain|ya] is a link. [This one|textBis] too and can be transformed",
            properties: {
                textLink: {
                    clickDestination: "hallNode"
                },
                textBis: {
                    clickDestination: "hallNode",
                    waveText: "Hidden text"
                }
            }
		},
        hallNode: {
            text: "This is a simple node without link. But it has an [obfuscated|obfText] text.",
            properties: {
                obfText: {obfuscated: true}
            }
        }
    },
	startNode: 'roomNode'
}
