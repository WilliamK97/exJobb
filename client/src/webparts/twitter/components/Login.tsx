import * as React from 'react';
import styles from './Twitter.module.scss';
import { ITwitterProps } from './ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from "@microsoft/sp-http";
import Register from "./Register";
import {Route, Link, BrowserRouter } from 'react-router-dom';
import HomeScreen from "./HomeScreen";
import WelcomeScreen from "./WelcomeScreen";

export interface ITwitterState{
  valueEmail: any;
  valuePassword: any;
  token: any;
  loginErrors: any;
  tweet: any;
}

export default class Login extends React.Component<ITwitterProps, ITwitterState, {}> {

  constructor(props:ITwitterProps, state: ITwitterState) {
    super(props);
    var test = localStorage.getItem('token');
    test == null ? <></> : this.setState({token: test}); 
    this.state = { 
      valueEmail: '',
      valuePassword: '',
      token: '',
      loginErrors: '',
      tweet:[]
    };
  }

  private handleChangeEmail = (event: any):void => {
    this.setState({
        valueEmail: event.target.value
    });
  }

  private clickedBtn = () => {
    this.props.loginCallback();
  }

  private handleChangePassword = (event: any):void => {
    this.setState({
      valuePassword: event.target.value
    });
  }

  private handleLogin = (e: any) => {
    e.preventDefault();
    fetch('https://fnitter.herokuapp.com/api/auth', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email: this.state.valueEmail,
        password: this.state.valuePassword,
    }),
    }).then((response) => response.json())
        .then((data) => {
        this.setState({
                token: data.token,
                loginErrors: data.errors !== undefined ? data.errors[0].msg : ""
            });
             {this.props.loginCallback()}
        })
        .catch((error) => {
            console.error(error + " error in clg");
    });
  }  

  public render(): React.ReactElement<ITwitterProps> {

    var loginError = this.state.loginErrors.length == 0
     ? "" 
     : <div>{this.state.loginErrors}</div>;

    var loginSuccess =  this.state.token == undefined || this.state.token.length == 0 || this.state.token == null 
    ? ""
    : <>
        {localStorage.setItem('token', this.state.token)}
        {console.log("token is set")}
     </>;


    return (
      <div className={ styles.twitter }>
        <div className={styles.loginContainer}>
          <div>

            <form className={styles.loginForm} onSubmit={this.handleLogin}>
              <div>
                <div>Email</div>
                <input className={styles.loginInput} type="text" name="email" value={this.state.valueEmail} onChange={this.handleChangeEmail} /> 
              </div>

              <div>
                <div>Password</div>
                <input className={styles.loginInput} type="password" name="pw" value={this.state.valuePassword} onChange={this.handleChangePassword} />  
              </div>
              <br/>
              <input onClick={() => this.clickedBtn()} type="submit" value="Login" />
            </form>

            {loginError}
            {loginSuccess}
           
          </div>
        </div>
      </div>
    );
  }
}
