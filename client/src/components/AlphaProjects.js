import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import FullAlpha from './FullAlpha';
import AlphaDetails from './AlphaDetails';


class AlphaProjects extends Component {
    render() {
        return (
            <Switch>
              <Route exact path='/alpha-projects' component={FullAlpha}/>
              <Route path='/alpha-projects/:proj_id' component={AlphaDetails}/>
            </Switch>
        );
    }
}


export default AlphaProjects;
