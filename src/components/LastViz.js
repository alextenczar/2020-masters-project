import React, { Component } from 'react';
import * as d3 from 'd3';
import {useD3} from '../hooks/UseD3.js';
import { Link, Redirect, useHistory , useLocation} from 'react-router-dom';
import { drag, scaleSqrt, schemeGnBu, zoom } from 'd3';
import '../styles/pages/viz.scss';

function LastViz(props) {
    const spotify_data = props.spotResults;
    const last_data = props.lastResults;
    const lowest = props.lowest;
    const history = useHistory();
    const location = useLocation();
    //const data = props.lastResults;
    const redirect = d => {
      history.push(d);
    }

/*     window.onpopstate = function() {
      window.location.reload(true);
    }; */

    React.useEffect(() => {
      d3.selectAll("#viz > *").remove();
      d3.selectAll(".tooltip").remove();
    }, [location])

    const data = last_data.map(d => ({
      ...d,
      x: Math.random() * 900,
      y: Math.random() * 900
    }))
        const ref = useD3(
            (svg) => {
              const height = 1000;
              const width = 1000;
              const margin = { top: 20, right: 30, bottom: 30, left: 40 };
              const center = { x: width/2, y: height/2 };
              
            var distanceScale = d3.scaleSqrt().domain([lowest, 1]).range([30, 70])
            var defs = svg.append("defs");

            // charge is dependent on size of the bubble, so bigger towards the middle
            function charge(d) {
              return -Math.pow(distanceScale(d.match), 2.0) * .3;
            }
          

          var simulation = d3.forceSimulation(data)
          .force("x", d3.forceX(width / 2).strength(.3).x(center.x))
          .force("y", d3.forceY(height / 2).strength(.3).y(center.y))
          .force('charge', d3.forceManyBody().strength(charge))
          .force("collide", d3.forceCollide(function(d){
              return distanceScale(d.match * 1.1);
            }))
            .on('tick', ticked)
            //.stop(); //used for static viz


          //for (var i = 0; i < 300; ++i) {simulation.tick();} // for static viz

          var Tooltip = d3.select("#d3")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "rgba(0, 0, 0, 0.75)")
            .style("border-radius", "5px")
            .style("padding", "10px") 
            .style("position", "absolute")
            .style("color", "white")
            .style("backdrop-filter", "blur(10px)")
            .style("-webkit-backdrop-filter", "blur(10px)")


          var handleDrag = function(d) {
            d3.select(this)
              .style("cursor", "grabbing")
          }

          var handleMouseUp = function(d) {
            d3.select(this)
              .style("cursor", "grab")
          }


          var mouseover = function(d) {
            Tooltip
              .style("opacity", 1)
            d3.select(this)
              .style("stroke", "white")
              .style("opacity", 1)
              .style("cursor", "pointer")
          }
          var mousemove = function(event,d) {
            Tooltip
              .html(d.name + "<br>Similarity: " + (d.match * 100).toFixed(2) + "%")
              .style("left", (event.pageX+20) + "px")
              .style("top", (event.pageY) + "px")
          }
          var mouseleave = function(d) {
            Tooltip
              .style("opacity", 0)
            d3.select(this)
              .style("stroke", "none")
              .style("opacity", 1)
          }

          var g = svg.append("g")
            .attr("class", "everything")
            .style("background-color", "white")

          var circles = g.selectAll(".artist")
            .data(data)
            .enter().append("circle")
            .attr("class", "artist")
            .attr("r", 0)
            .attr("fill", function(d, i) {
              return "url(#" + d.name.toLowerCase().replace(/[ "']/g, "+") + ")";
            })
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("mousedown", function(d) {
              Tooltip
                .style('visibility', "hidden")
            })
            .on("click", function(d){
              const artist = d.target.__data__;
              const artist_link = "/search/" + artist.name.replace(/\s/g, '+');
              redirect(artist_link);
            })
            //.attr("cx", function(d) { return d.x })
            //.attr("cy", function(d) { return d.y })
          
          circles.transition()
            .delay(1250)
            .duration(2000)
            .attr('r', function(d) {return distanceScale(d.match); });

            if(data !== null)
            {
              simulation.nodes(data);
            }

            defs.selectAll(".artist-pattern")
              .data(spotify_data)
              .enter().append("pattern")
              .attr("class", "artist-pattern")
              .attr("id", function(d){
                return d.name.toLowerCase().replace(/[ "']/g, "+");
              })
              .attr("height", "100%")
              .attr("width", "100%")
              .attr("patternContentUnits", "objectBoundingBox")
              .append("image")
              .attr("height", 1)
              .attr("width", 1)
              .attr("preserveAspectRatio", "xMidYMid slice")
              .attr("object-fit", "cover")
              .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
              .attr("xlink:href", function(d){
                var imageUrl = d.images[1]
                if(imageUrl != null){
                  return imageUrl.url;
                }
              })
            
            function drawChart() {
              var currentWidth = parseInt(d3.select('#d3').style('width'), 10)
              svg.attr("width", currentWidth)
            }


            var zoom_handler = d3.zoom()
               .on("zoom", zoom_actions)

            zoom_handler(svg);
            
            zoom_handler.on("start", function() {
              svg.style("cursor", "grabbing")
            })

            zoom_handler.on("end", function() {
              svg.style("cursor", "grab")
            })

            function zoom_actions(event){
              g.attr("transform", event.transform)
            }

            var process = 1;
            function ticked() {
              if(process === 1) {
                circles
                .attr("cx", function(d) { return d.x })
                .attr("cy", function(d) { return d.y })
              }
              process = 1 - process;
            }
            drawChart()
            window.addEventListener('resize', drawChart );
        },
        [last_data]
      );

        return (
          <div id="d3">
              <svg
                id="viz"
                ref={ref}
                style={{
                  height: (window.innerHeight),  
                  marginRight: "0px",
                  marginLeft: "0px",
                  cursor: "grab",
                }}
                viewBox="0 0 1000 1000"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  
                </defs>
              </svg>
          </div>
          );

}
export default LastViz