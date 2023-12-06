const { myEmitter } = require("./sse");
const path = require('path');
const fs = require('fs');

let algemVenceu;
const numerosSorteados = new Set();
let sorteioIntervalo;

const iniciarSorteio = () => {

    sorteioIntervalo = setInterval(() => {
        const indexSorteado = gerarSinalUnico();
        const sinalBase64 = converterImagem(indexSorteado);
        myEmitter.emit('bingo_sorteio', indexSorteado, sinalBase64);
    }, 10000);
}

function gerarSinalUnico() {
    const maxIndex = 75;
    const todosOsNumeros = Array.from({ length: maxIndex }, (_, i) => i);
    const numerosDisponiveis = todosOsNumeros.filter(num => !numerosSorteados.has(num));

    if (numerosDisponiveis.length === 0) {
        resetSorteio();
    }

    const indexSorteado = numerosDisponiveis[Math.floor(Math.random() * numerosDisponiveis.length)];
    numerosSorteados.add(indexSorteado);
    console.log('idx:', indexSorteado);
    return indexSorteado
}
function converterImagem(index) {
    try {
        const imagePath = path.join('public', `${index}.png`);
        const imageBase64 = fs.readFileSync(imagePath, 'base64');
        return imageBase64;
    } catch (error) {
        console.error(`Erro ao ler a imagem: ${error.message}`);
        return null;
    }
}

function resetSorteio(jogadorVencedor) {
    if (sorteioIntervalo) {
        clearInterval(sorteioIntervalo);
    }
    myEmitter.emit('bingo_vencedor', jogadorVencedor);
    numerosSorteados.clear();
    console.log('reset_sorteio');
}

module.exports = {
    iniciarSorteio,
    resetSorteio
};
