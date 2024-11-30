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
import { cadastro, login } from "./controllers/autenticacao.js"
import { selectOrigem, getIdOrigem } from "./controllers/origem.js";

/* ROUTES */
app.get("/", function (res) {
    res.sendFile("landing.html", { root: __dirname })
})
app.post("/cadastro", cadastro)
app.post("/login", login)
app.get("/selectOrigem", selectOrigem)
app.post("/getIdOrigem", getIdOrigem)

/* SERVER CONFIG */
const PORT = 3303
app.listen(PORT, () => console.log(`Server Port ${PORT} running.`))