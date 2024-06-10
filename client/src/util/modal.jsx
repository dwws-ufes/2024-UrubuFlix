import React from 'react'


const BACKGROUND_STYLE = {
  position: 'fixed',
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
  backgroundColor: 'rgb(0,0,0, 0.7)',
  zIndex: '1000'
}

const MODAL_STYLE = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  padding: '150px',
  backgroundColor: '#fff',
  borderRadius: '10px',
  color: 'black'
}

const BUTTON_STYLE = {
  width: '100px',
  height: '30px',
  display: 'block',
  margin: 'auto',
  marginTop: '10px',
}

export default function Modal({ isOpen, setModalOpen, children }) {
  if (isOpen) {
    return (
      <div style={BACKGROUND_STYLE}>
        <div style={MODAL_STYLE}>
          <div>{children}</div>
          <button onClick={setModalOpen} style={BUTTON_STYLE}>Close</button>
        </div>
      </div>
    )
  }

  return null
}