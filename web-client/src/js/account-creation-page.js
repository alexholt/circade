import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {get, post} from './easy-fetch';

export default class AccountCreationPage extends Component {

  constructor(props) {
    super(props);
    this.server = SERVER;
    this.state = {
      email: '',
      password: '',
      message: 'Create an account to get started.',
      hasError: false,
      hasCompleted: false,
    };
  }

  onEmailChange = () => {
    this.setState({email: event.target.value});
  }

  onPasswordChange = (event) => {
    this.setState({password: event.target.value});
  }

  handleResponse(res) {
    if (res.status == 'success') {
      const message = 'Click the registration link you have received in your email.';
      this.setState({hasError: false, hasCompleted: true, message});
    } else if (res.status == 'failure') {
      this.setState({hasError: true, message: res.message});
    }
  }

  onSubmit = (event) => {
    event.preventDefault();
    const url = this.server + '/login';
    const body = {
      email: this.state.email,
      password: this.state.password,
    };

    const request = post('/login', {body});

    request
      .then(res => this.handleResponse(res))

      .catch(err => {
        this.setState({
          message: err.message,
          hasError: true,
        });
      });
  }

  form() {
    return (
      <form className='login--form' onSubmit={this.onSubmit}>
        <label className='login--label' htmlFor='email'>Email:</label>
        <input id='email' className='login--input' name='email' type='email' onChange={this.onEmailChange}/>

        <label className='login--label' htmlFor='password'>Password:</label>

        <input id='password' className='login--input'
      name='password' type='password' onChange={this.onPasswordChange}/>

        <input className='login--submit' type='submit' value='Log In'/>
      </form>
    );
  }

  alreadyHaveAccountLink() {
    return <Link className='text--small' to='/login'>Already have an account?</Link>;
  }

  render() {
    return (
      <div className='login layout__login layout--rhythm'>
        <img src='/img/logo.svg'/>

        <h4 className={this.state.hasError ? 'text--error' : ''}>{this.state.message}</h4>

        {this.state.hasCompleted ? null : this.form()}
        {this.state.hasCompleted ? null : this.alreadyHaveAccountLink()}

      </div>
    );
  }
}
