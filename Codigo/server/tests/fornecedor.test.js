import { db } from "../db/initSupabase";
import {
cadastrarRotuloHasFornecedor, cadastraFornecedorHasEmbalagem, selectFornecedores,
cadastraFornecedor, updateFornecedor, deleteFornecedor, listarFornecedoresE,
listarFornecedoresRotulo, deleteFornecedorRotulo, deleteFornecedorE, deleteFRelacaoMP,
deleteFRelacaoE, deleteFRelacaoR, listarFornecedorMateriaPrimaMin, listarFornecedorRotuloMin,
listarFornecedorEmbalagens, updateFornecedorR, updateFornecedorE, listarFornecedorEmbalagemMin
} from "../controllers/fornecedor";

jest.mock("../db/initSupabase");

describe("Testes do módulo fornecedor", () => {
afterEach(() => {
    jest.clearAllMocks();
});

const mockRes = { json: jest.fn(), send: jest.fn() };
const mockDbReturnValue = { data: null, error: null };

it("Deve cadastrar RotuloHasFornecedor", async () => {
    const mockReqBody = {
        rotulos: [{ fornecedores: [{ id: 1, preco: 10, minQtd: 5 }] }],
        id: 1
    };
    db.from.mockReturnValue({ insert: jest.fn().mockResolvedValue(mockDbReturnValue) });

    await cadastrarRotuloHasFornecedor({ body: mockReqBody }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "Cadastro de rótulo e fornecedor",
        mensagem: "Itens cadastrados com sucesso!"
    });
});

it("Deve cadastrar FornecedorHasEmbalagem", async () => {
    const mockReqBody = { embalagem_id: 1, fornecedor_id: 1, preco: 10 };
    db.from.mockReturnValue({ insert: jest.fn().mockResolvedValue(mockDbReturnValue) });

    await cadastraFornecedorHasEmbalagem({ body: mockReqBody }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "Cadastro Embalagem",
        mensagem: "Fornecedor da embalagem cadastrado com sucesso!"
    });
});

it("Deve selecionar fornecedores", async () => {
    const mockData = [{ id: 1, nome: "Fornecedor 1" }];
    db.from.mockReturnValue({ select: jest.fn().mockResolvedValue({ data: mockData, error: null }) });

    await selectFornecedores({}, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({ arrayFornecedor: mockData });
});

});