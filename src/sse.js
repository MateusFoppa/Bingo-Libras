const events = require('events');
const myEmitter =  new events.EventEmitter();

function sse(req,res,next){
    // Setamos as headers para indicar um SSE e evitar cache
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive'
      });

        myEmitter.on('bingo_vencedor', (nomeJogador)=>{
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
      })

    myEmitter.on('bingo_sorteio', (number)=>{
      // Iniciamos o envio da notificacao
      res.write("event: notiticacao\n");
      res.write(`data: {"user_id": "1", "tipo": "bingo_sorteado", "number": ${number}}`);
      res.write("\n\n");
  })
}

module.exports = {
	sse,
	myEmitter
}
