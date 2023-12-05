const express = require('express')
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;
const { iniciarSorteio } = require('./src/sorteio');
const { sse, myEmitter } = require('./src/sse');

app.use(express.json());
app.use(express.static('public'));

app.get('/events', sse, (req, res) => {
  res.send('Hello World!')
})
app.get('/', (req, res) => {
  // Lê o conteúdo do arquivo HTML e o envia como resposta
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/partida', (req, res) => {
  // Lê o conteúdo do arquivo HTML e o envia como resposta
  res.sendFile(`${__dirname}/pages/partida.html`);
});
app.post('/bingo', (req, res) => {
  const nomeJogador = req.body.nomeJogador ?? "";
  try {
    iniciarSorteio(nomeJogador);
    myEmitter.emit('bingo_vencedor', nomeJogador);
  } catch (error) {
    console.error('Erro:', error.message);
    res.status(500).send('Algo deu errado!');
  }
  res.send('Alguem bingou!')
})

app.get('/iniciar_sorteio', (req, res) => {
  try {
    myEmitter.emit('bingo_iniciado');
    iniciarSorteio(false)

  } catch (error) {
    console.error('Erro:', error.message);
    res.status(500).send('Algo deu errado!');
  }
  res.send('Partida iniciada')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})