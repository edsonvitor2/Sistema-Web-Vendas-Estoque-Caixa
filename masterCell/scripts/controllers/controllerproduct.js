
class ProductController{

    constructor(formId, formIdUpdate, tableID){
        this.formEl = document.getElementById(formId);
        this.formElUpdate = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableID);
        this.abrirMenu = false;
        
        this.keyChange;
        this.imgAntiga;

        this.onsubmit();
        this.listarDados();
        this.initButtons();
    }

initButtons(){
    let excluir = document.getElementById("excluir");

    let EditorProdutos = document.getElementById("editorProd");

    let fecharEditor = document.querySelector(".fecharEditor");

    let ConfirmSenha = document.getElementById("confirmar");

excluir.addEventListener("click", e =>{
console.log("ecluir")
firebase.database().ref("produto").child(this.keyChange).remove();

document.querySelector("#barcode-Editor").value ="";
document.querySelector("#produto-Editor").value = "";
document.querySelector("#NumeroProduto-Editor").value = "";
document.querySelector("#valor-Editor").value =
"";document.querySelector("#valorEntrada-Editor").value = ""; 
document.querySelector(".photoUp").src = "";
})

    let fechar = document.getElementById("fechar");

    this.formElUpdate.addEventListener("submit", event =>{
       
    event.preventDefault();

let barcode = document.getElementById("barcode-Editor").value;
let name = document.getElementById("produto-Editor").value;
let quantidade = document.getElementById("NumeroProduto-Editor").value;
let valor = document.getElementById("valor-Editor").value.toString().replace(",", ".");
let valorEntrada = document.getElementById("valorEntrada-Editor").value.toString().replace(",", ".");

let key = this.keyChange;

let file = document.getElementById("add-Photo").files[0];
let r = new FileReader();

if(file == undefined){
    let photo = this.imgAntiga;
     
    firebase.database().ref('produto').child(key).update({
        photo,barcode,name,quantidade,valor,valorEntrada
    });
}else{
    r.onload = function(e) {
    let photo = r.result;
     
    firebase.database().ref('produto').child(key).update({
        photo,barcode,name,quantidade,valor,valorEntrada
    });
    }
    r.readAsDataURL(file);
}

});

    
EditorProdutos.addEventListener("click", e =>{
        
        let password = document.querySelector(".BoxSenha");

        if(this.abrirMenu == false){
            password.style.transform = "translateX(0%)";
            this.abrirMenu = true;
        }else{
            password.style.transform = "translateX(-500%)";
            this.abrirMenu = false;
        }
    });

    fecharEditor.addEventListener("click", e =>{
        this.fecharEditor();
    });

fechar.addEventListener("click", e =>{
        let password = document.querySelector(".BoxSenha");

        if(this.abrirMenu == true){
            password.style.transform = "translateX(-500%)";
            this.abrirMenu = false;
        }
    });

ConfirmSenha.addEventListener("click", e =>{
    let passwordBox = document.querySelector(".BoxSenha");

    let password = document.querySelector("#password").value;
    console.log(password);
    firebase.database().ref('senha').on('value',snapshot=>{
        let senha = snapshot.val();
        if(password == senha){
            console.log("senha Correta");
            if(this.abrirMenu == true){
                passwordBox.style.transform = "translateX(-500%)";
                this.abrirEditor();
                this.abrirMenu = false;
            }else{
                console.log("senha Incorreta");
            }
        }else{
            console.log("senha Incorreta");
        }
    });
});
}

abrirEditor(){
    document.getElementById("password").value = "";
    let editor = document.querySelector(".EditorDeProduto");
    editor.style.transform = "translateY(0%)";
}
fecharEditor(){
    let editor = document.querySelector(".EditorDeProduto");
    editor.style.transform = "translateY(-200%)";
}

onsubmit(){
    this.formEl.addEventListener("submit", event =>{

        event.preventDefault();
        
        let values = this.getValues(this.formEl);

        this.getPhoto().then(
            (content)=>{
                values.photo = content;
                
                this.addLine(values);
            },
            (e)=>{
                console.error(e)
            }
        );
    });
}

getPhoto(){

    return new Promise((resolve,reject)=>{
        let fileReader = new FileReader;

        let elements = [...this.formEl.elements].filter(item=>{
            if (item.name ==="photo") {
                return item;
            }
        });
    
        let file = elements[0].files[0];
        
        fileReader.onload = ()=>{
            resolve(fileReader.result);
        };
        fileReader.onerror = (e)=>{
            reject(e);
        };

        if(file){
            fileReader.readAsDataURL(file);
        } else{
            resolve("img/photofundosemimgksjidjertfsderffgtrecsdadekgtofkemorjfigtredswkfrmdnrgtioresdfwertkfdswdergtirejdsaqwe.png");
        }
        
    });
}

getValues(formEl){
let user = {};

[...formEl.elements].forEach(function(field, index) {
    user[field.name] = field.value;
});
    
return new Produto(
    user.photo,
    user.barcode, 
    user.name,
    user.quantidade,
    user.valorEntrada,
    user.valor,
    );

}
addLine(produto){
console.log(produto);
    let photo = produto.photo;
    let barcode = produto.barcode;
    let name = produto.produto;
    let quantidade = produto.quantidade;
    let valorEntrada = produto.valorEntrada.toString().replace(",", ".");
    let valor = produto.valor.toString().replace(",", ".");

    if(name == "" || quantidade == ""|| valorEntrada == ""|| valor == ""){
        alert("preencha todos os campos")
        return false;
    }

    firebase.database().ref('produto').push({
        photo,barcode,name,quantidade,valorEntrada,valor
    });

    document.getElementById("barcode").value = "";
    document.getElementById("produto").value = "";
    document.getElementById("NumeroProduto").value = "";
    document.getElementById("valorEntrada").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("photo").value = "";

}

listarDados(){
    
firebase.database().ref('produto').on('value',snapshot=>{
    this.tableEl.innerText='';
    snapshot.forEach(prod=>{
        
        let key = prod.key;
        let produto = prod.val();

        let tr = document.createElement("tr");

        tr.dataset.produto = JSON.stringify(produto);

        let valorEntrada = parseFloat(produto.valorEntrada);
        let valorSaida = parseFloat(produto.valor);
        
        let lucro = (valorSaida - valorEntrada).toFixed(2);

tr.innerHTML = 
`<td><img src="${produto.photo}" alt=""class="photo" id="img"></td>
<td class="id">${produto.barcode}</td>
<td class="name">${produto.name}</td>
<td class="qtd">${produto.quantidade}</td>
<td class="valor">${produto.valorEntrada}</td>
<td class="valor">${produto.valor}</td>
<td class="valor">${lucro}</td>
`;
    this.tableEl.appendChild(tr);

tr.addEventListener("click", e=>{

    this.listarEditor(key);
    this.keyChange = key;
});
});  
});

}
listarEditor(key){
    firebase.database().ref('produto').child(key).on('value',snapshot=>{
        let produto = snapshot.val();

        document.querySelector("#barcode-Editor").value = produto.barcode;
        document.querySelector("#produto-Editor").value = produto.name;
        document.querySelector("#NumeroProduto-Editor").value = produto.quantidade;
        document.querySelector("#valor-Editor").value = produto.valor;
        document.querySelector("#valorEntrada-Editor").value =  produto.valorEntrada;
        document.querySelector(".photoUp").src = produto.photo;
        document.querySelector(".image-Editor").src = produto.photo;

        this.imgAntiga = produto.photo;
});
}

}

