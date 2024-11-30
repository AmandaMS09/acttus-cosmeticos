const { json, response } = require("express")

function estaLogado(p) {
    var x = sessionStorage.getItem("usuario")
    if (!x) {
        window.alert("Realize o login para continuar")
        return window.location.assign("login.html")
    }
    var usuario = JSON.parse(x)
    if (p == 1) {
        if (usuario.temPermissao == 0) {
            window.alert("Acesso negado")
            return window.location.assign("index.html")
        }
    }
}

function logoutUser() {
    sessionStorage.removeItem("usuario")
    return window.location.assign("login.html")
}

async function cadastrar(event) {
    event.preventDefault()
    var user;

    const nome = document.getElementById("name").value
    const email = document.getElementById("email").value
    const senha = document.getElementById("password").value

    if ((nome.trim() === "") || (email.trim() === "") || (senha.trim() === "")) {
        window.alert("Tenha certeza de preencher todos os campos")
    } else {

        const url = `http://localhost:3303/cadastro`

        var resp = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nome: nome,
                senha: senha,
                email: email
            }),
        })

        var data = await resp.json()
        sessionStorage.setItem('usuario', JSON.stringify(data.usuario))
        window.location.assign("index.html")

    }
}

// LOGIN
// Requisição para o back-end e retorno de alertas
function login(event) {
    event.preventDefault()
    const usu_email = document.getElementById("email").value
    const usu_senha = document.getElementById("password").value

    if (usu_email === "" || usu_senha === "") {
        return window.alert("Preencha todos o dados")
    }

    fetch("http://localhost:3303/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usu_email, senha: usu_senha })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
            if (data.usuario) {
                sessionStorage.setItem('usuario', JSON.stringify(data.usuario))
                window.location.assign("index.html")
            }

        });
    })
}

// Barra de pesquisa
function pesquisar() {
    let input = document.getElementById('pesquisa').value
    input = input.toLowerCase();
    let itens = document.getElementsByClassName('card');

    for (i = 0; i < itens.length; i++) {
        if (!itens[i].innerHTML.toLowerCase().includes(input)) {
            itens[i].style.display = "none";
        }
        else {
            itens[i].style.display = "flex";
        }
    }
}

function listaDeCompras(tipo) {
    if (tipo == 0) {
        //Usa os dados do localStorage para printar na tela a lista de compras
    } else {
        //Pega do banco de dados todos os insumos com menos do que o estoque mínimo para printar na tela a lista de compras
    }

}

function mudancasPT1() {
    //Coloca no localstorage a matéria prima do jeito que foi simulada
    var config = ""
    var formula, embCima, embBaixo, rotulo, contraRotulo;
    const produtos = document.getElementsByClassName("produtoFormula")
    for (var cont = 0; cont < produtos.length; cont++) {
        if (document.getElementById(`selectFormula-${cont}`).value != undefined) {
            formula = `F=${document.getElementById(`selectFormula-${cont}`).value};`
        }
        if (document.getElementById(`selectCima-${cont}`).value != undefined) {
            embCima = `EC=${document.getElementById(`selectCima-${cont}`).value};`
        }
        if (document.getElementById(`selectEmbalagem-${cont}`).value != undefined) {
            embBaixo = `EB=${document.getElementById(`selectEmbalagem-${cont}`).value};`
        }
        if (document.getElementById(`selectRotulo-${cont}`).value != undefined) {
            rotulo = `R=${document.getElementById(`selectRotulo-${cont}`).value};`
        }
        if (document.getElementById(`selectCR-${cont}`).value != undefined) {
            contraRotulo = `CR=${document.getElementById(`selectCR-${cont}`).value};`
        }

        config += `${formula}${embCima}${embBaixo}${rotulo}${contraRotulo}//`
    }
    var materiasPrimas = []
    for (var cont = 0; cont < document.getElementsByClassName("linhaMP").length; cont++) {
        materiasPrimas.push({
            id: document.getElementsByClassName("idMP")[cont].innerHTML,
            quantidade: document.getElementsByClassName("qtdMP")[cont].value
        })
    }

    localStorage.setItem("config", config)
    localStorage.setItem("materiasPrimas", JSON.stringify(materiasPrimas))
    sessionStorage.setItem("materiasPrimas", JSON.stringify(materiasPrimas))
}

async function mudancasPT2() {
    //Retira do localStorage as que continuaram iguais
    var dados = JSON.parse(localStorage.getItem("materiasPrimas"));
    if (!dados) {
        return console.log("Sem informações no localStorage")
    }
    var remover = []
    var tags = document.getElementsByClassName(`linhaMP`);
    for (let cont = 0; cont < tags.length; cont++) {
        if (dados[cont].quantidade == document.getElementsByClassName("qtdMP")[cont].value) {
            remover.push(cont)
        } else {
            dados[cont].quantidade = document.getElementsByClassName("qtdMP")[cont].value
        }
    }
    console.log(remover)
    console.log(remover.length)
    for (let cont = remover.length - 1; cont >= 0; cont--) {
        console.log(dados[remover[cont]])
        dados.splice(remover[cont], 1)
    }

    var resposta = localStorage.getItem("config")
    resposta += "MP="
    resposta += JSON.stringify(dados)

    return resposta
}

function getProdutos() {
    fetch("http://localhost:3303/listarProdutos", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        res.json().then(function (data) {
            if (data.produtos) {
                var listaItens = document.getElementById("produtos")
                listaItens.innerHTML = ""
                let formulaNome
                for (let cont = 0; cont < data.produtos.length; cont++) {
                    formulaNome = data.produtos[cont].formula
                    if (data.produtos[cont].formula == null)
                        formulaNome = "";
                    listaItens.innerHTML += (`
                    <!-- CARD --> 
                    <div class="card text-dark col-md-3" data-toggle="modal" data-target="#modal" onclick="setModalProduto( ${data.produtos[cont].id},'${data.produtos[cont].nome}','${data.produtos[cont].lucro}')">
                        <img src="https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg" alt="img">
                        <div class="container">
                            <p>${data.produtos[cont].nome}</p>
                            <p>${formulaNome}</p>
                        </div>
                    </div>
                    `)
                }
            } else {
                window.alert(`${data.tipo} - ${data.mensagem}`)
            }

        });
    })
}





async function getProdutoF(id_produto) {
    var response = await fetch("http://localhost:3303/listarFormulas", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            restricao: `where produto_id = ${id_produto}`,
        })
    })
    var data = await response.json()
    return data
}

function deleteFormula(id) {
    if (confirm("Deseja mesmo deletar essa fórmula?")) {
        fetch("http://localhost:3303/deleteFormula", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: Number(id),
            })
        }).then(function (res) {
            res.json().then(function (data) {
                window.alert(`${data.tipo} - ${data.mensagem}`)
            })
        })
    }
}



async function getProdutoE(id_produto) {
    var response = await fetch("http://localhost:3303/listarEmbalagens", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            restricao: `and produto_id = ${id_produto}`,
        })
    })
    var data = await response.json()
    return data
}

function deletePHasE(p_id, e_id) {
    if (confirm("Deseja mesmo remover essa embalagem do produto?")) {
        fetch("http://localhost:3303/deletePHasE", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                p_id: Number(p_id),
                e_id: Number(e_id)
            })
        }).then(function (res) {
            res.json().then(function (data) {
                window.alert(`${data.tipo} - ${data.mensagem}`)
            })
        })
    }
}

async function getProdutoR(id_produto) {
    var response = await fetch("http://localhost:3303/listarRotulos", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            restricao: `where produto_id = ${id_produto}`,
        })
    })
    var data = await response.json()
    return data
}

function deleteRotulo(id) {
    if (confirm("Deseja mesmo deletar esse rótulo?")) {
        fetch("http://localhost:3303/deleteRotulo", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: Number(id),
            })
        }).then(function (res) {
            res.json().then(function (data) {
                window.alert(`${data.tipo} - ${data.mensagem}`)
            })
        })
    }
}

async function setModalProduto(id, nome, lucro) {
    const f = await getProdutoF(id);
    const e = await getProdutoE(id);
    const r = await getProdutoR(id);

    document.getElementById("modal_titulo").value = nome
    document.getElementById("modalLucro").value = lucro
    conteudo = document.getElementsByClassName("modal-body")[0]
    conteudo.innerHTML = `<div id="imgEadd" class="w-50 p-3">
                <img src="https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg" alt="img">
                <div id="divFormula">
                    <label>Nova fórmula:</label>
                    <button type="button" id="openFormula" class="add form-control mb-3" data-toggle="modal" data-target="#modalFormula">+ Adicionar fórmula</button>
                    <div id="formulas" class="table m-0 p-0">
                        <!--
                        <div class="row item mt-2 formula">
                            <div class="col">Fórmula</div>
                            <div class="col">
                                <span class="precoFormula">R$00,00</span>
                                <div>
                                    <span>Padrão</span>
                                    <i class="bi bi-x-square ml-3"1></i>
                                </div>
                            </div>
                        </div>
                        -->
                    </div>
                </div>
                <div id="divEmbalagem">
                    <label>Nova embalagem:</label>
                    <button type="button" class="add form-control mb-3" onclick="addEmbalagem()">+ Adicionar embalagem</button>
                    <div id="embalagens" class="table m-0 p-0">
                        
                    </div>
                </div>
                <div id="divRotulo">
                    <label>Novo rótulo:</label>
                    <button type="button" id="openRotulo" class="add form-control mb-3" data-toggle="modal" data-target="#modalRotulo">+ Adicionar rótulo</button>
                    <div id="rotulos" class="table m-0 p-0">
                        <!--
                        <div class="row item mt-2 rotulo">
                            <div class="col">Rótulo</div>
                            <div class="col">
                                <span>15x10</span>
                                <span class="precoRotulo">R$00,00</span>
                            </div>
                            <div class="col">
                                <span>Padrão</span>
                                <i class="bi bi-x-square ml-3"></i>
                            </div>
                        </div>
                        -->
                    </div>
                </div>
            </div>
            <div id="mBodyConteudo" class="w-50 p-3"></div>`


    let principal

    conteudo = document.getElementById("mBodyConteudo")
    conteudo.innerHTML = ""
    if (f.formulas.length > 0)
        conteudo.innerHTML += '<p>Fórmulas:</p>';
    for (let cont = 0; cont < f.formulas.length; cont++) {
        principal = ""
        if (f.formulas[cont].principal == 1)
            principal = " - Padrão"
        conteudo.innerHTML += `
        <div class="row p-0 m-0 justify-content-between">
            <p>${f.formulas[cont].nome}${principal}</p>
            <h3 class="mt-auto" onclick="deleteFormula(${f.formulas[cont].id})"><i class="bi bi-x-square"></i></h3>
        </div>
        `
    }

    if (e.embalagens.length > 0)
        conteudo.innerHTML += '<p>Embalagens:</p>';
    for (let cont = 0; cont < e.embalagens.length; cont++) {
        if (e.embalagens[cont].produto_id == id) {
            principal = ""
            if (e.embalagens[cont].ePrincipal == 1)
                principal = " - Padrão"
            conteudo.innerHTML += `
            <div class="row p-0 m-0 justify-content-between">
                <p>${e.embalagens[cont].nome}${principal}</p>
                <h3 class="mt-auto" onclick="deletePHasE(${id},${e.embalagens[cont].id})"><i class="bi bi-x-square"></i></h3>
            </div>
            `
        }
    }

    if (r.rotulos.length > 0)
        conteudo.innerHTML += '<p>Rótulos:</p>';
    for (let cont = 0; cont < r.rotulos.length; cont++) {
        principal = ""
        if (r.rotulos[cont].principal == 1)
            principal = " - Padrão"
        conteudo.innerHTML += `
        <div class="row p-0 m-0 justify-content-between">
            <p>${r.rotulos[cont].nome}${principal}</p>
            <h3 class="mt-auto" onclick="deleteRotulo(${r.rotulos[cont].id})"><i class="bi bi-x-square"></i></h3>
        </div>
        `
    }

    botoes = document.getElementsByClassName("modal-footer")[0]
    botoes.innerHTML = `<button type="button" class="form-control" onclick="updateProduto(${id})">Alterar</button>
    <button class="form-control" onclick="deleteProduto(${id})">Deletar</button>`

}

function deleteProduto(id) {
    fetch("http://localhost:3303/deleteProduto", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id,
        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        })
    })
}

function updateProduto(id) {
    embalagensLS()
    updateDadosProduto("formula", "formulaData")
    cadastrarFormulas(id)
    updateDadosProduto("rotulo", "rotuloData")
    cadastrarRotulos(id)
    updateDadosProduto("embalagem", "embalagemData")
    pHasE(id)
    var nome = document.getElementById("modal_titulo").value
    var lucro = Number(document.getElementById("modalLucro").value.replace("%", ""))
    fetch("http://localhost:3303/updateProduto", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id,
            nome: nome,
            lucro: lucro
        })
    }).then(function (res) {
        $("#select-origem").append(`<option value="null">Origem</option>`)
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        })
    })
}






// Função para colocar as origens no dropdown
function perquisarOrigens() {

    const dropdown = document.getElementById("select-origem")
    $("#select-origem").html(``)
    // Recebe a resposta enviada pela rota de pesquisa no banco de dados
    fetch("http://localhost:3303/selectOrigem", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        $("#select-origem").append(`<option value="null">Origem</option>`)
        res.json().then(function (data) {
            for (let i = 0; i < data.length; i++) {
                $("#select-origem").append('<option value="' + data[i].id + '">' + data[i].nome + '</option>');
            }
        })
    })
}


//Pegar ID da origem 
function getIdOrigem() {

    const origem = document.getElementById("origem").value;
    fetch("http://localhost:3303/getIdOrigem", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods': '*' },
        body: JSON.stringify({
            origem: origem,
        })
    }).then(function (res) {
        res.json().then(function (data) {
            return data.res.id;
        });

    });

}


// Função de cadastrar matéria prima
function cadastraMateriaPrima(event) {
    event.preventDefault()
    const nome = document.getElementById("nome").value;
    const origemId = document.getElementById("select-origem").value;
    const estoque_min = document.getElementById("estoque_min").value;
    const estoque_atual = document.getElementById("estoque_atual").value;
    const INCI_nome = document.getElementById("INCI_nome").value;
    let fornecedores = [];

    for (let cont = 0; cont < document.getElementsByClassName("linhaFornecedor").length; cont++) {
        if (window.getComputedStyle(document.getElementsByClassName("linhaFornecedor")[cont]).display != "none") {
            fornecedores.push({
                id: document.getElementsByClassName("fornecedor")[cont].value,
                preco: document.getElementsByClassName("preco")[cont].value,
                minQtd: document.getElementsByClassName("minQtd")[cont].value,
            })
        }
    }

    fetch("http://localhost:3303/cadastraMateriaPrima", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods': '*' },
        body: JSON.stringify({
            nome: nome,
            INCI_nome: INCI_nome,
            estoque_min: parseFloat(estoque_min.replace(",", ".")),
            estoque_atual: parseFloat(estoque_atual.replace(",", ".")),
            origemId: parseInt(origemId),
            fornecedores: fornecedores
        })
    })
    .then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        });
        window.alert(`Cadastrado com sucesso!`)
    });
}

function getMateriaPrima() {
    fetch("http://localhost:3303/listarMateriaPrima", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        res.json().then(function (data) {
            if (data.materiaPrima) {
                var listaItens = document.getElementById("materiaPrima")
                for (let cont = 0; cont < data.materiaPrima.length; cont++) {
                    if (data.materiaPrima[cont] != null)
                        listaItens.innerHTML += (`
                    <!-- CARD --> 
                    <div class="card text-dark col-md-3" onclick="fazModalMP(${data.materiaPrima[cont].id}, '${data.materiaPrima[cont].inci}', '${data.materiaPrima[cont].nome}', ${data.materiaPrima[cont].estoque}, ${data.materiaPrima[cont].minimo}, ${data.materiaPrima[cont].origem_id})" data-toggle="modal" data-target="#modal">
                        <img src="https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg" alt="img">
                        <div class="container">
                            <p>${data.materiaPrima[cont].nome}</p>
                            
                        </div>
                    </div>
                    `)
                }
            } else {
                window.alert(`${data.tipo} - ${data.mensagem}`)
            }

        });
    })
}

function filtraMateriaPrima(origem) {
    fetch("http://localhost:3303/filtrarMateriaPrima", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            origem: origem
        })
    }).then(function (res) {
        res.json().then(function (data) {
            if (data.materiaPrima) {
                var listaItens = document.getElementById("materiaPrima")
                listaItens.innerHTML=""
                for (let cont = 0; cont < data.materiaPrima.length; cont++) {
                    if (data.materiaPrima[cont] != null)
                        listaItens.innerHTML += (`
                    <!-- CARD --> 
                    <div class="card text-dark col-md-3" onclick="fazModalMP(${data.materiaPrima[cont].id}, '${data.materiaPrima[cont].inci}', '${data.materiaPrima[cont].nome}', ${data.materiaPrima[cont].estoque}, ${data.materiaPrima[cont].minimo}, ${data.materiaPrima[cont].origem_id})" data-toggle="modal" data-target="#modal">
                        <img src="https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg" alt="img">
                        <div class="container">
                            <p>${data.materiaPrima[cont].nome}</p>
                            
                        </div>
                    </div>
                    `)
                }
            } else {
                window.alert(`${data.tipo} - ${data.mensagem}`)
            }

        });
    })
}

async function fazModalMP(id, inci, nome, estoque, minimo, origem_id) {
    const f = await getMateriaPrimaFornecedor(id);
    conteudo = document.getElementsByClassName("modal-body")[0]
    conteudo.innerHTML = '<img src="https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg" alt="img"><div id="mBodyConteudo" class="w-50 p-3"></div>'
    conteudo = document.getElementById("mBodyConteudo")
    conteudo.innerHTML = ""
    conteudo.innerHTML += `
    <div class="row p-0 m-0 dados">
        <div class="col-12">
        <label for="modalINCI" class="mr-2">INCI:</label>
        <input type="text" value="${inci}" class="form-control campo" id="modalINCI">
        </div>
        <div class="col-12">
        <label for="modalNome" class="mr-2">Nome:</label>
        <input type="text" value="${nome}" class="form-control campo" id="modalNome">
        </div>
        <div class="col-4">
            <p>
            <label for="modalEstoque" class="mr-2 mt-3">Estoque:</label>
            <input type="text" value="${estoque}" class="form-control campo" id="modalEstoque">
            </p>
            <p>
            <label for="modalMinimo" class="mr-2">Estoque mínimo:</label>
            <input type="text" value="${minimo}" class="form-control campo" id="modalMinimo">
            </p>
        </div>
        <div class="col-8">
            <label for="observacao" class="mt-3">Observações(mudança do estoque):</label>
            <textarea class="form-control campo" id="observacao" name="observacao" rows="4" cols="40">
            </textarea>
        </div>
        <div class="col-12">
            <label for="modalOrigem" class="mr-2">Origem:</label>
            <input type="text" value="${getNomeOrigem(origem_id)}" class="form-control campo" id="modalOrigem" disabled>
        </div>
    </div>
              `
    if (f.fornecedores.length > 0)
        conteudo.innerHTML += '<p class="mt-2 ml-3">Fornecedores:</p>';
    for (let cont = 0; cont < f.fornecedores.length; cont++) {
        tel = ""
        if (f.fornecedores[cont].telefone)
            tel = `<p>${f.fornecedores[cont].telefone}</p>`
        mail = ""
        if (f.fornecedores[cont].email)
            mail = `<p>${f.fornecedores[cont].email}</p>`
        conteudo.innerHTML += `
              <div id="fAntigo-${cont}" class="row p-0 m-0 mt-2 pb-2 justify-content-between linhaHas">
                  <div class="col-5 mt-auto mb-auto fDados">
                      <div class="fornecedorId" style="display: none">${f.fornecedores[cont].id}</div>
                      <p>${f.fornecedores[cont].nome}</p>
                      ${tel}
                      ${mail}
                  </div>
                  <div class="col-6 row p-0 m-0 mt-auto mb-auto justify-content-around relacaoDados">
                      <p>Preco: <input type="text" value="R$${Number(f.fornecedores[cont].preco).toFixed(2)}" class="campo p-1 precoAntigo"></input></p>
                      <p>Mínimo: <input type="text" value="${f.fornecedores[cont].minQtd}" class="campo p-1 minAntigo"></input></p>
                  </div>
            <h3 class="col-1 mt-auto mb-auto" onclick="deleteMPHasF(${id},${f.fornecedores[cont].id},${cont})"><i class="bi bi-x-square"></i></h3>
        </div>
        `}
    conteudo.innerHTML += `
    <label>Novo Fornecedor:</label>
    <div class="row m-0 p-0 pb-3 justify-content-between">
        <button type="button" class="add form-control col-sm-6" onclick="adicionaFornecedor(event)">+ Adicionar Fornecedor</button>
        <button type="button" class="add form-control col-sm-6" id="open-modal">+ Novo fornecedor</button>
    </div>
    <div id="fornecedores" class="row m-0 p-0">
        
    </div>
    `
    botoes = document.getElementsByClassName("modal-footer")[0]
    document
    botoes.innerHTML = `<button onclick="updateMateriaPrima(${id})" type="button" class="form-control">Alterar</button>
    <button onclick="deleteMateriaPrima(${id})" class="form-control">Deletar</button>`

    botoes = document.getElementsByClassName("modal-footer")[0]
    document
    botoes.innerHTML = `<button onclick="updateMateriaPrima(${id})" type="button" class="form-control">Alterar</button>
              <button onclick="deleteMateriaPrima(${id})" class="form-control">Deletar</button>`

}


function getNomeOrigem(id) {
    if (id == 1) {
        return "Vegetal";
    } else if (id == 2) {
        return "Mineral";
    } else if (id == 3) {
        return "Animal";
    } else if (id == 4) {
        return "Silicone";
    }
}

function getIdOrigem(nome_origem) {

    if (nome_origem == "Vegetal") {
        return 1;
    } else if (nome_origem == "Mineral") {
        return 2;
    } else if (nome_origem == "Animal") {
        return 3;
    } else if (nome_origem == "Silicone") {
        return 4;
    }
}

function updateMateriaPrima(id) {
    fornecedorELS(id)

    nome = document.getElementById("modalNome").value
    inci = document.getElementById("modalINCI").value
    estoque = document.getElementById("modalEstoque").value
    minimo = document.getElementById("modalMinimo").value
    nome_origem = document.getElementById("modalOrigem").value
    origem_id = getIdOrigem(nome_origem)

    fetch("http://localhost:3303/updateMateriaPrima", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id,
            nome: nome,
            inci: inci,
            estoque: estoque,
            minimo: minimo,
            origem_id: origem_id,
            fornecedores: JSON.parse(localStorage.getItem("insertFornecedores"))
        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
            if (data.s) {
                localStorage.removeItem("insertFornecedores")
            }
            location.reload()
        })
    })
}

function updateFornecedorMP() {
    var f = localStorage.getItem("updateFornecedores")
    if (!f)
        return console.log("Sem dados de fornecedor para alterar")
    f = JSON.parse(f)
    fetch("http://localhost:3303/updateFornecedorMP", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            MP_id: f.insumo_id,
            fornecedores: f.fornecedores
        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
            if (data.s) {
                localStorage.removeItem("updateFornecedores")
            }
        })
    })
}

async function getMateriaPrimaFornecedor(materiaPrima_id) {
    var response = await fetch("http://localhost:3303/listarFornecedoresMP", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            materiaPrima_id: materiaPrima_id,
        })
    })
    var data = await response.json()
    return data
}

function deleteMateriaPrima(id) {
    fetch("http://localhost:3303/deleteMateriaPrima", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id,
        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        })
    })
}

function deleteMPHasF(materiaPrima_id, fornecedor_id, linha) {
    fetch("http://localhost:3303/deleteMPHasF", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            materiaPrima_id: materiaPrima_id,
            fornecedor_id: fornecedor_id
        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
            document.getElementById(`fAntigo-${linha}`).setAttribute('style', 'display:none');
        })
    })
}

function selectMateriasPrimas() {

    document.getElementById("embalagem-0").innerHTML = ``
    fetch("http://localhost:3303/selectMateriasPrimas", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        document.getElementById("embalagem-0").append(`<option value="null">Matéria prima</option>`)
        res.json().then(function (data) {
            for (let i = 0; i < data.length; i++) {
                document.getElementById("embalagem-0").append('<option value="' + data[i].id + '">' + data[i].nome + '</option>');
            }
        })
    })
}

function getRotulo() {
    fetch("http://localhost:3303/listarRotulo", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        res.json().then(function (data) {
            if (data.rotulo) {
                var listaItens = document.getElementById("rotulo")
                for (let cont = 0; cont < data.rotulo.length; cont++) {
                    if (data.rotulo[cont] != null)
                        listaItens.innerHTML += (`
                    <!-- CARD --> 
                    <div class="card text-dark col-md-3" onclick="fazModalRotulo(${data.rotulo[cont].id}, '${data.rotulo[cont].tipo}', ${data.rotulo[cont].principal}, '${data.rotulo[cont].nome}', ${data.rotulo[cont].produto_id}, ${data.rotulo[cont].estoque}, ${data.rotulo[cont].minimo})" data-toggle="modal" data-target="#modal">
                        <img src="https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg" alt="img">
                        <div class="container">
                            <p>${data.rotulo[cont].nome}</p>
                            
                        </div>
                    </div>
                    `)
                }
            } else {
                window.alert(`${data.tipo} - ${data.mensagem}`)
            }

        });
    })
}

async function getRotuloFornecedor(id_rotulo) {

    var response = await fetch("http://localhost:3303/listarFornecedoresRotulo", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            rotulo_id: id_rotulo,
        })
    })
    var data = await response.json()
    return data
}


async function fazModalRotulo(id, tipo, principal, nome, produto_id, estoque, minimo) {

    const f = await getRotuloFornecedor(id);

    var tipoInner
    if (tipo == 1) {
        tipoInner = "checked"
    } else {
        tipoInner = "unchecked"
    }


    var principalInner
    if (principal == 1) {
        principalInner = "checked"
    } else {
        principalInner = "unchecked"
    }

    console.log(tipoInner)
    console.log(principalInner)

    conteudo = document.getElementsByClassName("modal-body")[0]
    conteudo.innerHTML = '<img src="https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg" alt="img"><div id="mBodyConteudo" class="w-50 p-3"></div>'
    conteudo = document.getElementById("mBodyConteudo")
    conteudo.innerHTML = ""
    conteudo.innerHTML += `
    <div class="row p-0 m-0 dados">
        <p class="col-12">
            <label for="modalNome" class="mr-2">Nome:</label>
            <input type="text" value="${nome}" class="form-control campo" id="modalNome">
        </p>
        <p class="col-12">
        <label for="modalTipo" class="mr-2">Rotulo</label>
            <label class="switch">
                <input id="tipo" type="checkbox" ${tipoInner} data-toggle="toggle" data-onstyle="primary"
                    data-offstyle="secondary" data-on="Principal" data-off="Secundario"
                    onchange="innerHtmlPrecoCusto()">
                <span class="slider round"></span>
            </label>
        <label for="modalTipo" class="mr-2">Contra Rotulo</label>
        </p>
        <p class="col-12">
            <label for="modalPrincipal" class="mr-2">Principal:</label>
                <label class="switch ml-5">
                    <input id="principal" type="checkbox" ${principalInner} data-toggle="toggle" data-onstyle="primary" data-offstyle="secondary" data-on="Principal" data-off="Secundario">
                    
                    <span class="slider round"></span>
                </label>
        </p>
        <div class="row m-0 p-0">
            <div class="col-4 m-0 p-0">
                <label for="modalEstoque" class="mr-2 mt-3">Estoque:</label>
                <input type="text" value="${estoque}" class="form-control campo" id="modalEstoque">
                <label for="modalMinimo" class="mr-2 mt-3">Mínimo:</label>
                <input type="text" value="${minimo}" class="form-control campo" id="modalMinimo">
            </div>
            <div class="col-8 m-0 p-0">
                <label for="observacao" class="mt-3">Observações(mudança do estoque):</label>
                <textarea class="form-control campo" id="observacao" name="observacao" rows="4" cols="40"></textarea>
            </div>
        </div>
    </div>`

    if (f.fornecedores.length > 0)
        conteudo.innerHTML += '<p class="mt-4">Fornecedores:</p>';
    for (let cont = 0; cont < f.fornecedores.length; cont++) {
        tel = ""
        if (f.fornecedores[cont].telefone)
            tel = `<p>${f.fornecedores[cont].telefone}</p>`
        mail = ""
        if (f.fornecedores[cont].email)
            mail = `<p>${f.fornecedores[cont].email}</p>`
        conteudo.innerHTML += `
                          <div id="fAntigo-${cont}" class="row p-0 m-0 mt-2 pb-2 justify-content-between linhaHas">
                              <div class="col-5 mt-auto mb-auto fDados">
                                  <div class="fornecedorId" style="display: none">${f.fornecedores[cont].id}</div>
                                  <p>${f.fornecedores[cont].nome}</p>
                                  ${tel}
                                  ${mail}
                              </div>
                              
                              <div class="col-6 row p-0 m-0 mt-auto mb-auto justify-content-around relacaoDados">
                                  <p>Preco: <input type="text" value="R$${Number(f.fornecedores[cont].preco).toFixed(2)}" class="campo p-1 precoAntigo"></input></p>
                                  <p>Mínimo: <input type="text" value="${f.fornecedores[cont].minQtd}" class="campo p-1 minAntigo"></input></p>
                              </div>
                              
                              <h3 class="col-1 mt-auto mb-auto fDelete" onclick="deleteFornecedorRotulo(${id},${f.fornecedores[cont].id},${cont})"><i class="bi bi-x-square"></i></h3>
                          </div>
                          `
    }

    conteudo.innerHTML += `
                              <label>Novo Fornecedor:</label>
                              <div class="row m-0 p-0 pb-3 justify-content-between">
                              <button type="button" class="add form-control col-sm-6" onclick="adicionaFornecedor(event)">+ Adicionar Fornecedor</button>
                              <button type="button" class="add form-control col-sm-6" id="open-modal">+ Novo fornecedor</button>
                              </div>
                              <div id="fornecedores" class="row m-0 p-0">
      
                              </div>
                              `

    botoes = document.getElementsByClassName("modal-footer")[0]
    botoes.innerHTML = `<button type="button" class="form-control" onclick="updateRotulo(${id})">Alterar</button>
                              <button class="form-control" onclick="deleteRotulo(${id})">Deletar</button>`

}



function deleteFornecedorRotulo(r_id, f_id, linha) {
    if (confirm("Deseja mesmo deletar esse fornecedor?")) {
        fetch("http://localhost:3303/deleteFornecedorRotulo", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                r_id: Number(r_id),
                f_id: Number(f_id)
            })
        }).then(function (res) {
            res.json().then(function (data) {
                window.alert(`${data.tipo} - ${data.mensagem}`)
                if (data.s) {
                    console.log(linha)
                    document.getElementById(`fAntigo-${linha}`).setAttribute('style', 'display:none');
                }
            })
        })
    }
}



function updateRotulo(id) {
    fornecedorELS(id);

    var nome = document.getElementById("modalNome").value
    var estoque = document.getElementById("modalEstoque").value
    var minimo = document.getElementById("modalMinimo").value

    var tipo
    if (document.getElementById("tipo").checked) {
        tipo = 1;
    } else {
        tipo = 0;
    }
    var principal
    if (document.getElementById("principal").checked) {
        principal = 1;
    } else {
        principal = 0;
    }

    console.log(tipo)
    console.log(principal)


    //origem_id = getIdOrigem(nome_origem)

    fetch("http://localhost:3303/updateRotulo", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id,
            nome: nome,
            tipo: tipo,
            principal: principal,
            estoque: estoque,
            minimo: minimo,
            fornecedores: JSON.parse(localStorage.getItem("insertFornecedores"))
        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
            if (data.s) {

                localStorage.removeItem("insertFornecedores")
            }
            location.reload()
        })
    })
}



//Função guarda informaçoes do rotulo no local storage
function guardaRotulo(event) {
    event.preventDefault()
    console.log("tamo aki")
    let rotulos = []
    if (localStorage.getItem('rotuloData')) {
        rotulos = JSON.parse(localStorage.getItem('rotuloData'))
    }
    var nome = document.getElementById("nome").value;
    var estoque = document.getElementById("estoque").value;
    var minimo = document.getElementById("minimo").value;
    var tipo
    var maxPreco = 0
    if (document.getElementById("tipo").checked) {
        tipo = 1;
    } else {
        tipo = 0;
    }
    var principal
    if (document.getElementById("principal").checked) {
        principal = 1;
    } else {
        principal = 0;
    }
    let fornecedores = [];

    for (let cont = 0; cont < document.getElementsByClassName("linhaFornecedor").length; cont++) {
        if (window.getComputedStyle(document.getElementsByClassName("linhaFornecedor")[cont]).display != "none") {
            if (document.getElementsByClassName("preco")[cont].value > maxPreco)
                maxPreco = document.getElementsByClassName("preco")[cont].value;
            fornecedores.push({
                id: document.getElementsByClassName("fornecedor")[cont].value,
                preco: document.getElementsByClassName("preco")[cont].value,
                minQtd: document.getElementsByClassName("minQtd")[cont].value,
            })

        }
    }

    var rotuloData = {
        principal: principal,
        nome: nome,
        tipo: tipo,
        preco: maxPreco,
        estoque: estoque,
        minimo: minimo,
        fornecedores: fornecedores
    };
    rotulos.push(rotuloData);
    localStorage.setItem('rotuloData', JSON.stringify(rotulos));
}

function updateDadosProduto(classe, localItem) {
    var dados = JSON.parse(localStorage.getItem(`${localItem}`));
    if (!dados) {
        return console.log("Sem informações no localStorage")
    }
    var tags = document.getElementsByClassName(`${classe}`);
    for (let cont = 0; cont < tags.length; cont++) {
        if (window.getComputedStyle(tags[cont]).display == "none") {
            dados.splice(cont, 1);
        }

    }
    localStorage.setItem(`${localItem}`, JSON.stringify(dados))
}

// Função de cadastrar rótulo
function cadastrarRotulos(produto) {

    var dados = (localStorage.getItem("rotuloData"))
    if (!dados) {
        return console.log("Dados de rótulo não encontrados");
    }
    var id_produto = (localStorage.getItem("produtoId"))
    if (produto)
        id_produto = produto;
    if (!id_produto) {
        return console.log("Identificador do produto não encontrado");
    }

    dados = JSON.parse(dados)
    id_produto = JSON.parse(id_produto)
    console.log("passsei aki")
    fetch("http://localhost:3303/cadastrarRotulo", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id_produto,
            rotulos: dados
        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
            if (data.s) {
                localStorage.removeItem("rotuloData")
            }
        })
    })
}

function cadastrarRotuloHasFornecedor() {
    var fornecedor = document.querySelector("#fornecedor-0")
    var preco = document.querySelector("#preco-0")
    var preco = document.querySelector("#minQtd-0")

    fetch("http://localhost:3303/cadastrarRotuloHasFornecedor", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            rotulos: dados,
            produto_id: parseInt(id_produto)
        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
            if (data.s) {
                localStorage.removeItem('rotuloData')
            }
        });
    })
}

//Adicionar fornecedor
function adicionaFornecedor(event) {
    let tamanho = document.getElementsByClassName("linhaFornecedor").length;
    event.preventDefault()
    document.getElementById("fornecedores").insertAdjacentHTML('beforeend', `
    <div id="${tamanho}" class="row p-0 m-0 linhaFornecedor">
                <div class="col-sm-5 pl-0">
                    <label for="fornecedor-${tamanho}">Selecione o Fornecedor:</label>
                    <select name="fornecedor-${tamanho}" id="fornecedor-${tamanho}" class="form-control campo fornecedor select-fornecedor">
                        <option value="0">Fornecedor</option>
                        <option value="1">Fornecedor 1</option>
                        <option value="2">Fornecedor 2</option>
                        <option value="3">Fornecedor 3</option>
                        <option value="4">Fornecedor 4</option>
                    </select>
                </div>
                <div class="col-sm-3">
                    <label for="preco-${tamanho}">Preco:</label>
                    <input type="text" class="form-control campo preco" id="preco-${tamanho}">
                </div>
                <div class="col-sm-4 row m-0 p-0">
                    <div class="col-sm-10 justify-content-between">
                        <label for="minQtd-${tamanho}">Quantidade Mínima:</label>
                        <input type="text" class="form-control campo minQtd" id="minQtd-${tamanho}">
                    </div>
                    <h3 class="mt-auto col-sm-2 p-0 m-0" onclick="removerFornecedor(${tamanho})"><i class="bi bi-x-square"></i></h3>
                </div>
            </div>`)
    selectFornecedores(tamanho);
}

function removerFornecedor(i) {
    document.getElementById(i).setAttribute('style', 'display:none');
}

// Função de cadastrar nova embalagem
function cadastrarEmbalagem(event) {

    event.preventDefault()

    var nome = document.getElementById("nomeDaEmbalagem").value;
    var tamanho = document.getElementById("mililitragemDaEmbalagem").value;
    var select = document.getElementById('tipoEmbalagem');
    var estoque = document.getElementById("estoque").value;
    var minimo = document.getElementById("minimo").value;
    var value = select.options[select.selectedIndex].value;
    let fornecedores = [];

    for (let cont = 0; cont < document.getElementsByClassName("linhaFornecedor").length; cont++) {
        if (window.getComputedStyle(document.getElementsByClassName("linhaFornecedor")[cont]).display != "none") {
            fornecedores.push({
                id: document.getElementsByClassName("fornecedor")[cont].value,
                preco: document.getElementsByClassName("preco")[cont].value,
                minQtd: document.getElementsByClassName("minQtd")[cont].value,
            })
        }
    }

    if (value == 0) {
        return window.alert("Selecione um tipo")
    } else {

        fetch("http://localhost:3303/cadastraEmbalagem", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({

                nome: nome,
                value: value,
                tamanho: tamanho,
                estoque: estoque,
                minimo: minimo,
                fornecedores: fornecedores

            })
        }).then(function (res) {
            res.json().then(function (data) {
                if (data.tipo) {
                    window.alert(`${data.mensagem}`)
                    console.log(data.mensagem), JSON.stringify()
                }
            });
        });
    };
}



// Função para colocar as origens no dropdown
function selectFornecedores(indice) {
    // Recebe a resposta enviada pela rota de pesquisa no banco de dados
    fetch("http://localhost:3303/selectFornecedores", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {

        $("#select-pessoa").append(`<option value="null">fornecedor1</option>`)
        res.json().then(function (data) {

            document.getElementById(`fornecedor-${indice}`).innerHTML = `<option value="0">Fornecedor</option>`

            for (let i = 0; i < data.arrayFornecedor.length; i++) {

                document.getElementById(`fornecedor-${indice}`).innerHTML += ('<option value="' + data.arrayFornecedor[i].id + '">' + data.arrayFornecedor[i].nome + '</option>');
            }
        })
    })
}

function cadastrarFornecedor(event) {

    event.preventDefault()

    var nomeFor = document.getElementById("nomeFornecedor").value;
    var emailFor = document.getElementById("emailFornecedor").value;
    var telFor = document.getElementById("telFornecedor").value;

    console.log(nomeFor);
    console.log(emailFor);
    console.log(telFor);

    if (nomeFor == null && emailFor == null && telFor == null) {
        window.alert("Preencha os campos")
    } else {

        {

            fetch("http://localhost:3303/cadastraFornecedor", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({

                    nome: nomeFor,
                    email: emailFor,
                    telefone: telFor


                })
            }).then(function (res) {
                res.json().then(function (data) {
                    if (data.tipo) {
                        window.alert(`${data.mensagem}`)
                        console.log(data.mensagem), JSON.stringify()
                    }
                });

            });
        };

    }
}


async function getRotulos() {

    var response = await fetch('http://localhost:3303/selectRotulo')
    var data = await response.json()

    return data
}

/*
async function getEmbalagens() {       
 
    var response = await fetch('http://localhost:3303/selectEmbalagem')
    var data = await response.json()
 
    return data
}
*/
async function getFormulas() {


    const response = await fetch('http://localhost:3303/selectFormula')
    const data = await response.json()

    return data
}









//VITOR MOICANO
//=======================================================================================================================================================================================================================================================================================
//=======================================================================================================================================================================================================================================================================================
//=======================================================================================================================================================================================================================================================================================


//Modal
const openModalButton = document.querySelector("#open-modal");
const closeModalButton = document.querySelector("#close-modal");
const modal = document.querySelector("#modal");
const fade = document.querySelector("#fade");
const toggleModal = () => {
    modal.classList.toggle("hide");
    fade.classList.toggle("hide");
};

[openModalButton, closeModalButton, fade].forEach((el) => {
    el.addEventListener("click", () => toggleModal());
});


//Achar os fellas e colocar nos cards
function acharFornecedores() {


    fetch("http://localhost:3303/selectFornecedores", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        res.json().then(function (data) {
            if (data.arrayFornecedor) {
                var listaItens = document.getElementById("cards-html")
                listaItens.innerHTML = ""
                for (let i = 0; i < data.arrayFornecedor.length; i++) {
                    listaItens.innerHTML += (
                        `<div class="card col-3 p-4">

                <div class="cabecalho-card">
                <label class="nome-fornecedor titulo-card" id="fornecedor-nome"> ${data.arrayFornecedor[i].nome} </label>
                <label class="email-fornecedor info-secundaria" id="fornecedor-email">Email: ${data.arrayFornecedor[i].email}  </label>
                <label class="telefone-fornecedor info-secundaria" id="fornecedor-tel">Telefone: ${data.arrayFornecedor[i].telefone} </label>
                </div>
                <div class="btn-card mt-auto">
                <button class="form-control infoMais" id="open-modal" data-toggle="modal" data-target="#modal" onclick="setModalFornecedores(${data.arrayFornecedor[i].id},'${data.arrayFornecedor[i].nome}','${data.arrayFornecedor[i].email}','${data.arrayFornecedor[i].telefone}')"><i class="bi bi-plus mt-auto mb-auto"></i>Informações</button>
                </div>`
                    )
                }
            } else {
                window.alert(`deu não ;-;`)
            }

        });
    })

};




//////////////////////////////////////////////////////////////////////////////////////////////////
/*function acharFornecedores() {
 
            });
        })
 
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    /*function acharFornecedores() {
    
    
        $("#cards-html").html(``)
        // Recebe a resposta enviada pela rota de pesquisa no banco de dados
        fetch("http://localhost:3303/selectFornecedores", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        }).then(function (res) {
            $("#cards-html").append(`<div class="cards row p-0 m-0"><div/>`)
            res.json().then(function (data) {
                for (let i = 0; i < data.length; i++) {
                    $("#cards-html").append(`<div class="card col-3 p-4">
                    <div class="cabecalho-card">
                    <label class="nome-fornecedor titulo-card" id="fornecedor-nome">` + data[i].nome + `</label>
                    <label class="email-fornecedor info-secundaria" id="fornecedor-email">Email:` + data[i].email + `</label>
                    <label class="telefone-fornecedor info-secundaria" id="fornecedor-tel">Telefone: ` + data[i].telefone + `</label>
                    </div>
                    <div class="btn-card mt-auto">
                    <button class="form-control infoMais" id="open-modal"><i class="bi bi-plus"></i>Informações</button>
                    </div>`
                    );
                }
            })
        })
    }*/

//Colocar no card as informações do que cada fella vende
function acharVendaFornecedores() {


    $("#info-card").html(``)
    // Recebe a resposta enviada pela rota de pesquisa no banco de dados
    fetch("http://localhost:3303/selectFornecedores", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        $("#info-card").append(`<div class="cards row p-0 m-0"><div/>`)
        res.json().then(function (data) {
            for (let i = 0; i < data.length; i++) {
                $("#info-card").append('<label class="info-fornecedor" id="conteudo-vendido">Vende: Materia prima3</label>');
            }
        })
    })
}



function deleteFornecedor(id) {
    if (confirm("Deseja mesmo deletar esse forncedor?")) {
        fetch("http://localhost:3303/deleteFornecedor", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        }).then(function (res) {
            $("#cards-html").append(`<div class="cards row p-0 m-0"><div/>`)
            res.json().then(function (data) {
                for (let i = 0; i < data.length; i++) {
                    $("#cards-html").append('<div class="card col-3 p-4"><div class="cabecalho-card"><label class="nome-fornecedor titulo-card" id="fornecedor-nome">' + data[i].nome + '</label><label class="email-fornecedor info-secundaria" id="fornecedor-email">Email:' + data[i].email + '</label><label class="telefone-fornecedor info-secundaria" id="fornecedor-tel">Telefone: ' + data[i].telefone + '</label></div><div class="info-card"><label class="info-fornecedor" id="conteudo-vendido">Vende: Materia prima1</label><label class="info-fornecedor" id="conteudo-vendido">Vende: Materia prima2</label><label class="info-fornecedor" id="conteudo-vendido">Vende: Materia prima3</label><label class="info-fornecedor" id="conteudo-vendido">Vende: Materia prima3</label></div><div class="btn-card mt-auto"><button class="form-control infoMais" id="open-modal"><i class="bi bi-plus"></i>Informações</button></div>');
                }
            })
        })
    }
}


function deleteFornecedor(id) {
    if (confirm("Deseja mesmo deletar esse forncedor?")) {
        fetch("http://localhost:3303/deleteFornecedor", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: Number(id),
            })
        }).then(function (res) {
            res.json().then(function (data) {
                window.alert(`${data.tipo} - ${data.mensagem}`)
            })
        })
    }
}






//=============================================================================================

//=============================================================================================
async function getFornecedorEmbalagens(id_produto) {
    var response = await fetch("http://localhost:3303/listarFormulas", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            restricao: `where produto_id = ${id_produto}`,
        })
    })
}
//=============================================================================================
async function getFornecedorEmbalagem(fornecedor_id) {
    var response = await fetch("http://localhost:3303/listarFornecedorEmbalagens", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fornecedor_id: Number(fornecedor_id),
        })
    })
    var data = await response.json()
    return data
}

async function getFornecedorRotulo(fornecedor_id) {
    var response = await fetch("http://localhost:3303/listarFornecedorRotulo", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fornecedor_id: Number(fornecedor_id),
        })

    })
    var data = await response.json()
    return data
}


async function getFornecedorMateriaPrima(fornecedor_id) {
    var response = await fetch("http://localhost:3303/listarFornecedorMateriaPrima", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fornecedor_id: Number(fornecedor_id),
        })
    })
    var data = await response.json()
    return data
}
//=============================================================================================
//=============================================================================================


async function setModalFornecedores(id, nome, gmail, telefone) {
    const materiaPrima = await getFornecedorMateriaPrima(id);
    const rotulo = await getFornecedorRotulo(id);
    const embalagem = await getFornecedorEmbalagem(id);

    console.log(id)


    console.log(JSON.stringify(materiaPrima))
    conteudo = document.getElementsByClassName("modal-body")[0]
    conteudo.innerHTML = `
    <div>
        <div class="nome-fornecedor">            
            <label for="modalLucro" class="mr-2">Nome do fornecedor:</label>
            <input type="text" class="form-control campo" id="nome_forn" required>
        </div>
        <div class="email-fornecedor">            
            <label for="modal_titulo" class="mr-2">Email:</label>
            <input type="text" class="modal-title form-control campo" id="email_forn"></input>
        </div>
        <div class="telefone-fornecedor">            
            <label for="modal_titulo" class="mr-2">Telefone:</label>
            <input type="text" class="modal-title form-control campo" id="telefone_forn"></input>
        </div>
    </div>
    <div id="mBodyConteudo" class="w-50 p-3"></div>
    `
    document.getElementById("nome_forn").value = nome
    document.getElementById("email_forn").value = gmail
    document.getElementById("telefone_forn").value = telefone

    conteudo = document.getElementById("mBodyConteudo")
    if (materiaPrima.fornecedores.length > 0)
        conteudo.innerHTML += '<p>Materia prima vendida:</p>';
    for (let cont = 0; cont < materiaPrima.fornecedores.length; cont++) {
        principal = ""


        conteudo.innerHTML += `
        <div class="row p-0 m-0 justify-content-between">
            <p>Nome: ${materiaPrima.fornecedores[cont].nome} | Valor: ${materiaPrima.fornecedores[cont].preco}R$</p>
            <h3 class="mt-auto" onclick="deleteFRelacaoMP(${materiaPrima.fornecedores[cont].id})"><i class="bi bi-x-square"></i></h3>
        </div>
        `
    }

    if (rotulo.fornecedores.length > 0)

        conteudo.innerHTML += '<p>Rotulos vendidos:</p>';
    for (let cont = 0; cont < rotulo.fornecedores.length; cont++) {
        principal = ""

        conteudo.innerHTML += `
            <div class="row p-0 m-0 justify-content-between">
                <p>Nome: ${rotulo.fornecedores[cont].nome} | Valor: ${rotulo.fornecedores[cont].preco}R$</p>
                <h3 class="mt-auto" onclick="deleteFRelacaoR(${rotulo.fornecedores[cont].id})"><i class="bi bi-x-square"></i></h3>
            </div>
            `
    }

    if (embalagem.fornecedores.length > 0)
        conteudo.innerHTML += '<p>Embalagens vendidas:</p>';
    for (let cont = 0; cont < embalagem.fornecedores.length; cont++) {
        principal = ""

        conteudo.innerHTML += `
        <div class="row p-0 m-0 justify-content-between">
            <p>Nome: ${embalagem.fornecedores[cont].nome}${principal} | Valor: ${embalagem.fornecedores[cont].preco}R$</p>
            <h3 class="mt-auto" onclick="deleteFRelacaoE(${embalagem.fornecedores[cont].id})"><i class="bi bi-x-square"></i></h3>
        </div>
        `
    }

    botoes = document.getElementsByClassName("modal-footer")[0]
    botoes.innerHTML = `<button type="button" class="form-control" onclick="updateFornecedor(${id})">Alterar</button>
    <button class="form-control" onclick="deleteFornecedor(${id})">Deletar</button>`

}

//=======================================================================================================================================================================================================================================================================================
//=======================================================================================================================================================================================================================================================================================
//=======================================================================================================================================================================================================================================================================================

function getEmbalagens() {
    fetch("http://localhost:3303/listarEmbalagens", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        res.json().then(function (data) {
            if (data.embalagens) {
                var listaItens = document.getElementById("embalagens")
                listaItens.innerHTML = ""
                let tam
                let tipo
                for (let cont = 0; cont < data.embalagens.length; cont++) {
                    tam = ""
                    switch (data.embalagens[cont].tipo) {
                        case 1:
                            tipo = "Tampa"
                            break;
                        case 2:
                            tipo = "Válvula"
                            break;
                        case 3:
                            tipo = "Pote"
                            break;
                        case 4:
                            tipo = "Frasco"
                            break;
                        default:
                            tipo = "Pote"
                            break;
                    }
                    if (data.embalagens[cont].tamanho != null)
                        tam = `Tamanho: ${data.embalagens[cont].tamanho}`
                    listaItens.innerHTML += (`
                    <!-- CARD --> 
                    <div class="card text-dark col-md-3" data-toggle="modal" data-target="#modal" onclick="setModalEmbalagem(${data.embalagens[cont].id},'${data.embalagens[cont].nome}',${data.embalagens[cont].tipo},'${data.embalagens[cont].tamanho}',${data.embalagens[cont].estoque},${data.embalagens[cont].minimo})">
                        <img src="https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg" alt="img">
                        <div class="container">
                            <p>${data.embalagens[cont].nome}</p>
                            <p>${tipo}</p>
                            <p>${tam}</p>
                        </div>
                    </div>
                    `)
                }
            } else {
                window.alert(`${data.tipo} - ${data.mensagem}`)
            }
        })

    })

}

async function getEmbalagemFornecedor(id_embalagem) {
    var response = await fetch("http://localhost:3303/listarFornecedoresE", {


        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            embalagem_id: id_embalagem,
        })
    })
    var data = await response.json()
    return data
}

function deleteEmbalagemFornecedor(e_id, f_id, linha) {
    if (confirm("Deseja mesmo deletar esse fornecedor?")) {
        fetch("http://localhost:3303/deleteFornecedorE", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                e_id: Number(e_id),
                f_id: Number(f_id)
            })
        }).then(function (res) {
            res.json().then(function (data) {
                window.alert(`${data.tipo} - ${data.mensagem}`)
                if (data.s) {
                    console.log(linha)
                    document.getElementById(`fAntigo-${linha}`).setAttribute('style', 'display:none');
                }
            })
        })
    }
}


async function setModalEmbalagem(id, nome, tipo, tamanho, estoque, minimo) {
    const f = await getEmbalagemFornecedor(id);

    document.getElementById("modal_titulo").value = nome
    conteudo = document.getElementsByClassName("modal-body")[0]
    conteudo.innerHTML = `<img src="https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg" alt="img">
    <div id="mBodyConteudo" class="w-50 p-3"></div>`


    let tel
    let mail
    let tampa = `<option value="1">Tampa</option>`
    let valvula = `<option value="2">Válvula</option>`
    let pote = `<option value="3">Pote</option>`
    let frasco = `<option value="4">Frasco</option>`

    switch (tipo) {
        case 1:
            tampa = `<option value="1" selected>Tampa</option>`
            break;
        case 2:
            valvula = `<option value="2" selected>Válvula</option>`
            break;
        case 3:
            pote = `<option value="3" selected>Pote</option>`
            break;
        case 4:
            frasco = `<option value="4" selected>Frasco</option>`
            break;
        default:
            pote = `<option value="3" selected>Pote</option>`
            break;
    }

    conteudo = document.getElementById("mBodyConteudo")
    conteudo.innerHTML = `
    <label for="mililitragemDaEmbalagem">Quantidade:</label>
    <input type="text" class="form-control campo" id="mililitragemDaEmbalagem" value="${tamanho}ml">

    <label for="tipoEmbalagem">Tipo:</label>
    <select type="text" class="form-control campo" id="tipoEmbalagem">
        <option value="0" selected disabled>Embalagem</option> <!-- nn pode colocar 0 -->
        ${tampa}
        ${valvula}
        ${pote}
        ${frasco}
    </select>

    <div class="row m-0 p-0">
        <div class="col-4 m-0 p-0">
            <label for="modalEstoque" class="mr-2 mt-3">Estoque:</label>
            <input type="text" value="${estoque}" class="form-control campo" id="modalEstoque">
            <label for="modalMinimo" class="mr-2 mt-3">Mínimo:</label>
            <input type="text" value="${minimo}" class="form-control campo" id="modalMinimo">
        </div>
        <div class="col-8 m-0 p-0">
            <label for="observacao" class="mt-3">Observações(mudança do estoque):</label>
            <textarea class="form-control campo" id="observacao" name="observacao" rows="4" cols="40">            </textarea>
        </div>
    </div>
    `
    if (f.fornecedores.length > 0)
        conteudo.innerHTML += '<p class="mt-4">Fornecedores:</p>';
    for (let cont = 0; cont < f.fornecedores.length; cont++) {
        tel = ""
        if (f.fornecedores[cont].telefone)
            tel = `<p>${f.fornecedores[cont].telefone}</p>`
        mail = ""
        if (f.fornecedores[cont].email)
            mail = `<p>${f.fornecedores[cont].email}</p>`
        conteudo.innerHTML += `
        <div id="fAntigo-${cont}" class="row p-0 m-0 mt-2 pb-2 justify-content-between linhaHas">
            <div class="col-5 mt-auto mb-auto fDados">
                <div class="fornecedorId" style="display: none">${f.fornecedores[cont].id}</div>
                <p>${f.fornecedores[cont].nome}</p>
                ${tel}
                ${mail}
            </div>
            
            <div class="col-6 row p-0 m-0 mt-auto mb-auto justify-content-around relacaoDados">
                <p>Preco: <input type="text" value="R$${Number(f.fornecedores[cont].preco).toFixed(2)}" class="campo p-1 precoAntigo"></input></p>
                <p>Mínimo: <input type="text" value="${f.fornecedores[cont].minQtd}" class="campo p-1 minAntigo"></input></p>
            </div>
            
            <h3 class="col-1 mt-auto mb-auto fDelete" onclick="deleteEmbalagemFornecedor(${id},${f.fornecedores[cont].id},${cont})"><i class="bi bi-x-square"></i></h3>
        </div>
        `
    }

    conteudo.innerHTML += `
    <label>Novo Fornecedor:</label>
    <div class="row m-0 p-0 pb-3 justify-content-between">
        <button type="button" class="add form-control col-sm-6" onclick="adicionaFornecedor(event)">+ Adicionar Fornecedor</button>
        <button type="button" class="add form-control col-sm-6" id="open-modal">+ Novo fornecedor</button>
    </div>
    <div id="fornecedores" class="row m-0 p-0">
        
    </div>
    `

    botoes = document.getElementsByClassName("modal-footer")[0]
    botoes.innerHTML = `<button type="button" class="form-control" onclick="updateEmbalagem(${id})">Alterar</button>
    <button class="form-control" onclick="deleteEmbalagem(${id})">Deletar</button>`

}

function deleteEmbalagem(id) {
    fetch("http://localhost:3303/deleteEmbalagem", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id,
        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        })
    })
}

function fornecedorELS(id) {
    let maxPreco = 0
    let fAntigos = [];

    for (let cont = 0; cont < document.getElementsByClassName("linhaHas").length; cont++) {
        if (window.getComputedStyle(document.getElementsByClassName("linhaHas")[cont]).display != "none") {
            if (document.getElementsByClassName("precoAntigo")[cont].value > maxPreco)
                maxPreco = document.getElementsByClassName("precoAntigo")[cont].value;
            fAntigos.push({
                id: document.getElementsByClassName("fornecedorId")[cont].innerHTML,
                preco: document.getElementsByClassName("precoAntigo")[cont].value,
                minQtd: document.getElementsByClassName("minAntigo")[cont].value,
            })
        }
    }

    let fNovos = [];

    for (let cont = 0; cont < document.getElementsByClassName("linhaFornecedor").length; cont++) {
        if (window.getComputedStyle(document.getElementsByClassName("linhaFornecedor")[cont]).display != "none") {
            if (document.getElementsByClassName("preco")[cont].value > maxPreco)
                maxPreco = document.getElementsByClassName("preco")[cont].value;
            fNovos.push({
                id: document.getElementsByClassName("fornecedor")[cont].value,
                preco: document.getElementsByClassName("preco")[cont].value,
                minQtd: document.getElementsByClassName("minQtd")[cont].value,
            })
        }
    }

    localStorage.setItem("updateFornecedores", JSON.stringify({
        insumo_id: id,
        fornecedores: fAntigos
    }))

    localStorage.setItem("insertFornecedores", JSON.stringify(fNovos))
}

function updateFornecedorR() {
    var f = localStorage.getItem("updateFornecedores")
    if (!f)
        return console.log("Sem dados de fornecedor para alterar")
    f = JSON.parse(f)
    fetch("http://localhost:3303/updateFornecedorR", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            rotulo_id: f.insumo_id,
            fornecedores: f.fornecedores
        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
            if (data.s) {
                localStorage.removeItem("updateFornecedores")
            }
        })
    })
}

function updateFornecedorE() {
    var f = localStorage.getItem("updateFornecedores")
    if (!f)
        return console.log("Sem dados de fornecedor para alterar")
    f = JSON.parse(f)
    fetch("http://localhost:3303/updateFornecedorE", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            embalagem_id: f.insumo_id,
            fornecedores: f.fornecedores
        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
            if (data.s) {
                localStorage.removeItem("updateFornecedores")
            }
        })
    })
}

function updateEmbalagem(id) {
    fornecedorELS(id);

    var nome = document.getElementById("modal_titulo").value;
    var estoque = document.getElementById("modalEstoque").value;
    var minimo = document.getElementById("modalMinimo").value;
    var tamanho = document.getElementById("mililitragemDaEmbalagem").value;
    var select = document.getElementById('tipoEmbalagem');
    var value = select.options[select.selectedIndex].value;
    fetch("http://localhost:3303/updateEmbalagem", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id,
            nome: nome,
            tamanho: tamanho,
            tipo: value,
            estoque: estoque,
            minimo: minimo,
            fornecedores: JSON.parse(localStorage.getItem("insertFornecedores"))
        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
            if (data.s) {
                localStorage.removeItem("insertFornecedores")
            }
            location.reload()
        })
    })
}

function updateFornecedor(id) {
    var nome = document.getElementById("nome_forn").value
    var email = document.getElementById("email_forn").value
    var telefone = document.getElementById("telefone_forn").value
    fetch("http://localhost:3303/updateFornecedor", {
        method: 'POST',
        headers: { 'content-Type': 'application/json' },
        body: JSON.stringify({
            id: id,
            nome: nome,
            email: email,
            telefone: telefone
        })

    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        })
    })
}
//============================================================================================================//
//GERENCIAMENTO DE INFORMAÇÕES DAS RELAÇÕES DO FORNECEDOR 
//-------------------------------Deletar relação MP------------------------------------
function deleteFRelacaoMP(id) {
    if (confirm("Deseja mesmo deletar essa relação?")) {
        fetch("http://localhost:3303/deleteFRelacaoMP", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: Number(id),
            })
        }).then(function (res) {
            res.json().then(function (data) {
                window.alert(`${data.tipo} - ${data.mensagem}`)
            })
        })
    }
}
//-------------------------------Deletar relação R------------------------------------
function deleteFRelacaoR(id) {

    if (confirm("Deseja mesmo deletar essa relação?")) {
        fetch("http://localhost:3303/deleteFRelacaoR", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: Number(id),
            })
        }).then(function (res) {
            res.json().then(function (data) {
                window.alert(`${data.tipo} - ${data.mensagem}`)
            })
        })
    }
}
//-------------------------------Deletar relação E------------------------------------
function deleteFRelacaoE(id) {
    if (confirm("Deseja mesmo deletar essa relação?")) {
        fetch("http://localhost:3303/deleteFRelacaoE", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: Number(id),
            })
        }).then(function (res) {
            res.json().then(function (data) {
                window.alert(`${data.tipo} - ${data.mensagem}`)
            })
        })
    }
}


function observacoes(produtos) {
    var ob = document.getElementById("w3review").value

    fetch("http://localhost:3303/adicionaObservacao", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ob: ob,
            produtos: produtos
        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        })
    })

}

function guardaMateriaprima(n) {

    var materiasPrimas = []
    for (var cont = 0; cont < document.getElementsByClassName("linhaMP").length; cont++) {
        materiasPrimas.push({
            id: document.getElementsByClassName("idMP")[cont].innerHTML,
            quantidade: document.getElementsByClassName("qtdMP")[cont].value
        })

    }


    for (i = 0; i < materiasPrimas.length; i++) {

        baixaMateriaPrima(materiasPrimas[i].id, materiasPrimas[i].quantidade)
    }
}

function baixaMateriaPrima(id, quant) {
    console.log(id, quant)
    fetch("http://localhost:3303/baixaMateriaPrima", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id,
            quant: quant

        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        })
    })
}

function baixaEmbalagem(id, i) {
    var quant = document.getElementById(`qtd-${i}`).value
    console.log(id)
    fetch("http://localhost:3303/baixaEmbalagem", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id,
            quant: quant
        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        })
    })
}

function baixaRotulo(id, i) {
    var quant = document.getElementById(`qtd-${i}`).value
    console.log(id)
    fetch("http://localhost:3303/baixaRotulo", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id,
            quant: quant
        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        })
    })
}
RD

async function darBaixa() {
    //Testar se precisa comprar algum insumo, se sim, abre o modal da lista de compras e barra a produção. Se não, continua normalmente

    mudancas = await mudancasPT2()
    localStorage.removeItem("config")
    localStorage.removeItem("materiasPrimas")
    sessionStorage.removeItem("materiasPrimas")

    produtos = []
    var embalagem
    var rotulo
    var tam = document.getElementsByClassName("blocoProduto").length
    for (i = 0; i < tam; i++) {
        produtos.push({ id: document.getElementById(`selectProduto-${i}`).value, quantidade: document.getElementById(`qtd-${i}`).value, mudancas: `${mudancas}` })

        rotulo = document.getElementById(`selectRotulo-${i}`).value
        baixaRotulo(rotulo, i)

        embalagem = document.getElementById(`selectEmbalagem-${i}`).value
        baixaEmbalagem(embalagem, i)

        rotulo = document.getElementById(`selectCR-${i}`).value
        baixaRotulo(rotulo, i)

        embalagem = document.getElementById(`selectCima-${i}`).value
        baixaEmbalagem(embalagem, i)

        //guardaMateriaprima(i)
        console.log(tam)

    }
    guardaMateriaprima(i)
    observacoes(produtos)
}

//============================================================================================================//
//VERIFICAR ESTOQUE
function verificarEstoque() {

    const id = document.getElementById("xxx").value

    fetch("http://localhost:3303/verificarEstoque", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id,
        })
    }).then(function (res) {
        res.json().then(function (data) {
            return data
        })
    })
}

 function nEmbalagem(){
    let idsEmbalagem = []
    
    let tamanho = document.getElementsByClassName("blocoProduto").length

    for (let i = 0; i < tamanho; i++) {
        var idE = document.getElementById(`selectEmbalagem-${i}`).value
        idsEmbalagem.push(Number(idE))
        var idE = document.getElementById(`selectCima-${i}`).value
        idsEmbalagem.push(Number(idE))
    }

    return idsEmbalagem
}

 function nRotulo(){
    let idsRotulo = []
    
    let tamanho = document.getElementsByClassName("blocoProduto").length

    for (let i = 0; i < tamanho; i++) {

        var idR = document.getElementById(`selectRotulo-${i}`).value
        idsRotulo.push(Number(idR)) 
        var idR = document.getElementById(`selectCR-${i}`).value
        idsRotulo.push(Number(idR)) 
    }

    return idsRotulo
}

 function compararQuantidade() {
    let existe = 0
    let tamanho = document.getElementsByClassName("linhaMP");
    let idsEmbalagem = []
    var idsMateria = []
    let idsRotulo = []
    let quant = document.getElementsByClassName("qtdMP");
    let estoque = document.getElementsByClassName("estoqueMP");
    for (i = 0; i < tamanho.length; i++) {
        if (Number(estoque[i].textContent) < Number(quant[i].value)) {
            existe = 1
            var idMP = document.getElementsByClassName("idMP")[i].textContent;
            
            idsMateria.push(Number(idMP))
            document.getElementById("listaCompras").innerHTML = `<button onclick="" type="button" class="buttonSimular buttonCompras" data-toggle="modal" data-target="#modalCompras">Lista de Compras</button>`
            
            estoque[i].setAttribute('style', 'color:red');
        }
      
    }
    idsEmbalagem = nEmbalagem()
    idsRotulo = nRotulo()
    if(existe == 1){

        testeMP(idsMateria, idsEmbalagem, idsRotulo)
    }
}



//============================================================================================================//


function adicionarproduto() {

    let tamanho = document.getElementsByClassName("blocoProduto").length
    document.getElementById("divSimulacao").insertAdjacentHTML('beforeend', `<div class="produtoFormula">
    <div id="produto-${tamanho}" class="blocoProduto">
        <div class="produto">
            <div class="selecaoProduto">
                <label for="selectProduto-${tamanho}"> Selecione o produto:</label>
                <select onload="listarProdutos(${tamanho})" onchange="listarFormulas(${tamanho}), listarEmbalagens(${tamanho}), listarRotulos(${tamanho})" name="selectProduto" id="selectProduto-${tamanho}" class="form-control campo">
                    <option value="Produto">Produto 1</option>
                </select>
            </div>
            <div class="selectProduto">
            <div class="infoProduto">
                <label for="selectEmbalagem-${tamanho}"> Tampa a embalagem:</label>
                <select  name="selectEmbalagem" id="selectEmbalagem-${tamanho}" class="form-control campo">
                    <option value="0">Selecione a embalagem</option>
                    <option value="5">Tampa1</option>
                    <option value="6">Tampa2</option>
                    <option value="7">Válvula1</option>
                    <option value="8">Válvula2</option>
                </select>
            </div>
        </div>
        <div class="selectProduto">
            <div class="infoProduto">
                <label for="selectRotulo-${tamanho}"> Selecione o Rotulo:</label>
                <select  name="selectRotulo" id="selectRotulo-${tamanho}" class="form-control campo">
                    <option value="1">Rotulo1</option>
                    <option value="2">Rotulo2</option>
                </select>
            </div>
        </div>
            <div class="quantidade">
                <div class="inputQuantidade">
                    <label for="qtd-${tamanho}"> Quantidade:</label>
                    <input id="qtd-${tamanho}" type="text" class="campo">
                </div>
                <div class="simular">
                <button onclick="preencheTabelaMP()" type="button" class="buttonSimular">Simular</button>
                </div>
                
            </div>
        </div>
    </div>
    <div id="formula-${tamanho}" class="blocoFormula">
        <div class="formula">
            <div class="linhaFormula">
                <div class="selecaoFormula">
                    <label for="selectFormula-${tamanho}"> Selecione a formula:</label>
                    <select name="selectFormula" id="selectFormula-${tamanho}" class="form-control campo">
                        <option value="Formula">Fórmula Principal</option>
                    </select>
                </div>
                <div class="addFormula">
                    <input type="button" value="+" class="buttonFormula">
                </div>
            </div>
            <div class="linhaFormula">
            <div class="selecaoFormula">
                <label for="selectCima-${tamanho}"> Corpo da embalagem:</label>
                <select name="selectTipo" id="selectCima-${tamanho}" class="form-control campo">
                    <option value="1">Pote</option>
                    <option value="2">Frasco</option>
                </select>
            </div>
        </div>
        <div class="linhaFormula">
            <div class="selecaoFormula">
                <label for="selectCR-${tamanho}"> Selecione o contra rótulo:</label>
                <select name="selectTipo" id="selectCR-${tamanho}" class="form-control campo">
                    <option value="3">Contra rótulo 1</option>
                    <option value="4">Contra rótulo 2</option>
                </select>
            </div>
        </div>
            <div class="linhaPreco">
                <div class="preco">
                    <label>Preço Total:</label>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="materiaPrima-${tamanho} materiaPrima">
<div class="mpText">
                <h3>Matérias primas necessárias</h3>
            </div>
    <div class="table scroll">
        <table>
            <thead>
                <tr>
                    <th style="display: none">Id</th>
                    <th>Passo</th>
                    <th>Matéria prima</th>
                    <th>Composição</th>
                    <th>Quantidade</th>
                    <th>Em estoque</th>
                    <th>CheckBox</th>

                </tr>
            </thead>
            <tbody class="tabelaMP-${tamanho}">
                
            </tbody>
        </table>
    </div>
</div>
`)
    listarProdutos(tamanho)
}

async function preencheTabelaMP() {

    let tamanho = document.getElementsByClassName("blocoProduto").length 
    //let tamanho2 = document.getElementsByClassName("blocoFormula").length
    //console.log(tamanho)
    //console.log(tamanho2)

    for (let index = 0; index < tamanho; index++) {
        embalagem = document.getElementById(`selectCima-${index}`).value
        console.log(embalagem)

        if(embalagem==""){
            console.log("abacaxi vegano")
            window.alert("Selecione um frasco primeiro")
            return;
        }
        
        let produto = document.getElementById(`selectProduto-${index}`).value;
        let formula = document.getElementById(`selectFormula-${index}`).value;
        
        let qtd = document.getElementById(`qtd-${index}`).value
        document.getElementsByClassName(`tabelaMP-${index}`)[0].innerHTML = ''
        fetch("http://localhost:3303/preencheTabelaMP", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                produto: produto,
                formula: formula,
            })
        }).then(function (res) {
            res.json().then(async function (data) {

                console.log(embalagem)
                const embalagemInfo = await selcetEmbEspSimuProd(embalagem);
                //console.log(JSON.stringify(embalagemInfo))

                if (data.mP) {
                    console.log(JSON.stringify(data.mP))
                    for (let i = 0; i < data.mP.length; i++) {

                        //console.log(data.mP[i].porcentagem / 100)
                        //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                        qtdFinal = ((qtd * embalagemInfo.embalagem[0].mililitragem) * (data.mP[i].porcentagem / 100))
                        //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                        //console.log(qtdFinal)

                        console.log(qtdFinal)
                        console.log(qtd)
                        console.log(data.mP[i].porcentagem)
                        document.getElementsByClassName(`tabelaMP-${index}`)[0].innerHTML += ('beforeend', `
                            <tr class="linhaMP">
                                <td class="idMP" style="display: none">${data.mP[i].id}</td>
                                <td class="passoMP">${data.mP[i].passo}</td>
                                <td class="nomeMP">${data.mP[i].nome}</td>
                                <td class="compMP">${data.mP[i].porcentagem}</td>
                                <td><input type="text" value="${qtdFinal}" class="buttonFormula qtdMP"></td>
                                <td class="estoqueMP">${data.mP[i].estoque}</td>
                                <td><input type="checkbox" name="checkboxSimular" id="checkboxSimular"></td>
                            </tr>
                        `)
                    }

                } else {
                    window.alert(res.tipo)
                }
            })
        })
    }
    setTimeout(() => { compararQuantidade(), mudancasPT1() }, 1000);
    await sleep(1000); //Para o programa po 1 segundo, permitindo que a função rode, e o iframe ao ser atualizado venha com os valores certos
    atualizarIframe() //Atualiza o modal iframe
    //} else {
        //window.alert("Selecione uma embalagem!")
    //}
}

function listarProdutos(tamanho) {

    document.getElementById(`selectProduto-${tamanho}`).innerHTML = ""

    fetch("http://localhost:3303/listarProdutos", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {

        res.json().then(function (data) {
            for (let i = 0; i < data.produtos.length; i++) {
                document.getElementById(`selectProduto-${tamanho}`).insertAdjacentHTML('beforeend', '<option value="' + data.produtos[i].id + '">' + data.produtos[i].nome + '</option>');
            }
        })
    })
}

async function listarFormulas(tamanho) {

    let id_produto = document.getElementById(`selectProduto-${tamanho}`).value
    let formula = await getProdutoF(id_produto)
    document.getElementById(`selectFormula-${tamanho}`).innerHTML = ""

    for (let i = 0; i < formula.formulas.length; i++) {
        document.getElementById(`selectFormula-${tamanho}`).insertAdjacentHTML('beforeend', '<option value="' + formula.formulas[i].id + '">' + formula.formulas[i].nome + '</option>');
    }

}

async function listarEmbalagens(tamanho) {

    let id_produto = document.getElementById(`selectProduto-${tamanho}`).value
    let e = await getProdutoE(id_produto)
    document.getElementById(`selectEmbalagem-${tamanho}`).innerHTML = ""
    document.getElementById(`selectCima-${tamanho}`).innerHTML = ""

    for (let i = 0; i < e.embalagens.length; i++) {
        if (e.embalagens[i].produto_id == Number(id_produto)) {
            if (e.embalagens[i].tipo == 1 || e.embalagens[i].tipo == 2) {
                document.getElementById(`selectCima-${tamanho}`).insertAdjacentHTML('beforeend', '<option value="' + e.embalagens[i].id + '">' + e.embalagens[i].nome + '</option>');
            } else {
                document.getElementById(`selectEmbalagem-${tamanho}`).insertAdjacentHTML('beforeend', '<option value="' + e.embalagens[i].id + '">' + e.embalagens[i].nome + '</option>');
            }
        }

    }

}

async function listarRotulos(tamanho) {

    let id_produto = document.getElementById(`selectProduto-${tamanho}`).value
    let e = await getProdutoR(id_produto)
    document.getElementById(`selectRotulo-${tamanho}`).innerHTML = ""
    document.getElementById(`selectCR-${tamanho}`).innerHTML = ""

    for (let i = 0; i < e.rotulos.length; i++) {
        if (e.rotulos[i].produto_id == Number(id_produto)) {
            if (e.rotulos[i].tipo == 1) {
                document.getElementById(`selectCR-${tamanho}`).insertAdjacentHTML('beforeend', '<option value="' + e.rotulos[i].id + '">' + e.rotulos[i].nome + '</option>');
            } else {
                document.getElementById(`selectRotulo-${tamanho}`).insertAdjacentHTML('beforeend', '<option value="' + e.rotulos[i].id + '">' + e.rotulos[i].nome + '</option>');
            }
        }

    }

}

// Função de cadastrar fórmula
function cadastrarFormulas(produto) {

    var dados = (localStorage.getItem("formulaData"))
    if (!dados) {
        return console.log("Dados de fórmula não encontrados");
    }
    var id_produto = (localStorage.getItem("produtoId"))
    if (produto)
        id_produto = produto;
    if (!id_produto) {
        return console.log("Identificador do produto não encontrado");
    }

    dados = JSON.parse(dados)
    id_produto = JSON.parse(id_produto)
    fetch("http://localhost:3303/cadastrarFormula", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id_produto,
            formulas: dados
        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
            if (data.s) {
                localStorage.removeItem("formulaData")
            }
        })
    })
}

// Função 

async function simuladorEmbalagens() {
    var id_produto = document.getElementById("selectProduto-0").value
    var response = await fetch("http://localhost:3303/selectEmbalagem", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            restricao: `where produto_id = ${id_produto}`,
        })
    })
    var embalagens = await response.json()
    response = await fetch("http://localhost:3303/selectProdEmbalagem", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            restricao: `where produto_id = ${id_produto}`,
        })
    })
    var produtoEmbalagens = await response.json()
}

//Core histórico de produção - VITOR MOICANO
//=================================================================================//
async function getProducaoEspecifica(producao_id) {
    console.log("passei aki 2")
    var response = await fetch("http://localhost:3303/listarProducaoEspecifica", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            producao_id: Number(producao_id),
        })
    })
    var data = await response.json()
    return data
}

function getProducoes() {
    fetch("http://localhost:3303/listarProducoes", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        res.json().then(function (data) {
            if (data.producoes) {
                for (let cont = 0; cont < data.producoes.length; cont++) {
                    //console.log(pegarMes(data.producoes[cont].data))
                    var m = Number(pegarMes(data.producoes[cont].data))
                    console.log(m)
                    switch (m) {
                        case 1:
                            var listaItens = document.getElementById("mes1")
                            var element = document.getElementById("em-1");
                            element.style.display = "block";
                            resumeCodigo(listaItens, data.producoes[cont])

                            break;
                        case 2:
                            var listaItens = document.getElementById("mes2")
                            var element = document.getElementById("em-2");
                            element.style.display = "block";
                            resumeCodigo(listaItens, data.producoes[cont])
                            break;
                        case 3:
                            var listaItens = document.getElementById("mes3")
                            var element = document.getElementById("em-3");
                            element.style.display = "block";
                            resumeCodigo(listaItens, data.producoes[cont])
                            break;
                        case 4:
                            var listaItens = document.getElementById("mes4")
                            var element = document.getElementById("em-4");
                            element.style.display = "block";
                            resumeCodigo(listaItens, data.producoes[cont])
                            break;
                        case 5:
                            //resumeInnerhtml(data.producoes)
                            //getModalHistoricoMateriaPrima(data.producoes[cont].id)
                            var listaItens = document.getElementById("mes5")
                            var element = document.getElementById("em-5");
                            element.style.display = "block";
                            resumeCodigo(listaItens, data.producoes[cont])
                            break;
                        case 6:
                            var listaItens = document.getElementById("mes6")
                            var element = document.getElementById("em-6");
                            element.style.display = "block";
                            resumeCodigo(listaItens, data.producoes[cont])
                            break;
                        case 7:
                            var listaItens = document.getElementById("mes7")
                            var element = document.getElementById("em-7");
                            element.style.display = "block";
                            resumeCodigo(listaItens, data.producoes[cont])
                            break;
                        case 8:
                            var listaItens = document.getElementById("mes8")
                            var element = document.getElementById("em-8");
                            element.style.display = "block";
                            resumeCodigo(listaItens, data.producoes[cont])
                            break;
                        case 9:
                            var listaItens = document.getElementById("mes9")
                            var element = document.getElementById("em-9");
                            element.style.display = "block";
                            resumeCodigo(listaItens, data.producoes[cont])
                            break;
                        case 10:
                            var listaItens = document.getElementById("mes10")
                            var element = document.getElementById("em-10");
                            element.style.display = "block";
                            resumeCodigo(listaItens, data.producoes[cont])
                            break;
                        case 11:
                            var listaItens = document.getElementById("mes11")
                            var element = document.getElementById("em-11");
                            element.style.display = "block";
                            resumeCodigo(listaItens, data.producoes[cont])
                            break;
                        case 12:
                            var listaItens = document.getElementById("mes12")
                            var element = document.getElementById("em-12");
                            element.style.display = "block";
                            resumeCodigo(listaItens, data.producoes[cont])
                            break;
                        default:
                            var listaItens = document.getElementById("mes1")
                            var element = document.getElementById("em-1");
                            element.style.display = "block";
                            resumeCodigo(listaItens, data.producoes[cont])
                    }
                }


            } else {
                window.alert(`${data.tipo} - ${data.mensagem}`)
            }
        })
    })
}

function resumeCodigo(listaItens, producoes) {
    listaItens.innerHTML +=
        `
                            <div>
                            <label class="escrita-data" id="data">
                                 ${dataDiaDaProducao(producoes.data)}
                            </label>
                            <div class="produto-historico" id="produto-historico">
                                <div id="nome-do-produto">
                                    <label class="informacao-escrita"> ${producoes.nome} </label>
                                </div>
                                <div id="data-de-producao">
                                    <label class="informacao-escrita"> ${converteData(producoes.data)} </label>
                                </div>
                                <div id="qtd-produzida">
                                    <label class="informacao-base">mililitros: </label>
                                    <label class="informacao-escrita">${producoes.quantidade}</label>
                                </div>
        
                                <button id="open-modal" data-toggle="modal" data-target="#modal" class="botao-de-info" onclick="setModalHistoricoDeProducao(${producoes.id})">
                                    informações
                                </button>
                            </div>
                        </div>
                            `;
    //console.log(JSON.stringify(producoes))
    //console.log(listaItens)
}

function comparaData(data) {
    var hoje = new Date();

    let dataMudada = data.split("T");
    let infos = dataMudada[0].split("-");
    dataFormatada = infos[2] + "/" + infos[1] + "/" + infos[0]

    //console.log("sex")
    console.log((Number(infos[2]) + Number((infos[1] * 30)) + Number((infos[0] * 365))))
    console.log((Number(hoje.getDate()) + Number(((hoje.getMonth() + 1) * 30)) + Number((hoje.getFullYear() * 365))))

    if ((Number(infos[2]) + Number((infos[1] * 30)) + Number((infos[0] * 365))) > ((Number(hoje.getDate()) + Number(((hoje.getMonth() + 1) * 30)) + Number((hoje.getFullYear() * 365))) - 7)) {
        return true
    }



    return false
}

function converteData(data) {
    let dataMudada = data.split("T");
    let infos = dataMudada[0].split("-");
    dataFormatada = infos[2] + "/" + infos[1] + "/" + infos[0]
    console.log(dataFormatada)
    return dataFormatada
}
function pegarMes(data) {
    let dataMudada = data.split("T");
    let infos = dataMudada[0].split("-");
    return infos[1]
}
function dataDiaDaProducao(data) {
    const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado']
    const mesDoAno = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    let dataMudada = data.split("T");
    let infos = dataMudada[0].split("-");
    dataFormatada = infos[2] + "/" + infos[1] + "/" + infos[0]
    var dia = new Date(dataMudada[0])
    var dataExata = diasDaSemana[dia.getDay()] + ", " + infos[2] + " de " + mesDoAno[infos[1] - 1]
    return dataExata
}

async function setModalHistoricoDeProducao(id) {
    // f = await getMateriaPrimaFornecedor(id);
    const producao = await getProducaoEspecifica(id);
    const formulasDoProduto = await producao.formulas
    const materiaPrima = await getModalHistoricoMateriaPrima(id);
    const embalagemERotulo = await getModalHistoricoRotulo(id)
    const allMudacas = await getMudancas(id);
    //const rotulo = await getFornecedorRotulo(id);
    //const embalagem = await getFornecedorEmbalagem(id);

    //console.log(JSON.stringify(producao))
    //console.log(producao.producoes.length)
    conteudo = document.getElementsByClassName("modal-content")[0]
    conteudo.innerHTML = `
    <div class="modal-header">
        <div class="row p-0 m-0">
            <label for="modal_titulo" class="mr-2">Produto: ${producao.producoes[0].nome}</label>
        </div>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>
    </div>
    <div class="modal-body row p-0 m-0 justify-content-between">
        <div>
            <div class="materiaPrima-modal-historico">            
                <label for="modalLucro" class="mr-2">Materia prima</label>
                <div id="aloca-materiaPrima">
                <br>
                <label>  </label>
                </div>
            </div>
            <div class="rotulo-modal-historico">            
                <label for="modal_titulo" class="mr-2">Rotulo</label>
                <div id="aloca-rotulo">
                </div>
            </div>
            <div class="embalagem-modal-historico">            
                <label for="modal_titulo" class="mr-2">Embalagem</label>
                <div id="aloca-embalagem">
                </div>
            </div>
            <br>
            <div class="mudanca-modal-historico">            
            <label for="modal_titulo" class="mr-2">Mudancas</label>
            <div id="aloca-mudanca">
            </div>
        </div>
        </div>
    </div>
    <div id="mBodyConteudo" class="w-50 p-3">
    </div>
    <div class="modal-footer">
    </div>
    `

    conteudo = document.getElementById("aloca-materiaPrima")
    conteudo.innerHTML = ""
    for (let cont = 0; cont < materiaPrima.materiasPrimas.length; cont++) {
        conteudo.innerHTML += `
        
        <label>${materiaPrima.materiasPrimas[cont].nome}</label>
        <label>Militragem: ${((materiaPrima.materiasPrimas[cont].quantidade) / 100) * materiaPrima.materiasPrimas[cont].porcentagem}</label>
        <br>
        `
    }

    conteudo = document.getElementById("aloca-rotulo")
    conteudo.innerHTML = ""
    for (let cont = 0; cont < embalagemERotulo.embalagensERotulos.length; cont++) {
        conteudo.innerHTML += `
        
        <label>${embalagemERotulo.embalagensERotulos[cont].nomeR}</label>
        <label>Quantidade: ${((embalagemERotulo.embalagensERotulos[cont].quantidade) / embalagemERotulo.embalagensERotulos[cont].mililitragem)}</label>
        <br>
        `
    }

    conteudo = document.getElementById("aloca-embalagem")
    conteudo.innerHTML = ""
    for (let cont = 0; cont < embalagemERotulo.embalagensERotulos.length; cont++) {
        conteudo.innerHTML += `
        
        <label>${embalagemERotulo.embalagensERotulos[cont].nomeE}</label>
        <label>Quantidade: ${((embalagemERotulo.embalagensERotulos[cont].quantidade) / embalagemERotulo.embalagensERotulos[cont].mililitragem)}</label>
        <br>
        `
    }

    conteudo = document.getElementById("aloca-mudanca")

    if(allMudacas.mudancas != "enche linguiça"){
        let produtos = []
        let materiasPrimas = []
        let separa = allMudacas.mudancas.split('//')
        console.log(separa)
        produtos.push(separa[0])
        for(let i = 1; i < separa.length - 1; i++) {
            produtos.push[i]
        }
        materiasPrimas = JSON.parse(separa[separa.length - 1].replace('MP=',''))
        console.log(materiasPrimas)

        for(cont = 0; cont < produtos.length; cont++) {
            let arr = produtos[cont].split(';');
            let formula, idEmbalagem, idEmbalagem2, idRotulo, ContraRotulo;

            for (let i = 0; i < arr.length; i++) {
                let pair = arr[i].split('=');
                let key = pair[0];
                let value = pair[1];

                if (key == 'F') {
                    formula = value;
                } else if (key == 'EC') {
                    idEmbalagem = value;
                } else if (key == 'EB') {
                    idEmbalagem2 = value;
                } else if (key == 'R') {
                    idRotulo = value;
                } else if (key == 'CR') {
                    ContraRotulo = value;
                }
            }

            var vetDados= await pegaDadosSplit(formula, idEmbalagem, idEmbalagem2, idRotulo, ContraRotulo)
            console.log("vetDados"+JSON.stringify(vetDados))
            var f1 = vetDados[0].nformula[cont]
            if(!f1)
                f1 = {nome: " "};
            var e1 = vetDados[1].embalagem[cont]
            if(!e1)
                e1 = {nome: " "};
            var e2 = vetDados[2].embalagem[0]
            if(!e2)
                e2 = {nome: " "};
            var r1 = vetDados[3].lista[0]
            if(!r1)
                r1 = {nome: " "};
            var r2 = vetDados[4].lista[cont]
            if(!r2)
                r2 = {nome: " "};
            conteudo.innerHTML += `
            <label>Formula: ${f1.nome}</label>
            <br>
            <label>Embalagem(Fechamento): ${e1.nome}</label>
            <br>
            <label>Embalagem(Container): ${e2.nome}</label>
            <br>
            <label>Rótulo: ${r1.nome}</label>
            <br>
            <label>Contra-Rótulo: ${r2.nome}</label>
            <br>
            <label>Materias Primas Alteradas: </label>
            <br>
            `
        }

        for(let i=0;i<materiasPrimas.length;i++){
            var nomeMP = await pegadosMpsplit(materiasPrimas[i].id)
            conteudo.innerHTML += `
            <br><label>Nome: ${nomeMP} Quantidade: ${materiasPrimas[i].quantidade} </label>
            ` 
        }
    }
}

async function pegadosMpsplit(mpValue){
    var response = await fetch("http://localhost:3303/listarMateriaPrimaMod", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: Number(mpValue)
        })
    })
    var dados = await response.json()
    return await dados.lista[0].nome
}

async function pegaDadosSplit(formula, idEmbalagem, idEmbalagem2, idRotulo, ContraRotulo) {
    var dados= []
    var response = await fetch("http://localhost:3303/listarformulasid", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: Number(formula)
        })
    })
    dados.push(await response.json())
    var response = await fetch("http://localhost:3303/listarEmbalagem", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: Number(idEmbalagem)
        })
    })
    dados.push(await response.json())
    var response = await fetch("http://localhost:3303/listarEmbalagem", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: Number(idEmbalagem2)
        })
    })
    dados.push(await response.json())
    var response = await fetch("http://localhost:3303/listarRotuloMod", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: Number(idRotulo)
        })
    })
    dados.push(await response.json())
    var response = await fetch("http://localhost:3303/listarRotuloMod", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: Number(ContraRotulo)
        })
    })
    dados.push(await response.json())

    return dados


}

//COLOCAR INFORMAÇÕES NOS MODAIS
async function getMudancas(producao_id) {
    console.log("passei aki 2")
    var response = await fetch("http://localhost:3303/listarMudancas", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            producao_id: Number(producao_id),
        })
    })
    var data = await response.json()
    console.log(JSON.stringify(data))
    return data
}

async function getModalHistoricoMateriaPrima(producao_id) {
    console.log("passei aki 2")
    var response = await fetch("http://localhost:3303/listarMateriaPrimaDaProducao", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            producao_id: Number(producao_id),
        })
    })
    var data = await response.json()
    console.log(JSON.stringify(data))
    return data
}

async function getModalHistoricoRotulo(producao_id) {

    console.log("passei aki 2")
    var response = await fetch("http://localhost:3303/listarRotuloDaProducao", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            producao_id: Number(producao_id),
        })
    })

    var data = await response.json()
    console.log(JSON.stringify(data))
    return data
}
//=================================================================================//

//Core home page - VITOR MOICANO 
//=================================================================================//
function homePageMateriaPrimaFaltante() {
    fetch("http://localhost:3303/listarMateriaPrimaMin", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        res.json().then(function (data) {
            console.log(JSON.stringify(data.lista))
            if (data.lista) {
                conteudo = document.getElementById("aloca-item-abaixo-do-minimo")
                for (let cont = 0; cont < data.lista.length; cont++) {
                    conteudo.innerHTML += (`
                    <p class="info-card">${data.lista[cont].nome}</p>
                    `)
                }
                window.alert("Há matéria prima abaixo do estoque mínimo")
            }
        })
    })
}

function producoesUltimaSemana() {
    fetch("http://localhost:3303/producoesUltimaSemana", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        res.json().then(function (data) {
            //console.log(JSON.stringify(data.lista))
            if (data.lista) {
                conteudo = document.getElementById("aloca-item-ultima-semana")
                for (let cont = 0; cont < data.lista.length; cont++) {
                    if (comparaData(data.lista[cont].data) == true) {
                        conteudo.innerHTML += (`
                        <p class="info-card">${data.lista[cont].nome} - ${converteData(data.lista[cont].data)}</p>
                        `)
                    }
                }
            }
        })
    })
}

function displayUsuarioComum() {
    var usuLogado = JSON.parse(sessionStorage.getItem("usuario"))
    console.log("Permissão ", usuLogado.temPermissao)
    const itens = document.getElementsByClassName("soAdm")
    if (usuLogado.temPermissao == 0) {
        for (var cont = 0; cont < itens.length; cont++) {
            itens[cont].style.display = "none";
        }
    }
}
//=================================================================================//

//Core deletar produção após 5 usos - VITOR MOICANO NÃO FINALIZADO
//=================================================================================//
function eliminaProducaoMaiorQue5() {

    fetch("http://localhost:3303/eliminaProducaoMaiorQue5", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        res.json().then(function (data) {
            console.log("zig zag")
        })
    })
}
//=================================================================================//

//Core solicita e altera info usuário - VITOR MOICANO
//=================================================================================//
function listaUsuarios() {

    fetch("http://localhost:3303/listaUsuarios", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        res.json().then(function (data) {
            if (data.usuarios) {
                var listaItens = document.getElementById("listagemUsuarios")
                for (let cont = 0; cont < data.usuarios.length; cont++) {

                    if (data.usuarios[cont].temPermissao == 1) {
                        listaItens.innerHTML += (`
                    <label onclick="dadoUsuario(${data.usuarios[cont].id})" class="usuario-adm"><i class="fa-solid fa-user" style="color: #000000;"></i>${data.usuarios[cont].nome}</label>
                    `)
                    }
                    if (data.usuarios[cont].temPermissao == 0) {
                        listaItens.innerHTML += (`
                        <label onclick="dadoUsuario(${data.usuarios[cont].id})" class="usuario-comum"><i class="fa-solid fa-circle-user" style="color: #ffffff;"></i>${data.usuarios[cont].nome}</label>
                    `)
                    }


                }
            }


        })
    })
}

async function dadoUsuario(id) {
    localStorage.removeItem('id_usuario_permissao')

    var element = document.getElementById("quadrante-direito");
    element.style.display = "flex";

    fetch("http://localhost:3303/usuarioEspecifico", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: Number(id),
        })
    }).then(function (res) {
        res.json().then(function (data) {

            console.log(data.usuario[0].temPermissao)

            //const id_ls = id
            const p = data.temPermissao
            const ls = { id_ls: id, perm: data.usuario[0].temPermissao }
            localStorage.setItem('id_usuario_permissao', JSON.stringify(ls))

            if (data.usuario[0]) {

                var node = document.getElementById("nome-usu-modal");
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
                var node = document.getElementById("email-usu-modal");
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
                var node = document.getElementById("permissao-usu-modal");
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
                var node = document.getElementById("b-permissao");
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
                var node = document.getElementById("BTN");
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
                //var node = document.getElementById("xx");
                //if (node.parentNode) {
                //    node.parentNode.removeChild(node);
                //}

                var listaDados = document.getElementById("dados-usu")
                var listaPermicao = document.getElementById("permisao-usu")
                var BTNswitch = document.getElementById("BTNswitch")

                //console.log(data.usuario[0].nome)

                listaDados.innerHTML += (` 
                    <div class="dados-usu">
                        <label class="nome-usu-modal" id="nome-usu-modal">Usuário: ${data.usuario[0].nome}</label>
                        <label class="email-usu-modal" id="email-usu-modal">Email: ${data.usuario[0].email}</label>
                    </div>
                    `)

                if (data.usuario[0].temPermissao == 1) {
                    BTNswitch.innerHTML += (`
                    <div id="BTN">
                            <input id="principal" type="checkbox" checked data-toggle="toggle" data-onstyle="primary"
                                data-offstyle="secondary" data-on="Principal" data-off="Secundario" onclick="alterarNievlDePermissao()">
                            <!--<input type="checkbox" id= "s1" class= "lg" value=true>-->
                            <span class="slider round" id="xx"></span>
                    </div>
                    `)
                    listaPermicao.innerHTML += (`
                    <div class="permisao-usu" id="permisao-usu">
                    <label class="permissao-usu-modal" id="permissao-usu-modal">Nível de permissão</label><i class="fa-solid fa-circle" style="color: #000000;" id="b-permissao"></i>
                    </div>
                    `)

                }
                if (data.usuario[0].temPermissao == 0) {
                    BTNswitch.innerHTML += (`
                    <div id="BTN">
                            <input id="principal" type="checkbox" unchecked data-toggle="toggle" data-onstyle="primary"
                                data-offstyle="secondary" data-on="Principal" data-off="Secundario" onclick="alterarNievlDePermissao()">
                            <!--<input type="checkbox" id= "s1" class= "lg" value=true>-->
                            <span class="slider round" id="xx"></span>
                    </div>
                    `)
                    listaPermicao.innerHTML += (`
                    <div class="permisao-usu" id="permisao-usu">
                    <label class="permissao-usu-modal" id="permissao-usu-modal">Nível de permissão</label><i class="fa-solid fa-circle" style="color: #ffffff;" id="b-permissao"></i>
                    </div>
                    `)
                }



            }


        })
    })

}

function deletarUsuario() {
    const id_usuario_permissao = JSON.parse(localStorage.getItem('id_usuario_permissao'));
    fetch("http://localhost:3303/deletarUsuario", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id_usuario_permissao: Number(id_usuario_permissao.id_ls),
        })
    }).then(function (res) {
        //window.alert("Usuário deletado com sucesso")
        res.json().then(function (data) {

            //console.log(id_usuario_permissao)
        })
    })
    window.alert("Usuário deletado com sucesso")
}

function alterarNomeUsuario() {
    const id_usuario_permissao = JSON.parse(localStorage.getItem('id_usuario_permissao'));
    var novoNome = document.getElementById('input-de-info').value
    console.log(novoNome)
    fetch("http://localhost:3303/alterarNomeUsuario", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            novoNome: novoNome,
            id_usuario_permissao: Number(id_usuario_permissao.id_ls),
        })
    }).then(function (res) {
        //window.alert("Usuário deletado com sucesso")
        res.json().then(function (data) {

            //console.log(id_usuario_permissao)
        })
    })
    window.alert("Nome de usuário alterado com sucesso")
}

function alterarEmailUsuario() {
    const id_usuario_permissao = JSON.parse(localStorage.getItem('id_usuario_permissao'));
    var novoEmail = document.getElementById('input-de-info').value
    //console.log(novoEmail)
    fetch("http://localhost:3303/alterarEmailUsuario", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            novoEmail: novoEmail,
            id_usuario_permissao: Number(id_usuario_permissao.id_ls),
        })
    }).then(function (res) {
        //window.alert("Usuário deletado com sucesso")
        res.json().then(function (data) {

            //console.log(id_usuario_permissao)
        })
    })
    window.alert("Email de usuário alterado com sucesso")
}

function setModalEmail() {

    conteudo = document.getElementsByClassName("modal-content")[0]
    conteudo.innerHTML = `
    <label class="titulo-modal">Digite o novo email:</label>
                    <input type="text" class="input-de-info" id="input-de-info">

                    <div class="botoes-modal">
                        <button id="open-modal" class="botao-modal" onclick="alterarEmailUsuario()">
                            confirmar
                        </button>
                        <button id="open-modal" class="botao-modal" aria-label="Close" data-dismiss="modal" type="button">
                            cancelar
                        </button>
                    </div>
    `
}

function setModalNome() {

    conteudo = document.getElementsByClassName("modal-content")[0]
    conteudo.innerHTML = `
    <label class="titulo-modal">Digite o novo nome:</label>
                    <input type="text" class="input-de-info" id="input-de-info">

                    <div class="botoes-modal">
                        <button id="open-modal" class="botao-modal" onclick="alterarNomeUsuario()">
                            confirmar
                        </button>
                        <button id="open-modal" class="botao-modal" aria-label="Close" data-dismiss="modal" type="button">
                            cancelar
                        </button>
                    </div>
    `
}

function alterarNievlDePermissao() {
    const id = JSON.parse(localStorage.getItem('id_usuario_permissao'));
    //const permissao = JSON.parse(localStorage.getItem('id_usuario_permissao'));
    var permissao
    if (id.perm == 1) {
        permissao = 0
    }
    if (id.perm == 0) {
        permissao = 1
    }

    console.log(id.perm)
    console.log(id.id_ls)

    fetch("http://localhost:3303/alterarPermissaoUsuario", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: Number(id.id_ls),
            perm: Number(permissao),
        })
    }).then(function (res) {
        res.json().then(function (data) {
        })
    })
    window.alert("Permissão de usuário alterada com sucesso")
}

function zeraLocalStorage() {
    localStorage.removeItem('id_usuario_permissao')
}

//=================================================================================//



//Core xxx - VITOR MOICANO
//=================================================================================//
async function selcetEmbEspSimuProd(id) {
    console.log(id)

    var response = await fetch("http://localhost:3303/listarEmbalagem", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: Number(id),
        })
    })
    var data = await response.json()
    console.log(JSON.stringify(data))
    return data


}
//=================================================================================//



//Lista Materia prima minima
async function listaMateriaPrimaMin() {

    fetch("http://localhost:3303/listarMateriaPrimaMin", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        res.json().then(function (data) {
            if (data.lista) {
                var listaItens = document.getElementById("MP-lista")

                for (let cont = 0; cont < data.lista.length; cont++) {
                    listaItens.innerHTML += (`
                    <div class="row item MP-item m-2 p-1" id="MP-item-${cont}">
                    <label class="col MP-nome m-0">Nome: ${data.lista[cont].nome}</label>
                    <label class="col MP-id m-0" id="invisivel">${data.lista[cont].id}</label>
                    <label class="col MP-minimo m-0">Minimo: ${data.lista[cont].minimo}</label>
                    <div class="col row m-0 p-0 MP-estoque justify-content-between">
                        <label class="MP-estoque m-0">Estoque: ${data.lista[cont].estoque}</label>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input MP-marcador m-0 w-100 h-100" type="checkbox" id="MP-marcador" value="MP-ID-0">
                        </div>
                    </div>
                </div>
                    `)
                }

            } else {
                window.alert(`${data.tipo} - ${data.mensagem}`)
            }
        })
    })
    //________________________________________________________________

    fetch("http://localhost:3303/listarEmbalagemMin", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        res.json().then(function (data) {
            if (data.lista) {
                var listaItens = document.getElementById("Emb-lista")
                console.log(data)
                for (let cont = 0; cont < data.lista.length; cont++) {
                    listaItens.innerHTML += (`
                    <div class="row item Emb-item m-2 p-1" id="Emb-item-${cont}">
                    <label class="col Emb-nome m-0">Nome: ${data.lista[cont].nome}</label>
                    <label class="col Emb-id m-0" id="invisivel">${data.lista[cont].id}</label>
                    <label class="col Emb-minimo m-0">Mínimo:${data.lista[cont].minimo}</label>
                    <div class="col row m-0 p-0 Emb-estoque justify-content-between">
                        <label class="Emb-estoque m-0">Estoque:${data.lista[cont].estoque}</label>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input Emb-marcador m-0 w-100 h-100" type="checkbox" id="Emb-marcador" value="Emb-ID-0">
                        </div>
                    </div>
                </div>
                    `)
                }

            } else {
                window.alert(`${data.tipo} - ${data.mensagem}`)
            }
        })
    })

    //________________________________________________________________
    fetch("http://localhost:3303/listarRotuloMin", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        res.json().then(function (data) {
            if (data.lista) {
                var listaItens = document.getElementById("Rot-lista")
                console.log(data)
                for (let cont = 0; cont < data.lista.length; cont++) {
                    listaItens.innerHTML += (`
                    <div class="row item Rot-item m-2 p-1" id="Rot-item-${cont}">
                    <label class="col Rot-nome m-0">Nome: ${data.lista[cont].nome}</label>
                    <label class="col Rot-id m-0" id="invisivel">${data.lista[cont].id}</label>
                    <label class="col Rot-minimo m-0">Mínimo:${data.lista[cont].minimo}</label>
                    <div class="col row m-0 p-0 Rot-estoque justify-content-between">
                        <label class="Rot-estoque m-0">Estoque:${data.lista[cont].estoque}</label>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input Rot-marcador m-0 w-100 h-100" type="checkbox" id="Rot-marcador" value="Rot-ID-0">
                        </div>
                    </div>
                </div>
                    `)
                }

            } else {
                window.alert(`${data.tipo} - ${data.mensagem}`)
            }
        })
    })

}   //________________________________________________________________
//FUCAO PARA PEGAR CHECKED
async function abremodalMin(i) {
    //________________________________________________________________
    let idsMateria = [];
    //verifica checkBoxes
    if(i==1){
        let caxa = document.querySelectorAll('.MP-marcador');
        for (let i = 0; i < caxa.length; i++) {
            let id = caxa[i].closest('.item').querySelector('.MP-id').textContent;
            idsMateria.push(id); 
        }
    }else{
        let caxa = document.querySelectorAll('.MP-marcador');
        for (let i = 0; i < caxa.length; i++) {
            if (caxa[i].checked) {
                let id = caxa[i].closest('.item').querySelector('.MP-id').textContent;
                idsMateria.push(id);
            }
        }
    }

    var dadosSession = []
    for (let cont = 0; cont < idsMateria.length; cont++) {
        var id = idsMateria[cont]
        let response = await fetch("http://localhost:3303/listarMateriaPrimaMod", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id
            })
        })
        
        let data = await response.json()
        if (await data.lista) {
            data.lista[0].fornecedores = await pegaFornecedor(data.lista[0].id,1)
            dadosSession.push(await data.lista)
        } else {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        }
    }
    sessionStorage.setItem("infoMP",JSON.stringify(await dadosSession))

    //________________________________________________________________
    let idsEmbalagem = [];
    if(i==1){
        let caxa2 = document.querySelectorAll('.Emb-marcador');
        for (let i = 0; i < caxa2.length; i++) {
           let id = caxa2[i].closest('.item').querySelector('.Emb-id').textContent;
           idsEmbalagem.push(id); }
    }else{ 
    let caxa2 = document.querySelectorAll('.Emb-marcador');
    for (let i = 0; i < caxa2.length; i++) {
        if (caxa2[i].checked) {
            let id = caxa2[i].closest('.item').querySelector('.Emb-id').textContent;
            idsEmbalagem.push(id);
        }
    }}


    var dadosSessionEm=[]
    for (let cont = 0; cont < idsEmbalagem.length; cont++) {
        var id = idsEmbalagem[cont]
       let response=await fetch("http://localhost:3303/listarEmbalagemMod", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id
            })
        })

        let data = await response.json()
        if (await data.lista) {
            data.lista[0].fornecedores = await pegaFornecedor(data.lista[0].id,2)
            dadosSessionEm.push(await data.lista)
        } else {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        }
    }
    sessionStorage.setItem("infoEm",JSON.stringify(await dadosSessionEm))
    //________________________________________________________________
    let idsRotulo = [];
    if(i==1){
    let caxa3 = document.querySelectorAll('.Rot-marcador');
        for (let i = 0; i < caxa3.length; i++) {
            let id = caxa3[i].closest('.item').querySelector('.Rot-id').textContent;
            idsRotulo.push(id);
        }
    }else{
    let caxa3 = document.querySelectorAll('.Rot-marcador');
    for (let i = 0; i < caxa3.length; i++) {
        if (caxa3[i].checked) {
            let id = caxa3[i].closest('.item').querySelector('.Rot-id').textContent;
            idsRotulo.push(id);
        }
    }}

    var dadosSessionRt=[]
    for (let cont = 0; cont < idsRotulo.length; cont++) {
        var id = idsRotulo[cont]

       let response=await fetch("http://localhost:3303/listarRotuloMod", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id
            })
        })
        let data = await response.json()
        if (await data.lista) {
            data.lista[0].fornecedores = await pegaFornecedor(data.lista[0].id,3)
            dadosSessionRt.push(await data.lista)
        } else {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        }
    }
    sessionStorage.setItem("infoRt",JSON.stringify(await dadosSessionRt))
    await sleep(100)
    atualizarIframe()
}

async function pegaFornecedor(data, tipo) {

    switch (tipo) {
        case 1:
                var resp = await fetch("http://localhost:3303/listarFornecedorMateriaPrimaMin", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: data
                    })
                })

                var data= await resp.json()
                return await data.listaF
            break;
        case 2:
            console.log("Embalagem")
                
                var resp=await fetch("http://localhost:3303/listarFornecedorEmbalagemMin", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: data
                    })
                })

                var data= await resp.json()
                return await data.listaF
            break;
        case 3:
            console.log("Rotulo")
        
            var resp=await fetch("http://localhost:3303/listarFornecedorRotuloMin", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: data
                })
            })

            var data= await resp.json()
            return await data.listaF
            break;
        default:
            console.log("erro de tipo")
            break;

    }

}

async function testeMP3(data) {
    console.log(data.id)
        var response = await fetch("http://localhost:3303/listarFornecedorMateriaPrimaMin", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: data.id
            })
        })
        var data = await response.json()
        console.log(data.listaF)
        return JSON.stringify(data.listaF)
    
}

async function testeMP2(data) {
//console.log(data)
    var response = await fetch("http://localhost:3303/listarFornecedorMateriaPrimaMin", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: data
        })
    })
    var data = await response.json()
    return JSON.stringify(data.listaF)

}


async function testeMP(idsMateria, idsEmbalagem, idsRotulo) {

    console.log("help")
    console.log(idsMateria)
    var dadosSession = []
    for (let cont = 0; cont < idsMateria.length; cont++) {
        var id = idsMateria[cont]
        let response = await fetch("http://localhost:3303/listarMateriaPrimaMod", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id
            })
        })
        
        let data = await response.json()
        if (await data.lista) {
            data.lista[0].fornecedores = await pegaFornecedor(data.lista[0].id,1)
            dadosSession.push(await data.lista)
        } else {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        }
    }
    sessionStorage.setItem("infoMP",JSON.stringify(await dadosSession))

    var dadosSessionEm=[]
    for (let cont = 0; cont < idsEmbalagem.length; cont++) {
        var id = idsEmbalagem[cont]
       let response=await fetch("http://localhost:3303/listarEmbalagemMod", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id
            })
        })

        let data = await response.json()
        if (await data.lista) {
            data.lista[0].fornecedores = await pegaFornecedor(data.lista[0].id,2)
            dadosSessionEm.push(await data.lista)
        } else {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        }
    }
    sessionStorage.setItem("infoEm",JSON.stringify(await dadosSessionEm))

    var dadosSessionRt=[]
    for (let cont = 0; cont < idsRotulo.length; cont++) {
        var id = idsRotulo[cont]

       let response=await fetch("http://localhost:3303/listarRotuloMod", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id
            })
        })
        let data = await response.json()
        if (await data.lista) {
            data.lista[0].fornecedores = await pegaFornecedor(data.lista[0].id,3)
            dadosSessionRt.push(await data.lista)
        } else {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        }
    }
    sessionStorage.setItem("infoRt",JSON.stringify(await dadosSessionRt))

    console.log("rotulo")
    console.log(idsRotulo)
    console.log("embalagem")
    console.log(idsRotulo)

    await sleep(100)
    atualizarIframe()


}

//
//============================================================================================================//
async function preencheModalCompras() {
    console.log("asdklasjdlkad ajuda")
    const localAlocaHTLM = document.getElementById("listaComp")
    localAlocaHTLM.innerHTML=''
    var materiasPrimas = JSON.parse(sessionStorage.getItem("materiasPrimas"))
    var DadosMP = sessionStorage.getItem("DadosMP") //Pega as informações do session storage
    var mp = sessionStorage.getItem("Mp")

    var infoMP = sessionStorage.getItem("infoMP") //Pega as informações do session storage
    var infoEm = sessionStorage.getItem("infoEm")
    var infoRt = sessionStorage.getItem("infoRt")
    infoMP = JSON.parse(infoMP)
    console.log(infoMP)
    infoEm = JSON.parse(infoEm)
    infoRt = JSON.parse(infoRt)

    if(false) {

        DadosMP = JSON.parse(DadosMP)
        mp = JSON.parse(mp)

        const localAlocaHTLM = document.getElementById("listaComp")
          
        var forn = testeMP3(materiasPrimas[1])

        console.log(forn)

        console.log(DadosMP)
        console.log(mp)
        console.log(localAlocaHTLM)
        
        
        
        //console.log(DadosMP[0].id) //Lembrar de colocar [0] caso venha usar esse vetor puxado do session storage

        localAlocaHTLM.insertAdjacentHTML("beforeend", `
        <div class="item pt-4 pb-4">
                <div class="row m-0 insumoCompras">
                    <label class="col MP-nome m-0">${mp[0].nome}</label>
                    <label class="col MP-quantidade m-0">Quantidade mínima: ${DadosMP[0].quantidade_minima}</label>
                    <label class="col-12">Fornecedores:</label>
                </div>
                `)

        for (let i = 0; i < DadosMP.length; i++) {
            localAlocaHTLM.insertAdjacentHTML("beforeend", `
                    
            <div class="row m-0 pl-2 fornecedorCompras">
                <span class="col MP-fornecedor m-0">${DadosMP[i].nome}</span>
                <span class="col MP-preco m-0">${DadosMP[i].preco}</span>
                <span class="col MP-telefone m-0">Telefone: ${DadosMP[i].telefone}</span>
                <span class="col MP-email m-0">${DadosMP[i].email}</span>
            </div>
                    
            `)
        }
        sessionStorage.clear();
    }

    if(infoMP){
        
       
        localAlocaHTLM.innerHTML='<h2>Materias Primas</h2>'
        for(var i=0; i<infoMP.length; i++){ 
            let item = infoMP[i][0];
            localAlocaHTLM.insertAdjacentHTML("beforeend", `
                <div class="row m-0 insumoCompras">
                    <label class="col MP-nome m-0">Nome: ${item.nome}</label>
                    <label class="col-12">Fornecedores:</label>
                </div>`);
            if (item.fornecedores && item.fornecedores.length > 0) {
                for (var j=0; j<item.fornecedores.length; j++) {
                    let fornecedor = item.fornecedores[j];
                    localAlocaHTLM.insertAdjacentHTML("beforeend", `                         
                    <div class="row m-0 pl-2 fornecedorCompras">
                        <span class="col MP-fornecedor m-0">${fornecedor.nome}</span>
                        <span class="col MP-preco m-0">Preço: ${fornecedor.preco}</span>
                        <span class="col MP-telefone m-0">Telefone: ${fornecedor.telefone}</span>
                        <span class="col MP-email m-0">${fornecedor.email}</span>
                    </div>`);
                }
            } else {
                localAlocaHTLM.insertAdjacentHTML("beforeend", `<span class="col MP-email m-0">Sem fornecedores</span><br>`);
            }
        }
    }if(infoEm){  
        localAlocaHTLM.innerHTML+='<hr>'
        localAlocaHTLM.innerHTML+='<h2>Embalagens</h2>'
        for(var i=0; i<infoEm.length; i++){ 
            let item = infoEm[i][0];
            localAlocaHTLM.insertAdjacentHTML("beforeend", `
                <div class="row m-0 insumoCompras">
                    <label class="col MP-nome m-0">Nome: ${item.nome}</label>
                    <label class="col-12">Fornecedores:</label>
                </div>`);
            if (item.fornecedores && item.fornecedores.length > 0) {
                for (var j=0; j<item.fornecedores.length; j++) {
                    let fornecedor = item.fornecedores[j];
                    localAlocaHTLM.insertAdjacentHTML("beforeend", `                         
                    <div class="row m-0 pl-2 fornecedorCompras">
                        <span class="col MP-fornecedor m-0">Nome: ${fornecedor.nome}</span>
                        <span class="col MP-preco m-0">Preço: ${fornecedor.preco}</span>
                        <span class="col MP-telefone m-0">Telefone: ${fornecedor.telefone}</span>
                        <span class="col MP-email m-0">Email: ${fornecedor.email}</span>
                    </div>`);
                }
            } else {
                localAlocaHTLM.insertAdjacentHTML("beforeend", `<span class="col MP-email m-0">Sem forncedores</span><br>`);
            }
        }
    }if (infoRt){  
        localAlocaHTLM.innerHTML+='<hr>'
        localAlocaHTLM.innerHTML+='<h2>Rotulos</h2>'
        for(var i=0; i<infoRt.length; i++){ 
            let item = infoRt[i][0];
            localAlocaHTLM.insertAdjacentHTML("beforeend", `
                <div class="row m-0 insumoCompras">
                    <label class="col MP-nome m-0">Nome: ${item.nome}</label>
                    <label class="col-12">Fornecedores:</label>
                </div>`);
            if (item.fornecedores && item.fornecedores.length > 0) {
                for (var j=0; j<item.fornecedores.length; j++) {
                    let fornecedor = item.fornecedores[j];
                    localAlocaHTLM.insertAdjacentHTML("beforeend", `                         
                    <div class="row m-0 pl-2 fornecedorCompras">
                        <span class="col MP-fornecedor m-0">Nome: ${fornecedor.nome}</span>
                        <span class="col MP-preco m-0">Preço: ${fornecedor.preco}</span>
                        <span class="col MP-telefone m-0">Telefone: ${fornecedor.telefone}</span>
                        <span class="col MP-email m-0">Email: ${fornecedor.email}</span>
                    </div>`);
                }
            } else {
                localAlocaHTLM.insertAdjacentHTML("beforeend", `<span class="col MP-email m-0">Sem fornecedores</span><br>`);
            }
        }
        sessionStorage.clear();
    }
  
}

function testeEmbalagem(id, quant) {
    fetch("http://localhost:3303/getMP", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods': '*' },
        body: JSON.stringify({
            id: id,
            quant: quant
        })
    }).then(function (res) {
        res.json().then(function (data) {

            return data.res.mP;
        });

    });
}

function atualizarIframe() { //Função que atualiza o iframe
    console.log("vou me matar 2 ")
    var iframe = document.getElementById("meu-iframe");
    iframe.src ='modalCompras.html';

}



function sleep(ms) { //Função de parar o programa, utilizada na função preencheTabelaMP()
    return new Promise(resolve => setTimeout(resolve, ms));
}
//============================================================================================================//

function teste() {
    var idFor = 1;
    var contTot = 1;

    const openModalButton = document.querySelector("#open-modal");
    const closeModalButton = document.querySelector("#fecharModal");
    const modal = document.querySelector("#modal");
    const fade = document.querySelector("#fade");

    const toggleModal = () => {
        modal.classList.toggle("hide");
        fade.classList.toggle("hide");
    };

    [openModalButton, closeModalButton, fade].forEach((el) => {
        el.addEventListener("click", () => toggleModal());
    });


    // Função de ligar nova embalagem ao fornecedor
    function cadastrarFornecedorAEmbalagem(event) {

        event.preventDefault()

        let fornecedores = [];

        for (let cont = 0; cont < document.getElementsByClassName("subdireita3").length; cont++) {
            fornecedores.push({
                idForne: document.getElementsByClassName("select-fornecedor")[cont].value,
                valor: document.getElementsByClassName("valorClass")[cont].value,
            })
        }
        localStorage.setItem("fornecedores", JSON.stringify(fornecedores));
    }

    
}

// function closeModal() {
//     var modal = document.getElementById("modal");
//     var fade = document.getElementById("fade");
//     modal.style.display = "none";
//     fade.style.display = "none";
//   }
  
//   var btn = document.getElementById("fecharModal");
//   btn.onclick = function() {
//     closeModal();
//   }