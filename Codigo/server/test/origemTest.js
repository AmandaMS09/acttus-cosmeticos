import request from 'supertest';
import assert from 'assert';
import app from '../index.js';

describe('Teste das rotas de origem.js', () => {
	it('/selectOrigem', (done) => {
		request(app)
			.get('/selectOrigem')
			.expect(200)
			.end((err, res) => {
				if(err){
					assert.equal(res.body.tipo, "Erro");
					return done(err);
				}
				
				done();

			});
	})

	it('/getIdOrigem', (done) => {
		request(app)
			.get('/getIdOrigem')
			.expect(200)
			.end((err, res) =>{
				if(err){
					assert.equal(res.body.tipo, "Erro");
					return done(err);
				}
				
				done();
			});
	})
})


