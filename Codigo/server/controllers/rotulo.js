import { db } from "../db/initSupabase.js"

// LISTAR ROTULO
export const listarRotulo = async (req, res) => {
    try {
        const { data, error } = await db.from('rotulo').select();

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados dos Rotulos",
                mensagem: error,
            });
        }

        return res.json({
            rotulo: data
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// UPDATE ROTULO
export const updateRotulo = async (req, res) => {
    try {
        const { id, tipo, estoque, minimo, principal, nome, fornecedores } = req.body;

        const { data, error } = await db.from('rotulo').update({
            tipo: tipo,
            estoque: estoque,
            minimo: minimo,
            principal: principal,
            nome: nome
        }).eq('id', id);

        if (error) {
            return res.json({
                tipo: "Erro ao atualizar dados de Rotulos",
                mensagem: error,
            });
        }

        for (let i = 0; i < fornecedores.length; i++) {
            const { data: insertData, error: insertError } = await db.from('rotulo_has_fornecedor').insert({
                rotulo_id: id,
                fornecedor_id: fornecedores[i].id,
                preco: fornecedores[i].preco,
                minQtd: fornecedores[i].minQtd
            });

            if (insertError) {
                return res.json({
                    tipo: "Erro no cadastro de fornecedor do rótulo",
                    mensagem: insertError,
                });
            }
        }

        return res.json({
            tipo: "Atualização de Rotulo",
            mensagem: `Rotulo atualizada com sucesso!`,
            s: "S de serto"
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// DELETE ROTULO
export const deleteRotulo = async (req, res) => {
    try {
        const { id } = req.body;

        const { data, error } = await db.from('rotulo').delete().eq('id', id);

        if (error) {
            return res.json({
                tipo: "Erro ao deletar rotulo",
                mensagem: error,
            });
        }

        return res.json({
            tipo: "Deletar rotulo",
            mensagem: "rotulo deletada com sucesso",
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// CADASTRAR ROTULO
export const cadastrarRotulo = async (req, res) => {
    try {
        const { rotulos, id } = req.body;

        for (let i = 0; i < rotulos.length; i++) {
            const { data, error } = await db.from('rotulo').insert({
                tipo: rotulos[i].tipo,
                principal: rotulos[i].principal,
                estoque: rotulos[i].estoque || 0,
                nome: rotulos[i].nome,
                produto_id: id,
                minimo: rotulos[i].minimo || 0
            });

            if (error) {
                return res.json({
                    tipo: "Erro ao cadastrar rotulo",
                    mensagem: error,
                });
            }

            const { data: selectData, error: selectError } = await db.from('rotulo').select().eq('nome', rotulos[i].nome).eq('produto_id', id);

            if (selectError) {
                return res.json({
                    tipo: "Erro de retorno do id",
                    mensagem: selectError,
                });
            }

            for (let j = 0; j < rotulos[i].fornecedores.length; j++) {
                const { data: insertData, error: insertError } = await db.from('rotulo_has_fornecedor').insert({
                    rotulo_id: selectData[0].id,
                    fornecedor_id: rotulos[i].fornecedores[j].id,
                    preco: rotulos[i].fornecedores[j].preco,
                    minQtd: rotulos[i].fornecedores[j].minQtd
                });

                if (insertError) {
                    return res.json({
                        tipo: "Erro no cadastro de fornecedor do rótulo",
                        mensagem: insertError,
                    });
                }
            }
        }

        return res.json({
            tipo: "Cadastro de rótulo e fornecedor",
            mensagem: `Itens cadastrados com sucesso!`,
            s: "S de serto"
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// SELECT ROTULO
export const selectRotulo = async (req, res) => {
    try {
        const { data, error } = await db.from('rotulo_has_fornecedor').select('*, rotulo:rotulo_id(*)');

        if (error) {
            console.log('Entrou no erro')
            return res.json({
                tipo: "Erro",
                mensagem: error,
            });
        }

        let formattedData = []

        data.forEach(function (rotuloData) {
            const rotulo = rotuloData.rotulo
            delete rotuloData.rotulo
            formattedData.push({ ...rotuloData, ...rotulo })
        })

        res.send(JSON.stringify(formattedData));
    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// LISTAR ROTULOS
export const listarRotulos = async (req, res) => {
    try {
        const produto_id = req.body.produto_id;

        const { data, error } = await db.from('rotulo').select().eq('produto_id', produto_id);

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados dos rotulos",
                mensagem: error,
            });
        }

        return res.json({
            rotulos: data
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// BAIXA ROTULO
export const baixaRotulo = async (req, res) => {
    try {
        const { quant, id } = req.body;

        const { data, error: selectError } = await db.from('rotulo').select('estoque').eq('id', id);

        if (selectError) {
            return res.json({
                tipo: "Erro ao dar baixa no rotulo",
                mensagem: selectError,
            });
        }

        const estoque = Number(data[0].estoque) - quant

        const { error } = await db.from('rotulo').update({ estoque }).eq('id', id);

        if (error) {
            return res.json({
                tipo: "Erro ao dar baixa no rotulo",
                mensagem: error,
            });
        }

        return res.json({
            tipo: "Baixa baixa no rotulo",
            mensagem: `Baixa no rotulo foi um sucesso`,
        });

    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};

// LISTAR ROTULO MIN
export const listarRotuloMin = async (req, res) => {
    try {
        const { data, error } = await db.from('listar_rotulo_min').select();

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados das Rotulos ",
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

// LISTAR ROTULO MOD
export const listarRotuloMod = async (req, res) => {
    try {
        const { id } = req.body;

        const { data, error } = await db.from('rotulo').select().eq('id', id);

        if (error) {
            return res.json({
                tipo: "Erro ao retornar dados das Rotulos ",
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