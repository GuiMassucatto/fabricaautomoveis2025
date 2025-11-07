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
        if (area) area.classList.add('alocado');
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
    const tituloModal = document.querySelector('#modalVeiculos h2');
    tituloModal.textContent = `Área ${area}`;
    modalVeiculos.querySelector('.veiculos').innerHTML = '';

    fetch(uri + 'alocacoes/' + area)
        .then(response => response.json())
        .then(data => {
            for (const alocacao of data) {
                const item = document.createElement('div');
                item.innerHTML = `${alocacao.possui.modelo} R$ ${alocacao.possui.preco.toFixed(2)} <button>Vender</button>`;
                item.querySelector('button').addEventListener('click', () => {
                    abrirModalVenda(alocacao.possui, area);
                });
                modalVeiculos.querySelector('.veiculos').appendChild(item);
            }
            if (data.length == 0)
                tituloModal.textContent = `Área ${area} - Vazia`;
        })
        .catch(() => {
            tituloModal.textContent = `Erro ao carregar veículos da área ${area}`;
        });
}

const modalVenda = document.querySelector('#modalVenda');
const selectCliente = document.querySelector('#selectCliente');
const selectConcessionaria = document.querySelector('#selectConcessionaria');
const btnConfirmarVenda = document.querySelector('#btnConfirmarVenda');
const tituloVenda = document.querySelector('#tituloVenda');

let carroSelecionado = null;
let areaSelecionada = null;

function abrirModalVenda(carro, area) {
    carroSelecionado = carro;
    areaSelecionada = area;
    tituloVenda.textContent = carro.modelo;
    modalVenda.classList.remove('oculto');
    carregarClientes();
    carregarConcessionarias(); 
}

function fecharModalVenda() {
    modalVenda.classList.add('oculto');
    selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';
    selectConcessionaria.innerHTML = '<option value="">Selecione uma concessionária</option>';
    btnConfirmarVenda.disabled = true;
}

async function carregarClientes() {
    const response = await fetch(uri + 'clientes');
    const clientes = await response.json();

    selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';
    if (clientes.length === 0) {
        const option = document.createElement('option');
        option.textContent = 'Nenhum cliente cadastrado';
        selectCliente.appendChild(option);
        return;
    }

    for (const c of clientes) {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.nome;
        selectCliente.appendChild(option);
    }
}

async function carregarConcessionarias() {
    const response = await fetch(uri + 'concessionarias');
    const concessionarias = await response.json();

    console.log("Concessionárias carregadas:", concessionarias);

    selectConcessionaria.innerHTML = '<option value="">Selecione uma concessionária</option>';
    if (concessionarias.length === 0) {
        const option = document.createElement('option');
        option.textContent = 'Nenhuma concessionária cadastrada';
        selectConcessionaria.appendChild(option);
        return;
    }

    for (const cons of concessionarias) {
        const option = document.createElement('option');
        option.value = cons.id;
        option.textContent = cons.concessionaria; 
        selectConcessionaria.appendChild(option);
    }
}

selectCliente.addEventListener('change', verificarCampos);
selectConcessionaria.addEventListener('change', verificarCampos);

function verificarCampos() {
    btnConfirmarVenda.disabled = !(selectCliente.value && selectConcessionaria.value);
}

btnConfirmarVenda.addEventListener('click', async () => {
    const venda = {
        clienteId: selectCliente.value,
        concessionariaId: selectConcessionaria.value,
        modelo: carroSelecionado.modelo
    };

    const response = await fetch(uri + 'vendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(venda)
    });

    if (response.ok) {
        alert('Venda efetuada com sucesso!');
        fecharModalVenda();
        modalVeiculos.classList.add('oculto');
        await carregarAlocacoes();
        await pintarAreas();
    } else {
        alert('Erro ao realizar venda.');
    }
});

inicializar();
