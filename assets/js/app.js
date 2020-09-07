// @TODO: YOUR CODE HERE!
// d3.json("data/data.json").then((data) => {
//     //  Create the Traces
//     var trace1 = {
//       x: data.organ,
//       y: data.survival.map(val => Math.sqrt(val)),
//       type: "box",
//       name: "Cancer Survival",
//       boxpoints: "all"
//     };
  
//     // Create the data array for the plot
//     var data = [trace1];
  
//     // Define the plot layout
//     var layout = {
//       title: "Square Root of Cancer Survival by Organ",
//       xaxis: { title: "Organ" },
//       yaxis: { title: "Square Root of Survival" }
//     };
  
//     // Plot the chart to a div tag with id "plot"
//     Plotly.newPlot("plot", data, layout);
//   });

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(JournalData) {

  console.log(JournalData)
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    JournalData.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
      // console.log("healthcare: ",data.healthcare)
      // console.log("poverty ", data.poverty)
    });


    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(JournalData, d => d.poverty)+6])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(JournalData, d => d.healthcare)+2])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(JournalData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "darkblue")
    .attr("opacity", ".5");

    var Abbrstate = chartGroup.selectAll("label")
    .data(JournalData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("font-size", 10)
    .attr("font-weight", "bold")
    .attr("fill", "white")
    .attr("x", d => xLinearScale(d.poverty)-7)
    .attr("y", d => yLinearScale(d.healthcare)+4);


    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    Abbrstate.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .attr("font-weight", "bold")
      .text("Lacks Healthcare(%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .attr("font-weight", "bold")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });

  