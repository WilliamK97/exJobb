import * as React from 'react';
import styles from './Twitter.module.scss';
import { ITwitterProps } from './ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Link, NavLink } from 'react-router-dom';
import WelcomeScreen from "./WelcomeScreen";

export interface ITwitterStateRegister{
  valueEmail: any;
  valuePassword: any;
  token: any;
  loginErrors: any;
  valueName: any;
}

export default class Register extends React.Component<ITwitterProps, ITwitterStateRegister, {}> {
constructor(props:ITwitterProps, state: ITwitterStateRegister) {
    super(props);
    this.state = {
      valueEmail: '',
      valuePassword: '',
      valueName: '',
      token: '',
      loginErrors: ''
    };
  }

  private handleChangeEmail = (event: any):void => {
    this.setState({
        valueEmail: event.target.value
    });
  }

  private handleChangeName = (event: any):void => {
    this.setState({
        valueName: event.target.value
    });
  }

  private handleChangePassword = (event: any):void => {
    this.setState({
      valuePassword: event.target.value
    });
  }

  private handleMakeAccount = (e: any) => {
    e.preventDefault();
    fetch('https://local.william/api/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        name: this.state.valueName,
        email: this.state.valueEmail,
        password: this.state.valuePassword,
    }),
    }).then((response) => response.json())
        .then((data) => {
        this.setState({
                token: data.token,
                loginErrors: data.errors !== undefined ? data.errors[0].msg : ""
            });
        })
        .catch((error) => {
            console.error(error + " error in clg");
    });
  }   


  public render(): React.ReactElement<ITwitterProps> {

    var loginError = this.state.loginErrors.length == 0
    ? "" 
    : <div className={styles.loginErrorMsg}>{this.state.loginErrors}</div>;

    var loginSuccess = this.state.token == undefined || this.state.token.length == 0 || this.state.token == null 
    ? <div></div>
    : <div className={styles.loginSuccessMsg}>Success!</div>;

    console.log("token: " + this.state.token);

    return (
      <div className={ styles.twitter }>
        <div className={styles.RegisterContainer}>

        {loginError}
        {loginSuccess}

            <form onSubmit={this.handleMakeAccount}>
              <div className="name">
                <div>Name</div>
                <input className={styles.registerInput} type="text" name="name" value={this.state.valueName} onChange={this.handleChangeName} /> 
              </div>

              <div className="email">
                <div>Email</div>
                <input className={styles.registerInput} type="text" name="email" value={this.state.valueEmail} onChange={this.handleChangeEmail} /> 
              </div>

              <div className="password">
                <div>Password</div>
                <input className={styles.registerInput} type="password" name="pw" value={this.state.valuePassword} onChange={this.handleChangePassword} />  
              </div>
              <br/>
              <input type="submit" value="Create Account" />
            </form>
    
        </div>
      </div>
    );
  }
}
