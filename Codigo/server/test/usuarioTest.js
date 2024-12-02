import request from 'supertest';
import assert from 'assert';
import app from '../index.js';

describe('POST /cadastro', () => {
	it('deve retornar erro quando usuário não receber permissão', (done) => {
		const newUser = {
			nome: "Um nome qualquer",
			email: "umemail@qualquer.com",
			senha: "umasenhaqualquer"
		}

		request(app)
			.post('/cadastro')
			.send(newUser)
			.end((err, res) => {
				if(err) {
					assert.equal(res.body.tipo, "Erro de cadastro")
					return done(err);
				}

				assert.equal(res.body.tipo, "Cadastro realizado com sucesso")
				done();
			});
	})
})

describe('POST /login', () => {
	it('deve retornar erro quando usuário não for encontrado', (done) => {
		const newLogin = {
			email: "js@gmail.com",
			senha: "javaScript>>>Java"
		}

		request(app)
			.post('/login')
			.send(newLogin)
			.end((err, res) => {
				if (err){;
					assert.strictEqual(res.body.tipo, "Usuário não encontrado");
					return done(err);
				}
				assert.equal(res.body.tipo, "Login realizado com sucesso");
				done();
			});
	})
})
