import { db } from "../db/initSupabase";
import {
cadastrarProduto, produtoHasEmbalagem, deletePHasE,
listarProdutos, deleteProduto, updateProduto
} from "../controllers/produto";

jest.mock("../db/initSupabase");

describe("Testes do módulo produto", () => {
afterEach(() => {
    jest.clearAllMocks();
});

const mockRes = { json: jest.fn() };
const mockDbReturnValue = { data: null, error: null };

it("Deve cadastrar um produto", async () => {
    const mockReqBody = { nome: "Produto Teste", lucro: 20 };
    const mockProdutoData = [{ id: 1, nome: "Produto Teste", lucro: 20 }];

    db.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue({ data: mockProdutoData, error: null })
        })
    });

    await cadastrarProduto({ body: mockReqBody }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "Cadastro produto",
        mensagem: "Produto cadastrado com sucesso!",
        id: 1
    });
});

it("Deve associar embalagens a um produto", async () => {
    const mockReqBody = { produtoId: 1, dados: [{ id: 1, principal: true }, { id: 2, principal: false }] };
    db.from.mockReturnValue({ insert: jest.fn().mockResolvedValue(mockDbReturnValue) });

    await produtoHasEmbalagem({ body: mockReqBody }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "Embalagens",
        mensagem: "Embalagens do produto cadastradas com sucesso!"
    });
});

it("Deve remover a associação entre produto e embalagem", async () => {
    const mockReqBody = { p_id: 1, e_id: 1 };
    db.from.mockReturnValue({ delete: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue(mockDbReturnValue) }) }) });

    await deletePHasE({ body: mockReqBody }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "Remover Embalagem",
        mensagem: "Embalegem removida com sucesso!"
    });
});

it("Deve listar produtos", async () => {
    const mockData = [{ id: 1, nome: "Produto 1" }];
    db.from.mockReturnValue({ select: jest.fn().mockResolvedValue({ data: mockData, error: null }) });

    await listarProdutos({}, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({ produtos: mockData });
});

it("Deve deletar um produto", async () => {
    const mockReqBody = { id: 1 };
    db.from.mockReturnValue({ delete: jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue(mockDbReturnValue) }) });

    await deleteProduto({ body: mockReqBody }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "Deletar Produto",
        mensagem: "Produto deletado com sucesso"
    });
});

it("Deve atualizar um produto", async () => {
    const mockReqBody = { id: 1, nome: "Novo Nome", lucro: 30 };
    db.from.mockReturnValue({ update: jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue(mockDbReturnValue) }) });

    await updateProduto({ body: mockReqBody }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "Alterar Produto",
        mensagem: "Produto alterado com sucesso"
    });
});
});