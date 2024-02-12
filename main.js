class Song{
    constructor({name, artist, duration, album, gender, year, isFav = false, onPlayList = false, urlCover, urlSong}){
        this.name = name;
        this.artist = artist;
        this.duration = duration;
        this.album = album;
        this.gender = gender;
        this.year = year;
        this.isFav = isFav;
        this.onPlayList = onPlayList;
        this.urlCover = urlCover;
        this.urlSong = urlSong;
    }

    getName(){
        return(this.name);
    };

    getArtist(){
        return(this.artist);
    }
}

class Playlist{
    constructor({listName, songs = []}){
        this.listName = listName;
        this.songs = songs;
    }

    addSong(...song){
        this.songs.push(...song)
    }

    removeSong(song){
        const index = this.songs.indexOf(song);
        if (index === -1) return // Esto indica que no encontró la canción
        this.songs.splice(index, 1) // Si existe la canción, se borra usando su posición(index), solo ese elemento ('1')
        this.renderList(idContainer); // Por c/vez que eliminemos una nueva canción a la lista, el html que muestra la lista se actualiza, y se muestra todo menos la canción borrada
    }

    renderList(lista = this.songs){
        let contenedor= document.getElementById("lista-general");
        /* Muestra todas las canciones de la lista en cuestión */
        contenedor.innerHTML = "";
        lista.forEach(
            song => {
                contenedor.innerHTML += `<li><h3 class="cancion">${song.name}</h3><i class="fa-solid fa-plus"></i><i class="fa-regular fa-heart"></i>
                </li>`  // Aquí hará falta validar si song.isFav = true (y así), varíen los botones de favorito, playlist...
            });
    };

    renderListBtn(btnValue, lista = this.songs){
        let btn = new RegExp(btnValue, "i");
        let contenedor2= document.getElementById("lista-general-2");

        console.log(contenedor2)

        // Acá hay que añadir un event listener, para que este código entre en acción cuando se presionen los respectivos botones

        if(btn.test(this.listName)){
        /* Muestra todas las canciones de la lista en cuestión */
            contenedor2.innerHTML = "";
            lista.forEach(
                song => {
                    contenedor2.innerHTML += `<li><h3 class="cancion">${song.name}</h3><i class="fa-solid fa-plus"></i><i class="fa-regular fa-heart"></i>
                    </li>`
                });  // Aquí hará falta validar si song.isFav = true (y así), varíen los botones de favorito, playlist...
        }
    }

    searchBy(met, listaCanciones = this.songs){
        const buscador = document.getElementById("input-buscador")
        listaCanciones = this.songs;

        buscar();

        function buscar (){
                                    //evento   fx
            buscador.addEventListener('input', function() {
                let input = this.value;
                /* Regex */
                let expresion = new RegExp(input, "i");
                /* Función para comparar input con array */
                const inputResultado = comparar(listaCanciones, expresion);
                /* console.log(inputResultado) */
    
                let tituloBusqueda= document.getElementById("biblio-titulo");
                if(!this.value){
                    tituloBusqueda.textContent = "Biblioteca General";
                }else{
                    tituloBusqueda.textContent = "Resultados de la búsqueda:";
                }
                met(inputResultado)
                return(inputResultado)
            });
        }

        function comparar(lista, expresion){
            /* console.log(lista); */
            let resultadoCancion = lista.filter(
                // Song: canción de c/iteración
                song => expresion.test(song.name) || expresion.test(song.artist) || expresion.test(song.album) || expresion.test(song.gender)// Hay alguna coincidencia entre 'song' y la regex?
                // Si la r// es True, el return (implícito) será la presente canción
            );
            return(resultadoCancion)
        
        }
    }
}

class MusicPlayer{
    constructor({currentPlayList = []}){
        this.currentPlayList = currentPlayList;
        this.currentSongIndex = 0;
    }

    reproductor() {
        // Obtener el botón play
        const playButton = document.getElementById("play");
        // Obtener el botón de stop
        const stopButton = document.getElementById("stop");
        // Obtener el botón de prev
        const prevSongButton = document.getElementById("prevSong");
        // Obtener el botón de next
        const nextSongButton = document.getElementById("nextSong");

        // Crear instancia de Audio
        const audio = document.getElementById("audio");

        // Establecer la URL de la primera canción
        const songs = this.currentPlayList;
        audio.src = songs[0].urlSong;
        console.log("current song", audio.src)

        // Event listener
        playButton.addEventListener('click', function() {
            console.log("Funciona el clic");
            if (audio.paused == false) {
                audio.pause();
            } else {
                audio.play();
            }
        });

        //Event listener de los otros botones

        stopButton.addEventListener('click', function () {
            audio.pause();
            audio.currentTime = 0;
        });

        prevSongButton.addEventListener('click', function () {
            if (this.currentSongIndex > 0) {
            this.currentSongIndex--;
            } else {
            this.currentSongIndex = songs.length - 1;
            }

            audio.src = songs[this.currentSongIndex].urlSong;
            audio.play();
        }.bind(this));

        nextSongButton.addEventListener('click', function () {
            if (this.currentSongIndex < songs.length - 1) {
            this.currentSongIndex++;
            } else {
            this.currentSongIndex = 0;
             }

            audio.src = songs[this.currentSongIndex].urlSong;
            audio.play();
         }.bind(this));
        }
    }

    /* Los métodos a crear acá se comunicarán con el HTMLAudioElement. 
    Cuando se de click en el music player, estos métodos invocarán a su vez los métodos propios del HTMLAudioElement, y se podrán reproducir las canciones*/

    /* Al parecer, el HTMLAudioElement solo admite 1 canción por vez. En tal caso, es necesario guardar la canción a la que le demos play en una variable, y eso enviarlo al objeto audio, y luego disparar la fx play */
    
    //Voy a tratar de incluir los otros botones en la misma class de Music player
    //No se pueden agregar dos constructores en la misma clase


/* Crear lista de nuevas canciones */
const songs = [
    new Song({
    name: "Stay",
    artist: "Robbie Seay Band",
    duration: "05:00",
    album: "Give yourself away",
    gender: "Christian rock",
    year: 2018,
    urlSong: "./src/songs/stay.mp3",
    urlCover: ".src/img/robbie_giveYourselfAway.jpg"

}),
    new Song({
    name: "This is home",
    artist: "Switchfoot",
    duration: "03:00",
    album: "Chronicles of Narnia",
    gender: "Christian rock",
    year: 2008,
    urlSong: "./src/songs/this_is_home.mp3",
    urlCover: "./src/img/switchfoot_narnia.jpg"

}),
    new Song({
    name: "Let your faith be not alone",
    artist: "Keane",
    duration: "02:50",
    album: "Hopes and fears",
    gender: "Rock",
    year: 2002,
    urlSong: "./src/songs/letyourfaith.mp3",
    urlCover: "./src/img/robbie_miracle.jpg"

})]

console.log(songs)

/* Crear nueva canción */
/* const letyourfaith = new Song({
    name: "Let your faith be not alone",
    artist: "Robbie Seay Band",
    duration: "06:00",
    album: "Miracles",
    gender: "Christian rock",
    year: 2020,
    urlSong: "./src/songs/letyourfaith.mp3"
}) */
/* Crear nuevos playlists */
const biblioGeneral = new Playlist({
    listName: "Biblioteca General"
})
const myPlaylist = new Playlist({
    listName: "My PlayList"
})

/* Agregar canciones al playlist */
biblioGeneral.addSong(...songs)
console.log(biblioGeneral.songs)
/* Mostrar playlist en su container */
biblioGeneral.renderList()
/* Ejecutar la búsqueda (lado izq) */
biblioGeneral.searchBy(biblioGeneral.renderList)

/* Agregar canción a playlistt */
/* myPlaylist.addSong(letyourfaith) */
/* Mostrar playlist en su container */
myPlaylist.renderListBtn("My PlayList")

/* Music Player */
const musicPlayer = new MusicPlayer({
    currentPlayList: biblioGeneral.songs,
})

console.log("Music Player", musicPlayer.currentPlayList)
musicPlayer.reproductor()
