import * as React from 'react';
import styles from '../Twitter.module.scss';
import { ITwitterProps } from '../ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {FaRegCheckCircle, FaCog} from "react-icons/fa";
import UserView from "./UserView";
import NewTweetView from "./NewTweetView";
import YourTweetsView from "./YourTweetsView";

export interface ITwitterStateProfileScreen{
    token: any;
    user: any;
    following: any;
    followers: any;
    valueTweet: any;
    tweet: any;
    allTweets: any;
    bio: any;
    errorMsg: any;
    displayBioInput:any;
    bioValue: any;
    createBioInfo: any;
    displayArray: any;
    commentValue: any;
    newCommentInfo: any;
    valueTweetImg: any;
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
        bio: {},
        errorMsg: '',
        displayBioInput: false,
        bioValue: '',
        createBioInfo: {},
        displayArray: [1],
        commentValue: '',
        newCommentInfo: [],
        valueTweetImg: ''
    };
  }

  public componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.displayProfileScreen !== this.props.displayProfileScreen && this.props.displayProfileScreen == true ) {
      console.log("component did mount and update profile");
      this.getUser();
      this.fetchAllTweets();
      this.getMyProfile();
    }
  }

  public displayCommentInput = (id: any) => {
      console.log(id);
      var tweetId = id;
      this.state.displayArray.push(tweetId);
      console.log(this.state.displayArray);
      this.setState({
    });
  } 

  private handleChangeComment = (event: any):void => {
    this.setState({
        commentValue: event.target.value
    });
  }

  public hideCommentInput = (id: any) => {
      console.log("clicked id ",id);
      let indexInTweetArray = this.state.displayArray.findIndex(item => item == id);
      console.log("find array index of id");
      console.log(indexInTweetArray);
      this.state.displayArray.splice(indexInTweetArray);
      this.setState({
    });
    console.log(this.state.displayArray);
  }

  public showEditBio = () => {    
      console.log("show input");
      this.setState({
          displayBioInput: true
    });
  } 

  public hideEditBio = (id: any) => {
      console.log("hide input");
      this.setState({
          displayBioInput: false
    });
  }

  private handleChangeBio = (event: any):void => {
    this.setState({
        bioValue: event.target.value
    });
  }

  private getMyProfile = async () => {
      let result;
      await fetch('https://fnitter.herokuapp.com/api/profile/me', {
          method: 'GET',
          headers: {
             'x-auth-token': this.state.token 
          }
      }).then((res) => res.json())
      .then((data) => {
          this.setState({
              bio: data,
              errorMsg: data.msg == undefined ? "" : data.msg
          });
          result = data;
      })
      .catch((err) => {
          console.log(err + "error in getMyProfile()");
      });
      return result;
  }

  private createTweet = (e: any) => {
    e.preventDefault();
    fetch('https://fnitter.herokuapp.com/api/tweets', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-auth-token': this.state.token
    },
    body: JSON.stringify({
        text: this.state.valueTweet,
        tweetImage: this.state.valueTweetImg
    }),
    }).then((response) => response.json())
        .then((data) => {
        console.log('hej from createTweet()', data);
        this.fetchAllTweets().then(() => {
            console.log("fetched new tweets from createTweet()");
            this.setState({
                tweet: data,
                valueTweet: '',
                valueTweetImg: ''
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
  private handleChangeTweetImg = (event: any):void => {
    this.setState({
      valueTweetImg: event.target.value
    });
  } 

  //get logged in user
  private getUser = () => {
    fetch('https://fnitter.herokuapp.com/api/auth', {
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

  //see your own tweets'
  private fetchAllTweets = async () => {
    let result;
    await fetch('https://fnitter.herokuapp.com/api/tweets/all' , {
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

    private createBio = () => {
        fetch('https://fnitter.herokuapp.com/api/profile', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'x-auth-token': this.state.token
            },
            body: JSON.stringify({
            bio: this.state.bioValue
        }),
        })
        .then((res) => res.json())
        .then((data) => {
            this.getMyProfile().then(()=> {
                this.setState({
                createBioInfo: data,
                bioValue: '',
                displayBioInput: false
            });
            });
        })
        .catch((err) => {
            console.log(err + "error in createBio()");
        });
    }

    private commentOnTweet = (id: any):void => {
        fetch('https://fnitter.herokuapp.com/api/tweets/comment/' + id , {
        method: 'POST',
        headers: {
            'x-auth-token': this.state.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: this.state.commentValue
        }),
        }).then((res) => res.json())
        .then((data) => {
        console.log('hej from commentOnTweet()', data);
        this.fetchAllTweets().then(() => {
            console.log("fetched new tweets from commentOnTweet()");
            this.setState({
                    newCommentInfo: data,
                    commentValue: ''
                });
        });
        })
        .catch((err) => {
        console.log(err + "error in commentOnTweet()");
        })
  } 


  public render(): React.ReactElement<ITwitterProps> {

    return (
      <div className={ styles.twitter }>
        <div className={styles.ProfileContainer}>
            <hr />
        
            <UserView 
              user={this.state.user}
              errorMsg={this.state.errorMsg}
              bio={this.state.bio}
              displayBioInput={this.state.displayBioInput}
              handleChangeBio={this.handleChangeBio}
              bioValue={this.state.bioValue}
              hideEditBio={this.hideEditBio}
              showEditBio={this.showEditBio}
              createBio={this.createBio}
              following={this.state.following}
              followers={this.state.followers}
            />

            <NewTweetView 
              createTweet={this.createTweet}
              valueTweet={this.state.valueTweet}
              handleChangeTweet={this.handleChangeTweet}
              valueTweetImg={this.state.valueTweetImg}
              handleChangeTweetImg={this.handleChangeTweetImg}
            />

            <YourTweetsView
              allTweets={this.state.allTweets}
              user={this.state.user}
              displayCommentInput={this.displayCommentInput}
              displayArray={this.state.displayArray}
              commentValue={this.state.commentValue}
              handleChangeComment={this.handleChangeComment}
              hideCommentInput={this.hideCommentInput}
              commentOnTweet={this.commentOnTweet}
            />

        </div>
      </div>
    );
  }
}