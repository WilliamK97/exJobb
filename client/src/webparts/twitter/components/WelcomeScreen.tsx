import * as React from 'react';
import styles from './Twitter.module.scss';
import { ITwitterProps } from './ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Login from "./Login";
import Register from "./Register";
import HomeScreen from "./HomeScreen";
import Search from "./Search";
import Profile from "./Profile";

export interface ITwitterStateWelcomeScreen{
  tokenFromLocalStorage: any;
  dummy: any;
  pageArray: any;
  showLogin: any;
  showRegister: any;
  showHome: any;
  showSearch: any;
  showProfile: any;
}

export default class WelcomeScreen extends React.Component<ITwitterProps, ITwitterStateWelcomeScreen,  {}> {

    constructor(props:ITwitterProps, state: ITwitterStateWelcomeScreen) {
    super(props);
    this.state = {
      tokenFromLocalStorage: '',
      dummy: '',
      showLogin: false,
      showRegister: false,
      showHome: false,
      showSearch: false,
      showProfile: false,
      pageArray: ["welcome","login","register","home","search","profile"]
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

  private logout = () => {
      this.setState({
          tokenFromLocalStorage: '',
          showHome: false,
          showProfile: false,
          showSearch: false
      });

      localStorage.removeItem('token');
      console.log("logout");
  }

  private displayHome = () => {
    this.setState({
      showHome: true,
      showProfile: false,
      showSearch: false
    })
  }
  private displaySearch = () => {
    this.setState({
      showHome: false,
      showProfile: false,
      showSearch: true
    })
  }
  private displayProfile = () => {
    this.setState({
      showHome: false,
      showProfile: true,
      showSearch: false
    })
  }
  private displayLogin = () => {
    this.setState({
      showLogin: true,
      showRegister: false,
    })
  }
  private displayRegister = () => {
    this.setState({
      showLogin: false,
      showRegister: true,
    })
  }

  public render(): React.ReactElement<ITwitterProps> {

    var homeScreen = this.state.tokenFromLocalStorage == null || this.state.tokenFromLocalStorage.length == 0 || this.state.tokenFromLocalStorage == undefined
    ? <>
        <button className={styles.menuButtons} onClick={this.displayLogin}>Login</button>
        <button className={styles.menuButtons} onClick={this.displayRegister}>Register</button>

        <div className={ this.state.showLogin == true ? styles.displayBlock : styles.displayNone}><Login loginCallback={this.loginCallback}/></div>
        <div className={ this.state.showRegister == true ? styles.displayBlock : styles.displayNone}><Register/></div>
      </>
    : <> 
        <button className={styles.menuButtons} onClick={this.displayHome}>Home</button>
        <button className={styles.menuButtons} onClick={this.displaySearch}>Search</button>
        <button className={styles.menuButtons} onClick={this.displayProfile}>Profile</button>
        <input onClick={this.logout} className={styles.logout} type="button" value="Logout" />

        <div className={ this.state.showHome == true ? styles.displayBlock : styles.displayNone}><HomeScreen displayHomeScreen={this.state.showHome}/></div>
        <div className={ this.state.showSearch == true ? styles.displayBlock : styles.displayNone}><Search displaySearchScreen={this.state.showSearch}/></div>
        <div className={ this.state.showProfile == true ? styles.displayBlock : styles.displayNone}><Profile displayProfileScreen={this.state.showProfile}/></div>
      </>;



    return (

      <div className={ styles.twitter }>
        <div className={styles.WelcomeScreenContainer}>
            <h1>Welcome to Fnitter</h1>
            {homeScreen}

        </div>
      </div>
    );
  }
}



