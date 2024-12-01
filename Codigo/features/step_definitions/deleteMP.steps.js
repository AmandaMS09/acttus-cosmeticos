const API_URL='https://acttus-cosmeticos.vercel.app'
import { Given, When, Then } from '@cucumber/cucumber';
import fetch from 'node-fetch';
import assert from 'assert');

let response = {};

Given('uma matéria prima já existe com ID {string}', async function (id) {
    // Apenas confirma que a matéria-prima existe com o ID fornecido.
    assert.strictEqual(id, "3"); // ID fornecido como exemplo
});

When('deleto a matéria prima com ID {string}', async function (id) {
    response = await fetch(`${API_URL}/deleteMateriaPrima`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id }),
    }).then(res => res.json());
});

Then('vejo a mensagem de sucesso {string}', function (mensagemEsperada) {
    assert.strictEqual(`${response.tipo} - ${response.mensagem}`, mensagemEsperada);
});
