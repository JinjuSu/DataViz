// append the svg object
var svgCirBar = d3
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

d3.csv(
  "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum.csv",
  function (data) {
    // Scales
    var x = d3
      .scaleBand()
      .range([0, 2 * Math.PI]) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0) // This does nothing
      .domain(
        data.map(function (d) {
          return d.Country;
        })
      ); // The domain of the X axis is the list of states.
    var y = d3
      .scaleRadial()
      .range([innerRadius, outerRadius]) // Domain will be define later.
      .domain([0, 14000]); // Domain of Y is from 0 to the max seen in the data

    // Add the bars
    svgCirBar
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
            return x(d.Country);
          })
          .endAngle(function (d) {
            return x(d.Country) + x.bandwidth();
          })
          .padAngle(0.01)
          .padRadius(innerRadius)
      );

    // Add the labels
    svgCirBar
      .append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("text-anchor", function (d) {
        return (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) <
          Math.PI
          ? "end"
          : "start";
      })
      .attr("transform", function (d) {
        return (
          "rotate(" +
          (((x(d.Country) + x.bandwidth() / 2) * 180) / Math.PI - 90) +
          ")" +
          "translate(" +
          (y(d["Value"]) + 10) +
          ",0)"
        );
      })
      .append("text")
      .text(function (d) {
        return d.Country;
      })
      .attr("transform", function (d) {
        return (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) <
          Math.PI
          ? "rotate(180)"
          : "rotate(0)";
      })
      .style("font-size", "11px")
      .attr("alignment-baseline", "middle");
  }
);
