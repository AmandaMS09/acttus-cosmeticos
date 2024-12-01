import { db } from "../db/initSupabase";
import {
cadastrarFormula,
selectFormula,
deleteFormula,
listarFormulas,
listarFormulasId,
} from "../controllers/formula";

jest.mock("../db/initSupabase");

describe("Testes do módulo formula", () => {
afterEach(() => {
  jest.clearAllMocks();
});

const mockRes = { json: jest.fn(), send: jest.fn() };
const mockDbReturnValue = { data: null, error: null };

it("Deve cadastrar uma fórmula", async () => {
  const mockReqBody = {
    formulas: [
      {
        nome: "Fórmula Teste",
        principalMP: 1,
        MateriasPrimas: [{ idMP: 1, composicao: 50, passo: 1 }],
      },
    ],
    id: 1,
  };
  const mockFormulaData = [{ id: 1 }];
  db.from.mockReturnValue({
    insert: jest.fn().mockResolvedValue({ data: mockFormulaData, error: null }),
  });

  await cadastrarFormula({ body: mockReqBody }, mockRes);

  expect(mockRes.json).toHaveBeenCalledWith({
    tipo: "Cadastro de fórmula",
    mensagem: "Itens cadastrados com sucesso!",
  });
});

it("Deve selecionar fórmulas", async () => {
  const mockData = [{ id: 1, nome: "Fórmula 1" }];
  db.from.mockReturnValue({
    select: jest.fn().mockResolvedValue({ data: mockData, error: null }),
  });

  await selectFormula({}, mockRes);

  expect(mockRes.json).toHaveBeenCalledWith({
    tipo: "Select Formulas",
    mensagem: "Dados retornados com sucesso!",
    formulas: mockData,
  });
});

it("Deve deletar uma fórmula", async () => {
  const mockReqBody = { id: 1 };
  db.from.mockReturnValue({
    delete: jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue(mockDbReturnValue),
    }),
  });

  await deleteFormula({ body: mockReqBody }, mockRes);

  expect(mockRes.json).toHaveBeenCalledWith({
    tipo: "Deletar Formula",
    mensagem: "Formula deletada com sucesso!",
  });
});

it("Deve listar fórmulas por produto_id", async () => {
  const mockReqBody = { produto_id: 1 };
  const mockData = [{ id: 1, nome: "Fórmula 1" }];
  db.from.mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    }),
  });

  await listarFormulas({ body: mockReqBody }, mockRes);

  expect(mockRes.json).toHaveBeenCalledWith({ formulas: mockData });
});

it("Deve listar fórmulas por id", async () => {
  const mockReqBody = { id: 1 };
  const mockData = [{ id: 1, nome: "Fórmula 1" }];
  db.from.mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    }),
  });

  await listarFormulasId({ body: mockReqBody }, mockRes);

  expect(mockRes.json).toHaveBeenCalledWith({ nformula: mockData });
});
});