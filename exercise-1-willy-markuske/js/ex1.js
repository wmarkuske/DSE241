// set the dimensions and margins of the graph
var margin = {top: 50, right: 30, bottom: 40, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
//d3.csv("../data/subregion-medals.csv", function(data) {
// issue with loading local data call data from github
d3.csv("https://raw.githubusercontent.com/wmarkuske/DSE241/main/ex1/total.csv", function(data) {

  var subgroups = data.columns.slice(1)

  var groups = d3.map(data, function(d){return(d.Year)}).keys()

  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", height + margin.bottom)
    .style("text-anchor", "middle")
    .text("Year");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - (margin.left/2))
    .attr("x", 0 - (height/2))
    .attr("dy", "lem")
    .style("text-anchor", "middle")
    .text("Percentage of Medals Won");

  // Add title
  svg.append("text")
    .attr("x", (width / 2 ))
    .attr("y", 0 - (margin.top / 2))
    .style("text-anchor", "middle")
    .text("Percentage of Medals Won by World Sub-Region at the Winter Olympics");

  // Color palette
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(d3.schemeSet3)

  // Normalize the data
  console.log(data)
  dataNormalized = []
  data.forEach(function(d){
    tot = 0
    for (i in subgroups){ name=subgroups[i] ; tot += +d[name] }
    for (i in subgroups){ name=subgroups[i] ; d[name] = d[name] / tot * 100}
  })

  var stackedData = d3.stack()
    .keys(subgroups)
    (data)

  // Create a tooltip
  var tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  var mouseover = function(d) {
    var subgroupName = d3.select(this.parentNode).datum().key;
    var subgroupValue = d.data[subgroupName];
    tooltip
        .html("Subregion: " + subgroupName + "<br>" + "Percentage: " + subgroupValue.toFixed(2))
        .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+90) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
  }

  // Show the bars
  svg.append("g")
    .selectAll("g")
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .attr("class", function(d){ return "myRect " + d.key })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.Year); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth())
        .attr("stroke", "grey")
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)

})
