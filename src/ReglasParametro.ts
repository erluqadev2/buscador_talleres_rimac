export class TranformadorValor {
    patron: string = '';
    valor: string = '';

    constructor(patron: string, valor: string) {
        this.patron = patron;
        this.valor = valor;
    }
}

export class ReglasParametro {

    nombre: string = '';
    obligatorio: boolean = false;
    priorizado: boolean = false;
    patronBusqueda: string = '';
    tipoPatronValorObtener : 'BUSQUEDA' | 'ELIMINACION';
    patronValorObtener: string = '';
    transformacionValores: TranformadorValor[] | null;

    constructor(nombre: string,
                obligatorio: boolean,
                priorizado: boolean,
                patronBusqueda: string,
                tipoPatronValorObtener: 'BUSQUEDA' | 'ELIMINACION',
                patronValorObtener: string,
                transformacionValores: TranformadorValor[] | null = null) {
        this.nombre = nombre;
        this.obligatorio = obligatorio;
        this.priorizado = priorizado;
        this.patronBusqueda = patronBusqueda;
        this.tipoPatronValorObtener = tipoPatronValorObtener;
        this.patronValorObtener = patronValorObtener;
        this.transformacionValores = transformacionValores;
    }
}