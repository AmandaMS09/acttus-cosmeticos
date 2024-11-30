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

export const listaUsuarios = async (req, res) => {
  try {
    const { data, error } = await db.from('usuario').select();

    if (error) {
      return res.json({
        tipo: "Erro ao retornar dados dos usuários",
        mensagem: error,
      });
    }

    const usuarios = data.map(row => ({
      id: row.id,
      nome: row.nome,
      email: row.email,
      temPermissao: row.temPermissao,
    }));

    return res.json({
      usuarios: usuarios
    });
  } catch (err) {
    res.json({
      tipo: "Erro",
      mensagem: err,
    });
  }
};

export const usuarioEspecifico = async (req, res) => {
  try {
    const { id } = req.body;

    const { data, error } = await db.from('usuario').select().eq('id', id);

    if (error) {
      return res.json({
        tipo: "Erro ao retornar dados dos produtos",
        mensagem: error,
      });
    }

    const usuario = data.map(row => ({
      id: row.id,
      nome: row.nome,
      email: row.email,
      temPermissao: row.temPermissao,
    }));

    return res.json({
      usuario: usuario
    });
  } catch (err) {
    res.json({
      tipo: "Erro",
      mensagem: err,
    });
  }
};

export const deletarUsuario = async (req, res) => {
  try {
    const { id_usuario_permissao } = req.body;

    const { error } = await db.from('usuario').delete().eq('id', id_usuario_permissao);

    if (error) {
      return res.json({
        tipo: "Erro ao deletar usuário",
        mensagem: error,
      });
    }

    return res.json({
      tipo: "Usuário deletado com sucesso",
      mensagem: `Usuário de ID ${id_usuario_permissao} foi deletado com sucesso!`,
    });
  } catch (err) {
    res.json({
      tipo: "Erro",
      mensagem: err,
    });
  }
};

export const alterarNomeUsuario = async (req, res) => {
  try {
    const { novoNome, id_usuario_permissao } = req.body;

    const { error } = await db.from('usuario').update({ nome: novoNome }).eq('id', id_usuario_permissao);

    if (error) {
      return res.json({
        tipo: "Erro ao atualizar nome do usuário",
        mensagem: error,
      });
    }

    return res.json({
      tipo: "Atualização realizada com sucesso",
      mensagem: `Nome do usuário de ID ${id_usuario_permissao} foi atualizado com sucesso!`,
    });
  } catch (err) {
    res.json({
      tipo: "Erro",
      mensagem: err,
    });
  }
};

export const alterarEmailUsuario = async (req, res) => {
  try {
    const { novoEmail, id_usuario_permissao } = req.body;

    const { error } = await db.from('usuario').update({ email: novoEmail }).eq('id', id_usuario_permissao);

    if (error) {
      return res.json({
        tipo: "Erro ao atualizar email do usuário",
        mensagem: error,
      });
    }

    return res.json({
      tipo: "Atualização realizada com sucesso",
      mensagem: `Email do usuário de ID ${id_usuario_permissao} foi atualizado com sucesso!`,
    });
  } catch (err) {
    res.json({
      tipo: "Erro",
      mensagem: err,
    });
  }
};

export const alterarPermissaoUsuario = async (req, res) => {
  try {
    const { perm, id } = req.body;

    const { error } = await db.from('usuario').update({ temPermissao: perm }).eq('id', id);

    if (error) {
      return res.json({
        tipo: "Erro ao alterar permissão do usuário",
        mensagem: error,
      });
    }

    return res.json({
      tipo: "Atualização realizada com sucesso",
      mensagem: `Permissão do usuário de ID ${id} foi atualizada com sucesso!`,
    });
  } catch (err) {
    res.json({
      tipo: "Erro",
      mensagem: err,
    });
  }
};