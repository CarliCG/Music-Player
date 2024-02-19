/* Validaciones conscernientes al Login */
/* setTimeout(() => {
    if(!localStorage.getItem('isLogged')){ 
        console.log('no estas logeado', localStorage.getItem('isLogged'))
    }
}, 1000) */
/* Si no estás loggeado, te redirige al login. No puedes acceder al Music player */
    
    /* Para hacer log out... */ 
    const logoutBtn = document.getElementById('logout')
    logoutBtn.addEventListener('click', () => {
        console.log("salir")
        localStorage.removeItem('isLogged')
        localStorage.removeItem('userName')
        window.location.href = "./login.html"
    })
    
    /* Para mostrar el nombre de usuario en el navbar, una vez loggeado */
    let user = localStorage.getItem('userName')
    let userTitle = document.getElementById('userTitle')
    userTitle.innerText = user
    
    /* Definir clases */
    class Song{
        constructor({id, name, artist, duration, album, gender, year, isFav = false, onPlayList = false, urlCover, urlSong}){
            this.id = id;
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

        // Añadir los métodos que faltan, por c/atributo de la clase
    }
    
    class Playlist{
        constructor({listName, container, songs = []}){
            this.listName = listName;
            this.container = container;
            this.songs = songs;
        }
    
        addSong(...song){
            this.songs.push(...song)
            this.renderList()// Por c/vez que agreguemos una nueva canción a la lista, el html que muestra la lista se actualiza, y se muestra todo menos la canción borrada
        }
        removeSong(song){
            const index = this.songs.indexOf(song);
            if (index === -1) return // Esto indica que no encontró la canción
            this.songs.splice(index, 1) // Si existe la canción, se borra usando su posición(index), solo ese elemento ('1')
            this.renderList(); 
        }
    
        
        renderList(lista = this.songs, container = this.container){
            let contenedor = document.getElementById(container);
            /* Muestra todas las canciones de la lista en cuestión */
            contenedor.innerHTML = "";
            lista.forEach(
                song => {
                    contenedor.innerHTML += `<li onClick='changeCurrentSong(${song.id}, ${JSON.stringify(lista)})' ><h3 class="cancion" data-idSong=${song.id}>${song.name}</h3><i class="fa-solid fa-plus"></i><i class="fa-regular fa-heart"></i>
                    </li>`  
                });
        };
        
    
        // Añadir un método que nos permita renderizar las listas de Fav y My Playlist según el botón al que demos click
        // Ahora que lo pienso, tal vez haga falta tener c/una en contenedores diferentes, para evitar problemas durante la revisión de proyecto (sorry)

        // También hace falta una fx que nos permita añadir y quitar a Favs y MyPlaylist (ya existe el método removeSong), y cambiar según eso los íconos de las canciones (usar los atributos isFav y onList de la clase Song, cambiar sus valores c/vez que demos click en los respectivos botones)
    
        // Método Buscar (por canción, artista, álbum, género)
        searchBy(met, listaCanciones = this.songs){
            // Captura la barra de input donde ingresamos la canción a buscar
            const buscador = document.getElementById("input-buscador")
            listaCanciones = this.songs;
            // Buscamos según el valor de ese input
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
                    // Muestra los resultados en la sección izquierda, y retorna los mismos 
                    met(inputResultado, "lista-general")
                    return(inputResultado, "lista-general")
                });
            }
            
            // Todos los filtros aplicados al input para hallar coincidencias están aquí
            function comparar(lista, expresion){
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
        // Se carga playlist al MusicPlayer. De esa forma, podremos navegarla con los botones
        addPlayList(...songs){
            this.currentPlayList.push(...songs)
        }
        // Elimina la playlist actual cada vez que sea necesario cargar una nueva
        removePlayList(){
            this.currentPlayList = [];
            this.currentSongIndex = 0;
        }
        // Seteamos cuál es el index de la canción que hemos seleccionado. De esa forma, se empieza a reproducir desde esa canción. Por defecto está seteado en 0
        setCurrentSong(index){
            this.currentSongIndex = index
        }
        // Generamos el UI del MusicPlayer, e iniciamos los controladores, con los datos que ya hemos cargado al mismo
        renderMusicPlayer(){
            const song = this.currentPlayList[this.currentSongIndex]
            // 1. Generamos el UI
            generateMusicPlayer(song)
            // 2. Iniciamos/actualizamos los controladores
            this.reproductor()
        }
        // Esta función se ejecuta cuando hacemos click en una canción, independientemente de su lista, para reproducirla
        playFromList(){
            const audio = document.getElementById("audio");
            // Está planteado de esta forma para que no hayan conflictos al reproducir y luego pausar, hacer stop, o navegar la lista
            if(this.currentSongIndex !== undefined){
                audio.pause()
                audio.src = this.currentPlayList[this.currentSongIndex].urlSong
                audio.oncanplaythrough = function() {
                    audio.play();
                    audio.oncanplaythrough = null; // Elimina el evento después de reproducir 
                }
               // console.log("Tenemos:",musicPlayer)

            }else{
                audio.pause()
            }

         
            // Se reinicia el controlador para seguir trabajando
            this.reproductor()
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
            // Obtener el botón Mute
            const muteButton = document.getElementById("mute");
    
            // Crear instancia de Audio
            const audio = document.getElementById("audio");

            const songs = this.currentPlayList
                       
           // console.log("Lista a reproducir en verdad", songs)

            // Se asigna el url de la canción actual al objeto Audio
            audio.src = songs[this.currentSongIndex].urlSong;
            let currentSongIndex = this.currentSongIndex
            // Al hacer click en Play... cambia el boton a stop y viceversa
            playButton.addEventListener('click', function() {
                if (audio.paused) {
                    audio.play();
                    // Cambiar ícono a pausa
                    playIcon.classList.remove('fa-circle-play');
                    playIcon.classList.add('fa-pause-circle');
                } else {
                    audio.pause();
                    // Cambiar ícono a play
                    playIcon.classList.remove('fa-pause-circle');
                    playIcon.classList.add('fa-circle-play');
                }
            });
            
    
            //Event listener de los otros botones
            // Al hacer click en Stop...
            stopButton.addEventListener('click', function () {
                audio.pause();
                audio.currentTime = 0;
                });
            // Al hacer click en Previous 
            prevSongButton.addEventListener('click', function () {
                if (currentSongIndex > 0) {
                    currentSongIndex--;
                } else {
                    currentSongIndex = songs.length - 1;
                }
                audio.pause();
                audio.src = songs[currentSongIndex].urlSong;

                audio.oncanplaythrough = function() {
                    audio.play();
                    audio.oncanplaythrough = null; // Elimina el evento después de reproducir 
                }
                // Es necesario generar nuevamente la UI, para que se muestre la nueva canción
                generateMusicPlayer(songs[currentSongIndex])
                }/* .bind(this) */);
            
            // Al hacer click en Next...
            nextSongButton.addEventListener('click', function () {
                if (currentSongIndex < songs.length - 1) {
                    currentSongIndex++;
                } else {
                    currentSongIndex = 0;
                 }
                audio.pause();
                audio.src = songs[currentSongIndex].urlSong;
                audio.oncanplaythrough = function() {
                    audio.play();
                    audio.oncanplaythrough = null; // Elimina el evento después de reproducir 
                }
                // Es necesario generar nuevamente la UI, para que se muestre la nueva canción
                generateMusicPlayer(songs[currentSongIndex])
                }/* .bind(this) */);
    
             // Al hacer click en Mute...
             muteButton.addEventListener('click', function() {
                if (audio.muted) {
                    audio.muted = false;
                    console.log("Muted false", songs[currentSongIndex].name)
                    
                } else {
                    audio.muted = true;
                    console.log("Muted true", songs[currentSongIndex].name)
                }
                }/* .bind(this) */);
            }
        }


    // Esta fx está dedicada a generar el código html del UI del reproductor, y mostrar en él los datos de la canción que hemos seleccionado (la mitad superior, sobre los botones del music player)
    function generateMusicPlayer(song){
        const musicPlayer_ui = document.querySelector(".musicPlayer-cover")
        musicPlayer_ui.innerHTML = `
        <div class="album-cover" style="background-image: url(${song.urlCover})"></div>
        <div class="music-info-container">
            <h3 class="cancion-titulo" id="cancion-titulo">${song.name}</h3>
            <div class="cancion-info">
                <div class="cancion-titulos">
                    <p id="cancion-artista">${song.artist}</p>
                    <p id="cancion-album">${song.album}</p>
                </div>
                <div class="cancion-duracion">
                    <h3 id="cancion-duracion">${song.duration}</h3>
                </div>
            </div>
        </div>
        `
    }
    
    // Al hacer click en c/canción, independientemente de su lista, se ejecutará esta función
    function changeCurrentSong(songId, currentPlayList){
        
        
        // Si ya se cuenta con un playlist en MusicPlayer, se reemplazará con el playlist al que pertenece la canción seleccionada
        if(musicPlayer.currentPlayList){
            musicPlayer.removePlayList()
        }
        musicPlayer.addPlayList(...currentPlayList)

        
        // Para renderizar la canción seleccionada en el UI del reproductor...
        // 1. Usamos el id de la canción para localizarla en la playlist cargada en el MusicPlayer
        const song = musicPlayer.currentPlayList.find(s => s.id === songId);
        // 2. Obtenemos el index de la canción en dicha playlist
        musicPlayer.setCurrentSong(musicPlayer.currentPlayList.indexOf(song))
        
       // console.log("Supuesto id", musicPlayer.currentSongIndex)
        //console.log("Supuesto music player", musicPlayer)

        // 3. Seteamos los datos de la canción en el url del objeto Audio
        audio.src = song.urlSong
       // console.log("Supuesto url",audio.src)
        // 4. Reiniciamos el UI del reproductor, para que cargue, muestre y controle la canción que hemos seleccionado
        musicPlayer.renderMusicPlayer()
        musicPlayer.playFromList()
        
    }
    document.querySelectorAll('.cancion').forEach(cancion => {
        cancion.addEventListener('click', () => {
            const songId = parseInt(cancion.getAttribute('data-idSong'));
            changeCurrentSong(songId, biblioGeneral.songs);
        });
    });
    /* Crear lista de nuevas canciones */
    const songs = [
        
        new Song({
            
            name: "This is home",
            artist: "Switchfoot",
            duration: "03:00",
            album: "Chronicles of Narnia",
            gender: "Christian rock",
            year: "2008",
            urlSong: "./src/songs/this_is_home.mp3",
            urlCover: "./src/img/switchfoot_narnia.jpg"
    
        }),
            new Song({
            
            name: "Let your faith be not alone",
            artist: "Robbie Seay Band",
            duration: "06:00",
            album: "Hopes and fears",
            gender: "Rock",
            year: "2002",
            urlSong: "./src/songs/letyourfaith.mp3",
            urlCover: "./src/img/robbie_miracle.jpg"
        
        }),
    
        new Song({
            
            name: "Sweet Child o Mine",
            artist: "Guns N Roses",
            duration: "05:56",
            album: "Appetite for Destruction",
            gender: "Hard rock ",
            year: "1987",
            urlSong: "./src/songs/Guns_N_Roses_Sweet_Child_O_Mine.mp3",
            urlCover: "./src/img/sweet_child_mine_guns_n_roses.jpeg"
    
        }),
    
        new Song({
            name: "Livin on a Prayer",
            artist: "Bon Jovi",
            duration: "04:11",
            album: "Slippery When Wet",
            gender: "Glam meta",
            year: "1986",
            urlSong: "./src/songs/Bon_Jovi_Livin_On_A_Prayer.mp3",
            urlCover: "./src/img/livin_on_a_prayer_bon_jovi.jpg"
    
        }),
    
        new Song({
            name: "Every Breath You Take",
            artist: "The Police",
            duration: "04:13",
            album: "Synchronicity",
            gender: "Pop rock",
            year: "1983",
            urlSong: "./src/songs/The_Police_Every_Breath_You_Take.mp3",
            urlCover: "./src/img/every_breath_you_take_the_police.jpeg"
    
        }),
    
        new Song({
            name: "With or Without You",
            artist: "U2",
            duration: "04:55",
            album: "The Joshua Tree",
            gender: "rock",
            year: "1987",
            urlSong: "./src/songs/U2_With_Or_Without_You.mp3",
            urlCover: "./src/img/With_or_Without_You_U2.jpeg"
    
        }),
    
        new Song({
            name: "Dont Stop Believin",
            artist: "Journey ",
            duration: "04:11",
            album: "Escape",
            gender: "rock",
            year: "1981",
            urlSong: "./src/songs/Journey_Dont_Stop_Believin.mp3",
            urlCover: "./src/img/dont_stop_believin_journey.jpeg"
    
        }),
    
        new Song({
            name: "Billie Jean",
            artist: "Michael Jackson",
            duration: "04:54",
            album: "Thriller",
            gender: "R&B",
            year: "1982",
            urlSong: "./src/songs/Michael_Jackson_Billie_Jean.mp3",
            urlCover: "./src/img/billie_jean_michael_jackson.jpeg"
    
        }),
    
    
        new Song({
            name: "Another One Bites the Dust",
            artist: "Queen",
            duration: "03:34",
            album: "The Game",
            gender: "rock",
            year: "1980",
            urlSong: "./src/songs/Queen_Another_One_Bites_The_Dust.mp3",
            urlCover: "./src/img/another_one_bites_the_dust_queen.jpeg"
    
        }),
    
        new Song({
            name: "Eye of the Tiger",
            artist: "Survivor ",
            duration: "04:03",
            album: "Rocky III",
            gender: "rock",
            year: "1982",
            urlSong: "./src/songs/Survivor_Eye_of_the_Tiger.mp3",
            urlCover: "./src/img/eye_of_the_tiger_survivor.jpeg"
    
        }),
        new Song({
            
            name: "Stay",
            artist: "Robbie Seay Band",
            duration: "05:00",
            album: "Give yourself away",
            gender: "Christian rock",
            year: "2018",
            urlSong: "./src/songs/stay.mp3",
            urlCover: ".src/img/robbie_giveYourselfAway.jpg"
    
        }),
        new Song({
            name: "Africa",
            artist: "Toto",
            duration: "04:55",
            album: "Toto IV",
            gender: "rock",
            year: "1984",
            urlSong: "./src/songs/Toto_Africa.mp3", // Asegúrate de que la URL de la canción tenga la extensión .mp3
            urlCover: "./src/img/africa_toto.jpeg"
        }),
    
        new Song({
            name: "Take On Me",
            artist: "a-ha",
            duration: "03:45",
            album: "Hunting High and Low",
            gender: "Synth pop",
            year: 1984,
            urlSong: "./src/songs/a_ha_Take_On_Me.mp3",
            urlCover: "./src/img/take_on_me_a-ha.jpeg"
        }),
    
        new Song({
            name: "Summer of 69",
            artist: "Bryan Adams",
            duration: "03:32",
            album: "Reckless",
            gender: "pop rock",
            year: "1984",
            urlSong: "./src/songs/Bryan_Adams_Summer_Of_69.mp3",
            urlCover: "./src/img/summer_of_69_bryan_adams.jpeg"
        }), // Asegúrate de cerrar la última instancia de new Song con })
    
    
        new Song({
            name: "Jump",
            artist: "Van Halen",
            duration: "03:59",
            album: "1984",
            gender: "rock",
            year: "1984",
            urlSong: "./src/songs/Van_Halen_Jump.mp3",
            urlCover: "./src/img/Jump_van_halen.jpeg"
    
        }),
        new Song({
            name: "The Final Countdown",
            artist: "Europe",
            year: "1986",
            album: "The Final Countdown",
            duration: "5:10",
            gender: "Rock",
            urlSong: "./src/songs/Europe - The Final Countdown (Official Video).mp3",
            urlCover: "./src/img/Europe-the_final_countdown.jpg"
        }),
    
        new Song({
            name: "I Love Rock n Roll",
            artist: "Joan Jett & the Blackhearts",
            year: "1981",
            album: "I Love Rock Roll",
            duration: "2:55",
            gender: "Rock",
            urlSong: "./src/songs/Joan Jett & the Blackhearts - I Love Rock N Roll (Official Video).mp3",
            urlCover: "src\img\I_love_rock_n_roll_-_joan_jett_(album_cover).jpg"
        }),
    
        new Song({
            name: "Hungry Like the Wolf",
            artist: "Duran Duran",
            year: "1982",
            album: "Rio",
            duration: "3:41",
            gender: "New Wave",
            urlSong: "./src/songs/Hungry Like the Wolf (Night Version) (2009 Remaster).mp3",
            urlCover: "./src/img/Duran-Duran-Hungry-Like-The-W-14123.jpg"
        }),
    
        new Song({
            name: "Dont You (Forget About Me)",
            artist: "Simple Minds",
            year: "1985",
            album: "The Breakfast Club (Soundtrack)",
            duration: "4:20",
            gender: "New Wave",
            urlSong: "./src/songs/Simple Minds - Dont You (Forget About Me)_CdqoNKCCt7A.mp3",
            urlCover: "./src/img/Dont you forget about me.jpg"
        }),
    
        new Song({
            name: "Under Pressure",
            artist: "Queen & David Bowie",
            year: "1981",
            album: "",
            duration: "4:04",
            gender: "Rock",
            urlSong: "./src/songs/Queen - Under Pressure (Official Video)_a01QQZyl-_I.mp3",
            urlCover: "./src/img/800px-Queen_&_David_Bowie_-_Under_Pressure.jpeg"
        }),
    
        new Song({
            name: "We Will Rock You",
            artist: "Queen",
            year: "1981",
            album: "News of the World",
            duration: "2:01",
            gender: "Rock",
            urlSong: "./src/songs/Queen - We Will Rock You (Official Video)_-tJYN-eG1zk.mp3",
            urlCover: "./src/img/We_Will_Rock_You_by_Queen_(1977_French_single).png"
        }),
    
        new Song({
            name: "Like a Virgin",
            artist: "Madonna",
            year: "1984",
            album: "Like a Virgin",
            duration: "3:11",
            gender: "Pop",
            urlSong: "./src/songs/Madonna - Like A Virgin (Official Video)_s__rX_WL100.mp3",
            urlCover: "./src/img/LikeAVirgin1984.png"
        }),
    
        new Song({
            name: "Walk Like an Egyptian",
            artist: "The Bangles",
            year: "1986",
            album: "Different Light",
            duration: "3:23",
            gender: "Pop",
            urlSong: "./src/songs/The Bangles - Walk Like an Egyptian (Official Video).mp3",
            urlCover: "./src/img/The_Bangles_Walk_Like_An_Egyptian.jpg"
        }),
    
        new Song({
            name: "Start Me Up",
            artist: "The Rolling Stones",
            year: "1981",
            album: "Tattoo You",
            duration: "3:32",
            gender: "Rock",
            urlSong: "./src/songs/Rolling Stones-start me up_ZzlgJ-SfKYE.mp3",
            urlCover: "./src/img/RollStones-Single1981_StartMeUp.jpg"
        }),
    
        new Song({
            name: "Beat It",
            artist: "Michael Jackson",
            year: "1983",
            album: "Thriller",
            duration: "4:18",
            gender: "Pop",
            urlSong: "./src/songs/Michael Jackson - Beat It (Official 4K Video).mp3",
            urlCover: "./src/img/Beat_It.jpg"
        }),
    
        new Song({
            name: "I Want to Know What Love Is",
            artist: "Foreigner",
            year: "1984",
            album: "Agent Provocateur",
            duration: "5:00",
            gender: "Rock",
            urlSong: "./src/songs/Foreigner - I Want To Know What Love Is (Official Music Video)_r3Pr1_v7hsw.mp3",
            urlCover: "./src/img/Foreigner-I-Want-To-Know-Wh-297484.jpg"
        }),
    
        new Song({
            name: "Welcome to the Jungle",
            artist: "Guns N Roses",
            year: "1987",
            album: "Appetite for Destruction",
            duration: "4:34",
            gender: "Rock",
            urlSong: "./src/songs/Guns N Roses - Welcome To The Jungle.mp3",
            urlCover: "./src/img/Welcometothejungle.jpg"
        }),
    
        new Song({
            name: "Every Rose Has Its Thorn",
            artist: "Poison",
            year: "1988",
            album: "Open Up and Say... Ahh!",
            duration: "4:20",
            gender: "Rock",
            urlSong: "./src/songs/Poison - Every Rose Has Its Thorn (Official Music Video).mp3",
            urlCover: "./src/img/Every_Rose_Has_Its_Thorn-Cover.jpg"
        }),
    
        new Song({
            name: "Everybody Wants to Rule the World",
            artist: "Tears for Fears",
            year: "1985",
            album: "Songs from the Big Chair",
            duration: "4:11",
            gender: "New Wave",
            urlSong: "./src/songs/Everybody Wants To Rule The World_awoFZaSuko4.mp3",
            urlCover: "./src/img/Everybody_Wants_to_Rule_the_World.png" 
        }),
    
    
        new Song({
            name: "Thriller",
            artist: "Michael Jackson",
            year: "1982",
            album: "Thriller",
            duration: "5:57",
            gender: "Pop",
            urlSong: "./src/songs/Michael Jackson - Thriller (Lyrics)_rLMr9CsJHME.mp3",
            urlCover: "./src/img/Michael_Jackson_-_Thriller.png"
        }),
    
    
    ]

// Originalmente me faltó añadir el atribuito ID, y es necesario :( 
// Con eso se lo añado a todas las canciones
function addID(songs){
    id = 0;
    songs.forEach((song)=>{
        song.id = id;
        id += 1
    })
}

addID(songs) // Listo :D


// Crear PlayLists
const biblioGeneral = new Playlist({
    listName: "Biblioteca General",
    container: "lista-general" // lista de canciones generales
})
const myPlaylist = new Playlist({
    listName: "My PlayList",
    container: "lista-general-2" // lista de canciones con like.
})
const myFavorite=new Playlist({
    listName:'My Favorite',
    container: 'lista-general-3'//Lista de canciones favoritas.
})
    /* Agregar canciones al playlist */
    biblioGeneral.addSong(...songs)
   // console.log(biblioGeneral.songs)
    /* Mostrar playlist en su container */
    biblioGeneral.renderList()
    /* Crear instancia Music Player */
    const musicPlayer = new MusicPlayer({
        currentPlayList: biblioGeneral.songs
    })

    
    /* Ejecutar la búsqueda (lado izq) */
    biblioGeneral.searchBy(biblioGeneral.renderList)
    

    
myPlaylist.renderList()
// Cargar, mostrar y controlar la 1era canción de la playlist por defecto
musicPlayer.renderMusicPlayer()


//Funcionalidad boton My Playlist
const myPlaylistBtn = document.getElementById('myPlaylistBtn');
myPlaylistBtn.addEventListener('click', () => {
    myPlaylist.renderList();
    console.log('funciona el botón My Playlist')
});


//Agrego la funcionalidad del botón de + para agregar a My Playlist y Favoritos las canciones
document.querySelectorAll('.fa-solid.fa-plus').forEach(item => {
    item.addEventListener('click', () => {
        const songId = parseInt(item.previousElementSibling.getAttribute('data-idSong'));
        const songToAdd = biblioGeneral.songs.find(song => song.id === songId);

        if (myPlaylist.container.includes('2')) { // Verifica si es la lista de My Playlist
            myPlaylist.addSong(songToAdd);
            songToAdd.onPlayList = true;
            myPlaylist.renderList();
        } else if (myFavorite.container.includes('3')) { // Verifica si es la lista de Favoritos
            myFavorite.addSong(songToAdd);
            songToAdd.isFav = true;
            myFavorite.renderList();
        }
    });
});

//Funcionalidad boton Favoritos
const favoritosBtn = document.getElementById('favoritosBtn');
favoritosBtn.addEventListener('click', () => {
    myFavorite.renderList();
    console.log('funciona el botón Favoritos')
}); 

// Agrego la funcionalidad de los corazones para agregar a Favoritos las canciones
document.querySelectorAll('.fa-regular.fa-heart').forEach(item => {
    item.addEventListener('click', () => {
        const songId = parseInt(item.parentElement.querySelector('.cancion').getAttribute('data-idSong'));
        const songToAdd = biblioGeneral.songs.find(song => song.id === songId);

        myFavorite.addSong(songToAdd);
        songToAdd.isFav = true;
        myFavorite.renderList();
    });
});
