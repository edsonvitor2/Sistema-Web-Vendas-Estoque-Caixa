class Caixa {
    constructor(){
        this.status = '';
        this.id;
        this.fundoDeCaixa;
        this.data;
        this.mes;
        this.key;

        this.statusSaida;
        this.fundoDeCaixaSaida;
        this.getData();
    }

    getData(){
        let data = new Date();
        let ano = data.getFullYear();
        console.log(ano);
        return ano;
    }
    
    getFirebaseRef(){
        return firebase.database().ref('caixa');
    }

enviarDados(){
    if(document.querySelector("#fundo").value =='' || 
    document.querySelector("#data").value =='' ){
        alert('Preencha todos os Campos');
        return false;
    }
    caixa.status = 'aberto';
    caixa.fundoDeCaixa = document.querySelector("#fundo").value;
    caixa.data = document.querySelector("#data").value;
    let date = new Date();  // Ano, mês e dia
    let month = date.toLocaleString('default', { month: 'long' });
    caixa.mes = month;
    console.log(month);
    this.getFirebaseRef().push(caixa);
    
    alert("Caixa Aberto com Sucesso")
    document.querySelector("#data").value = "";
    document.querySelector("#fundo").value = "";
    //this.receberDados();
}

listarDados(month){
    
this.getFirebaseRef().on('value',snapshot=>{
        
    let tabela = document.getElementById('tabela');
    tabela.innerText ='';

    snapshot.forEach(snapshotItem => {
    let chave = snapshotItem.key;
    let data = snapshotItem.val();
    //console.log(chave,data);

    let status = data.status;
    let id = chave;
    let fundo= data.fundoDeCaixa;
    let mes = data.mes;

    if(mes == month){
    let li = document.createElement('table');
    let btn = document.createElement('button');
    let btn2 = document.createElement('button');
    li.innerHTML = ` 

    <td class="data" id="datas" >DATA : ${data.data} </td>
    <td class="fundo">FUNDO : ${fundo}</td>
    <td class="total">TOTAL VENDIDO : ${'--'}</td> 
    <td class="id">STATUS : ${status}</td>
    <td class="id">ID : ${id}</td>
    <td <a href="vendas.html">
    
    
`;
btn.innerHTML = `
<button type="button" >Abrir</button>  
`;
btn2.innerHTML = `
<button type="button" >Fechar caixa</button>  `;

tabela.appendChild(li);
tabela.appendChild(btn);
tabela.appendChild(btn2);
this.obterdata(btn,data,chave);
this.fechamento(btn2,data,chave);
    }

});
});

}
obterdata(btn,data,chave){
    let database = firebase.database();
    let date = data;
    let key = chave;
    let dat = date.data
    btn.addEventListener('click', e=>{

        database.ref('abrirCaixa').push().set({
            dat,
            key
        });

        window.open("vendas.html");
})
}

fechamento(btn2,data,chave){;
btn2.addEventListener('click', e=>{
    if(data.status == 'fechado'){
        console.log('caixa ja esta fechado');
        firebase.database().ref('caixafechado').push().set({
            chave
        })
        window.open("fecharCaixa.html");
    }else{
    firebase.database().ref('caixafechado').push().set({
        chave
    })
    window.open("fecharCaixa.html");
    }
    })
} 
formatDate(){
    let n_char;
    n_char = document.getElementById('data').value.length;

    if(n_char == 2){
        document.getElementById('data').value =  document.getElementById('data').value + '/';
    }else if(n_char == 5){
        document.getElementById('data').value =  document.getElementById('data').value + '/';
    }
}

}
const caixa = new Caixa();


