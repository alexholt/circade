import React, {Component} from 'react';

import Calendar from './calendar';
import LoginPage from './login-page';
import moment from 'moment';
import Notepad from './notepad';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useParams,
  Redirect,
} from 'react-router-dom';

import {get} from './easy-fetch';

export default class App extends Component {

  constructor() {
    super();

    this.server = SERVER;

    this.state = {
      selectedDate: moment(),
      isLoggedIn: false,
      notes: [
        {
          content: 'hello hello',
          type: 'flag',
          id: '1',
        },
      ],
    };
  }

  calendar = () => {
    const history = useHistory();

    const onDateSelected = (selectedDate) => {
      const year = selectedDate.format('YYYY');
      const month = selectedDate.format('MM');
      const day = selectedDate.format('DD');

      history.push(`/journal/${year}/${month}/${day}`);

      this.setState({
        selectedDate,
      });
    };

    return (
      <Calendar
        selectedDate={this.state.selectedDate} onDateSelected={onDateSelected}
      />
    );
  }


  onNoteUpdate = (note) => {
    const notes = this.state.notes;
    const found = notes.find(search => search.id = note.id);

    if (!found) {
      note.id = 99;
      notes.push(note);
    } else {
      found.content = note.content;
      found.type = note.type;
    }

    this.setState({notes});
  }

  journalRoute = () => {

    const Calendar = this.calendar;

    return (
      <div className='layout'>
        <Calendar/>
        <Notepad
          title={this.state.selectedDate.format('dddd LL')}
          notes={this.state.notes}
          onNoteUpdate={this.onNoteUpdate}
        />
      </div>
    );
  }

  loginPageWithRedirect = () => {
    let history = useHistory();

    const onLogIn = () => {
      this.setState({
        isLoggedIn: true,
      });

      history.push('/journal');
    };

    return <LoginPage onSuccess={onLogIn}/>;
  }

  checkIfLoggedIn = () => {
    let history = useHistory();

    get('/login').then(res => {
      if (res.status == 'success') {
        this.setState({isLoggedIn: true});
        history.push('/journal');
      } else {
        history.push('/login');
      }
    });

    return <div>Loading...</div>;
  }

  logout = () => {
    let history = useHistory();

    get('/logout').then(res => {
      this.setState({isLoggedIn: false});
      history.push('/login');
    });

    return <div></div>;
  }

  render() {
    const Journal = this.journalRoute;
    const LogOut = this.logout;
    const LoginPage = this.loginPageWithRedirect;
    const CheckIfLoggedIn = this.checkIfLoggedIn;

    const year = moment().format('YYYY');
    const month = moment().format('MM');
    const day = moment().format('DD');

    const Year = function () {
      let { year } = useParams();
      return <div>{year}</div>;
    };

    return (
      <Router>
        <Switch>

          <Route path="/login">
            <LoginPage/>
          </Route>

          <Route path="/logout">
            <LogOut/>
          </Route>

          <Route path="/journal/:year/:month/:day">
            {this.state.isLoggedIn ? <Journal/> : <CheckIfLoggedIn/>}
          </Route>

          <Route path="/journal">
            <Redirect to={`/journal/${year}/${month}/${day}`}/>
          </Route>

          <Route path="/">
            <Redirect to='/journal'/>
          </Route>

        </Switch>
      </Router>

    );
  }
}
