import { db } from "../db/initSupabase";
import {
adicionaObservacao, listarProducoes, listarProducaoEspecifica,
listarMateriaPrimaDaProducao, listarRotuloDaProducao, listarMudancas,
producoesUltimaSemana
} from "../controllers/producao";

jest.mock("../db/initSupabase");

describe("Testes do módulo produção", () => {
afterEach(() => {
    jest.clearAllMocks();
});

const mockRes = { json: jest.fn() };
const mockDbReturnValue = { data: null, error: null };

it("Deve adicionar uma observação à produção", async () => {
    const mockReqBody = {
        ob: "Observação de teste",
        produtos: [{ id: 1, quantidade: 10, mudancas: "Mudanças de teste" }]
    };
    const mockProducaoData = [{ id: 1 }];

    db.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({ data: mockProducaoData, error: null })
    });

    await adicionaObservacao({ body: mockReqBody }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "Adicionar observação",
        mensagem: "Observação registrada com sucesso"
    });
});

it("Deve listar produções", async () => {
    const mockData = [{ id: 1, nome: "Produção 1" }];
    db.from.mockReturnValue({ select: jest.fn().mockResolvedValue({ data: mockData, error: null }) });

    await listarProducoes({}, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({ producoes: mockData });
});

it("Deve listar produção específica", async () => {
    const mockReqBody = { producao_id: 1 };
    const mockData = [{ id: 1, nome: "Produção 1" }];
    db.from.mockReturnValue({ select: jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({ data: mockData, error: null }) }) });

    await listarProducaoEspecifica({ body: mockReqBody }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({ producoes: mockData });
});

it("Deve listar matéria-prima da produção", async () => {
    const mockReqBody = { producao_id: 1 };
    const mockData = [{ id: 1, nome: "Matéria-prima 1" }];
    db.from.mockReturnValue({ select: jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({ data: mockData, error: null }) }) });

    await listarMateriaPrimaDaProducao({ body: mockReqBody }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({ materiasPrimas: mockData });
});

it("Deve listar rótulo da produção", async () => {
    const mockReqBody = { producao_id: 1 };
    const mockData = [{ id: 1, nome: "Rótulo 1" }];
    db.from.mockReturnValue({ select: jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({ data: mockData, error: null }) }) });

    await listarRotuloDaProducao({ body: mockReqBody }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({ embalagensERotulos: mockData });
});

it("Deve listar mudanças", async () => {
    const mockReqBody = { producao_id: 1 };
    const mockData = [{ mudancas: "Mudanças de teste" }];
    db.from.mockReturnValue({ select: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: mockData, error: null }) }) }) });

    await listarMudancas({ body: mockReqBody }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({ mudancas: mockData[0].mudancas }); // Corrigido: acessando mudancas corretamente
});

it("Deve listar produções da última semana", async () => {
    const mockData = [{ id: 1, nome: "Produção 1" }];
    db.from.mockReturnValue({ select: jest.fn().mockResolvedValue({ data: mockData, error: null }) });

    await producoesUltimaSemana({}, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({ lista: mockData });
});
});