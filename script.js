let curentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {

    let a = await fetch("http://127.0.0.1:3000/musics/");
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/musics/")[1])
        }
    }
    return songs
}

const playMusic = (track, pause = false) => {
    curentSong.src = "/musics/" + track
    if (!pause) {
        curentSong.play();
    }
    play.src = "img/pause.svg"
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}


async function main() {

    //get songs
    let songs = await getSongs()
    playMusic(songs[0], true);


    //show allt he song in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>

        <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Krish2Good</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>

        
        </li>`;
    }

    //attach a event listion to each songs
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })

    //attach n event listner to play next and previous
    play.addEventListener("click", () => {
        if (curentSong.paused) {
            curentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            curentSong.pause()
            play.src = "img/play.svg"
        }
    })

    //listion for time update event
    curentSong.addEventListener("timeupdate", () => {
        console.log(curentSong.currentTime, curentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(curentSong.currentTime)} / ${secondsToMinutesSeconds(curentSong.duration)}`
        document.querySelector(".cicle").style.left = (curentSong.currentTime / curentSong.duration) * 100 + "%"
    })

    //add an evnet for seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".cicle").style.left = percent + "%";
        curentSong.currentTime = ((curentSong.duration) * percent) / 100
    })
}

main();