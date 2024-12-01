const API_URL='https://acttus-cosmeticos.vercel.app'

function addMP(indice){
    switch(indice){
        case 1:
            var id = "cardMp1"
            break;
        case 2:
            var id = "cardMp2"
            break;
        case 3:
            var id = "cardMp3"
            break;
            
    }
    let qntMP = document.getElementsByClassName("infoPasso").length;
    document.getElementById(id).insertAdjacentHTML('beforeend', `
    <div class="infoPasso" id="linha-${qntMP}">
        <div id="passoId-${qntMP}" style="display:none">
            ${indice}
        </div>
        <div class="selecaoMP">
            <label for="selecao"> Selecione a materia prima:</label>
            <select name="selectMP-${qntMP}" id="MP-${qntMP}" class="form-control campo">
                
            </select>
        </div>
        <div class="composicao">
            <label for="composicao"> Composição:</label>
            <input type="text" name="inputComposicao" id="inputComposicao-${qntMP}" class="inputs">
        </div>
        <div class="divDelete">
            <button class="buttonDelete" onclick="removerMP(${qntMP})">X</button>
        </div>
    </div>
    `)
    selectMP(qntMP)
}

function removerMP(i){
    document.getElementById(`linha-${i}`).setAttribute('style', 'display:none')
}


function selectMP(indice) {
    // Recebe a resposta enviada pela rota de pesquisa no banco de dados
    fetch(`${API_URL}/listarMateriaPrima`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        res.json().then(function (data) {

            document.getElementById(`MP-${indice}`).innerHTML =`<option value="0">Materia Prima</option>`

            for (let i = 0; i < data.materiaPrima.length; i++) {

                document.getElementById(`MP-${indice}`).innerHTML += ('<option value="' + data.materiaPrima[i].id + '">' + data.materiaPrima[i].nome + '</option>');
            }
        })
    })
}


function materiaPrimaLS(){
    var arrayMP = []
    var inputNome = document.getElementById("inputNome").value
    var principalMP = document.getElementById("principal-0").checked
    {
    if(principalMP)
        principalMP=1;
    else
        principalMP=0;
    }
    var tags = document.getElementsByClassName("infoPasso")
    for(let cont = 0; cont < tags.length; cont++){
        if(window.getComputedStyle(tags[cont]).display != "none"){
            arrayMP.push({
                passo: document.getElementById(`passoId-${cont}`).innerHTML.trim(),
                idMP: document.getElementById(`MP-${cont}`).value,
                composicao: document.getElementById(`inputComposicao-${cont}`).value
            })
        }
    }
    let formulas = []
    if (localStorage.getItem('formulaData')) {
        formulas = JSON.parse(localStorage.getItem('formulaData'))
    }
    formulas.push({
        nome:inputNome,
        principalMP,
        MateriasPrimas:arrayMP
    })
    localStorage.setItem("formulaData", JSON.stringify(formulas))
}