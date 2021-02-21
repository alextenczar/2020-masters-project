import React, {Component} from 'react';
import * as config from '../config/config.js';
import axios from 'axios';
import '../styles/components/searchbar.scss';
import { Link } from 'react-router-dom';


const last_url = 'https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=';
const spot_url = 'https://api.spotify.com/v1/search?q=';
const last_key = config.keys.last_api_key;
const spot_token = JSON.parse(localStorage.getItem('params'));


class SearchBar extends Component {
    constructor() {
        super();
        this.state = { search: '', submit: '', last_results: [], spot_results: [],}
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getLast = this.getLast.bind(this);
        this.getSpot = this.getSpot.bind(this);
    }


    getLast = () => {
        axios.get(`${last_url}${this.state.search}&api_key=${last_key}&format=json`)
        .then(({ data }) => {
            if(typeof data.results !== "undefined" && this.state.search !== "") {
                this.setState({
                    last_results: data.results.artistmatches.artist.slice()
                })
            }
            if(this.state.search == "")
            {
                this.setState({
                    last_results: []
                })
            }
        })
    }
    
    getSpot = () => {
        if(this.state.search !== "")
            {
            axios.get(`${spot_url}${this.state.search}&type=artist&limit=50`, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    Authorization: spot_token.token_type + " " + spot_token.access_token,
                }
            })
            .then(({ data }) => {
                if(typeof data.artists !== "undefined" && this.state.search !== "") {
                    this.setState({
                        spot_results: data.artists.items.slice()
                    })
                }
                if(this.state.search == "")
                {
                    this.setState({
                        spot_results: []
                    })
                }
            })
        }
    }


    handleChange(e){
        this.setState({ search: e.target.value }, () =>
            {
                this.getLast();
                this.getSpot();
            }
        );
    }
    
    handleSubmit(e) {
        e.preventDefault();
        this.setState({ submit: this.state.search }, () =>
            {}
        );
    } 


    render() {
        const last_results = this.state.last_results
        const spot_results = this.state.spot_results
        const suggestions = [] 
        for (var i = 0; i < 6; i++) {
            for(var k = 0; k < 50; k++) {
                if(typeof last_results[i] !== "undefined" && typeof spot_results[k] !== "undefined" && last_results[i].listeners > 500 && last_results[i].name.toUpperCase() === spot_results[k].name.toUpperCase()){
                    const artist_name = last_results[i].name;
                    const artist_link = "/search/" + artist_name.replace(/\s/g, '+');
                    suggestions.push(<Link to={{pathname:artist_link, state: spot_results[k]}} className="artist-link" key={artist_name}>{artist_name}</Link>);
                    break;
                }
            }
        }
     
        return (
            <form id="home-search" onSubmit={this.handleSubmit}>
                <input type="text" value={this.state.search} onChange={this.handleChange} />
                <div className="suggestions-container">
                    {suggestions}
                </div>
            </form>
        );
    }
};
export default SearchBar;