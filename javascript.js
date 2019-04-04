const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let colors = ["#264cff", "#3fa0ff", "#72d8ff", "#aaf7ff", "#e0ffff", "#ffffbf", "#ffe099", "#ffad72", "#f76d5e", "#d82632"]

//mapSvg 
const mapHeight = 500;
const mapWidth = 900;
const mapMargin = 30;
const height = mapHeight + mapMargin;
const width = mapWidth + mapMargin * 4;

const mapSvg = d3.select("svg")
  .attr("height", height)
  .attr("width", width);

//Http request
let req = new XMLHttpRequest();
req.open("GET", url, true);
req.send();
req.onload = function() {
  const JSONdata = JSON.parse(req.responseText);
  let dataset = JSONdata.monthlyVariance;

  //dataset.map()
  
  //scales
  let xScale = d3.scaleLinear()
    .domain([
      d3.min(dataset, (d) => d.year - 1 ),
      d3.max(dataset, (d) => d.year + 1)
    ])
    .range([mapMargin * 3,  mapWidth + mapMargin * 3])
  let yScale = d3.scaleBand()
    .domain(months)
    .range([mapMargin, mapHeight]);

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

  mapSvg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${mapHeight + 3})`)
    .call(xAxis);
  mapSvg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${mapMargin * 3}, 0)`)
    .call(yAxis);
    
  //cells
  mapSvg.selectAll("rect")
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
  .attr("fill", (d) => colorScale(d.variance))
  //tooltip
  .on("mouseover", (d, i) => {
    d3.select("#tooltip")
      .style("visibility", "visible")
      .style("left", (event.pageX + 5) + "px")
      .style("top", (event.pageY - 30) + "px")
      .style("background-color", colorScale(d.variance))
      .attr("data-year", d.year);
      insertTooltipText(d.month, d.year, d.variance);
  })
  .on("mouseout", (d, i) => {
    d3.select("#tooltip")
      .style("visibility", "hidden");
  });

  //map border
  mapSvg.append("rect")
  .attr("class", "border")
  .attr("width", mapWidth)
  .attr("height", mapHeight - 26)
  .attr("x", 90)
  .attr("y", mapMargin)
  .style("fill", "none")
  .style("stroke", "#000")
  .style("stroke-width", 1);
  
  //legend
  const legendWidth = 400;
  const legendHeight = 60;
  const legendMargin = 30;
  const legendSvgWidth = legendWidth + legendMargin * 2;
  const legendSvgHeight = legendHeight + legendMargin;
  const legendRectHeight = legendHeight / 2;
  const legendRectWidth = legendWidth / 10;
  
  const legendSvg = d3.select("#legend")
  .attr("height", legendSvgHeight)
  .attr("width", legendSvgWidth);

    legendSvg.selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("width", legendRectWidth)
    .attr("height", legendRectHeight)
    .attr("x", (d, i) => i * legendRectWidth + legendMargin)
    .attr("y", legendMargin)
    .attr("fill", (d) => d);

    let colorScaleArray = [];
    function makeColorScaleArray(dataArray) {
      let minNum = d3.min(dataArray, (d) => d.variance) + JSONdata.baseTemperature;
      let maxNum = d3.max(dataArray, (d) => d.variance) + JSONdata.baseTemperature;
      minNum = parseFloat(minNum.toFixed(1));
      maxNum = parseFloat(maxNum.toFixed(1));
      let arrayNumber = minNum;
      let rangeNum = parseFloat((maxNum - minNum).toFixed(1));
      let fractionNum = parseFloat((rangeNum / 10).toFixed(1));
      while (arrayNumber <= maxNum) {
        colorScaleArray.push(arrayNumber);
        arrayNumber = parseFloat((arrayNumber + fractionNum).toFixed(1));
      }
      colorScaleArray.push(maxNum);
    } 
    makeColorScaleArray(dataset);

    legendSvg.selectAll("text")
      .data(colorScaleArray)
      .enter()
      .append("text")
      .attr("x", (d, i) => (i * legendRectWidth + legendMargin) - 10)
      .attr("y", 75)
      .text((d) => (d));

    legendSvg
      .append("text")
      .attr("x", 200)
      .attr("y", 20)
      .text("(In Celcius)");

    function insertTooltipText(month, year, temp) {
      d3.select("#tooltip")
        .html(`${months[month - 1]}, ${year} </br> ${(temp + JSONdata.baseTemperature).toFixed(1)} C°`);
    };
  }
