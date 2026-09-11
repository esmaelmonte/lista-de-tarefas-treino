let tarefas =[];
const tarefasSalvas = localStorage.getItem('tarefas');
if (tarefasSalvas) {
    tarefas = JSON.parse(tarefasSalvas);
}
const inputTarefa = document.getElementById('input-tarefa');
const btnAdicionar = document.getElementById('btn-adicionar');
const listaTarefas = document.getElementById('lista-de-tarefa');

function adicionarTarefa() {
    const texto = inputTarefa.value.trim();

    if (texto ===''){
        return;
    }

    tarefas.push({texto: texto, concluida: false});
    inputTarefa.value = '';
}

function renderizarTarefa(){
    listaTarefas.innerHTML = '';

    localStorage.setItem('tarefas', JSON.stringify(tarefas));

    tarefas.forEach (function (tarefa,index){
        const li = document.createElement('li');
        li.textContent = tarefa.texto;

        if (tarefa.concluida) {
            li.style.textDecoration = 'line-through';
        }
        const btnApagar = document.createElement('span');
        btnApagar.textContent = 'X';
        btnApagar.className = 'btn-apagar';

        btnApagar.addEventListener('click', function(evento){
            evento.stopPropagation();
            tarefas.splice(index, 1);
            renderizarTarefa();
        });
        li.appendChild(btnApagar);

        li.addEventListener('click', function () {
            tarefas[index].concluida = !tarefas[index].concluida;
            renderizarTarefa();
        });

        listaTarefas.appendChild(li);
    });
}
    btnAdicionar.addEventListener('click', function (){
        adicionarTarefa();
        renderizarTarefa();
    });

    inputTarefa.addEventListener('keypress', function (evento){
    
        if (evento.key === 'Enter'){
            adicionarTarefa();
            renderizarTarefa();
        }
    });
    renderizarTarefa();