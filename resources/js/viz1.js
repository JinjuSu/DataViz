function init() {
  const margin = { top: 70, right: 30, bottom: 40, left: 80 };
  //   const width = 1200 - margin.left - margin.right;
  //   const height = 500 - margin.top - margin.bottom;

  var w = 1200 - margin.left - margin.right;
  var h = 600 - margin.top - margin.bottom;

  var padding = 50;

  var dataset, xScale, yScale, xAxis, yAxis, line, svg;

  var formatTime = d3.timeFormat("%Y");

  const tooltip = d3.select("body").append("div").attr("class", "tooltip");

  function wrapText(text, width) {
    text.each(function () {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy") || 0),
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", w)
          .attr("y", yScale)
          .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop(); // remove the word that overflowed
          tspan.text(line.join(" ")); // set back the text without the overflowed word
          line = [word]; // start a new line with the overflowed word
          tspan = text
            .append("tspan") // create a new tspan for the new line
            .attr("x", w)
            .attr("y", yScale)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  }

  // Import csv file from the Relative Path
  //   d3.csv("resources/dataset/oecd/causes_of_mortality.csv", function (d) {
  d3.csv("resources/dataset/aihw/cleaned_total_deaths.csv", function (d) {
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
        0,
        d3.max(dataset, function (d) {
          return d.deaths;
        }),
      ])
      .range([h - padding, 0]);

    //Define axes
    xAxis = d3.axisBottom().scale(xScale).ticks(10).tickFormat(formatTime);

    //Define Y axis
    yAxis = d3.axisLeft().scale(yScale);
    //   .ticks((d3.max(data, (d) => d.deaths) - 40000) / 5000);
    //   .tickFormat((d) => {
    //     return `${d}k`;
    //   });

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
      .call(xAxis)
      .selectAll("text") // selects all text elements in the yAxis group
      .style("font-size", "14px");

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis)
      .selectAll("text") // selects all text elements in the yAxis group
      .style("font-size", "14px");

    // Add a circle element
    const circle = svg
      .append("circle")
      .attr("r", 0)
      .attr("fill", "steelblue")
      .style("stroke", "white")
      .attr("opacity", 0.7)
      .style("pointer-events", "none");

    // create a listening rectangle
    const listeningRect = svg
      .append("rect")
      .attr("width", w)
      .attr("height", h)
      .style("pointer-events", "all");

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

    // listening rectangle mouse leave function

    listeningRect.on("mouseleave", function () {
      circle.transition().duration(50).attr("r", 0);
      tooltip.style("display", "none");
    });

    // Add the chart title

    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("x", 0)
      .attr("y", -50)
      .attr("text-anchor", "start") // Center text alignment
      .style("font-size", "26px")
      .style("font-weight", "bold")
      .style("font-family", "sans-serif")
      .text(
        "Line chart presenting number of deaths in Australia in 1907 - 2021"
      );

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
