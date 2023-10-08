export class TranformadorValor {

    tipo: 'STRING' | 'NUMBER'
    format: 'NO_FORMAT' | 'LOWER' | 'UPER'
    patron: string;
    valor: string;
    

    constructor(tipo: 'STRING' | 'NUMBER' = 'STRING',
                format: 'NO_FORMAT' | 'LOWER' | 'UPER' = 'NO_FORMAT',
                patron: string = '',
                valor: string = ''
                ) {
        this.tipo = tipo;
        this.format = format;
        this.patron = patron;
        this.valor = valor;
    }
}