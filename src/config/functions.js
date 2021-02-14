import axios from 'axios';
import * as config from './config.js';
const spotify_client = config.keys.spotify_client;
const spotify_secret = config.keys.spotify_secret;

export const getSpotifyToken = () => {
  const test = axios({
    url: "https://accounts.spotify.com/api/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(spotify_client + ":" + spotify_secret),
    },
    data: "grant_type=client_credentials",
  })
  .then(({ data }) => {
      return data
  })
  return test
};
