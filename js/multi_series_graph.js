var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y-%m-%d").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(10)
    .tickFormat(d3.time.format("%d %b"))
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg_multi = d3.select("#state").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data_values;

queue()
    .defer(d3.csv, "data/breitbart_nonpolitical.csv")
    .defer(d3.csv, "data/breitbart_political.csv")
    .defer(d3.csv, "data/cnn_nonpolitical.csv")
    .defer(d3.csv, "data/cnn_political.csv")
    .defer(d3.csv, "data/fox_nonpolitical.csv")
    .defer(d3.csv, "data/fox_political.csv")
    .defer(d3.csv, "data/nyt_nonpolitical.csv")
    .defer(d3.csv, "data/nyt_political.csv")
    .defer(d3.csv, "data/wsj_nonpolitical.csv")
    .defer(d3.csv, "data/wsj_political.csv")
    .await(function(error, bb_n, bb_p, cnn_n, cnn_p, fox_n, fox_p, nyt_n, nyt_p, wsj_n, wsj_p) {

        data_array = [bb_n, bb_p, cnn_n, cnn_p, fox_n, fox_p, nyt_n, nyt_p, wsj_n, wsj_p];
        // parse dates
        function changeDates(item) {
            item.forEach(function(d) {
                d.Date = parseDate(d.Date);
            });
        }

        data_array.forEach(changeDates);

        // create the axes
        svg_multi.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg_multi.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Percentage of political tweets");

        data_values = {
          "bb_n": bb_n,
          "bb_p": bb_p,
          "cnn_n": cnn_n,
          "cnn_p": cnn_p,
          "fox_n": fox_n,
          "fox_p": fox_p,
          "nyt_n": nyt_n,
          "nyt_p": nyt_p,
          "wsj_n": wsj_n,
          "wsj_p": wsj_p
        };

        // Update visualization when ready
        updateVisualization();
    });

var data;

function updateVisualization() {
    // Get the user-selected state
    select_state = d3.select("#select-box").property("value");
    console.log(select_state);
    // Get appropriate dataset for that state
    data = data_values[select_state]

    console.log(data);

    data = data.sort(function (a,b) {return d3.ascending(a.Date, b.Date); });

    color.domain(d3.keys(data[0]).filter(function(key) {
        return (key !== "Date");
    }));

    var people = color.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return {Date: d.Date, candidate: +d[name]};
            })
        };
    });

    console.log(people);

    // update domains for axes
    x.domain(d3.extent(data, function(d) { return d.Date; }));

    //for use in mentions by absolute numbers
    //y.domain([
    //    d3.min(people, function(c) { return d3.min(c.values, function(v) { return v.candidate; }); }),
    //    d3.max(people, function(c) { return d3.max(c.values, function(v) { return v.candidate; }); })
    //]);

    y.domain([0, 100]);

    // draw axes anew
    svg_multi.select(".y")
        .call(yAxis);
    svg_multi.select(".x")
        .transition()
        .duration(1000)
        .call(xAxis);

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.Date); })
        .y(function(d) { return y(d.candidate); });

    var person = svg_multi.selectAll(".candidate")
        .data(people, function(d) {
            return d.name;
        });

    var personGroups = person.enter()
        .append("g")
        .attr("class", "candidate");

    personGroups.append("path")
        .attr("class", "line")
        //.attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });

    personGroups.append("text")
        .attr("x", 3)
        .attr("dy", ".35em");

    var personUpdate = d3.transition(person);

    personUpdate.select("path")
        .transition()
        .duration(1000)
        .attr("d", function(d) {
            return line(d.values);
        });

    person.select("text")
        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.Date) + "," + y(d.value.candidate) + ")"; })
        .text(function(d) { return d.name; });

    person.exit().remove();

}
