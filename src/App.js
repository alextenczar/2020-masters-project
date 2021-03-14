import React, { Component } from 'react';
import { Switch, Route, withRouter} from 'react-router-dom';
import Search from './pages/Search.js';
import Home from './pages/Home.js';
import { getSpotifyToken } from './config/functions';


class App extends Component{

  returnThemeBasedOnOS() {
    const body = document.body
    let pref = window.matchMedia('(prefers-color-scheme: dark)')
    if (pref.matches) {
      body.classList.add('dark')
      body.classList.remove('light')
    }
    else {
      pref = window.matchMedia('(prefers-color-scheme: light)')
      if (pref.matches) {
        body.classList.add('light')
        body.classList.remove('dark')
      }
      else {
        body.classList.add('light')
        body.classList.remove('dark')
      }
    }
  }
  componentDidMount() {
    var token = getSpotifyToken();
    token.then((response) => {
      const expiryTime = new Date().getTime() + response.expires_in * 1000;
      let params = {
        access_token: response.access_token,
        token_type: response.token_type,
        expires_in: response.expires_in
      };
      localStorage.setItem('params', JSON.stringify(params));
      localStorage.setItem('expiry_time', expiryTime);
      this.forceUpdate();
    })
  }
  
  render() {
    let home;
    let search;

    if(JSON.parse(localStorage.getItem('params')) !== null){
      const spot_token = JSON.parse(localStorage.getItem('params'));
      home = <Route exact path='/' render={(props) => <Home type={spot_token.token_type} token={spot_token.access_token}/>} />;
      search = <Route path='/search/:name' render={(props) => <Search type={spot_token.token_type} token={spot_token.access_token}/>}/>;
    }
    return (
      <div className="wrapper">
        <header className="app-header">
  
        </header>
        <Switch>
            {home}
            {search}
        </Switch>
        <footer className="app-footer">

        </footer>
      </div>
    );
  }
}

export default App;
