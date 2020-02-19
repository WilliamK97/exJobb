import * as React from 'react';
import styles from '../Twitter.module.scss';
import { ITwitterProps } from '../ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Link, NavLink } from 'react-router-dom';
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {FaRegCheckCircle} from "react-icons/fa";
import UserView from "./UserView";
import TweetsView from "./TweetsView";
// import { Tweet } from "../apiDataLayer/Tweet"

export interface ITwitterStateHomeScreen{
    token: any;
    user: any;
    tweets: any;
    likeInfo: any;
    unLikeInfo: any;
    showCommentInput: any;
    isTweetLiked: any;
    commentValue: any;
    newCommentInfo: any;
    openComments: any;
    displayArray: any;
}

export default class HomeScreen extends React.Component<ITwitterProps, ITwitterStateHomeScreen,  {}> {

  constructor(props:ITwitterProps, state: ITwitterStateHomeScreen) {
    super(props);
    let tokenFromLS = localStorage.getItem('token');


    // let tweetclass = new Tweet();
    // console.log(tweetclass);
    // let renderTest = tweetclass.renderTweetsTest();
    // console.log(renderTest);


    this.state = {
        token: tokenFromLS,
        user: {},
        tweets: [],
        likeInfo: {},
        unLikeInfo: {},
        showCommentInput: false,
        isTweetLiked: '',
        commentValue: '',
        newCommentInfo: [],
        openComments: [],
        displayArray: [1]
    };
  }

  public componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.displayHomeScreen !== this.props.displayHomeScreen && this.props.displayHomeScreen == true) {
      console.log("component did show and update home");
      this.getUser();
      this.fetchTweetsFromPeopleYouFollow();
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

  private handleChangeComment = (event: any):void => {
    this.setState({
        commentValue: event.target.value
    });
  }

  private getUser = () => {
    fetch('https://fnitter.herokuapp.com/api/auth', {
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

  private fetchTweetsFromPeopleYouFollow = async () => {
    console.log("fetching tweets from people u follow from HomeScreen !!!!!!");
    let result;
    await fetch('https://fnitter.herokuapp.com/api/tweets', {
      method: 'GET',
      headers: {
      'x-auth-token': this.state.token
    }
    }).then((response) => response.json())
        .then((data) => {
        this.setState({
                tweets: data
            });
            result = data;
        })
        .catch((error) => {
            console.error(error + " error in fetchTweetsFromPeopleYouFollow()");
    });
    return result;
  }

  private likeTweet = (id:any):void => {
      fetch('https://fnitter.herokuapp.com/api/tweets/like/' + id , {
          method: 'PUT',
          headers: {
            'x-auth-token': this.state.token
        }
        }).then((response) => response.json())
            .then((data) => {
            console.log('hej from likeTweet()', data);
            this.fetchTweetsFromPeopleYouFollow().then(() => {
              console.log("fetched new tweets from liketweet()");
              this.setState({
                likeInfo: data
            });
            }) ;   
        })
        .catch((error) => {
            console.error(error + " error in likeTweet()");
    });
  }

  private unLikeTweet = (id:any):void => {
      fetch('https://fnitter.herokuapp.com/api/tweets/unlike/' + id , {
          method: 'PUT',
          headers: {
            'x-auth-token': this.state.token
        }
        }).then((response) => response.json())
            .then((data) => {
            console.log('hej from unLikeTweet()', data);
            this.fetchTweetsFromPeopleYouFollow().then(() => {
              console.log("fetched new tweets from unLiketweet()");
              this.setState({
                unLikeInfo: data
            });
            });
        })
        .catch((error) => {
            console.error(error + " error in unLikeTweet()");
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
      this.fetchTweetsFromPeopleYouFollow().then(() => {
        console.log("fetched new tweets from commentOnTweet()");
        this.setState({
                newCommentInfo: data,
                commentValue: ''
            });
      });
    })
    .catch((err) => {
      console.log(err + "error in commentOnTweet()");
    });
  } 

  public render(): React.ReactElement<ITwitterProps> {


    return (
      <div className={ styles.twitter }>
        <div className={styles.HomeScreenContainer}>
            <hr/>
            
            <div className={styles.user}>
              <UserView user={this.state.user} />
            </div>
            <br/>
            <div className={styles.tweets}>
              <TweetsView
                tweets={this.state.tweets}
                user={this.state.user}
                unLikeTweet={this.unLikeTweet}
                likeTweet={this.likeTweet}
                displayCommentInput={this.displayCommentInput}
                displayArray={this.state.displayArray}
                commentValue={this.state.commentValue}
                handleChangeComment={this.handleChangeComment}
                hideCommentInput={this.hideCommentInput}
                commentOnTweet={this.commentOnTweet}
              />
            </div>
        </div>
      </div>
    );
  }
}



