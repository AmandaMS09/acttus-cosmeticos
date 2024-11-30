import { db } from "../db/initSupabase.js"

// Pegar as origens do banco de dados para colocar no dropdown
export const selectOrigem = async (req, res) => {
    try {
        const { data, error } = await db.from('origem').select();

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

//Função para pegar o ID da origem
export const getIdOrigem = async (req, res) => {
    try {
        const { data, error } = await db.from('origem').select('id').eq('nome', req.body.nome);

        if (error || !data[0]) {
            return res.json({
                tipo: "Erro",
                mensagem: error || 'Nenhum registro encontrado',
            });
        }

        res.send(JSON.stringify(data[0].id));
    } catch (err) {
        res.json({
            tipo: "Erro",
            mensagem: err,
        });
    }
};