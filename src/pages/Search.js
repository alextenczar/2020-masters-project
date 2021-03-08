import {Link, useParams} from "react-router-dom";
import axios from 'axios';
import * as config from '../config/config.js';
import React, { useState, useEffect } from 'react';
import SimilarArtists from '../components/SimilarArtists.js';
import '../styles/pages/search.scss';

function Search(props) {
    const { name } = useParams();
    const [artistInfo, setArtistInfo] = useState({});
    const [spotArtistInfo, setSpotArtistInfo] = useState({});
    const name_fixed = name.replace(/\+/g, ' ');
    const last_url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=';
    const spot_url = 'https://api.spotify.com/v1/search?q=';
    const last_key = config.keys.last_api_key;
    const spot_results = props.location.state;
    const spot_token = JSON.parse(localStorage.getItem('params'));
    
    useEffect(() => {
        if(spot_token === null) {
            setTimeout(() => { }, 100);
        }
        axios.get(`${last_url}${name}&api_key=${last_key}&format=json`)
        .then(({ data }) => {
            setArtistInfo(data.artist);
        })
        axios.get(`${spot_url}${name}&type=artist&limit=1`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                Authorization: spot_token.token_type + " " + spot_token.access_token,
            }
        })
        .then(({ data }) => {
            if(typeof data.artists !== "undefined" && name !== "") {
                setSpotArtistInfo(data.artists.items[0]);
                
            }
        })
    }, []);

    if (Object.keys(artistInfo).length !== 0 && Object.keys(spotArtistInfo).length !==0) {
        return (
            <>
                {/*<h1>{name_fixed}</h1><br></br>*/}
                {/* <img src={spotArtistInfo.images[1].url}></img> */}
                <Link to="/" id="back-link" key="back">Back</Link>
                <SimilarArtists artist={name}></SimilarArtists>
            </>
        )
    }
    return (
        <>
        </>
    )
};
export default Search;

