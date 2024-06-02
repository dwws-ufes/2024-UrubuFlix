import NavBar from './NavBar';
import Footer from './Footer';
import Catalogs from './Catalogs';
import '../style/Category.css';

function Category() {

  return (
      <div>
        <NavBar></NavBar>

        <main className="content">
            <div >
              <Catalogs></Catalogs>
            </div>
          </main>

        <Footer/>
      </div>
  );
}

export default Category;