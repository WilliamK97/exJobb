import * as React from 'react';
import styles from './Twitter.module.scss';
import { ITwitterProps } from './ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';

export interface ITwitterState{
    searchValue: any;
    token: any;
    allUsers: any;
    searchFilter: any;
    loggedInUser: any;
    followUserMsg: any;
    unFollowUserMsg: any;
}


export default class Search extends React.Component<ITwitterProps, ITwitterState,  {}> {

constructor(props:ITwitterProps, state: ITwitterState) {
    super(props);
    var tokenLS = localStorage.getItem('token'); 
    this.state = { 
      searchValue: '',
      token: tokenLS,
      allUsers: [],
      searchFilter: [],
      loggedInUser: {},
      followUserMsg: '',
      unFollowUserMsg: ''
    };
  }

  
  private handleChangeSearch = (event: any):void => {
    this.setState({
        searchValue: event.target.value
    });
  }

  public componentDidMount = () => {
    this.getAllUsers();
    this.getLoggedInUser();
  }

  // om current logged in id är lika med någon users followes id så ska det stå unfollow
  private getLoggedInUser = () => {
    fetch('https://local.william/api/auth', {
      method: 'GET',
      headers: {
      'x-auth-token': this.state.token
    }
    }).then((response) => response.json())
        .then((data) => {
        this.setState({
                loggedInUser: data
            });
        })
        .catch((error) => {
            console.error(error + " error in getLoggedInUser()");
    });
  }

  private getAllUsers = () => {
    fetch('https://local.william/api/users/all', {
      method: 'GET',
      headers: {
      'x-auth-token': this.state.token
    }
    }).then((response) => response.json())
        .then((data) => {
        this.setState({
                allUsers: data,
                searchFilter: data
            });
        })
        .catch((error) => {
            console.error(error + " error in getAllUser()");
    });
  }

  handleSearch = (e) => {
    e.preventDefault();
    const search = this.state.searchValue;

    if(search !== "") {
        this.setState({
            searchFilter: this.state.searchFilter.filter(item => item.name.toLowerCase().includes(search.toLowerCase())),
        });
    } else {
        this.setState({
            searchFilter: this.state.allUsers
        })
    }
  }

  //follow fetch

  private followUser = (id: any) => {
    console.log("clicked on follow");
    fetch('https://local.william/api/users/follow/' + id, {
      method: 'PUT',
      headers: {
      'x-auth-token': this.state.token
    }
    }).then((response) => response.json())
        .then((data) => {
        this.setState({
                followUserMsg: data
            });
        })
        .catch((error) => {
            console.error(error + " error in followUser()");
    });
  }

  //unfollow fetch
  private unFollowUser = (id: any) => {
    console.log("clicked on unfollow");
    fetch('https://local.william/api/users/unfollow/' + id, {
      method: 'PUT',
      headers: {
      'x-auth-token': this.state.token
    }
    }).then((response) => response.json())
        .then((data) => {
        this.setState({
                unFollowUserMsg: data
            });
        })
        .catch((error) => {
            console.error(error + " error in unFollowUser()");
    });
  }

  public render(): React.ReactElement<ITwitterProps> {

    //get all id´s from users followes
    var idArray = [];
    var getAllIdsFromAllUsersFollowers = this.state.allUsers.map(item => {
      return item.followers.map(id => {
        return idArray.push(id.user)
      })
    })

    //filter currrentUsersfollowing
    var filterCurrentUsersFollowing = idArray.filter(id => {
      return id == this.state.loggedInUser._id
    })


    var renderSearchedUsersOrAllUsers = this.state.searchFilter == null || this.state.searchFilter.length == 0 || this.state.searchFilter == undefined 
    ? <p>Loading all users </p>
    : this.state.searchFilter.map((item) => {
        return (
            <div className={styles.oneUser}>
              {/* <p>{item.avatar}</p> */}
              <img className={styles.allUsersImg} src={item.avatar} />
              <span className={styles.allUserNames}>{item.name}</span>
              
              {item.followers.find(id => id.user == this.state.loggedInUser._id) ? <input onClick={() => this.unFollowUser(item._id)} className={styles.unfollowUser} type="button" value="Unfollow" /> : <input onClick={() => this.followUser(item._id)} className={styles.followUser} type="button" value="Follow" /> }


            </div>
        )
    })

    return (
      <div className={ styles.twitter }>
        <div className={styles.searchComponent}>
            <hr/>
            <h2>Search Users</h2>
            
            <form onSubmit={this.handleSearch}>
                <input id="search" value={this.state.searchValue} onChange={this.handleChangeSearch} className={styles.searchInput} type="search" placeholder="Search"/>
                <div>
                    <input className={styles.searchButton} type="submit" value="Search" />
                </div>
            </form>

            <div className={styles.allUsers}>
            <h2>Users</h2>
                {renderSearchedUsersOrAllUsers}
            </div>

        </div>
      </div>
    );
  }
}
