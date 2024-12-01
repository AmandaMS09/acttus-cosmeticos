import { cadastro, login, listaUsuarios, usuarioEspecifico, deletarUsuario, alterarNomeUsuario, alterarEmailUsuario, alterarPermissaoUsuario } from '../controllers/usuario';
import { db } from '../db/initSupabase';

jest.mock('../db/initSupabase');

describe('Testes do módulo usuário', () => {
afterEach(() => {
  jest.clearAllMocks();
});

it('Deve cadastrar um novo usuário', async () => {
  const req = {
    body: {
      nome: 'Teste',
      email: 'teste@teste.com',
      senha: '123456'
    }
  };
  const res = {
    json: jest.fn()
  };

  db.from.mockReturnValue({
    insert: jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: [req.body], error: null })
    }),
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: [req.body], error: null })
      })
    })
    });

  await cadastro(req, res);

  expect(res.json).toHaveBeenCalledWith({
    tipo: "Cadastro realizado com sucesso",
    mensagem: `Bem vindo ao nosso site, ${req.body.nome}`,
    usuario: {
      id: req.body.id,
      temPermissao: req.body.temPermissao,
    },
  });
});


it('Deve realizar o login de um usuário', async () => {
    const req = {
        body: {
          nome: 'Teste',
          email: 'teste@teste.com',
          senha: '123456'
        }
        };
  const res = {
    json: jest.fn()
  };

  db.from.mockReturnValue({
    insert: jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: [req.body], error: null })
    }),
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: [req.body], error: null })
      })
    })
    });

  await login(req, res);

  expect(res.json).toHaveBeenCalledWith({
    tipo: "Login realizado com sucesso",
    mensagem: `Bem vindo de volta, ${req.body.nome}`,
    usuario: {
      id: req.body.id,
      temPermissao: req.body.temPermissao,
    },
  });
});
});
