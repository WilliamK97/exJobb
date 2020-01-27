import * as React from 'react';
import styles from './Twitter.module.scss';
import { ITwitterProps } from './ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from "@microsoft/sp-http";

export interface ITwitterState{
  valueEmail: any;
  valuePassword: any;
  token: any;
  loginErrors: any;
}


const myOptions: ISPHttpClientOptions = {
    headers: new Headers(),
    method: "GET",
    mode: "cors"
};

export default class Login extends React.Component<ITwitterProps, ITwitterState, {}> {

  constructor(props:ITwitterProps, state: ITwitterState) {
    super(props);
    this.state = {
      valueEmail: '',
      valuePassword: '',
      token: '',
      loginErrors: ''
    };
  }

  private william = (e: any):any => {
    e.preventDefault();
    return this.props.context.spHttpClient
    .get("http://192.168.1.220:6000/api/users/all", SPHttpClient.configurations.v1, myOptions)
    .then((apiResponse: SPHttpClientResponse) => apiResponse.json())
    .then(data => console.log(data));
  }

  private handleChangeEmail = (event: any):void => {
    this.setState({
        valueEmail: event.target.value
    });
  }

  private handleChangePassword = (event: any):void => {
    this.setState({
      valuePassword: event.target.value
    });
  }

  private handleLogin = (e: any) => {
    e.preventDefault();
    fetch('http://192.168.1.220:6000/api/auth', {
    method: 'POST',
    mode: "no-cors",
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
                loginErrors: data.errors[0].msg
            });
        })
        .catch((error) => {
            console.error(error + "error in clg");
    });
  }   

  private test = (e) => {
    e.preventDefault();
    fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(response => response.json())
    .then(json => console.log(json));
  }

  public render(): React.ReactElement<ITwitterProps> {

    return (
      <div className={ styles.twitter }>
        <div className={styles.container}>
          <div>
            <h1>twitter</h1>
            <p>welcome to twitter</p>

            <form className={styles.loginForm} onSubmit={this.handleLogin}>
              <div className="email">
                <label>Email:
                  <input type="text" name="email" value={this.state.valueEmail} onChange={this.handleChangeEmail} />
                </label>
              </div>

              <div className="password">
                <label>Password:
                  <input type="password" name="pw" value={this.state.valuePassword} onChange={this.handleChangePassword} />
                </label>
              </div>
              <br/>
              <input type="submit" value="Login" />
            </form>

            <form onSubmit={this.test}>
                <input type="submit" value="test" />
            </form>
            <form onSubmit={this.william}>
                <input type="submit" value="william" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
