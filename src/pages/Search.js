import {Link, useParams, useHistory, useLocation} from "react-router-dom";
import axios from 'axios';
import React, { useState, useEffect} from 'react';
import SimilarArtists from '../components/SimilarArtists.js';
import '../styles/pages/search.scss';
import {ReactComponent as Back} from '../static/icons/back.svg';

function Search(props) {
    const {REACT_APP_LAST_API_KEY, REACT_APP_SPOTIFY_CLIENT, REACT_APP_SPOTIFY_SECRET} = process.env
    const { name } = useParams();
    const [spotArtistInfo, setSpotArtistInfo] = useState(undefined);
    const [route_changed, setRouteChanged] = useState(false);
    const name_fixed = name.replace(/\+/g, ' ');
    const spot_url = 'https://api.spotify.com/v1/search?q=';
    const spot_token = JSON.parse(localStorage.getItem('params'));
    let location = useLocation();
    let history = useHistory();
    let results;

    useEffect(() => {
        if (spot_token === null) {
            setTimeout(() => { }, 100);
        }
        axios.get(`${spot_url}${name}&type=artist&limit=1`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                Authorization: props.type + " " + props.token,
            }
        })
        .then(({ data }) => {
            if (typeof data.artists !== "undefined" && name !== "") {
                setSpotArtistInfo(data.artists.items[0]);
            }
            if (data.artists.items.length == 0 || typeof data.artists == "undefined") {
                history.replace('/404')
            }
        })
    }, []);

    if (typeof spotArtistInfo !== "undefined") {
        results = <>
            <SimilarArtists artist={name} type={props.type} token={props.token}></SimilarArtists>
        </>
    }
    return (
        <>
            <a id="back-link" href="/"><Back id="back-button" /></a>
            {results}
        </>
    )
};
export default Search;

