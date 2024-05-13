function init() {
  //Width and Height of the SVG container
  var w = 500;
  var h = 400;

  //SVG attributes
  var svg = d3
    .select("#pie-chart")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .style("background-color", "grey");
}

window.onload = init;
