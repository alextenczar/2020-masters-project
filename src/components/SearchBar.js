import React, {Component} from 'react';
import axios from 'axios';
import { Link, withRouter} from 'react-router-dom';
import PropTypes from "prop-types";

import '../styles/components/searchbar.scss';

const last_url = 'https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=';
const last_top_chart_url = 'https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=';
const spot_url = 'https://api.spotify.com/v1/search?q=';
const {REACT_APP_LAST_API_KEY} = process.env;

class SearchBar extends Component {
    constructor() {
        super();
        this.state = { 
            search: '', 
            last_results: [], 
            spot_results: [], 
            last_top_chart: [],
            chart_index: 0,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getLast = this.getLast.bind(this);
        this.getSpot = this.getSpot.bind(this);
    }

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };


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

    getLastTopChart = () => {
        axios.get(`${last_top_chart_url}${REACT_APP_LAST_API_KEY}&format=json`)
        .then(({ data }) => {
            if(typeof data !== "undefined") {
                this.setState({
                    last_top_chart: data.artists.artist
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
    componentDidMount(){
        var timesRun = 0;
        this.getLastTopChart();
        var innerThis = this;
        const message = 'Search for artists like...';
        this.initialMessageTimeout = setTimeout(() => {
            this.initialMessageInterval = setInterval(() => {
                if (!document.hidden) {
                    timesRun += 1;
                    if (timesRun > message.length) {
                        clearInterval(innerThis.initialMessageInterval);
                    }
                    document.getElementById("search-box").setAttribute('placeholder', message.slice(0, timesRun));
                }
            }, 2000 / message.length); 
            this.nameChangeTimeout = setTimeout(() => {
                this.inputInterval = setInterval(() => {
                    if (!document.hidden) {
                        let artist_index = this.state.chart_index;
                        this.changeText(artist_index);
                        if (this.state.chart_index == 49) {
                            var i = 0;
                        } else { var i = this.state.chart_index + 1; }
                        this.setState({ chart_index: i });
                    }
                }, 2500);
            }, 2000);
        }, 1500);
    }

    componentWillUnmount(){
        clearTimeout(this.initialMessageTimeout);
        clearTimeout(this.nameChangeTimeout);
        clearTimeout(this.typingTimeout);
        clearInterval(this.changeTextInterval);
        clearInterval(this.initialMessageInterval);
        clearInterval(this.inputInterval);
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
        const {history} = this.props;
        e.preventDefault();
        const artist_link = "/search/" + this.state.search.replace(/\s/g, '+');
        history.push(artist_link);
    } 

    getChangedText(timesRun, artist_index){
        return this.state.last_top_chart[artist_index].name.slice(0, timesRun);
    }

    changeText = (artist_index) => {
        var bar = this;
        var timesRun = 0;
        var nameLeng = this.state.last_top_chart[artist_index].name.length;
        var searchBox = document.getElementById("search-box");
        if (typeof searchBox != 'undefined' && searchBox != null) {
            searchBox.setAttribute('placeholder', "");
        }
        this.typingTimeout = setTimeout(()=> {
            this.changeTextInterval = setInterval(() => {
                timesRun += 1;
                if (timesRun > nameLeng) {
                    clearInterval(this.changeTextInterval);
                }
                var placeholderTxt = bar.getChangedText(timesRun, artist_index);
                if (typeof searchBox != 'undefined' && searchBox != null) {
                    searchBox.setAttribute('placeholder', placeholderTxt);
                }
            }, 1000 / nameLeng);
        },250);
    }


    render() {
        const last_results = this.state.last_results
        const spot_results = this.state.spot_results
        const suggestions = [] 
        let top_chart_suggestions = ['...',]
        var searchBox = document.getElementById("search-box");
        var suggestionBox = document.getElementById("suggestion-box");
        for (var i = 0; i < 6; i++) {
            for(var k = 0; k < 50; k++) {
                if(typeof last_results[i] !== "undefined" && typeof spot_results[k] !== "undefined" && last_results[i].listeners > 500 && last_results[i].name.toUpperCase() === spot_results[k].name.toUpperCase()){
                    searchBox.classList.add("populated");
                    suggestionBox.classList.add("populated");
                    const artist_name = spot_results[i].name;
                    const artist_link = "/search/" + artist_name.replace(/\s/g, '+');
                    suggestions.push(<Link to={{
                        pathname:artist_link, 
                        state: { spotifyObject: spot_results[k]}
                    }} className="artist-link" key={artist_name}>{artist_name}</Link>);
                    break;
                }
            }
            if(suggestions.length == 0 && searchBox !== null && suggestionBox !== null){
                searchBox.classList.remove("populated");
                suggestionBox.classList.remove("populated");
            }
        }
        if(typeof this.state.last_top_chart[0] !== 'undefined' && typeof document.querySelector('#search-box') !== null) {
            top_chart_suggestions = this.state.last_top_chart;
        }
     
        return (
            <form id="home-search" onSubmit={this.handleSubmit} autoComplete="off">
                <input id="search-box" type="text" value={this.state.search} onChange={this.handleChange} placeholder=""></input>
                <div id="suggestion-box" className="suggestions-container">
                    {suggestions}
                </div>
            </form>
        );
    }
};
export default withRouter(SearchBar);