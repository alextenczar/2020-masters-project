import React, {Component} from 'react';
import SearchBar from '../components/SearchBar.js';
import '../styles/pages/home.scss';

class Home extends Component {
    constructor() {
        super();
    }
    

    render() {
        const spot_token = JSON.parse(localStorage.getItem('params'));
        let searchbar;
        if(spot_token !== null) {
            searchbar = <SearchBar type={spot_token.token_type} token={spot_token.access_token}/>
        }
        return (
            <div id="home">
                {searchbar}
            </div>
        );
    }
};
export default Home;