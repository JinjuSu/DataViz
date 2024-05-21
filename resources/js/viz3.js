function init(){
    var width = 1200;
    var height = 500;

    var svg = d3.select("#scatter-plot")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .style("background-color", "grey");
}

window.onload = init;