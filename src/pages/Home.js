import React, {Component} from 'react';
import SearchBar from '../components/SearchBar.js';
import '../styles/pages/home.scss';
import {ReactComponent as Logo} from '../static/icons/bandviz-logo.svg';
import {ReactComponent as Help} from '../static/icons/help.svg';
import { Link} from 'react-router-dom';
    

class Home extends Component {
    constructor() {
        super();
    }

    render() {
        let searchbar;
        if(this.props.token !== null) {
            searchbar = <SearchBar type={this.props.type} token={this.props.token}/>
        }
        return (
            <div id="home">
                <Link className="help-link" to="/help"><Help id="help-button"/></Link>
                <div className="searchbar-container">
                    <Logo></Logo>
                    <h1>BandViz</h1>
                    {searchbar}
                </div>
                <div className="app-footer">
                    <p>built by <a href="https://alextenczar.com" target="_blank" rel="noopener noreferrer">Alex Tenczar</a></p>
                </div>
            </div>
            
        );
    }
};
export default Home;