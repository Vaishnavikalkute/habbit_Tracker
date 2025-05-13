import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import HabitTracker from './components/habbit';
import './index.css';

function App() {
  return (
    <Router basename="/habits">
      <HabitTracker/>
    </Router>
  );
}

export default App;
