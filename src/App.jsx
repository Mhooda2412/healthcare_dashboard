import './App.css'
import HomePage from './pages/HomePage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeCards from './components/HomeCards';
import EnrollmentPage from './pages/EnrollmentPage';
function App() {

  return (
    <Router>
      <HomePage>
        <Routes>
          {
            <>
              <Route path='/' element={<HomeCards />}></Route>
              <Route path='/enrollment' element={<EnrollmentPage></EnrollmentPage>}></Route> 

            </>
          }
        </Routes>
      </HomePage>
    </Router>
  )
}

export default App
