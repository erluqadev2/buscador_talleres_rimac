import { loadFeature, defineFeature } from 'jest-cucumber';
const feature = loadFeature('Parametrizador.feature', { loadRelativePath: true, errors: true });
import { Parametrizador } from '../src/Parametrizador';
import { ConfigsDeducibles } from '../src/ConfigsDeducibles';


defineFeature(feature, (test) => {

    test('Póliza con deducible texto plano', ({ given, when, then }) => {
  
      let request;
      let result;
      let response;
  
      given(/^la póliza tiene un deducible en forma del (.*)$/, ( texto ) => {
        console.log(texto);
        request = require(`./requests/${texto}.json`);
      });
  
      when('ejecutamos el conversor de deducible', async () => {
        const texto = request.payload.text;
        console.log('-- texto --');
        console.log(texto);
        const parametrizador = new Parametrizador(ConfigsDeducibles);
        result = parametrizador.evaluar(texto);
        console.log('-- result --');
        console.log(result);
        response = {
            payload : result
        };
      });
  
      then(/^obtenemos la parametrización del deducible en (.*)$/, ( detalle ) => {
        const respuestaEsperada = require(`./responses/${detalle}.json`);
        expect(response).toEqual(respuestaEsperada);
      });
    });
  
  });
  
  