const titulo = document.querySelector('header h1');
const uri = 'http://localhost:3000/';
const modalVeiculos = document.querySelector('#modalVeiculos');
var alocacoes = [];

async function carregarTitulo() {
    const response = await fetch(uri);
    const data = await response.json();
    titulo.textContent = data.titulo;
}

async function carregarAlocacoes() {
    const response = await fetch(uri + 'alocacoes');
    alocacoes = await response.json();
}

async function montarAreas() {
    const main = document.querySelector('main');
    for (let i = 1; i <= 11; i++) {
        const area = document.createElement('div');
        area.classList.add("area");
        area.addEventListener('click', () => { listarVeiculos(i) });
        area.id = `area-${i}`;
        area.innerHTML = `<p>${i}</p>`;
        main.appendChild(area);
    }
}

async function pintarAreas() {
    for (const alocacao of alocacoes) {
        const area = document.querySelector(`#area-${alocacao.area}`);
        area.classList.add('alocado');
    }
}

async function inicializar() {
    await carregarTitulo();
    await montarAreas();
    await carregarAlocacoes();
    await pintarAreas();
}

function listarVeiculos(area) {
    modalVeiculos.classList.remove('oculto');
    tituloModal = document.querySelector('#modalVeiculos h2');
    tituloModal.textContent = `Área ${area}`;
    modalVeiculos.querySelector('.veiculos').innerHTML = '';
    fetch(uri + 'alocacoes/' + area)
        .then(response => response.json())
        .then(data => {
            for (const alocacao of data) {
                const item = document.createElement('div');
                item.innerHTML = `${alocacao.possui.modelo} R$ ${alocacao.possui.preco.toFixed(2)} <button>Vender</button>`;
                modalVeiculos.querySelector('.veiculos').appendChild(item);
            }
            if (data.length == 0)
                tituloModal.textContent = `Área vazia`;
        });
}

inicializar();