import React, {Component} from 'react';

export default class LoginPage extends Component {

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
    };
  }

  onEmailChange = () => {
    this.setState({email: event.target.value});
  }

  onPasswordChange = (event) => {
    this.setState({password: event.target.value});
  }

  onSubmit = (event) => {
    event.preventDefault();
    console.log('Submitting');
  }

  render() {
    return (
      <div className='login layout__login'>
        <form className='login--form' onSubmit={this.onSubmit}>
          <label className='login--label' htmlFor='email'>Email:</label>
          <input id='email' className='login--input' name='email' type='email' onChange={this.onEmailChange}/>

          <label className='login--label' htmlFor='password'>Password:</label>
          <input id='password' className='login--input' name='password' type='password' onChange={this.onPasswordChange}/>

          <input className='login--submit' type='submit' value='Log In'/>
        </form>
      </div>
    );
  }
}
