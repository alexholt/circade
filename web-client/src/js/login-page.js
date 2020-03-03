import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class LoginPage extends Component {

  constructor() {
    super();
    this.server = SERVER;
    this.state = {
      email: '',
      password: '',
      message: 'Welcome to Circade!',
      hasError: false,
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
      // Handle
    } else if (res.status == 'failure') {
      this.setState({hasError: true, message: res.message});
    }
  }

  onSubmit = (event) => {
    event.preventDefault();
    const url = this.server + '/login';
    const body = JSON.stringify({
      email: this.state.email,
      password: this.state.password,
    });

    const headers = {
      'Content-Type': 'application/json',
    };

    const request = fetch(url, {method: 'POST', mode: 'cors', body, headers});

    request
      .then(res => res.json())

      .then(res => this.handleResponse(res))

      .catch(err => {
        this.setState({
          message: err.message,
          hasError: true,
        });
      });
  }

  render() {
    return (
      <div className='login layout__login layout--rhythm'>
        <img src='/img/logo.svg'/>

        <h4 className={this.state.hasError ? 'text--error' : ''}>{this.state.message}</h4>

        <form className='login--form' onSubmit={this.onSubmit}>
          <label className='login--label' htmlFor='email'>Email:</label>
          <input id='email' className='login--input' name='email' type='email' onChange={this.onEmailChange}/>

          <label className='login--label' htmlFor='password'>Password:</label>

          <input id='password' className='login--input'
            name='password' type='password' onChange={this.onPasswordChange}/>

          <input className='login--submit' type='submit' value='Log In'/>
        </form>

        <Link className='text--small' to='/create-account'>Don't have an account?</Link>
      </div>
    );
  }
}
