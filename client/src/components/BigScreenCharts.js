import React, { Component } from 'react';
import Chart from './BigChart';
import Settings from '../config';
import socketIO from 'socket.io-client';
import '../static/style/VotingCharts.css';


const socket = socketIO();
class BigScreenCharts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alpha: [],
            tech_funnel: [],
            project_type: "alpha"
        };
        this.fetchVotedProjectsByType = this.fetchVotedProjectsByType.bind(this);
    }

    componentWillMount() {
        this.fetchVotedProjectsByType("alpha");
        this.fetchVotedProjectsByType("tech_funnel");
        this.intervalId = setInterval(this.changeProjectType.bind(this), 10000);
    }

    changeProjectType() {
        let p_type = this.state.project_type;
        if(p_type === "alpha"){
            this.setState({project_type: "tech_funnel"});
        } else {
            this.setState({project_type: "alpha"});
        }
    }
    componentDidMount() {
        socket.on('voting_updated', (data) => {
            console.log(data);
            this.updateChartsData(data["project_type"],
                                  data["project_number"],
                                  {title: data["project_number"],
                                  value:data["counter"]});
        });
    }

    componentWillUnmount() {
        socket.close();
        console.log("socket connection is closed...");
        clearInterval(this.intervalId);
    }

    updateChartsData(proj_type, proj_number, new_val) {
        if(proj_type === "alpha"){
            let index = this.state.alpha.findIndex(x=> x.title === proj_number);
            if (index === -1)
                console.log("item not found");
            else {
                this.setState({
                    alpha: [
                        ...this.state.alpha.slice(0,index),
                        Object.assign({}, this.state.alpha[index], new_val),
                        ...this.state.alpha.slice(index+1)
                    ]
                });
            }
        }

        if(proj_type === "tech_funnel") {
            let index = this.state.tech_funnel.findIndex(x=> x.title === proj_number);
            if (index === -1)
                console.log("item not found");
            else {
                this.setState({
                    tech_funnel: [
                        ...this.state.tech_funnel.slice(0,index),
                        Object.assign({}, this.state.tech_funnel[index], new_val),
                        ...this.state.tech_funnel.slice(index+1)
                    ]
                });
            }
        }
    }

    sortData(data) {
        data.sort(function(a, b) {
            var nameA = a.title.toUpperCase();
            var nameB = b.title.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            return 0;
        });

        return data;
    }

    fetchVotedProjectsByType(project_type) {
        if(project_type === "alpha") {
            fetch(Settings.API.votes+project_type)
                .then(res => { return res.json()})
                .then(data => {
                    console.log(data);
                    const d = this.sortData(data);
                    this.setState({ alpha: d });
                });
        } else {
            fetch(Settings.API.votes+project_type)
                .then(res => { return res.json()})
                .then(data => {
                    console.log(data);
                    const d = this.sortData(data);
                    this.setState({ tech_funnel: d });
                });
        }
    }

    render() {
        const projects = {
            "alpha": "Alpha Results",
            "tech_funnel": "Tech Funnel Results"
        };

        let current_project_type = this.state.project_type;
        let content;
        if(current_project_type === "alpha"){
            content = <div>
                <div className="votes-head">{projects[current_project_type]}</div>
                <Chart data={this.state.alpha}/>
                </div>;
        } else {
            content = <div>
                <div className="votes-head">{projects[current_project_type]}</div>
                <Chart data={this.state.tech_funnel}/>
                </div>;
        }

        return (
            <div className="App">
              <div>
                {content}
              </div>
            </div>

        );
    }
}

export default BigScreenCharts;
