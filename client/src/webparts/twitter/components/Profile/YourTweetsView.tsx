import * as React from 'react';
import styles from '../Twitter.module.scss';
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaRegCheckCircle, FaCog } from "react-icons/fa";

export default function YourTweetsView(props) {

    var renderYourTweets = props.allTweets.length == 0 || props.allTweets == null || props.allTweets == undefined 
    ? <p>Loading your tweets (or no tweets)</p>
    : props.allTweets.map(item => {
        return item.user == props.user._id
        ?   <div className={styles.yourTweets}>
                <img className={styles.img} src={item.avatar} />
                <span className={styles.name}>{item.name}</span><br/><br/><hr/>
                <p className={styles.text}>{item.text}</p>
                <img className={styles.imgTweet} src={item.tweetImage} />
                <span>
                    <FaRegHeart className={styles.likeButton}/>
                    <span className={styles.numberOfLikes}>{item.likes.length}</span>
                    <FaRegComment className={styles.commentButton} onClick={() => props.displayCommentInput(item._id)}/>
                    <span className={styles.numberOfLikes}>{item.comments.length}</span>
                </span>
                <span style={props.displayArray.find(id => id == item._id)  ? {display:'inline-block', position: "relative", maxWidth: '170px'} : {display: 'none'}}>
                    <input value={props.commentValue} onChange={props.handleChangeComment} className={styles.commentInput} type="text" placeholder="New comment" />
                    <IoMdCloseCircleOutline className={styles.closeButton} onClick={() => props.hideCommentInput(item._id)} />
                    {props.commentValue == "" ? "" : <FaRegCheckCircle className={styles.submitComment} onClick={() => props.commentOnTweet(item._id)} /> }
                </span>
                <span className={styles.date}>{item.date.slice(0,10)}</span>

                <div style={props.displayArray.find(id => id == item._id) ? {display:'block'} : {display: 'none'}}>
                  {item.comments.length == 0 ? "" : item.comments.map((item) => <div className={styles.commentSection}><img src={item.avatar} /><span className={styles.commentName}>{item.name}</span><br/><span className={styles.commentText}>{item.text}</span></div> )}
                </div>
            </div>
        : "";
    })

 return(
     <div>{renderYourTweets}</div>
 );
}


