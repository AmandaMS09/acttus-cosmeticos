// CONFIGURAÇÃO DO SERVIDOR / 

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

// Configura a conexão com o banco de dados
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "coxinha",
  database: "controleProducao",
});


// Inicializa a conexão com o banco de dados
connection.connect();

// testar a conexão
connection.query("SELECT 1+1 AS solution", (err, rows, fields) => {
  //Operação simples para testar o funcionamento
  if (err) throw err;

  console.log("The solution is: ", rows[0].solution);
});

app.use(cors({ origin: "*", }));

// INICIAR SERVIDOR NODE/

app.listen(3303, () => {
  console.log("Servidor inicializado!");
});

// ------------------------------------------------------------------------------------------------ //

// ROTAS 
// CADASTRO DE USUÁRIO
app.post("/cadastro", function (req, res) {
  connection.query(
    `INSERT INTO usuario VALUES(NULL,"${req.body.nome}","${req.body.senha}","${req.body.email}",0)`,
    (err, rows, fields) => {
      // Operação simples para testar o funcionamento
      if (err) {
        return res.json({
          tipo: "Erro de cadastro",
          mensagem: err,
        });
      }

      connection.query(
        `SELECT * FROM usuario WHERE email = "${req.body.email}" AND senha = "${req.body.senha}"`,
        (err, rows, fields) => {

          if (err) {
            return res.json({
              tipo: "Erro de login",
              mensagem: err,
            });
          }

          return res.json({
            tipo: "Cadastro realizado com sucesso",
            mensagem: `Bem vindo ao nosso site, ${rows[0].nome}`,
            usuario: {
              id: rows[0].id,
              temPermissao: rows[0].temPermissao,
            },
          });
        }
      );
    }
  );
});


// LOGIN
app.post("/login", function (req, res) {
  connection.query(
    `SELECT * FROM usuario WHERE email = "${req.body.email}" AND senha = "${req.body.senha}"`,
    (err, rows, fields) => {
      // Operação simples para testar o funcionamento
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      }

      if (rows[0] == null) {
        return res.json({
          tipo: "Usuário não encontrado",
          mensagem: "Verifique os valores inseridos",
        });
      } else {
        return res.json({
          tipo: "Login realizado com sucesso",
          mensagem: `Bem vindo de volta, ${rows[0].nome}`,
          usuario: {
            id: rows[0].id,
            temPermissao: rows[0].temPermissao,
          },
        });
      }
    }
  );
});


// Pegar as origens do banco de dados para colocar no dropdown
app.get('/selectOrigem', function (req, res) {
  var arrayOrigem = [];

  connection.query('SELECT * FROM origem', (err, rows, fields) => {
    if (err) {
      return res.json({
        tipo: "Erro",
        mensagem: err,
      });
    }
    else {
      for (let i = 0; i < rows.length; i++) {
        arrayOrigem.push({
          id: rows[i].id,
          nome: rows[i].nome,
        });
      }
    }
    res.send(JSON.stringify(arrayOrigem));
  })
});


//Função para pegar o ID da origem
app.get("/getIdOrigem", function (req, res) {

  connection.query(
    `SELECT id from origem, where nome like ${req.body.nome}`,

    (err, rows, fields) => {
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      }
      res.send(JSON.stringify(rows[0].id));
    }
  )

})

//Cadastro de matéria prima
app.post("/cadastraMateriaPrima", function (req, res) {
  connection.query(
    `INSERT INTO materiaPrima VALUES (NULL, "${req.body.nome}", "${req.body.INCI_nome}", "${req.body.estoque_atual}", "${req.body.estoque_min}", "${req.body.origemId}")`,
    (err, rows, fields) => {
      if (err) {
        return res.json({
          tipo: "Erro de cadastro",
          mensagem: err,
        });
      }

      connection.query(
        `SELECT * from materiaPrima where "${req.body.INCI_nome}" like materiaPrima.inci`,
        (err, rows, fields) => {

          if (err) {
            return res.json({
              tipo: "Erro de retorno do id",
              mensagem: err,
            });
          }

          for (let i = 0; i < req.body.fornecedores.length; i++) {
            connection.query(
              `INSERT INTO materiaprima_has_fornecedor VALUES(${parseInt(rows[0].id)}, ${req.body.fornecedores[i].id}, ${req.body.fornecedores[i].preco}, ${req.body.fornecedores[i].minQtd})`,

              (err, rows, fields) => {

                if (err) {
                  return res.json({
                    tipo: "Erro",
                    mensagem: err,
                  });
                }
              },)
          }

        }
      );

    }
  );
});

app.post("/listarMateriaPrima", function (req, res) {
  var materiaPrima = []
  connection.query(
    `select * from materiaPrima;`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados das Materias Primas",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        materiaPrima.push({
          id: rows[cont].id,
          nome: rows[cont].nome,
          inci: rows[cont].inci,
          estoque: rows[cont].estoque,
          minimo: rows[cont].minimo,
          origem_id: rows[cont].origem_id
        })
      }
      return res.json({
        materiaPrima: materiaPrima
      });
    }
  );
});

app.post("/listarRotulo", function (req, res) {
  var rotulo = []
  connection.query(
    `select * from rotulo;`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados dos Rotulos",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        rotulo.push({
          id: rows[cont].id,
          tipo: rows[cont].tipo,
          principal: rows[cont].principal,
          nome: rows[cont].nome,
          estoque: rows[cont].estoque,
          minimo: rows[cont].minimo,
          produto_id: rows[cont].produto_id
        })
      }
      return res.json({
        rotulo: rotulo
      });
    }
  );
});

app.post("/updateMateriaPrima", function (req, res) {
  connection.query(

    `UPDATE materiaPrima set materiaPrima.nome = "${req.body.nome}", materiaPrima.inci = "${req.body.inci}", materiaPrima.estoque = ${req.body.estoque}, materiaPrima.minimo = ${req.body.minimo}, materiaPrima.origem_id = ${req.body.origem_id} where materiaPrima.id = ${req.body.id};`,
    (err, rows, fields) => {


      if (err) {
        return res.json({
          tipo: "Erro ao atualizar dados da Matéria Prima",
          mensagem: err,
        });
      }

      for (let i = 0; i < req.body.fornecedores.length; i++) {
        connection.query(
          `INSERT INTO materiaprima_has_fornecedor VALUES(${req.body.id}, ${req.body.fornecedores[i].id}, ${req.body.fornecedores[i].preco}, ${req.body.fornecedores[i].minQtd})`,

          (err, rows, fields) => {

            if (err) {
              return res.json({
                tipo: "Erro no cadastro de fornecedor da matéria prima",
                mensagem: err,
              });
            }

          },)
      }

      return res.json({
        tipo: "Atualização da Matéria Prima",
        mensagem: `Matéria Prima atualizada com sucesso!`,
        s: "S de serto"
      });
    }
  );
});

app.post("/updateFornecedorMP", function (req, res) {

  for (let cont = 0; cont < req.body.fornecedores.length; cont++) {
    connection.query(
      `update materiaprima_has_fornecedor set preco = ${Number((req.body.fornecedores[cont].preco).replace(",", ".").replace("R$", ""))}, quantidade_minima = ${Number(req.body.fornecedores[cont].minQtd)} where materiaPrima_id = ${req.body.MP_id} and fornecedor_id = ${Number(req.body.fornecedores[cont].id)};`,
      (err, rows, fields) => {


        if (err) {
          return res.json({
            tipo: "Erro ao atualizar fornecedores da matéria prima",
            mensagem: err,
          });
        }
        return res.json({
          tipo: "Atualização de Fornecedor",
          mensagem: `Fornecedores atualizados com sucesso!`,
          s: "s de serto"
        });
      }
    );
  }

});


app.post("/listarFornecedoresMP", function (req, res) {
  var fornecedores = []
  connection.query(
    `select * from materiaPrima_has_fornecedor join fornecedor f on fornecedor_id = f.id and materiaPrima_id = ${req.body.materiaPrima_id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados dos fornecedores",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        fornecedores.push({
          preco: rows[cont].preco,
          minQtd: rows[cont].quantidade_minima,
          id: rows[cont].id,
          nome: rows[cont].nome,
          email: rows[cont].email,
          telefone: rows[cont].telefone
        })
      }
      return res.json({
        fornecedores: fornecedores
      });
    }
  );
});

app.post("/updateRotulo", function (req, res) {
  connection.query(
    `UPDATE rotulo set rotulo.tipo = ${req.body.tipo}, rotulo.estoque = ${req.body.estoque}, rotulo.minimo = ${req.body.minimo}, rotulo.principal = ${req.body.principal}, rotulo.nome = "${req.body.nome}" where rotulo.id = ${req.body.id};`,
    (err, rows, fields) => {
      if (err) {
        return res.json({
          tipo: "Erro ao atualizar dados de Rotulos",
          mensagem: err,
        });
      }

      for (let i = 0; i < req.body.fornecedores.length; i++) {
        connection.query(
          `INSERT INTO rotulo_has_fornecedor VALUES(${req.body.id}, ${req.body.fornecedores[i].id}, ${req.body.fornecedores[i].preco}, ${req.body.fornecedores[i].minQtd})`,

          (err, rows, fields) => {

            if (err) {
              return res.json({
                tipo: "Erro no cadastro de fornecedor do rótulo",
                mensagem: err,
              });
            }

          },)
      }
      return res.json({
        tipo: "Atualização de Rotulo",
        mensagem: `Rotulo atualizada com sucesso!`,
        s: "S de serto"
      });
    }
  );
});

app.post("/deleteRotulo", function (req, res) {
  connection.query(
    `delete from rotulo where id = ${req.body.id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao deletar rotulo",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Deletar rotulo",
        mensagem: "rotulo deletada com sucesso",
      });
    }
  );
});

app.post("/deleteMateriaPrima", function (req, res) {
  connection.query(
    `delete from materiaPrima where id = ${req.body.id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao deletar matéria prima",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Deletar Matéria prima",
        mensagem: "Matéria prima deletada com sucesso",
      });
    }
  );
});

app.post("/deleteMPHasF", function (req, res) {
  connection.query(
    `delete from materiaPrima_has_fornecedor where materiaPrima_id = ${req.body.materiaPrima_id} and fornecedor_id = ${req.body.fornecedor_id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao deletar matéria prima",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Deletar Matéria prima",
        mensagem: "Matéria prima deletada com sucesso",
      });
    }
  );
});

app.get('/selectMateriasPrimas', function (req, res) {
  var arrayOrigem = [];

  connection.query('SELECT * FROM materiaPrima',
    (err, rows, fields) => {
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      }
      else {
        for (let i = 0; i < rows.length; i++) {
          arrayOrigem.push({
            id: rows[i].id,
            nome: rows[i].nome,
          });
        }
      }
      res.send(JSON.stringify(arrayOrigem));
    })
});


app.post("/cadastrarProduto", function (req, res) {
  connection.query(
    `INSERT INTO produto VALUES(NULL,"${req.body.nome}","${req.body.lucro}")`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao cadastrar produto",
          mensagem: err,
        });
      }

      connection.query(
        `SELECT id from produto where "${req.body.nome}" like nome`,
        (err, rows, fields) => {

          if (err) {
            return res.json({
              tipo: "Erro de retorno do id",
              mensagem: err,
            });
          }
          return res.json({
            tipo: "Cadastro produto",
            mensagem: `Produto cadastrado com sucesso!`,
            id: rows[0].id
          });

        }
      );
    }
  );
});

app.post("/cadastrarFormula", function (req, res) {
  for (let i = 0; i < req.body.formulas.length; i++) {
    connection.query(
      `insert into formula values(null, "${req.body.formulas[i].nome}", ${Number(req.body.formulas[i].principalMP)}, ${req.body.id});`,
      (err, rows, fields) => {

        if (err) {
          return res.json({
            tipo: "Erro ao cadastrar fórmula",
            mensagem: err,
          });
        }

        connection.query(
          `SELECT * from formula where nome like "${req.body.formulas[i].nome}" and produto_id = ${req.body.id};`,
          (err, rows, fields) => {

            if (err) {
              return res.json({
                tipo: "Erro de retorno do id",
                mensagem: err,
              });
            }

            for (let j = 0; j < req.body.formulas[i].MateriasPrimas.length; j++) {
              connection.query(
                `insert into formula_has_materiaprima values(${rows[0].id},${Number(req.body.formulas[i].MateriasPrimas[j].idMP)},${Number(req.body.formulas[i].MateriasPrimas[j].composicao)},${Number(req.body.formulas[i].MateriasPrimas[j].passo)});`,

                (err, rows, fields) => {

                  if (err) {
                    return res.json({
                      tipo: "Erro no cadastro da matéria prima da fórmula",
                      mensagem: err,
                    });
                  }

                },)
            }
          }
        );
      }
    );
  }

  return res.json({
    tipo: "Cadastro de fórmula",
    mensagem: `Itens cadastrados com sucesso!`,
    s: "S de serto"
  });
});

app.post("/cadastrarRotuloHasFornecedor", function (req, res) {
  for (let j = 0; j < req.body.rotulos[i].fornecedores.length; j++) {
    connection.query(
      `INSERT INTO rotulo_has_fornecedor VALUES(${req.body.id}, ${req.body.rotulos[i].fornecedores[j].id}, ${req.body.rotulos[i].fornecedores[j].preco}, ${req.body.rotulos[i].fornecedores[j].minQtd})`,

      (err, rows, fields) => {

        if (err) {
          return res.json({
            tipo: "Erro no cadastro de fornecedor do rótulo",
            mensagem: err,
          });
        }

      },)
  }

  return res.json({
    tipo: "Cadastro de rótulo e fornecedor",
    mensagem: `Itens cadastrados com sucesso!`,
    s: "S de serto"
  });
});


app.post("/cadastrarRotulo", function (req, res) {
  for (let i = 0; i < req.body.rotulos.length; i++) {
    console.log("tipo: " + req.body.rotulos[i].tipo + "//" + req.body.rotulos[i].principal + "//" + req.body.rotulos[i].estoque + "//" + req.body.rotulos[i].nome + "//" + req.body.id)
    var estoque = req.body.rotulos[i].estoque
    var minimo = req.body.rotulos[i].minimo
    if (estoque == "")
      estoque = 0;
    if (minimo == "")
      minimo = 0;
    connection.query(
      `INSERT INTO rotulo VALUES(NULL,${req.body.rotulos[i].tipo},${req.body.rotulos[i].principal},${Number(estoque)},"${req.body.rotulos[i].nome}",${req.body.id},${Number(minimo)})`,
      (err, rows, fields) => {

        if (err) {
          return res.json({
            tipo: "Erro ao cadastrar rotulo",
            mensagem: err,
          });
        }

        connection.query(
          `SELECT * from rotulo where nome like "${req.body.rotulos[i].nome}" and produto_id = ${req.body.id};`,
          (err, rows, fields) => {

            if (err) {
              return res.json({
                tipo: "Erro de retorno do id",
                mensagem: err,
              });
            }

            for (let j = 0; j < req.body.rotulos[i].fornecedores.length; j++) {
              console.log(JSON.stringify(req.body.rotulos[i]))
              connection.query(
                `INSERT INTO rotulo_has_fornecedor VALUES(${rows[0].id}, ${Number(req.body.rotulos[i].fornecedores[j].id)}, ${Number(req.body.rotulos[i].fornecedores[j].preco)}, ${Number(req.body.rotulos[i].fornecedores[j].minQtd)})`,

                (err, rows, fields) => {

                  if (err) {
                    return res.json({
                      tipo: "Erro no cadastro de fornecedor do rótulo",
                      mensagem: err,
                    });
                  }

                },)
            }
          }
        );
      }
    );
  }

  return res.json({
    tipo: "Cadastro de rótulo e fornecedor",
    mensagem: `Itens cadastrados com sucesso!`,
    s: "S de serto"
  });
});


// Pegar os rotulos do banco de dados 
app.get('/selectRotulo', function (req, res) {
  var arrayRotulo = [];

  connection.query('SELECT * FROM rotulo inner join rotulo_has_fornecedor on rotulo.id = rotulo_has_fornecedor.rotulo_id;', (err, rows, fields) => {
    if (err) {
      return res.json({
        tipo: "Erro",
        mensagem: err,
      });
    }
    else {
      for (let i = 0; i < rows.length; i++) {
        arrayRotulo.push({
          id: rows[i].id,
          nome: rows[i].nome,
          preco: rows[i].preco,
          principal: rows[i].principal
        });
      }
    }
    res.send(JSON.stringify(arrayRotulo));
  })
});


app.post("/cadastraEmbalagem", function (req, res) {
  var estoque = req.body.estoque
  if (estoque == "")
    estoque = 0;
  connection.query(
    `INSERT INTO embalagem VALUES (NULL,"${req.body.nome}","${req.body.value}",${parseFloat(req.body.tamanho)}, ${Number(estoque)}, ${Number(req.body.minimo)})`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao cadastrar embalagem",
          mensagem: err,
        });
      }

      connection.query(
        `SELECT * from embalagem where nome like "${req.body.nome}" and tipo = ${req.body.value};`,
        (err, rows, fields) => {

          if (err) {
            return res.json({
              tipo: "Erro de retorno do id",
              mensagem: err,
            });
          }

          for (let j = 0; j < req.body.fornecedores.length; j++) {
            connection.query(
              `INSERT INTO embalagem_has_fornecedor VALUES(${rows[0].id}, ${req.body.fornecedores[j].id}, ${req.body.fornecedores[j].preco}, ${req.body.fornecedores[j].minQtd})`,

              (err, rows, fields) => {

                if (err) {
                  return res.json({
                    tipo: "Erro no cadastro de fornecedor da embalagem",
                    mensagem: err,
                  });
                }

              },)
          }
        }
      );
      return res.json({
        tipo: "Cadastro Embalagem",
        mensagem: `Embalagem cadastrada com sucesso!`,
      });
    }
  );
});

app.get('/selectEmbalagem', function (req, res) {
  var arrayEmbalagem = [];

  connection.query('SELECT e.id, e.nome, max(f.preco) as preco FROM embalagem e JOIN embalagem_has_fornecedor f ON e.id = f.embalagem_id group by 1;', (err, rows, fields) => {
    if (err) {
      return res.json({
        tipo: "Erro",
        mensagem: err,
      });
    }
    else {
      for (let i = 0; i < rows.length; i++) {
        arrayEmbalagem.push({
          id: rows[i].id,
          nome: rows[i].nome,
          preco: rows[i].preco,
        });
      }
    }
    return res.json({
      tipo: "Select Embalagens",
      mensagem: `Dados retornados com sucesso!`,
      embalagens: arrayEmbalagem,
    });
  })
});

app.post('/produtoHasEmbalagem', function (req, res) {
  var p
  for (let i = 0; i < req.body.dados.length; i++) {
    p = 0
    if (req.body.dados[i].principal)
      p = 1;
    connection.query(`insert into produto_has_embalagem values(${Number(req.body.produtoId)},${Number(req.body.dados[i].id)},${p})`,
      (err, rows, fields) => {
        if (err) {
          return res.json({
            tipo: "Erro",
            mensagem: err,
          });
        }
      })
  }
  return res.json({
    tipo: "Embalagens",
    mensagem: `Embalagens do produto cadastradas com sucesso!`,
    s: "Serto com s",
  });
});

app.get('/selectFormula', function (req, res) {
  var arrayFormula = [];

  connection.query('select distinct SUM(materiaPrima_has_fornecedor.preco) as preco, formula.principal, formula.nome from materiaPrima_has_fornecedor ,formula_has_materiaPrima , materiaPrima, formula where materiaPrima_has_fornecedor.materiaPrima_id = formula_has_materiaPrima.materiaPrima_id and materiaPrima_has_fornecedor.materiaPrima_id = materiaPrima.id and formula_has_materiaPrima.formula_id = formula.id group by formula.nome, formula.principal;', (err, rows, fields) => {
    if (err) {
      return res.json({
        tipo: "Erro",
        mensagem: err,
      });
    }
    else {
      for (let i = 0; i < rows.length; i++) {
        arrayFormula.push({
          preco: rows[i].preco,
          principal: rows[i].principal,
          nome: rows[i].nome
        });
      }
    }
    res.send(JSON.stringify(arrayFormula));
  })
});

app.post("/cadastraFornecedorHasEmbalagem", function (req, res) {
  connection.query(
    `INSERT INTO embalagem_has_fornecedor VALUES("${req.body.embalagem_id}","${req.body.fornecedor_id}","${req.body.preco}")`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao cadastrar fornecedor da embalagem",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Cadastro Embalagem",
        mensagem: `Fornecedor da embalagem cadastrado com sucesso!`,
      });
    }
  );
});


app.post("/selectFornecedores", function (req, res) {
  var arrayFornecedor = [];

  connection.query(`SELECT * FROM fornecedor`, (err, rows, fields) => {
    if (err) {
      console.log("Erro")
      return res.json({
        tipo: "Erro",
        mensagem: err,
      });
    }
    else {
      for (let i = 0; i < rows.length; i++) {
        arrayFornecedor.push({
          id: rows[i].id,
          nome: rows[i].nome,
          email: rows[i].email,
          telefone: rows[i].telefone
        });
      }
    }
    return res.json({
      arrayFornecedor: arrayFornecedor
    });
  });
}
);

app.post("/cadastraFornecedor", function (req, res) {
  connection.query(
    `INSERT INTO fornecedor VALUES (NULL,"${req.body.nome}","${req.body.email}","${req.body.telefone}");`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao cadastrar fornecedor",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Cadastro Fornecedor",
        mensagem: `Fornecedor cadastrado com sucesso!`,
      });
    }
  );
});

// Update fornecedor
app.post("/updateFornecedor", function (req, res) {
  connection.query(
    `UPDATE fornecedor set fornecedor.nome = "${req.body.nome}", fornecedor.email = "${req.body.email}", fornecedor.telefone = "${req.body.telefone}" where fornecedor.id = ${req.body.id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao atualizar dados do fornecedor",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Atualização do Fornecedor",
        mensagem: `Fornecedor atualizado com sucesso!`,
      });
    }
  );
});


app.get("/readFornecedor", function (req, res) {
  var arrayPesquisaFornecedor = [];
  connection.query(
    `SELECT * FROM fornecedor WHERE nome LIKE "%${req.body.pesquisa}%";`,
    (err, rows, fields) => {
      if (err) {
        console.log("Erro")
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      }
      else {
        for (let i = 0; i < rows.length; i++) {
          arrayPesquisaFornecedor.push({
            id: rows[i].id,
            nome: rows[i].nome,
            email: rows[i].email,
            telefone: rows[i].telefone
          });
        }
      }
      res.send(JSON.stringify(arrayPesquisaFornecedor));
    });
}
);



app.post("/deleteFornecedor", function (req, res) {

  connection.query(
    `DELETE FROM fornecedor WHERE id = "${req.body.id}";`,
    (err, rows, fields) => {


      if (err) {
        return res.json({
          tipo: "Erro ao deletar o fornecedor",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Deletar Fornecedor",
        mensagem: `Fornecedor deletado com sucesso!`,
      });
    }
  );
});





app.post("/deleteFormula", function (req, res) {

  connection.query(
    `delete from formula where id = ${req.body.id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao deletar formula",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Deletar Formula",
        mensagem: `Formula deletada com sucesso!`,
      });
    }
  );


});

app.post("/deleteRotulo", function (req, res) {
  connection.query(
    `delete from rotulo where id = ${req.body.id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao deletar rotulo",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Deletar Rotulo",
        mensagem: `Rotulo deletado com sucesso!`,
      });
    }
  );

});

app.post("/deletePHasE", function (req, res) {
  connection.query(
    `delete from produto_has_embalagem where produto_id = ${req.body.p_id} and embalagem_id = ${req.body.e_id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao remover embalagem do produto",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Remover Embalagem",
        mensagem: `Embalegem removida com sucesso!`,
      });
    }
  );

});


app.post("/listarProdutos", function (req, res) {
  var produtos = []
  connection.query(
    `select p.id, p.nome, p.lucro, f.nome as formula from produto p left join formula f on f.produto_id = p.id and f.principal = 1;`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados dos produtos",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        produtos.push({
          id: rows[cont].id,
          nome: rows[cont].nome,
          lucro: rows[cont].lucro,
          formula: rows[cont].formula
        })
      }
      return res.json({
        produtos: produtos
      });
    }
  );
});

app.post("/deleteProduto", function (req, res) {
  connection.query(
    `delete from produto where id = ${req.body.id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao deletar produto",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Deletar Produto",
        mensagem: "Produto deletado com sucesso",
      });
    }
  );
});

app.post("/updateProduto", function (req, res) {
  connection.query(
    `update produto set nome = "${req.body.nome}", lucro = ${req.body.lucro} where id = ${req.body.id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao atualizar produto",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Alterar Produto",
        mensagem: "Produto alterado com sucesso",
      });
    }
  );
});

//----------------------------------------------------------------------
app.post("/listarFornecedorMateriaPrima", function (req, res) {
  var fornecedores = []
  connection.query(
    `select * from materiaprima_has_fornecedor fm join materiaprima m on fm.materiaPrima_id = m.id and fm.fornecedor_id = ${req.body.fornecedor_id};
    `,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados dos fornecedores",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        fornecedores.push({
          preco: rows[cont].preco,
          minQtd: rows[cont].quantidade_minima,
          id: rows[cont].id,
          nome: rows[cont].nome
        })
      }
      return res.json({
        fornecedores: fornecedores
      });
    }
  );
});
//----------------------------------------------------------------------
app.post("/listarFornecedorEmbalagens", function (req, res) {
  var fornecedores = []
  connection.query(
    `select * from embalagem_has_fornecedor fm join embalagem m on fm.embalagem_id = m.id and fm.fornecedor_id = ${req.body.fornecedor_id};`,

    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados dos fornecedores",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        fornecedores.push({
          preco: rows[cont].preco,
          minQtd: rows[cont].quantidade_minima,
          id: rows[cont].id,
          nome: rows[cont].nome
        })
      }
      return res.json({
        fornecedores: fornecedores
      });
    }
  );
});
//----------------------------------------------------------------------
app.post("/listarFornecedorRotulo", function (req, res) {
  var fornecedores = []
  connection.query(
    `select * from rotulo_has_fornecedor fm join rotulo m on fm.rotulo_id = m.id and fm.fornecedor_id = ${req.body.fornecedor_id};`,

    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados dos fornecedores",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        fornecedores.push({
          preco: rows[cont].preco,
          minQtd: rows[cont].quantidade_minima,
          id: rows[cont].id,
          nome: rows[cont].nome
        })
      }
      return res.json({
        fornecedores: fornecedores
      });
    }
  );
});
//----------------------------------------------------------------------
app.post("/listarFornecedoresE", function (req, res) {
  var fornecedores = []
  connection.query(
    `select * from embalagem_has_fornecedor ef join fornecedor f on ef.fornecedor_id = f.id and ef.embalagem_id = ${req.body.embalagem_id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados dos fornecedores",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        fornecedores.push({
          preco: rows[cont].preco,
          minQtd: rows[cont].quantidade_minima,
          id: rows[cont].id,
          nome: rows[cont].nome,
          email: rows[cont].email,
          telefone: rows[cont].telefone
        })
      }
      return res.json({
        fornecedores: fornecedores
      });
    }
  );
});

app.post("/listarFornecedoresRotulo", function (req, res) {
  var fornecedores = []
  connection.query(
    `select * from rotulo_has_fornecedor ef join fornecedor f on ef.fornecedor_id = f.id and ef.rotulo_id = ${req.body.rotulo_id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados dos fornecedores",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        fornecedores.push({
          preco: rows[cont].preco,
          minQtd: rows[cont].quantidade_minima,
          id: rows[cont].id,
          nome: rows[cont].nome,
          estoque: rows[cont].estoque,
          email: rows[cont].email,
          telefone: rows[cont].telefone
        })
      }
      return res.json({
        fornecedores: fornecedores
      });
    }
  );
});

app.post("/deleteFornecedorRotulo", function (req, res) {
  connection.query(
    `delete from rotulo_has_fornecedor where fornecedor_id = ${req.body.f_id} and rotulo_id = ${req.body.r_id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao remover fornecedor da rotulo",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Remover Fornecedor",
        mensagem: `Fornecedor removido com sucesso!`,
        s: "S de serto"
      });
    }
  );

});

app.post("/deleteFornecedorE", function (req, res) {
  connection.query(
    `delete from embalagem_has_fornecedor where fornecedor_id = ${req.body.f_id} and embalagem_id = ${req.body.e_id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao remover fornecedor da embalagem",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Remover Fornecedor",
        mensagem: `Fornecedor removido com sucesso!`,
        s: "s de serto"
      });
    }
  );

});

app.post("/deleteEmbalagem", function (req, res) {
  connection.query(
    `delete from embalagem where id = ${req.body.id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao deletar embalagem",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Deletar Embalagem",
        mensagem: `Embalagem deletado com sucesso!`,
      });
    }
  );

});

app.post("/updateEmbalagem", function (req, res) {
  connection.query(
    `update embalagem set nome = "${req.body.nome}", estoque = ${req.body.estoque}, tipo = ${Number(req.body.tipo)}, mililitragem = ${Number((req.body.tamanho).replace("ml", ""))}, minimo = ${Number(req.body.minimo)} where id = ${req.body.id}`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao alterar embalagem",
          mensagem: err,
        });
      }

      for (let j = 0; j < req.body.fornecedores.length; j++) {
        connection.query(
          `INSERT INTO embalagem_has_fornecedor VALUES(${req.body.id}, ${req.body.fornecedores[j].id}, ${req.body.fornecedores[j].preco}, ${req.body.fornecedores[j].minQtd})`,

          (err, rows, fields) => {

            if (err) {
              return res.json({
                tipo: "Erro no cadastro de fornecedor da embalagem",
                mensagem: err,
              });
            }

          },)
      }

      return res.json({
        tipo: "Alterar Embalagem",
        mensagem: `Embalagem alterada com sucesso!`,
        s: "s de serto"
      });
    }
  );
});

app.post("/updateFornecedorR", function (req, res) {

  for (let cont = 0; cont < req.body.fornecedores.length; cont++) {
    connection.query(
      `update rotulo_has_fornecedor set preco = ${Number((req.body.fornecedores[cont].preco).replace(",", ".").replace("R$", ""))}, quantidade_minima = ${Number(req.body.fornecedores[cont].minQtd)} where rotulo_id = ${req.body.rotulo_id} and fornecedor_id = ${Number(req.body.fornecedores[cont].id)};`,
      (err, rows, fields) => {


        if (err) {
          return res.json({
            tipo: "Erro ao atualizar fornecedores do rótulo",
            mensagem: err,
          });
        }
        return res.json({
          tipo: "Atualização de Fornecedor",
          mensagem: `Fornecedores atualizados com sucesso!`,
          s: "s de serto"
        });
      }
    );
  }

});

app.post("/updateFornecedorE", function (req, res) {

  for (let cont = 0; cont < req.body.fornecedores.length; cont++) {
    connection.query(
      `update embalagem_has_fornecedor set preco = ${Number((req.body.fornecedores[cont].preco).replace(",", ".").replace("R$", ""))}, quantidade_minima = ${Number(req.body.fornecedores[cont].minQtd)} where embalagem_id = ${req.body.embalagem_id} and fornecedor_id = ${Number(req.body.fornecedores[cont].id)};`,
      (err, rows, fields) => {


        if (err) {
          return res.json({
            tipo: "Erro ao atualizar fornecedores da embalagem",
            mensagem: err,
          });
        }
      }
    );
  }

  return res.json({
    tipo: "Atualização de Fornecedor",
    mensagem: `Fornecedores atualizados com sucesso!`,
    s: "s de serto"
  });

});

app.post("/listarFormulas", function (req, res) {
  let restricao = ""
  if (req.body.restricao)
    restricao = req.body.restricao;
  var formulas = []
  connection.query(
    `select * from formula ${restricao};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados das formulas",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        formulas.push({
          id: rows[cont].id,
          nome: rows[cont].nome,
          principal: rows[cont].principal,
          produto_id: rows[cont].produto_id
        })
      }
      return res.json({
        formulas: formulas
      });
    }
  );
});

app.post("/listarEmbalagens", function (req, res) {
  let restricao = ""
  if (req.body.restricao)
    restricao = req.body.restricao;
  var embalagens = []
  connection.query(
    `select * from embalagem e left join produto_has_embalagem pe on pe.embalagem_id = e.id ${restricao}`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados dos embalagens",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        embalagens.push({
          id: rows[cont].id,
          nome: rows[cont].nome,
          tipo: rows[cont].tipo,
          tamanho: rows[cont].mililitragem,
          estoque: rows[cont].estoque,
          minimo: rows[cont].minimo,
          produto_id: rows[cont].produto_id,
          ePrincipal: rows[cont].ePrincipal
        })
      }
      return res.json({
        embalagens: embalagens
      });
    }
  );
});

app.post("/listarRotulos", function (req, res) {
  let restricao = ""
  if (req.body.restricao)
    restricao = req.body.restricao;
  var rotulos = []
  connection.query(
    `select * from rotulo ${restricao};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados dos rotulos",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        rotulos.push({
          id: rows[cont].id,
          nome: rows[cont].nome,
          tipo: rows[cont].tipo,
          produto_id: rows[cont].produto_id,
          estoque: rows[cont].estoque,
          minimo: rows[cont].minimo,
          principal: rows[cont].principal
        })
      }
      return res.json({
        rotulos: rotulos
      });
    }
  );
});






//=======================================================================================//
app.post("/listarMateriaPrimaMoicano", function (req, res) {
  let restricao = ""
  if (req.body.restricao)
    restricao = req.body.restricao;


  var infoFornMP = []
  connection.query(
    `select * from materiaPrima mte left join materiaPrima_has_fornecedor mtf on mtf.materiaPrima_id = mte.id ${restricao};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados das infoFornMP",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        infoFornMP.push({
          nome: rows[cont].nome,
          materiaPrima_id: rows[cont].materiaPrima_id,
          fornecedor_id: rows[cont].fornecedor_id,
          preco: rows[cont].preco,
          quantidade_minima: rows[cont].quantidade_minima
        })
      }
      return res.json({
        infoFornMP: infoFornMP
      });
    }
  );
});
//=======================================================================================//
app.post("/listarEmbalagem", function (req, res) {
  let restricao = ""
  if (req.body.restricao)
    restricao = req.body.restricao;

  var embalagem = []
  connection.query(
    `select * from embalagem where id= ${req.body.id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados das embalagens",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        embalagem.push({
          id: rows[cont].id,
          nome: rows[cont].nome,
          tipo: rows[cont].tipo,
          mililitragem: rows[cont].mililitragem,
          estoque: rows[cont].estoque
        })
      }
      return res.json({
        embalagem: embalagem
      });
    }
  );
});
//=======================================================================================//
app.post("/listarRotulos", function (req, res) {
  let restricao = ""
  if (req.body.restricao)
    restricao = req.body.restricao;

  var infoFornR = []
  connection.query(
    `select * from rotulo mte left join rotulo_has_fornecedor mtf on mtf.rotulo_id = mte.id ${restricao};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados das infoFornR",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        infoFornR.push({
          nome: rows[cont].nome,
          rotulo_id: rows[cont].rotulo_id,
          fornecedor_id: rows[cont].fornecedor_id,
          preco: rows[cont].preco,
          quantidade_minima: rows[cont].quantidade_minima
        })
      }
      return res.json({
        infoFornR: infoFornR
      });
    }
  );
});

app.post("/deleteFRelacaoMP", function (req, res) {
  //deleta a relção do fornecedor com matéria prima
  connection.query(
    `delete from materiaprima_has_fornecedor where materiaPrima_id = ${req.body.id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao deletar materia prima",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Deletar relação com materia prima",
        mensagem: `Relação com materia prima deletada com sucesso!`,
      });
    }
  );
});

app.post("/deleteFRelacaoE", function (req, res) {
  //deleta a relção do fornecedor com embalagem
  connection.query(
    `delete from embalagem_has_fornecedor where embalagem_id = ${req.body.id};`,

    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao deletar embalagem",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Deletar relação com embalagem",
        mensagem: `Relação com embalagem deletada com sucesso!`,
      });
    }
  );
});

app.post("/deleteFRelacaoR", function (req, res) {
  //deleta a relção do fornecedor com rotulo

  connection.query(
    `delete from rotulo_has_fornecedor where rotulo_id = ${req.body.id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao deletar rotulo",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Deletar relação com rotulo",
        mensagem: `Relação com rotulo deletada com sucesso!`,
      });
    }
  );
});
//=======================================================================================//


app.post("/adicionaObservacao", function (req, res) {
  //deleta a relção do fornecedor com rotulo

  connection.query(
    `INSERT INTO producao VALUES(null, default, "${req.body.ob}")`,
    (err, results) => {

      if (err) {
        return res.json({
          tipo: "Erro ao adicionar observação",
          mensagem: err,
        });
      }

      for (var cont = 0; cont < req.body.produtos.length; cont++) {
        connection.query(
          `INSERT INTO producao_has_produto VALUES (${results.insertId},${Number(req.body.produtos[cont].id)},${Number(req.body.produtos[cont].quantidade)},'${req.body.produtos[cont].mudancas}');`,
          (err, rows, fields) => {

            if (err) {
              return res.json({
                tipo: "Erro ao inserir producao_has_produto",
                mensagem: err,
              });
            }

          }
        );
      }

      return res.json({
        tipo: "Adicionar observação",
        mensagem: `Observação registrada com sucesso`,
      });
    }
  );
});

app.post("/baixaMateriaPrima", function (req, res) {
  //deleta a relção do fornecedor com rotulo

  connection.query(
    `UPDATE materiaPrima SET estoque = estoque - ${req.body.quant} WHERE id = ${req.body.id}`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao dar baixa na Materia Prima",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Baixa na Materia Prima",
        mensagem: `Baixa na Materia Prima foi um sucesso`,
      });
    }
  );
});

app.post("/baixaEmbalagem", function (req, res) {
  //deleta a relção do fornecedor com rotulo

  connection.query(
    `UPDATE embalagem SET estoque = estoque - ${req.body.quant} WHERE id = ${req.body.id}`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao dar baixa na embalagem",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Baixa na embalgem",
        mensagem: `Baixa na embalagem foi um sucesso`,
      });
    }
  );
});

app.post("/baixaRotulo", function (req, res) {
  //deleta a relção do fornecedor com rotulo

  connection.query(
    `UPDATE rotulo SET estoque = estoque - ${req.body.quant} WHERE id = ${req.body.id}`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao dar baixa no rotulo",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Baixa baixa no rotulo",
        mensagem: `Baixa no rotulo foi um sucesso`,
      });
    }
  );
});

// Verificar se o estoque está abaixo do mínimo
app.post("/verificarEstoque", function (req, res) {
  var valoresEstoque = [];
  connection.query(
    `SELECT estoque, minimo FROM materiaPrima where id="${req.body.id}";`,
    (err, rows, fields) => {
      // Operação simples para testar o funcionamento
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      }
      else {
        valoresEstoque.push({
          estoque: rows.estoque,
          minimo: rows.minimo,
        });
      }
      res.send(JSON.stringify(valoresEstoque));
    }
  );
});
//=======================================================================================//


app.post("/preencheTabelaMP", function (req, res) {
  let mP = []
  connection.query(
    `SELECT materiaPrima.id, materiaPrima.nome, materiaPrima.estoque, formula_has_materiaPrima.porcentagem, formula_has_materiaPrima.passo
    from formula_has_materiaPrima join materiaPrima on formula_has_materiaPrima.formula_id = ${req.body.formula} and formula_has_materiaPrima.materiaPrima_id = materiaPrima.id;`,
    (err, rows, fields) => {
      // Operação simples para testar o funcionamento
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      }
      else {
        for (let i = 0; i < rows.length; i++) {
          mP.push({
            id: rows[i].id,
            passo: rows[i].passo,
            nome: rows[i].nome,
            estoque: rows[i].estoque,
            porcentagem: rows[i].porcentagem

          });
          console.log(mP[i].id)
          console.log(mP[i].nome)
          console.log(mP[i].estoque)
          console.log(mP[i].porcentagem)
        }

        return res.json({
          mP: mP
        });
      }
    }
  );
});


app.post("/precoMP", function (req, res) {
  connection.query(
    `select MAX(preco) as preco from materiaprima_has_fornecedor where materiaPrima_id = ${req.body.id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar preco máximo da matériaa prima",
          mensagem: err,
        });
      }
      return res.json({
        preco: rows[0].preco
      });
    }
  );
});

//Back end histórico de produção - VITOR MOICANO
//=================================================================================//
app.post("/listarProducoes", function (req, res) {
  if (req.body.restricao)
    restricao = req.body.restricao;
  var producoes = []
  connection.query(
    `SELECT produto.nome, producao.id, producao.data , producao_has_produto.quantidade  FROM produto INNER JOIN producao_has_produto ON producao_has_produto.produto_id = produto.id INNER JOIN producao ON producao.id = producao_has_produto.producao_id;`,
    //`SELECT * FROM produto;`,

    (err, rows, fields) => {


      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados das producoes",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        producoes.push({
          id: rows[cont].id,
          nome: rows[cont].nome,
          quantidade: rows[cont].quantidade,
          data: rows[cont].data,
        })
      }
      return res.json({
        producoes: producoes
      });
    }
  );
});

app.post("/listarProducaoEspecifica", function (req, res) {
  if (req.body.restricao)
    restricao = req.body.restricao;
  var producoes = []
  var formulas = []
  connection.query(
    `SELECT produto.nome, produto.id, producao.data , producao_has_produto.quantidade, formula.id as f  FROM produto INNER JOIN producao_has_produto ON producao_has_produto.produto_id = produto.id INNER JOIN producao ON producao.id = producao_has_produto.producao_id INNER JOIN formula ON produto.id = formula.produto_id where producao.id = ${req.body.producao_id};`,
    //`SELECT * FROM produto;`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados das producoes",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        formulas.push({id: rows[cont].f})
        producoes.push({
          id: rows[cont].id,
          nome: rows[cont].nome,
          quantidade: rows[cont].quantidade,
          data: rows[cont].data,
        })
      }
      return res.json({
        producoes: producoes,
        formulas: formulas
      });
    }
  );
});



app.post("/listarMateriaPrimaDaProducao", function (req, res) {
  if (req.body.restricao)
    restricao = req.body.restricao;
  var materiasPrimas = []
  connection.query(
    `select materiaPrima.nome, producao_has_produto.quantidade, formula_has_materiaprima.porcentagem ,formula_has_materiaprima.materiaPrima_id, formula_has_materiaprima.formula_id from produto inner join formula on formula.produto_id = produto.id inner join formula_has_materiaPrima on formula_has_materiaPrima.formula_id = formula.id inner join materiaPrima on materiaPrima.id = formula_has_materiaPrima.materiaPrima_id inner join producao_has_produto on producao_has_produto.produto_id = produto.id where produto.id = ${req.body.producao_id};`,
    //`SELECT * FROM produto;`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados das materias primas das producoes",

          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) { //console.log("passei aki no back");
        materiasPrimas.push({
          id: rows[cont].id,
          nome: rows[cont].nome,
          quantidade: rows[cont].quantidade,
          data: rows[cont].data,
          porcentagem: rows[cont].porcentagem,
        })
      }
      return res.json({
        materiasPrimas: materiasPrimas

      });
    }
  );
});


app.post("/listarRotuloDaProducao", function (req, res) {
  if (req.body.restricao)
    restricao = req.body.restricao;
  var embalagensERotulos = []
  connection.query(
    `select embalagem.nome as nomeE, embalagem.mililitragem, producao_has_produto.quantidade, rotulo.nome as nomeR  from produto inner join rotulo on rotulo.produto_id = produto.id inner join produto_has_embalagem on produto_has_embalagem.produto_id = produto.id inner join embalagem on embalagem.id = produto_has_embalagem.embalagem_id inner join producao_has_produto on producao_has_produto.produto_id = produto.id where produto.id = ${req.body.producao_id};`,
    //`SELECT * FROM produto;`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados dos rótulos e das embalagens da produção",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        //console.log("passei aki no back");
        embalagensERotulos.push({
          nomeE: rows[cont].nomeE,
          mililitragem: rows[cont].mililitragem,
          quantidade: rows[cont].quantidade,
          nomeR: rows[cont].nomeR,
        })
      }
      return res.json({
        embalagensERotulos: embalagensERotulos
      });
    }
  );
});

app.post("/listarMudancas", function (req, res) {
  connection.query(
    `select mudancas from producao_has_produto where producao_id = ${req.body.producao_id} limit 1;`,
    //`SELECT * FROM produto;`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados das mudanças da produção",
          mensagem: err,
        });
      }
      return res.json({
        mudancas: rows[0].mudancas
      });
    }
  );
});
//=================================================================================//

//Back end home page - VITOR MOICANO 
//=================================================================================//
app.post("/producoesUltimaSemana", function (req, res) {
  var lista = []
  connection.query(
    `SELECT * FROM produto inner join producao_has_produto on producao_has_produto.produto_id = produto.id inner join producao on producao.id = producao_has_produto.producao_id;`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados dos produtos",
          mensagem: err,
        });
      }

      for (let cont = 0; cont < rows.length; cont++) {
        lista.push({
          nome: rows[cont].nome,
          data: rows[cont].data,
        })
      }

      return res.json({
        lista: lista
      });
    }
  )
})
//=================================================================================//

//Back end elimina produção - VITOR MOICANO NÃO FINALIZADO
//=================================================================================//
app.post("/eliminaProducaoMaiorQue5", function (req, res) {

  connection.query(
    `SET SQL_SAFE_UPDATES = 0; CREATE TEMPORARY TABLE temp_producao SELECT *, MIN(data) AS producao_mais_antiga FROM producao_has_produto inner join producao on producao.id = producao_has_produto.producao_id GROUP BY produto_id HAVING COUNT(*) > 3 ;  DELETE FROM producao WHERE data in ( SELECT  producao_mais_antiga FROM temp_producao );  DROP TABLE temp_producao;  SET SQL_SAFE_UPDATES = 1;`,
    (err, rows, fields) => {
      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados dos produtos",
          mensagem: err,
        });
      }

    }
  )
})
//=================================================================================//

//Back end solicita info usuário - VITOR MOICANO
//=================================================================================//
app.post("/listaUsuarios", function (req, res) {
  var usuarios = []
  connection.query(
    `select * from usuario;`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados dos produtos",
          mensagem: err,
        });
      }

      for (let cont = 0; cont < rows.length; cont++) {
        usuarios.push({
          id: rows[cont].id,
          nome: rows[cont].nome,
          email: rows[cont].email,
          temPermissao: rows[cont].temPermissao,
        })
      }

      return res.json({
        usuarios: usuarios
      });

    }
  )
})

app.post("/usuarioEspecifico", function (req, res) {
  if (req.body.restricao)
    restricao = req.body.restricao;
  var usuario = []
  connection.query(
    `select * from usuario where id = ${req.body.id};`,
    (err, rows, fields) => {
      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados dos produtos",
          mensagem: err,
        });
      }

      for (let cont = 0; cont < rows.length; cont++) {
        usuario.push({
          id: rows[cont].id,
          nome: rows[cont].nome,
          email: rows[cont].email,
          temPermissao: rows[cont].temPermissao,
        })
      }

      return res.json({
        usuario: usuario
      });

    }
  )
})

app.post("/deletarUsuario", function (req, res) {
  if (req.body.restricao)
    restricao = req.body.restricao;
  //console.log(req.body.id_usuario_permissao)
  connection.query(
    `delete from usuario where id = ${req.body.id_usuario_permissao};`,
    (err, rows, fields) => {
      console.log("back end dos crias")
      if (err) {
        return res.json({
          tipo: "Erro ao deletar usuário",
          mensagem: err,
        });

      }

    }
  )
})

app.post("/alterarNomeUsuario", function (req, res) {
  if (req.body.restricao)
    restricao = req.body.restricao;
  connection.query(
    `UPDATE usuario SET nome = '${req.body.novoNome}' WHERE id = ${req.body.id_usuario_permissao};`,
    (err, rows, fields) => {
      console.log("back end dos crias")
      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados dos produtos",
          mensagem: err,
        });
      }

    }
  )
})

app.post("/alterarEmailUsuario", function (req, res) {
  if (req.body.restricao)
    restricao = req.body.restricao;
  connection.query(
    `UPDATE usuario SET email = '${req.body.novoEmail}' WHERE id = ${req.body.id_usuario_permissao};`,
    (err, rows, fields) => {
      console.log("back end dos crias")
      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados dos produtos",
          mensagem: err,
        });
      }

    }
  )
})

app.post("/alterarPermissaoUsuario", function (req, res) {
  if (req.body.restricao)
    restricao = req.body.restricao;
  connection.query(
    `UPDATE usuario SET temPermissao = ${req.body.perm} WHERE id = ${req.body.id};`,
    (err, rows, fields) => {
      console.log("back end dos crias")
      if (err) {
        return res.json({
          tipo: "Erro ao alterar permissão do usuário",
          mensagem: err,
        });
      }

    }
  )
})
//=================================================================================//


app.post("/listarMateriaPrimaMin", function (req, res) {
  var lista = []
  connection.query(
    `select * from materiaPrima where estoque<minimo`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados das materias primas",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        lista.push({
          nome: rows[cont].nome,
          id: rows[cont].id,
          estoque: rows[cont].estoque,
          minimo: rows[cont].minimo,
        })
      }
      return res.json({
        lista: lista
      });
    }
  );
});

app.post("/listarMateriaPrimaMod", function (req, res) {
  var lista = []
  var fornecedores = []
  connection.query(
    `select * from materiaPrima where id=${req.body.id}`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados das materias primas",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        lista.push({
          nome: rows[cont].nome,
          id: rows[cont].id,
          estoque: rows[cont].estoque,
          minimo: rows[cont].minimo,
          fornecedores: fornecedores
        })
      }
      return res.json({
        lista: lista
      });
    }
  );
});

app.post("/listarFornecedorMateriaPrimaMin", function (req, res) {
  var listaF = []
  connection.query(
    `SELECT mpf.fornecedor_id, mpf.quantidade_minima, mpf.preco, f.*
    FROM materiaPrima_has_fornecedor AS mpf
    JOIN fornecedor AS f
    ON mpf.fornecedor_id = f.id
    WHERE mpf.materiaPrima_id = ${req.body.id}`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados do forncedor",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        listaF.push({
          quantidade_minima: rows[cont].quantidade_minima,
          preco: rows[cont].preco,
          nome: rows[cont].nome,
          id: rows[cont].id,
          email: rows[cont].email,
          telefone: rows[cont].telefone
        })
      }
      return res.json({
        listaF: listaF
      });
    }
  );
});

//________________________________________________________________

app.post("/listarEmbalagemMin", function (req, res) {
  var lista = []
  connection.query(
    `select * from embalagem where estoque<minimo`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados das embalagens ",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        lista.push({
          nome: rows[cont].nome,
          id: rows[cont].id,
          estoque: rows[cont].estoque,
          minimo: rows[cont].minimo,
        })
      }
      return res.json({
        lista: lista
      });
    }
  );
});

app.post("/listarEmbalagemMod", function (req, res) {
  var lista = []
  connection.query(
    `select * from embalagem where id=${req.body.id}`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados das embalagens ",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        lista.push({
          nome: rows[cont].nome,
          id: rows[cont].id,
          estoque: rows[cont].estoque,
          minimo: rows[cont].minimo,
        })
      }
      return res.json({
        lista: lista
      });
    }
  );
});
app.post("/listarFornecedorEmbalagemMin", function (req, res) {
  var listaF = []
  connection.query(
    `SELECT ef.fornecedor_id, ef.quantidade_minima, ef.preco, f.*
    FROM embalagem_has_fornecedor AS ef
    JOIN fornecedor AS f
    ON ef.fornecedor_id = f.id
    WHERE ef.embalagem_id = ${req.body.id}`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados do forncedor",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        listaF.push({
          fornecedor_id: rows[cont].fornecedor_id,
          quantidade_minima: rows[cont].quantidade_minima,
          preco: rows[cont].preco,
          nome: rows[cont].nome,
          id: rows[cont].id,
          email: rows[cont].email,
          telefone: rows[cont].telefone
        })
      }
      return res.json({
        listaF: listaF
      });
    }
  );
});
//________________________________________________________________

app.post("/listarRotuloMin", function (req, res) {
  var lista = []
  connection.query(
    `select * from rotulo where estoque<minimo`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados das Rotulos ",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        lista.push({
          nome: rows[cont].nome,
          id: rows[cont].id,
          estoque: rows[cont].estoque,
          minimo: rows[cont].minimo,
        })
      }
      return res.json({
        lista: lista
      });
    }
  );
});

app.post("/listarRotuloMod", function (req, res) {
  var lista = []
  connection.query(
    `select * from rotulo where id=${req.body.id}`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados das Rotulos ",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        lista.push({
          nome: rows[cont].nome,
          id: rows[cont].id,
          estoque: rows[cont].estoque,
          minimo: rows[cont].minimo,
        })
      }
      return res.json({
        lista: lista
      });
    }
  );
});

app.post("/listarFornecedorRotuloMin", function (req, res) {
  var listaF = []
  connection.query(
    `SELECT rf.fornecedor_id, rf.quantidade_minima, rf.preco, f.*
    FROM rotulo_has_fornecedor AS rf
    JOIN fornecedor AS f
    ON rf.fornecedor_id = f.id
    WHERE rf.rotulo_id = ${req.body.id}`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados do forncedor",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        listaF.push({
          fornecedor_id: rows[cont].fornecedor_id,
          quantidade_minima: rows[cont].quantidade_minima,
          preco: rows[cont].preco,
          nome: rows[cont].nome,
          id: rows[cont].id,
          email: rows[cont].email,
          telefone: rows[cont].telefone
        })
      }
      return res.json({
        listaF: listaF
      });
    }
  );
});


app.post("/getMP", function (req, res) {
  var mP = []
  connection.query(
    `select mP.id, mP.nome, mP.estoque, mPhF.materiaPrima_id, mPhF.fornecedor_id, mPhf.preco, f.id as fornecedorID, f.nome as fornecedorNome, f.email, f.telefone
    from materiaPrima mP join materiaPrima_has_fornecedor mPhF on mP.id = mPhF.materiaPrima_id join fornecedor f on f.id  = mPhF.fornecedor_id
    where mP.id = ${Number(req.body.id)};`,

    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados das materias primas",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {

        mP.push({
          id: rows[cont].id,
          nome: rows[cont].nome,
          estoque: rows[cont].estoque,
          fornecedor_id: rows[cont].fornecedor_id,
          preco: rows[cont].preco,
          fornecedorNome: rows[cont].fornecedorNome,
          email: rows[cont].email,
          telefone: rows[cont].telefone,
        })
      }
      return res.json({
        mP: mP
      });
    }
  );
})

app.post("/filtrarMateriaPrima", function (req, res) {
  var materiaPrima = []
  connection.query(
    `SELECT * FROM controleproducao.materiaprima where materiaprima.origem_id = ${Number(req.body.origem)};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados das Materias Primas",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        materiaPrima.push({
          id: rows[cont].id,
          nome: rows[cont].nome,
          inci: rows[cont].inci,
          estoque: rows[cont].estoque,
          minimo: rows[cont].minimo,
          origem_id: rows[cont].origem_id
        })
      }
      return res.json({
        materiaPrima: materiaPrima
      });
    }
  );
});


app.post("/listarformulasid", function (req, res) {
  var nformula = []
  connection.query(
    `SELECT * FROM formula where id =  ${Number(req.body.id)};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro ao retornar dados das formulas",
          mensagem: err,
        });
      }
      for (let cont = 0; cont < rows.length; cont++) {
        nformula.push({
          nome: rows[cont].nome
        })
      }
      return res.json({
        nformula: nformula
      });
    }
  );
});


