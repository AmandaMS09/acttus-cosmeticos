import request from 'supertest';
import assert from 'assert';
import app from '../index.js';

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

describe('POST /cadastro', () => {
	it('deve retornar erro quando usuário não receber permissão', (done) => {
		const userName = generateRandomString(8)
		const newUser = {
			nome: "Um nome qualquer",
			email: `${userName}@qualquer.com`,
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
