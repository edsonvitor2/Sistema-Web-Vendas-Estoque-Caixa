    var key;
    var keySelect;
    var produto;
    var pesquisa;
    var itens = [];
    var tableEl = document.getElementById("lista");

function getStatusCaixa(){
firebase.database().ref('caixa').on('value',snapshot=>{
    snapshot.forEach(element => {
        let caixa = element.val();
        let keyCaixa = element.key;

        let data = new Date().toLocaleDateString(); 

        if(caixa.data === data){
            if(caixa.status == "aberto"){

                document.getElementById("status").innerText = caixa.status;
                document.getElementById("data").innerText = caixa.data;

                getProducts();
            }
        }
    });
});  
}

getStatusCaixa();

function getproduct(){
    var returnProd = [];
    firebase.database().ref('produto').on('value',snapshot=>{
        snapshot.forEach(prod=>{
            
            returnProd.push(prod.val());
        });
    });
    return returnProd;
}

function getProducts(){
    tableEl.innerText = "";
firebase.database().ref('produto').on('value',snapshot=>{
    snapshot.forEach(prod=>{
        
        produto = prod.val();
        key = prod.key;

        addHtml(produto.name,produto.photo);
        itens.push(produto.name,produto.photo);
        
        
    });
});
}

function addHtml(item,photo){
    let div = document.createElement('div');
    
    div.innerHTML = 
    `<ul class="listas">
    <li><img src="${photo}" class="photo"></li>
    <li class="nomeItem">${item}</li>
    </ul>`;
    tableEl.append(div);
    initLi(div);
}

function initLi(li){
li.addEventListener('click',e =>{
let nome = li.innerText;
    firebase.database().ref('produto').on('value',snapshot=>{
        snapshot.forEach(prod=>{
            
            let produto = prod.val();
            console.log(nome);
            console.log(produto.name);
            

            if(produto.name == nome){
                AddVenda(produto);
                keySelect = prod.key;
                //mandar para campo venda
            } else{
                console.log('nome diferente');
            }
        });
    });
});
}

function AddVenda(produto){

    document.querySelector(".FormVendaName").value = produto.name;
    document.querySelector(".FormVendaQuantidade").value = 1;
    document.querySelector(".FormVendaValor").value = produto.valor;

}

function obterValorX(){
    let quantidade =   document.querySelector(".FormVendaQuantidade").value;
    
    firebase.database().ref('produto').child(keySelect).on
    ('value',snapshot => {
        let produto = snapshot.val();

        let valor = produto.valor;
        let result = ( quantidade * valor).toFixed(2);

        document.querySelector(".FormVendaValor").value = result;
    });
}

function obtertroco(){
   
    let troco = document.querySelector(".FormVendaTroco").value;
    let valor = document.querySelector(".FormVendaValor").value;
    let result = (troco - valor).toFixed(2);
    console.log(result);
    document.querySelector(".FormVendaVoltar").value = result;
}

function vendaUnica(){
let data = new Date().toLocaleDateString();
let nome = document.querySelector(".FormVendaName").value;
let valor = document.querySelector(".FormVendaValor").value;
let troco = document.querySelector(".FormVendaTroco").value;
let volta = document.querySelector(".FormVendaVoltar").value;
let formaDEpagamento = document.querySelector(".pagamento").value;
var quantidade = document.querySelector(".FormVendaQuantidade").value;

firebase.database().ref('venda').push({
    data,nome,troco,volta,quantidade,formaDEpagamento,valor
});

    diminuirProduto(keySelect,quantidade);
    
document.querySelector(".FormVendaName").value = "";
document.querySelector(".FormVendaValor").value = "";
document.querySelector(".FormVendaTroco").value = "";
document.querySelector(".FormVendaVoltar").value = "";
document.querySelector(".pagamento").value = "";
document.querySelector(".FormVendaQuantidade").value = "";

alert("Venda Realizada Com Sucesso!!!");
document.location.reload(true);
}

function diminuirProduto(key,quant){
    console.log('aaaaaaaa');
    let quantidade;
    firebase.database().ref('produto').child(key).
    on('value',snapshot => {
    
    let produto = snapshot.val();
    let qtd2 = quant;
    let qtd = produto.quantidade;
    
    quantidade = qtd - qtd2;
    console.log(quantidade);

    });

    firebase.database().ref('produto').child(key).update({
        quantidade
    });

}


function pesquisar(){
    let image;
    var name = [];
    var img=[];
    let item;
    let produto;
    let key; 

    itens.forEach(e =>{
        if(e.length < 90){
            name.push(e);
            item = name;
        }else{
            img.push(e);
            image = img;
        }
    });

    pesquisa = document.querySelector("input[type='search']");

    pesquisa.oninput = () => {
        tableEl.innerHTML = "";
        item.filter((item) =>
        item.toLowerCase().includes(pesquisa.value.toLowerCase())
        ).forEach(item =>{

            firebase.database().ref('produto').on('value',snapshot=>{
                snapshot.forEach(prod=>{
                    
                produto = prod.val();
                key = prod.key;

                console.log(item);
                console.log(produto.name);

                switch (item) {
                case produto.name:
                img = produto.photo;
                console.log("receber imagem");
                addHtml(item,img);
                break;
            }
                });
            });
        });
    }
}function 


addProdutoCarrinho(){
let chave;
let nome;
let valor = document.querySelector(".FormVendaValor").value;
let quantidade = document.querySelector(".FormVendaQuantidade").value;

firebase.database().ref('produto').child(keySelect).
    on('value',function(snapshot) {
        let data = snapshot.val();
        let key = snapshot.key;
        
        chave = key;
        nome = data.name;
    });

    console.log(chave,nome,quantidade);

    diminuirProduto(chave,quantidade);

    firebase.database().ref('carrinho').push({
        chave,nome,quantidade,valor
    });
    document.location.reload(true);
}

function listarCarrinho(){
    let valor = [];
    let lista = document.getElementById('car');
    firebase.database()
    .ref('carrinho')
    .on('value',snapshot=>{
            
        lista.innerText ='';
    
            snapshot.forEach(snapshotItem => {
                let chave = snapshotItem.key;
                let data = snapshotItem.val();

                console.log(data.valor);
                
                if(valor == ""){
                    valor.push(data.valor);
                }else{
                    valor.push("+",data.valor);
                }
    
                let a = valor.join('');
                let b = eval(a);
                console.log(b);

                document.querySelector(".inputCar").value = b.toFixed(2);

                let nome = data.nome;
                let quantidade = data.quantidade;
                
                let li = document.createElement('div');
                let btn = document.createElement('div');
    
    li.innerHTML = ` 
        <div>  
        <br>
            <li>${nome}</li>
            <li>Quantidade ${quantidade}x</li>
        </div>
        
    `;
    
    btn.innerHTML= ` 
    <div>  
    <button type="button" id="apagar" class="btnCar" >Retirar</button>
        </div>
        
    `;    
        lista.appendChild(li);
        lista.appendChild(btn);
        this.selectProduto(chave,data,btn);  
            
        });
    });
        
    }
function selectProduto(chave,data,btn){
        
        btn.addEventListener('click',e =>{
        let keyCar = chave;
        let keyProduto = data.chave;
        let quantidade;
        let qtd = data.quantidade;

        firebase.database().ref('produto').child(keyProduto).
        on('value',function(snapshot) {
            let data = snapshot.val();
            let key = snapshot.key;
    
            let a = [data.quantidade,'+', qtd];
            
            let b = a.join('');
            quantidade = eval(b);
            console.log(quantidade);
        });

        firebase.database().ref('carrinho').child(keyCar).remove();

        firebase.database().ref('produto').child(keyProduto).update({
            quantidade
        });
    
    })
    }

function obterTrocoCarrinho(){
    let valor = document.querySelector(".inputCar").value;
    let troco = document.querySelector(".inputCartroco").value;
    
    let result = (troco - valor).toFixed(2);
    
    document.querySelector(".inputCarvolta").value = result;
        
    }

function finalizarVendaCarrinho(){
    let data = new Date().toLocaleDateString();
    let valor = document.querySelector(".inputCar").value;
    let troco = document.querySelector(".inputCartroco").value;
    let volta = document.querySelector(".inputCarvolta").value;
    let formaDEpagamento = document.querySelector("#pag").value;
     console.log(formaDEpagamento);
    firebase.database().ref('venda').push({
        data,troco,volta,formaDEpagamento,valor
    });

    document.querySelector(".inputCar").value = "" ;
    document.querySelector(".inputCartroco").value = "" ;
    document.querySelector(".inputCarvolta").value = "" ;
    document.querySelector("#pag").value = "" ;

    firebase.database().ref('carrinho').remove();
    alert("Venda Realizada Com Sucesso!!!");
}

function obterScan(){
let barcode = document.querySelector("#barcode").value;
let date = new Date().toLocaleDateString();
firebase.database().ref('caixa').on('value',snapshot=>{
    snapshot.forEach(caixa =>{
        
        let data = caixa.val();
        
        if(data.data == date){
           
            if(data.status == "aberto"){
                console.log('data bate e caixa aberto');
            }else{
                console.log('data nao bate caixa fechado');
                alert("CAIXA FECHADO!!!");
            }
        }else{
            
        }
        
    });
});

firebase.database().ref('produto').on('value',snapshot=>{
    snapshot.forEach(prod=>{
        
        let key = prod.key;
        let produto = prod.val();
        
        if(produto.barcode == barcode){
            keySelect = key;
            AddVenda(produto);
            console.log("produto selecionado");
        }else{
            console.log("produto não existe");
        }
        
    });
});
}
    
    listarCarrinho();