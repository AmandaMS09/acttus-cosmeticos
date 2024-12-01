const API_URL='https://acttus-cosmeticos.vercel.app'
import { Given, When, Then } = from '@cucumber/cucumber';
import fetch = from 'node-fetch';
import assert = from 'assert';

let response = {};

Given('um fornecedor já existe com ID {string}', async function (id) {
    // Apenas garante que o fornecedor já existe (sem criá-lo)
    assert.strictEqual(id, "2");
});

When('atualizo o fornecedor com ID {string} para:', async function (id, tabela) {
    const data = tabela.raw();
    const fornecedorAtualizado = {
        id: id,
        nome: data[1][0], // Nome
        email: data[1][1], // Email
        telefone: data[1][2], // Telefone
    };

    response = await fetch(`${API_URL}/updateFornecedor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fornecedorAtualizado),
    }).then(res => res.json());
});

Then('vejo a mensagem de retorno {string}', function (mensagemEsperada) {
    assert.strictEqual(`${response.tipo} - ${response.mensagem}`, mensagemEsperada);
});
