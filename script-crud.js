const addTarefaBt     = document.querySelector('.app__button--add-task');
const addTarefaForm   = document.querySelector('.app__form-add-task');
const addTarefaCancel = document.querySelector('.app__form-footer__button--cancel');
const textAreaForm    = document.querySelector('.app__form-textarea');
const ulTarefas       = document.querySelector('.app__section-task-list');
const descricaoTarefa = document.querySelector('.app__section-active-task-description');

const removerConclBt  = document.querySelector('#btn-remover-concluidas');
const removerTodasBt  = document.querySelector('#btn-remover-todas');


let listaTarefas = JSON.parse(localStorage.getItem('listaTarefas')) || [];

let tarefaSelecionada   = null;
let liTarefaSelecionada = null;

function criarElementoTarefa(tarefa){
    const li        = document.createElement('li');
    const svg       = document.createElement('svg');
    const paragrafo = document.createElement('p');
    const botao     = document.createElement('button');
    const botaoImg  = document.createElement('img');
    
    li.classList.add('app__section-task-list-item');
    paragrafo.classList.add('app__section-task-list-item-description');
    botao.classList.add('app_button-edit');
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
        <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
            fill="#01080E"></path>
    </svg>
    `
    paragrafo.textContent = tarefa.descricao;
    botaoImg.setAttribute('src','./imagens/edit.png');

    botao.onclick = () => {
        const novaDescricao = prompt("Qual é o novo nome da tarefa?");
        if (novaDescricao){
            paragrafo.textContent = novaDescricao;
            tarefa.descricao      = novaDescricao;
            atualizarTarefa();
        }        
    };
    
    botao.append(botaoImg);
    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if(tarefa.completa){
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled','disabled');
    } else{
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active');
                });
            if(tarefaSelecionada == tarefa){
                descricaoTarefa.textContent = '';
                tarefaSelecionada           = null;
                liTarefaSelecionada         = null;
                return;
            }
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
            descricaoTarefa.textContent = tarefa.descricao;
            li.classList.add('app__section-task-list-item-active');
        }
    }  
    return li;
}

function atualizarTarefa(){
    //localStorage só recebe string. Se não for string, vai converter para com toString().
    localStorage.setItem('listaTarefas',JSON.stringify(listaTarefas));
}

function cancelarAdd(){
    addTarefaForm.classList.add('hidden');
    textAreaForm.value = '';

}

addTarefaBt.addEventListener('click',() => {
    addTarefaForm.classList.toggle('hidden');
});

addTarefaForm.addEventListener('submit',(evento) => {
    evento.preventDefault(); // Impede que ao submeter o form, a páginar recarregue por padrão
    const tarefa          = {
        descricao: textAreaForm.value
    };
    
    listaTarefas.push(tarefa);
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    
    atualizarTarefa();

    textAreaForm.value = '';
    addTarefaForm.classList.add('hidden');
});

addTarefaCancel.addEventListener('click',cancelarAdd);

document.addEventListener('FocoFinalizado', () =>{
    if(tarefaSelecionada && liTarefaSelecionada){
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled','disabled');
        tarefaSelecionada.completa = true;
        atualizarTarefa();
    }
});

const removerTarefas = (soConcluidas) => {
    const seletor = soConcluidas ? '.app__section-task-list-item-complete'
                                 : '.app__section-task-list-item';
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    });
    listaTarefas = soConcluidas ? listaTarefas.filter(tarefa => !tarefa.completa)
                                : [];
    atualizarTarefa();
};

removerConclBt.onclick = () => removerTarefas(true);
removerTodasBt.onclick = () => removerTarefas(false);

listaTarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
});