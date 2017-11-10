import React, { Component } from 'react';
import Settings from '../config';
import ItemProject from './ItemProject';
import LoginModal from './LoginModal';
import '../static/style/FullProjects.css';


class FullTechFunnel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            user: '',
            token: '',
            render: false,
            voting_counters: {}
        };
        this.fetchProjects = this.fetchProjects.bind(this);
    }
    
    componentWillMount() {
        this.getUser();
    }

    componentDidMount() {
        this.fetchProjects();
    }

    getUser() {
        let user = localStorage.getItem("user_coreid");
        let token = localStorage.getItem("token");
        if(user != null && token != null) {
            this.setState({user: user});
            this.setState({token: token});
        }
    }

    filter_projects(data, type) {
        let filtered = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].project_type === type) {
                filtered.push(data[i]);
            }
        }
        filtered.sort(function(a, b) {
            var nameA = a.project_number.toUpperCase();
            var nameB = b.project_number.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            return 0;
        });

        return filtered;
    }

    fetchProjects() {
        let user = this.state.user;
        let token = this.state.token;

        fetch(Settings.API.tech_funnel+user, {
            'method': 'GET',
            'headers': {
                'X-Auth-Token': token
            }
        })
            .then(res => { return res.json();})
            .then(data => {
                let voting_counters = {
                    alpha_votes: data[0]["alpha_votes_counter"],
                    tech_funnel_votes: data[0]["tech_funnel_votes_counter"]
                };
                const project_data = data[0]["projects"];
                const filtered_data = this.filter_projects(project_data, 'tech_funnel');
                this.setState({
                    data: filtered_data,
                    voting_counters: voting_counters
                });
            })
            .catch(error => { console.log("error: "+error);});
    }

    renderTable() {
        let voting_counters = this.state.voting_counters;
        let tech = this.state.data.map((obj, i) => (<ItemProject
                                                    key={obj.project_number}
                                                    rowDetails={obj}
                                                    votingCounters={voting_counters} />)
                                      );
        return (
            <div>
              <LoginModal />
              <div className="container">
                <div className="row">
                  <div className="main-project-title">TECH FUNNEL PROJECTS LIST </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-condensed projects-table">
                      <thead>
                      </thead>
                      <tbody>
                        {tech}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
        );
    }
    render() {
        let token = localStorage.getItem("token");
        if(token === null) {
            return (
                <div>
                  <LoginModal />
                  {
                      setTimeout(function() { //Start the timer
                          this.getUser();
                          this.fetchProjects();
                          this.setState({render: true}); //After 1 second, set render to true
                      }.bind(this), 5000)
                  }
                </div>
            );
        } else {
            return this.renderTable();
        }
    }
}


export default FullTechFunnel;
