import request from 'supertest';
import assert from 'assert';
import app from '../index.js';

describe('POST /cadastro', () => {
	it('', (done) => {
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
				assert.strictEqual(res.body.messsage, "Bem vindo ao nosso site, O JavaScript");
				done();
			});
	})
})

describe('POST /login', () => {
	it('', (done) => {
		const newLogin = {
			email: "js@gmail.com",
			senha: "javaScript>>>Java"
		}

		request(app)
			.post('/login')
			.send(newLogin)
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.body.message, "Bem vindo de volta, O JavaScript");
				done();
			});
	}
})
