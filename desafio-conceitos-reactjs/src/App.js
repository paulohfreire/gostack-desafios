import React, { useState, useEffect } from "desafio-conceitos-reactjs/node_modules/~/react";
import api from "./services/api";

import "./styles.css";

//Para ler e listar os repositórios

function App() {
  const [repositories, setRepositories] = useState([]);

  //useEffect é utilizado para listar  
  //useState salva a lista
  
  useEffect(() => {
    async function loadRepositories () {
      const response = await api.get('repositories');

      setRepositories(response.data);
    }
    loadRepositories();
    }, []);

    //Para inserir um novo repositório
    //Toda função que vem de uma ação do usuário é do tipo handle
    async function handleAddRepository() {
     const response = await api.post('repositories', {
        title: "Projeto básico",
        url:"www.github.com",
        techs:["html", "css", "js", "react"]
      });
      const repository = response.data;

//...repositories lê os que já existem e o repository após a virgula é acrescentado (o novo)
      setRepositories([...repositories, repository]);
    }
    
    //Para Remover o repositório
    async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`);
    const newRepositories = repositories.filter(repository => repository.id !== id);
    setRepositories(newRepositories);

  }

  return (
    <div>
      <ul data-testid="repository-list">
      {repositories.map(repository => (
      <li key={repository.id}>{repository.title} 
      <button onClick={() => handleRemoveRepository(repository.id)}>
      Remover
    </button>
    </li>
      ))}
      </ul>


      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
