console.log("funciona");

const listaMusica = ["Dare you to move", "This is home", "Somewhere only we know", "This is your life", "Stay"]

/* 1. Obtener value de input-buscador y ejecutar fx según evento*/
let buscador = document.getElementById('input-buscador')
                        //evento   fx
buscador.addEventListener('input', function() {
    /* console.log(this.value); */
    cancion = this.value
    /* Regex */
    let expresion = new RegExp(cancion, "i");
     /* Función para comparar input con array */
    const cancionResultado = comparar(cancion, expresion);

    /* if(cancionResultado.length == 0){
        alert("No hay coincidencias")
    } */
    console.log(cancionResultado)
    /* console.log(cancionResultado) */
});

/* 2. Comparar con la lista */
function comparar(input, expresion){
    let resultadoCancion = listaMusica.filter(
        song => expresion.test(song)
    );
    /* const resultadoCancion = listaMusica.filter((cancion) => {
        if(cancion == input){ 
            return(cancion)
        }
    }
    ) */
    /* return(resultadoCancion); */
    /* 3. Mostrar resultados */
    let contenedorBusqueda= document.getElementById("lista-general");

    /* console.log(contenedorBusqueda) */
     
    resultadoCancion.forEach(
        song => {
            contenedorBusqueda.innerHTML = "";
            contenedorBusqueda.innerHTML += `<li><h3>${song}</h3><i class="fa-solid fa-plus"></i><i class="fa-regular fa-heart"></i>
            </li>`
        }
     
    );
}

