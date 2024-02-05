console.log("funciona");

const listaMusica = ["Dare you to move", "This is home", "Somewhere only we know", "This is your life", "Stay"]

/* Mostrar por defecto todas las canciones de la biblioteca */
let contenedorBusqueda= document.getElementById("lista-general");
listaMusica.forEach(
    song => {
        contenedorBusqueda.innerHTML += `<li><h3>${song}</h3><i class="fa-solid fa-plus"></i><i class="fa-regular fa-heart"></i>
        </li>`
    }
    );
    
/* 1. Obtener value de input-buscador y ejecutar fx según evento*/
let buscador = document.getElementById('input-buscador')
                        //evento   fx
buscador.addEventListener('input', function() {
    cancion = this.value
    /* Regex */
    let expresion = new RegExp(cancion, "i");
     /* Función para comparar input con array */
    const cancionResultado = comparar(cancion, expresion);
});

/* 2. Comparar con la lista */
function comparar(input, expresion){
    let resultadoCancion = listaMusica.filter(
        song => expresion.test(song)
    );
    /* 3. Mostrar resultados */
    let contenedorBusqueda= document.getElementById("lista-general");
   
    contenedorBusqueda.innerHTML = "";
    resultadoCancion.forEach(
        song => {
            contenedorBusqueda.innerHTML += `<li><h3>${song}</h3><i class="fa-solid fa-plus"></i><i class="fa-regular fa-heart"></i>
            </li>`
        }
     
    );
}

