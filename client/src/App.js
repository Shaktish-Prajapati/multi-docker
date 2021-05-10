import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import Fib from './Fib'
import OtherPage from './OtherPage'


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Link to='/'>HOME</Link>
          <Link to='/OtherPage'>OtherPage</Link>
        </header>
        <div>
          <Route exac path='/' component={Fib} />
          <Route path='/OtherPage' component={OtherPage} />
        </div>
      </div>
    </Router>
  );
}

export default App;
