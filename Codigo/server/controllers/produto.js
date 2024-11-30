import { db } from "../db/initSupabase.js"

// CADASTRAR PRODUTO
export const cadastrarProduto = async (req, res) => {
    try {
        const { nome, lucro } = req.body;

        const { data: produtoData, error: insertError } = await db.from('produto').insert({ nome, lucro }).select();

        if (insertError) {
            return res.json({
                tipo: "Erro ao cadastrar produto",
                mensagem: insertError,
            });
        }

        const { id } = produtoData[0];

        return res.json({
            tipo: "Cadastro produto",
            mensagem: `Produto cadastrado com sucesso!`,
            id
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// PRODUTO HAS EMBALAGEM
export const produtoHasEmbalagem = async (req, res) => {
    try {
        const { dados, produtoId } = req.body;

        for (let i = 0; i < dados.length; i++) {
            const { id, principal } = dados[i];

            const { error } = await db.from('produto_has_embalagem').insert({ produto_id: Number(produtoId), embalagem_id: Number(id), ePrincipal: principal ? 1 : 0 });

            if (error) {
                return res.json({
                    tipo: "Erro",
                    mensagem: error,
                });
            }
        }

        return res.json({
            tipo: "Embalagens",
            mensagem: `Embalagens do produto cadastradas com sucesso!`,
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// DELETE PHAS E
export const deletePHasE = async (req, res) => {
    try {
        const { p_id, e_id } = req.body;

        const { error } = await db.from('produto_has_embalagem').delete().eq('produto_id', p_id).eq('embalagem_id', e_id);

        if (error) {
            return res.json({
                tipo: "Erro ao remover embalagem do produto",
                mensagem: error,
            });
        }

        return res.json({
            tipo: "Remover Embalagem",
            mensagem: `Embalegem removida com sucesso!`,
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// LISTAR PRODUTOS
export const listarProdutos = async (req, res) => {
    try {
        const { data, error } = await db.from('listar_produtos').select();

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados dos produtos",
                mensagem: error,
            });
        }

        return res.json({
            produtos: data
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// DELETE PRODUTO
export const deleteProduto = async (req, res) => {
    try {
        const { id } = req.body;

        const { error } = await db.from('produto').delete().eq('id', id);

        if (error) {
            return res.json({
                tipo: "Erro ao deletar produto",
                mensagem: error,
            });
        }

        return res.json({
            tipo: "Deletar Produto",
            mensagem: "Produto deletado com sucesso",
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// UPDATE PRODUTO
export const updateProduto = async (req, res) => {
    try {
        const { nome, lucro, id } = req.body;

        const { error } = await db.from('produto').update({ nome, lucro }).eq('id', id);

        if (error) {
            return res.json({
                tipo: "Erro ao atualizar produto",
                mensagem: error,
            });
        }

        return res.json({
            tipo: "Alterar Produto",
            mensagem: "Produto alterado com sucesso",
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};