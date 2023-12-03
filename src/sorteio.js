const { myEmitter } = require("./sse");
let algemVenceu;
const numerosSorteados = new Set();

const iniciarSorteio = (vencedor) => {
    algemVenceu = vencedor ?? false;
    setInterval(() => {
        if (!algemVenceu) {
            myEmitter.emit('bingo_sorteio', gerarSinalUnico());
        }
    }, 7000);
}

function gerarSinalUnico() {
    const maxIndex = 75;
    const todosOsNumeros = Array.from({ length: maxIndex }, (_, i) => i);
    const numerosDisponiveis = todosOsNumeros.filter(num => !numerosSorteados.has(num));

    if (numerosDisponiveis.length === 0) {
        reiniciarSorteio();
    }

    const indexSorteado = numerosDisponiveis[Math.floor(Math.random() * numerosDisponiveis.length)];
    numerosSorteados.add(indexSorteado);

    return indexSorteado;
}

function reiniciarSorteio() {
    numerosSorteados.clear();
}

module.exports = {
    iniciarSorteio
};
