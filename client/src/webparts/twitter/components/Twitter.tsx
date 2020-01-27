import * as React from 'react';
import styles from './Twitter.module.scss';
import { ITwitterProps } from './ITwitterProps';
import { escape } from '@microsoft/sp-lodash-subset';

export interface ITwitterState{
  valueEmail: any,
  valuePassword: any
}

export default class Twitter extends React.Component<ITwitterProps, ITwitterState, {}> {

  constructor(props:ITwitterProps, state: ITwitterState) {
    super(props);
    this.state = {
      valueEmail: '',
      valuePassword: ''
    };
  }

  private handleChangeEmail = (event: any):void => {
    this.setState({
        valueEmail: event.target.value
      });
  }

  private handleChangePassword = (event: any):void => {
    this.setState({
      valuePassword: event.target.value
    });
  }

  private handleSubmit = (event) => {
    event.preventDefault();
    console.log('A email was submitted: ' + this.state.valueEmail);
    console.log('A password was submitted: ' + this.state.valuePassword);
  }

  public render(): React.ReactElement<ITwitterProps> {
    return (
      <div className={ styles.twitter }>
        <div>
          <h1>twitter</h1>
          <p>welcome to twitter</p>

          <form onSubmit={this.handleSubmit}>
            <label>Email:
              <input type="text" name="email" value={this.state.valueEmail} onChange={this.handleChangeEmail} />
            </label>
            <label>Password:
              <input type="text" name="pw" value={this.state.valuePassword} onChange={this.handleChangePassword} />
            </label>
            <input type="submit" value="Submit" />
          </form>

        </div>
      </div>
    );
  }
}
