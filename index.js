//get data
d3
  .json(
    "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  )
  .then(function(data) {
    calculations(data.baseTemperature, data.monthlyVariance);
  });

var xScale;
var yScale;
var margin = { top: 60, right: 60, bottom: 90, left: 90 };
var chartWidth = 1100 - margin.left - margin.right;
var chartHeight = 700 - margin.top - margin.bottom;

function calculations(a, b) {
  var temp = 0;
  var baseTemp = a;
  var dataset = b;

  function calculateTemp(variance) {
    return baseTemp + variance;
  }

  function calculateMonth(d) {
    return d.month - 1;
  }

  dataset.map(function(d) {
    d.temperature = calculateTemp(d.variance);
    d.month = calculateMonth(d);
  });
  getD3Elements(dataset);
}

function getD3Elements(dataset) {
  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("height", chartHeight + margin.left + margin.right)
    .attr("width", chartWidth + margin.bottom + margin.top)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var colors = [
    "#5749f1",
    "#1a8cdf",
    "#2ee9ee",
    "#81f453",
    "#CBF22C",
    "#F2CE2C",
    "#e99f1f",
    "#f68712",
    "#be4a25",
    "#e7341c",
    "#5e011a"
  ];

  var zScale = d3
    .scaleQuantile()
    .domain(
      d3.extent(dataset, function(d) {
        return d.temperature;
      })
    )
    .range(colors);

  xScale = d3
    .scaleTime()
    .domain([
      d3.min(dataset, function(d) {
        return new Date(d.year, d.month, 1, 0, 0);
      }),

      d3.max(dataset, function(d) {
        return new Date(d.year, d.month, 1, 0, 0);
      })
    ])
    .range([0, chartWidth]);

  var xAxis = d3
    .axisBottom(xScale)
    .ticks(20)
    .tickFormat(d3.timeFormat("%Y"));

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + chartHeight + ")")

    .call(xAxis);
  var months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 11];
  var axisMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  var monthAxis = svg
    .selectAll("monthTicks")
    .data(axisMonths)
    .enter()
    .append("text")
    .text(function(d) {
      return d;
    })
    .attr("x", -77)
    .attr("y", function(d, i) {
      return i * (chartHeight / 12) + 25;
    })
    .attr("class", "monthTicks");

  var bars = svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return xScale(new Date(d.year, 1, 1, 0, 0));
    })
    .attr("y", function(d, i) {
      return d.month * (chartHeight / 12);
    })
    .attr("fill", function(d) {
      return zScale(d.temperature);
    })

    .attr("width", Math.ceil(chartWidth / 259) - 1)
    .attr("height", chartHeight / 12)

    .on("mouseover", function(d) {
      let temp;
      if (d.variance > 0) {
        temp = "+ " + d.variance.toFixed(3);
      } else {
        temp = d.variance;
      }
      d3
        .select(this)
        .attr("stroke", "rgb(255, 255, 255)")
        .attr("stroke-width", 1.5);
      // .style("cursor", "pointer");
      let month = "";
      if (d.month === 0) {
        month = "Jan";
      } else if (d.month === 1) {
        month = "Feb";
      } else if (d.month === 2) {
        month = "March";
      } else if (d.month === 3) {
        month = "April";
      } else if (d.month === 4) {
        month = "May";
      } else if (d.month === 5) {
        month = "June";
      } else if (d.month === 6) {
        month = "July";
      } else if (d.month === 7) {
        month = "August";
      } else if (d.month === 8) {
        month = "September";
      } else if (d.month === 9) {
        month = "October";
      } else if (d.month === 10) {
        month = "November";
      } else if (d.month === 11) {
        month = "December";
      } else {
        month = "";
      }
      d3
        .select("#tooltip")
        .style("background-color", "rgb(255, 255, 255)")
        .style("opacity", "0.8")
        .style("left", 100 + "px")
        .style("top", 100 + "px")
        .style("display", "block")

        .html(
          d.year +
            " " +
            month +
            "</br>" +
            d.temperature.toFixed(3) +
            " &deg;C" +
            "</br>" +
            "Variance: " +
            temp +
            " &deg;C"
        );
    })
    .on("mouseout", function() {
      d3.select("#tooltip").style("display", "none");
      d3
        .select(this)
        .attr("stroke", "none")
        .style("cursor", "defaulte");
    });

  var scale = [2.8, 4, 5.1, 6.2, 7.3, 8.4, 9.5, 10.6, 11.7, 12.8];
  // var legendScale = d3
  //   .scaleLinear()
  //   .domain(colors)
  //   .range([2.8, 12.8]);
  // //
  var legendAxis = d3.axisBottom(zScale);

  // svg
  //   .append("g")
  //   // .attr("class", "y-axis")
  //   .call(legendAxis);
  //
  // console.log("the leg ", legendScale("#5e011a"));
  svg
    .selectAll("legends")
    .data(scale)
    .enter()
    .append("rect")
    .attr("width", "27")
    .attr("height", "27")
    .attr("fill", function(d) {
      return zScale(d);
    })
    .attr("x", function(d, i) {
      return i * 27 + 650;
    })
    .attr("y", 580);
}
