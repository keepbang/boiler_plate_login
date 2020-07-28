import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'
import Auth from './hoc/auth'


function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null,null)}/>
          <Route path="/login" component={Auth(LoginPage, false,'login')}/>
          <Route path="/register" component={Auth(RegisterPage, false,'register')}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;