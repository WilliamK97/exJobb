import * as React from 'react';
import styles from './Twitter.module.scss';
import { ITwitterProps } from './ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Login from "./Login";
import WelcomeScreen from "./WelcomeScreen";
import 'bootstrap/dist/css/bootstrap.min.css';


export default class Twitter extends React.Component<ITwitterProps, {}> {
  public render(): React.ReactElement<ITwitterProps> {
    return (
      <div className={ styles.twitter }>
        <div className={styles.TwitterContainer}>
          <WelcomeScreen />
        </div>
      </div>
    );
  }
}

