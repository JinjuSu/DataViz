// Append the bubble plot svg to the div

const bubbleData = "resources/dataset/viz4/bubble.csv";

var svgBubble = d3
  .select("#bubblePlot")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Read the data for Bubble
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
