let tarefas =[];

const inputTarefa = document.getElementById('input-tarefa');
const btnAdicionar = document.getElementById('btn-adicionar');
const listaTarefas = document.getElementById('lista-de-tarefa');

async function adicionarTarefa() {
    const texto = inputTarefa.value.trim();

    if(texto === '') {
        return;
    }

    await fetch('http://localhost:3000/tarefas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  
        },
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

            await fetch('http://localhost:3000/tarefas/' + tarefa.id, {
                method: 'DELETE',
            });

            carregarTarefas();
            
        });
        li.appendChild(btnApagar);

        li.addEventListener('click', async function (){
            await fetch('http://localhost:3000/tarefas/' + tarefa.id, {
                method: 'PUT',
           
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
        const resposta = await fetch('http://localhost:3000/tarefas');
        const dados = await resposta.json();

        tarefas = dados;

        renderizarTarefa();
    }
    carregarTarefas();