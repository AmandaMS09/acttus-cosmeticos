import { db } from "../db/initSupabase.js"

//Cadastro de matéria prima
export const cadastraMateriaPrima = async (req, res) => {
    try {
        const { nome, INCI_nome, estoque_atual, estoque_min, origemId, fornecedores } = req.body;

        const { data: insertData, error: insertError } = await db.from('materiaprima').insert({
            nome,
            inci: INCI_nome,
            estoque: estoque_atual,
            minimo: estoque_min,
            origem_id: origemId
        });

        if (insertError) {
            return res.json({
                tipo: "Erro de cadastro",
                mensagem: insertError,
            });
        }

        const { data: selectData, error: selectError } = await db.from('materiaprima').select().eq('inci', INCI_nome);

        if (selectError || !selectData[0]) {
            return res.json({
                tipo: "Erro de retorno do id",
                mensagem: selectError || 'Nenhum registro encontrado',
            });
        }

        for (let i = 0; i < fornecedores.length; i++) {
            const { data: insertFornecedorData, error: insertFornecedorError } = await db.from('materiaprima_has_fornecedor').insert({
                materiaprima_id: selectData[0].id,
                fornecedor_id: fornecedores[i].id,
                preco: fornecedores[i].preco,
                minQtd: fornecedores[i].minQtd
            });

            if (insertFornecedorError) {
                return res.json({
                    tipo: "Erro",
                    mensagem: insertFornecedorError,
                });
            }
        }

        return res.json({
            tipo: "Cadastro realizado com sucesso",
            mensagem: `Matéria Prima cadastrada com sucesso!`,
        });
    } catch (err) {
        res.json({
            tipo: "Erro de cadastro",
            mensagem: err,
        });
    }
};

export const listarMateriaPrima = async (req, res) => {
    try {
        const { data, error } = await db.from('materiaprima').select();

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados das Materias Primas",
                mensagem: error,
            });
        }

        const materiaPrima = data.map(row => ({
            id: row.id,
            nome: row.nome,
            inci: row.inci,
            estoque: row.estoque,
            minimo: row.minimo,
            origem_id: row.origem_id
        }));

        return res.json({
            materiaPrima: materiaPrima
        });
    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

export const updateMateriaPrima = async (req, res) => {
    try {
        const { id, nome, inci, estoque, minimo, origem_id, fornecedores } = req.body;

        const { data: updateData, error: updateError } = await db.from('materiaprima').update({
            nome,
            inci,
            estoque,
            minimo,
            origem_id
        }).eq('id', id);

        if (updateError) {
            return res.json({
                tipo: "Erro ao atualizar dados da Matéria Prima",
                mensagem: updateError,
            });
        }

        for (let i = 0; i < fornecedores.length; i++) {
            const { data: insertFornecedorData, error: insertFornecedorError } = await db.from('materiaprima_has_fornecedor').insert({
                materiaprima_id: id,
                fornecedor_id: fornecedores[i].id,
                preco: fornecedores[i].preco,
                minQtd: fornecedores[i].minQtd
            });

            if (insertFornecedorError) {
                return res.json({
                    tipo: "Erro no cadastro de fornecedor da matéria prima",
                    mensagem: insertFornecedorError,
                });
            }
        }

        return res.json({
            tipo: "Atualização da Matéria Prima",
            mensagem: `Matéria Prima atualizada com sucesso!`,
        });
    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

export const deleteMateriaPrima = async (req, res) => {
    try {
        const { id } = req.body;

        const { error } = await db.from('materiaPrima').delete().eq('id', id);

        if (error) {
            return res.json({
                tipo: "Erro ao deletar matéria prima",
                mensagem: error,
            });
        }

        return res.json({
            tipo: "Deletar Matéria prima",
            mensagem: "Matéria prima deletada com sucesso",
        });
    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

export const selectMateriasPrimas = async (req, res) => {
    try {
        const { data, error } = await db.from('materiaPrima').select();

        if (error) {
            return res.json({
                tipo: "Erro",
                mensagem: error,
            });
        }

        const arrayOrigem = data.map(row => ({
            id: row.id,
            nome: row.nome,
        }));

        res.send(JSON.stringify(arrayOrigem));
    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

export const baixaMateriaPrima = async (req, res) => {
    try {
        const { quant, id } = req.body;

        const { error } = await db.from('materiaPrima').update({ estoque: db.raw(`estoque - ${quant}`) }).eq('id', id);

        if (error) {
            return res.json({
                tipo: "Erro ao dar baixa na Materia Prima",
                mensagem: error,
            });
        }

        return res.json({
            tipo: "Baixa na Materia Prima",
            mensagem: `Baixa na Materia Prima foi um sucesso`,
        });
    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

export const verificarEstoque = async (req, res) => {
    try {
        const { id } = req.body;

        const { data, error } = await db.from('materiaPrima').select('estoque', 'minimo').eq('id', id);

        if (error || !data[0]) {
            return res.json({
                tipo: "Erro",
                mensagem: error || 'Nenhum registro encontrado',
            });
        }

        res.send(JSON.stringify([{
            estoque: data[0].estoque,
            minimo: data[0].minimo,
        }]));
    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};