class Produto{
    constructor(photo,barcode,produto,quantidade,valorEntrada,valor){
        this._photo = photo;
        this._barcode = barcode;
        this._produto = produto;
        this._quantidade = quantidade;
        this._valorEntrada = valorEntrada;
        this._valor = valor;
    }

   /* get photo(){
        return this._potho;
    }

    set photo(value){
        this._photo = value;
    }*/

    get barcode(){
        return this._barcode;
    }

    set barcode(value){
        this._barcode = value;
    }

    get produto(){
        return this._produto;
    }

    set produto(value){
        this._produto = value;
    }

    get quantidade(){
        return this._quantidade;
    }

    set quantidade(value){
        this._quantidade = value;
    }

    get valorEntrada(){
        return this._valorEntrada;
    }

    set valorEntrada(value){
        this._valorEntrada = value;
    }

    get valor(){
        return this._valor;
    }

    set valor(value){
        this._valor = value;
    }
}