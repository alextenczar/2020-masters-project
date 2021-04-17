import axios from 'axios';
const {REACT_APP_SPOTIFY_CLIENT, REACT_APP_SPOTIFY_SECRET} = process.env

export const getSpotifyToken = () => {
  const request = axios({
    url: "https://accounts.spotify.com/api/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(REACT_APP_SPOTIFY_CLIENT + ":" + REACT_APP_SPOTIFY_SECRET),
    },
    data: "grant_type=client_credentials",
  })
  .then(({ data }) => {
    console.log("test");
    return data
  })
  return request;
};
