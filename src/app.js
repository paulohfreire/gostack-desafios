const express = require('express');
const cors = require('cors');
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//Listar os repositórios, retonando um Json com a lista de repositories
app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

//Criar os repositórios, iniciando com 0 de likes. Comando push envia individualmente e retorna em formato json individualmente, também
app.post('/repositories', (request, response) => {
  const { title, url, techs, likes} = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  
  repositories.push(repository);

  return response.json(repository);
});

//Para editar um repositório específico - por isso o :id, podendo editar as variáveis da const ... request.body
//const repositorioIndex é para encontrar o id do repositório
//se o id for menor que 0 significa que o repositório não existe


app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex === -1) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

//Para deletar um repositório, localiza o id, depois verifica se ele existe.
//se for >= 0 o id, o repositório existe e para deletar é utilizado o comando splice
//O return do final é para listar vazio para mostrar que o repositório foi mesmo apagado.

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );
  if (repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1);
  } else {
    return response.status(400).json({ error: 'Repository does not exists.' });
  }
  return response.status(204).send();
});

//Para editar a função de likes, que não poderia ser editada manualmente
//verifica o id, depois se ele existe
//utiliza o repositories[repositoryIndex].likes++; para adicionar um like

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  if (repositoryIndex === -1) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
