import * as React from 'react';
import styles from './Twitter.module.scss';
import { ITwitterProps } from './ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Link, NavLink } from 'react-router-dom';
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";

export interface ITwitterStateHomeScreen{
    token: any;
    user: any;
    tweets: any;
    likeInfo: any;
    showCommentInput: any;
    isTweetLiked: any;
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
        showCommentInput: false,
        isTweetLiked: ''
    };
  }

  public componentDidMount = () => {
      this.getUser();
      this.fetchTweetsFromPeopleYouFollow();
  }

  public displayCommentInput = (id: any) => {
      console.log(id);
      this.setState({
          showCommentInput: true
    })
  } 

  public hideCommentInput = (id: any) => {
      console.log(id);
      this.setState({
          showCommentInput: false
    })
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

  private likeTweet = (id:any):void => {
      fetch('https://local.william/api/tweets/like/' + id , {
          method: 'PUT',
          headers: {
            'x-auth-token': this.state.token
        }
        }).then((response) => response.json())
            .then((data) => {
            this.setState({
                likeInfo: data
            });
        })
        .catch((error) => {
            console.error(error + " error in likeTweet()");
    });
  }

  public render(): React.ReactElement<ITwitterProps> {

    console.log(this.state.likeInfo.msg);
    console.log(this.state.user.following);


    var user = this.state.user == null || this.state.user == undefined
    ? <p>Loading User</p>
    : <div className={styles.user}>
        <h1>Hi {this.state.user.name}</h1>
        <img className={styles.userImg} src={this.state.user.avatar} />
        <p>{this.state.user.email}</p>
        {/* <p>Followers: {this.state.user.followers.length == undefined ? <p>0 followers</p> : this.state.user.followers.length} </p> */}
        {/* <p>Following: {this.state.user.following.length}</p>  */}
    </div>

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
                <span><FaRegHeart className={styles.likeButton} onClick={() => this.likeTweet(item._id)}/><span className={styles.numberOfLikes}>{item.likes.length}</span></span>
                <span><FaRegComment className={styles.commentButton} onClick={() => this.displayCommentInput(item._id)} /></span>
                <span style={this.state.showCommentInput == true ? {display:'inline-block'} : {display: 'none'}}>
                    <input className={styles.commentInput} type="text" placeholder="New comment" />
                    <IoMdCloseCircleOutline className={styles.closeButton} onClick={() => this.hideCommentInput(item._id)} />
                </span>
                <span className={styles.date}>{item.date.slice(0,10)}</span>
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



