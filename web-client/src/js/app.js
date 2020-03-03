import React, {Component} from 'react';

import Calendar from './calendar';
import LoginPage from './login-page';
import moment from 'moment';
import Notepad from './notepad';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

export default class App extends Component {

  constructor() {
    super();

    this.state = {
      selectedDate: moment(),
      notes: [
        {
          content: 'hello hello',
          type: 'flag',
          id: '1',
        },
      ],
    };
  }

  onDateSelected = (selectedDate) => {
    this.setState({
      selectedDate,
    });
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
    return (
      <div className='layout'>
        <Calendar selectedDate={this.state.selectedDate} onDateSelected={this.onDateSelected}/>
        <Notepad
          title={this.state.selectedDate.format('dddd LL')}
          notes={this.state.notes}
          onNoteUpdate={this.onNoteUpdate}
        />
      </div>
    );
  }

  render() {
    const Journal = this.journalRoute;

    return (
      <Router>
        <Switch>

          <Route path="/login">
            <LoginPage/>
          </Route>

          <Route path="/">
            <Journal/>
          </Route>

        </Switch>
      </Router>

    );
  }
}
