import { db } from "../db/initSupabase";
import { selectOrigem, getIdOrigem } from "../controllers/origem";

jest.mock("../db/initSupabase");

describe("Testes do módulo origem", () => {
afterEach(() => {
    jest.clearAllMocks();
});

const mockRes = {
    json: jest.fn(),
    send: jest.fn()
};

it("Deve selecionar origens", async () => {
    const mockData = [{ id: 1, nome: "Origem 1" }, { id: 2, nome: "Origem 2" }];
    db.from.mockReturnValue({ select: jest.fn().mockResolvedValue({ data: mockData, error: null }) });

    await selectOrigem({}, mockRes);

    expect(mockRes.send).toHaveBeenCalledWith(JSON.stringify(mockData));
});

it("Deve retornar o ID da origem pelo nome", async () => {
    const mockReqBody = { nome: "Origem 1" };
    const mockData = [{ id: 1 }];
    db.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: mockData, error: null })
        })
    });

    await getIdOrigem({ body: mockReqBody }, mockRes);

    expect(mockRes.send).toHaveBeenCalledWith(JSON.stringify(1));
});

it("Deve retornar um erro se a origem não for encontrada", async () => {
    const mockReqBody = { nome: "Origem Inexistente" };
    db.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: [], error: null }) // Simula um array vazio, indicando que a origem não foi encontrada
        })
    });

    await getIdOrigem({ body: mockReqBody }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "Erro",
        mensagem: 'Nenhum registro encontrado'
    });
});

it("Deve retornar um erro se houver um erro do banco de dados", async () => {
    const mockReqBody = { nome: "Origem com erro" };
    const mockError = { message: "Erro do banco de dados" };
    db.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: null, error: mockError })
        })
    });

    await getIdOrigem({ body: mockReqBody }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "Erro",
        mensagem: mockError
    });
});
});