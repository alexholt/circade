import React, {Component} from 'react';

import AccountCreationPage from './account-creation-page';
import Calendar from './calendar';
import LoginPage from './login-page';
import moment from 'moment';
import Notepad from './notepad';
import cloneDeep from 'lodash/cloneDeep';
import last from 'lodash/last';
import CheckPretty from './check-pretty';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useParams,
  Navigate,
	matchPath,
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

		this.lastSeen = null;

    this.state = {
      isLoggedIn: false,
      notes: [],
      isLoading: true,
      hasError: false,
      tasks: [],
    };

		const match = matchPath(location.pathname,'/journal/:year/:month/:day');

		if (match) {
    	this.fetchEntries(
				match.params.year,
				match.params.month,
				match.params.day,
			);
		}

    //this.fetchTasks();
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const a = new Error()
    a.message = error.message;
    a.stack = errorInfo.componentStack;
    throw a;
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
    const navigate = useNavigate();

    const onDateSelected = (selectedDate) => {
      this.setState({isLoading: true});
      const year = selectedDate.format('YYYY');
      const month = selectedDate.format('MM');
      const day = selectedDate.format('DD');

      navigate(`/journal/${year}/${month}/${day}`);

      this.fetchEntries(year, month, day);
    };

		const {year, month, day} = useParams();
    const activeDate = moment(`${year}-${month}-${day}`);

    return (
      <Calendar
        onDateSelected={onDateSelected}
        tasks={this.state.tasks}
				selectedDate={activeDate}
      />
    );
  }

  getDatePath() {
		const {params} = matchPath(location.pathname, { path: '/journal/:year/:month/:day' });

    return `/${params.year}/${params.month}/${params.day}`;
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
    this.fetchTasks();
  }

  onNoteAdd = () => {
    const notes = this.state.notes;
    if (notes.length > 0 && last(notes).id == null) return;
    notes.push(cloneDeep(emptyNote));
    last(notes).callback = function (event) {console.log('added'); this.focus()};
    this.setState({notes});
    this.fetchTasks();
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
    	this.fetchTasks();
    });
  }

  journalRoute = () => {
		const {year, month, day} = useParams();
		if (this.lastSeen != `${year}-${month}-${day}`) {
			this.lastSeen = `${year}-${month}-${day}`;
			this.fetchEntries(year, month, day);
		}


		const date = moment(`${year}-${month}-${day}`);
    const Calendar = this.calendar;

    return (
      <div className='layout'>
        <Calendar/>
        <Notepad
          title={date.format('dddd LL')}
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
    let navigate = useNavigate();

    const onLogIn = () => {
      this.setState({
        isLoggedIn: true,
      });

      navigate('/journal');
    };

    return <LoginPage onSuccess={onLogIn}/>;
  }

  checkIfLoggedIn = () => {
    let navigate = useNavigate();

    get('/login').then(res => {
      if (res.status == 'success') {
        this.setState({isLoggedIn: true});
        navigate('/journal');
      } else {
        navigate('/login');
      }
    });

    return <div className="loading"><CheckPretty/></div>;
  }

  logout = () => {
    let navigate = useNavigate();

    get('/logout').then(res => {
      this.setState({isLoggedIn: false});
      navigate('/login');
    });

    return <div className="loading"><CheckPretty/></div>;
  }

  render() {
    const Journal = this.journalRoute;
    const LogOut = this.logout;
    const LoginPage = this.loginPageWithRedirect;
    const CheckIfLoggedIn = this.checkIfLoggedIn;

    if (this.state.hasError) return <h1>Something has gone horribly wrong!</h1>;

		const today = moment();

    const LoginCheckedJournal = this.state.isLoggedIn ? <Journal/> : <CheckIfLoggedIn/>;

    return (
      <Router>

        <Routes>
          <Route path="/login" element={<LoginPage/>}/>

          <Route path="/create-account" element={<AccountCreationPage/>}/>

          <Route path="/logout" element={<LogOut/>}/>

          <Route path={`/journal/:year/:month/:day`} element={<LoginCheckedJournal/>}/>

        </Routes>
      </Router>

    );
  }
}

/*
<Route path="/journal">
  <Navigate to={`/journal/${today.year()}/${today.format('MM')}/${today.format('DD')}`}/>
</Route>

<Route path="/">
  <Navigate to='/login'/>
</Route>

*/