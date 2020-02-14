import * as React from 'react';
import styles from './Twitter.module.scss';
import { ITwitterProps } from './ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {FaRegCheckCircle, FaCog} from "react-icons/fa";

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
        newCommentInfo: []
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
      await fetch('https://local.william/api/profile/me', {
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
                tweet: data,
                valueTweet: ''
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

    private createBio = () => {
        fetch('https://local.william/api/profile', {
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

    if (this.props.displayProfileScreen) {
    console.log("profile screen is now showing")
    }else{
      console.log("profileScreen is now display: none")
    }

    var noProfileBio = this.state.errorMsg.length == 0
     ? ""
     : <div>{this.state.errorMsg}<FaCog onClick={this.showEditBio} className={styles.edit}/></div>

    var profileBio = this.state.bio == undefined || this.state.bio == null || this.state.bio.length == 0 
    ? ""
    : <h4>{this.state.bio.bio}</h4>;

    var user = this.state.user == null || this.state.user == undefined
        ? <p>Loading User</p>
        : <div className={styles.user}>
            <img className={styles.userImg} src={this.state.user.avatar} />
            <h2>Hi {this.state.user.name}</h2>
            {noProfileBio}
            {profileBio}
            {this.state.displayBioInput == true ? <div><input className={styles.bioInput} onChange={this.handleChangeBio} value={this.state.bioValue} type="text" placeholder="write a bio"/><IoMdCloseCircleOutline className={styles.closeBioInput} onClick={this.hideEditBio}/></div>: ""}
            {this.state.bioValue == 0 ? "" : <input className={styles.submitBio} type="button" value="create" onClick={this.createBio}/>}
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
                <span className={styles.name}>{item.name}</span><br/><br/><hr/>
                <p className={styles.text}>{item.text}</p><br />
                <span>
                    <FaRegHeart className={styles.likeButton}/>
                    <span className={styles.numberOfLikes}>{item.likes.length}</span>
                    <FaRegComment className={styles.commentButton} onClick={() => this.displayCommentInput(item._id)}/>
                    <span className={styles.numberOfLikes}>{item.comments.length}</span>
                </span>
                <span style={this.state.displayArray.find(id => id == item._id)  ? {display:'inline-block', position: "relative", maxWidth: '170px'} : {display: 'none'}}>
                    <input value={this.state.commentValue} onChange={this.handleChangeComment} className={styles.commentInput} type="text" placeholder="New comment" />
                    <IoMdCloseCircleOutline className={styles.closeButton} onClick={() => this.hideCommentInput(item._id)} />
                    {this.state.commentValue == "" ? "" : <FaRegCheckCircle className={styles.submitComment} onClick={() => this.commentOnTweet(item._id)} /> }
                </span>
                <span className={styles.date}>{item.date.slice(0,10)}</span>

                <div style={this.state.displayArray.find(id => id == item._id) ? {display:'block'} : {display: 'none'}}>
                  {item.comments.length == 0 ? "" : item.comments.map((item) => <div className={styles.commentSection}><img src={item.avatar} /><span className={styles.commentName}>{item.name}</span><br/><span className={styles.commentText}>{item.text}</span></div> )}
                </div>
            </div>
        : "";
    });

    

    return (
      <div className={ styles.twitter }>
        <div className={styles.ProfileContainer}>
            <hr />
            {user}
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