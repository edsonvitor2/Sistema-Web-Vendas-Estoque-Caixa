window.onbeforeunload = function(){firebase.database().ref('caixafechado').remove()};
let chave;
let dataCaixa;
let dataVenda;
let pagamento;
let valorVenda;

let caixaFechadoStatus;
let caixaFechadoData;

let valorDi = [0];
let resultDi;
let resultFimDi;

let valorDe = [0];
let resultDe;
let resultFimDe;


let valorCr = [0];
let resultCr;
let resultFimCr;

let valorPix = [0];
let resultPix;
let resultFimPix;


firebase.database().ref('caixafechado').
on('value',snapshot => {
snapshot.forEach(element => {
    let data = element.val();
    let key = element.key;
        
    chave = data.chave;
    //////console.log(chave);
    firebase.database().ref('caixa').child(chave).on
    ('value',snapshot => {
    
        let data = snapshot.val();
        let key2 = snapshot.key;
        dataCaixa = data.data;
        ////console.log(dataCaixa);
        
        document.querySelector("#fundo").value = data.fundoDeCaixa;
        document.querySelector("#data").value = dataCaixa;
        document.querySelector("#status").value = data.status;

        obterVendas();
    })
});
})



function dellCaixa(){
    firebase.database().ref('caixafechado').remove()
}


function fecharCaixa(){
    let status
    firebase.database().ref('caixa').child(chave).on('value',snapshot =>{
        let data = snapshot.val();
        status = data.status;
    })
   
    console.log(status);
    if(status == 'aberto'){

    if(document.querySelector("#meucredito").value == ''|| 
    document.querySelector("#meudebito").value  == ''||
    document.querySelector("#meupix").value  == ''||
    document.querySelector('#meutotal').value  == ''){

        alert('Preencha todos os campos');
        return false;
    }
    status = 'fechado';
    firebase.database().ref('caixa').child(chave).update({
        status
    });
    } else{
        alert('caixa ja esta fechado');
        return false;
    }

    

let dinheiro = document.querySelector("#meudinheiro").value;
let credito = document.querySelector("#meucredito").value;
let debito = document.querySelector("#meudebito").value;
let pix = document.querySelector("#meupix").value;
let total = document.querySelector('#meutotal').value;
let diferenca = document.querySelector('#diferenca').value;
let data = dataCaixa;
 
    firebase.database().ref('fecharCaixa').push().set({

    debito,
    credito,
    dinheiro,
    total,
    diferenca,
    pix,
    data,
    status

    });

    firebase.database().ref('caixafechado').remove();

    alert('caixa fechado com sucesso')
}

function obtercaixafechado(){
firebase.database().ref('fecharCaixa').on('value', snapshot =>{
snapshot.forEach(snapshotItem => {
    let data = snapshotItem.val();

    let status = document.getElementById('status').value;
    caixaFechadoStatus = data.status;
    caixaFechadoData = data.data;

    //console.log(caixaFechadoStatus,caixaFechadoData,dataVenda);
    if(status == 'fechado' && caixaFechadoData == dataCaixa){
document.querySelector("#meudinheiro").value = data.dinheiro;
document.querySelector("#meucredito").value = data.credito;
document.querySelector("#meudebito").value = data.debito;
document.querySelector("#meupix").value = data.pix;
document.querySelector('#diferenca').value = data.diferenca;
document.querySelector('#meutotal').value = data.total;
    }else{
        console.log('caixa aberto');
    }

    
})
})
}

function obterVendas(){
    firebase.database()
    .ref('venda')
    .on('value',snapshot=>{
    snapshot.forEach(snapshotItem => {
    let chave = snapshotItem.key;
    let data = snapshotItem.val();

    dataVenda = data.data;
    pagamento = data.formaDEpagamento;
    valorVenda = data.valor;
    console.log(dataVenda);
if(pagamento == 'dinheiro' && dataVenda == dataCaixa){
    ////
    if(valorDi == 0){
        valorDi.pop();
        valorDi.push(valorVenda);
        console.log(valorDi[0]);
        document.getElementById("dinheiro").value = valorDi[0];
        }
        else{
            valorDi.push('+',valorVenda);
            
            resultDi = valorDi.join('');
            
            resultFimDi = eval(resultDi);
            console.log(resultFimDi);
            document.getElementById("dinheiro").value = resultFimDi;
        } 
}else if(pagamento == 'debito' && dataVenda == dataCaixa){
    if(valorDe == 0){
        valorDe.pop();
        valorDe.push(valorVenda);

        document.getElementById("debito").value = valorDe
        }
        else{
            valorDe.push('+',valorVenda);
            
            resultDe = valorDe.join('');
            
            resultFimDe = eval(resultDe);
        
            document.getElementById("debito").value = resultFimDe;
        } 
}
else if(pagamento == 'credito' && dataVenda == dataCaixa){
    if(valorCr == 0){
        valorCr.pop();
        valorCr.push(valorVenda);

        document.getElementById("credito").value = valorCr
        }
        else{
            valorCr.push('+',valorVenda);
            
            resultCr = valorCr.join('');
            
            resultFimCr = eval(resultCr);
        
            document.getElementById("credito").value = resultFimCr;
        } 
}else if(pagamento == 'pix' && dataVenda == dataCaixa){
    if(valorPix == 0){
        valorPix.pop();
        valorPix.push(valorVenda);

        document.getElementById("pix").value = valorPix
        }
        else{
            valorPix.push('+',valorVenda);
            
            resultPix = valorPix.join('');
            
            resultFimPix = eval(resultPix);
        
            document.getElementById("pix").value = resultFimPix;
        } 
}


})
totalVenda();
})
}


function totalVenda(){
let dinheiro = document.querySelector("#dinheiro").value;
let credito = document.querySelector("#credito").value;
let debito = document.querySelector("#debito").value;
let pix = document.querySelector("#pix").value;

if(debito == ''){
    debito = '0';
}
if(credito == ''){
    credito = '0';
}
if(dinheiro == ''){
    dinheiro = '0';
}
if(pix == ''){
    pix = '0';
}

let a = parseInt(dinheiro);
let b = parseInt(debito);
let c = parseInt(credito);
let d = parseInt(pix);

let result = a + b + c +d;

document.querySelector('#total').value = result;
obtercaixafechado();
}

function meutotalVenda(){
let dinheiro = document.querySelector("#meudinheiro").value;
let credito = document.querySelector("#meucredito").value;
let debito = document.querySelector("#meudebito").value;
let pix = document.querySelector("#meupix").value;

if(debito == ''){
    debito = '0';
}
if(credito == ''){
    credito = '0';
}
if(dinheiro == ''){
    dinheiro = '0';
}
if(pix == ''){
    pix = '0';
}

let a = parseInt(dinheiro);
let b = parseInt(debito);
let c = parseInt(credito);
let d = parseInt(pix);

let meuresult = a + b + c +d;
let resultCaixa = document.querySelector('#total').value;

let diferenca = meuresult - resultCaixa;

document.querySelector('#diferenca').value = diferenca;
document.querySelector('#meutotal').value = meuresult;

}

