import * as React from 'react';
import styles from './Twitter.module.scss';
import { ITwitterProps } from './ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Link, NavLink } from 'react-router-dom';

export interface ITwitterStateHomeScreen{
    token: any;
    user: any;
    tweets: any;
}

export default class HomeScreen extends React.Component<ITwitterProps, ITwitterStateHomeScreen,  {}> {

  constructor(props:ITwitterProps, state: ITwitterStateHomeScreen) {
    super(props);
    let tokenFromLS = localStorage.getItem('token');
    this.state = {
        token: tokenFromLS,
        user: {},
        tweets: []
    };
  }

  public componentDidMount = () => {
      this.getUser();
      this.fetchTweetsFromPeopleYouFollow();
  }

  private getUser = () => {
    fetch('https://local.william/api/auth', {
      method: 'GET',
      headers: {
      'x-auth-token': this.state.token
    }
    }).then((response) => response.json())
        .then((data) => {
        this.setState({
                user: data
            });
        })
        .catch((error) => {
            console.error(error + " error in getUser()");
    });
  }

  private fetchTweetsFromPeopleYouFollow = () => {
    fetch('https://local.william/api/tweets', {
      method: 'GET',
      headers: {
      'x-auth-token': this.state.token
    }
    }).then((response) => response.json())
        .then((data) => {
        this.setState({
                tweets: data
            });
        })
        .catch((error) => {
            console.error(error + " error in fetchTweetsFromPeopleYouFollow()");
    });
  }

  public render(): React.ReactElement<ITwitterProps> {

    var user = this.state.user == null || this.state.user == undefined
    ? <p>Loading User</p>
    : <div>
        <p>{this.state.user.email}</p>
    </div>

    var tweets = this.state.tweets == null || this.state.tweets == undefined || this.state.tweets.length == 0 
    ? <h4>Loading tweets</h4>
    : this.state.tweets.map(function(subarray) {
        return subarray.map(function(item) {
            return (
            <div className={styles.tweet}>
                <h4>{item.name}</h4>
                <p>{item.text}</p>
                <p>{item.date.slice(0,10)}</p>
            </div>
            );
        });
    });

    return (
      <div className={ styles.twitter }>
        <div className={styles.HomeScreenContainer}>
            <hr/>
            <h1>Hi {this.state.user.name}</h1>
            <div className={styles.user}>
                {user}
            </div>
            <br/>
            <div className={styles.tweets}>
                {tweets}
            </div>
        </div>
      </div>
    );
  }
}



