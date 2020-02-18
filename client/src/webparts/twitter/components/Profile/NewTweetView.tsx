import * as React from 'react';
import styles from '../Twitter.module.scss';

export default function NewTweetView(props) {

    return(
        <form className={styles.tweetForm} onSubmit={props.createTweet}>
              <div>
                <h4>Tweet something</h4>
                <input className={styles.tweetInput} type="text" name="tweet" value={props.valueTweet} onChange={props.handleChangeTweet} /> 
                <p className={styles.tweetInputImgText}>Add picture or GIF url (optional)</p>
                <input className={styles.tweetInputImg} type="text" name="tweetPicUrl" value={props.valueTweetImg} onChange={props.handleChangeTweetImg} /> 
              </div>
              <br/>
              <input className={styles.submitButton} type="submit" value="Tweet" />
        </form>
 );
}


