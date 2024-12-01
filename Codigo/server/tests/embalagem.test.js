import { db } from "../db/initSupabase";
import {
cadastraEmbalagem, selectEmbalagem, deleteEmbalagem, updateEmbalagem,
listarEmbalagens, listarEmbalagem, baixaEmbalagem, listarEmbalagemMin,
listarEmbalagemMod
} from "../controllers/embalagem";

jest.mock("../db/initSupabase");

describe("Testes do módulo embalagem", () => {
afterEach(() => {
    jest.clearAllMocks();
});

const mockRes = { json: jest.fn(), send: jest.fn() };
const mockDbReturnValue = { data: null, error: null };

it("Deve cadastrar uma embalagem", async () => {
    const mockReqBody = {
        nome: "Embalagem Teste",
        value: "Tipo Teste",
        tamanho: "500",
        estoque: 100,
        minimo: 10,
        fornecedores: [{ id: 1, preco: 5, minQtd: 2 }]
    };
    const mockEmbalagemData = [{ id: 1 }];
    db.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({ data: mockEmbalagemData, error: null })
    });

    await cadastraEmbalagem({ body: mockReqBody }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "Cadastro Embalagem",
        mensagem: "Embalagem cadastrada com sucesso!",
    });
});

it("Deve selecionar embalagens", async () => {
    const mockData = [{ id: 1, nome: "Embalagem 1" }];
    db.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    await selectEmbalagem({}, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "Select Embalagens",
        mensagem: "Dados retornados com sucesso!",
        embalagens: mockData,
    });
});

it("Deve deletar uma embalagem", async () => {
    const mockReqBody = { id: 1 };
    db.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue(mockDbReturnValue),
        }),
    });

    await deleteEmbalagem({ body: mockReqBody }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "Deletar Embalagem",
        mensagem: "Embalagem deletado com sucesso!",
    });
});

it("Deve atualizar uma embalagem", async () => {
    const mockReqBody = {
        nome: "Embalagem Atualizada",
        estoque: 200,
        tipo: 1,
        tamanho: "1000ml",
        minimo: 20,
        id: 1,
        fornecedores: [{ id: 1, preco: 10, minQtd: 5 }]
    };
    db.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue(mockDbReturnValue),
        }), insert: jest.fn().mockResolvedValue(mockDbReturnValue)
    });

    await updateEmbalagem({ body: mockReqBody }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "Alterar Embalagem",
        mensagem: "Embalagem alterada com sucesso!",
    });
});

});