import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Settings from '../config';
import '../static/style/ItemProject.css';
import sound from '../static/sounds/sound.mp3';


var alpha_votes;
var tech_funnel_votes;
var audio = new Audio(sound);


class ItemProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVoted: this.props.rowDetails.voted,
            user: '',
            token: ''
        };
        this.handleClick = this.handleClick.bind(this);
        this.updateVoting = this.updateVoting.bind(this);
        this.checkAgainstVipList = this.checkAgainstVipList.bind(this);
        this.checkVotingAndChangeBtnColor = this.checkVotingAndChangeBtnColor.bind(this);
        this.checkVotingAndChangeBtnText = this.checkVotingAndChangeBtnText.bind(this);
        alpha_votes = this.props.votingCounters.alpha_votes;
        tech_funnel_votes = this.props.votingCounters.tech_funnel_votes;
    }

    componentWillMount() {
        this.getUserId();
    }

    getUserId() {
        let user = localStorage.getItem("user_coreid");
        let token = localStorage.getItem("token");
        if(user != null && token != null) {
            this.setState({user: user});
            this.setState({token: token});
        }
    }

    updateVoting() {
        const voter_name = this.checkForVipCoreId(Settings.vip_list, this.state.user);
        let body = {
            isVoted: this.state.isVoted,
            project_title: this.props.rowDetails.project_title,
            project_type: this.props.rowDetails.project_type,
            project_number: this.props.rowDetails.project_number,
            submitter_name: this.props.rowDetails.submitter_name,
            id: this.props.rowDetails.id,
            info_url: this.props.rowDetails.info_url,
            user_id: this.state.user,
            voter_name: voter_name
        };
        let token = this.state.token;

        const method = 'POST';
        const header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Auth-Token': token
        };
        fetch(Settings.API.vote,
              {method: method, headers: header, body: JSON.stringify(body)}
             )
            .then(res => { return res.json();})
            .then(data => {
                //console.log(data);
            })
        .catch(error => { console.log(error); });
    }

    updateVotingBtn(){
        this.setState((prevState) => ({
            isVoted: !prevState.isVoted
        }));
    }
    checkLimitVotesForAlpha(){
        if(alpha_votes < 3) {
            if(this.state.isVoted === true) {
                this.updateVoting();
                alpha_votes = alpha_votes - 1;
                this.updateVotingBtn();
            } else {
                this.updateVoting();
                alpha_votes = alpha_votes + 1;
                this.updateVotingBtn();
            }
        }
        else if(alpha_votes === 3) {
            if(this.state.isVoted === true) {
                this.updateVoting();
                alpha_votes = alpha_votes - 1;
                this.updateVotingBtn();
            } else {
                audio.play();
            }
        }
    }

    checkLimitVotesForTechFunnel(){
        if(tech_funnel_votes < 3) {
            if(this.state.isVoted === true) {
                this.updateVoting();
                tech_funnel_votes = tech_funnel_votes - 1;
                this.updateVotingBtn();
            } else {
                this.updateVoting();
                tech_funnel_votes = tech_funnel_votes + 1;
                this.updateVotingBtn();
            }
        }
        else if(tech_funnel_votes === 3) {
            if(this.state.isVoted === true) {
                this.updateVoting();
                tech_funnel_votes = tech_funnel_votes - 1;
                this.updateVotingBtn();
            } else {
                audio.play();
            }
        }
    }

    handleClick(event) {
        event.preventDefault();
        let proj_type = this.props.rowDetails.project_type;
        if(proj_type === "alpha")
            this.checkLimitVotesForAlpha();
        else
            this.checkLimitVotesForTechFunnel();
    }

    checkVotingAndChangeBtnColor() {
        if(this.state.isVoted)
            return "btn vote-btn btn-danger";
        return "btn vote-btn";
    }

    checkVotingAndChangeBtnText() {
        if(this.state.isVoted)
            return "Voted";
        return "Vote";
    }


    checkForVipCoreId(arr, coreid) {
        for(let i=0; i<arr.length; i++) {
            if(arr[i].id === coreid)
                return [coreid, arr[i].name];
        }
        return [coreid, ""];
    }

    checkAgainstVipList() {
        let in_list = this.checkForVipCoreId(Settings.vip_list, this.state.user);
        let proj_type = this.props.rowDetails.project_type;

        if(in_list[1] !== "" && proj_type === "alpha") {
            return (<div>
                <button
                    className={this.checkVotingAndChangeBtnColor()}
                    onClick={this.handleClick}>
                    {this.checkVotingAndChangeBtnText()}
                </button>
              </div>
            );
        }

        if(proj_type === "tech_funnel"){
            return (<div>
                <button
                    className={this.checkVotingAndChangeBtnColor()}
                    onClick={this.handleClick}>
                    {this.checkVotingAndChangeBtnText()}
                </button>
              </div>
            );
        }
    }

    render() {
        const tdStyle = {verticalAlign: "middle"};
        let project_id = parseInt(this.props.rowDetails.id, 10);
        let project_type = this.props.rowDetails.project_type;
        let link_to = `/${project_type}-projects/${project_id}`;

        return (
            <tr className="list-item">
              <td className="project-no" style={tdStyle}>
                  {this.props.rowDetails.project_number}
              </td>
              <td className="main-td">
                <div className="project-title">
                  <Link to={link_to}>
                    {this.props.rowDetails.project_title}
                  </Link>

                </div>
                {this.checkAgainstVipList()}
              </td>
            </tr>
        );
    }
}


export default ItemProject;
