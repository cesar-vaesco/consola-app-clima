require('dotenv').config();

const { inquirerMenu, pausa, leerInput, listarLugares } = require('./helper/inquirer');
const Busquedas = require('./models/busqueda');



/* console.log(process.env.MAPBOX_KEY); */
/* api.openweathermap.org/data/2.5/weather?lat=19.60972&lon=-99.06&appid=f369635965b00ad16ced5da4da4b9f3b&units=metric&lang=es */

const main = async () => {

    const busquedas = new Busquedas();

    let opt;

    do {

        //Función que imprime el menú
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                //Mostrar mensaje
                const terminoBusqueda = await leerInput('Ciudad :');

                //Buscar los lugares
                const lugares = await busquedas.ciudad(terminoBusqueda);

                //Seleccionar el lugar


                const idSeleccionado = await listarLugares(lugares);
                /* console.log({ idSeleccionado }); */
                if (idSeleccionado === '0') continue;


                const lugarSeleccionado = lugares.find(lugar => lugar.id === idSeleccionado);
                /* console.log(lugarSeleccionado); */

                /* console.log('Lugares: ', lugares); */
                /* console.log('terminoBusqueda: ', terminoBusqueda); */

                // Guardar en DB
                busquedas.agregarHistorial(lugarSeleccionado.nombre);

                //Datos de clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);
                /* console.log(clima); */


                //Mostrar resultados
                console.log('\nInformación de la ciudad\n'.green);
                console.log(`\nCiudad:  ${lugarSeleccionado.nombre}`.cyan);
                console.log('Lat:', lugarSeleccionado.lat);
                console.log('Lng:', lugarSeleccionado.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.max);
                console.log('Máxima:', clima.min);

                console.log(`Como está el clima: ${clima.desc.green}`);
                break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(` ${idx} ${lugar}`);

                })
                break;


        }

        await pausa();
        /* if (opt !== 0) await pausa(); */


    } while (opt !== 0);

}


main();
