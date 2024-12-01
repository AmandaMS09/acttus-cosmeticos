const { default: API_URL } = require("./constants");

// Inicio modal patrocionio

const openModalButton = document.querySelector("#openModal");
const closeModalButton = document.querySelector("#closeModal");

const modal = document.querySelector("#modal");
const fade = document.querySelector("#fade");

toggleModal = () => {
    modal.classList.toggle("hide");
    fade.classList.toggle("hide");
}

[openModalButton, closeModalButton, fade].forEach(element => {
    element.addEventListener("click", () => toggleModal());
});




// Fim modal

//Adicionar fornecedor
function adicionaFornecedor(event) {
    
    let tamanho = document.getElementsByClassName("linhaFornecedor").length;
    event.preventDefault()
    document.getElementById("fornecedores").insertAdjacentHTML('beforeend', `
            <div id="${tamanho}" class="linhaFornecedor">
                <div>
                    <label for="fornecedor-${tamanho}">Selecione o Fornecedor:</label>
                    <select name="fornecedor-${tamanho}" id="fornecedor-${tamanho}" class="form-control campo fornecedor select-fornecedor">
                        <option value="0">Fornecedor</option>
                        <option value="1">Fornecedor 1</option>
                        <option value="2">Fornecedor 2</option>
                        <option value="3">Fornecedor 3</option>
                        <option value="4">Fornecedor 4</option>
                    </select>
                </div>
                <div class="preco">
                    <label for="preco-${tamanho}">Preco:</label>
                    <input type="text" class="form-control preco inputStyle" id="preco-${tamanho}">
                </div>
                <div class="qtdMinima">
                    <div class="qtdMinima2">
                        <label for="minQtd-${tamanho}">Quantidade Mínima:</label>
                        <input type="text" class="form-control minQtd inputStyle" id="minQtd-${tamanho}">
                    </div>
                    <h3 class="mt-auto" onclick="removerFornecedor(${tamanho})"><i class="bi bi-x-square"></i></h3>
                </div>
               
            </div>`)
}

function removerFornecedor(i) {
    document.getElementById(i).setAttribute('style', 'display:none');
}


function selectFornecedores() {

    const dropdown = document.getElementById("select-fornecedor")
    $(".select-fornecedor").html(`<option value="0">Fornecedor</option>`)
    // Recebe a resposta enviada pela rota de pesquisa no banco de dados
    fetch(`${API_URL}/selectFornecedores`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {

        $("#select-pessoa").append(`<option value="null">fornecedor1</option>`)
        res.json().then(function (data) {

            for (let i = 0; i < data.length; i++) {

                $(".select-fornecedor").append('<option value="' + data[i].id + '">' + data[i].nome + '</option>');
            }
        })
    })
}