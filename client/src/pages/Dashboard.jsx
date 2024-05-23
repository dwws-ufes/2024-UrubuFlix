import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'

function Dashboard() {
  const navigate =  useNavigate()

  Axios.defaults.withCredentials = true;
  useEffect(() => {
    Axios.get('http://localhost:3002/verify')
    .then((res) => {
      if (res.data.status) {
        
      }else {
        navigate('/')
      }
      console.log(res);
    })
  },[])

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard