import * as React from 'react';
import styles from '../Twitter.module.scss';
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {FaRegCheckCircle} from "react-icons/fa";

export default function TweetsView(props) {

    var tweets = props.tweets == null || props.tweets == undefined || props.tweets.length == 0
    ? <h5 className={styles.loadingTweets}>Loading tweets (or no tweets from your followers)</h5>
    : props.tweets.map((subarray) => {
        return subarray.map((item) => {
            return (
            <div className={styles.tweet}>
                <img className={styles.img} src={item.avatar} />
                <span className={styles.name}>{item.name}</span><br/>
                <span className={styles.userName}>@{item.name}</span><br />
                <hr />
                <p className={styles.text}>{item.text}</p>
                <img className={styles.imgTweet} src={item.tweetImage} />
                <span>
                  {item.likes.find(id => id.user == props.user._id) ? <span><FaRegHeart className={styles.unLikeButton} onClick={() => props.unLikeTweet(item._id)}/></span> : <span><FaRegHeart className={styles.likeButton} onClick={() => props.likeTweet(item._id)}/></span>} 
                  <span className={styles.numberOfLikes}>{item.likes.length}</span>
                </span>
                <span><FaRegComment className={styles.commentButton} onClick={() => props.displayCommentInput(item._id)} /><span className={styles.numberOfLikes}>{item.comments.length}</span></span>
                <span style={props.displayArray.find(id => id == item._id)  ? {display:'inline-block', position: "relative", maxWidth: '170px'} : {display: 'none'}}>
                    <input value={props.commentValue} onChange={props.handleChangeComment} className={styles.commentInput} type="text" placeholder="New comment" />
                    <IoMdCloseCircleOutline className={styles.closeButton} onClick={() => props.hideCommentInput(item._id)} />
                    {props.commentValue == "" ? "" : <FaRegCheckCircle className={styles.submitComment} onClick={() => props.commentOnTweet(item._id)} /> }
                </span>
                <span className={styles.date}>{item.date.slice(0,10)}</span>


                {/* ////////////////comment section//////////////// */}
                <div style={props.displayArray.find(id => id == item._id) ? {display:'block'} : {display: 'none'}}>
                  {item.comments.length == 0 ? "" : item.comments.map((item) => <div className={styles.commentSection}><img src={item.avatar} /><span className={styles.commentName}>{item.name}</span><br/><span className={styles.commentText}>{item.text}</span></div> )}
                </div>
            </div>
            );
        });
    })
    
    return(
        <>{tweets}</>
 );
}



















