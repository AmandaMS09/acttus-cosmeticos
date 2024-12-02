import request from 'supertest';
import assert from 'assert';
import app from '../index.js';

describe('Testar rotas de materia-prima.js', () => {
	it('POST /cadastrarMateriaPrima', (done) => {
		const newMateriaPrima = {
			nome: "Propenoato de alquilo",
			INCI_nome: "c10-30 alkyl acrylate",
			estoque_atual: "10",
			estoque_min: "5",
			origemId: "4",
			fornecedores: "",

		}

		request(app)
			.post('/cadastraMateriaPrima')
			.expect(200)
			.end((err, res) => {
				if(err){
					assert.equal(res.body.tipo, "Erro");
					return done(err);
				}

				done();
			});
	})

	it('POST /listarMateriaPrima', (done) => {
		request(app)
			.post('/listarMateriaPrima')
			.expect(200)
			.end((err, res) => {
				if(err){
					assert.equal(res.body.tipo, "Erro");
					return done(err);
				}

				done();
			})
	})
})
