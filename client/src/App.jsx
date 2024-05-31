import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Films from './pages/Films'
import User from './pages/User'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/forgotPassword' element={<ForgotPassword/>}></Route>
        <Route path='/resetPassword/:token' element={<ResetPassword/>}></Route>
        <Route path='/films' element={<Films/>}></Route>
        <Route path='/user' element={<User/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
