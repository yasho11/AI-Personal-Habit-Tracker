import {Route, Routes, Navigate} from "react-router-dom";
import Navbar from "./component/NavBar";
import Login from "./pages/login";
import Signup from "./pages/register";
import SettingsPage from "./pages/SettingsPage";

import {useAuthStore} from "./stores/useAuthStores";
import { useEffect } from "react";
import { useThemeStore } from "./stores/useThemeStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Homepage from "./pages/Homepage";
import ProfilePage from "./pages/profile";
import Recommend from "./pages/recommend";



function App(){
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();

  const {theme} = useThemeStore();

  useEffect(()=>{
    checkAuth();
  }, []);

  console.log(authUser);
  if(isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"/>
    </div>
  ) 

  return(
    <div data-theme = {theme}>
      <Navbar/>
      <div className="ml-5">
      <Routes>
        <Route path = "/" element={authUser ? <Homepage/> : <Navigate to= "/signin"/>}/>
        <Route path="/signup" element= {!authUser ? <Signup/> : <Navigate to = "/"/>}/>
        <Route path="/signin" element = {!authUser ? <Login/> : <Navigate to = "/"/>}/>
        <Route path="/profile" element = {authUser ? <ProfilePage/>: <Navigate to = "/signin"/>}/>
        <Route path="/habits" element={authUser ? <Homepage/> : <Navigate to= "/signin"/>}/>
        <Route path="/settings" element= {<SettingsPage/>}/>
        <Route path="/recommend" element= {authUser? <Recommend/>: <Navigate to = "/signin"/>}/>  
      </Routes>
      </div>
      <Toaster/>
    </div>
  ) 
}


export default App;
