const events = require('events');
const myEmitter = new events.EventEmitter();

// Define um limite maior para o número de ouvintes para os eventos 'bingo_vencedor' e 'bingo_sorteio'
myEmitter.setMaxListeners(20);

function sse(req, res, next) {
  // Setamos as headers para indicar um SSE e evitar cache
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Connection': 'keep-alive'
  });

  myEmitter.on('bingo_vencedor', (nomeJogador) => {
    // Iniciamos o envio da notificacao
    res.write("event: notiticacao\n");
    const jsonData = {
      user_id: "1",
      tipo: "bingo_vencedor",
      msg: "Bingo",
      jogador: nomeJogador
    };
    // Enviamos os dados JSON para o front-end
    res.write(`data: ${JSON.stringify(jsonData)}`);
    res.write("\n\n");
    res.end(); // Encerra a resposta após o envio dos dados
  })

  myEmitter.on('bingo_sorteio', (indexSorteado, sinalBase64) => {
    // Iniciamos o envio da notificacao
    res.write("event: notiticacao\n");
    const jsonDataSorteio = {
      user_id: "1",
      tipo: "bingo_sorteado",
      idx: indexSorteado,
      sinalBase64: sinalBase64
    };
    res.write(`data: ${JSON.stringify(jsonDataSorteio)}`);
    res.write("\n\n");
    res.end(); // Encerra a resposta após o envio dos dados
  })
  myEmitter.on('bingo_iniciado', () => {
    // Iniciamos o envio da notificacao
    res.write("event: notiticacao\n");
    const jsonDataInicio = {
      user_id: "1",
      tipo: "bingo_iniciado",
      msg: "Bingo Iniciado!",
    };
    // Enviamos os dados JSON para o front-end
    res.write(`data: ${JSON.stringify(jsonDataInicio)}`);
    res.write("\n\n");
    res.end(); // Encerra a resposta após o envio dos dados
  })
}

module.exports = {
  sse,
  myEmitter
}
