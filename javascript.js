const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let colors = ["#0b326b", "#f5bd42", "#f05129", "#e3337e", "#b7cc94", "#7bcbc0", "#966eac", "#b09977", "#827775", "#f1c7dd"];

//svg 
const mapHeight = 500;
const mapWidth = 900;
const margin = 30;
const height = mapHeight + margin * 4;
const width = mapWidth + margin * 4;

const svg = d3.select("svg")
  .attr("height", height)
  .attr("width", width);

//Http request
let req = new XMLHttpRequest();
req.open("GET", url, true);
req.send();
req.onload = function() {
  const JSONdata = JSON.parse(req.responseText);
  let dataset = JSONdata.monthlyVariance;
  
  //scales
  let xScale = d3.scaleLinear()
    .domain([
      d3.min(dataset, (d) => d.year - 1 ),
      d3.max(dataset, (d) => d.year + 1)
    ])
    .range([margin * 3,  mapWidth + margin * 3])
  let yScale = d3.scaleBand()
    .domain(months)
    .range([margin, mapHeight]);

  let colorScale = d3.scaleQuantize()
    .domain([
      d3.min(dataset, (d) => d.variance),
      d3.max(dataset, (d) => d.variance)
    ])
    .range(colors)

    //axis
  let xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format("d"))
    .tickSizeInner(10)
    .tickSizeOuter(0);
  let yAxis = d3.axisLeft(yScale)
    .tickSizeInner(10)
    .tickSizeOuter(0);

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${mapHeight + 3})`)
    .call(xAxis);
  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${margin * 3}, 0)`)
    .call(yAxis);
    
  //cells
  svg.selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("class", "cell")
  .attr("data-month", (d) => d.month - 1)
  .attr("data-year", (d) => d.year)
  .attr("data-temp", (d) => d.variance)
  .attr("height", mapHeight / 12)
  .attr("width", mapWidth / 262)
  .attr("x", (d) => xScale(d.year))
  .attr("y", (d) => yScale(months[d.month - 1]))
  .attr("fill", (d) => colorScale(d.variance));

  svg.append("rect")
  .attr("class", "border")
  .attr("width", mapWidth)
  .attr("height", mapHeight - 26)
  .attr("x", 90)
  .attr("y", margin)
  .style("fill", "none")
  .style("stroke", "#000")
  .style("stroke-width", 1);

  //tooltip
}
//legend
const legendWidth = 400;
const legendHeight = 60;
const legendRectHeight = legendHeight / 2;
const legendRectWidth = legendWidth / 2;
const legend = svg.append("rect")
  .attr("id", "legend")
  .attr("width", legendWidth)
  .attr("height", legendHeight)
  .attr("x", margin * 3)
  .attr("y", mapHeight + margin)
  .attr("fill", "#fff");
for (let i = 0; i < colors.length; i++) {
  legend.append("rect")
  .attr("width", legendRectWidth)
  .attr("height", legendRectHeight)
  .attr("x", 0)
  .attr("y", 0);
  console.log("test")
}