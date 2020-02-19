import * as React from 'react';
import styles from '../Twitter.module.scss';
import { ITwitterProps } from '../ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import SearchUserView from "./SearchUserView"
import AllUsersView from "./AllUsersView"

export interface ITwitterState{
    searchValue: any;
    token: any;
    allUsers: any;
    searchFilter: any;
    loggedInUser: any;
    followUserMsg: any;
    unFollowUserMsg: any;
    disableButtonId: any;
}

// var apiUrl =  "https://local.william/api/";

export default class Search extends React.Component<ITwitterProps, ITwitterState,  {}> {

// const apiUrl = "https://fnitter.herokuapp.com/api/";

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
      unFollowUserMsg: '',
      disableButtonId: undefined,

    };
  }

  private handleChangeSearch = (event: any):void => {
    this.setState({
        searchValue: event.target.value
    });
  }


  public componentDidUpdate = (prevProps, prevState) => {
    //lägg in && prevProps.displaySearchScreen !== this.props.displaySearchScreen
    if (prevProps.displaySearchScreen !== this.props.displaySearchScreen && this.props.displaySearchScreen == true) {
      console.log("component did mount search");
      this.getAllUsers();
      this.getLoggedInUser();
    }
  }

  private getLoggedInUser = () => {
    fetch('https://fnitter.herokuapp.com/api/auth', {
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

  private getAllUsers = async () => {
      let result;
      await fetch('https://fnitter.herokuapp.com/api/users/all', {
      method: 'GET',
      headers: {
      'x-auth-token': this.state.token
    }
    }).then((response) => response.json())
        .then((data) => {
          console.log(2);
          console.log('response from users/all', data);
        this.setState({
                allUsers: data,
                searchFilter: data,

            });
            result = data;
        })
        .catch((error) => {
            console.error(error + " error in getAllUser()");
    });
    return result;
  }

  public handleSearch = (e) => {
    e.preventDefault();
    const search = this.state.searchValue;

    if(search !== "") {
        this.setState({
            searchFilter: this.state.searchFilter.filter(item => item.name.toLowerCase().includes(search.toLowerCase())),
        });
    } else {
        this.setState({
            searchFilter: this.state.allUsers
        });
    }
  }

  //follow fetch

  private followUser = async (id: any) => {
    await this.disablePerson(id)
    console.log(this.state.disableButtonId);
    console.log("clicked on follow");
    fetch('https://fnitter.herokuapp.com/api/users/follow/' + id, {
      method: 'PUT',
      headers: {
      'x-auth-token': this.state.token
    }
    }).then((response) => response.json())
        .then((data) => {
          console.log('hej from followUser()', data);
          this.getAllUsers().then(() => {
            console.log("fetched new users from followUser()");
            this.getLoggedInUser();
            this.setState({
                followUserMsg: data,
                disableButtonId: undefined
            });
          });  
        })
        .catch((error) => {
            console.error(error + " error in followUser()");
    });
  }

  private disablePerson = (id: any) => {
    this.setState({
      disableButtonId : id
    });
  }

  //unfollow fetch
  private unFollowUser = async (id: any) => {
    await this.disablePerson(id)
    console.log(this.state.disableButtonId);
    console.log("clicked on unfollow",id);
    fetch('https://fnitter.herokuapp.com/api/users/unfollow/' + id, {
      method: 'PUT',
      headers: {
      'x-auth-token': this.state.token
    }
    }).then((response) => response.json())
        .then((data) => {
          console.log(1);       
          this.getAllUsers().then(() => {
            this.getLoggedInUser();
            console.log(3);
            console.log(this.state.searchFilter);
            this.setState({
                unFollowUserMsg: data,
                disableButtonId: undefined
            });
          });
        })
        .catch((error) => {
            console.error(error + " error in unFollowUser()");
    });
  }

  //clean, bundle --ship ,gulp package-solution --ship

  public render(): React.ReactElement<ITwitterProps> {

    return (
      <div className={ styles.twitter }>
        <div className={styles.searchComponent}>
            <hr/>
            <h2>Search Users</h2>

            <SearchUserView
              handleSearch={this.handleSearch}
              searchValue={this.state.searchValue}
              handleChangeSearch={this.handleChangeSearch}
            />
            
            <div className={styles.allUsers}>
            <h2>Users</h2>
              <AllUsersView
                searchFilter={this.state.searchFilter}
                loggedInUser={this.state.loggedInUser}
                disableButtonId={this.state.disableButtonId}
                unFollowUser={this.unFollowUser}
                followUser={this.followUser}
              />
            </div>
        </div>
      </div>
    );
  }
}
