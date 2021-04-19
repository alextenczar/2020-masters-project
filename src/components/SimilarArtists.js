import React, {Component} from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import LastViz from './LastViz';
import SpotViz from './SpotViz';
import ReactAudioPlayer from 'react-audio-player';
import {ReactComponent as PlayButton} from '../static/icons/play.svg';
import {ReactComponent as PauseButton} from '../static/icons/pause.svg';
import {ReactComponent as LastIcon} from '../static/icons/lastfm.svg';
import {ReactComponent as SpotifyIcon} from '../static/icons/spotify.svg';
import {ReactComponent as Close} from '../static/icons/close.svg';
import '../styles/layout/lightbox.scss';
import '../styles/pages/similarArtist.scss';

const last_similar_url = 'https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=';
const last_search_url = 'https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=';
const spot_search_url = 'https://api.spotify.com/v1/search?q=';
const spot_similar_url = 'https://api.spotify.com/v1/artists/';
const spot_token = JSON.parse(localStorage.getItem('params'));
const {REACT_APP_LAST_API_KEY} = process.env;

class SimilarArtists extends Component {
    constructor() {
        super();
        this.state = {
            route_changed: 0,
            artist: undefined,
            spotArtistObject: {},
            lastArtistObject: {},
            spotTopTracks: [],
            spotArtists: [],
            lastFinalArtists: [],
            spotFinalArtists: [],
            lightboxVisibility: false,
        }
    }

    async getLast(){
        const lastPromise = await axios.get(`${last_similar_url}${this.state.spotArtistObject.name}&api_key=${REACT_APP_LAST_API_KEY}&format=json`)
        return lastPromise;
    }

    async getLastSearch(){
        axios.get(`${last_search_url}${this.state.spotArtistObject.name}&api_key=${REACT_APP_LAST_API_KEY}&format=json`)
        .then(({ data }) => {
            if(typeof data.artist !== "undefined") {
                this.setState({lastArtistObject: data.artist});
            }
        })
    }

    async getSpotSearch(){ //used for querying search artist and creating artist object
        this.setState({route_changed: 0});
        if(typeof this.props.spotifyObject !== "undefined") {
            if (this.props.spotifyObject.images.length == 0) {
                this.props.spotifyObject.images.push({ url: '/images/default-avatar.png' });
                this.props.spotifyObject.images.push({ url: '/images/default-avatar.png' });
                this.props.spotifyObject.images.push({ url: '/images/default-avatar.png' });
            }
            this.setState({ spotArtistObject: this.props.spotifyObject }, () => { this.getLastSearch(); this.getSpotSimilar(); this.getSpotTopTracks(); });
            this.setState({ route_changed: 1 });
        } else {
            axios.get(`${spot_search_url}${this.state.artist}&type=artist&limit=10`, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    Authorization: this.props.type + " " + this.props.token,
                }
            })
            .then(({ data }) => {
                if(typeof data.artists !== "undefined" && this.state.artist !== "") {
                    let found = false;
                    let filteredSpotSingleArtist;
                    const name_fixed = this.state.artist.replace(/\+/g, ' ');
                    for(var k = 0; k < data.artists.items.length; k++) {
                        if(data.artists.items[k].name.toUpperCase().localeCompare(name_fixed.toUpperCase()) == 0) {
                            found = true;
                            filteredSpotSingleArtist = data.artists.items[k];
                            if(filteredSpotSingleArtist.images.length == 0) {
                                filteredSpotSingleArtist.images.push({url : '/images/default-avatar.png'});
                                filteredSpotSingleArtist.images.push({url : '/images/default-avatar.png'});
                                filteredSpotSingleArtist.images.push({url : '/images/default-avatar.png'});
                            }
                            this.setState({spotArtistObject: filteredSpotSingleArtist}, () => { this.getLastSearch(); this.getSpotSimilar(); this.getSpotTopTracks();});
                            this.setState({route_changed: 1});
                            break;
                        }
                    }
                    if(found == false) { //return first result if no perfect match found
                        filteredSpotSingleArtist = data.artists.items[0];
                        if (filteredSpotSingleArtist.images.length == 0) {
                            filteredSpotSingleArtist.images.push({ url: '/images/default-avatar.png' });
                            filteredSpotSingleArtist.images.push({ url: '/images/default-avatar.png' });
                            filteredSpotSingleArtist.images.push({ url: '/images/default-avatar.png' });
                        }
                        this.setState({ spotArtistObject: filteredSpotSingleArtist }, () => { this.getLastSearch(); this.getSpotSimilar(); this.getSpotTopTracks(); });
                        this.setState({ route_changed: 1 });
                    }
                }
            })
        }
        setTimeout(() => {
            this.setState({route_changed: 0});
        }, 2250);
    }

    async getSpotTopTracks(){
        if(spot_token === null) {
            setTimeout(() => { }, 100);
        }
        if(typeof this.state.spotArtistObject.id !== 'undefined') {
            const artistId = this.state.spotArtistObject.id;
            axios.get(`${spot_similar_url}${artistId}/top-tracks?market=US`, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    Authorization: this.props.type + " " + this.props.token,
                }
            })
            .then(({ data }) => {
                if(typeof data.tracks !== "undefined" && artistId !== "") {
                    this.setState({spotTopTracks: data.tracks});
                }
            })
        }
    }

    compare(a,b) {
        const matchA = a.match;
        const matchB = b.match;

        let comparison = 0;
        if (matchA < matchB) {
          comparison = 1;
        } else if (matchA > matchB) {
          comparison = -1;
        }
        return comparison;
    }

    async getSpotSimilar(){
        let initialLastArtistArray = [];
        const filteredLastArtistArray = [];
        const filteredSpotArtistArray = [];
        const promises = []
        this.getLast().then(({data}) => {
            if(typeof data.similarartists !== "undefined") { initialLastArtistArray = data.similarartists.artist.slice().sort(this.compare);}
            if(initialLastArtistArray.length === 0 && typeof this.state.spotArtistObject.id !== 'undefined') { //if last.fm didn't return any similar artists
                const artist_id = this.state.spotArtistObject.id;
                promises.push(axios.get(`${spot_similar_url}${artist_id}/related-artists`, {
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        Authorization: this.props.type + " " + this.props.token,
                    }
                }).then(({data}) => {
                    Promise.all(promises).then(() => { 
                        this.setState({spotArtists: data.artists})
                    });
                }))
            }
            else if(initialLastArtistArray.length > 0) { //if last.fm returned any similar artists
                var z = 0;
                var length = initialLastArtistArray.length;
                if(length > 45) { length = 45}
                for(var i = 0; i < length; i++) {
                    const similarQuery = initialLastArtistArray[i];
                    promises.push(axios.get(`${spot_search_url}${similarQuery.name}&type=artist&limit=20`, {
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            Authorization: this.props.type + " " + this.props.token,
                        }
                    })
                    .then(({ data }) => {
                        for(var i = 0; i < data.artists.items.length; i++) {
                            const spotifySearchResult = data.artists.items[i]
                            if (typeof spotifySearchResult !== "undefined" && typeof data.artists !== "undefined" && this.state.artist !== undefined && similarQuery.name.toUpperCase() === spotifySearchResult.name.toUpperCase()) {
                                if (spotifySearchResult.images.length == 0) {
                                    spotifySearchResult.images.push({ url: '/images/default-avatar.png' });
                                    spotifySearchResult.images.push({ url: '/images/default-avatar.png' });
                                    spotifySearchResult.images.push({ url: '/images/default-avatar.png' });
                                }
                                similarQuery.spotify = spotifySearchResult;
                                filteredLastArtistArray.push(similarQuery);
                                filteredSpotArtistArray.push(spotifySearchResult);
                                z++;
                                break;
                            }
                        }
                    }).catch(err => {
                        return null;
                    }))
                }
                Promise.all(promises).then(() => {  //set the states once all the responses are complete
                    var arrayLength = filteredLastArtistArray.length;
                    if(filteredLastArtistArray.length > 40) {
                        arrayLength = 40;
                    }
                    this.setState({spotFinalArtists: filteredSpotArtistArray.slice(0,arrayLength)})
                    this.setState({lastFinalArtists: filteredLastArtistArray.slice(0,arrayLength)})
                });
            }
        })
    }

    componentDidMount(){
        this.setState({artist: this.props.artist}, () =>
        {
            this.getSpotSearch();
        });
    }

    componentDidUpdate (newProps) { //when a new artist is queried, execute the responses again
        if(this.props.artist != this.state.artist){
            this.setState({artist: this.props.artist}, () =>
            {
                this.setState({spotArtistObject: {}});
                this.setState({lastArtistObject: {}});
                this.setState({spotTopTracks: []});
                this.setState({lastFinalArtists: []});
                this.setState({spotFinalArtists: []});
                this.setState({spotArtists: []});
                this.getSpotSearch();
            })
        }
    }

    showLightbox = () => {
        var wrapper = document.getElementsByClassName("wrapper")
        if(this.state.lightboxVisibility == false){
            wrapper[0].classList.add("lightbox-visible");
            this.setState({lightboxVisibility: true});
        }else{
            wrapper[0].classList.remove("lightbox-visible");
            this.setState({lightboxVisibility: false});
        }
    }

    pauseAllAudio(){
        var allAudio = document.querySelectorAll('audio');
        allAudio.forEach(function(audio){
            audio.pause();
        });
    }

    previewAudio(audio){
        var track = document.getElementById(audio);
        var trackContainer = document.getElementById(audio + "-container")
        track.addEventListener("pause", function () {
            trackContainer.classList.remove('audio-playing');
        });
        track.addEventListener("play", function () {
            trackContainer.classList.add('audio-playing');
        });
        track.addEventListener("ended", function () {
            track.currentTime = 0;
            trackContainer.classList.remove('audio-playing');
        });
        if(track !== null && track.readyState !== 0){
            if(track.paused == true){ this.pauseAllAudio(); track.volume = .75; track.play(); }
            else { track.pause(); }
        }
    }

    render() {
        const genres = [];
        const sao = this.state.spotArtistObject;
        const lao = this.state.lastArtistObject;
        const toptracks = this.state.spotTopTracks;
        let tracks = [];
        let genreContainer;
        let viz;
        let sourceArtist;
        let sourceArtistImage  = <></>
        let title = <Helmet>
                        <title>BandViz</title>
                    </Helmet>

        if(typeof sao !== "undefined" && typeof sao.images !== "undefined") {
            var genreLength = sao.genres.length;
            let genreTitle = "Genres"
            if(genreLength == 1) { genreTitle = "Genre"}
            if(genreLength > 6) { genreLength = 6}
            for(var i = 0; i < genreLength; i++) {
                genres.push(<li key={i} >{sao.genres[i]}</li>)
            }
            if(genreLength > 0) {
                genreContainer =
                <ul className="genre-list">                         
                    <h2>{genreTitle}</h2>
                    {genres}
                </ul>
            }

            title = <Helmet>
                        <title>{sao.name} | BandViz</title>
                    </Helmet>

            if (this.state.route_changed == 1) {
                sourceArtistImage = <div id="source-artist-image" style={{ backgroundImage: `url(${this.props.spotifyObject.images[0].url})` }}></div>
            } else { sourceArtistImage = <></> }

            if(typeof toptracks !== "undefined") {
                var track_count = 0;
                for(var i = 0; i < toptracks.length; i++) {
                    if(track_count === 3){break;}
                    if(toptracks[i].preview_url !== null){
                        const track = toptracks[i];
                        track_count++;
                        tracks.push(
                            <div className="track" key={track.name} id={track.name + "-container"}>
                                <button className="preview-button" onClick={() => {this.previewAudio(track.name)}}>
                                    <PlayButton className="play-icon track-icon"/>
                                    <PauseButton className="pause-icon track-icon"/>
                                </button>
                                <h4 id="track-name">{track.name}</h4>
                                <ReactAudioPlayer
                                id={track.name}
                                src={track.preview_url}
                                />
                            </div>
                        )
                    }
                }
            }
  
            let last_link = <></>
            if(typeof lao.url != "undefined") {
                last_link = <a id="last_link" href={lao.url} target="_blank" rel="noopener noreferrer"><LastIcon/></a>
            }
            let spot_link = <a id="spot_link" href={sao.external_urls.spotify} target="_blank" rel="noopener noreferrer"><SpotifyIcon/></a>
            sourceArtist = 
                <div key={sao.name}> 
                    <h1 id="artist-title" onClick={this.showLightbox} style={{ visibility: this.state.lightboxVisibility ? "hidden" : "visible", opacity: this.state.lightboxVisibility ? "0" : "1"}}>{sao.name}</h1>
                    <div id="lightbox" className="lightbox" style={{ visibility: this.state.lightboxVisibility ? "visible" : "hidden", opacity: this.state.lightboxVisibility ? "1" : "0"}}>
                        <div><Close className="close-icon" onClick={this.showLightbox}/></div>
                        <h1 className="lightbox-title">{sao.name}</h1>
                        <div className="external-links">
                            {last_link}
                            {spot_link}
                        </div>
                        <div className="lightbox-container">
                            <div className="lightbox-image" style={{backgroundImage: `url(${sao.images[0].url})`}}></div>
                                <div className="artist_info">
                                <div className="track-wrapper">
                                    <div className="track-container">
                                        {tracks}
                                    </div>  
                                </div>
                                {genreContainer}
                            </div>
                        </div>
                    </div>
                </div>
        }
        if(this.state.spotFinalArtists.length > 1 && this.state.spotFinalArtists.length === this.state.lastFinalArtists.length) {    //if last.fm similar artists exist, render them.
            var lowest = 1;
            const last_results = this.state.lastFinalArtists
            for (var k = 0; k < this.state.lastFinalArtists.length; k++) {
                if(typeof last_results[k] !== 'undefined') {
                    if(last_results[k].match < lowest) {
                        lowest = last_results[k].match
                    }
                }    
            }
            viz = <LastViz lastResults={this.state.lastFinalArtists} artist = {this.state.spotArtistObject} lowest={lowest} spotResults={this.state.spotFinalArtists}></LastViz>
        }
        if(this.state.spotArtists.length !== 0 && this.state.lastFinalArtists.length === 0){ //if last.fm similar artists don't exist, render spotify's similar artists.
            viz = <SpotViz spotResults={this.state.spotArtists}></SpotViz>
        }


        return (
            <div>
                {title}
                {sourceArtistImage}
                {sourceArtist}
                {viz}
            </div>
        );
    }
};
export default SimilarArtists;