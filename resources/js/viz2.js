function init() {
    var width = 500;
    var height = 350;
    var radius = Math.min(width, height) / 2;
    var tooltip = d3.select("#tooltip");

    // Original and specific descriptions and titles
    const originalDescription = "This visualization provides a clear and comprehensive overview of the proportion of deaths that are classified as avoidable versus unavoidable. By examining data over several years, this chart illustrates trends and insights into how different factors impact mortality rates. The data is sourced from reputable health databases and is intended to foster better understanding and awareness among policymakers and the public about potential areas for intervention and improvement in healthcare services.";
    const descriptions = {
        "Avoidable": "Researches found that <b>19.2%</b> of deaths in Australia between 1970 and 2021 were avoidable as <i>changes to lifestyle, access to medical care</i> or <i>participation in public health campaigns</i> could've been implemented to avoid this. One of the many major focus of these preventive measures is <a href='viz3.html'>obesity</a>, as it contributes to morbidity and mortality for a number of other diseases. These include diabetes, cardiovascular disease and a number of malignancies that contribute to avoidable deaths. The importance of targeting obesity through <u>lifestyle changes (diet and physical activity), educational campaigns and promotion</u> is illustrated by this figure which seeks to reduce the number of avoidable deaths from each disease in order to improve the public health outcomes for everyone.",
        "Unavoidable": "Between 1970 and 2021 in Australia, <b>80.8%</b> of all deaths reached this dubious classification and this unavoidability emerged as a major public health concern. Unavoidable deaths are common and include those from <i>genetic diseases, some infections</i> and <i>terminal advanced disease</i> where the natural course of illness or treatment cannot cure the outcome, often a terminal state. Clearly this remains an important line of enquiry, especially if research helps improve health and reduce unavoidable deaths. To learn how to manage and prevent unavoidable deaths, it’s essential to understand what contributes to them."
    };
    const originalTitle = "Proportion of Avoidable vs Unavoidable Deaths in Australia (1997 - 2021)";
    const titles = {
        "Avoidable": "Avoidable Deaths",
        "Unavoidable": "Unavoidable Deaths"
    };

    var svg = d3.select("#pie-chart")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")");

    var color = d3.scaleOrdinal()
                  .range(["#FF6347", "#4682B4"]);

    d3.dsv(";", "resources/dataset/aihw/death_proportion_Australia.csv").then(function(data) {
        var pieData = data.map(function(d) {
            return { label: d.deathType, value: parseFloat(d.Percentage) };
        });

        var pie = d3.pie()
                    .value(function(d) { return d.value; });

        var arc = d3.arc()
                    .outerRadius(radius - 10)
                    .innerRadius(0);

        var arcs = svg.selectAll(".arc")
                      .data(pie(pieData))
                      .enter().append("g")
                      .attr("class", "arc");

        arcs.append("path")
            .attr("d", arc)
            .attr("fill", function(d) { return color(d.data.label); })
            .style("stroke", "black")
            .style("stroke-width", "2px")
            .on("click", function(event, d) {
                var target = d3.select(this);
                var isSelected = target.classed("exploded");
                var dgre = (d.endAngle - d.startAngle) / 2 + d.startAngle;
                var dis = width / ((width + 40) / 20); // distance
                var x = Math.sin(dgre) * dis;
                var y = -Math.cos(dgre) * dis;

                if (!isSelected) {
                    target.transition()
                        .duration(700)
                        .attr("transform", "translate(" + x + ", " + y + ")")
                        .ease(d3.easeBounce); 
                    target.classed("exploded", true);
                    document.getElementById("viz-description").innerHTML = descriptions[d.data.label];
                    document.getElementById("viz-title").textContent = titles[d.data.label];
                } else {
                    target.transition()
                        .duration(400)
                        .attr("transform", "translate(0,0)");
                    target.classed("exploded", false);
                    document.getElementById("viz-description").innerHTML = originalDescription; // Reset to the original description
                    document.getElementById("viz-title").textContent = originalTitle; // Reset to the original title
                }

                // Toggle tooltip
                if (!isSelected) {
                    tooltip.html(`Category: ${d.data.label}<br/>Percentage: ${d.data.value}%`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px")
                        .style("opacity", 1);
                } else {
                    tooltip.style("opacity", 0);
                }
            });
    }).catch(function(error) {
        console.error('Error loading the CSV file: ', error);
    });
}

window.onload = init;
