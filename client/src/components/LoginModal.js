import React, { Component } from 'react';
import Settings from '../config';
import Modal from 'reboron/ScaleModal';
import '../static/style/LoginModal.css';

var styles = {
  container: {
      padding: '3em',
      textAlign: 'center',
      width: '100%',
      height: '30%'
  }
};

class LoginModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            valueValid: true
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setNewUser = this.setNewUser.bind(this);
    }
    componentDidMount() {
        let user = localStorage.getItem("user_coreid");
        if(user === null) {
            this.showModal();
        }
    }

    validateField() {
        let coreid_valid = this.state.value;

        if(coreid_valid.match(/^[a-zA-Z]{1,8}[0-9]{1,6}?[a-zA-Z]{0,4}[0-9]{0,4}$/)){
            return true;
        } else {
            return false;
        }
    }

    handleChange(event) {
        this.setState({value: event.target.value.toUpperCase()});
    }

    handleSubmit(event) {
        event.preventDefault();
        let coreid_value = this.state.value;
        if(this.validateField()) {
            fetch(Settings.API.users, {
                method: 'POST',
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({coreid: coreid_value})
            })
                .then(res => { return res.json();})
                .then(data => {
                    console.log(data);
                    this.setNewUser(this.state.value, data.token);
                })
                .catch(error => {console.log("error: "+error);});

            this.hideModal();
        } else {
            this.setState({valueValid: false});
        }
    }

    showModal() {
        this.refs.modal.show();
    }

    hideModal() {
        this.refs.modal.hide();
    }

    callback(evt) {
        console.log(evt);
    }

    setNewUser(user, token) {
        localStorage.setItem("user_coreid", user);
        localStorage.setItem("token", token);
    }

    render() {
        const errorMsg = 'Invalid CoreID! Please Try again.';
        const errorMsgDiv = <div className="error-msg">{errorMsg}</div>;
        return (
            <div>
              <Modal ref={'modal'} modalStyle={styles.container} >
                <form className="theform" onSubmit={this.handleSubmit} >
                  <div className="form-content">
                    <input type="text"
                           id="usr"
                           name="coreid"
                           placeholder="Please Enter Your CoreID"
                           value={this.state.value}
                           onChange={this.handleChange} />
                    {this.state.valueValid ? "" : errorMsgDiv}
                    <input className="btn login-btn"
                           type="submit"
                           value="Login"
                           />
                  </div>
                </form>
              </Modal>
            </div>
        );
    }
}

export default LoginModal;
