function init() {
  const dataset1 = "resources/dataset/viz4/AIHW/percent/2001.csv";
  const dataset2 = "resources/dataset/viz4/AIHW/percent/2004-2005.csv";
  const dataset3 = "resources/dataset/viz4/AIHW/percent/2007-2008.csv";
  const dataset4 = "resources/dataset/viz4/AIHW/percent/2011-2012.csv";
  const dataset5 = "resources/dataset/viz4/AIHW/percent/2014–2015.csv";
  const dataset6 = "resources/dataset/viz4/AIHW/percent/2017–2018.csv";
  const dataset7 = "resources/dataset/viz4/AIHW/processed/2022.csv";

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 20, bottom: 30, left: 50 },
    width = 500 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#bubblePlot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Read the data
  d3.csv(
    "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv",
    function (data) {
      // Add X axis
      var x = d3.scaleLinear().domain([0, 12000]).range([0, width]);
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Add Y axis
      var y = d3.scaleLinear().domain([35, 90]).range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      // Add a scale for bubble size
      var z = d3.scaleLinear().domain([200000, 1310000000]).range([4, 40]);

      // Add a scale for bubble color
      var myColor = d3
        .scaleOrdinal()
        .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
        .range(["#648FFF", "#785EF0", "#DC267F", "#FE6100", "#FFB000"]);

      // -1- Create a tooltip div that is hidden by default:
      var tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("opacity", 0)
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white");

      // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
      var showTooltip = function (event, d) {
        console.log("showTooltip triggered");

        tooltip
          .style("opacity", 1)
          .html("Country: " + d.country)
          .style("left", event.pageX + 10 + "px") // Adjust the position here
          .style("top", event.pageY - 28 + "px");
      };

      var moveTooltip = function (event, d) {
        console.log("moveTooltip triggered");
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      };

      var hideTooltip = function () {
        console.log("hideTooltip triggered");
        tooltip.style("opacity", 0);
      };

      // Add dots
      svg
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "bubbles")
        .attr("cx", function (d) {
          return x(d.gdpPercap);
        })
        .attr("cy", function (d) {
          return y(d.lifeExp);
        })
        .attr("r", function (d) {
          return z(d.pop);
        })
        .style("fill", function (d) {
          return myColor(d.continent);
        })
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip);
    }
  );
}

window.onload = init;
