import request from 'supertest';
import assert from 'assert';
import app from '../index.js';

describe('Teste das rotas de torulos.js', () => {
	it('/cadastrarRotulo', (done) => {
		const newRotulo = {
			rotulos: "algum rotulo bacana",
		}

		request(app)
			.post('/cadastrarRotulo')
			.send(newRotulo)
			.expect(200)
			.end((err, res) => {
				if(err){
					assert.equal(res.body.tipo, "Erro ao cadastrar rotulo")
					return done(err);
				}

				done();
			});
	})

	it('/listarRotulo', (done) => {
		const rotulo = {produto_id: "2"}
		request(app)
			.post('/cadastrarRotulo')
			.send(rotulo)
			.expect(200)
			.end((err, res) => {
				if(err){
					assert.equal(res.body.tipo, "Erro ao retornar dados dos rotulos")
					return done(err);
				}

				done();
			});
	})

})
