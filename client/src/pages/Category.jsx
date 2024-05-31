import React, { useEffect, useState } from 'react'
import NavBar from './NavBar';
import Footer from './Footer';
import Catalogs from './Catalogs';


function Category() {

  return (
      <div className="App">
        <NavBar></NavBar>

        <main className="main-content">
            <div className='catalogs'>
              <Catalogs></Catalogs>
            </div>
          </main>

        <Footer/>
      </div>
  );
}

export default Category;