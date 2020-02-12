import * as React from 'react';
import styles from './Twitter.module.scss';
import { ITwitterProps } from './ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Link, NavLink } from 'react-router-dom';
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {FaRegCheckCircle} from "react-icons/fa";

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

  public componentDidMount = () => {
      this.getUser();
      this.fetchTweetsFromPeopleYouFollow();
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

  private fetchTweetsFromPeopleYouFollow = async () => {
    let result;
    await fetch('https://local.william/api/tweets', {
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
      fetch('https://local.william/api/tweets/like/' + id , {
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
      fetch('https://local.william/api/tweets/unlike/' + id , {
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
    fetch('https://local.william/api/tweets/comment/' + id , {
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

    console.log(this.state.commentValue);

    var user = this.state.user == null || this.state.user == undefined
    ? <p>Loading User</p>
    : <div className={styles.user}>
        <img className={styles.userImg} src={this.state.user.avatar} />
        <h2>Hi {this.state.user.name}</h2>
    </div>;

    var tweets = this.state.tweets == null || this.state.tweets == undefined || this.state.tweets.length == 0
    ? <h4 className={styles.loadingTweets}>Loading tweets</h4>
    : this.state.tweets.map((subarray) => {
        return subarray.map((item) => {
            return (
            <div className={styles.tweet}>
                <img className={styles.img} src={item.avatar} />
                <span className={styles.name}>{item.name}</span><br/>
                <span className={styles.userName}>@{item.name}</span><br />
                <hr />
                <p className={styles.text}>{item.text}</p>
                <span>
                  {item.likes.find(id => id.user == this.state.user._id) ? <span><FaRegHeart className={styles.unLikeButton} onClick={() => this.unLikeTweet(item._id)}/></span> : <span><FaRegHeart className={styles.likeButton} onClick={() => this.likeTweet(item._id)}/></span>} 
                  <span className={styles.numberOfLikes}>{item.likes.length}</span>
                </span>
                <span><FaRegComment className={styles.commentButton} onClick={() => this.displayCommentInput(item._id)} /><span className={styles.numberOfLikes}>{item.comments.length}</span></span>
                <span style={this.state.displayArray.find(id => id == item._id)  ? {display:'inline-block', position: "relative", maxWidth: '170px'} : {display: 'none'}}>
                    <input value={this.state.commentValue} onChange={this.handleChangeComment} className={styles.commentInput} type="text" placeholder="New comment" />
                    <IoMdCloseCircleOutline className={styles.closeButton} onClick={() => this.hideCommentInput(item._id)} />
                    {this.state.commentValue == "" ? "" : <FaRegCheckCircle className={styles.submitComment} onClick={() => this.commentOnTweet(item._id)} /> }
                </span>
                <span className={styles.date}>{item.date.slice(0,10)}</span>


                {/* ////////////////comment section//////////////// */}
                <div style={this.state.displayArray.find(id => id == item._id) ? {display:'block'} : {display: 'none'}}>
                  {item.comments.length == 0 ? "" : item.comments.map((item) => <div className={styles.commentSection}><img src={item.avatar} /><span className={styles.commentName}>{item.name}</span><br/><span className={styles.commentText}>{item.text}</span></div> )}
                </div>
            </div>
            );
        });
    });

    return (
      <div className={ styles.twitter }>
        <div className={styles.HomeScreenContainer}>
            <hr/>
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



