import React, {Component} from 'react';

import Calendar from './calendar';
import LoginPage from './login-page';
import moment from 'moment';
import Notepad from './notepad';
import cloneDeep from 'lodash/cloneDeep';
import last from 'lodash/last';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useParams,
  Redirect,
} from 'react-router-dom';

import {put, get, post, del} from './easy-fetch';

const emptyNote = {
  entry: '',
  type: 'task',
  id: null,
};

export default class App extends Component {

  constructor() {
    super();

    this.tempIdCounter = 0;

    this.server = SERVER;

    this.outboundQueue = [];
    this.isSending = false;

    this.state = {
      selectedDate: moment(),
      isLoggedIn: false,
      notes: [],
      isLoading: true,
      hasError: false,
      tasks: [],
    };

    this.fetchEntries(...this.getDateArray());
    this.fetchTasks();
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, errorInfo);
    console.error(errorInfo);
  }

  fetchEntries = (year, month, day) => {
    get(`/entries/${year}/${month}/${day}`).then(entries => {

      setTimeout(() =>
        this.setState({
          notes: entries,
          isLoading: false,
        })
        , 100
      );
    });
  }

  fetchTasks = () => {
    get(`/outstanding-tasks`).then(tasks => {
      this.setState({
        tasks,
      });
    });
  }

  calendar = () => {
    const history = useHistory();

    const onDateSelected = (selectedDate) => {
      this.setState({isLoading: true});
      const year = selectedDate.format('YYYY');
      const month = selectedDate.format('MM');
      const day = selectedDate.format('DD');

      history.push(`/journal/${year}/${month}/${day}`);

      this.fetchEntries(year, month, day);

      this.setState({
        selectedDate,
      });
    };

    return (
      <Calendar
        selectedDate={this.state.selectedDate}
        onDateSelected={onDateSelected}
        tasks={this.state.tasks}
      />
    );
  }

  getDatePath() {
    const year = this.state.selectedDate.format('YYYY');
    const month = this.state.selectedDate.format('MM');
    const day = this.state.selectedDate.format('DD');
    return `/${year}/${month}/${day}`;
  }

  onNoteUpdate = (note) => {
    const path = `/entry${this.getDatePath()}`;

    if (note.id == null) {
      note.id = 'TEMP_ID_' + this.tempIdCounter++;

      put(path, {body: note}).then(res => {
        note.id = res.id;
      });

    } else {

      post(path, {body: note}).then(res => {
        console.dir(res);
      });

    }

    this.setState({notes: this.state.notes});

  }

  onNoteAdd = () => {
    const notes = this.state.notes;
    if (notes.length > 0 && last(notes).id == null) return;
    notes.push(cloneDeep(emptyNote));
    last(notes).callback = function (event) {console.log('added'); this.focus()};
    this.setState({notes});
  }

  onNoteDelete = ({id}) => {
    const datePath = this.getDatePath();
    del(`/entry${datePath}/${id}`).then(res => {
      const notes = this.state.notes;
      let index = -1;
      notes.forEach((noteInCollection, i) => {
        if (noteInCollection.id == id) {
          index = i;
        }
      });

      notes.splice(index, 1);
      this.setState({notes});
    });
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
          onNoteDelete={this.onNoteDelete}
          onNoteAdd={this.onNoteAdd}
          isLoading={this.state.isLoading}
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

  getDateArray() {
    return [
      moment().format('YYYY'),
      moment().format('MM'),
      moment().format('DD'),
    ];
  }

  render() {
    const Journal = this.journalRoute;
    const LogOut = this.logout;
    const LoginPage = this.loginPageWithRedirect;
    const CheckIfLoggedIn = this.checkIfLoggedIn;

    if (this.state.hasError) return <h1>Something has gone horribly wrong!</h1>;

    const [year, month, day] = this.getDateArray();

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
