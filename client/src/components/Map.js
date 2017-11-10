import React, { Component } from 'react';
import Spinner from 'react-spinkit';
import '../static/style/Details.css';
import map from '../static/img/map.jpg';


class Maps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
    }

    render() {
        return (
            <div>
              {this.state.loaded ? null : <Spinner className="loading-spinner" name="line-scale-pulse-out-rapid" />}
              <img 
                style={this.state.loaded ? {width:"100%"} : {display: 'none'}}
                src={map}
                onLoad={() => this.setState({loaded: true})}
                alt="Not Found"
                />
            </div>
        );
    }
}


export default Maps;
