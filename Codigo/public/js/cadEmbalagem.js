var idFor=1;
var contTot=1;

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


// Função de ligar nova embalagem ao fornecedor
function cadastrarFornecedorAEmbalagem(event) {

    event.preventDefault()
    
    let fornecedores = [];

    for(let cont = 0; cont < document.getElementsByClassName("subdireita3").length; cont++){
        fornecedores.push({
            idForne: document.getElementsByClassName("select-fornecedor")[cont].value,
            valor: document.getElementsByClassName("valorClass")[cont].value,
        })
    }
    localStorage.setItem("fornecedores", JSON.stringify(fornecedores));
    
    
    
   

    /*fetch("http://localhost:3303/cadastraFornecedorHasEmbalagem", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods': '*' },
        body: JSON.stringify({

            nome: nome,
            value: value,
            tamanho: tamanho
               
        })
    }).then(function (res) {
        res.json().then(function (data) {
            if (data.tipo) {
                window.alert(`${data.mensagem}`)
                console.log(data.mensagem), JSON.stringify()
            }
        });
    });*/
}