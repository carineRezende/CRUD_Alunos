const API = "https://proweb.leoproti.com.br/alunos";


const form = document.querySelector("form");
const tbody = document.getElementById("tbody-alunos");
const btnCadastrar = document.getElementById("btn-cadastrar");
const btnCancelar = document.getElementById("btn-cancelar");

let alunoEditando = null;

async function carregarAlunos() {
    const resp = await fetch(API);
    const alunos = await resp.json(); //async é função assíncrona, e await faz o código esperar a resposta da requisição antes de continuar

    tbody.innerHTML = ""; // innerHTML usado pra manipular o HTML. Limpei o tbody antes de preencher
    alunos.forEach(aluno => { //forEach executa uma função uma vez para cada aluno
        const tr = document.createElement("tr"); // Criei um elemento na tabela para cada aluno
        tr.innerHTML = `

        <td>${aluno.nome}</td> 
        <td>${aluno.turma}</td>
        <td>${aluno.curso}</td>
        <td>${aluno.matricula}</td>
        <td class="text-center text-nowrap"> 
            <button class="btn btn-info btn-sm me-2 fw-semibold" onclick="editarAluno(${aluno.id})">Editar</button>
            <button class="btn btn-danger btn-sm fw-semibold" onclick="excluirAluno(${aluno.id})">Excluir</button>
        </td>
        `;
        tbody.appendChild(tr); // Adicionei a linha criada ao corpo da tabela
    });
}

async function criarAluno(dados) { //Aceita um único argumento que é o dado
    await fetch(API, { //await, operação de rede que leva tempo 
        method: "POST",
        headers: { "Content-Type": "application/json" }, //O corpo desta requisição é um objeto JSON
        body: JSON.stringify(dados) //Converte o objeto dados em uma string JSON
    });
    carregarAlunos();
}

async function atualizarAluno(id, dados) {
    await fetch(`${API}/${id}`, { //Base do API + id do aluno pra ser editado. Usasse "&" para concatenar strings (não usar o +)
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });
    carregarAlunos();
}

async function excluirAluno(id) {
    if (confirm("Tem certeza que deseja excluir este aluno?")) {
        await fetch(`${API}/${id}`, {
            method: "DELETE"
        });
        carregarAlunos();
    }
}

async function editarAluno(id) {
    const resp = await fetch(`${API}/${id}`);
    const aluno = await resp.json();

    document.getElementById("nome").value = aluno.nome; // encontra os campos do forms usando o id deles, e define o value com os dados que vieram da API
    document.getElementById("turma").value = aluno.turma;
    document.getElementById("curso").value = aluno.curso;
    document.getElementById("matricula").value = aluno.matricula;

    alunoEditando = id; // Guarda o id do aluno que está sendo editado
    btnCadastrar.textContent = "Salvar Alterações"; //Muda o texto do botão cadastro
    btnCancelar.classList.remove("d-none"); // Torna o botão cancelar visível tirando o "display: none"
}

if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
        if (form) form.reset(); // Se o form existir, reseta ele
        alunoEditando = null;
        if (btnCadastrar) btnCadastrar.textContent = "Cadastrar"; // Muda o texto do botão cadastro de volta
        btnCancelar.classList.add("d-none"); // Volta a esconder o botão cancelar
    });
} else {
    console.warn('Elemento #btn-cancelar não encontrado no DOM.');
}

if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Impede o comportamento padrão do formulário de recarregar a página ao enviar, para o JS tratar o envio

        const dados = { // pega todos os dados inseridos no formulário e armazena na variável
            nome: document.getElementById("nome").value.trim(),
            turma: document.getElementById("turma").value.trim(),
            curso: document.getElementById("curso").value.trim(),
            matricula: document.getElementById("matricula").value.trim()
        };

        if (alunoEditando) { // Verifica se está editando ou criando
            atualizarAluno(alunoEditando, dados); // se estiver editando, chama a função de atualizar e passa o id e os dados
        } else {
            criarAluno(dados); // se não, chama a função de criar
        }

        form.reset();
        if (btnCadastrar) btnCadastrar.textContent = "Cadastrar";
        if (btnCancelar) btnCancelar.classList.add("d-none");
        alunoEditando = null;
    });
} else {
    console.error('Form não encontrado. Adicione um elemento <form> ao HTML ou use getElementById com o id correto.');
}

carregarAlunos();
