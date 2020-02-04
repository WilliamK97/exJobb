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
  dummy: any;
}

export default class WelcomeScreen extends React.Component<ITwitterProps, ITwitterStateWelcomeScreen,  {}> {

    constructor(props:ITwitterProps, state: ITwitterStateWelcomeScreen) {
    super(props);
    this.state = {
      tokenFromLocalStorage: '',
      dummy: '',
    };
  }

  public loginCallback = () => {
      console.log("setting new token");
        var getToken = localStorage.getItem('token');
        this.setState({
            tokenFromLocalStorage: getToken
        });  
  }

  public componentDidMount = () => {
    var getToken = localStorage.getItem('token');
    this.setState({
        tokenFromLocalStorage: getToken
    });  
  }

  public componentDidUpdate = (prevProps, prevState) => {
    console.log("did update");
  }

  public render(): React.ReactElement<ITwitterProps> {

    var homeScreen = this.state.tokenFromLocalStorage == null || this.state.tokenFromLocalStorage.length == 0 || this.state.tokenFromLocalStorage == undefined
    ? ""
    : <> 
        <Link Component={HomeScreen} exact to="/home">Home Page!!</Link>
        <Route exact path='/home' component={HomeScreen}/>
      </>

    return (
    <BrowserRouter>
      <div className={ styles.twitter }>
        <div className={styles.WelcomeScreenContainer}>
            <h1>Welcome to Twitter</h1>

            <Link Component={Login} exact to="/login">Login</Link>
            <Link Component={Register} exact to="/register">Make account</Link>
            {homeScreen}

            <Route exact path='/login' render={(props) => <Login {...props} loginCallback={this.loginCallback} />} />
            <Route exact path='/register' component={Register} /> 

        </div>
      </div>
    </BrowserRouter>
    );
  }
}



