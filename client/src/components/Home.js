import React, { Component } from 'react';
import { Player } from 'video-react';
import Spinner from 'react-spinkit';
import LoginModal from './LoginModal';

import '../static/style/Home.css';
import '../static/style/video-react.css';
import header from '../static/img/header.jpg';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            loaded: false
        };
    }

    componentDidMount() {
        this.setState({loaded: true});
    }


    render() {
        const imgSrc = "https://www.youtube.com/watch?v=l-08u2LUXK0";
        let content;
        
        if(!this.state.loaded) {
            content = <Spinner className="loading-spinner" name="line-scale-pulse-out-rapid" />;
        } else {
            content = <div>
                <div>
                    <LoginModal />
                    <div className="home-banner">
                      <img 
                        src={header}
                        style={{width:"100%"}}
                        alt="Not Found"
                        />
                    </div>
                    <div className="video-container" >
                      <Player
                        playsInline
                        poster="/assets/poster.png"
                        src={imgSrc}
                        />
                    </div>
                  </div>
                </div>;
        }

        return <div>{content}</div>;
    }
}

export default Home;

