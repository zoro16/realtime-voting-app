import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import '../static/style/Main.css';

import Home from './Home';
import AlphaProjects from './AlphaProjects';
import TechFunnelProjects from './TechFunnelProjects';
import VotingChart from './VotingChart';
import Maps from './Map';
import BigScreenCharts from './BigScreenCharts';



class Main extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {show: false, isShown: 'navbar-collapse collapse  out'};
    }
    handleClick(event) {
        event.preventDefault();
        this.setState((prevState) => ({
            show: !prevState.show
        }));

        if(this.state.show === true)
            this.setState({isShown: 'navbar-collapse collapse in'});
        else
            this.setState({isShown: 'navbar-collapse collapse out'});
    }

    render() {
        return (
            <Router>
              <div>
                <nav className="navbar navbar-inverse">
                  <div className="container-fluid">
                    <div className="navbar-header">
                      <button onClick={this.handleClick} type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>                        
                      </button>
                    </div>
                    <div className={this.state.isShown} id="myNavbar">
                      <ul className="nav navbar-nav header-text">
                        <li onClick={this.handleClick}>
                          <Link to="/">HOME</Link>
                        </li>
                        <li onClick={this.handleClick}>
                          <Link to="/alpha-projects">ALPHA PROJECT</Link>
                        </li>
                        <li onClick={this.handleClick}>
                          <Link to="/tech_funnel-projects">TECH FUNNEL PROJECT</Link>
                        </li>
                        <li onClick={this.handleClick}>
                          <Link to="/voting-charts">VOTING CHARTS</Link>
                        </li>
                        <li onClick={this.handleClick}>
                          <Link to="/maps">MAP</Link>
                        </li>
                      </ul>

                    </div>
                  </div>
                </nav>

                <Route exact path="/" component={Home}/>
                <Route path="/alpha-projects" component={AlphaProjects}/>
                <Route path="/tech_funnel-projects" component={TechFunnelProjects}/>
                <Route path="/voting-charts" component={VotingChart}/>
                <Route path="/maps" component={Maps}/>

                <Route path="/big-screen-charts" component={BigScreenCharts}/>
              </div>
            </Router>

        );
    }
}

export default Main;
