import { db } from "../db/initSupabase.js"

// CADASTRA EMBALAGEM
export const cadastraEmbalagem = async (req, res) => {
    try {
        const { nome, value, tamanho, estoque = 0, minimo, fornecedores } = req.body;

        const { data: embalagemData, error: insertError } = await db.from('embalagem').insert({ nome, tipo: value, mililitragem: parseFloat(tamanho), estoque: Number(estoque), minimo: Number(minimo) });

        if (insertError) {
            return res.json({
                tipo: "Erro ao cadastrar embalagem",
                mensagem: insertError,
            });
        }

        const { id: embalagemId } = embalagemData[0];

        for (let j = 0; j < fornecedores.length; j++) {
            const { data, error } = await db.from('embalagem_has_fornecedor').insert({ embalagem_id: embalagemId, fornecedor_id: fornecedores[j].id, preco: fornecedores[j].preco, minQtd: fornecedores[j].minQtd });

            if (error) {
                return res.json({
                    tipo: "Erro no cadastro de fornecedor da embalagem",
                    mensagem: error,
                });
            }
        }

        return res.json({
            tipo: "Cadastro Embalagem",
            mensagem: `Embalagem cadastrada com sucesso!`,
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// SELECT EMBALAGEM
export const selectEmbalagem = async (req, res) => {
    try {
        const { data, error } = await db.from('select_embalagem').select();

        if (error) {
            return res.json({
                tipo: "Erro",
                mensagem: error,
            });
        }

        return res.json({
            tipo: "Select Embalagens",
            mensagem: `Dados retornados com sucesso!`,
            embalagens: data,
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// DELETE EMBALAGEM
export const deleteEmbalagem = async (req, res) => {
    try {
        const { id } = req.body;

        const { error } = await db.from('embalagem').delete().eq('id', id);

        if (error) {
            return res.json({
                tipo: "Erro ao deletar embalagem",
                mensagem: error,
            });
        }

        return res.json({
            tipo: "Deletar Embalagem",
            mensagem: `Embalagem deletado com sucesso!`,
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// UPDATE EMBALAGEM
export const updateEmbalagem = async (req, res) => {
    try {
        const { nome, estoque, tipo, tamanho, minimo, id, fornecedores } = req.body;

        const { error: updateError } = await db.from('embalagem').update({ nome, estoque, tipo: Number(tipo), mililitragem: Number(tamanho.replace("ml", "")), minimo: Number(minimo) }).eq('id', id);

        if (updateError) {
            return res.json({
                tipo: "Erro ao alterar embalagem",
                mensagem: updateError,
            });
        }

        for (let j = 0; j < fornecedores.length; j++) {
            const { error } = await db.from('embalagem_has_fornecedor').insert({ embalagem_id: id, fornecedor_id: fornecedores[j].id, preco: fornecedores[j].preco, minQtd: fornecedores[j].minQtd });

            if (error) {
                return res.json({
                    tipo: "Erro no cadastro de fornecedor da embalagem",
                    mensagem: error,
                });
            }
        }

        return res.json({
            tipo: "Alterar Embalagem",
            mensagem: `Embalagem alterada com sucesso!`,
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// LISTAR EMBALAGENS
export const listarEmbalagens = async (req, res) => {
    try {
        const { produto_id } = req.body;
        let data, error;

        if (produto_id) {
            ({ data, error } = await db.from('embalagem').select().eq('produto_id', produto_id));
        } else {
            ({ data, error } = await db.from('embalagem').select());
        }

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados dos embalagens",
                mensagem: error,
            });
        }

        return res.json({
            embalagens: data
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// LISTAR EMBALAGEM
export const listarEmbalagem = async (req, res) => {
    try {
        const { id } = req.body;

        const { data, error } = await db.from('embalagem').select().eq('id', id);

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados das embalagens",
                mensagem: error,
            });
        }

        return res.json({
            embalagem: data
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// BAIXA EMBALAGEM
export const baixaEmbalagem = async (req, res) => {
    try {
        const { quant, id } = req.body;

        const { data, error: selectError } = await db.from('embalagem').select('estoque').eq('id', id);

        if (selectError) {
            return res.json({
                tipo: "Erro ao dar baixa na embalagem",
                mensagem: selectError,
            });
        }

        const estoque = Number(data[0].estoque) - quant

        const { error } = await db.from('embalagem').update('estoque', estoque).eq('id', id);

        if (error) {
            return res.json({
                tipo: "Erro ao dar baixa na embalagem",
                mensagem: error,
            });
        }

        return res.json({
            tipo: "Baixa na embalgem",
            mensagem: `Baixa na embalagem foi um sucesso`,
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// LISTAR EMBALAGEM MIN
export const listarEmbalagemMin = async (req, res) => {
    try {
        const { data, error } = await db.from('listarembalagemmin').select();

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados das embalagens ",
                mensagem: error,
            });
        }

        return res.json({
            lista: data
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// LISTAR EMBALAGEM MOD
export const listarEmbalagemMod = async (req, res) => {
    try {
        const { id } = req.body;

        const { data, error } = await db.from('embalagem').select().eq('id', id);

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados das embalagens ",
                mensagem: error,
            });
        }

        return res.json({
            lista: data
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};