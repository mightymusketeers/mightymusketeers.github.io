
function displayUserScores(scores) {
	console.log(scores);
	if(scores.length <= 0){
		return;
	}
   /**
	* Variables
	*/

	// Width and height
	var w = window.innerWidth;
	var h = window.innerHeight;
	var userScores = [];
	var userNames = [];

	// pulling out data from param
	$.each(scores, function( i, value ) {
		// add scores to an array
		userScores.push( value.score );
		// add usernames to an array
		userNames.push( titleCase(value.username) );
	});


	var dataset = userScores;

	var xScale = d3.scale.ordinal()
					.domain(d3.range(dataset.length))
					.rangeRoundBands([0, w], 0.05);

	var yScale = d3.scale.linear()
					.domain([100, d3.max(dataset)])
					.range([h/5, h]);


	// Title for graph
	d3.select("#userGraph").append("text")
        .attr("x", (w / 2))
        .attr("y", (h / 10))
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("font-family", "futura")
        .style("color", "white")
        .text("High Scores");

	// Create SVG element
	var svg = d3.select("#userGraph")
				.append("svg")
				.attr("width", w)
				.attr("height", h);


	// Create bars
	svg.selectAll("rect")
	   .data(dataset)
	   .enter()
	   .append("rect")

	   /**
	    * Attributes
	    */
	   .attr("x", function(d, i) {
			return xScale(i);
	   })
	   .attr("y", function(d) {
			return h - yScale(d);
	   })
	   .attr("width", xScale.rangeBand() / 1.7)
	   .attr("height", function(d) {
			return yScale(d);
	   })
	   .attr("fill", function(d) {
			return "rgb(0, 0, " + (d * 10) + ")";
	   })

	   /**
	    * Functions
	    */
	   .on("mouseover", function(d, i) {
			//Get this bar's x/y values, then augment for the tooltip
			var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 500;
			var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + h / 3.5;

			//Update the tooltip position and value
			d3.select("#tooltip")
				.style("left", xPosition + "px")
				.style("top", yPosition + "px")
				.select("#scoreTip")
				.html("<b>" + userNames[i] + "</b>" +    // username
					  "<br/>" +  						 // line break
					   d); 								 // score

			// Show the tooltip
			d3.select("#tooltip").classed("hidden", false);
	   })

	   .on("mouseout", function() {

			// Hide the tooltip
			d3.select("#tooltip").classed("hidden", true);

	   })

	   .on("click", function() {
			//maybe a function here?
	   });


		/**
		 * Bar labels
		 */

		// scores
		svg.selectAll("text")
		   .data(dataset)
		   .enter()
		   .append("text")
		   .text(function(d, i) {
				return (userNames[i]);
		   })
		   .attr("text-anchor", "middle")
		   .attr("x", function(d, i) {
				return xScale(i) + xScale.rangeBand() / 3.4;
		   })
		   .attr("y", function(d) {
				return h - yScale(d) + 16;
		   })
		   .attr("font-family", "sans-serif")
		   .attr("font-size", "15px")
		   .attr("font-weight", "bold")
		   .attr("fill", "white");


		  svg.selectAll("text.values")
			 .data(dataset)
			 .enter()
			 .append("text")
			 .text(function(d, i) {
				return d;
			 })
		     .attr("text-anchor", "middle")
		     .attr("x", function(d, i) {
				return xScale(i) + xScale.rangeBand() / 3.4;
		     })
		     .attr("y", function(d) {
				return h - yScale(d) + 50;
		     })
		     .attr("font-family", "sans-serif")
		     .attr("font-size", "15px")
		     .attr("fill", "white");
}
