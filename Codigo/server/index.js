// Configuração do express
import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

app.use(
  cors({
    origin: "*",
  })
);

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* Local imports */
import { cadastro, login, listaUsuarios, usuarioEspecifico, deletarUsuario, alterarNomeUsuario, alterarEmailUsuario, alterarPermissaoUsuario } from "./controllers/usuario.js"
import { selectOrigem, getIdOrigem } from "./controllers/origem.js";
import { cadastraMateriaPrima, listarMateriaPrima, updateMateriaPrima, deleteMateriaPrima, selectMateriasPrimas, baixaMateriaPrima, verificarEstoque, preencheTabelaMP, listarMateriaPrimaMin, listarMateriaPrimaMod, getMP, filtrarMateriaPrima, updateFornecedorMP, listarFornecedoresMP, deleteMPHasF, listarFornecedorMateriaPrima, precoMP } from "./controllers/materia-prima.js";
import { listarRotulo, updateRotulo, deleteRotulo, cadastrarRotulo, selectRotulo, listarRotulos, baixaRotulo, listarRotuloMin, listarRotuloMod } from "./controllers/rotulo.js"
import { cadastraEmbalagem, selectEmbalagem, deleteEmbalagem, updateEmbalagem, listarEmbalagens, listarEmbalagem, baixaEmbalagem, listarEmbalagemMin, listarEmbalagemMod } from "./controllers/embalagem.js"
import { cadastrarFormula, selectFormula, deleteFormula, listarFormulas, listarFormulasId } from "./controllers/formula.js";
import { cadastrarProduto, produtoHasEmbalagem, deletePHasE, listarProdutos, deleteProduto, updateProduto } from "./controllers/produto.js";
import { cadastrarRotuloHasFornecedor, cadastraFornecedorHasEmbalagem, selectFornecedores, cadastraFornecedor, updateFornecedor, deleteFornecedor, listarFornecedoresE, listarFornecedoresRotulo, deleteFornecedorRotulo, deleteFornecedorE, deleteFRelacaoMP, deleteFRelacaoE, deleteFRelacaoR, listarFornecedorMateriaPrimaMin, listarFornecedorRotuloMin, listarFornecedorEmbalagens, updateFornecedorR, updateFornecedorE, listarFornecedorEmbalagemMin } from "./controllers/fornecedor.js";
import { adicionaObservacao, listarProducoes, listarProducaoEspecifica, listarMateriaPrimaDaProducao, listarRotuloDaProducao, listarMudancas, producoesUltimaSemana } from "./controllers/producao.js";

/* ROUTES */
app.get("/", function (res) {
    res.sendFile("landing.html", { root: __dirname })
})

app.post("/cadastro", cadastro)
app.post("/login", login)
app.get("/selectOrigem", selectOrigem)
app.get("/getIdOrigem", getIdOrigem)
app.post("/cadastraMateriaPrima", cadastraMateriaPrima)
app.post("/listarMateriaPrima", listarMateriaPrima)
app.post("/updateMateriaPrima", updateMateriaPrima)
app.post("/listaUsuarios", listaUsuarios)
app.post("/usuarioEspecifico", usuarioEspecifico)
app.post("/deletarUsuario", deletarUsuario)
app.post("/alterarNomeUsuario", alterarNomeUsuario)
app.post("/alterarEmailUsuario", alterarEmailUsuario)
app.post("/alterarPermissaoUsuario", alterarPermissaoUsuario)
app.post("/deleteMateriaPrima", deleteMateriaPrima)
app.get("/selectMateriasPrimas", selectMateriasPrimas)
app.post("/selectMateriasPrimas", selectMateriasPrimas)
app.post("/baixaMateriaPrima", baixaMateriaPrima)
app.post("/verificarEstoque", verificarEstoque)
app.post("/preencheTabelaMP", preencheTabelaMP)
app.post("/listarMateriaPrimaMin", listarMateriaPrimaMin)
app.post("/listarMateriaPrimaMod", listarMateriaPrimaMod)
app.post("/getMP", getMP)
app.post("/filtrarMateriaPrima", filtrarMateriaPrima)
app.post("/listarRotulo", listarRotulo)
app.post("/updateRotulo", updateRotulo)
app.post("/deleteRotulo", deleteRotulo)
app.post("/cadastrarRotulo", cadastrarRotulo)
app.get("/selectRotulo", selectRotulo)
app.post("/listarRotulos", listarRotulos)
app.post("/cadastraEmbalagem", cadastraEmbalagem)
app.get("/selectEmbalagem", selectEmbalagem)
app.post("/deleteEmbalagem", deleteEmbalagem)
app.post("/updateEmbalagem", updateEmbalagem)
app.post("/listarEmbalagens", listarEmbalagens)
app.post("/listarEmbalagem", listarEmbalagem)
app.post("/baixaEmbalagem", baixaEmbalagem)
app.post("/listarEmbalagemMin", listarEmbalagemMin)
app.post("/listarEmbalagemMod", listarEmbalagemMod)
app.post("/cadastrarFormula", cadastrarFormula)
app.get("/selectFormula", selectFormula)
app.post("/deleteFormula", deleteFormula)
app.post("/listarFormulas", listarFormulas)
app.post("/listarFormulasId", listarFormulasId)
app.post("/cadastrarProduto", cadastrarProduto)
app.post("/produtoHasEmbalagem", produtoHasEmbalagem)
app.post("/deletePHasE", deletePHasE)
app.post("/listarProdutos", listarProdutos)
app.get("/listarProdutos", listarProdutos)
app.post("/deleteProduto", deleteProduto)
app.post("/updateProduto", updateProduto)
app.post("/cadastrarRotuloHasFornecedor", cadastrarRotuloHasFornecedor)
app.post("/cadastraFornecedorHasEmbalagem", cadastraFornecedorHasEmbalagem)
app.post("/selectFornecedores", selectFornecedores)
app.get("/selectFornecedores", selectFornecedores)
app.post("/cadastraFornecedor", cadastraFornecedor)
app.post("/updateFornecedor", updateFornecedor)
app.post("/deleteFornecedor", deleteFornecedor)
app.post("/listarFornecedoresE", listarFornecedoresE)
app.post("/listarFornecedoresRotulo", listarFornecedoresRotulo)
app.post("/deleteFornecedorRotulo", deleteFornecedorRotulo)
app.post("/deleteFornecedorE", deleteFornecedorE)
app.post("/deleteFRelacaoMP", deleteFRelacaoMP)
app.post("/deleteFRelacaoE", deleteFRelacaoE)
app.post("/deleteFRelacaoR", deleteFRelacaoR)
app.post("/listarFornecedorMateriaPrimaMin", listarFornecedorMateriaPrimaMin)
app.post("/listarFornecedorRotuloMin", listarFornecedorRotuloMin)
app.post("/adicionaObservacao", adicionaObservacao)
app.post("/listarProducoes", listarProducoes)
app.post("/listarProducaoEspecifica", listarProducaoEspecifica)
app.post("/listarMateriaPrimaDaProducao", listarMateriaPrimaDaProducao)
app.post("/listarRotuloDaProducao", listarRotuloDaProducao)
app.post("/listarMudancas", listarMudancas)
app.post("/producoesUltimaSemana", producoesUltimaSemana)
app.post("/updateFornecedorMP", updateFornecedorMP)
app.post("/listarFornecedoresMP", listarFornecedoresMP)
app.post("/deleteMPHasF", deleteMPHasF)
app.post("/listarFornecedorMateriaPrima", listarFornecedorMateriaPrima)
app.post("/precoMP", precoMP)
app.post("/listarFornecedorEmbalagens", listarFornecedorEmbalagens)
app.post("/updateFornecedorR", updateFornecedorR)
app.post("/updateFornecedorE", updateFornecedorE)
app.post("/listarFornecedorEmbalagemMin", listarFornecedorEmbalagemMin)
app.post("/baixaRotulo", baixaRotulo)
app.post("/listarRotuloMin", listarRotuloMin)
app.post("/listarRotuloMin", listarRotuloMin)

/* SERVER CONFIG */
const PORT = 3303
app.listen(PORT, () => console.log(`Server Port ${PORT} running.`))

export default app;