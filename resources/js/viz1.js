function init() {
  const margin = { top: 70, right: 30, bottom: 40, left: 80 };
  var w = 700 - margin.left - margin.right;
  var h = 600 - margin.top - margin.bottom;
  var padding = 50;

  var dataset, xScale, yScale, xAxis, yAxis, line, svg;

  var formatTime = d3.timeFormat("%Y");

  const tooltip = d3.select("body").append("div").attr("class", "tooltip");

  // Import csv file from the Relative Path
  d3.csv("resources/dataset/aihw/viz2dataset.csv", function (d) {
      return {
          year: new Date(d.year, 0, 1),
          deaths: +d.deaths,
          avoidableDeaths: +d.avoidableDeaths,
          unavoidableDeaths: +d.unavoidableDeaths
      };
  }).then(function (data) {
      dataset = data;
      console.table(dataset, ["year", "deaths", "avoidableDeaths", "unavoidableDeaths"]);

      xScale = d3
          .scaleTime()
          .domain([
              d3.min(dataset, function (d) {
                  return d.year;
              }),
              d3.max(dataset, function (d) {
                  return d.year;
              }),
          ])
          .range([padding, w]);

      yScale = d3
          .scaleLinear()
          .domain([
              0,
              d3.max(dataset, function (d) {
                  return d.deaths;
              }),
          ])
          .range([h - padding, 0]);

      //Define axes
      xAxis = d3.axisBottom().scale(xScale).ticks(10).tickFormat(formatTime);
      yAxis = d3.axisLeft().scale(yScale);

      //Define line generators
      var lineGenerator = (dataField) => d3.line()
          .defined(function (d) {
              return d[dataField] >= 0;
          })
          .x(function (d) {
              return xScale(d.year);
          })
          .y(function (d) {
              return yScale(d[dataField]);
          });

      //Create SVG element
      svg = d3
          .select("#line-chart")
          .append("svg")
          .attr("width", w + margin.left + margin.right)
          .attr("height", h + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Create the lines
      svg.append("path").datum(dataset).attr("class", "line").attr("d", lineGenerator('deaths')).attr("stroke", "green");
      svg.append("path").datum(dataset).attr("class", "line2").attr("d", lineGenerator('avoidableDeaths')).attr("stroke", "blue");
      svg.append("path").datum(dataset).attr("class", "line3").attr("d", lineGenerator('unavoidableDeaths')).attr("stroke", "teal");

      //Create axes
      svg
          .append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0," + (h - padding) + ")")
          .call(xAxis)
          .selectAll("text")
          .style("font-size", "14px");

      svg
          .append("g")
          .attr("class", "axis")
          .attr("transform", "translate(" + padding + ",0)")
          .call(yAxis)
          .selectAll("text")
          .style("font-size", "14px");

      // Add a vertical line for click effect
      const verticalLine = svg.append("line")
          .attr("class", "hover-line")
          .attr("y1", 0)
          .attr("y2", h - padding)
          .attr("stroke", "steelblue")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "4 2")
          .attr("opacity", 0)
          .attr("pointer-events", "none")
          .style("transition", "opacity 0.3s ease");

      // Function to add circles and click events for each line
      function addCirclesAndEvents(lineClass, dataField, color) {
          svg.selectAll(`.${lineClass}-circle`)
              .data(dataset)
              .enter()
              .append("circle")
              .attr("class", `${lineClass}-circle`)
              .attr("cx", function (d) {
                  return xScale(d.year);
              })
              .attr("cy", function (d) {
                  return yScale(d[dataField]);
              })
              .attr("r", 3)
              .attr("fill", color)
              .on("click", function (event, d) {
                  d3.select(this).attr("r", 6);
                  tooltip
                      .style("display", "block")
                      .style("left", `${event.pageX + 10}px`)
                      .style("top", `${event.pageY - 28}px`)
                      .html(
                          `<strong>Year:</strong> ${formatTime(d.year)}<br><strong>${dataField}:</strong> ${
                              d[dataField] !== undefined ? d[dataField].toFixed(0) : "N/A"
                          }`
                      );
                  verticalLine
                      .attr("x1", xScale(d.year))
                      .attr("x2", xScale(d.year))
                      .attr("opacity", 1);
              })
              .on("mouseout", function () {
                  d3.select(this).attr("r", 3);
              });
      }

      // Add circles and click events for each line
      addCirclesAndEvents("deaths", "deaths", "green");
      addCirclesAndEvents("avoidable", "avoidableDeaths", "blue");
      addCirclesAndEvents("unavoidable", "unavoidableDeaths", "teal");

      // Create an overlay rectangle for capturing mouse events
      svg.append("rect")
          .attr("class", "overlay")
          .attr("width", w)
          .attr("height", h)
          .attr("pointer-events", "all")
          .attr("fill", "none")
          .attr("stroke", "none")
          .on("click", function (event) {
              const [xCoord] = d3.pointer(event, this);
              const bisectDate = d3.bisector((d) => d.year).left;
              const x0 = xScale.invert(xCoord);
              const i = bisectDate(data, x0, 1);
              const d0 = data[i - 1];
              const d1 = data[i];
              const d = x0 - d0.year > d1.year - x0 ? d1 : d0;
              const xPos = xScale(d.year);

              verticalLine
                  .attr("x1", xPos)
                  .attr("x2", xPos)
                  .attr("opacity", 1);

              tooltip
                  .style("display", "block")
                  .style("left", `${event.pageX + 10}px`)
                  .style("top", `${event.pageY - 28}px`)
                  .html(
                      `<strong>Year:</strong> ${formatTime(d.year)}<br><strong>Total Deaths:</strong> ${
                          d.deaths !== undefined ? d.deaths.toFixed(0) : "N/A"
                      }<br><strong>Avoidable Deaths:</strong> ${
                          d.avoidableDeaths !== undefined ? d.avoidableDeaths.toFixed(0) : "N/A"
                      }<br><strong>Unavoidable Deaths:</strong> ${
                          d.unavoidableDeaths !== undefined ? d.unavoidableDeaths.toFixed(0) : "N/A"
                      }`
                  );
          });

      // Add the chart title
      svg
          .append("text")
          .attr("class", "chart-title")
          .attr("x", 0)
          .attr("y", -50)
          .attr("text-anchor", "start")
          .style("font-size", "26px")
          .style("font-weight", "bold")
          .style("font-family", "sans-serif")
          .text("Line chart presenting number of deaths in Australia in 1907 - 2021");

      // Add Y-axis label
      svg
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - h / 2)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size", "22px")
          .style("fill", "#777")
          .style("font-family", "sans-serif")
          .text("Total Deaths");

      // Add the source credit
      svg
          .append("text")
          .attr("class", "source-credit")
          .attr("x", w - 1125)
          .attr("y", h + margin.bottom - 3)
          .style("font-size", "14px")
          .style("font-family", "sans-serif")
          .text(
              "Source:  Deaths by broad cause of death, number and rates (deaths per 100,000 population), 1907–2021, Australia Instituion of Health and Welfare"
          );
  });
}

// call init() function to display charts on window
window.onload = init;
