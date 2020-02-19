import * as React from 'react';
import styles from '../Twitter.module.scss';

export default function UserView(props) {

    var user = props.user == null || props.user == undefined
    ? <p>Loading User</p>
    : <div className={styles.user}>
        <img className={styles.userImg} src={props.user.avatar} />
        <h2>Hi {props.user.name}</h2>
    </div>;

    return(
        <>{user}</>
 );
}


