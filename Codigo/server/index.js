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
import { cadastraMateriaPrima, listarMateriaPrima, updateMateriaPrima, deleteMateriaPrima, selectMateriasPrimas, baixaMateriaPrima, verificarEstoque, preencheTabelaMP, listarMateriaPrimaMin, listarMateriaPrimaMod, getMP, filtrarMateriaPrima } from "./controllers/materia-prima.js";
import { listarRotulo, updateRotulo, deleteRotulo, cadastrarRotulo, selectRotulo, listarRotulos } from "./controllers/rotulo.js"
import { cadastraEmbalagem, selectEmbalagem, deleteEmbalagem, updateEmbalagem, listarEmbalagens, listarEmbalagem, baixaEmbalagem, listarEmbalagemMin, listarEmbalagemMod } from "./controllers/embalagem.js"
import { cadastrarFormula, selectFormula, deleteFormula, listarFormulas, listarFormulasId } from "./controllers/formula.js";
import { cadastrarProduto, produtoHasEmbalagem, deletePHasE, listarProdutos, deleteProduto, updateProduto } from "./controllers/produto.js";

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
app.get("/listarProdutos", listarProdutos)
app.post("/deleteProduto", deleteProduto)
app.post("/updateProduto", updateProduto)

/* SERVER CONFIG */
const PORT = 3303
app.listen(PORT, () => console.log(`Server Port ${PORT} running.`))