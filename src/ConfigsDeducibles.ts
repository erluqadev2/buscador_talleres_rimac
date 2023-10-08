import { ReglasParametro } from "./ReglasParametro";
import { TranformadorValor } from "./TransformadorValor";

const deducible = new ReglasParametro('deducible',
                                        true,
                                        false,
                                        '\\d{1,2}([.])?\\d{1,2}%',
                                        'BUSQUEDA',
                                        '\\d{1,2}([.])?\\d{1,2}%',
                                        [
                                            new TranformadorValor('NUMBER', 'NO_FORMAT', '%', '')
                                        ]
                                        );
const copago = new ReglasParametro('copago',
                                    true,
                                    false,
                                    '(usd|us\\$|pen|sol|s\\/\\.)(\\s)?[0-9]{1,3}([.][0-9]{1,2})?',
                                    'BUSQUEDA',
                                    '[0-9]{1,3}([.][0-9]{1,2})?',
                                    [
                                        new TranformadorValor('NUMBER')
                                    ]
                                    );
const moneda = new ReglasParametro('moneda',
                                    true,
                                    false,
                                    '(usd|us\\$|pen|sol|s\\/\\.)(\\s)?[0-9]{1,3}([.][0-9]{1,2})?',
                                    'BUSQUEDA',
                                    'usd|us\\$|pen|sol|s\\/\\.',
                                    [
                                        new TranformadorValor('STRING', 'NO_FORMAT', 'usd|us\\$', 'USD'),
                                        new TranformadorValor('STRING', 'NO_FORMAT', 'pen|sol|s\\/\\.', 'PEN')
                                    ]
                                    );
const taller = new ReglasParametro('taller',
                                    false,
                                    true,
                                    'talleres(\\s)?(([a-z])*(\\s)?)*(multimarca|concesionario)?',
                                    'ELIMINACION',
                                    'talleres|afiliados|especiales|preferenciales|concesionario|multimarca');
const tipo = new ReglasParametro('tipo',
                                    false,
                                    false,
                                    'talleres(\\s)?(([a-z])*(\\s)?)*(multimarca|concesionario)?',
                                    'BUSQUEDA',
                                    'multimarca|concesionario',
                                    [
                                        new TranformadorValor('STRING', 'NO_FORMAT', 'multimarca', 'Multimarca'),
                                        new TranformadorValor('STRING', 'NO_FORMAT', 'concesionario', 'Concesionario')
                                    ]
                                    );
const marca = new ReglasParametro('marca',
                                    false,
                                    false,
                                    'marca(\\s)?(([a-z])+[,]?(\\s)?)*(\\s)?([:])?',
                                    'ELIMINACION',
                                    'marca|[:]',
                                    [
                                        new TranformadorValor('STRING', 'UPER', '', '')
                                    ]
                                    );

export const ConfigsDeducibles = [
    deducible,
    copago,
    moneda,
    taller,
    tipo,
    marca
];
