function init() {
    // Define margins and dimensions for the chart
    const margin = { top: 70, right: 30, bottom: 40, left: 35 };
    var w = 700 - margin.left - margin.right; // Width of the chart area
    var h = 600 - margin.top - margin.bottom; // Height of the chart area
    var padding = 50;

    var dataset, xScale, yScale, xAxis, yAxis, svg, pieSvg, selectedSegment = null;

    var formatTime = d3.timeFormat("%Y"); // Format for displaying years on the axis

    // Create tooltips for the line and pie charts
    const tooltip = d3.select("body").append("div").attr("class", "tooltip");
    const pieTooltip = d3.select("body").append("div").attr("class", "pie-tooltip");

    // Load the CSV data
    d3.csv("resources/dataset/aihw/viz1dataset.csv", function (d) {
        return {
            year: new Date(d.year, 0, 1), // Parse year into date object
            year2: +d.year, // Year as a number
            deaths: +d.totalDeaths, // Total number of deaths
            avoidableDeaths: +d.avoidableDeaths, // Number of avoidable deaths
            unavoidableDeaths: +d.unavoidableDeaths, // Number of unavoidable deaths
            avoidablePercentage: +d.avoidablePercentage, // Percentage of avoidable deaths
            unavoidablePercentage: +d.unavoidablePercentage, // Percentage of unavoidable deaths
            cardiovascularPercentage: d.cardiovascularPercentage ? +d.cardiovascularPercentage : 0, // Percentage of cardiovascular deaths
            cancerPercentage: d.cancerPercentage ? +d.cancerPercentage : 0, // Percentage of cancer deaths
            respiratoryPercentage: d.respiratoryPercentage ? +d.respiratoryPercentage : 0, // Percentage of respiratory deaths
            infectiousPercentage: d.infectiousPercentage ? +d.infectiousPercentage : 0, // Percentage of infectious deaths
            injuryPercentage: d.injuryPercentage ? +d.injuryPercentage : 0, // Percentage of injury deaths
            otherPercentage: d.otherPercentage ? +d.otherPercentage : 0 // Percentage of other deaths
        };
    }).then(function (data) {
        dataset = data; // Store the loaded data

        // Define scales for the x and y axes
        xScale = d3.scaleTime()
            .domain([d3.min(dataset, d => d.year), d3.max(dataset, d => d.year)]) // Scale based on the years
            .range([padding, w]);

        yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.deaths)]) // Scale based on the total number of deaths
            .range([h - padding, 0]);

        // Define the x and y axes
        xAxis = d3.axisBottom().scale(xScale).ticks(10).tickFormat(formatTime);
        yAxis = d3.axisLeft().scale(yScale);

        // Define area generator function to create areas under the lines
        var areaGenerator = (dataField) => d3.area()
            .defined(d => d[dataField] >= 0) // Ensure data is valid
            .x(d => xScale(d.year)) // X position based on the year
            .y0(yScale(0)) // Y position for the baseline
            .y1(d => yScale(d[dataField])); // Y position based on the data field value

        // Define line generator function to create lines for the data
        var lineGenerator = (dataField) => d3.line()
            .defined(d => d[dataField] >= 0) // Ensure data is valid
            .x(d => xScale(d.year)) // X position based on the year
            .y(d => yScale(d[dataField])); // Y position based on the data field value

        // Create SVG element for the area chart
        svg = d3.select("#line-chart").append("svg")
            .attr("width", w + margin.left + margin.right) // Width of the SVG element
            .attr("height", h + margin.top + margin.bottom) // Height of the SVG element
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // Positioning the group element

        // Function to create areas with animation
        const createAreaWithAnimation = (data, className, color) => {
            const path = svg.append("path")
                .datum(dataset) // Bind data to the path element
                .attr("class", className) // Set the class for styling
                .attr("fill", color) // Fill color for the area
                .attr("opacity", 0.3) // Opacity of the area
                .attr("d", areaGenerator(data)); // Create the area

            const totalLength = path.node().getTotalLength(); // Get the total length of the path

            path.attr("stroke-dasharray", totalLength + " " + totalLength) // Create dash array for animation
                .attr("stroke-dashoffset", totalLength) // Offset to start animation from
                .transition() // Start transition
                .duration(3000) // Duration of the animation
                .ease(d3.easeLinear) // Ease function for smooth animation
                .attr("stroke-dashoffset", 0); // Final state of the animation

            return path;
        };

        // Function to create lines with animation
        const createLineWithAnimation = (data, className, color) => {
            const path = svg.append("path")
                .datum(dataset) // Bind data to the path element
                .attr("class", className) // Set the class for styling
                .attr("fill", "none") // No fill for the line
                .attr("stroke", color) // Stroke color for the line
                .attr("stroke-width", 5) // Stroke width for the line
                .attr("d", lineGenerator(data)); // Create the line

            const totalLength = path.node().getTotalLength(); // Get the total length of the path

            path.attr("stroke-dasharray", totalLength + " " + totalLength) // Create dash array for animation
                .attr("stroke-dashoffset", totalLength) // Offset to start animation from
                .transition() // Start transition
                .duration(3000) // Duration of the animation
                .ease(d3.easeLinear) // Ease function for smooth animation
                .attr("stroke-dashoffset", 0); // Final state of the animation

            return path;
        };

        // Create areas and lines with animations
        createAreaWithAnimation('deaths', 'area', '#648FFF'); // Blue area and line for total deaths
        createLineWithAnimation('deaths', 'line', '#648FFF');
        createAreaWithAnimation('avoidableDeaths', 'area2', '#785EF0'); // Purple area and line for avoidable deaths
        createLineWithAnimation('avoidableDeaths', 'line2', '#785EF0');
        createAreaWithAnimation('unavoidableDeaths', 'area3', '#DC267F'); // Red area and line for unavoidable deaths
        createLineWithAnimation('unavoidableDeaths', 'line3', '#DC267F');

        // Create the x-axis
        svg.append("g")
            .attr("class", "axis") // Set the class for styling
            .attr("transform", "translate(0," + (h - padding) + ")") // Position the x-axis
            .call(xAxis) // Call the xAxis function to create the axis
            .selectAll("text")
            .style("font-size", "14px"); // Style the axis labels

        // Create the y-axis
        svg.append("g")
            .attr("class", "axis") // Set the class for styling
            .attr("transform", "translate(" + padding + ",0)") // Position the y-axis
            .call(yAxis) // Call the yAxis function to create the axis
            .selectAll("text")
            .style("font-size", "14px"); // Style the axis labels

        // Function to add circles and mouse events for each area
        function addCirclesAndEvents(areaClass, dataField, color, delay = 3000) {
            const circles = svg.selectAll(`.${areaClass}-circle`)
                .data(dataset) // Bind data to the circles
                .enter()
                .append("circle")
                .attr("class", `${areaClass}-circle`) // Set the class for styling
                .attr("cx", d => xScale(d.year)) // X position based on the year
                .attr("cy", d => yScale(d[dataField])) // Y position based on the data field value
                .attr("r", 0)  // Start with radius 0 for animation
                .attr("fill", color) // Fill color for the circles
                .on("click", function (event, d) {
                    // Deselect any previously selected circles
                    d3.selectAll(".selected-circle").classed("selected-circle", false).attr("r", 3).style("stroke", "none");

                    // Highlight the selected circle
                    d3.selectAll(`.${areaClass}-circle`).filter(circleData => circleData.year.getTime() === d.year.getTime())
                        .classed("selected-circle", true)
                        .attr("r", 8)
                        .style("stroke", "black")
                        .style("stroke-width", 2);

                    // Show tooltip with detailed information
                    tooltip.style("display", "block")
                        .style("left", `${event.pageX - tooltip.node().offsetWidth - 10}px`)
                        .style("top", `${event.pageY - 28}px`)
                        .html(
                            `<strong>Year:</strong> ${formatTime(d.year)}<br><strong>${dataField}:</strong> ${d[dataField] !== undefined ? d[dataField].toFixed(0) : "N/A"}`
                        );

                    // Show a vertical line to indicate the selected year
                    verticalLine.attr("x1", xScale(d.year))
                        .attr("x2", xScale(d.year))
                        .attr("opacity", 1);

                    // Update the pie chart with data from the selected year
                    updatePieChart(d);
                })
                .on("mouseover", function () {
                    tooltip.style("display", "block"); // Show tooltip on mouseover
                })
                .on("mouseout", function () {
                    tooltip.style("display", "none"); // Hide tooltip on mouseout
                });

            // Animate the circles
            circles.transition()
                .duration(1000) // Duration of the circle animation
                .delay(delay)  // Delay until the area animation finishes
                .attr("r", 3); // Final radius of the circles
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
                const [xCoord] = d3.pointer(event, this); // Get x-coordinate of the click
                const bisectDate = d3.bisector((d) => d.year).left; // Bisector function to find the nearest data point
                const x0 = xScale.invert(xCoord); // Invert the x-coordinate to get the corresponding year
                const i = bisectDate(data, x0, 1); // Find the index of the closest data point
                const d0 = data[i - 1];
                const d1 = data[i];
                const d = x0 - d0.year > d1.year - x0 ? d1 : d0; // Determine the closest data point
                const xPos = xScale(d.year);

                verticalLine.attr("x1", xPos)
                    .attr("x2", xPos)
                    .attr("opacity", 1);

                // Highlight selected circles
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

        // Add X-axis label
        svg.append("text")
            .attr("transform", "translate(" + (w / 2) + " ," + (h + margin.bottom - 20) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "22px")
            .style("fill", "#777")
            .style("font-family", "sans-serif")
            .text("Year");

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
            .attr("transform", "translate(200,200)"); // Centering the pie chart within the container

        // Initialize pie chart with default state
        updatePieChart();

        // Reset tooltips button functionality
        d3.select(".reset-tooltips").on("click", function () {
            resetToDefaultState();
        });
    });

    // Function to update the pie chart with new data
    function updatePieChart(data) {
    // Prepare pie data based on the provided data or default to zeros if no data is provided
    const pieData = data ? [
        { label: "Cardiovascular", value: data.cardiovascularPercentage, description: "Cardiovascular deaths refer to fatalities caused by diseases of the heart and blood vessels, including heart attacks, strokes, and other heart-related conditions. These are often linked to risk factors such as high blood pressure, high cholesterol, smoking, obesity, and lack of physical activity." },
        { label: "Cancer", value: data.cancerPercentage, description: "Cancer deaths result from the uncontrolled growth and spread of abnormal cells in the body, which can occur in various organs and tissues. Common types of cancer leading to death include lung, breast, colorectal, and prostate cancer, with risk factors including genetics, lifestyle choices, and environmental exposures." },
        { label: "Respiratory", value: data.respiratoryPercentage, description: "Respiratory deaths are caused by diseases affecting the lungs and respiratory system, such as chronic obstructive pulmonary disease (COPD), pneumonia, asthma, and lung infections. These conditions can be exacerbated by smoking, air pollution, occupational hazards, and chronic respiratory infections." },
        { label: "Infectious", value: data.infectiousPercentage, description: "Infectious deaths occur due to diseases caused by pathogenic microorganisms such as bacteria, viruses, fungi, or parasites. Examples include tuberculosis, HIV/AIDS, malaria, and influenza. These deaths can be influenced by factors like lack of access to healthcare, poor sanitation, and inadequate vaccination coverage." },
        { label: "Injury", value: data.injuryPercentage, description: "Injury deaths are the result of physical harm caused by accidents, violence, or self-inflicted harm. This category includes fatalities from road traffic accidents, falls, drowning, occupational injuries, and homicides. Preventive measures, safety regulations, and public awareness can significantly reduce the incidence of these deaths." },
        { label: "Other", value: data.otherPercentage, description: "Other deaths encompass a broad range of causes that do not fall under the previously mentioned categories. These can include deaths from neurological disorders, digestive diseases, endocrine disorders, congenital anomalies, and other miscellaneous conditions. The specific causes and contributing factors can vary widely within this category." }
    ] : [
        { label: "Cardiovascular", value: 0, description: "" },
        { label: "Cancer", value: 0, description: "" },
        { label: "Respiratory", value: 0, description: "" },
        { label: "Infectious", value: 0, description: "" },
        { label: "Injury", value: 0, description: "" },
        { label: "Other", value: 0, description: "" }
    ];

    // Define a color scale for the pie chart segments
    const colorScale = d3.scaleOrdinal()
        .domain(pieData.map(d => d.label))
        .range(["#648FFF", "#785EF0", "#DC267F", "#FE6100", "#FFB000", "#00D200"]);

    // Define a pie generator
    const pie = d3.pie().value(d => d.value).sort(null);

    // Define arcs for the pie chart with inner and outer radius
    const arc = d3.arc()
        .innerRadius(100) // Inner radius for the doughnut chart
        .outerRadius(150)
        .padAngle(0.01) // Padding between segments
        .cornerRadius(5); // Rounded corners for the segments

    // Define expanded arcs for when a segment is clicked
    const expandedArc = d3.arc()
        .innerRadius(100)
        .outerRadius(180)
        .padAngle(0.01)
        .cornerRadius(5);

    // Bind data to the pie chart segments
    const arcs = pieSvg.selectAll(".arc")
        .data(pie(pieData), d => d.data.label);

    // Enter new segments
    arcs.enter().append("path")
        .attr("class", "arc")
        .attr("fill", d => colorScale(d.data.label))
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .each(function(d) { this._current = { startAngle: 0, endAngle: 0 }; }) // Store initial angles for transition
        .on("click", function(event, d) {
            const isSelected = d3.select(this).classed("exploded");

            // Collapse any previously expanded segment
            if (selectedSegment && selectedSegment !== this) {
                d3.select(selectedSegment)
                    .transition()
                    .duration(400)
                    .attr("d", arc(d3.select(selectedSegment).data()[0]));
                d3.select(selectedSegment).classed("exploded", false);
            }

            if (isSelected) {
                resetInfoBoxes(); // Reset info boxes if segment is deselected
            } else {
                d3.selectAll(".info-box.type-of-death").text(d.data.label);
                d3.selectAll(".info-box.death-percentage").text(`${d.data.value.toFixed(1)}%`);
                d3.selectAll(".info-box.death-description").text(d.data.description);
            }

            // Toggle expansion of the clicked segment
            if (!isSelected) {
                d3.select(this)
                    .transition()
                    .duration(700)
                    .attr("d", expandedArc(d)) // Expand the clicked segment
                    .ease(d3.easeBounce);
                d3.select(this).classed("exploded", true);
                selectedSegment = this;
            } else {
                d3.select(this)
                    .transition()
                    .duration(400)
                    .attr("d", arc(d));
                d3.select(this).classed("exploded", false);
                selectedSegment = null;
            }
        })
        .merge(arcs) // Update existing segments
        .transition()
        .duration(1000)
        .attrTween("d", function(d) {
            const interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return t => arc(interpolate(t));
        });

    // Remove exiting segments
    arcs.exit()
        .transition()
        .duration(1000)
        .attrTween("d", function(d) {
            const interpolate = d3.interpolate(d, { startAngle: 0, endAngle: 0 });
            return t => arc(interpolate(t));
        })
        .remove();

    // Add "year" text in the center of the pie chart
    pieSvg.selectAll(".year").remove(); // Remove any existing text
    const textGroup = pieSvg.append("g")
        .attr("class", "year")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("font-size", "16px")
        .style("fill", "#FFF");

    textGroup.append("text")
        .attr("class", "year-label")
        .attr("y", -10)
        .text("Year");

    textGroup.append("text")
        .attr("class", "year-number")
        .attr("y", 10)
        .style("font-weight", "bold")
        .style("font-size", "20px")
        .text(data ? `${data.year2}` : ""); // Display the selected year in the center
    }


    // Function to reset to default state
    function resetToDefaultState() {
        d3.selectAll(".selected-circle").classed("selected-circle", false).attr("r", 3).style("stroke", "none");
        d3.select(".hover-line").attr("opacity", 0);
        tooltip.style("display", "none");
        pieTooltip.style("display", "none");
        resetInfoBoxes();
        updatePieChart(); // Reset the pie chart to its default state
    }
    
    // Function to reset info boxes
    function resetInfoBoxes() {
        d3.selectAll(".info-box.type-of-death").text("Death Cause");
        d3.selectAll(".info-box.death-percentage").text("Death Proportion Percentage");
        d3.selectAll(".info-box.death-description").text("Description");
    }
}

// Call init() function to display charts on window load
window.onload = init;
