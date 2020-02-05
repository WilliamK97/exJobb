import * as React from 'react';
import styles from './Twitter.module.scss';
import { ITwitterProps } from './ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';

export interface ITwitterState{
    searchValue: any;
    token: any;
    allUsers: any;
}


export default class Search extends React.Component<ITwitterProps, ITwitterState,  {}> {

constructor(props:ITwitterProps, state: ITwitterState) {
    super(props);
    var tokenLS = localStorage.getItem('token'); 
    this.state = { 
      searchValue: '',
      token: tokenLS,
      allUsers: []
    };
  }


  //handleChange
  private handleChangeSearch = (event: any):void => {
    this.setState({
        searchValue: event.target.value
    });
  }

  //handleSearch

  //fetch all users
  public componentDidMount = () => {
    this.getAllUsers();
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
                allUsers: data
            });
        })
        .catch((error) => {
            console.error(error + " error in getAllUser()");
    });
  }

  public render(): React.ReactElement<ITwitterProps> {

    var allUsers = this.state.allUsers == null || this.state.allUsers.length == 0 || this.state.allUsers == undefined 
    ? <p>Loading all users </p>
    : this.state.allUsers.map((item) => {
        return (
            <div className={styles.oneUser}>
                {/* <p>{item.avatar}</p> */}
                <img className={styles.allUsersImg} src={item.avatar} />
                <span className={styles.allUserNames}>{item.name}</span>
                <input className={styles.followUser} type="button" value="Follow" />
            </div>
        )
    })

    return (
      <div className={ styles.twitter }>
        <div className={styles.searchComponent}>
            <hr/>
            <h2>Search Users</h2>
            
            <form>
                <input value={this.state.searchValue} onChange={this.handleChangeSearch} className={styles.searchInput} type="text" placeholder="Search"/>
                <div>
                    <input className={styles.searchButton} type="submit" value="Search" />
                </div>
            </form>

            <div className={styles.allUsers}>
            <h2>Users</h2>
                {allUsers}
            </div>

        </div>
      </div>
    );
  }
}
