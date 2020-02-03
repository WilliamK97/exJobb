import * as React from 'react';
import styles from './Twitter.module.scss';
import { ITwitterProps } from './ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Login from "./Login";
import Register from "./Register";
import { Link, NavLink } from 'react-router-dom';
import WelcomeScreen from "./WelcomeScreen";

export default class HomeScreen extends React.Component<ITwitterProps, {}> {
  public render(): React.ReactElement<ITwitterProps> {
    return (
      <div className={ styles.twitter }>
        <div className={styles.HomeScreenContainer}>
            <p> this is the home page</p>
            <Link Component={WelcomeScreen} to="/">Back to Welcome page</Link>
        </div>
      </div>
    );
  }
}



