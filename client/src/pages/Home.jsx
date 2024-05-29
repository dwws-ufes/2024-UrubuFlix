import React, { useState, useEffect } from 'react'
import '../style/Home.css';
import logo from '../assets/urubuflix.png'
import { Link, useNavigate } from 'react-router-dom'
import { verifyUser } from '../services/Axios';
import urubuUser from '../assets/urubu.png';
import Films from './Films';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'


function Home() {
  const navigate =  useNavigate()
  const [user, setUser] = useState()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await verifyUser();
        if (response.status) {
          setUser(response.user);
        } 
        else {
          navigate('/');
        }
      } 
      catch (error) {
        console.log(error);
        navigate('/');
      }
    };

    fetchUser();
  }, [navigate]);

  function handleLogin(){
    navigate('/login')
    console.log(user);
  }
  function handleRegister(){
    navigate('/register')
  }
  
  return (
    <div className="App">
      <header className="topo conteudo-flex">
        <div className="topo-esquerdo conteudo-flex">
          <div className="topo-logo">
            <img src={logo} alt="Imagem logotipo do UrubuFlix" title="Imagem logotipo do UrubuFlix" />
          </div>
        </div>
        <div className="topo-centro conteudo-flex">
          <nav>
            <ul className="topo-menu conteudo-flex">
              <li><Link to='/'>Home</Link></li>
              <li><Link to='/'>Movies</Link></li>
              <li><Link to='/'>Category</Link></li>
              {user ? <li><Link to='/'>Favorite</Link></li> : <p></p>}
            </ul>
          </nav>
          <div className="topo-pesquisa">
            <div className="conteudo-pesquisa">
              <form className="conteudo-flex" method="post">
                <fieldset className="bar-pesquisa">
                  <input type="text" placeholder="Pesquisar um filme..." alt="Digite aqui um filme para pesquisar" />
                </fieldset>
                <fieldset className="btn-pesquisar conteudo-flex">
                <button type="button" title="Pesquisar" className="search-button">
                  <FontAwesomeIcon icon={faSearch} />
                </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
        
        {user ? <Link to='/user'><img src={urubuUser} alt="urubuflix" className='test'/></Link> : 
        <div className="topo-direito">
          <div className="sublogin">
            <div>
              <button className="subloginbtn">Login <br />or Register <span className="fa fa-caret-down"></span></button>
            </div>
            <div className="sublogin-conteudo">
              <button type="button" title="Entrar" onClick={handleLogin}>Login</button>
              <p>or</p>
              <button type="button" title="Cadastrar" onClick={handleRegister}>Register</button>
            </div>
          </div>
        </div>
        }
      </header>

      <main className="conteudo-principal">
        <Films></Films>
        <div className="primeiro-h1">
          <h1>O melhor site de review de filmes</h1>
        </div>

        <div className="dados-empresa">
          <div>
            <h1>Você sabe o que é o UrubuFlix?</h1>
          </div>
          <div>
            <p>
              UrubuFlix é um serviço de review de filmes, possibilitando você avaliar e comentar sobre os filmes que assistiu.
            </p>
          </div>
          <div>
            <p>
              Você pode desfrutar de todas essas funcionalidades:
            </p>
          </div>
          <div className="caixa-vantagens">
            <div>
              <h2>Pesquisar filmes</h2>
              <p>
                Pesquise por filmes que deseja assistir. Você pode pesquisar por nome, categoria, atores, diretores e muito mais.
              </p>
            </div>
            <div>
              <h2>Avalie o filme que você assistiu</h2>
              <p>
                Dê sua nota e comente sobre o filme que você assistiu. Compartilhe sua opinião com outros usuários.
              </p>
            </div>
            <div>
              <h2>Favorite seus filmes preferidos</h2>
              <p>
                Adicione os filmes que você mais gostou em sua lista de favoritos. Assim, todos os filmes que você mais gostou estarão em um só lugar.
              </p>
            </div>
            <div>
              <h2>Volte quando desejar</h2>
              <p>
                Quando sentir saudade e assinar novamente, o seu perfil será reativado com todo seu histórico e lista.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="site-map conteudo-flex">
          <div>
            <img src={logo} alt="Imagem logotipo do UrubuFlix" title="Imagem logotipo do UrubuFlix" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home