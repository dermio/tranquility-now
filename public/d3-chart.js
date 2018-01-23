/********** drawChart function **********/
function drawChart() {
  /***** Chart dimensions *****/
  // SVG chart will have width & length of parent container element
  let containWidth = parseInt(d3.select(".chart-container").style("width"));
  let containHeight = parseInt(d3.select(".chart-container").style("height"));

  /* Optional: Can set the width and height based on the aspect ratio
  For example: 4:3 ratio, or the height is 75% the length of the width
  let containWidth = // some number;
  let containHeight = containWidth * 0.75;
  */

  let margin = {top: 20, right: 20, bottom: 40, left: 40};
  let width = containWidth //- margin.left - margin.right;
  let height = containHeight //- margin.top - margin.bottom;

  console.log(containWidth, containHeight);

  /***** X-scale and Y-scale *****/
  let xScale = d3.scaleBand()
                //.domain(["pre-HR", "post-HR"])
                .domain(stressArr.map(d => d.typeHR))
                .range([margin.right + margin.left, width - margin.left])
                .padding(.2); // padding between the discreet bands

  let greaterHR = stressArr.map(d => d.heartRate);
  let scaledGreaterHR = d3.max(greaterHR) * 1.1;

  let yScale = d3.scaleLinear()
                .domain([0, scaledGreaterHR])
                .range([height - margin.bottom - margin.top, margin.top]);

  /***** X-axis and Y-axis *****/
  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale);

  /***** append SVG *****/
  let chart = d3.select(".chart-container")
              .append("svg")
                .attr("class", "chart")
                .attr("width", width)
                .attr("height", height);

  /***** append outermost <g> element *****/
  let outerG = chart.append("g")
            //.attr("transform", `translate(${margin.left}, ${margin.top})`)
            //.attr("transform", `translate(0, ${height - margin.bottom})`)
            .attr("class", "parent-Group");

  /* append group for X-axis */
  outerG.append("g")
    .attr("class", "x-axis")
    // Jack M. code line 64 WORKS, differs from Bostock's code
    .attr("transform", `translate(0, ${height - margin.bottom - margin.top})`) //*Jack
    //.call(d3.axisBottom(xScale));
    .call(xAxis); // same as line above, from line 44

  /* append group for Y-axis */
  outerG.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left + margin.right}, 0)`)
    //.call(d3.axisLeft(yScale));
    .call(yAxis); // same as line above, from line 45


  // Append text to X-axis
  outerG.append("text")
    .attr("transform",
      `translate(${width / 2}, ${height * 0.95})`) //EJL
    .style("text-anchor", "middle")
    .attr("class", "x-axis-label")
    .text("heart rates before and after relaxation activity")

  // Append text to Y-Axis
  outerG.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", width * .01)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("class", "y-axis-label")
    .text("beats per minute");

  // Append the rectangles for the bar chart
  outerG.selectAll(".bar")
        .data(stressArr)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.typeHR))
        .attr("width", xScale.bandwidth())
        .attr("y", d => yScale(d.heartRate))
        .attr("height", d => {
          return height - yScale(d.heartRate) - margin.bottom - margin.top;
        });

  // Add heart rate label to the top of each rectangle bar
  outerG.selectAll(".heart-val")
      .data(stressArr)
    .enter().append("text")
      .attr("class", "heart-val")
      .attr("x", function (d) {
        //return xScale(d.typeHR);
        return xScale(d.typeHR) + xScale.bandwidth() / 2;
      })
      .attr("y", d => yScale(d.heartRate))
      .attr("dy", "1em")
      .text(d => d.heartRate)
      .attr("fill", "white")
      .attr("text-anchor", "middle");

}



/********** resizeChart function **********/
function resizeChart() {
  /***** Chart dimensions *****/
  // SVG chart will have width & length of parent container element
  let containWidth = parseInt(d3.select(".chart-container").style("width"));
  let containHeight = parseInt(d3.select(".chart-container").style("height"));

  /* Optional: Can set the width and height based on the aspect ratio
  For example: 4:3 ratio, or the height is 75% the length of the width
  let containWidth = // some number;
  let containHeight = containWidth * 0.75;
  */

  let margin = {top: 20, right: 20, bottom: 40, left: 40};
  let width = containWidth //- margin.left - margin.right;
  let height = containHeight //- margin.top - margin.bottom;

  console.log(containWidth, containHeight);

  /* Using the parent container dimensions, re-draw the SVG.CHART */
  d3.select(".chart")
    .attr("width", width)
    .attr("height", height);


  /***** X-scale and Y-scale, Update the X & Y range scale *****/
  let xScale = d3.scaleBand()
                //.domain(["pre-HR", "post-HR"])
                .domain(stressArr.map(d => d.typeHR))
                .range([margin.right + margin.left, width - margin.left])
                //.range([0, width])
                .padding(.2); // padding between the discreet bands

  let greaterHR = stressArr.map(d => d.heartRate);
  let scaledGreaterHR = d3.max(greaterHR) * 1.1;

  let yScale = d3.scaleLinear()
    .domain([0, scaledGreaterHR])
    .range([height - margin.bottom - margin.top, margin.top]);


  /***** X-axis and Y-axis *****/
  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale);


  /* Update X axis with resized scale */
  d3.select(".x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom - margin.top})`) // Jack**
    //.call(d3.axisBottom(xScale));
    .call(xAxis); // same as line above, from line 161


  /* Update Y axis with resized scale */
  d3.select(".y-axis")
    .attr("transform", `translate(${margin.left + margin.right}, 0)`)
    //.call(d3.axisLeft(yScale));
    .call(yAxis); // same as line above, from line 162


  // Update text to X-axis
  d3.select(".x-axis-label")
    .attr("transform",
      `translate(${width / 2}, ${height * 0.95})`) //EJL


  // Update text to Y-Axis
  d3.select(".y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", width * .01)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("beats per minute");


  // Re-draw the rectangles for the bar chart
  d3.selectAll(".bar")
    .attr("x", d => xScale(d.typeHR))
    .attr("width", xScale.bandwidth())
    .attr("y", d => yScale(d.heartRate))
    .attr("height", d => {
      return height - yScale(d.heartRate) - margin.bottom - margin.top;
    });

  // Re-render the heart label at the top of each bar rectangle
  d3.selectAll(".heart-val")
    .attr("x", function (d) {
      //return xScale(d.typeHR);
      return xScale(d.typeHR) + xScale.bandwidth() / 2;
    })
    .attr("y", d => yScale(d.heartRate))
    .attr("dy", "1em")
    .text(d => d.heartRate)
    .attr("fill", "white")
    .attr("text-anchor", "middle");

}
