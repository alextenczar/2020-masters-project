import React, {Component} from 'react';
import * as config from '../config/config.js';
import axios from 'axios';
import { Link } from 'react-router-dom';

const last_url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=';
const spot_url = 'https://api.spotify.com/v1/search?q=';
const last_key = config.keys.last_api_key;
const spot_token = JSON.parse(localStorage.getItem('params'));

class SimilarArtists extends Component {
    constructor() {
        super();
        this.state = {
            artist: undefined,
            lastArtists: [],
            spotArtists: [],
        }
    }
    
    getSimilar = () => {
        axios.get(`${last_url}${this.state.artist}&api_key=${last_key}&format=json`)
        .then(({ data }) => {
            if(typeof data.similarartists !== "undefined" && this.state.artist !== undefined) {
                this.setState({
                    lastArtists: data.similarartists.artist.slice()
                }, () => {
                        const tempSpotArtistArray = []
                        const tempLastArtistArray = []
                        var j = 0;
                        for(var i = 0; i < this.state.lastArtists.length; i++) {
                            const similarQuery = this.state.lastArtists[i];
                            //console.log(similarQuery.name);
                            axios.get(`${spot_url}${similarQuery.name}&type=artist&limit=1`, {
                                headers: {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json",
                                    Authorization: spot_token.token_type + " " + spot_token.access_token,
                                }
                            }).then(({ data }) => {
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
                            })
                        }
                        setTimeout(() => {
                            this.setState({spotArtists: tempSpotArtistArray}, () => {console.log(this.state.spotArtists);})
                            this.setState({lastArtists: tempLastArtistArray}, () => {console.log(this.state.lastArtists); })   
                        }, 1000);
                        this.forceUpdate();
               
                    }
                );
            }
            if(this.state.artist == "")
            {
/*                 this.setState({
                    last_results: []
                }) */
            }
        })
        this.forceUpdate();     
    }
    componentDidMount(){
        this.setState({artist: this.props.artist}, () =>
        {
            this.getSimilar();
        });
    }
    
    render() {
        const images = []
        const imageTest = this.state.spotArtists;
        console.log(this.state.spotArtists.length);
        for (var k = 0; k < 100; k++)
        {
            if(imageTest.length > 0) {
                if(typeof imageTest[k] !== "undefined" && typeof imageTest[k].images !== "undefined" && imageTest[k] !== 'null') {
                    if(typeof imageTest[k].images[2] !== "undefined") {
                        console.log(imageTest.length);
                        images.push(<img src={imageTest[k].images[2].url}></img>);
                    }
                }
            }
                
        }


        return (
            <div>
                {/* <h1>{this.state.artist}</h1> */}
                {images}
            </div>
        );
    }
};
export default SimilarArtists;