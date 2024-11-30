import { db } from "../db/initSupabase.js"

// CADASTRAR ROTULO HAS FORNECEDOR
export const cadastrarRotuloHasFornecedor = async (req, res) => {
    try {
        const { rotulos, id } = req.body;

        for (let i = 0; i < rotulos.length; i++) {
            const { fornecedores } = rotulos[i];

            for (let j = 0; j < fornecedores.length; j++) {
                const { id: fornecedor_id, preco, minQtd } = fornecedores[j];

                const { error } = await db.from('rotulo_has_fornecedor').insert({ rotulo_id: id, fornecedor_id, preco, quantidade_minima: minQtd });

                if (error) {
                    return res.json({
                        tipo: "Erro no cadastro de fornecedor do rótulo",
                        mensagem: error,
                    });
                }
            }
        }

        return res.json({
            tipo: "Cadastro de rótulo e fornecedor",
            mensagem: `Itens cadastrados com sucesso!`,
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// CADASTRA FORNECEDOR HAS EMBALAGEM
export const cadastraFornecedorHasEmbalagem = async (req, res) => {
    try {
        const { embalagem_id, fornecedor_id, preco } = req.body;

        const { error } = await db.from('embalagem_has_fornecedor').insert({ embalagem_id, fornecedor_id, preco });

        if (error) {
            return res.json({
                tipo: "Erro ao cadastrar fornecedor da embalagem",
                mensagem: error,
            });
        }

        return res.json({
            tipo: "Cadastro Embalagem",
            mensagem: `Fornecedor da embalagem cadastrado com sucesso!`,
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// SELECT FORNECEDORES
export const selectFornecedores = async (req, res) => {
    try {
        const { data, error } = await db.from('fornecedor').select();

        if (error) {
            return res.json({
                tipo: "Erro",
                mensagem: error,
            });
        }

        return res.json({
            arrayFornecedor: data
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// CADASTRA FORNECEDOR
export const cadastraFornecedor = async (req, res) => {
    try {
        const { nome, email, telefone } = req.body;

        const { error } = await db.from('fornecedor').insert({ nome, email, telefone });

        if (error) {
            return res.json({
                tipo: "Erro ao cadastrar fornecedor",
                mensagem: error,
            });
        }

        return res.json({
            tipo: "Cadastro Fornecedor",
            mensagem: `Fornecedor cadastrado com sucesso!`,
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// UPDATE FORNECEDOR
export const updateFornecedor = async (req, res) => {
    try {
        const { nome, email, telefone, id } = req.body;

        const { error } = await db.from('fornecedor').update({ nome, email, telefone }).eq('id', id);

        if (error) {
            return res.json({
                tipo: "Erro ao atualizar dados do fornecedor",
                mensagem: error,
            });
        }

        return res.json({
            tipo: "Atualização do Fornecedor",
            mensagem: `Fornecedor atualizado com sucesso!`,
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// DELETE FORNECEDOR
export const deleteFornecedor = async (req, res) => {
    try {
        const { id } = req.body;

        const { error } = await db.from('fornecedor').delete().eq('id', id);

        if (error) {
            return res.json({
                tipo: "Erro ao deletar o fornecedor",
                mensagem: error,
            });
        }

        return res.json({
            tipo: "Deletar Fornecedor",
            mensagem: `Fornecedor deletado com sucesso!`,
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// LISTAR FORNECEDORES E
export const listarFornecedoresE = async (req, res) => {
    try {
        const { embalagem_id } = req.body;

        const { data, error } = await db.from('embalagem_has_fornecedor').select('*, fornecedor:fornecedor_id(*)').eq('embalagem_id', embalagem_id);

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados dos fornecedores",
                mensagem: error,
            });
        }

        let formattedData = []
        
        data.forEach(function(embalagemData) {
            const fornecedor = embalagemData.fornecedor
            delete embalagemData.fornecedor
            formattedData.push({...embalagemData, ...fornecedor})
        })

        return res.json({
            fornecedores: formattedData
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// LISTAR FORNECEDORES ROTULO
export const listarFornecedoresRotulo = async (req, res) => {
    try {
        const { rotulo_id } = req.body;

        const { data, error } = await db.from('rotulo_has_fornecedor').select('*, fornecedor:fornecedor_id(*)').eq('rotulo_id', rotulo_id);

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados dos fornecedores",
                mensagem: error,
            });
        }

        let formattedData = []
        
        data.forEach(function(rotuloData) {
            const fornecedor = rotuloData.fornecedor
            delete rotuloData.fornecedor
            formattedData.push({...rotuloData, ...fornecedor})
        })

        return res.json({
            fornecedores: formattedData
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// DELETE FORNECEDOR ROTULO
export const deleteFornecedorRotulo = async (req, res) => {
    try {
        const { f_id, r_id } = req.body;
    
        const { error } = await db.from('rotulo_has_fornecedor').delete().eq('fornecedor_id', f_id).eq('rotulo_id', r_id);
    
        if (error) {
            return res.json({
                tipo: "Erro ao remover fornecedor da rotulo",
                mensagem: error,
            });
        }
    
        return res.json({
            tipo: "Remover Fornecedor",
            mensagem: `Fornecedor removido com sucesso!`,
        });
    
    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
    };
    
    // DELETE FORNECEDOR E
    export const deleteFornecedorE = async (req, res) => {
    try {
        const { f_id, e_id } = req.body;
    
        const { error } = await db.from('embalagem_has_fornecedor').delete().eq('fornecedor_id', f_id).eq('embalagem_id', e_id);
    
        if (error) {
            return res.json({
                tipo: "Erro ao remover fornecedor da embalagem",
                mensagem: error,
            });
        }
    
        return res.json({
            tipo: "Remover Fornecedor",
            mensagem: `Fornecedor removido com sucesso!`,
        });
    
    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
    };
    
    // DELETE FRELAÇÃO MP
    export const deleteFRelacaoMP = async (req, res) => {
    try {
        const { id } = req.body;
    
        const { error } = await db.from('materiaprima_has_fornecedor').delete().eq('materiaPrima_id', id);
    
        if (error) {
            return res.json({
                tipo: "Erro ao deletar materia prima",
                mensagem: error,
            });
        }
    
        return res.json({
            tipo: "Deletar relação com materia prima",
            mensagem: `Relação com materia prima deletada com sucesso!`,
        });
    
    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
    };
    
    // DELETE FRELAÇÃO E
    export const deleteFRelacaoE = async (req, res) => {
    try {
        const { id } = req.body;
    
        const { error } = await db.from('embalagem_has_fornecedor').delete().eq('embalagem_id', id);
    
        if (error) {
            return res.json({
                tipo: "Erro ao deletar embalagem",
                mensagem: error,
            });
        }
    
        return res.json({
            tipo: "Deletar relação com embalagem",
            mensagem: `Relação com embalagem deletada com sucesso!`,
        });
    
    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
    };
    
    // DELETE FRELAÇÃO R
    export const deleteFRelacaoR = async (req, res) => {
    try {
        const { id } = req.body;
    
        const { error } = await db.from('rotulo_has_fornecedor').delete().eq('rotulo_id', id);
    
        if (error) {
            return res.json({
                tipo: "Erro ao deletar rotulo",
                mensagem: error,
            });
        }
    
        return res.json({
            tipo: "Deletar relação com rotulo",
            mensagem: `Relação com rotulo deletada com sucesso!`,
        });
    
    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
    };
    
    // LISTAR FORNECEDOR MATERIA PRIMA MIN
    export const listarFornecedorMateriaPrimaMin = async (req, res) => {
    try {
        const { id } = req.body;

        const { data, error } = await db.from('materiaprima_has_fornecedor').select('fornecedor_id, quantidade_minima, preco, fornecedor:fornecedor_id(*)').eq('materiaPrima_id', id);
    
        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados do forncedor",
                mensagem: error,
            });
        }

        let formattedData = []
        
        data.forEach(function(mpData) {
            const fornecedor = mpData.fornecedor
            delete mpData.fornecedor
            formattedData.push({...mpData, ...fornecedor})
        })
    
        return res.json({
            listaF: formattedData
        });
    
    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
    };
    
    // LISTAR FORNECEDOR ROTULO MIN
    export const listarFornecedorRotuloMin = async (req, res) => {
    try {
        const { id } = req.body;
    
        const { data, error } = await db.from('rotulo_has_fornecedor').select('fornecedor_id, quantidade_minima, preco, fornecedor:fornecedor_id(*)').eq('rotulo_id', id);
    
        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados do forncedor",
                mensagem: error,
            });
        }

        let formattedData = []
        
        data.forEach(function(mpData) {
            const fornecedor = mpData.fornecedor
            delete mpData.fornecedor
            formattedData.push({...mpData, ...fornecedor})
        })
    
        return res.json({
            listaF: formattedData
        });
    
    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
    };