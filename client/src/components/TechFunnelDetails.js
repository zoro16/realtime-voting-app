import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Spinner from 'react-spinkit';
import Settings from '../config';
import '../static/style/Details.css';


class TechFunnelDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info_url: '',
            user: '',
            token: '',
            loaded: false
        };
        this.getDetails = this.getDetails.bind(this);
    }

    componentWillMount() {
        this.getUserId();
    }

    componentDidMount() {
        this.getDetails();
    }

    getUserId() {
        let user = localStorage.getItem("user_coreid");
        let token = localStorage.getItem("token");
        if(user != null && token != null) {
            this.setState({user: user});
            this.setState({token: token});
        }
    }

    getDetails() {
        let proj_id = parseInt(this.props.match.params.proj_id, 10);
        let body = {user: this.state.user, proj_id: proj_id};
        let token = this.state.token;

        fetch(Settings.API.details, {
            method: 'POST',
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            },
            body: JSON.stringify(body)
        })
            .then(res => { return res.json()})
            .then(data => {
                console.log(data[0].info_url);
                let url = data[0].info_url;
                this.setState({info_url: url});
            })
            .catch(error => { console.log(error);});
    }

    render() {
        return (
            <div>
              <div>
                  <Link className="btn back-btn" to="/tech_funnel-projects">
                    Back
                  </Link>
              </div>
              {this.state.loaded ? null : <Spinner className="loading-spinner" name="line-scale-pulse-out-rapid" />}
              <div className="proj-info-img">
                <img 
                  style={this.state.loaded ? {width:"100%"} : {display: 'none'}}
                  src={this.state.info_url}
                  onLoad={() => this.setState({loaded: true})}
                  alt="Not Found"
                  />
              </div>
            </div>
        );
    }
}


export default TechFunnelDetails;
