import * as React from 'react';
import styles from './Twitter.module.scss';
import { ITwitterProps } from './ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Login from "./Login";
import Register from "./Register";
import { Route, BrowserRouter, Link } from 'react-router-dom';


export default class WelcomeScreen extends React.Component<ITwitterProps, {}> {
  public render(): React.ReactElement<ITwitterProps> {
    return (
    <BrowserRouter>
      <div className={ styles.twitter }>
        <div className={styles.WelcomeScreenContainer}>
            <h1>Welcome to twitter. this is the First page</h1>

            <Link Component={Login} exact to="/login">Login</Link>
            <Link Component={Register} exact to="/register">Make account</Link>

            <Route exact path='/login' component={Login}/>
            <Route exact path='/register' component={Register} /> 

        </div>
      </div>
    </BrowserRouter>
    );
  }
}



