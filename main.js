setTimeout(() => {
/* Validaciones conscernientes al Login */
if(!localStorage.getItem('isLogged')){ 
    console.log('no estas logeado', localStorage.getItem('isLogged'))
    /* Si no estás loggeado, te redirige al login. No puedes acceder al Music player */
}
}, 1000)







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
        // Obtener el botón Mute
        const muteButton = document.getElementById("mute");

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

         muteButton.addEventListener('click', function() {
            if (audio.muted) {
                audio.muted = false;
                console.log("Muted false", songs[currentSong].name)
                
            } else {
                audio.muted = true;
                console.log("Muted true", songs[currentSong].name)

            }
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
    year: "2018",
    urlSong: "./src/songs/stay.mp3",
    urlCover: ".src/img/robbie_giveYourselfAway.jpg"

}),
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
    name: "Sweet Child o' Mine",
    artist: "Guns N' Roses",
    duration: "05:56",
    album: "Appetite for Destruction",
    gender: "Hard rock ",
    year: "1987",
    urlSong: "./src/songs/Guns_N_Roses_Sweet_Child_O_Mine.mp3",
    urlCover: "./src/img/sweet_child_mine_guns_n_roses.jpeg"

}),

new Song({
    name: "Livin' on a Prayer",
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
    name: "Don't Stop Believin",
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
    name: "Africa",
    artist: "Toto",
    duration: "04:55",
    album: "Toto IV",
    gender: "rock",
    year: "1984",
    urlSong: "./src/songs/Toto_Africa",
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
    name: "Summer of '69",
    artist: "Bryan Adams",
    duration: "03:32",
    album: "Reckless",
    gender: "pop rock",
    year: "1984",
    urlSong: "./src/songs/Bryan_Adams_Summer_Of_69.mp3",
    urlCover: "./src/img/summer_of_69_bryan_adams.jpeg"

}),

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
    name: "I Love Rock 'n' Roll",
    artist: "Joan Jett & the Blackhearts",
    year: "1981",
    album: "I Love Rock 'n' Roll",
    duration: "2:55",
    gender: "Rock",
    urlSong: "./src/songs/Joan Jett & the Blackhearts - I Love Rock 'N Roll (Official Video).mp3",
    urlCover: "src\img\I_love_rock_n'_roll_-_joan_jett_(album_cover).jpg"
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
    name: "Don't You (Forget About Me)",
    artist: "Simple Minds",
    year: "1985",
    album: "The Breakfast Club (Soundtrack)",
    duration: "4:20",
    gender: "New Wave",
    urlSong: "./src/songs/Simple Minds - Don't You (Forget About Me)_CdqoNKCCt7A.mp3",
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
    artist: "Guns N' Roses",
    year: "1987",
    album: "Appetite for Destruction",
    duration: "4:34",
    gender: "Rock",
    urlSong: "./src/songs/Guns N' Roses - Welcome To The Jungle.mp3",
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
