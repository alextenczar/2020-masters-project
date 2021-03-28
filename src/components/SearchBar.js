import React, {Component} from 'react';
import axios from 'axios';
import '../styles/components/searchbar.scss';
import { Link } from 'react-router-dom';
import {ReactComponent as Search} from '../static/icons/search.svg';


const last_url = 'https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=';
const spot_url = 'https://api.spotify.com/v1/search?q=';
const {REACT_APP_LAST_API_KEY, REACT_APP_SPOTIFY_CLIENT, REACT_APP_SPOTIFY_SECRET} = process.env;


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
        axios.get(`${last_url}${this.state.search}&api_key=${REACT_APP_LAST_API_KEY}&format=json`)
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
                    Authorization: this.props.type + " " + this.props.token,
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
        var searchBox = document.getElementById("search-box");
        var suggestionBox = document.getElementById("suggestion-box");
        for (var i = 0; i < 6; i++) {
            for(var k = 0; k < 50; k++) {
                if(typeof last_results[i] !== "undefined" && typeof spot_results[k] !== "undefined" && last_results[i].listeners > 500 && last_results[i].name.toUpperCase() === spot_results[k].name.toUpperCase()){
                    searchBox.classList.add("populated");
                    suggestionBox.classList.add("populated");
                    const artist_name = last_results[i].name;
                    const artist_link = "/search/" + artist_name.replace(/\s/g, '+');
                    suggestions.push(<Link to={{pathname:artist_link, state: spot_results[k]}} className="artist-link" key={artist_name}>{artist_name}</Link>);
                    break;
                }
            }
            if(suggestions.length == 0 && searchBox !== null && suggestionBox !== null){
                searchBox.classList.remove("populated");
                suggestionBox.classList.remove("populated");
            }
        }
     
        return (
            <form id="home-search" onSubmit={this.handleSubmit} autoComplete="off">
                <input id="search-box" type="text" value={this.state.search} onChange={this.handleChange} placeholder="Search for..."></input>
                <div id="suggestion-box" className="suggestions-container">
                    {suggestions}
                </div>
            </form>
        );
    }
};
export default SearchBar;