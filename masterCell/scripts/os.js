let telefone = [];
let key;
let produto;
let itens = [];
let tabela = document.getElementById('lista');
let pesquisar;

function pdf(){
    var pegar_dados = document.getElementById('main').innerHTML;

    var janela = window.open('','','width=800','heigth=600');

    var style = "<style>";
        style = style + 
        "table { width: 100%;font: 12px Calibri;}";
        style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
        style = style + "padding: 2px 3px;text-align: center;}";
        style = style + "div.nome2{ width: 12%;float: left;margin-top: 10px;}";
        style = style + "div.input-nome2{width: 82.5%;float: left;margin-top: 10px;background-color:#011324;}";
        style = style + "div.telefone2{width: 14%;float: left;margin-top: 10px;}div.input-telefone2{width: 80.5%;float: left;margin-top: 10px;background-color: #011324;}";
        style = style + "div.endereço2{width: 14%;float:left;margin-top: 10px;}div.input-endereço2{width: 80.5%;float: left;margin-top: 10px;background-color: #011324;}";
        style = style + "div.modelo2{width: 14%;float: left;margin-top: 10px;}div.input-modelo2{width: 38%;float: left;margin-top: 10px;background-color: #011324;}";
        style = style + "div.valor2{width: 9%;float: left;margin-left: 10px;margin-top: 10px;}div.input-valor2{width: 10.5%;float: left;margin-top: 10px;background-color: #011324;}div.data2{width: 8%;float: left;margin-left: 10.5px;margin-top: 10px;}div.input-data2{width: 12%;float: left;margin-top: 10px;margin-bottom: 15px;background-color: #011324;}";

        style = style + ".pin{width: 100%;float: left;border: solid;}.pass{width: 30%;float: left;height: 50px;margin-left: 20px;}.pas{width:100%;height: 50px;}";
        
        style = style + ".senhas{width: 100%;height: 200px;}.senha2{width:35%;height: 50px;float: left;margin: 12px;}.senha3{width: 20%;height: 50px;float: left;margin: 12px;}.pin2{width: 30%;height: 50px;float: left;margin: 12px;}.s{height: 40px;}.b{height: 40px;width: 20%;border: solid;border-radius: 500px;}";

        style = style + "</style>";

    janela.document.write('<html><head>');
    janela.document.write(style);
    janela.document.write('<title>PDF</title></head>');
    janela.document.write('<body>');
    janela.document.write(pegar_dados);
    janela.document.write('</body></html>');
    janela.document.close();
    janela.print();
}
function setarDados(){
var nome = document.getElementById('name').value;
var telefone = document.getElementById('telefone').value;
var endereco = document.getElementById('endereço').value;
var modelo = document.getElementById('modelo').value;
var data = document.getElementById('data').value;
var valor = document.getElementById('valor').value;
var pin = document.getElementById('pin').value;
var senha = document.getElementById('senha').value;

if(nome == '' || telefone == '' || endereco == '' || modelo == ''  || data == '' || valor == ''){
alert('preencha todos os campos');
return false;
}
document.getElementById('oS-name').innerHTML = nome;
document.getElementById('oS-name2').innerHTML = nome;
document.getElementById('oS-telefone').innerHTML = telefone;
document.getElementById('oS-endereco').innerHTML = endereco;
document.getElementById('oS-modelo').innerHTML = modelo;
document.getElementById('oS-data').innerHTML = data;
document.getElementById('oS-valor').innerHTML = valor;

guardarOs()

}
function formatDate(){
    let n_char;
    n_char = document.getElementById('data').value.length;

    if(n_char == 2){
        document.getElementById('data').value =  document.getElementById('data').value + '/';
    }else if(n_char == 5){
        document.getElementById('data').value =  document.getElementById('data').value + '/';
    }
}
function formatCell(){
    let n_char;
    n_char = document.getElementById('telefone').value.length;

    if(n_char == 2){
        document.getElementById('telefone').value = '(' + document.getElementById('telefone').value + ')'
    }else if(n_char == 9){
        document.getElementById('telefone').value =  document.getElementById('telefone').value + '-';
    }
}

function guardarOs(){
var nome = document.getElementById('name').value;
var telefone = document.getElementById('telefone').value;
var endereco = document.getElementById('endereço').value;
var modelo = document.getElementById('modelo').value;
var data = document.getElementById('data').value;
var valor = document.getElementById('valor').value;
var pin = document.getElementById('pin').value;
var senha = document.getElementById('senha').value;
let descricao = document.getElementById('descricao').value;
firebase.database().ref('Ordem').push().set({
    nome,
    telefone,
    endereco,
    modelo,
    data,
    valor,
    pin,
    senha,
    descricao
}); 
}

function marcar(a){
    if(document.getElementById(a).innerHTML == ''){
        document.getElementById(a).innerHTML = 'X';
    }else{
        document.getElementById(a).innerHTML = '';
    }
}

function addHtml(item,key,produto){
    let div = document.createElement('div');
    div.innerHTML = item;
    tabela.append(div);
    initLi(div,key,produto);
}
function initLi(li,key,produto){
    
li.addEventListener('click',e =>{ 
    
let nome = li.innerHTML;

firebase.database().ref('Ordem').on('value',snapshot=>{

snapshot.forEach(snapshotItem => {
    
    let key = snapshotItem.key;
    let data  = snapshotItem.val();
    console.log(nome);

    if(data.nome == nome){
document.getElementById('name').value = data.nome;
document.getElementById('telefone').value = data.telefone;
document.getElementById('endereço').value = data.endereco;
document.getElementById('modelo').value = data.modelo;
document.getElementById('data').value = data.data;
document.getElementById('descricao').value = data.descricao;
document.getElementById('valor').value = data.valor;
document.getElementById('pin').value = data.pin;
document.getElementById('senha').value = data.senha;
    
    }
    else{
        console.log('deu errado');
        
    }
});
});


});
}
function listarProdutos(){ 
    firebase.database().ref('Ordem').on('value',snapshot=>{
        
snapshot.forEach(snapshotItem => {
    
    key = snapshotItem.key;
    produto  = snapshotItem.val();

    addHtml(produto.nome,key,produto);
    itens.push(produto.nome);
});
});
}
listarProdutos();
function pesquisa(){
    
    let item = itens;
    pesquisar = document.querySelector("input[type='search']");
    pesquisar.oninput = () => {
        let a = key;
        let b = produto;
        console.log(a);
        tabela.innerHTML = "";

        item.filter((item) =>
        item.toLowerCase().includes(pesquisar.value.toLowerCase())
        ).forEach((item)=> addHtml(item,a,b));
    };
}