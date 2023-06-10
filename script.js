
    // Set up the dimensions for the heat map
    const margin = { top: 50, right: 50, bottom: 100, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create the SVG container for the heat map
    const svg = d3.select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Create x-axis
    const xScale = d3.scaleLinear()
      .domain([0, 10]) // Adjust the domain based on your data
      .range([0, width]);

    const xAxis = d3.axisBottom(xScale);

    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    // Create y-axis
    const yScale = d3.scaleLinear()
      .domain([0, 5]) // Adjust the domain based on your data
      .range([height, 0]);

    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("id", "y-axis")
      .call(yAxis);
 
