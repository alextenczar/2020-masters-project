import React, { Component } from 'react';
import * as d3 from 'd3';
import {useD3} from '../hooks/UseD3.js';
import { Link } from 'react-router-dom';
import { scaleSqrt } from 'd3';

function LastViz(props) {
    console.log(props.lastResults);
    console.log(props.spotResults);
    const dataa = props.spotResults;
    //const data = props.lastResults;
    const data = props.lastResults.map(d => ({
      ...d,
      x: 900,
      y: 900
    }))
        const ref = useD3(
            (svg) => {
              const height = 1500;
              const width = 1500;
              const margin = { top: 20, right: 30, bottom: 30, left: 40 };
              const center = { x: width/2, y: height/2 };
            
            var distanceScale = d3.scaleSqrt().domain([0, 1]).range([5, 80])

            var defs = svg.append("defs");

            var Tooltip = d3.select("#div_template")
              .append("div")
              .style("opacity", 0)
              .attr("class", "tooltip")
              .style("background-color", "rgba(38, 38, 38, 0.95)")
              .style("border-radius", "5px")
              .style("padding", "10px")
              .style("position", "absolute")
              .style("color", "white")

            var mouseover = function(d) {
              Tooltip
                .style("opacity", 1)
              d3.select(this)
                .style("stroke", "black")
                .style("opacity", .5)
                .style("cursor", "pointer")
            }
            var mousemove = function(event,d) {
              Tooltip
                .html(d.name + "<br>Similarity: " + (d.match * 100).toFixed(2))
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

            var circles = svg.selectAll(".artist")
              .data(data)
              .enter().append("circle")
              .attr("class", "artist")
              .attr("r", function(d){
                return distanceScale(d.match);
              })
              .attr("fill", function(d, i) {
                return "url(#" + d.name.toLowerCase().replace(/[ "']/g, "+") + ")";
              })
              .on("mouseover", mouseover)
              .on("mousemove", mousemove)
              .on("mouseleave", mouseleave)
              .on("click", function(d){
                const artist = d.target.__data__;
                const artist_link = "/search/" + artist.name.replace(/\s/g, '+');
                window.location.href = artist_link;
              })
              

            defs.selectAll(".artist-pattern")
              .data(dataa)
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
              
              // charge is dependent on size of the bubble, so bigger towards the middle
              function charge(d) {
                return Math.pow(distanceScale(d.match), 2.0) * 0.01
              }

            var simulation = d3.forceSimulation()
              .force('charge', d3.forceManyBody().strength(charge))
              .force("x", d3.forceX(width / 2).strength(0.05).x(center.x))
              .force("y", d3.forceY(height / 2).strength(0.05).y(center.y))
              .force("collide", d3.forceCollide(function(d){
                return distanceScale(d.match);
              }))
            

            if(data !== null)
            {
              simulation.nodes(data)
              .on('tick', ticked)
            }


            function ticked() {
              circles
                .attr("cx", function(d) {
                  return d.x
                })
                .attr("cy", function(d) {
                  return d.y
                })
            }

        },
        [data.length]
      );

    

        return (
          <div id="div_template">
            <svg
              ref={ref}
              style={{
                height: (window.innerHeight - 100),
                width: '100%',  
                marginRight: "0px",
                marginLeft: "0px",
              }}
              viewBox="0 0 1500 1500"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                
              </defs>
            </svg>
          </div>
          );

}
export default LastViz