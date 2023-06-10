// Fetch the dataset
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then(response => response.json())
  .then(data => {
    // Constants
    const dataset = data.monthlyVariance;
    const baseTemperature = data.baseTemperature;
    const width = 1200;
    const height = 400;
    const padding = 60;

    // Create SVG
    const svg = d3.select("#heatmap")
      .attr("width", width + padding * 2)
      .attr("height", height + padding * 2)
      .append("g")
      .attr("transform", "translate(" + padding + "," + padding + ")");

    // Tooltip
    const tooltip = d3.select("#tooltip");

    // Color scale
    const colors = ["#313695", "#4575b4", "#74add1", "#abd9e9", "#e0f3f8", "#ffffbf", "#fee090", "#fdae61", "#f46d43", "#d73027", "#a50026"];
    const colorScale = d3.scaleQuantile()
      .domain(d3.extent(dataset, d => baseTemperature + d.variance))
      .range(colors);

    // Scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(dataset, d => d.year))
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(d3.range(12))
      .range([0, height])
      .paddingInner(0.05);

    // Axes
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.format("d"))
      .tickSizeOuter(0);

    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d => {
        const date = new Date(0);
        date.setUTCMonth(d);
        return d3.timeFormat("%B")(date);
      });

    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("id", "y-axis")
      .call(yAxis);

      
    // Heatmap cells
    svg.selectAll(".cell")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("data-month", d => d.month - 1)
      .attr("data-year", d => d.year)
      .attr("data-temp", d => baseTemperature + d.variance)
      .attr("x", d => xScale(d.year))
      .attr("y", d => yScale(d.month - 1))
      .attr("width", width / (d3.max(dataset, d => d.year) - d3.min(dataset, d => d.year)))
      .attr("height", yScale.bandwidth())
      .attr("fill", d => colorScale(baseTemperature + d.variance))
      .on("mouseover", (event, d) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip.html(`${d.year} - ${d3.timeFormat("%B")(new Date(0, d.month - 1))}<br>${(baseTemperature + d.variance).toFixed(2)}°C<br>${d.variance.toFixed(2)}°C`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
          .attr("data-year", d.year);
      })
      .on("mouseout", () => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // Legend
const legendColors = colors.slice(0, colors.length - 1);
const legendCellWidth = 30;

const legend = d3.select("#legend")
  .attr("width", legendCellWidth * legendColors.length)
  .attr("height", 70);

legend.selectAll(".legend-cell")
  .data(legendColors)
  .enter()
  .append("rect")
  .attr("class", "legend-cell")
  .attr("x", (d, i) => i * (legendCellWidth + 10))
  .attr("y", 20)
  .attr("width", legendCellWidth)
  .attr("height", 20)
  .attr("fill", d => d);

legend.append("text")
  .attr("class", "legend-title")
  .attr("x", 0)
  .attr("y", 35)
  .text("Temperature Variance (°C)");

legend.append("text")
  .attr("class", "legend-text")
  .attr("x", 0)
  .attr("y", 60)
  .text(d3.min(dataset, d => (baseTemperature + d.variance).toFixed(2)));

legend.append("text")
  .attr("class", "legend-text")
  .attr("x", legendCellWidth * legendColors.length - 30)
  .attr("y", 60)
  .text(d3.max(dataset, d => (baseTemperature + d.variance).toFixed(2)));
});
