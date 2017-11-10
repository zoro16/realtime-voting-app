import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import FullTechFunnel from './FullTechFunnel';
import TechFunnelDetails from './TechFunnelDetails';


class TechFunnelProjects extends Component {
    render() {
        return (
            <Switch>
              <Route exact path='/tech_funnel-projects' component={FullTechFunnel}/>
              <Route path='/tech_funnel-projects/:proj_id' component={TechFunnelDetails}/>
            </Switch>
        );
    }
}
 

export default TechFunnelProjects;
