import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home'
import Auth from './components/auth/Auth';

function App() {
  return (
    <div className='app'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/auth' element={<Auth />} />
      </Routes>
    </div>
  );
}

export default App;
