import React, { Component } from 'react';
import { Switch, Route, withRouter} from 'react-router-dom';
import Search from './pages/Search.js';
import Home from './pages/Home.js';
import { getSpotifyToken } from './config/functions';
import NotFound from './pages/NotFound.js';

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
        <header className="app-header"></header>
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
