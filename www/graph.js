const smoothie = new SmoothieChart({ 
	grid:{ 
		fillStyle : '#ffffff',
		strokeStyle: "transparent",
		borderVisible: false
	},
	labels:{
		fillStyle:'#000000',
		fontSize:17,
		precision:0
	}
})

smoothie.streamTo(document.getElementById("graph"), 1000)

const line = new TimeSeries()

// Add a random value to each line every second
setInterval(function() {
	line.append(new Date().getTime(), networkHashrate())
}, 1000)

// Add to SmoothieChart
smoothie.addTimeSeries(line, {
	lineWidth: 1.5,
	strokeStyle: '#000000'
});
