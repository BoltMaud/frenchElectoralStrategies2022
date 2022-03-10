// https://www.datavis.fr/index.php?page=barchart
const margin = {top: 30, right: 50, bottom: 100, left: 50},
    width = document.getElementById('middlePremiersChiffres').getBoundingClientRect().width - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
const x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

const y = d3.scaleLinear()
    .range([height, 0]);

const svg = d3.select("#premierschiffreschart").append("svg")
    .attr("id", "svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


d3.csv("sources/data/twitter_count_to_03_10_2022.csv").then(function(data) {
    x.domain(data.map(d => d.id));
    y.domain([0, d3.max(data, d => +d.count)]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
    svg.append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(y).ticks(6));
    svg.selectAll(".bar")
        .data(data)
    .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.id))
        .attr("width", x.bandwidth())
        .attr("y", d => y(+d.count))
        .attr("height", d => height - y(+d.count))
     svg.selectAll("bar")
         .data(data)
    .enter().append("text")
      .attr("class", "labels")
      .attr("x", function(d) { return x(d.id); })
      .attr("y", function(d) { return y(d.count) -10; })
      .text(function(d) { return d.count; });


});

function changeCountPostData(reseau){
    d3.csv("sources/data/"+reseau+"_count_to_03_10_2022.csv").then(function(data) {
        y.domain([0, d3.max(data, d => parseInt(d.count))]);
        d3.select("#premierschiffreschart svg g.yaxis")
            .transition().duration(1000)
            .call(d3.axisLeft(y));

        rects = d3.select("#premierschiffreschart svg")
              .selectAll("rect")
              .data(data);
            rects
              .enter().append("rect");
            rects
              .transition()
              .duration(300)
              .attr("x", d => x(d.id))
              .attr("y", d => y(+d.count))
              .attr("height", d => height - y(+d.count))

            text = d3.select("#premierschiffreschart svg")
            .selectAll(".labels")
              .data(data);
            text.enter().append("text");

            text.transition()
              .duration(300)
              .attr("x", function(d) { return x(d.id) ; })
              .attr("y", function(d) { return y(d.count) -10; })
              .text(function(d) { return d.count; });

            text.exit().remove();
            rects
               .exit().remove();
    });
}

$( "#formcountposts" ).change(function() {
    changeCountPostData($("input[name='controlHeatmapType']:checked").val());
});

// -----

