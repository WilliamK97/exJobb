import * as React from 'react';
import styles from '../Twitter.module.scss';

export default function SearchUserView(props) {
    return(
        <form onSubmit={props.handleSearch}>
            <input name="testtest" id="search" value={props.searchValue} onChange={props.handleChangeSearch} className={styles.searchInput} type="text" placeholder="Search"/>
            <div>
                <input className={styles.searchButton} type="submit" value="Search" />
            </div>
        </form>
    );
}