window.onbeforeunload = function(){firebase.database().ref('abrirCaixa').remove()};

class Vendas{
    constructor(){
        this.dataCaixa;
        this.a;

        this.valorDe = [0];
        this.resultDe;
        this.resultFimDe;
        this.resultFimDe2;

        this.valorCr = [0];
        this.resultCr;
        this.resultFimCr;
        this.resultFimCr2;

        this.valorDi = [0];
        this.resultDi;
        this.resultFimDi;
        this.resultFimDi2;

        this.valorPix = [0];
        this.resultPix;
        this.resultFimPix;
        this.resultFimPix2;
          
        this.obtercaixa();
        this.listardados();
        this.valores();
        
        this.listardadosCaixa();
        //this.chamarValortotal();
    }

    chamarValortotal(){
        setInterval(() => {
            console.log('mostrar total')
            this.valortotal();
        }, 5000);
    }
valortotal(){
let dinheiro = document.querySelector('#dinheiro').value;
let debito = document.querySelector('#debito').value;
let credito = document.querySelector('#credito').value;
let pix = document.querySelector('#pix').value;

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

let a = dinheiro.toString().replace(".", "");
let b = debito.toString().replace(".", "");
let c = credito.toString().replace(".", "");
let d = pix.toString().replace(".", "");

let e = a.toString().replace(",", ".");
let f = b.toString().replace(",", ".");
let h = c.toString().replace(",", ".");
let i = d.toString().replace(",", ".");

let result = [e,'+',f,'+',h,'+',i];

let resultFim2 = result.join('');

let g = eval(resultFim2);

let t = (new Intl.NumberFormat('pt-BR',{minimumFractionDigits: 2}).format(g));

document.querySelector('#total').value = t;
}

valores(){
firebase.database()
.ref('venda')
.on('value',snapshot=>{
snapshot.forEach(snapshotItem => {
let chave = snapshotItem.key;
let data = snapshotItem.val();


if(data.formaDEpagamento == 'credito' && data.data == this.dataCaixa)
{
    //console.log('ok')
    if(this.valorCr == 0){
        this.valorCr.pop();
        this.valorCr.push(data.valor);

        let a = (new Intl.NumberFormat('pt-BR',{minimumFractionDigits: 2}).format(this.valorCr));

        document.getElementById("credito").value = a;
    }
    else
    {
        this.valorCr.push('+',data.valor);
        
        this.resultCr =  this.valorCr.join('');
        
        this.resultFimCr = eval(this.resultCr);
        
        this.resultFimCr2 = (new Intl.NumberFormat('pt-BR',{minimumFractionDigits: 2}).format(this.resultFimCr));

        console.log(this.resultFimCr2);
        document.getElementById("credito").value = this.resultFimCr2;
    }
}else if(data.formaDEpagamento == 'debito' && data.data == this.dataCaixa){
    if( this.valorDe == 0){
        this.valorDe.pop();
        this.valorDe.push(data.valor);

        let a = (new Intl.NumberFormat('pt-BR',{minimumFractionDigits: 2}).format(this.valorDe));

        document.getElementById("debito").value = a;
    }
    else
    {
        this.valorDe.push('+',data.valor);
        
        this.resultDe =   this.valorDe.join('');
        
        this.resultFimDe = eval(this.resultDe);

        this.resultFimDe2 = (new Intl.NumberFormat('pt-BR',{minimumFractionDigits: 2}).format(this.resultFimDe));

        console.log(this.resultFimDe2);
        document.getElementById("debito").value = this.resultFimDe2;
    }  
    
}else if(data.formaDEpagamento == 'dinheiro' && data.data == this.dataCaixa){
    if(this.valorDi == 0){
        this.valorDi.pop();
        this.valorDi.push(data.valor);
        
        let a = (new Intl.NumberFormat('pt-BR',{minimumFractionDigits: 2}).format(this.valorDi));

        document.getElementById("dinheiro").value = a;
    }
    else
    {
        this.valorDi.push('+',data.valor);
        
        this.resultDi =  this.valorDi.join('');
        
        this.resultFimDi = eval(this.resultDi);
       
        this.resultFimDi2 = (new Intl.NumberFormat('pt-BR',{minimumFractionDigits: 2}).format(this.resultFimDi));

        console.log(this.resultFimDi2);
        document.getElementById("dinheiro").value = this.resultFimDi2;
    } 
}else if(data.formaDEpagamento == 'pix' && data.data == this.dataCaixa){
    if(this.valorPix == 0){
        this.valorPix.pop();
        this.valorPix.push(data.valor);
        
        let a = (new Intl.NumberFormat('pt-BR',{minimumFractionDigits: 2}).format(this.valorPix));

        document.getElementById("pix").value = a;
    }
    else
    {
        this.valorPix.push('+',data.valor);
        
        this.resultPix =  this.valorPix.join('');
        
        this.resultFimPix = eval(this.resultPix);
        
        this.resultFimPix2 = (new Intl.NumberFormat('pt-BR',{minimumFractionDigits: 2}).format(this.resultFimPix));

        console.log(this.resultFimPix2);
        document.getElementById("pix").value = this.resultFimPix2;
    } 
}
});
this.valortotal();
});
}
listardados(){
let tabela = document.getElementById('tabela');

let database = firebase.database();
database.ref('venda').on('value',snapshot=>{

    tabela.innerText ='';

    snapshot.forEach(snapshotItem => {
    let chave = snapshotItem.key;
    let dados = snapshotItem.val();
    ////console.log(dados.data);

    if(dados.data == this.dataCaixa){
        let pagamento = dados.formaDEpagamento;
    let troco = dados.troco;
    let volta = dados.volta;
    let valor = dados.valor;
    
    let li = document.createElement('table');

    li.innerHTML = ` 
    <div>  
        <th class="pagamento">${pagamento}</th>
        <th class="troco">${troco}</th>
        <th class="volta">${volta}</th>
        <th class="valor">${valor}</th>
    </div>
    `;
    tabela.appendChild(li);
   
    }
    
    })
})
}
getFirebaseRef(){
    return firebase.database().ref('abrirCaixa');
}
obtercaixa(){
this.getFirebaseRef().on('value',snapshot=>{

        snapshot.forEach(snapshotItem => {
            let key = snapshotItem.key;
            let data  = snapshotItem.val();

            this.dataCaixa = data.dat; 
        });
    });
}
//chave,pagamento,troco,volta,valor
voltarCaixas(){
    firebase.database().ref('abrirCaixa').remove();
}



listardadosCaixa(){
firebase.database().ref('abrirCaixa').
on('value',snapshot => {
snapshot.forEach(element => {
    let data = element.val();
    let key = element.key;
    console.log(data.key);
    
    firebase.database().ref('caixa').child(data.key).on
    ('value',snapshot => {
    
        let data = snapshot.val();
        let key = snapshot.key;
        document.querySelector("#fundo").value = data.fundoDeCaixa;
        document.querySelector("#data").value = data.data;
        document.querySelector("#status").value = data.status;
    })
});
})
}


}

const vendas = new Vendas;
/**/