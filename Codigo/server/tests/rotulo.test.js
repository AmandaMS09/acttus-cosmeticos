import { db } from "../db/initSupabase";
import {
listarRotulo, updateRotulo, deleteRotulo, cadastrarRotulo,
selectRotulo, listarRotulos, baixaRotulo, listarRotuloMin, listarRotuloMod
} from "../controllers/rotulo";

jest.mock("../db/initSupabase");

describe("Testes do módulo rotulo", () => {
afterEach(() => {
    jest.clearAllMocks();
});

it("Deve listar todos os rótulos", async () => {
    const req = {};
    const res = { json: jest.fn() };
    const mockData = [{ id: 1, nome: "Rotulo 1" }, { id: 2, nome: "Rotulo 2" }];
    db.from.mockReturnValue({ select: jest.fn().mockResolvedValue({ data: mockData, error: null }) });

    await listarRotulo(req, res);

    expect(res.json).toHaveBeenCalledWith({ rotulo: mockData });
});

it("Deve atualizar um rótulo", async () => {
    const req = {
        body: {
            id: 1,
            tipo: 'Novo Tipo',
            estoque: 100,
            minimo: 50,
            principal: true,
            nome: 'Novo Nome',
            fornecedores: [{ id: 1, preco: 10, minQtd: 50 }]
        }
    };
    const res = { json: jest.fn() };
    
    db.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: null, error: null })
        }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null })
    });
    
    await updateRotulo(req, res);
    
    expect(res.json).toHaveBeenCalledWith({
        tipo: "Atualização de Rotulo",
        mensagem: "Rotulo atualizada com sucesso!",
        s: "S de serto"
    });
    });


it("Deve deletar um rótulo", async () => {
    const req = { body: { id: 1 } };
    const res = { json: jest.fn() };
    
    db.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: null, error: null })
        })
    });
    
    await deleteRotulo(req, res);
    
    expect(res.json).toHaveBeenCalledWith({
        tipo: "Deletar rotulo",
        mensagem: "rotulo deletada com sucesso",
    });
    });

});