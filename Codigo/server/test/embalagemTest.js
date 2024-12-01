import request from 'supertest';
import assert from 'assert';
import app from '../index.js';

describe('Testes para rotas de embalagem.js', () => {
	it('POST /cadastraEmbalagem', (done) => {
		const newEmbalagem = {
			nome: "Embalagem 101",
			value: "valor",
			tamanho: "tamanho",
			minimo: "minimo",
			fornecedores: "1"
		}

		request(app)
			.post('/cadastraEmbalagem')
			.send(newEmbalagem)
			.expect(200)
			.end((err, res) => {
				if(err){
					assert.equal(res.body.tipo, "Erro ao cadastrar embalagem")
					return done(err);
				}

				done();
			});
	})

	it('POST /listarEmbalagem', (done) => {
		const newList = {
			id: "1"
		}
		request(app)
			.post('/listarEmbalagem')
			.send(newList)
			.expect(200)
			.end((err, res) => {
				if(err){
					assert.equal(res.body.tipo, "Erro ao retornar dados das embalagens")
					return done(err)
				}

				done();
			});
	})
})
