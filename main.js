console.log("funciona");

const listaMusica = ["Let your faith...", "Cry", "Dare you to move", "This is home", "Somewhere only we know", "This is your life", "Stay"]


userName = localStorage.getItem('userName')
console.log(userName)
userTitle = document.getElementById('userTitle')
userTitle.innerText = userName

/* Mostrar por defecto todas las canciones de la biblioteca */
let contenedorBusqueda= document.getElementById("lista-general");
listaMusica.forEach(
    song => {
        contenedorBusqueda.innerHTML += `<li><h3 class="cancion">${song}</h3><i class="fa-solid fa-plus"></i><i class="fa-regular fa-heart"></i>
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
    const cancionResultado = comparar(expresion);
    
    let tituloBusqueda= document.getElementById("biblio-titulo");
    if(!this.value){
        tituloBusqueda.textContent = "Biblioteca General";
    }
});


/* 2. Comparar con la lista */
function comparar(expresion){
    let resultadoCancion = listaMusica.filter(
        // Song: canción de c/iteración
        song => expresion.test(song) // Hay alguna coincidencia entre 'song' y la regex?
        // Si la r// es True, el return (implícito) será la presente canción
        );
    /* 3. Mostrar resultados */
    let tituloBusqueda= document.getElementById("biblio-titulo");
    tituloBusqueda.textContent = "Resultados de la búsqueda:";

    let contenedorBusqueda= document.getElementById("lista-general");
    contenedorBusqueda.innerHTML = "";
    resultadoCancion.forEach(
        song => {
            contenedorBusqueda.innerHTML += `<li><h3>${song}</h3><i class="fa-solid fa-plus"></i><i class="fa-regular fa-heart"></i>
            </li>`
        }
    );
}

const logOut = document.getElementById("log-out")
logOut.addEventListener('click',() => {
    localStorage.removeItem('isLogged')
    localStorage.removeItem('userName')
    window.location.href = "./login.html"   
})

// Si no estamos logeados, no vamos a poder entrar a la landing page
if(!localStorage.getItem('isLogged')){
    window.location.href = "./login.html"
}/* else{
    alert("Bienvenido!")
}  */


/* Clases */