import * as React from 'react';
import styles from '../Twitter.module.scss';
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {FaRegCheckCircle, FaCog} from "react-icons/fa";

export default function UserView(props) {

    var noProfileBio = props.errorMsg.length == 0
     ? ""
     : <div>{props.errorMsg}<FaCog onClick={props.showEditBio} className={styles.edit}/></div>

    var profileBio = props.bio == undefined || props.bio == null || props.bio.length == 0 
    ? ""
    : <h4>{props.bio.bio}</h4>;

    var user = props.user == null || props.user == undefined
        ? <p>Loading User</p>
        : <div className={styles.user}>
            <img className={styles.userImg} src={props.user.avatar} />
            <h2>Hi {props.user.name}</h2>
            {noProfileBio}
            {profileBio}
            {props.displayBioInput == true ? <div><input className={styles.bioInput} onChange={props.handleChangeBio} value={props.bioValue} type="text" placeholder="write a bio"/><IoMdCloseCircleOutline className={styles.closeBioInput} onClick={props.hideEditBio}/></div>: ""}
            {props.bioValue == 0 ? "" : <input className={styles.submitBio} type="button" value="create" onClick={props.createBio}/>}
            <p>{props.user.email}</p>
            <p>Number of users you follow: {props.following.length} </p>
            <p>Number of followers: {props.followers.length} </p>
        </div>;


    return(
        <div>{user}</div>
 );
}


