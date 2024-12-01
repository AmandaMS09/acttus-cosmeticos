import { db } from "../db/initSupabase.js"

// ADICIONA OBSERVACAO
export const adicionaObservacao = async (req, res) => {
    try {
        const { ob, produtos } = req.body;

        const { data: producaoData, error: insertError } = await db.from('producao').insert({ observacao: ob });

        if (insertError) {
            return res.json({
                tipo: "Erro ao adicionar observação",
                mensagem: insertError,
            });
        }

        const { id: producaoId } = producaoData[0];

        for (let i = 0; i < produtos.length; i++) {
            const { id: produto_id, quantidade, mudancas } = produtos[i];

            const { error } = await db.from('producao_has_produto').insert({ producao_id: producaoId, produto_id, quantidade, mudancas });

            if (error) {
                return res.json({
                    tipo: "Erro ao inserir producao_has_produto",
                    mensagem: error,
                });
            }
        }

        return res.json({
            tipo: "Adicionar observação",
            mensagem: `Observação registrada com sucesso`,
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// LISTAR PRODUCOES
export const listarProducoes = async (req, res) => {
    try {
        const { data, error } = await db.from('listar_producoes').select();

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados das producoes",
                mensagem: error,
            });
        }

        return res.json({
            producoes: data
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// LISTAR PRODUCAO ESPECIFICA
export const listarProducaoEspecifica = async (req, res) => {
    try {
        const { producao_id } = req.body;

        const { data, error } = await db.from('listar_producao_especifica').select().eq('producao_id', producao_id);

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados das producoes",
                mensagem: error,
            });
        }

        return res.json({
            producoes: data
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// LISTAR MATERIA PRIMA DA PRODUCAO
export const listarMateriaPrimaDaProducao = async (req, res) => {
    try {
        const { producao_id } = req.body;

        const { data, error } = await db.from('listar_materiaprima_da_producao').select().eq('producao_id', producao_id);

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados das materias primas das producoes",
                mensagem: error,
            });
        }

        return res.json({
            materiasPrimas: data
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// LISTAR ROTULO DA PRODUCAO
export const listarRotuloDaProducao = async (req, res) => {
    try {
        const { producao_id } = req.body;

        const { data, error } = await db.from('listar_rotulo_da_producao').select().eq('producao_id', producao_id);

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados dos rótulos e das embalagens da produção",
                mensagem: error,
            });
        }

        return res.json({
            embalagensERotulos: data
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// LISTAR MUDANCAS
export const listarMudancas = async (req, res) => {
    try {
        const { producao_id } = req.body;

        const { data, error } = await db.from('producao_has_produto').select('mudancas').eq('producao_id', producao_id).single();

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados das mudanças da produção",
                mensagem: error,
            });
        }

        return res.json({
            mudancas: data[0].mudancas
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// PRODUCOES ULTIMA SEMANA
export const producoesUltimaSemana = async (req, res) => {
    try {
        const { data, error } = await db.from('producoes_ultima_semana').select();

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados dos produtos",
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
