import React, { Component } from 'react';
import { Switch, Route, withRouter} from 'react-router-dom';
import Search from './pages/Search.js';
import Home from './pages/Home.js';
import { getSpotifyToken } from './config/functions';

class App extends Component{
  authSpot(){
    var token = getSpotifyToken();
    token.then((response) => {
      const expiryTime = new Date().getTime() + 5000;
      let params = {
        access_token: response.access_token,
        token_type: response.token_type,
        expires_in: response.expires_in
      };
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
      }
    }
    return (
      <div className="wrapper">
        <header className="app-header"></header>
        <Switch>
            {home}
            {search}
        </Switch>
        <footer className="app-footer"></footer>
      </div>
    );
  }
}

export default withRouter(App);
