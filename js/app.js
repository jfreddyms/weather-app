const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);

});

function buscarClima(e) {
    e.preventDefault();

    //validando campos
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad ==='' || pais ==='') {
        mostrarError('Ambos campos son obligatorios');
        return;
    };

    //consultado la API
    consultarAPI(ciudad, pais);
};

function consultarAPI(ciudad, pais) {

    //api
    const key = 'c7dbdcb85f7f3d3a6092b7c576509c97'
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${key}`;

    spinner()// muestra un spinner antes de mostrar toda la informacion

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            // console.log(datos)
            limpiarHTML()

            if (datos.cod === "404") {
                mostrarError('City not Found')
                // formulario.reset();
                return;
            };

            //imprime la respuesta en el HTML
            mostrarClima(datos);
        })
        .catch(error => console.log(error))  
};

function mostrarClima(datos) {
    // console.log(datos)

    const { name, main:{temp, temp_max, temp_min, humidity }} = datos;

    const centigrados = kelivinACentigrados(temp);// pasando los grados de kelvin a centigrados
    const centigradosMax = kelivinACentigrados(temp_max)
    const centigradosMin = kelivinACentigrados(temp_min)

    const nombreCiudad = document.createElement('P');
    nombreCiudad.textContent = `The Weather in ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl')

    const tempNormal = document.createElement('p');
    tempNormal.innerHTML = `${centigrados} &#8451;`;
    tempNormal.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${centigradosMax} &#8451;`;
    tempMaxima.classList.add('text-xl');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${centigradosMin} &#8451;`;
    tempMinima.classList.add('text-xl');

    const humitidyActual = document.createElement('p');
    humitidyActual.innerHTML = `Humitidy: ${humidity} %`;
    humitidyActual.classList.add('text-xl');

    const resultadoDiv = document.createElement('DIV');
    resultadoDiv.classList.add('text-center', 'text-white');

    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(tempNormal);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);
    resultadoDiv.appendChild(humitidyActual);

    resultado.appendChild(resultadoDiv);

    formulario.reset();
};

const kelivinACentigrados = grados => parseInt(grados - 273.15);

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    };
    
}

function mostrarError(mensaje) {

    const alerta = document.querySelector('.bg-red-100');

    if (!alerta) {
        //creamos la alerta
        const alerta = document.createElement('DIV');

        alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded',
        'max-w-md','mx-auto','mt-6','text-center');

        alerta.innerHTML = `
            <strong class='font-bold'>Error!</strong>
            <span class='block'>${mensaje}</span>
        `;

        container.appendChild(alerta);
        
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    };
};

function spinner() {

    limpiarHTML();
    
    const spinnerDiv = document.createElement('div');
    spinnerDiv.classList.add('sk-fading-circle');

    spinnerDiv.innerHTML = `
    
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    `;

    resultado.appendChild(spinnerDiv);
};