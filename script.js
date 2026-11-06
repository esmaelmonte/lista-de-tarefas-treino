let tarefas =[];

const inputTarefa = document.getElementById('input-tarefa');
const btnAdicionar = document.getElementById('btn-adicionar');
const listaTarefas = document.getElementById('lista-de-tarefa');
const API = 'http://localhost:3000'; 
const telaLogin = document.getElementById('tela-login');
const telaTarefas = document.getElementById('tela-tarefas');
const inputEmail = document.getElementById('input-email');
const inputSenha = document.getElementById('input-senha');
const btnEntrar = document.getElementById('btn-entrar');
const btnCadastrar = document.getElementById('btn-cadastrar');
const btnSair = document.getElementById('btn-sair');
const mensagem = document.getElementById('mensagem'); 


function cabecalhos() {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    };
}


async function adicionarTarefa() {
    const texto = inputTarefa.value.trim();

    if(texto === '') {
        return;
    }

    await fetch(API + '/tarefas', {
        method: 'POST',
        headers: cabecalhos(),
        body: JSON.stringify({ texto: texto })
    });

    inputTarefa.value = '';

    carregarTarefas();
}

function renderizarTarefa(){
    listaTarefas.innerHTML = '';

    tarefas.forEach (function (tarefa,index){
        const li = document.createElement('li');
        li.textContent = tarefa.texto;

        if (tarefa.concluida) {
            li.style.textDecoration = 'line-through';
        }
        const btnApagar = document.createElement('span');
        btnApagar.textContent = 'X';
        btnApagar.className = 'btn-apagar';
                        

        btnApagar.addEventListener('click', async function(evento){
            evento.stopPropagation();

            await fetch(API + '/tarefas/' + tarefa.id, {
                method: 'DELETE',
                headers: cabecalhos(),
            });

            carregarTarefas();
            
        });
        li.appendChild(btnApagar);

        li.addEventListener('click', async function (){
            await fetch(API + '/tarefas/' + tarefa.id, {
                method: 'PUT',
             headers: cabecalhos(),  
           
             });
            carregarTarefas();

        });
            

        listaTarefas.appendChild(li);
    });
}
    btnAdicionar.addEventListener('click', function (){
       adicionarTarefa();
    });

    inputTarefa.addEventListener('keypress', function (evento){
    
        if (evento.key === 'Enter'){
            adicionarTarefa();
           
        }
    });

    async function carregarTarefas() {
    const resposta = await fetch(API + '/tarefas', {
        headers: cabecalhos()
    });

    if (resposta.status === 401) {
        sair();
        return;
    }

    const dados = await resposta.json();

    tarefas = dados;

    renderizarTarefa();
}

    function mostrarTarefas() {
    telaLogin.classList.add('escondido');
    telaTarefas.classList.remove('escondido');
    carregarTarefas();
}

function mostrarLogin() {
    telaTarefas.classList.add('escondido');
    telaLogin.classList.remove('escondido');
}

function sair() {
    localStorage.removeItem('token');
    tarefas = [];
    renderizarTarefa();
    mostrarLogin();
}

async function entrar() {
    const resposta = await fetch(API + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: inputEmail.value.trim(),
            senha: inputSenha.value
        })
    });

    const dados = await resposta.json();

        if (!resposta.ok) {
        mensagem.className = '';
        mensagem.textContent = dados.error;
        return;
    }

    localStorage.setItem('token', dados.token);
    inputSenha.value = '';
    mensagem.textContent = '';
    mostrarTarefas();
}

async function cadastrar() {
    const resposta = await fetch(API + '/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: inputEmail.value.trim(),
            senha: inputSenha.value
        })
    });

    const dados = await resposta.json();

        if (!resposta.ok) {
        mensagem.className = '';
        mensagem.textContent = dados.error;
        return;
    }

        mensagem.className = 'sucesso';
    mensagem.textContent = 'Conta criada! Agora é só entrar.';
}

btnEntrar.addEventListener('click', entrar);
btnCadastrar.addEventListener('click', cadastrar);
btnSair.addEventListener('click', sair);
inputSenha.addEventListener('keypress', function (evento){
    if (evento.key === 'Enter'){
        entrar();
    }
});

if (localStorage.getItem('token')) {
    mostrarTarefas();
}