import { db } from "../db/initSupabase.js"

// CADASTRAR FORMULA
export const cadastrarFormula = async (req, res) => {
    try {
        const { formulas, id: produto_id } = req.body;

        for (let i = 0; i < formulas.length; i++) {
            const { nome, principalMP, MateriasPrimas } = formulas[i];

            const { data: formulaData, error: insertError } = await db.from('formula').insert({ nome, principal: Number(principalMP), produto_id });

            if (insertError) {
                return res.json({
                    tipo: "Erro ao cadastrar fórmula",
                    mensagem: insertError,
                });
            }

            const { id: formulaId } = formulaData[0];

            for (let j = 0; j < MateriasPrimas.length; j++) {
                const { idMP, composicao, passo } = MateriasPrimas[j];

                const { error } = await db.from('formula_has_materiaprima').insert({ formula_id: formulaId, materiaprima_id: Number(idMP), porcentagem: Number(composicao), passo: Number(passo) });

                if (error) {
                    return res.json({
                        tipo: "Erro no cadastro da matéria prima da fórmula",
                        mensagem: error,
                    });
                }
            }
        }

        return res.json({
            tipo: "Cadastro de fórmula",
            mensagem: `Itens cadastrados com sucesso!`,
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// SELECT FORMULA
export const selectFormula = async (req, res) => {
    try {
        const { data, error } = await db.from('select_formula').select();

        if (error) {
            return res.json({
                tipo: "Erro",
                mensagem: error,
            });
        }

        return res.json({
            tipo: "Select Formulas",
            mensagem: `Dados retornados com sucesso!`,
            formulas: data,
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// DELETE FORMULA
export const deleteFormula = async (req, res) => {
    try {
        const { id } = req.body;

        const { error } = await db.from('formula').delete().eq('id', id);

        if (error) {
            return res.json({
                tipo: "Erro ao deletar formula",
                mensagem: error,
            });
        }

        return res.json({
            tipo: "Deletar Formula",
            mensagem: `Formula deletada com sucesso!`,
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// LISTAR FORMULAS
export const listarFormulas = async (req, res) => {
    try {
        const { produto_id } = req.body;

        const { data, error } = await db.from('formula').select().eq('produto_id', produto_id);

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados das formulas",
                mensagem: error,
            });
        }

        return res.json({
            formulas: data
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// LISTAR FORMULAS ID
export const listarFormulasId = async (req, res) => {
    try {
        const { id } = req.body;

        const { data, error } = await db.from('formula').select().eq('id', Number(id));

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados das formulas",
                mensagem: error,
            });
        }

        return res.json({
            nformula: data
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};