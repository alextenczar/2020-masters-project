import React, { Component } from 'react';
import { Switch, Route, withRouter} from 'react-router-dom';
import Search from './pages/Search.js';
import Home from './pages/Home.js';
import { getSpotifyToken } from './config/functions';
import NotFound from './pages/NotFound.js';
import { Helmet, HelmetProvider } from 'react-helmet-async';

class App extends Component{
  authSpot(){
    var token = getSpotifyToken();
    token.then((response) => {
      let params = {
        access_token: response.access_token,
        token_type: response.token_type,
        expires_in: response.expires_in
      };
      const expiryTime = new Date().getTime() + (response.expires_in * 1000);
      localStorage.setItem('expiry_time', expiryTime);
      localStorage.setItem('params', JSON.stringify(params));
      this.forceUpdate();
    })
  }

  componentDidMount() {
    this.authSpot();
  }

  render() {
    let home;
    let search;
    let notFound;

    if(JSON.parse(localStorage.getItem('params')) !== null){
      const spot_token = JSON.parse(localStorage.getItem('params'));
      const expiry_time = JSON.parse(localStorage.getItem('expiry_time'));
      if(new Date().getTime() >= expiry_time){
        localStorage.removeItem('params');
        localStorage.removeItem('expiry_time');
        this.authSpot();
      }
      else {
        home = <Route exact path='/' render={(props) => <Home type={spot_token.token_type} token={spot_token.access_token}/>} />;
        search = <Route path='/search/:name' render={(props) => <Search type={spot_token.token_type} token={spot_token.access_token}/>}/>;
        notFound = <Route path='*' render={(props) => <NotFound/>}/>;
      }
    }
    return (
      <div className="wrapper">
        <Helmet>
          <title>BandViz</title>
          <link rel="canonical" href="https://www.bandviz.com/" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicon/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon/favicon-16x16.png"
          />
          <link rel="manifest" href="/favicon/site.webmanifest" />
          <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#121212" />
        </Helmet>
        <Switch>
            {home}
            {search}
            {notFound}
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
