import request from 'supertest';
import assert from 'assert';
import app from '../index.js';

describe('POST /cadastro', () => {
	it('deve retornar erro quando usuário não receber permissão', (done) => {
		const newUser = {
			nome: "O JavaScript",
			email: "js@gmail.com",
			senha: "javaScript>>>Java"
		}

		request(app)
			.post('/cadastro')
			.send(newUser)
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.body.tipo, "Erro de cadastro");
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
				if (err) return done(err);
				assert.strictEqual(res.body.tipo, "Usuário não encontrado");
				done();
			});
	})
})
