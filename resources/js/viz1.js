function init() {
  // Initialize canvas dimension
  var w = 1280;
  var h = 600;

  var padding = 50;

  var dataset, xScale, yScale, xAxis, yAxis, line, dangerArea;

  var formatTime = d3.timeFormat("%Y");

  // Import csv file from the Relative Path
  d3.csv("./resources/dataset/sample/Unemployment_78-95.csv", function (d) {
    return {
      date: new Date(+d.year, +d.month - 1),
      number: +d.number,
    };
  }).then(function (data) {
    dataset = data;

    console.table(dataset, ["date", "number"]);

    xScale = d3
      .scaleTime()
      .domain([
        d3.min(dataset, function (d) {
          return d.date;
        }),
        d3.max(dataset, function (d) {
          return d.date;
        }),
      ])
      .range([padding, w]);

    yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(dataset, function (d) {
          return d.number;
        }),
      ])
      .range([h - padding, 0]);

    //Define axes
    xAxis = d3.axisBottom().scale(xScale).ticks(10).tickFormat(formatTime);

    //Define Y axis
    yAxis = d3.axisLeft().scale(yScale).ticks(10);

    //Define line generator
    line = d3
      .line()
      .defined(function (d) {
        return d.number >= 0;
      })
      .x(function (d) {
        return xScale(d.date);
      })
      .y(function (d) {
        return yScale(d.number);
      });

    //Define area generators
    area = d3
      .area()
      .x(function (d) {
        return xScale(d.date);
      })

      // base line for area shape
      .y0(function () {
        return yScale.range()[0];
      })
      .y1(function (d) {
        return yScale(d.number);
      });

    //Create SVG element
    var svg = d3
      .select("#line-chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    // Create line
    // svg.append("path").datum(dataset).attr("class", "line").attr("d", line);

    // Add area
    svg.append("path").datum(dataset).attr("class", "area").attr("d", area);

    //Create axes
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);

    // Draw the red line
    svg
      .append("line")
      .attr("class", "line halfMilMark")
      .attr("x1", padding)
      .attr("y1", yScale(500000))
      .attr("x2", w)
      .attr("y2", yScale(500000));

    svg
      .append("text")
      .attr("class", "halfMilLabel")
      .attr("x", padding + 10)
      .attr("y", yScale(500000) - 7)
      .text("Half a million unemployed");
  });
}

// call init() function to display charts on window
window.onload = init;
