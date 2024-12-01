import { db } from "../db/initSupabase";
import {
cadastraMateriaPrima, listarMateriaPrima, updateMateriaPrima, deleteMateriaPrima,
selectMateriasPrimas, baixaMateriaPrima, verificarEstoque, preencheTabelaMP,
listarMateriaPrimaMin, listarMateriaPrimaMod, getMP, filtrarMateriaPrima,
updateFornecedorMP, listarFornecedoresMP, deleteMPHasF, listarFornecedorMateriaPrima, precoMP
} from "../controllers/materia-prima";

jest.mock("../db/initSupabase");

describe("Testes do módulo materiaprima", () => {
afterEach(() => {
    jest.clearAllMocks();
});

const mockReqBody = {
    nome: "Teste MP",
    INCI_nome: "Teste INCI",
    estoque_atual: 100,
    estoque_min: 10,
    origemId: 1,
    fornecedores: [{ id: 1, preco: 10, minQtd: 5 }],
    id: 1,
    formula: 1,
    origem: 1,
    MP_id: 1,
    materiaPrima_id: 1,
    fornecedor_id: 1,
    quant: 10
};

const mockRes = {
    json: jest.fn(),
    send: jest.fn()
};

const mockDbReturnValue = {
    data: null,
    error: null
};

it("Deve cadastrar uma matéria-prima", async () => {
  const mockReqBody = {
      nome: "Teste MP",
      INCI_nome: "Teste INCI",
      estoque_atual: 100,
      estoque_min: 10,
      origemId: 1,
      fornecedores: [{ id: 1, preco: 10, minQtd: 5 }], // Fornecedores definido como um array
      // ... outras propriedades
  };
  const mockRes = { json: jest.fn() };
  const mockDbReturnValue = { data: null, error: null };
  
  db.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue(mockDbReturnValue),
      select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: [{ id: 1 }], error: null })
      })
  });
  
  await cadastraMateriaPrima({ body: mockReqBody }, mockRes);
  
  expect(mockRes.json).toHaveBeenCalledWith({
      tipo: "Cadastro realizado com sucesso",
      mensagem: "Matéria Prima cadastrada com sucesso!"
  });
  });

it("Deve listar matérias-primas", async () => {
    const mockData = [{ id: 1, nome: "MP 1" }];
    db.from.mockReturnValue({ select: jest.fn().mockResolvedValue({ data: mockData, error: null }) });

    await listarMateriaPrima({}, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({ materiaPrima: mockData });
});

// ... outros testes seguem um padrão similar

it("Deve atualizar uma matéria-prima", async () => {
    db.from.mockReturnValue({
        update: jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue(mockDbReturnValue) }),
        insert: jest.fn().mockResolvedValue(mockDbReturnValue)
    });

    await updateMateriaPrima({ body: mockReqBody }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "Atualização da Matéria Prima",
        mensagem: "Matéria Prima atualizada com sucesso!"
    });
});

it("Deve deletar uma matéria-prima", async () => {
    db.from.mockReturnValue({ delete: jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue(mockDbReturnValue) }) });

    await deleteMateriaPrima({ body: { id: 1 } }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "Deletar Matéria prima",
        mensagem: "Matéria prima deletada com sucesso"
    });
});

// ... continue o padrão para as outras funções
});