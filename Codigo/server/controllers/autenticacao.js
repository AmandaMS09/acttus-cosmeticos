import { db } from "../db/initSupabase.js"

// CADASTRO DE USUÁRIO
export const cadastro = async (req, res) => {
  try {
    const {
      nome,
      email,
      senha
    } = req.body

    const { data: registerData, error } = await db.from('usuario').insert({
      nome: nome,
      senha: senha,
      email: email
    }).select()

    if (error) {
      return res.json({
        tipo: "Erro de cadastro",
        mensagem: error,
      });
    }

    const { data: loginData } = await db.from('usuario').select().eq('email', registerData[0].email).eq('senha', registerData[0].senha)

    return res.json({
      tipo: "Cadastro realizado com sucesso",
      mensagem: `Bem vindo ao nosso site, ${loginData[0].nome}`,
      usuario: {
        id: loginData[0].id,
        temPermissao: loginData[0].temPermissao,
      },
    });
  } catch (err) {
    res.json({
      tipo: "Erro de cadastro",
      mensagem: err,
    });
  }
};


// LOGIN
export const login = async (req, res) => {
  try {
    const {
      email,
      senha
    } = req.body

    const { data } = await db.from('usuario').select().eq('email', email).eq('senha', senha)

    if (data == null || !data[0]) {
      return res.json({
        tipo: "Usuário não encontrado",
        mensagem: "Verifique os valores inseridos",
      });
    }
    return res.json({
      tipo: "Login realizado com sucesso",
      mensagem: `Bem vindo de volta, ${data[0].nome}`,
      usuario: {
        id: data[0].id,
        temPermissao: data[0].temPermissao,
      },
    });
  } catch (err) {
    res.json({
      tipo: "Erro",
      mensagem: err,
    });
  }
};