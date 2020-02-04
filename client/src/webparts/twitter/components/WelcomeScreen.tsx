import * as React from 'react';
import styles from './Twitter.module.scss';
import { ITwitterProps } from './ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Login from "./Login";
import Register from "./Register";
import { Route, BrowserRouter, Link } from 'react-router-dom';
import HomeScreen from "./HomeScreen";

export interface ITwitterStateWelcomeScreen{
  tokenFromLocalStorage: any;
}

export default class WelcomeScreen extends React.Component<ITwitterProps, ITwitterStateWelcomeScreen,  {}> {

    constructor(props:ITwitterProps, state: ITwitterStateWelcomeScreen) {
    super(props);
    this.state = {
      tokenFromLocalStorage: ''
    };
  }

  public componentDidUpdate = () => {
    console.log("did update"),
    this.checkIfTokenExist();
  }


  public checkIfTokenExist = (): void => {
    var getToken = localStorage.getItem('token');
    var tokenState = this.setState({
        tokenFromLocalStorage: getToken
    });
  }

  public render(): React.ReactElement<ITwitterProps> {

    console.log("get token state: " + this.state.tokenFromLocalStorage);

    var homeScreen = this.state.tokenFromLocalStorage == null || this.state.tokenFromLocalStorage.length == 0 || this.state.tokenFromLocalStorage == undefined
    ? ""
    : <Link Component={HomeScreen} exact to="/home">Home Page</Link>;

    return (
    <BrowserRouter>
      <div className={ styles.twitter }>
        <div className={styles.WelcomeScreenContainer}>
            <h1>Welcome to Twitter</h1>

            <Link Component={Login} exact to="/login">Login</Link>
            <Link Component={Register} exact to="/register">Make account</Link>
            {homeScreen}

            <Route exact path='/login' component={Login}/>
            <Route exact path='/register' component={Register} /> 

        </div>
      </div>
    </BrowserRouter>
    );
  }
}



