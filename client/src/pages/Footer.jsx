import React from 'react'
import logo from '../assets/urubuflix.png'

function Footer() {
  return (
    <div>
      <footer>
        <div className="site-map flex-content">
          <div>
            <img src={logo} alt="UrubuFLix logo" title="UrubuFLix logo" />
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer