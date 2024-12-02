const API_URL='https://acttus-cosmeticos.vercel.app'
const { Given, When, Then } = require('@cucumber/cucumber');
const fetch = require('node-fetch');
const assert = require('assert');

let response = {};
let usuario = { nome: '', email: '', senha: '' };

Given('estou na página de cadastro', function () {
    // Inicializa o objeto usuário
    usuario = { nome: '', email: '', senha: '' };
});

Given('um usuário já está cadastrado com o email {string}', async function (email) {
    const url = `${API_URL}/cadastro`;
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: 'Usuário Existente', email, senha: 'senha123' }),
    });
});

When('preencho o campo {string} com {string}', function (campo, valor) {
    if (campo === 'Nome') usuario.nome = valor;
    if (campo === 'Email') usuario.email = valor;
    if (campo === 'Senha') usuario.senha = valor;
});

When('clico no botão {string}', async function (botao) {
    if (botao === 'Cadastrar') {
        const url = `${API_URL}/cadastro`;
        response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        }).then((res) => res.json());
    }
});

Then('vejo a mensagem {string}', function (mensagemEsperada) {
    // Verifica se a mensagem retornada corresponde à esperada
    assert.strictEqual(response.tipo, mensagemEsperada);
});