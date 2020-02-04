import * as React from 'react';
import styles from './Twitter.module.scss';
import { ITwitterProps } from './ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Link, NavLink } from 'react-router-dom';

export default class HomeScreen extends React.Component<ITwitterProps, {}> {
  public render(): React.ReactElement<ITwitterProps> {
    return (
      <div className={ styles.twitter }>
        <div className={styles.HomeScreenContainer}>
            <h1> this is the home page</h1>
        </div>
      </div>
    );
  }
}



