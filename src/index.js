import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import logo from "./images/logo.png";

function CharacterCard(props) {
  const { character } = props;

  return (
    <div
      className="CharacterCard"
      style={{ backgroundImage: `url(${character.image})` }}
    >
      <div className="CharacterCard__name-container text-truncate">
        {character.name}
      </div>
    </div>
  );
}

class App extends React.Component { 
 state = {        //Inicializamos el estado como un objeto vacio
    nextPage: 1,   //Definimos por que pagina comienza
    loading: true, //Cuando nuestra aplicacion empieza busca los datos por eso anadimos este estado
    error: null,
    data: {
    info: {},      //Inicializamos info y data vacios 
    results: []
    },
    //nextPage: 1
  };
  //Utilizamos el componente DidMount para iniciar una llamada la API
  componentDidMount() {
    this.fetchCharacters();
  }

  // Definimos fetchCharacters ya que esto es un proceso asyncrono  
  fetchCharacters = async () => {
    this.setState({ loading: true, error: null });

    try {
      //Esto es una respuesta
      const response = await fetch(
        `https://rickandmortyapi.com/api/character/?page=${this.state.nextPage}`//Actualizamos el valor de Nextpage cada vez que se soliciten los datos
      );
      //Esto tambien es una funcion asyncrona por lo tanto hayq que esperarla
      //A esa respuesta le puedo sacar los datos
      const data = await response.json();

      //Estos datos los guardamos en el estado de este componente
      this.setState({
        loading: false, //Cuando tenemos los datos loading se vuelve falso
        data: {
          info: data.info, //Lo reemplzamos por lo que trae data.info
          results: [].concat(this.state.data.results, data.results) //Concatenamos los valores anteriores y los nuevos 
        },
        nextPage: this.state.nextPage + 1 // Definimos el numero de pagina para la
      });                                 // paginacion
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  render() {
    //Manejamos el error en caso de que este suceda
    //Y lo que envia es el mensaje del error
    if (this.state.error) {
      return `Error: ${this.state.error.message}`;
    }

    return (
      <div className="container">
        <div className="App">
          <img className="Logo" src={logo} alt="Rick y Morty" />

          <ul className="row">
            {this.state.data.results.map(character => ( //Aqui viene la lista y por cada uno de los resultados se imprime una tarjeta 
              <li className="col-6 col-md-3" key={character.id}>
                <CharacterCard character={character} />
              </li>
            ))}
          </ul>
          
          {this.state.loading && <p className="text-center">Loading...</p>}
          {!this.state.loading && this.state.data.info.next && (
            <button onClick={() => this.fetchCharacters()}>Load More</button>
          )}
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
