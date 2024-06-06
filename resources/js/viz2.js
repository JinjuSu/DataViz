function init() {
  const dataset1 = "resources/dataset/viz4/barplot/2007-2008.csv";
  const dataset2 = "resources/dataset/viz4/barplot/2011-2012.csv";
  const dataset3 = "resources/dataset/viz4/barplot/2014–2015.csv";
  const dataset4 = "resources/dataset/viz4/barplot/2017–2018.csv";
  const dataset5 = "resources/dataset/viz4/barplot/2022.csv";

  var selectedBarDatatSet = dataset1;

  var year;
  switch (selectedBarDatatSet) {
    case dataset1:
      year = "2007 -\n2008";
      break;
    case dataset2:
      year = "2011 -\n2012";
      break;
    case dataset3:
      year = "2014 -\n2015";
      break;
    case dataset4:
      year = "2017 -\n2018";
      break;
    case dataset5:
      year = "2022";
      break;
    default:
      year = "2022";
  }

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 20, bottom: 30, left: 50 },
    width = 600 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

  // Append the bubble plot svg to the div
  var svgBubble = d3
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
      svgBubble
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Add Y axis
      var y = d3.scaleLinear().domain([35, 90]).range([height, 0]);
      svgBubble.append("g").call(d3.axisLeft(y));

      // Add a scale for bubble size
      var z = d3.scaleLinear().domain([200000, 1310000000]).range([4, 40]);

      // Add a scale for bubble color
      var bubbleColor = d3
        .scaleOrdinal()
        .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
        .range(["#648FFF", "#785EF0", "#DC267F", "#FE6100", "#FFB000"]);

      // Create a tooltip div that is hidden by default:
      var tooltip = d3.select("body").append("div").attr("class", "tooltip");

      // Functions to show / update (when mouse moves but stays on the same circle) / hide the tooltip
      var showTooltip = function (d) {
        tooltip
          .style("opacity", 1)
          .html("Factors: " + d.country)
          .style("left", event.pageX + 10 + "px") // Adjust the position here
          .style("top", event.pageY - 28 + "px");
      };

      var moveTooltip = function (event, d) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      };

      var hideTooltip = function (d) {
        tooltip.style("opacity", 0);
      };

      // Add dots
      svgBubble
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "bubbles")
        .attr("cx", function (d) {
          return x(d.gdpPercap); // proportion
        })
        .attr("cy", function (d) {
          return y(d.lifeExp); // correlation
        })
        .attr("r", function (d) {
          return z(d.pop); // counts of consumption
        })
        .style("fill", function (d) {
          return bubbleColor(d.continent);
        })
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip);
    }
  );
  // ----------------- Bubble plot ends here -----------------//

  // ----------------- Circular bar plot starts here -----------------//

  // append the svg for circular bar plot
  // for circular bar plot
  var innerRadius = 60,
    outerRadius = Math.min(width, height) / 1.9;

  var svgCirBar = d3
    .select("#circularBarPlot")
    .append("svg")
    .attr("width", width + margin.left + margin.right + 100)
    .attr("height", height - 50)
    .append("g")
    .attr(
      "transform",
      "translate(" + (width / 2 - 150) + "," + (height / 2 + margin.top) + ")"
    );

  // Add the interactive legend
  var size = 20;

  // Highlight functions for the legend
  var highlight = function (d) {
    // Reduce opacity of all groups
    d3.selectAll(".bars").style("opacity", 0.3);
    d3.selectAll(".circularBarPlot-legend").style("opacity", 0.3);

    // Highlight the associated bar and label
    d3.selectAll("." + d.replace(/ /g, "")).style("opacity", 1);
    d3.selectAll(".circularBarPlot-legend." + d.replace(/ /g, ""))
      .style("font-weight", "bold")
      .style("opacity", 1);
  };

  var noHighlight = function (d) {
    d3.selectAll(".bars").style("opacity", 1);
    d3.selectAll(".circularBarPlot-legend").style("opacity", 1);

    // Reset the corresponding legend rectangles and labels
    d3.selectAll(".circularBarPlot-legend." + d.replace(/ /g, ""))
      .style("font-weight", "normal")
      .style("opacity", 1);
  };

  d3.csv(selectedBarDatatSet, function (data) {
    // Sort data by Value in descending order
    data.sort(function (a, b) {
      return d3.descending(+a.percent, +b.percent);
    });

    // Scales
    var x = d3
      .scaleBand()
      .range([0, 2 * Math.PI]) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0) // This does nothing
      .domain(
        data.map(function (d) {
          return d.factor;
        })
      ); // The domain of the X axis is the list of states.
    var y = d3
      .scaleRadial()
      .range([innerRadius, outerRadius]) // Domain will be define later.
      .domain([0, 100]); // Domain of Y is from 0 to the max seen in the data

    var barColor = d3
      .scaleOrdinal()
      .domain(
        data.map(function (d) {
          return d.factor;
        })
      )
      .range(["#648FFF", "#785EF0", "#DC267F", "#FE6100", "#FFB000"]);

    // Add the bars
    svgCirBar
      .append("g")
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("class", function (d) {
        console.log("bars " + d.factor.replace(/ /g, ""));
        return "bars " + d.factor.replace(/ /g, "");
      })
      .attr("fill", function (d) {
        return barColor(d.factor);
      })
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(innerRadius)
          .outerRadius(function (d) {
            return y(d["percent"]);
          })
          .startAngle(function (d) {
            return x(d.factor);
          })
          .endAngle(function (d) {
            return x(d.factor) + x.bandwidth();
          })
          .padAngle(0.1)
          .padRadius(innerRadius)
      )
      .on("mouseover", function (d) {
        console.log(d.factor);
        highlight(d.factor);
      })
      .on("mouseleave", function (d) {
        console.log(d.factor);
        noHighlight(d.factor);
      })
      .on("click", function (d) {
        console.log("data: ", d.counts);
        document.getElementById("selectedCorr").innerText = d.correlation;
        document.getElementById("selectedTranslation").innerText =
          d.translation;
        document.getElementById("selectedTotal").innerText = d.total;
        document.getElementById("selectedObese").innerText = d.obese;
        document.getElementById("selectedFactor").innerText = d.dashboardlabels;
        document.getElementById("selectedPercent").innerText = d.counts;
      });

    // Add the year label inside the inner radius
    let yearParts = year.split("\n");
    let dyAdjustment = yearParts.length > 1 ? "-0.3em" : "0.4em"; // Adjust based on the number of lines

    svgCirBar
      .append("text")
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .attr("font-weight", "bold")
      .attr("y", 0)
      .selectAll("tspan")
      .data(yearParts)
      .enter()
      .append("tspan")
      .attr("x", 0)
      .attr("dy", function (d, i) {
        return i === 0 ? dyAdjustment : "1.2em";
      })
      .text(function (d) {
        return d;
      });

    // Add legend rectangular bullet
    svgCirBar
      .selectAll("myrect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", width / 2 - 70) // Adjust the position of the legend rectangles
      .attr("y", function (d, i) {
        return -height / 2 + 50 + i * (size + 10);
      })
      .attr("width", 14) // Width of the rectangles
      .attr("height", 14) // Height of the rectangles
      .attr("class", function (d) {
        return d.factor.replace(/ /g, "");
      })
      .style("fill", function (d) {
        return barColor(d.factor);
      })
      .on("mouseover", function (d) {
        highlight(d.factor);
      })
      .on("mouseleave", function (d) {
        noHighlight(d.factor);
      })
      .on("click", function (d) {
        console.log("data: ", d.counts);
        document.getElementById("selectedCorr").innerText = d.correlation;
        document.getElementById("selectedTranslation").innerText =
          d.translation;
        document.getElementById("selectedTotal").innerText = d.total;
        document.getElementById("selectedObese").innerText = d.obese;
        document.getElementById("selectedFactor").innerText = d.dashboardlabels;
        document.getElementById("selectedPercent").innerText = d.counts;
      });

    // Add legend label
    svgCirBar
      .selectAll("circularBarPlot-legend")
      .data(data)
      .enter()
      .append("text")
      .attr("class", function (d) {
        return "circularBarPlot-legend " + d.factor.replace(/ /g, "");
      })
      .attr("x", width / 2 - 40)
      .attr("y", function (d, i) {
        return -height / 2 + 50 + i * (size + 10) + size / 2;
      })
      .style("fill", function (d, i) {
        return barColor(d.factor);
      })
      .text(function (d) {
        // print the text
        return d.dashboardlabels;
      })
      .attr("text-anchor", "left")
      .style("font-size", "20px")
      .style("alignment-baseline", "middle")
      .on("mouseover", function (d) {
        highlight(d.factor);
      })
      .on("mouseleave", function (d) {
        noHighlight(d.factor);
      })
      .on("click", function (d) {
        console.log("data: ", d.counts);
        document.getElementById("selectedCorr").innerText = d.correlation;
        document.getElementById("selectedTranslation").innerText =
          d.translation;
        document.getElementById("selectedTotal").innerText = d.total;
        document.getElementById("selectedObese").innerText = d.obese;
        document.getElementById("selectedFactor").innerText = d.dashboardlabels;
        document.getElementById("selectedPercent").innerText = d.counts;
      });
  });

  // ----------------- Circular bar plot ends here -----------------//
}

window.onload = init;
