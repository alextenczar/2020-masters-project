import React, {Component} from 'react';
import SearchBar from '../components/SearchBar.js';
import '../styles/pages/home.scss';
import {drawChart} from '../components/LastViz';
    

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
                {searchbar}
            </div>
        );
    }
};
export default Home;