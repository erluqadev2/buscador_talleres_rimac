import { ReglasParametro, TranformadorValor } from "./ReglasParametro";

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
        const lineas = texto.split('\n');
        let lineasConParametros = this.filtrarTextosCumplenReglasObligatorias(lineas);
        if (lineasConParametros.length == 0) {
            return [];
        }
        if (lineasConParametros.length > 1) {
            lineasConParametros = this.filtrarTextosCumplenReglasPriorizadas(lineasConParametros);
        }
        const valoresParametros = this.obtenerValoresParametros(lineasConParametros);
        return valoresParametros;
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
        const result = {
            nombre: regla.nombre,
            valor: ''
        }
        const textoLowerCase = texto.toLocaleLowerCase();
        const resultExec = new RegExp(regla.patronBusqueda).exec(textoLowerCase.toLocaleLowerCase());
        
        if (resultExec != null) {
            const coincidencia = resultExec[0];
            if (regla.tipoPatronValorObtener == 'BUSQUEDA') {
                const rgxExecCoincidencia = new RegExp(regla.patronValorObtener).exec(coincidencia);
                result.valor = rgxExecCoincidencia == null ? '' : rgxExecCoincidencia[0];
            } else {
                result.valor = coincidencia.replace(new RegExp(regla.patronValorObtener, 'g'), '').trim();
            }
        }
        if (result.valor != '') {
            result.valor = this.transformarValor(texto, textoLowerCase, result.valor, regla.transformacionValores);
        } else {
            result.valor = 'NO_' + regla.nombre.toUpperCase()
        }
        return result;
    }

    cumpleReglas(texto: string, reglasObligatorias: ReglasParametro[]) : boolean {
        console.log('-- cumpleReglas --');
        const results = reglasObligatorias.map((regla) => this.cumplePatronBusqueda(texto, regla.patronBusqueda));
        return results.every((value) => value);
    }

    cumplePatronBusqueda(texto: string, patronBusqueda: string): boolean {
        console.log('-- cumplePatronBusqueda --');
        const rgx = new RegExp(patronBusqueda)
        const result = rgx.test(texto.toLocaleLowerCase());
        return result;
    }

    transformarValor(textoOriginal: string, textoLowerCase: string, valor: string, reglaTransformacion: TranformadorValor[] | null): string {
        if (reglaTransformacion == null) {
            const idx = textoLowerCase.indexOf(valor);
            const valorOriginal = textoOriginal.substring(idx, idx + valor.length);
            return valorOriginal;
        } else {
            const findTransform = reglaTransformacion.find((transform: TranformadorValor) => new RegExp(transform.patron).test(valor));
            if (findTransform !== null && findTransform !== undefined) {
                return findTransform.valor;
            }
        }
        return valor;
    }

}