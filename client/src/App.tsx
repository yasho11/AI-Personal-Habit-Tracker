import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from "./components/Users/login/login";
import Register from "./components/Users/register/register";
import NavBar from "./components/Users/NavBar/NavBar";
import Profile from './components/Users/profile/profile';
import EditProfile from './components/Users/editprofile/EditProfile';

import './App.css'
import AddHabit from './components/Habits/AddHabits/AddHabits';
import ViewHabits from './components/Habits/ViewHabits/ViewHabit';
import EditHabits from './components/Habits/EditHabits/EditHabits';
import Recommend from './components/Recommendation/recommend';

function App() {
  const Layout = () =>{
    const location = useLocation();

    const noNavBarRoutes = ["/login", "/register"];


    const shouldShowNavBar = !noNavBarRoutes.includes(location.pathname);
  
    return (
      <div className="Main-container">
        <div className="NavBar">
          {shouldShowNavBar && <NavBar/>}
        </div>

        <div className="Display">
          <Routes>
            <Route path='/register' element= {<Register/>}/>
            <Route path='/login' element= {<Login/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/edit-profile' element={<EditProfile/>}/>
            <Route path='/addHabit' element={<AddHabit/>}/>
            <Route path='/viewHabit' element={<ViewHabits/>}/>
            <Route path='/editHabit/:habitId' element={<EditHabits/>}/>
            <Route path='/Recommendation/:habitId' element={<Recommend/>}/>
          </Routes>
        </div>
        
      </div>
    )
  };

  return (
    <Router>
      <Layout/>
    </Router>
  )

  
}

export default App
