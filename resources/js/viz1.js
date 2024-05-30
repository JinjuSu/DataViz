function init() {
    const margin = { top: 70, right: 30, bottom: 40, left: 35 };
    var w = 700 - margin.left - margin.right;
    var h = 600 - margin.top - margin.bottom;
    var padding = 50;

    var dataset, xScale, yScale, xAxis, yAxis, svg, pieSvg;

    var formatTime = d3.timeFormat("%Y");

    const tooltip = d3.select("body").append("div").attr("class", "tooltip");

    // Import csv file from the Relative Path
    d3.csv("resources/dataset/aihw/viz1dataset.csv", function (d) {
        return {
            year: new Date(d.year, 0, 1),
            deaths: +d.totalDeaths,
            avoidableDeaths: +d.avoidableDeaths,
            unavoidableDeaths: +d.unavoidableDeaths,
            avoidablePercentage: +d.avoidablePercentage,
            unavoidablePercentage: +d.unavoidablePercentage,
            cardiovascularPercentage: d.cardiovascularPercentage ? +d.cardiovascularPercentage : 0,
            cancerPercentage: d.cancerPercentage ? +d.cancerPercentage : 0,
            respiratoryPercentage: d.respiratoryPercentage ? +d.respiratoryPercentage : 0,
            infectiousPercentage: d.infectiousPercentage ? +d.infectiousPercentage : 0,
            injuryPercentage: d.injuryPercentage ? +d.injuryPercentage : 0,
            otherPercentage: d.otherPercentage ? +d.otherPercentage : 0
        };
    }).then(function (data) {
        dataset = data;
        console.table(dataset, ["year", "deaths", "avoidableDeaths", "unavoidableDeaths", "avoidablePercentage", "unavoidablePercentage"]);

        xScale = d3.scaleTime()
            .domain([d3.min(dataset, d => d.year), d3.max(dataset, d => d.year)])
            .range([padding, w]);

        yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.deaths)])
            .range([h - padding, 0]);

        //Define axes
        xAxis = d3.axisBottom().scale(xScale).ticks(10).tickFormat(formatTime);
        yAxis = d3.axisLeft().scale(yScale);

        //Define area generators
        var areaGenerator = (dataField) => d3.area()
            .defined(d => d[dataField] >= 0)
            .x(d => xScale(d.year))
            .y0(yScale(0))
            .y1(d => yScale(d[dataField]));

        //Define line generators
        var lineGenerator = (dataField) => d3.line()
            .defined(d => d[dataField] >= 0)
            .x(d => xScale(d.year))
            .y(d => yScale(d[dataField]));

        //Create SVG element for area chart
        svg = d3.select("#line-chart").append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Create the areas with animation
        const createAreaWithAnimation = (data, className, color) => {
            const path = svg.append("path")
                .datum(dataset)
                .attr("class", className)
                .attr("fill", color)
                .attr("opacity", 0.3)
                .attr("d", areaGenerator(data));

            const totalLength = path.node().getTotalLength();

            path.attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(3000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);

            return path;
        };

        // Create the lines with animation
        const createLineWithAnimation = (data, className, color) => {
            const path = svg.append("path")
                .datum(dataset)
                .attr("class", className)
                .attr("fill", "none")
                .attr("stroke", color)
                .attr("stroke-width", 5)
                .attr("d", lineGenerator(data));

            const totalLength = path.node().getTotalLength();

            path.attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(3000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);

            return path;
        };

        createAreaWithAnimation('deaths', 'area', '#648FFF');
        createLineWithAnimation('deaths', 'line', '#648FFF');
        createAreaWithAnimation('avoidableDeaths', 'area2', '#785EF0');
        createLineWithAnimation('avoidableDeaths', 'line2', '#785EF0');
        createAreaWithAnimation('unavoidableDeaths', 'area3', '#DC267F');
        createLineWithAnimation('unavoidableDeaths', 'line3', '#DC267F');

        //Create axes
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis)
            .selectAll("text")
            .style("font-size", "14px");

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis)
            .selectAll("text")
            .style("font-size", "14px");

        // Function to add circles and mouse events for each area
        function addCirclesAndEvents(areaClass, dataField, color, delay = 3000) {
            const circles = svg.selectAll(`.${areaClass}-circle`)
                .data(dataset)
                .enter()
                .append("circle")
                .attr("class", `${areaClass}-circle`)
                .attr("cx", d => xScale(d.year))
                .attr("cy", d => yScale(d[dataField]))
                .attr("r", 0)  // Start with radius 0
                .attr("fill", color)
                .on("click", function (event, d) {
                    d3.selectAll(".selected-circle").classed("selected-circle", false).attr("r", 3).style("stroke", "none");

                    d3.selectAll(`.${areaClass}-circle`).filter(circleData => circleData.year.getTime() === d.year.getTime())
                        .classed("selected-circle", true)
                        .attr("r", 8)
                        .style("stroke", "black")
                        .style("stroke-width", 2);

                    tooltip.style("display", "block")
                        .style("left", `${event.pageX - tooltip.node().offsetWidth - 10}px`)
                        .style("top", `${event.pageY - 28}px`)
                        .html(
                            `<strong>Year:</strong> ${formatTime(d.year)}<br><strong>${dataField}:</strong> ${d[dataField] !== undefined ? d[dataField].toFixed(0) : "N/A"}`
                        );

                    verticalLine.attr("x1", xScale(d.year))
                        .attr("x2", xScale(d.year))
                        .attr("opacity", 1);

                    updatePieChart(d);
                })
                .on("mouseover", function () {
                    tooltip.style("display", "block");
                })
                .on("mouseout", function () {
                    tooltip.style("display", "none");
                });

            // Animate the circles
            circles.transition()
                .duration(1000)
                .delay(delay)  // Delay until the area animation finishes
                .attr("r", 3);
        }

        // Add circles and mouse events for each area
        addCirclesAndEvents("deaths", "deaths", "#648FFF");
        addCirclesAndEvents("unavoidable", "unavoidableDeaths", "#785EF0");
        addCirclesAndEvents("avoidable", "avoidableDeaths", "#DC267F");

        // Add a vertical line for click effect
        const verticalLine = svg.append("line")
            .attr("class", "hover-line")
            .attr("y1", 0)
            .attr("y2", h - padding)
            .attr("stroke", "white")
            .attr("stroke-width", 4)
            .attr("opacity", 0)
            .attr("pointer-events", "none")
            .style("transition", "opacity 1s ease");

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

                verticalLine.attr("x1", xPos)
                    .attr("x2", xPos)
                    .attr("opacity", 1);

                d3.selectAll(".selected-circle").classed("selected-circle", false).attr("r", 3).style("stroke", "none");

                d3.selectAll(".deaths-circle").filter(circleData => circleData.year.getTime() === d.year.getTime())
                    .classed("selected-circle", true)
                    .attr("r", 8)
                    .style("stroke", "black")
                    .style("stroke-width", 2);

                d3.selectAll(".avoidable-circle").filter(circleData => circleData.year.getTime() === d.year.getTime())
                    .classed("selected-circle", true)
                    .attr("r", 8)
                    .style("stroke", "black")
                    .style("stroke-width", 2);

                d3.selectAll(".unavoidable-circle").filter(circleData => circleData.year.getTime() === d.year.getTime())
                    .classed("selected-circle", true)
                    .attr("r", 8)
                    .style("stroke", "black")
                    .style("stroke-width", 2);

                tooltip.style("display", "block")
                    .style("left", `${event.pageX - tooltip.node().offsetWidth - 10}px`)
                    .style("top", `${event.pageY - 28}px`)
                    .html(
                        `<strong>Year:</strong> ${formatTime(d.year)}<br><strong>Total Deaths:</strong> ${d.deaths !== undefined ? d.deaths.toFixed(0) : "N/A"}<br><strong>Avoidable Deaths:</strong> ${d.avoidableDeaths !== undefined ? d.avoidableDeaths.toFixed(0) : "N/A"}<br><strong>Unavoidable Deaths:</strong> ${d.unavoidableDeaths !== undefined ? d.unavoidableDeaths.toFixed(0) : "N/A"}`
                    );

                updatePieChart(d);
            });

        // Add Y-axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - h / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "22px")
            .style("fill", "#777")
            .style("font-family", "sans-serif")
            .text("Total Deaths");

        // Create SVG element for pie chart
        pieSvg = d3.select("#pie-chart").append("svg")
            .attr("width", 400)
            .attr("height", 400)
            .append("g")
            .attr("transform", "translate(200,200)");

        // Initialize pie chart with the latest year's data
        updatePieChart(dataset[dataset.length - 1]);
    });

    function updatePieChart(data) {
        const pieData = [
            { label: "Cardiovascular", value: data.cardiovascularPercentage },
            { label: "Cancer", value: data.cancerPercentage },
            { label: "Respiratory", value: data.respiratoryPercentage },
            { label: "Infectious", value: data.infectiousPercentage },
            { label: "Injury", value: data.injuryPercentage },
            { label: "Other", value: data.otherPercentage }
        ];

        const colorScale = d3.scaleOrdinal()
            .domain(pieData.map(d => d.label))
            .range(["#648FFF", "#785EF0", "#DC267F", "#FE6100", "#FFB000", "#00D200"]);

        const pie = d3.pie().value(d => d.value).sort(null);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(150)
            .padAngle(0.01)
            .cornerRadius(5);

        const arcs = pieSvg.selectAll(".arc")
            .data(pie(pieData));

        arcs.enter().append("path")
            .attr("class", "arc")
            .attr("d", arc)
            .attr("fill", d => colorScale(d.data.label))
            .style("stroke", "black")
            .style("stroke-width", "2px")
            .merge(arcs)
            .transition()
            .duration(1000)
            .attrTween("d", function (d) {
                const i = d3.interpolate(this._current || d, d);
                this._current = i(0);
                return t => arc(i(t));
            });

        arcs.exit().remove();

        // Add text labels to pie slices
        const text = pieSvg.selectAll("text")
            .data(pie(pieData));

        text.enter().append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .style("fill", "#FFF")
            .style("font-size", "12px")
            .merge(text)
            .transition()
            .duration(1000)
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .text(d => `${d.data.value.toFixed(1)}%`);

        text.exit().remove();
    }
}

// call init() function to display charts on window
window.onload = init;
