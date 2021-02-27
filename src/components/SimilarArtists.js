import React, {Component} from 'react';
import * as config from '../config/config.js';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LastViz from './LastViz.js'

const last_url = 'https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=';
const spot_search_url = 'https://api.spotify.com/v1/search?q=';
const spot_similar_url = 'https://api.spotify.com/v1/artists/'
const last_key = config.keys.last_api_key;
const spot_token = JSON.parse(localStorage.getItem('params'));

class SimilarArtists extends Component {
    constructor() {
        super();
        this.state = {
            artist: undefined,
            artistObject: {},
            lastArtists: [],
            spotArtists: [],
        }
    }

    async getLast(){
        const lastPromise = await axios.get(`${last_url}${this.state.artist}&api_key=${last_key}&format=json`)
        console.log(lastPromise);
        return lastPromise;
    }

    getSpotSearch = () => { //used for querying search artist and creating artist object
        const artistName = this.state.artist;
        if(spot_token === null) {
            setTimeout(() => { }, 100);
        }
        axios.get(`${spot_search_url}${artistName}&type=artist&limit=1`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                Authorization: spot_token.token_type + " " + spot_token.access_token,
            }
        })
        .then(({ data }) => {
            if(typeof data.artists !== "undefined" && artistName !== "") {
                this.setState({artistObject: data.artists.items[0]});
                console.log(data);
            }
        })
    }

    getSpotSimilar = () => {
        const tempLastArtistArray = []
        const tempSpotArtistArray = []
        const promises = []
        this.getLast().then(({data}) => {
            this.setState({lastArtists: data.similarartists.artist.slice()}, () => {
                var j = 0;
                if(this.state.lastArtists.length === 0 && typeof this.state.artistObject !== 'undefined') { //if last.fm didn't return any similar artists
                    const artist_id = this.state.artistObject.id;
                    promises.push(axios.get(`${spot_similar_url}${artist_id}/related-artists`, {
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            Authorization: spot_token.token_type + " " + spot_token.access_token,
                        }
                    }).then(({data}) => {
                        Promise.all(promises).then(() => { 
                            this.setState({spotArtists: data.artists})
                            console.log(data.artists);
                        });
                    }))
                }
                else if(this.state.lastArtists.length > 0) { //if last.fm returned any similar artists
                    for(var i = 0; i < this.state.lastArtists.length; i++) {
                        const similarQuery = this.state.lastArtists[i];
                        promises.push(axios.get(`${spot_search_url}${similarQuery.name}&type=artist&limit=1`, {
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                                Authorization: spot_token.token_type + " " + spot_token.access_token,
                            }
                        })
                        .then(({ data }) => {
                            const spotifySearchResult = data.artists.items[0]
                            if(typeof spotifySearchResult !== "undefined" && typeof data.artists !== "undefined" && this.state.artist !== undefined && similarQuery.name.toUpperCase() === spotifySearchResult.name.toUpperCase()) {
                                tempLastArtistArray.push(similarQuery);
                                tempSpotArtistArray.push(spotifySearchResult);
                            }
                            else
                            {
                                tempSpotArtistArray.push('null');
                                tempLastArtistArray.push('null');
                            }
                            j++;
                        }).catch(err => {
                            return null;
                        }))
                    }
                    Promise.all(promises).then(() => {  //set the states once all the responses are complete
                        console.log(tempSpotArtistArray);
                        console.log(tempLastArtistArray);
                        console.log(promises);
                        this.setState({spotArtists: tempSpotArtistArray})
                        this.setState({lastArtists: tempLastArtistArray})
                    });
                }
            })
        })
    }

    componentDidMount(){
        this.setState({artist: this.props.artist}, () =>
        {
            this.getSpotSearch();
            this.getSpotSimilar();
        });
    }

    componentDidUpdate (newProps) { //when a new artist is queried, execute the responses again
        if(this.props.artist != this.state.artist){
            this.setState({artist: this.props.artist}, () =>
            {
                this.setState({spotArtists: []})
                this.setState({lastArtists: []})
                this.getSpotSearch();
                this.getSpotSimilar();
            })
        }
    }
    
    render() {
        const images = [];
        const ao = this.state.artistObject;
        let lastViz;
        let sourceArtist;
        if(typeof ao !== "undefined" && typeof ao.images !== "undefined") {
            sourceArtist = 
                <div key={ao.name}> 
                    <h1>{ao.name}</h1>
                    <img src={ao.images[1].url}></img>
                </div>;
        }
        if(this.state.spotArtists.length !== 0 && this.state.lastArtists.length !== 0) {    //if last.fm similar artists exist, render them.
            for (var k = 0; k < this.state.lastArtists.length; k++) {
                    const last_results = this.state.lastArtists
                    const spot_results = this.state.spotArtists
                    //console.log(this.state.lastArtists);
                    //console.log(this.state.spotArtists);
                    if(typeof spot_results[k] !== "undefined" && typeof spot_results[k].images !== "undefined" && spot_results[k] !== 'null') {
                        if(typeof spot_results[k].images[2] !== "undefined") {
                            const artist_name = last_results[k].name;
                            const artist_link = "/search/" + artist_name.replace(/\s/g, '+');
                            console.log(spot_results.length);
                            images.push(
                                <div className="artist-container" key={artist_name}>
                                    <Link to={{pathname:artist_link, state: spot_results[k]}} className="artist-link" key={artist_name}><img src={spot_results[k].images[2].url} key={spot_results[k].name}></img></Link>
                                </div>
                            );
                        }
                    }                
            }
            lastViz = <LastViz results={this.state.lastArtists}></LastViz>
        }
        if(this.state.spotArtists.length !== 0 && this.state.lastArtists.length === 0){ //if last.fm similar artists don't exit, render spotify's similar artists.
            for(var l = 0; l < this.state.spotArtists.length; l++) {
                const spot_results = this.state.spotArtists;
                const artist_name = spot_results[l].name;
                const artist_link = "/search/" + artist_name.replace(/\s/g, '+');
                images.push(
                    <div className="artist-container" key={artist_name}>
                        <Link to={{pathname:artist_link, state: spot_results[l]}} className="artist-link" key={artist_name}><img src={spot_results[l].images[2].url} key={spot_results[l].name}></img></Link>
                    </div>
                );
            }
        }


        return (
            <div>
                {/* <h1>{this.state.artist}</h1> */}
                {sourceArtist}
                {lastViz}
                {images}
            </div>
        );
    }
};
export default SimilarArtists;