// @TODO: YOUR CODE HERE!
var width = 860;
var height = 500;
var data;

var chartMargin = {
    top: 30,
    right: 40,
    bottom: 60,
    left: 50
  };

var chartWidth = width - chartMargin.left - chartMargin.right;
var chartHeight = height - chartMargin.top - chartMargin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

d3.csv("assets/data/data.csv").then(function(stateData) {
    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
      });

    console.log(stateData);

    var xScale = d3.scaleLinear()
    .range([0, chartWidth])
    .domain([8, d3.max(stateData, data => data.poverty)]);

    var yScale = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain([4, d3.max(stateData, data => data.healthcare)]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
    .classed("axis", true)
    .call(yAxis);

    chartGroup.append("g")
    .classed("axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis);

    chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top})`)
    .classed("aText", true)
    .text("In Poverty (%)");

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - chartMargin.left)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .classed("aText", true)
    .text("Lacks Healthcare (%)");

    for (var i = 0; i < stateData.length; i++) {
        chartGroup.append('g').append("circle")
            .attr("cx", xScale(stateData[i].poverty))
            .attr("cy", yScale(stateData[i].healthcare))
            .attr("r", 10)
            .attr("opacity", "0.5")
            .classed("stateCircle", true)

            chartGroup.append('g').append("text")
            .attr("x", xScale(stateData[i].poverty))
            .attr("y", yScale(stateData[i].healthcare) + 5)
            .classed("stateText", true)
            .attr("text-anchor", "middle")
            .text(stateData[i].abbr)
            .style("font-size", 10);
    }

    var circlesGroup = chartGroup.selectAll("circle").data(stateData)

    var toolTip = d3.select("body")
      .append("div")
      .classed("d3-tip", true);

    circlesGroup.on("mouseover", function(d) {
      toolTip.style("display", "block")
          .html(
            `<strong>${d.state}<strong><BR>Poverty: ${d.poverty}
            <BR> Obesity: ${d.obesity}`)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px")
          .style("position", "absolute")

      .on("mouseout", function() {
        toolTip.style("display", "none");
      });
    })

  }).catch(function(error) {
      console.log(error);
});
