import './App.css';
import Login from './components/Login';
import Events from './components/Events';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/playerAccount/:userId" element={<Events />} />
      </Routes>
    </Router>
    </div>
  );
}
export default App;
