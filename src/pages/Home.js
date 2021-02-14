import React, {Component} from 'react';
import SearchBar from '../components/SearchBar.js';
import '../styles/pages/home.scss';

class Home extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div id="home">
                <SearchBar/>
            </div>
        );
    }
};
export default Home;