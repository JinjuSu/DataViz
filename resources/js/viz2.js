function init() {
  const datasets = {
    dataset1: "resources/dataset/viz4/barplot/2007-2008.csv",
    dataset2: "resources/dataset/viz4/barplot/2011-2012.csv",
    dataset3: "resources/dataset/viz4/barplot/2014–2015.csv",
    dataset4: "resources/dataset/viz4/barplot/2017–2018.csv",
    dataset5: "resources/dataset/viz4/barplot/2022.csv",
  };

  const bubbleData = "resources/dataset/viz4/bubble.csv";

  let selectedBarDatatSet = datasets.dataset5;
  let powerGauge;
  let barColor;
  let selectedFactor = null;

  let yearDescription;
  switch (selectedBarDatatSet) {
    case datasets.dataset1:
      year = "2007 - 2008";
      break;
    case datasets.dataset2:
      year = "2011 - 2012";
      break;
    case datasets.dataset3:
      year = "2014 - 2015";
      break;
    case datasets.dataset4:
      year = "2017 -  2018";
      break;
    case datasets.dataset5:
      year = "2022";
      break;
    default:
      year = "2022";
  }

  function getColorForCorrelation(correlation) {
    if (correlation == 0) return "#FFFFFF";
    if (correlation > 0 && correlation < 0.3) return "#FFE600";
    if (correlation >= 0.3 && correlation < 0.7) return "#FFAA32";
    if (correlation >= 0.7) return "#FF4949";
    if (correlation < 0 && correlation > -0.3) return "#D9FF00";
    if (correlation <= -0.3 && correlation > -0.7) return "#3FFF00";
    if (correlation <= -0.7) return "#00D200";
    return "#000000"; // Default color if none of the above conditions match
  }

  function updateDataset(value) {
    selectedBarDatatSet = datasets[value];
    clearBubblePlot();
    drawCircularBarPlot();
    updateDashboardCards();
  }

  function updateDashboardCards() {
    console.log("updateDashboardCards is called");

    d3.csv(selectedBarDatatSet, function (data) {
      const summaryData = data[0];
      const correlationColor = getColorForCorrelation(summaryData.correlation);

      // Update the description text
      document.getElementById("selectedTranslationDescription").innerText =
        summaryData.translation;
      document.getElementById("selectedFactorDescription").innerText =
        summaryData.counts;
      document.getElementById("selectedTotalDescription").innerText =
        summaryData.total;
      document.getElementById("selectedOverweightDescription").innerText =
        summaryData.obese;
      document.getElementById("selectedYearDescription").innerText =
        yearDescription;

      // Update the dashboards
      console.log(summaryData);
      document.getElementById("selectedCorr").innerText =
        summaryData.correlation;
      document.getElementById("selectedTranslation").innerText =
        summaryData.translation;
      document.getElementById("selectedTotal").innerText = summaryData.total;
      document.getElementById("selectedOverweight").innerText =
        summaryData.obese;
      document.getElementById("selectedOverweight").innerText =
        summaryData.obese;

      document.getElementById("selectedFactor").innerText =
        summaryData.dashboardlabels;
      document.getElementById("selectedPercent").innerText = summaryData.counts;

      // Set the text color based on the correlation value
      document.getElementById("selectedTranslation").style.color =
        correlationColor;
      document.getElementById("selectedCorr").style.color = correlationColor;

      // Set the text color of the selected health factor
      const factorColor = barColor(summaryData.dashboardlabels);
      document.getElementById("selectedFactor").style.color = factorColor;
      document.getElementById("selectedPercent").style.color = factorColor;

      // Update the gauge with the correlation value
      powerGauge.update(summaryData.correlation);
    });
  }

  function clearBubblePlot() {
    d3.select("#bubblePlot").select("svg").remove();
  }

  function drawCircularBarPlot() {
    // Clear the previous plot
    d3.select("#circularBarPlot").select("svg").remove();

    let year;
    switch (selectedBarDatatSet) {
      case datasets.dataset1:
        year = "2007 -\n2008";
        break;
      case datasets.dataset2:
        year = "2011 -\n2012";
        break;
      case datasets.dataset3:
        year = "2014 -\n2015";
        break;
      case datasets.dataset4:
        year = "2017 -\n2018";
        break;
      case datasets.dataset5:
        year = "2022";
        break;
      default:
        year = "2022";
    }

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 20, bottom: 30, left: 50 },
      width = 600 - margin.left - margin.right,
      height = 420 - margin.top - margin.bottom,
      padding = 60;

    // -------------------- Bubble plot starts here -------------------- //

    // Append the bubble plot svg to the div
    var svgBubble = d3
      .select("#bubblePlot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Read the data for Bubble
    d3.csv(bubbleData, function (data) {
      // Convert numerical values from strings to numbers
      data.forEach(function (d) {
        d.alcohol = +d.alcohol.replace(",", "");
        d.fruit = +d.fruit.replace(",", "");
        d.vegatable = +d.vegatable.replace(",", ""); // corrected typo here
        d.smoke = +d.smoke.replace(",", "");
        d.physical = +d.physical.replace(",", "");
        d.obese = +d.obese.replace(",", "");
        d.total = +d.total.replace(",", "");
      });

      // Scale X axis (obese)
      var x = d3
        .scaleLinear()
        .domain([
          5000,
          d3.max(data, function (d) {
            return d.obese + 2000;
          }),
        ])
        .range([padding, width]);

      // Add x-axis
      svgBubble
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(d3.axisBottom(x));

      // Add X axis label
      svgBubble
        .append("text")
        .attr("class", "x-axis-label")
        .attr(
          "transform",
          "translate(" +
            (width / 2 - 50) +
            " ," +
            (height + margin.top - 10) +
            ")"
        )
        .style("text-anchor", "middle")
        .text("Overweight or Obese Population");

      // Add Y axis (health factors)
      var y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data, function (d) {
            return (
              Math.max(d.alcohol, d.fruit, d.vegatable, d.smoke, d.physical) +
              2000
            );
          }),
        ])
        .range([height - padding, 0]);

      svgBubble
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(d3.axisLeft(y));

      // Add Y axis label
      svgBubble
        .append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - height / 2 + 20)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Risk health factors consumption");

      // Add a scale for bubble size
      var z = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data, function (d) {
            return Math.max(
              d.alcohol,
              d.fruit,
              d.vegatable,
              d.smoke,
              d.physical
            );
          }),
        ])
        .range([4, 24]);

      // Add a scale for bubble color
      var bubbleColor = d3
        .scaleOrdinal()
        .domain(["fruit", "vegatable", "alcohol", "smoke", "physical"])
        .range(["#648FFF", "#785EF0", "#DC267F", "#FE6100", "#FFB000"]);

      // Create a tooltip div that is hidden by default:
      var tooltip = d3.select("body").append("div").attr("class", "tooltip");

      // Functions to show / update / hide the tooltip
      var showTooltip = function (d, factor) {
        tooltip
          .style("opacity", 1)
          .html(
            " Year of data collection: " +
              d.year +
              "<br>Total population who were overweight of obese: " +
              d.obese +
              // "<br>Total: " +
              // d.total +
              "<br>" +
              "Total amount of " +
              factor.charAt(0) +
              factor.slice(1) +
              " that did not meet health guideline: " +
              d[factor]
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      };

      var moveTooltip = function (d) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      };

      var hideTooltip = function (d) {
        tooltip.style("opacity", 0);
      };

      // Add dots for each health factor
      var healthFactors = [
        "alcohol",
        "fruit",
        "vegatable",
        "smoke",
        "physical",
      ];

      // Add dots for each health factor
      healthFactors.forEach(function (factor) {
        svgBubble
          .selectAll("dot")
          .data(data)
          .enter()
          .append("circle")
          .attr("class", function (d) {
            return "bubbles bubble " + factor.replace(/ /g, "");
          }) // Add class
          .attr("cx", function (d) {
            return x(d.obese);
          })
          .attr("cy", function (d) {
            return y(d[factor]);
          })
          .attr("r", function (d) {
            return z(d[factor]);
          })
          .style("fill", function (d) {
            return bubbleColor(factor);
          })
          .on("mouseover", function (d) {
            showTooltip(d, factor);
          })
          .on("mousemove", moveTooltip)
          .on("mouseleave", hideTooltip);
      });

      // Add legend
      var size = 20;
      svgBubble
        .selectAll("myrect")
        .data(healthFactors)
        .enter()
        .append("rect")
        .attr("x", 700)
        .attr("y", function (d, i) {
          return 10 + i * (size + 5);
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function (d) {
          return bubbleColor(d);
        });

      // Add labels beside legend dots
      svgBubble
        .selectAll("mylabels")
        .data(healthFactors)
        .enter()
        .append("text")
        .attr("x", 700 + size * 1.2)
        .attr("y", function (d, i) {
          return 10 + i * (size + 5) + size / 2;
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function (d) {
          return bubbleColor(d);
        })
        .text(function (d) {
          return d;
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
    });

    // -------------------- Bubble plot ends here -------------------- //

    // -------------------- Circular bar plot starts here -------------------- //

    // append the svg for circular bar plot
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
        "translate(" + (width / 2 - 160) + "," + (height / 2 + margin.top) + ")"
      );

    // Add the interactive legend
    var size = 20;
    var highlight = function (factor) {
      // Reduce opacity of all groups
      d3.selectAll(".bars").style("opacity", 0.3);
      d3.selectAll(".circularBarPlot-legend").style("opacity", 0.3);
      d3.selectAll(".bubbles").style("opacity", 0.3);
      d3.selectAll(".myrect").style("opacity", 0.3);

      // Highlight the associated bar, legend, and bubble
      d3.selectAll("." + factor.replace(/ /g, "")).style("opacity", 1);
      d3.selectAll(".circularBarPlot-legend." + factor.replace(/ /g, ""))
        .style("font-weight", "bold")
        .style("opacity", 1);
      d3.selectAll(".bubble." + factor.replace(/ /g, "")).style("opacity", 1);
      d3.selectAll(".myrect." + factor.replace(/ /g, "")).style("opacity", 1);
    };

    var noHighlight = function () {
      if (selectedFactor) return; // Do nothing if a factor is selected
      d3.selectAll(".bars").style("opacity", 1);
      d3.selectAll(".circularBarPlot-legend").style("opacity", 1);
      d3.selectAll(".bubbles").style("opacity", 1);
      d3.selectAll(".myrect").style("opacity", 1);

      // Reset the corresponding legend rectangles and labels
      d3.selectAll(".circularBarPlot-legend").style("font-weight", "normal");
    };

    function handleClick(d) {
      const factor = d.factor;
      if (selectedFactor === factor) {
        selectedFactor = null;
        noHighlight();
      } else {
        selectedFactor = factor;
        highlight(factor);

        const correlationColor = getColorForCorrelation(d.correlation);
        const factorColor = barColor(d.factor);

        document.getElementById("selectedCorr").innerText = d.correlation;
        document.getElementById("selectedTranslation").innerText =
          d.translation;
        document.getElementById("selectedTotal").innerText = d.total;
        document.getElementById("selectedObese").innerText = d.obese;
        document.getElementById("selectedFactor").innerText = d.dashboardlabels;
        document.getElementById("selectedPercent").innerText = d.counts;

        // Set the text color based on the correlation value
        document.getElementById("selectedTranslation").style.color =
          correlationColor;
        document.getElementById("selectedCorr").style.color = correlationColor;

        // Set the text color of the selected health factor
        document.getElementById("selectedFactor").style.color = factorColor;
        document.getElementById("selectedPercent").style.color = factorColor;

        // Update the gauge with the correlation value
        powerGauge.update(d.correlation);
      }
    }

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

      barColor = d3
        .scaleOrdinal()
        .domain(["fruit", "vegatable", "alcohol", "smoke", "physical"])
        .range(["#648FFF", "#785EF0", "#DC267F", "#FE6100", "#FFB000"]);

      // Add the bars
      svgCirBar
        .append("g")
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("class", function (d) {
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
          if (!selectedFactor) highlight(d.factor);
        })
        .on("mouseleave", function (d) {
          if (!selectedFactor) noHighlight();
        })
        .on("click", handleClick);

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

      // Add the risk health factor title
      svgCirBar
        .append("text")
        .attr("class", "health-factor-title")
        .attr("x", width / 2 - 55)
        .attr("y", -height / 2 + 40)
        .text("Risk Health");

      svgCirBar
        .append("text")
        .attr("class", "health-factor-title")
        .attr("x", width / 2 - 55)
        .attr("y", -height / 2 + 90)
        .text("Factors");

      // Add legend rectangular bullet
      svgCirBar
        .selectAll("myrect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", width / 2 - 50) // Adjust the position of the legend rectangles
        .attr("y", function (d, i) {
          return -height / 2 + 150 + i * (size + 10);
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
          if (!selectedFactor) highlight(d.factor);
        })
        .on("mouseleave", function (d) {
          if (!selectedFactor) noHighlight();
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
        .attr("x", width / 2 - 20)
        .attr("y", function (d, i) {
          return -height / 2 + 150 + i * (size + 10) + size / 2;
        })
        .style("fill", function (d, i) {
          return barColor(d.factor);
        })
        .text(function (d) {
          return d.dashboardlabels;
        })
        .attr("text-anchor", "left")
        .style("font-size", "20px")
        .style("alignment-baseline", "middle")
        .on("mouseover", function (d) {
          if (!selectedFactor) highlight(d.factor);
        })
        .on("mouseleave", function (d) {
          if (!selectedFactor) noHighlight();
        })
        .on("click", handleClick);
    });
  }

  // Initialize the plot with the default dataset
  drawCircularBarPlot();
  updateDashboardCards();

  // Expose updateDataset function to global scope for event listener
  window.updateDataset = updateDataset;

  // -------------------- Circular bar plot ends here -------------------- //

  // Initialize the gauge
  powerGauge = new Gauge({
    minValue: -1,
    maxValue: 1,
    lowThreshhold: -0.3,
    highThreshhold: 0.7,
    scale: "linear",
    displayUnit: "Correlation",
  });

  powerGauge.render("#gauge");

  // Update the gauge with the initial correlation value from the dataset
  d3.csv(selectedBarDatatSet, function (data) {
    const initialCorrelation = data[0].correlation; // Assuming the first entry is a summary
    powerGauge.update(initialCorrelation);
  });

  // Add a click event listener to the document
  document.addEventListener("click", function (event) {
    if (event.target.closest(".bars, .circularBarPlot-legend, .bubbles")) {
      return;
    }
    selectedFactor = null;
    noHighlight();
  });
}

// Gauge class and its methods
class Gauge {
  constructor(configuration) {
    const config = {
      size: 320,
      margin: 10,
      minValue: -1,
      maxValue: 1,
      majorTicks: 5,
      lowThreshhold: -0.3,
      highThreshhold: 0.7,
      scale: "linear",
      lowThreshholdColor: "#009900",
      defaultColor: "#ffe500",
      highThreshholdColor: "#cc0000",
      transitionMs: 1000,
      displayUnit: "Value",
    };

    this.arcPadding = 15;
    this.arcWidth = 20;
    this.labelInset = 10;

    this.minAngle = -90;
    this.maxAngle = 90;
    this.angleRange = this.maxAngle - this.minAngle;

    this.config = Object.assign(config, configuration);
    this._config();
  }

  _config() {
    const pointerWidth = 15;
    const pointerTailLength = 5;
    const pointerHeadLength = this._radius() - this.labelInset;
    this.lineData = [
      [pointerWidth / 2, 0],
      [0, -pointerHeadLength],
      [-(pointerWidth / 2), 0],
      [0, pointerTailLength],
      [pointerWidth / 2, 0],
    ];

    if (this.config.scale == "log") {
      this.scale = d3
        .scaleLog()
        .range([0, 1])
        .domain([this.config.minValue, this.config.maxValue]);
    } else {
      this.scale = d3
        .scaleLinear()
        .range([0, 1])
        .domain([this.config.minValue, this.config.maxValue]);
    }

    const colorDomain = [
      this.config.lowThreshhold,
      this.config.highThreshhold,
    ].map(this.scale);
    const colorRange = [
      this.config.lowThreshholdColor,
      this.config.defaultColor,
      this.config.highThreshholdColor,
    ];
    this.colorScale = d3.scaleThreshold().domain(colorDomain).range(colorRange);

    let ticks = this.config.majorTicks;
    if (this.config.scale === "log") {
      ticks = Math.log10(this.config.maxValue / this.config.minValue);
    }
    this.ticks = this.scale.ticks(ticks);

    this.threshholds = [
      this.config.minValue,
      this.config.lowThreshhold,
      this.config.highThreshhold,
      this.config.maxValue,
    ].map((d) => this.scale(d));

    this.arc = d3
      .arc()
      .innerRadius(this._radius() - this.arcWidth - this.arcPadding)
      .outerRadius(this._radius() - this.arcPadding)
      .startAngle((d, i) => {
        const ratio = i > 0 ? this.threshholds[i - 1] : this.threshholds[0];
        return this._deg2rad(this.minAngle + ratio * this.angleRange);
      })
      .endAngle((d, i) =>
        this._deg2rad(this.minAngle + this.threshholds[i] * this.angleRange)
      );
  }

  _radius() {
    return (this.config.size - this.config.margin) / 2;
  }

  _deg2rad(deg) {
    return (deg * Math.PI) / 180;
  }

  setConfig(configuration) {
    this.config = Object.assign(this.config, configuration);
    this._config();
    return this;
  }

  render(container, newValue) {
    d3.select(container).selectAll("svg").remove();
    d3.select(container).selectAll("div").remove();

    const svg = d3
      .select(container)
      .append("svg")
      .attr("class", "gauge")
      .attr("width", this.config.size + this.config.margin)
      .attr("height", this.config.size / 2 + this.config.margin);

    const arcs = svg
      .append("g")
      .attr("class", "arc")
      .attr("transform", `translate(${this._radius()}, ${this._radius()})`);

    arcs
      .selectAll("path")
      .data(this.threshholds)
      .enter()
      .append("path")
      .attr("fill", (d) => this.colorScale(d - 0.001))
      .attr("d", this.arc);

    const lg = svg
      .append("g")
      .attr("class", "label")
      .attr("transform", `translate(${this._radius()},${this._radius()})`);

    lg.selectAll("text")
      .data(this.ticks)
      .enter()
      .append("text")
      .attr("transform", (d) => {
        var newAngle = this.minAngle + this.scale(d) * this.angleRange;
        return `rotate(${newAngle}) translate(0, ${
          this.labelInset - this._radius()
        })`;
      })
      .text(d3.format("1,.0f"));

    lg.selectAll("line")
      .data(this.ticks)
      .enter()
      .append("line")
      .attr("class", "tickline")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", this.arcWidth + this.labelInset)
      .attr("transform", (d) => {
        const newAngle = this.minAngle + this.scale(d) * this.angleRange;
        return `rotate(${newAngle}), translate(0, ${
          this.arcWidth - this.labelInset - this._radius()
        })`;
      })
      .style("stroke", "#666")
      .style("stroke-width", "1px");

    const pg = svg
      .append("g")
      .data([this.lineData])
      .attr("class", "pointer")
      .attr("transform", `translate(${this._radius()},${this._radius()})`);

    const pointer = pg
      .append("path")
      .attr("d", d3.line())
      .attr("transform", `rotate(${this.minAngle})`);

    this.pointer = pointer;
  }

  update(newValue) {
    const newAngle = this.minAngle + this.scale(newValue) * this.angleRange;

    this.pointer
      .transition()
      .duration(this.config.transitionMs)
      .attr("transform", `rotate(${newAngle})`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the gauge
  const powerGauge = new Gauge({
    minValue: -1,
    maxValue: 1,
    lowThreshhold: -0.3,
    highThreshhold: 0.7,
    scale: "linear",
    displayUnit: "Correlation",
  });

  powerGauge.render("#gauge");

  // Update the gauge with the initial correlation value from the dataset
  d3.csv("resources/dataset/viz4/barplot/2022.csv", function (data) {
    const initialCorrelation = data[0].correlation; // Assuming the first entry is a summary
    powerGauge.update(initialCorrelation);
  });

  // Expose the gauge to the global scope for updating later
  window.powerGauge = powerGauge;
});

// -------------------- Gauge chart ends here -------------------- //

window.onload = init;
