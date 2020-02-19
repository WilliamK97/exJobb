import * as React from 'react';
import styles from '../Twitter.module.scss';

export default function AllUsersView(props) {

    var renderSearchedUsersOrAllUsers = props.searchFilter == null || props.searchFilter.length == 0 || props.searchFilter == undefined 
    ? <p>Loading all users </p>
    : props.searchFilter.map((item) => {
        return (
            <div className={styles.oneUser} style={item._id == props.loggedInUser._id ? {display:'none'} : {display: 'block'} }>
              <img className={styles.allUsersImg} src={item.avatar} />
              <span className={styles.allUserNames}>{item.name}</span> 
              {props.loggedInUser.following && props.loggedInUser.following.find(user => user.user === item._id) 
              ? props.disableButtonId == item._id ? <input disabled onClick={() => props.unFollowUser(item._id)} className={styles.unfollowUser} type="button" value="Unfollow" /> : <input onClick={() => props.unFollowUser(item._id)} className={styles.unfollowUser} type="button" value="Unfollow" />
              : props.disableButtonId == item._id ? <input disabled onClick={() => props.followUser(item._id)} className={styles.followUser} type="button" value="Follow" /> : <input onClick={() => props.followUser(item._id)} className={styles.followUser} type="button" value="Follow" /> }
            </div>
        );
    })
    
    return(
        <>{renderSearchedUsersOrAllUsers}</>
 );
}


