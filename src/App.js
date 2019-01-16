import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';

import Employee from './Employee.js'
import Home from './Home.js'
import Login from './Login.js'
import Profile from './Profile.js'
import Staffcard from './Staffcard.js'
import Frontcard from './Frontcard.js'
import Backcard from './Backcard.js'
import ManageTimes from './ManageTimes.js'
import Schedule from './Schedule.js'
import Checkin from './Checkin.js'
import Checkout from './Checkout.js'
import MoreWorktimes from './MoreWorktimes'

import {BrowserRouter , Route, Switch, HashRouter } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <HashRouter>
          <div>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/employee" component={Employee} />
            <Route path="/login" component={Login} />
            <Route path="/home" component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/staffcard" component={Staffcard} />
            <Route path="/frontcard" component={Frontcard} />
            <Route path="/backcard" component={Backcard} />
            <Route path="/managetimes" component={ManageTimes} />
            <Route path="/worktimes" component={Schedule} />
            <Route path="/checkin" component={Checkin} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/timelines" component={MoreWorktimes} />
          </Switch>
          </div>
        </HashRouter>
      </div>
    );
  }
}

export default App;
