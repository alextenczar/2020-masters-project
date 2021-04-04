import React, {Component} from 'react';
import '../styles/pages/notFound.scss';
import {ReactComponent as Sad} from '../static/icons/sad-face.svg';
import {ReactComponent as Back} from '../static/icons/back.svg';

class NotFound extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div id="not-found">
                <a id="back-link" href="/"><Back id="back-button"/></a>
                <div className="message">
                    <Sad></Sad>
                    <h1>OOPS!</h1>
                    <h3>The page you're looking for cannot be found.</h3>
                </div>
            </div>
        );
    }
};
export default NotFound;