function init() {
  const circularBarCSV1 = "resources/dataset/viz4/AIHW/percent/2001.csv";
  const circularBarCSV2 = "resources/dataset/viz4/AIHW/percent/2004-2005.csv";
  const circularBarCSV3 = "resources/dataset/viz4/AIHW/percent/2007-2008.csv";
  const circularBarCSV4 = "resources/dataset/viz4/AIHW/percent/2011-2012.csv";
  const circularBarCSV5 = "resources/dataset/viz4/AIHW/percent/2014–2015.csv";
  const circularBarCSV6 = "resources/dataset/viz4/AIHW/percent/2017–2018.csv";
  const circularBarCSV7 = "resources/dataset/viz4/AIHW/percent/2022.csv";

  // Default 2011
  // Dynamically change to selected years in the line chart
  var circleYearLabel = "2011";

  // set the dimensions and margins of the graph
  var margin = { top: 100, right: 0, bottom: 0, left: 0 },
    width = 460 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom,
    innerRadius = 50,
    outerRadius = Math.min(width, height) / 2; // the outerRadius goes from the middle of the SVG area to the border

  // append the svg object
  var svg = d3
    .select("#circularBarPlot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" +
        (width / 2 + margin.left) +
        "," +
        (height / 2 + margin.top) +
        ")"
    );

  // Default 2011
  // Dynamically change to selected years in the line chart
  d3.csv(circularBarCSV7, function (data) {
    // Scales
    var x = d3
      .scaleBand()
      .range([0, 2 * Math.PI]) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0) // This does nothing
      .domain(
        data.map(function (d) {
          return d.Category;
        })
      ); // The domain of the X axis is the list of states.
    var y = d3
      .scaleRadial()
      .range([innerRadius, outerRadius]) // Domain will be define later.
      .domain([0, 100]); // Domain of Y is from 0 to the max seen in the data

    // Add the bars
    svg
      .append("g")
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("fill", "#69b3a2")
      .attr(
        "d",
        d3
          .arc() // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(function (d) {
            return y(d["Value"]);
          })
          .startAngle(function (d) {
            return x(d.Category);
          })
          .endAngle(function (d) {
            return x(d.Category) + x.bandwidth();
          })
          .padAngle(0.01)
          .padRadius(innerRadius)
      );

    // Add the labels
    svg
      .append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("text-anchor", function (d) {
        return (x(d.Category) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) <
          Math.PI
          ? "end"
          : "start";
      })
      .attr("transform", function (d) {
        return (
          "rotate(" +
          (((x(d.Category) + x.bandwidth() / 2) * 180) / Math.PI - 90) +
          ")" +
          "translate(" +
          (y(d["Value"]) + 10) +
          ",0)"
        );
      })
      .append("text")
      .text(function (d) {
        return d.Category;
      })
      .attr("transform", function (d) {
        return (x(d.Category) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) <
          Math.PI
          ? "rotate(180)"
          : "rotate(0)";
      })
      .style("font-size", "11px")
      .attr("alignment-baseline", "middle");

    // Center text -> Year
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em") // Vertical alignment
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .text(circleYearLabel);

    // ------------------------------------------------------------------------------- //

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
      "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv"
    ).then(function (data) {
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
        .range(d3.schemeSet2);

      // -1- Create a tooltip div that is hidden by default:
      var tooltip = d3
        .select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white");

      // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
      var showTooltip = function (d) {
        tooltip.transition().duration(200);
        tooltip
          .style("opacity", 1)
          .html("Country: " + d.country)
          .style("left", d3.mouse(this)[0] + 30 + "px")
          .style("top", d3.mouse(this)[1] + 30 + "px");
      };
      var moveTooltip = function (d) {
        tooltip
          .style("left", d3.mouse(this)[0] + 30 + "px")
          .style("top", d3.mouse(this)[1] + 30 + "px");
      };
      var hideTooltip = function (d) {
        tooltip.transition().duration(200).style("opacity", 0);
      };

      // Add dots
      svg
        .append("g")
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
        // -3- Trigger the functions
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip);
    });
  });
}

window.onload = init;
