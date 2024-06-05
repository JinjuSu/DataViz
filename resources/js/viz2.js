function init() {
  const dataset1 = "resources/dataset/viz4/AIHW/percent/2001.csv";
  const dataset2 = "resources/dataset/viz4/AIHW/percent/2004-2005.csv";
  const dataset3 = "resources/dataset/viz4/AIHW/percent/2007-2008.csv";
  const dataset4 = "resources/dataset/viz4/AIHW/percent/2011-2012.csv";
  const dataset5 = "resources/dataset/viz4/AIHW/percent/2014–2015.csv";
  const dataset6 = "resources/dataset/viz4/AIHW/percent/2017–2018.csv";
  const dataset7 = "resources/dataset/viz4/AIHW/percent/2022.csv";

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 20, bottom: 30, left: 50 },
    width = 500 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;
  // for circular bar plot
  (innerRadius = 50), (outerRadius = Math.min(width, height) / 2);

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

  // ----------------- Cicular bar plot starts here -----------------//

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

  d3.csv(dataset7, function (data) {
    // Sort data by Value in descending order
    data.sort(function (a, b) {
      return d3.descending(+a.Value, +b.Value);
    });
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

    var barColor = d3
      .scaleOrdinal()
      .domain([
        "Alcohol",
        "DailyFruitAndVegetables",
        "Obese",
        "smoker",
        "PhysicalActivity",
      ])
      .range(["#648FFF", "#785EF0", "#DC267F", "#FE6100", "#FFB000"]);

    // Add the bars
    svgCirBar
      .append("g")
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("fill", function (d) {
        return barColor(d.Category);
      })
      .attr(
        "d",
        d3
          .arc()
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
    svgCirBar
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

    // Add the interactive legend
    var size = 20;
    var allgroups = [
      "Alcohol",
      "DailyFruitAndVegetables",
      "Obese",
      "Daily smoker",
      "PhysicalActivity",
    ];
    svgCirBar
      .selectAll("myrect")
      .data(allgroups)
      .enter()
      .append("circle")
      .attr("cx", -width / 2 + 50)
      .attr("cy", function (d, i) {
        return -height / 2 + 50 + i * (size + 5);
      }) // Adjust the position of the legend dots
      .attr("r", 7)
      .style("fill", function (d) {
        return barColor(d);
      })
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight);

    svgCirBar
      .selectAll("mylabels")
      .data(allgroups)
      .enter()
      .append("text")
      .attr("x", -width / 2 + 65)
      .attr("y", function (d, i) {
        return -height / 2 + 50 + i * (size + 5) + size / 2;
      }) // Adjust the position of the legend labels
      .style("fill", function (d) {
        return barColor(d);
      })
      .text(function (d) {
        return d;
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight);
  });
}

window.onload = init;
