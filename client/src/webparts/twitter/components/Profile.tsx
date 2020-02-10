import * as React from 'react';
import styles from './Twitter.module.scss';
import { ITwitterProps } from './ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';

export interface ITwitterStateProfileScreen{
    token: any;
    user: any;
    following: any;
    followers: any;
    valueTweet: any;
    tweet: any;
    allTweets: any;
    //bio: any;
    //errorMsg: any;
}


export default class Profile extends React.Component<ITwitterProps, ITwitterStateProfileScreen, {}> {

constructor(props:ITwitterProps, state: ITwitterStateProfileScreen) {
    super(props);
    var tokenLS = localStorage.getItem('token'); 
    this.state = { 
        token: tokenLS,
        user: {},
        following: [],
        followers: [],
        valueTweet: '',
        tweet: {},
        allTweets: [],
        //bio: {},
        //errorMsg: ''
        //filter all tweets så den senaste är högst upp
        // searchFilter: (list) => list.filter(a => Date.parse(a.SlutDatum) >= Date.now()),
    };
  }

  public componentDidMount = () => {
      this.getUser();
      this.fetchAllTweets();
  }

//   private getMyProfile = () => {
//       fetch('https://local.william/api/profile/me', {
//           method: 'GET',
//           headers: {
//              'x-auth-token': this.state.token 
//           }
//       }).then((res) => res.json())
//       .then((data) => {
//           this.setState({
//               bio: data.bio,
//               //errorMsg: data.msg == undefined ? "" : data.msg
//           })
//       })
//       .catch((err) => {
//           console.log(err + "error in getMyProfile()");
//       })
//   }

  private createTweet = (e: any) => {
    e.preventDefault();
    fetch('https://local.william/api/tweets', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-auth-token': this.state.token
    },
    body: JSON.stringify({
        text: this.state.valueTweet
    }),
    }).then((response) => response.json())
        .then((data) => {
        console.log('hej from createTweet()', data);
        this.fetchAllTweets().then(() => {
            console.log("fetched new tweets from createTweet()");
            this.setState({
                tweet: data
            });
        });
        })
        .catch((error) => {
            console.error(error + " error in createTweet()");
    });
  } 

  private handleChangeTweet = (event: any):void => {
    this.setState({
      valueTweet: event.target.value
    });
  } 

  //get logged in user
  private getUser = () => {
    fetch('https://local.william/api/auth', {
      method: 'GET',
      headers: {
      'x-auth-token': this.state.token
    }
    }).then((response) => response.json())
        .then((data) => {
        this.setState({
                user: data,
                following: data.following,
                followers: data.followers
            });
        })
        .catch((error) => {
            console.error(error + " error in getUser()");
    });
  }

  //create bio
  //see bio

  //see your own tweets'
  private fetchAllTweets = async () => {
    let result;
    await fetch('https://local.william/api/tweets/all' , {
    method: 'GET',
    headers: {
    'x-auth-token': this.state.token
    }
    })
    .then((res) => res.json())
        .then((data) => {
        this.setState({
                allTweets: data
            });
            result = data;
        })
        .catch((err) => {
            console.log(err + "error in fetchAllTweets()");
     });
     return result;
    }


  public render(): React.ReactElement<ITwitterProps> {

    console.log("tweet u created", this.state.tweet);
    console.log("valueTweet", this.state.valueTweet);
    console.log("current user", this.state.user);

    // var renderProfileBio = this.state.bio == null || this.state.bio == undefined
    // ? <p>Loading bio</p> 
    // :   <div className={styles.bio}>
    //         <p>{this.state.bio}</p>
    //     </div>

    var user = this.state.user == null || this.state.user == undefined
        ? <p>Loading User</p>
        : <div className={styles.user}>
            <img className={styles.userImg} src={this.state.user.avatar} />
            <h2>Hi {this.state.user.name}</h2>
            <p>{this.state.user.email}</p>
            <p>Number of users you follow: {this.state.following.length} </p>
            <p>Number of followers: {this.state.followers.length} </p>
        </div>;

    var renderYourTweets = this.state.allTweets.length == 0 || this.state.allTweets == null || this.state.allTweets == undefined 
    ? <p>Loading your tweets (or no tweets)</p>
    : this.state.allTweets.map(item => {
        return item.user == this.state.user._id
        ?   <div className={styles.yourTweets}>
                <img className={styles.img} src={item.avatar} />
                <span className={styles.name}>{item.name}</span><br/>
                <p className={styles.text}>{item.text}</p>
            </div>
        : console.log("inte din tweet");
    });

    

    return (
      <div className={ styles.twitter }>
        <div className={styles.ProfileContainer}>
            <hr />
            {user}

            {/* {renderProfileBio} */}

            <form className={styles.tweetForm} onSubmit={this.createTweet}>
              <div>
                <h4>Tweet something</h4>
                <input className={styles.tweetInput} type="text" name="tweet" value={this.state.valueTweet} onChange={this.handleChangeTweet} /> 
              </div>
              <br/>
              <input className={styles.submitButton} type="submit" value="Tweet" />
            </form>

            {renderYourTweets}

        </div>
      </div>
    );
  }
}