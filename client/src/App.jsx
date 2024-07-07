import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Films from './pages/Films'
import User from './pages/User'
import FilmDetails from './pages/FilmDetails'
import Movies from  './pages/Movies'
import Category from './pages/Category'
import Favorite from './pages/Favorite'
import Search from './pages/Search'
import Admin from './pages/Admin'
import Rdfs from './pages/Rdfs'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/movies' element={<Movies/>}></Route>
        <Route path='/category' element={<Category/>}></Route>
        <Route path='/favorite' element={<Favorite/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/forgotPassword' element={<ForgotPassword/>}></Route>
        <Route path='/resetPassword/:token' element={<ResetPassword/>}></Route>
        <Route path='/films' element={<Films/>}></Route>
        <Route path='/user' element={<User/>}></Route>
        <Route path='/film/:id' element={<FilmDetails/>}></Route>
        <Route path='/search' element={<Search/>}></Route>
        <Route path='/admin' element={<Admin/>}></Route>
        <Route path='/rdfs/:id' element={<Rdfs/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App