import { ReglasParametro } from "./ReglasParametro";
import { TranformadorValor } from "./TransformadorValor";

export class Parametrizador {

    private parametros : string[];
    private reglasParametros: ReglasParametro[];


    constructor(reglasParametros: ReglasParametro[]) {
        this.reglasParametros = reglasParametros;
        this.parametros = this.obtenerParametros();
    }

    obtenerParametros() {
        return this.reglasParametros.map(rp => rp.nombre);
    }

    evaluar(texto: string): object[] {
        console.log('-- evaluar --');
        const lineas = texto.split('\n');
        console.log(lineas);
        let lineasConParametros = this.filtrarTextosCumplenReglasObligatorias(lineas);
        console.log(lineasConParametros);
        if (lineasConParametros.length == 0) {
            return [];
        }
        if (lineasConParametros.length > 1) {
            lineasConParametros = this.filtrarTextosCumplenReglasPriorizadas(lineasConParametros);
        }
        const valoresParametros = this.obtenerValoresParametros(lineasConParametros);
        return this.formatearResultado(valoresParametros);
    }

    filtrarTextosCumplenReglasObligatorias(textos: string[]): string[] {
        const reglasObligatorias = this.reglasParametros.filter((regla) => regla.obligatorio);
        return textos.filter((texto) => this.cumpleReglas(texto, reglasObligatorias));
    }

    filtrarTextosCumplenReglasPriorizadas(textos: string[]): string[] {
        const reglasPriorizadas = this.reglasParametros.filter((regla) => regla.priorizado);
        return textos.filter((texto) => this.cumpleReglas(texto, reglasPriorizadas));
    }

    obtenerValoresParametros(textos: string[]) {
        return textos.map((texto) => {
            const result = this.reglasParametros.map((regla) => {
                return this.obtenerValorReglaParametro(texto, regla);
            })
            return result;
        })
    }

    obtenerValorReglaParametro(texto: string, regla: ReglasParametro) {
        console.log('-- obtenerValorReglaParametro --');
        const result : { nombre: string, valor: string | number } = {
            nombre: regla.nombre,
            valor: ''
        }
        const textoLowerCase = texto.toLocaleLowerCase();
        const resultExec = new RegExp(regla.patronBusqueda).exec(textoLowerCase.toLocaleLowerCase());
        if (resultExec === null) {
            result.valor = this.getValorNoEncontradoDefaultParametro(regla.nombre);
            return result;
        }
        const coincidencia = resultExec[0];
        if (regla.tipoPatronValorObtener == 'BUSQUEDA') {
            const rgxExecCoincidencia = new RegExp(regla.patronValorObtener).exec(coincidencia);
            result.valor = rgxExecCoincidencia == null ? '' : rgxExecCoincidencia[0];
        } else {
            result.valor = coincidencia.replace(new RegExp(regla.patronValorObtener, 'g'), '').trim();
        }
        if (result.valor != '') {
            result.valor = this.transformarValor(texto, textoLowerCase, result.valor, regla.transformacionValores);
        } else {
            result.valor = this.getValorNoEncontradoDefaultParametro(regla.nombre);
        }
        return result;
    }

    getValorNoEncontradoDefaultParametro(nombre: string) {
        return 'NO ' + nombre.toUpperCase();
    }

    cumpleReglas(texto: string, reglasObligatorias: ReglasParametro[]) : boolean {
        console.log('-- cumpleReglas --');
        const results = reglasObligatorias.map((regla) => this.cumplePatronBusqueda(texto, regla.patronBusqueda));
        return results.every((value) => value);
    }

    cumplePatronBusqueda(texto: string, patronBusqueda: string): boolean {
        console.log('-- cumplePatronBusqueda --');
        console.log(texto);
        console.log(patronBusqueda);
        const rgx = new RegExp(patronBusqueda)
        const result = rgx.test(texto.toLocaleLowerCase());
        console.log(result);
        return result;
    }

    transformarValor(textoOriginal: string, textoLowerCase: string, valor: string, transformadores: TranformadorValor[] | null): string | number {
        if (transformadores !== null && transformadores.length > 0) {
            return this.transformarPorReemplazoYTipo(valor, transformadores);
        }
        return this.transformarAValorOriginal(textoOriginal, textoLowerCase, valor);
    }

    transformarAValorOriginal(textoOriginal: string, textoLowerCase: string, valor: string) {
        const idx = textoLowerCase.indexOf(valor);
        const valorOriginal = textoOriginal.substring(idx, idx + valor.length);
        return valorOriginal;
    }

    transformarPorReemplazoYTipo(valor: string, transformadores: TranformadorValor[]): string | number {
        let transform: TranformadorValor | undefined = transformadores[0];
        if (transformadores.length > 1) {
            transform = transformadores.find((transform: TranformadorValor) => new RegExp(transform.patron).test(valor));
        }
        if (transform === undefined) {
            return valor;
        }
        let valorTransformado = valor;
        if (transform.patron !== '') {
            valorTransformado = valor.replace(new RegExp(transform.patron, 'g'), transform.valor);
        }
        if (transform.tipo === 'NUMBER') {
            return this.transformarANumber(valorTransformado)
        }
        if (transform.tipo === 'STRING' && transform.format !== 'NO_FORMAT') {
            return transform.format === 'LOWER' ? valorTransformado.toLocaleLowerCase() : valorTransformado.toUpperCase();
        }
        return valorTransformado;
    }

    transformarANumber(valor: string): number {
        return parseFloat(valor);
    }

    formatearResultado(valoresParametros: {nombre: string, valor: string | number}[][]): object[] {
        return valoresParametros.map((item) => {
            const result: any = {};
            for (const param of item) {
                result[param.nombre] = param.valor
            }
            return result;
        });
    }

}