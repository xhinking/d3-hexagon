function hexagon() {

	var width = 0,
		height = 0,
		levelNumber = 0,
		levelStep = 40,
		labels =  [],
		dataArray = [],
		maxArray = [],
		pointsArray = [];

	function hexagon(selection) {
		selection.each(function(d) {

			var svg = d3.select(this);
			dataArray = d.sort().reverse();

			// 1. Find max layer depht, levelNumber
			dataArray.forEach(function(array) {
				maxArray.push(d3.max(array));
			});

			levelNumber = d3.max(maxArray);

			// 2. Draw background hexagon and store points
			for (var i = 0; i < levelNumber; i++) {
				var points = computeHexagonPoints(width, height, (i + 1) * levelStep);
				pointsArray.push(points);

				var polygon = svg.append("polygon")
									.attr({
										"points": function(d, i) { return computeHexagonString(points); },
										"fill": "#0282ef",
										"fill-opacity": ".3"
									});
			};

			// 3. Draw points and area
			dataArray.forEach(function(data, index) {

				// 3.1 Draw area
				svg.append("polygon")
					.attr({
						"class": "area",
						"points": function() { return computeHexagonString(pointsArray[0])},
						"fill-opacity": "0"
					})
					.transition()
					.delay(300)
					.duration(700)
					.ease("elastic")
					.attr({
						"points": function() { return computeAreaPoints(data); },
						"fill": function(d, i) { return "rgb( .1, "+i+","+i+")"; },
						"fill-opacity": ".5"
					});

				// 3.2 Draw points
				var circle = svg.selectAll("g")
								.append("g")
								.data(data)
								.enter()
								.append("circle")
								.attr({
									"cx": width / 2,
									"cy": height / 2,
									"r": "4",
									"fill": "#0282ef",
									"stroke": "white",
									"stroke-width": "2"
								})
								.transition()
								.delay(300)
								.duration(700)
								.ease("elastic")
								.attr({
									"cx": function(d, i) { index = d -1;return pointsArray[index][i][0]; },
									"cy": function(d, i) { index = d -1;return pointsArray[index][i][1]; },
									"r": "4",
									"fill": "#0282ef",
									"stroke": "white",
									"stroke-width": "2"
								});
			});

			// 5. Draw label
			var labelPoints = computeHexagonPoints(width, height, (levelNumber + 1) * levelStep);
			svg.selectAll("text")
				.data(labelPoints)
				.enter()
				.append("text")
				.text(function(d, i) { return labels[i]; })
				.attr({
					"x": function(d, i) { if (i == 4 ) return (d[0] + 15); else return d[0]; },
					"y": function(d, i) { if (i == 4 || i == 1) return d[1] + 6; else return d[1]; },
					"text-anchor": function(d, i) { if (i == 4) return "end";else return "middle";}
				});

			// 6. Event handler
			d3.selectAll(".area")
				.on("mouseover", function() {
					d3.select(this)
						.transition()
						.attr("fill", "red");
				})
				.on("mouseout", function() {
					d3.select(this)
						.transition()
						.attr("fill", "blue")
				});

			d3.selectAll("circle")
				.on("mouseover", function() {
					d3.select(this)
						.transition()
						.ease("elastic")
						.attr("r", "6");
				})
				.on("mouseout", function() {
					d3.select(this)
						.transition()
						.attr("r", "4");
				});
		});
	}

	function computeHexagonPoints(width, height, l) {
	    x = width / 2;
	    y = height / 2;
	    a = l * Math.cos(60 / 180 * Math.PI);
	    b = l * Math.sin(60 / 180 * Math.PI);

	    p1 = [(x + a), (y - b)];
        p2 = [(x + l), y];
        p3 = [(x + a), (y + b)];
        p4 = [(x - a), (y + b)];
        p5 = [(x - l), y];
        p6 = [(x - a), (y - b)];
        
        p =[];
	    p.push(p1, p2, p3, p4, p5, p6);

	    return p;
	}

	function computeAreaPoints(data) {
		var pointStr = "";
		for (var i = 0; i < data.length; i++) {
			index = data[i] - 1;
			pointStr += pointsArray[index][i][0] + "," + pointsArray[index][i][1] + " ";
		};

		return pointStr;
	}

	function computeHexagonString(points) {
		var pointsStr = "";
		for (var i = 0; i < points.length; i++) {
			pointsStr += points[i][0] + "," + points[i][1] + " ";
		};

		return pointsStr;
	}

	hexagon.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return hexagon;
	}

	hexagon.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return hexagon;
	}

	hexagon.level = function(_) {
		if (!arguments.length) return level;
		level = _;
		return hexagon;
	}

	hexagon.levelStep = function(_) {
		if (!arguments.length) return levelStep;
		levelStep = _;
		return hexagon;
	}

	hexagon.labels = function(_) {
		if (!arguments.length) return labels;
		labels = _;
		return hexagon;
	}

	hexagon.dataArray = function(_) {
		if (!arguments.length) return dataArray;
		dataArray = _;
		return hexagon;
	}

	return hexagon;
}