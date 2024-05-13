function init() {
  const margin = { top: 70, right: 30, bottom: 40, left: 80 };
  //   const width = 1200 - margin.left - margin.right;
  //   const height = 500 - margin.top - margin.bottom;

  var w = 1200 - margin.left - margin.right;
  var h = 500 - margin.top - margin.bottom;

  var padding = 50;

  var dataset, xScale, yScale, xAxis, yAxis, line, svg;

  var formatTime = d3.timeFormat("%Y");

  const tooltip = d3.select("body").append("div").attr("class", "tooltip");

  // Import csv file from the Relative Path
  d3.csv("./resources/dataset/oecd/causes_of_mortality.csv", function (d) {
    return {
      year: new Date(d.year, 0, 1),
      deaths: +d.deaths,
    };
  }).then(function (data) {
    dataset = data;
    console.table(dataset, ["year", "deaths"]);

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
        600,
        d3.max(dataset, function (d) {
          return d.deaths;
        }),
      ])
      .range([h - padding, 0]);

    //Define axes
    xAxis = d3.axisBottom().scale(xScale).ticks(7).tickFormat(formatTime);

    //Define Y axis
    yAxis = d3
      .axisLeft()
      .scale(yScale)
      .ticks((d3.max(data, (d) => d.deaths) - 600) / 50)
      .tickFormat((d) => {
        return `${d}k`;
      });

    //Define line generator
    line = d3
      .line()
      .defined(function (d) {
        return d.deaths >= 0;
      })
      .x(function (d) {
        return xScale(d.year);
      })
      .y(function (d) {
        return yScale(d.deaths);
      });

    //Create SVG element
    svg = d3
      .select("#line-chart")
      .append("svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create the line
    svg.append("path").datum(dataset).attr("class", "line").attr("d", line);

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

    // Add a circle element
    const circle = svg
      .append("circle")
      .attr("r", 0)
      .attr("fill", "steelblue")
      .style("stroke", "white")
      .attr("opacity", 0.7)
      .style("pointer-events", "none");

    // create a listening rectangle
    const listeningRect = svg.append("rect").attr("width", w).attr("height", h);

    // create the mouse move function
    listeningRect.on("mousemove", function (event) {
      const [xCoord] = d3.pointer(event, this);
      const bisectDate = d3.bisector((d) => d.year).left;
      const x0 = xScale.invert(xCoord);
      const i = bisectDate(data, x0, 1);
      const d0 = data[i - 1];
      const d1 = data[i];
      const d = x0 - d0.year > d1.year - x0 ? d1 : d0;
      const xPos = xScale(d.year);
      const yPos = yScale(d.deaths);

      // Update the circle position
      circle.attr("cx", xPos).attr("cy", yPos);

      // Add transition for the circle radius
      circle.transition().duration(50).attr("r", 5);

      // add in  our tooltip
      tooltip
        .style("display", "block")
        .style("left", `${xPos + 100}px`)
        .style("top", `${yPos + 50}px`)
        .html(
          `<strong>Date:</strong> ${d.year.toLocaleDateString()}<br><strong>Deaths:</strong> ${
            d.deaths !== undefined ? d.deaths.toFixed(0) + "k" : "N/A"
          }`
        );
    });

    // Add the chart title

    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("x", w / 2 + margin.left)
      .attr("y", -10)
      .attr("text-anchor", "middle") // Center text alignment
      .style("font-size", "22px")
      .style("font-weight", "bold")
      .style("font-family", "sans-serif")
      .text(
        "Prison Populations in the US Have Trended Upward Since Summer 2020"
      );

    // Add Y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - h / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "#777")
      .style("font-family", "sans-serif")
      .text("Total Deaths");

    // Add the source credit
    svg
      .append("text")
      .attr("class", "source-credit")
      .attr("x", w - 1125)
      .attr("y", h + margin.bottom - 3)
      .style("font-size", "18px")
      .style("font-family", "sans-serif")
      .text("Source: Causes of Mortality, OECD Health Stats");
  });
}

// call init() function to display charts on window
window.onload = init;
