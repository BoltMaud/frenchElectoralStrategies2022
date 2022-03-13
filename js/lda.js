var colors_side={
    "Anne Hidalgo":"#ff0000",
    "Emmanuel Macron":"#00ced1",
    "Fabien Roussel":"#990000",
    "Jean Lassalle":"#00ced1",
    "Jean-Luc Mélenchon":"#ff0000",
    "Marine Le Pen":"#00ced1",
    "Nathalie Arthaud":"#990000",
    "Nicolas Dupont-Aignan":"#00ced1",
    "Philippe Poutou":"#990000",
    "Valérie Pécresse":"#00ced1",
    "Yannick Jadot":"#008000",
    "Éric Zemmour":"#191970"
};
update("mars1");
  var w = document.getElementById('middlePremiersChiffres').getBoundingClientRect().width,
      h = w,
      r = w,
      xlda = d3.scaleLinear().range([0, r]),
      ylda = d3.scaleLinear().range([0, r]),
      node,
      root;

  var pack = d3.pack()
      .size([r, r]).padding(0);

  var vis = d3.select("body").select("#svg_div").append("svg")
      .attr("width", w)
      .attr("height", h)
    .append("svg:g")
      .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

function update(mois){
  d3.json("sources/data/lda_03_10_2022.json").then(function(data) {
    root = d3.hierarchy(data["twitter"]).sum(function(d) {
    return parseFloat(d.size); });

   var nodes = pack(root);
   var circle= vis.selectAll("circle")
        .data(nodes,function(d){
            if(d.parent){
              if(d.parent.data.name=="root"){
                var concat=d.data.name+ d.parent.data.name +
                 parseFloat(d.children[0].children[0].data.size);
              }
              else{
                var concat=d.data.name+ d.parent.data.name+ d.x;
              }
              return concat ;
            }
            else{

              return parseFloat(d.data.size)? parseFloat(d.data.size) : d.data.name ;
            }
          });

      circle.enter().append("svg:circle")
        .attr("class", function(d) {
              if(d.parent){
                if(d.parent.data.name=="root"){
                  return "cliquable";
                }
              }
              if(d.data.name=="root"){
                return "parent";
              }
              else{
                return "leaf";
              } })
        .attr("cx", function(d) {
                    if(zoomed){
                        var k = r / node_zoom.r / 2;
                         xlda.domain([node_zoom.x - node_zoom.r, node_zoom.x + node_zoom.r]);
                         return xlda(d.x);
                    }
                    else{
                        return d.x;
                    }
              })
        .attr("cy", function(d) {
                    if(zoomed){
                        var k = r / node_zoom.r / 2;
                        ylda.domain([node_zoom.y - node_zoom.r, node_zoom.y + node_zoom.r]);
                        return ylda(d.y);
                    }
                    else{
                        return d.y;
                    }
                 })
        .attr("r", function(d) {
                    if(zoomed){
                      var k = r / node_zoom.r / 2;
                      return k * d.r;
                    }
                    else{
                      return d.r;
                    }
                })
        .style("fill", function(d)  {
                if(d.parent){
                    if(d.parent.data.name=="root"){
                        return "white";
                    }
                    else{
                        return colors_side[d.parent.data.name];
                    }
                }
                else{
                    return "none";
                }
                })
        .on("click", function(d) {
                    if(d.parent.data.name=="root"){
                        return zoom(node == d ? (root) : (d));
                    }
                  });
       circle.exit()
        .transition()
        .duration(100)
        .remove();


   var texte= vis.selectAll("text")
        .data(nodes,function(d){
          if(d.data.size){
            return parseFloat(d.data.size)*100};
          if(d.parent){
            if(d.parent.data.name=="root"){
              return parseFloat(d.name+d.children[0].children[0].data.size);
            }
          }});

      texte.enter().append("svg:text")
        .attr("class", function(d) {
          if(d.parent){
            if(d.parent.data.name=="root"){
              return "party";
            }
            if(!d.children){
              return "leaf";
            }
            else{
               return "hide_text";
            }
          }
          else{
            return "hide_text";
          }
         })
        .attr("x", function(d) {
          if(zoomed){
            var k = r / node_zoom.r / 2;
              xlda.domain([node_zoom.x - node_zoom.r, node_zoom.x + node_zoom.r]);
              return xlda(d.x);
          }
          else return d.x; })
        .attr("y", function(d) {
          if(zoomed){
            var k = r / node_zoom.r / 2;
              ylda.domain([node_zoom.y - node_zoom.r, node_zoom.y + node_zoom.r]);
              return ylda(d.y);
          }
          else return d.y; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) {  return d.data.name; });

      texte.exit()
        .transition()
        .duration(100)
        .remove();


    d3.select("svg").on("click", function() {zoom(root); });
  })
  .catch(function(error) {
    console.log(error);
  });
}
var zoomed=0;
var node_zoom;
function zoom(d) {
  zoomed ? zoomed=0 : zoomed=1;
  node_zoom=d;
  var k = r / d.r / 2;
  xlda.domain([d.x - d.r, d.x + d.r]);
  ylda.domain([d.y - d.r, d.y + d.r]);

  var t = vis.transition()
      .duration(d3.event.altKey ? 7500 : 750);

  t.selectAll("circle")
      .attr("cx", function(d) { return xlda(d.x); })
      .attr("cy", function(d) { return ylda(d.y); })
      .attr("r", function(d) { return k * d.r; });

  t.selectAll("text")
      .attr("x", function(d) { return xlda(d.x); })
      .attr("y", function(d) { return ylda(d.y); });

  node = d;
  d3.event.stopPropagation();
}


