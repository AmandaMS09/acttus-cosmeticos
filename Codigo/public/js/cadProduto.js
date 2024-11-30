// Função de cadastrar novo produto
function cadastrarProduto(event) {

    event.preventDefault();
    updateDadosProduto("formula", "formulaData")
    embalagensLS()
    updateDadosProduto("rotulo", "rotuloData")
    var nome = document.getElementById("name").value;
    var lucro = document.getElementById("lucro").value;

    fetch("http://localhost:3303/cadastrarProduto", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({

            nome: nome,
            lucro: lucro

        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
            if(data.id){
                localStorage.setItem("produtoId", data.id)
                location.reload()
            }
            
            //cadastrarRotulo(event) É colocado no onload do body
        });

    });
}


//colocar condição se nao conseguir mecher
//Session storage cadastrar produto.

/*
async function criaLocalStorageProduto(){       //revisar /rancar fora

    const productData = {
        rotulo: "",
        embalagem: "",
        formula: ""
    };

    productData.rotulo = await getRotulos()
    productData.embalagem = await getEmbalagens()
    productData.formula = await getFormulas()

    localStorage.setItem("productData", JSON.stringify(productData))
    

    return productData
}

async function getRotulos() {       //jogar no main

    var response = await fetch('http://localhost:3303/selectRotulo')
    var data = await response.json()

    return data
}

async function getEmbalagens() {        // vou precisar (Ver)

    var response = await fetch('http://localhost:3303/selectEmbalagem')
    var data = await response.json()

    return data
}

async function getFormulas() {          //jogar no main

    const response = await fetch('http://localhost:3303/selectFormula')
    const data = await response.json()

    return data
}
*/

async function calcularCusto() {              //erro ao remover algo
    var precoCusto = 0

    var precosFormula = document.querySelectorAll(".precoFormula")
    var pFormula=0;
    var formula = document.getElementsByClassName("formula")
    var qtdInicial = 0;
    var qtdTotal = formula.length
    let principal = document.getElementsByClassName("principal")

    for(let x = qtdInicial; x < qtdTotal; x++) {
        if(principal[x].innerHTML == "Padrão" && window.getComputedStyle(formula[x]).display != "none") {
            pFormula += Number(precosFormula[x-qtdInicial].textContent.replace(",",".").replace("R$",""))
            break;
        }
    }
    /*
    precosFormula.forEach(function formula (precoFormula){

        pFormula += Number(precoFormula.textContent.replace(",",".").replace("R$",""))
        
    })
    */

    var precosEmbalagem = document.querySelectorAll(".precoEmbalagem")
    var pEmbalagem = 0;
    let embalagem

    for(let x = 0; x < precosEmbalagem.length; x++) {
        embalagem = document.getElementById(`emb-${x}`)
        if(document.getElementById(`principal-${x}`).checked && window.getComputedStyle(embalagem).display != "none") {
            pEmbalagem += Number(precosEmbalagem[x].textContent.replace(",",".").replace("R$",""))
        }
    }
    /*
    precosEmbalagem.forEach(function embalagem(precosEmbalagem){

        pEmbalagem += Number(parseFloat(precosEmbalagem.textContent.replace(",",".").replace("R$","")))

    })
    */

    var precosRotulo = document.querySelectorAll(".precoRotulo")
    var pRotulo = 0;
    var rotulo = document.getElementsByClassName("rotulo")
    qtdInicial = qtdTotal
    qtdTotal += rotulo.length

    for(let x = qtdInicial; x < qtdTotal; x++) {
        if(principal[x].innerHTML == "Padrão" && window.getComputedStyle(rotulo[x-qtdInicial]).display != "none") {
            pRotulo += Number(precosRotulo[x-qtdInicial].textContent.replace(",",".").replace("R$",""))
        }
    }
    /*
    precosRotulo.forEach(function rotulo (precoRotulo){

        pRotulo += Number(precoRotulo.textContent.replace(",",".").replace("R$",""))
    })
    */

    precoCusto = await pFormula + pRotulo + pEmbalagem
    

    return precoCusto
}

function calcularValorFinal(){          //erro ao remover algo

    var lucro = Number(document.querySelector("#lucro").value.replace("%",""))
    var custo = Number(document.querySelector(".custo").textContent.replace("Custo Total: R$", "").replace(",","."))

    return(custo/((100-lucro)/100))
}   

// innerHTML produto

async function innerHtmlPrecoCusto(){

    var precoCusto =  await calcularCusto()

    document.querySelector(".custo").innerHTML = "Custo Total: " + "R$" + precoCusto.toFixed(2);
    innerHtmlValorFinal()
}

function innerHtmlValorFinal(){

    var valorFinal = calcularValorFinal()

    document.querySelector(".valorFinal").innerHTML = "Valor final: R$" + valorFinal.toFixed(2);
}

function innerHtmlRotulo () {

    const productDataJSON = localStorage.getItem("rotuloData")
    if(!productDataJSON) {
        return console.log("Sem informações de rótulo")
    }
    const productData = JSON.parse(productDataJSON)
    let principalTx
    document.getElementById('rotulos').innerHTML = ""
    for(var j=0; j< productData.length; j++){
        principalTx = ""
        if(productData[j].principal == 1)
            principalTx = "Padrão";

        document.getElementById('rotulos').innerHTML += `
                <div class="row item mt-2 rotulo" id="rotulos${j}">
                    <div class="col">${productData[j].nome}</div>
                    <div class="col">
                        <span class = "precoRotulo">R$${Number(productData[j].preco).toFixed(2)}</span>
                    </div>
                    <div class="col">
                        <span class="principal">${principalTx}</span>
                        <i class="bi bi-x-square ml-3" onclick="removerRotulo('rotulos${j}')"></i>
                    </div>
                </div>
    `
    }
    innerHtmlPrecoCusto()
}

async function removerRotulo(j) {
    document.getElementById(j).setAttribute('style', 'display:none');
    innerHtmlPrecoCusto()
}

async function innerHtmlFormula() {

    const productDataJSON = localStorage.getItem("formulaData")
    const productData = JSON.parse(productDataJSON)
    let principalTx
    if(!productData || productData == null){
        return console.log("Sem informações de fórmula")
    }

    document.getElementById('formulas').innerHTML = ""
    for(var i=0; i< productData.length; i++){
        let preco = 0
        for(var cont = 0; cont < productData[i].MateriasPrimas.length; cont++){
            var response =  await fetch("http://localhost:3303/precoMP", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: Number(productData[i].MateriasPrimas[cont].idMP),
                })
            })
            var data = await response.json()
            if(data.tipo)
                window.alert(`${data.tipo} - ${data.mensagem}`);
            if(data.preco) {
                preco +=  await (Number(data.preco) * parseFloat(productData[i].MateriasPrimas[cont].composicao) / 100)
            }
        }
        principalTx = ""
        if(productData[i].principalMP == 1)
            principalTx = "Padrão";
        document.getElementById('formulas').innerHTML += `
                <div class="row item mt-2 formula" id="formulas${i}">
                    <div class="col">${productData[i].nome}</div>
                    <div class="col">
                        <span class="precoFormula">${await preco}</span>
                        <div>
                            <span class="principal">${principalTx}</span>
                            <i class="bi bi-x-square ml-3" onclick="removerFormula('formulas${i}')"></i>
                        </div>
                    </div>
                </div>
    `
    
    }
    innerHtmlPrecoCusto()
}

async function removerFormula(i) {
    document.getElementById(i).setAttribute('style', 'display:none');
    innerHtmlPrecoCusto()
}

/*
var i = 1
function adicionarEmbalagem(event) {

    event.preventDefault()

    
    i++

    document.querySelector("#embalagens").innerHTML += `
            
            <div class="row item mt-2" id="Embalagem${i}">
                <div class="col">
                    <label for="embalagem-1">Selecione a embalagem:</label>
                    <select name="selectEmb-1" id="embalagem-1" class="form-control campo${i} campo" onchange="innerHtmlPrecoCusto()">
                    </select>
                </div>
                <div class="col dadosProduto${i} dadosProduto">
                    <span class="precoEmbalagem">R$00,00</span>
                    <div>
                        <span>Padrão</span>
                        <i class="bi bi-x-square ml-3" onclick="removerEmbalagem(Embalagem${i})"></i>
                    </div>
                </div>
            </div>

            `
    innerHtmlEmbalagemDropDown()
}


async function innerHtmlEmbalagemDropDown() {
    productData = await getEmbalagens()


    var select = document.querySelectorAll('.campo')

    for(var j = 0; j< select.length; j++){
        for(var i=0; i< productData.length; i++) {

            var emb = JSON.stringify(productData[i].nome).replace('"','').replace('"','');
            var element = document.createElement("option");
            element.classList.add(i)
            element.textContent = emb;
            select[j].appendChild(element);
        }
    }


    innerHtmlEmbalagemValores()
}

var j=0
function innerHtmlEmbalagemValores() {

    const productDataJSON = localStorage.getItem('productData')  
    const productData = JSON.parse(productDataJSON)

    var select = document.querySelectorAll(".campo")



    select.forEach(function (dropdown) {

       

        dropdown.addEventListener("change", function() {
        
            var identificador = dropdown.getAttribute("class").replace(/[^0-9]/g,"");
            // obtém o valor da opção selecionada
            var valorSelecionado = dropdown.value

            valorSelecionado = parseInt(valorSelecionado.replace(/[^0-9]/g,"")) 
            
            document.querySelector(`.dadosProduto${identificador}`).innerHTML = `
                            <span class = "precoEmbalagem">${productData.embalagem[valorSelecionado-1].preco}</span>
                            <div>
                                <span>Padrão</span>
                                <i class="bi bi-x-square ml-3"></i>
                            </div>
    
            `

        });

        j++;
    })
}
*/

function selectEmbalagens(id){
    fetch("http://localhost:3303/selectEmbalagem", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods': '*' }
    }).then(function (res) {
        res.json().then(function (data) {
            document.getElementById(`embalagem-${id}`).innerHTML = ('<option value="0">Embalagem</option>')
            if(data.embalagens){
                for(let cont = 0; cont < data.embalagens.length; cont++){
                    document.getElementById(`embalagem-${id}`).innerHTML += (`
                    <option value="${data.embalagens[cont].id}">${data.embalagens[cont].nome}</option>
                    `)
                }
            }
        });

    });
}

function precoEmbalagem(index){
    fetch("http://localhost:3303/selectEmbalagem", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods': '*' }
    }).then(function (res) {
        res.json().then(function (data) {
            if(data.embalagens){
                const select = document.getElementById(`embalagem-${index}`)
                for(let cont = 0; cont < data.embalagens.length; cont++){
                    if(data.embalagens[cont].id == select.value){
                        document.getElementsByClassName("precoEmbalagem")[index].innerHTML = `R$${Number(data.embalagens[cont].preco).toFixed(2)}`
                    }
                }
                
                innerHtmlPrecoCusto()
            }
        });

    });
}

function addEmbalagem(){
    let qtdEmbalagens = document.getElementsByClassName("embalagem").length
    document.getElementById("embalagens").insertAdjacentHTML('beforeend', `
    <div id="emb-${qtdEmbalagens}" class="row item mt-2 embalagem">
        <div class="col">
            <label for="embalagem-${qtdEmbalagens}">Selecione a embalagem:</label>
            <select name="selectEmb-${qtdEmbalagens}" id="embalagem-${qtdEmbalagens}" class="form-control campo" onchange="precoEmbalagem(${qtdEmbalagens})">
            </select>
        </div>
        <div id="dadosEmb-${qtdEmbalagens}" class="col">
            <span class="precoEmbalagem mt-auto mb-auto">R$00,00</span>
            <div class="addSwitch m-0 p-0">
                <label class="switch">
                    <input id="principal-${qtdEmbalagens}" type="checkbox" checked data-toggle="toggle" data-onstyle="primary" data-offstyle="secondary" data-on="Principal" data-off="Secundario" onchange="innerHtmlPrecoCusto()">
                    <!--<input type="checkbox" id= "s1" class= "lg" value=true>-->
                    <span class="slider round"></span>
                </label>
                <label class="addTexto">Principal</label>
            </div>
            <i class="bi bi-x-square ml-3 mt-auto mb-auto" onclick="removerEmbalagem('emb-${qtdEmbalagens}')"></i>
        </div>
    </div>
    `)
    selectEmbalagens(qtdEmbalagens)
    innerHtmlPrecoCusto()
}

async function removerEmbalagem(j) {
    document.getElementById(j).setAttribute('style', 'display:none');
    innerHtmlPrecoCusto()
}

function embalagensLS(){
    var embalagens = []
    var tags = document.getElementsByClassName("embalagem");
    for(let cont = 0; cont < tags.length; cont++){
        if(window.getComputedStyle(tags[cont]).display != "none"){
            embalagens.push({
                id: Number(document.getElementById(`embalagem-${cont}`).value),
                principal: document.getElementById(`principal-${cont}`).checked,
            })
        }
    }
    localStorage.setItem("embalagemData", JSON.stringify(embalagens))
}

function pHasE(produto){
    var dados = localStorage.getItem("embalagemData")
    if(!dados){
        return console.log("Sem informações de embalagem")
    }
    var id_produto = JSON.parse(localStorage.getItem("produtoId"))
    if(produto)
        id_produto = produto;
    if(!id_produto){
        return console.log("Identificador do produto não encontrado");
    }
    fetch("http://localhost:3303/produtoHasEmbalagem", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            produtoId: parseInt(id_produto),
            dados: JSON.parse(dados)
        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
            if(data.s){
                localStorage.removeItem("embalagemData")
                localStorage.removeItem("produtoId")
            }
        });
    });
}

async function getInfoProduto() {
    innerHtmlRotulo()
    innerHtmlFormula()
    innerHtmlValorFinal()
}