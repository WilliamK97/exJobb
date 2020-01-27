import * as React from 'react';
import styles from './Twitter.module.scss';
import { ITwitterProps } from './ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Login from "./Login";


export default class Twitter extends React.Component<ITwitterProps, {}> {
  public render(): React.ReactElement<ITwitterProps> {
    return (
      <div className={ styles.twitter }>
        <div className={styles.container}>
          <Login />
        </div>
      </div>
    );
  }
}
