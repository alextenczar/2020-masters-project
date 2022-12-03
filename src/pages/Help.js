import React, { Component } from 'react';
import { ReactComponent as Back } from '../static/icons/back.svg';
import { Link } from 'react-router-dom';
import Lottie from "lottie-react";
import pinchZoom from '../static/lottie/pinchZoom.json';
import mouseZoom from '../static/lottie/mouseZoom.json';
import { ReactComponent as Logo } from '../static/icons/bandviz-logo.svg';
import '../styles/pages/help.scss';
import { Helmet } from 'react-helmet-async';

class Help extends Component {
    constructor() {
        super();
    }


    leave(event) {
        var tooltip = document.getElementById("tooltip");
        tooltip.style.opacity = 0;
    }
    hover(event) {
        var tooltip = document.getElementById("tooltip");
        tooltip.style.opacity = 1;
        tooltip.style.left = (event.clientX + 20) + "px";
        tooltip.style.top = event.clientY + "px";
    }

    componentDidMount() {
        var bubble = document.getElementById("bubble");
        var tooltip = document.getElementById("tooltip");
        bubble.addEventListener("mousemove", this.hover);
        bubble.addEventListener("mouseleave", this.leave);
    }
    componentWillUnmount() {
        var bubble = document.getElementById("bubble");
        var tooltip = document.getElementById("tooltip");
        bubble.removeEventListener("mousemove", this.hover);
        tooltip.removeEventListener("mouseleave", this.leave);
    }

    render() {
        return (
            <div id="help">
                <Helmet>
                    <title>Help | BandViz</title>
                </Helmet>
                <Link id="back-link" to="/"><Back id="back-button" /></Link>
                <div className="help-wrapper">
                    <h1>Help</h1>
                    <h2>1. Manipulating The Viz:</h2>
                    <div className="logo-container">
                        <Logo id="logo"></Logo>
                    </div>
                    <div className="animation-container">
                        <Lottie animationData={pinchZoom} style={{ height: 150, width: 150 }} />
                        <Lottie animationData={mouseZoom} style={{ height: 100, width: 100 }} />
                    </div>
                    <div className="explanation">
                        <p>
                            While on the visualization, <b>scroll</b> or <b>pinch</b> to zoom. To move it, <b>drag</b>.
                        </p>
                    </div>
                    <div className="artist-demo">
                        <h2>2. Getting To Know The Artist:</h2>
                        <div className="name-demo">Khalid</div>
                        <div className="explanation">
                            <p>
                                <b>Click</b> on the artist's name to view links, song previews, and their genres.
                            </p>
                        </div>
                    </div>
                    <div className="hover-demo">
                        <h2>3. Viewing Similar Artists:</h2>
                        <svg height="100" width="100">
                            <filter id="shadow3">
                                <feDropShadow dx="-0.8" dy="-0.8" stdDeviation="0"
                                    flood-color="pink" flood-opacity="0.5" />
                            </filter>
                            <circle id="bubble" cx="50" cy="50" r="40" fill="white" />
                        </svg>
                        <h5>Hover/Tap Me!</h5>
                        <div className="explanation">
                            <p>
                                <h3>Desktop:</h3>
                                <b>Hover</b> over an artist's bubble to see their name and similarity. <b>Click</b> it to see their viz.
                            </p>
                            <p>
                                <h3>Mobile:</h3>
                                <b>Tap</b> an artist's bubble to see their name and similarity. <b>Tap</b> it again to see their viz.
                            </p>
                        </div>
                        <div id="tooltip">Khalid <br /> Similarity: 80%</div>
                    </div>
                    <h4 id="enjoy">That's it, enjoy finding new artists! - Alex</h4>
                </div>
            </div>
        );
    }
};
export default Help;