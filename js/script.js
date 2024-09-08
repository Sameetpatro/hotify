let songs;
let currentSong = new Audio()
let curFolder;

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = (seconds % 60).toFixed(0);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    remainingSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return minutes + ':' + remainingSeconds;
}

async function getSongs(folder) {
    curFolder = folder
    console.log(curFolder)
    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let a_tag = div.getElementsByTagName("a")
    songs = []
        // console.log(a_tag)
    for (let index = 0; index < a_tag.length; index++) {
        const element = a_tag[index];
        if (element.href.endsWith(".mp3")) {
            // console.log(element)
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    let songList = document.querySelector(".lib-content").getElementsByTagName("ul")[0]
    songList.innerHTML = ""
    for (const song of songs) {
        songList.innerHTML = songList.innerHTML + `<li class="list-item">
        <img class="invert" src="Images/music.svg" alt="">
        <div class="info no-select">
        <div>${song.replaceAll("%20", " ")}</div>
        <div class="no-select" style="font-size: 10px;">Sammie bhai</div>
        </div>
        <img class="invert pointer" src="Images/play.svg" alt="">
        </li>`
    }
    Array.from(document.querySelector(".lib-content").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })
    return songs

}




function playMusic(track) {
    currentSong.src = `/${curFolder}/` + track
    currentSong.play()
    console.log(currentSong.src)
    playnow.src = "Images/pause.svg"
    document.querySelector(".song-info").innerHTML = decodeURI(track).split(".mp3")[0]

}

async function displayAlbums() {
    let a = await fetch(`/hotify/Songs`)

    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let allAs = div.getElementsByTagName("a")
    let array = Array.from(allAs)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/Songs")) {
            let folder = e.href.split("/").slice(-2)[0]
            let a = await fetch(`Songs/${folder}/info.json`)
            console.log(a)
            let response = await a.json()
            let cardC = document.querySelector(".card-container")
            cardC.innerHTML = cardC.innerHTML + `<div class="card" data-folder="${folder}">
            <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="22" fill="pink" />
            <path fill="black" fill-rule="evenodd"
            d="M18.6 14.2A1 1 0 0 0 17 15v14a1 1 0 0 0 1.6.8l8-7a1 1 0 0 0 0-1.6l-8-7Z"
            clip-rule="evenodd" />
            </svg>
            </div>
            <img src="/hotify/Songs/${folder}/cover.jpg" alt="">
            <h3>${response.title}</h3>
            <p style="font-weight: 400; font-size: 12px;">${response.description}</p>
            </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(element => {
        element.addEventListener("click", async(e) => {

            songs = await getSongs(`hotify/Songs/${e.currentTarget.dataset.folder}`)
            console.log(songs)
        })
    })


}

async function main() {
    await getSongs(`Songs/Mood`)


    displayAlbums()

    playnow.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            playnow.src = "Images/pause.svg"


        } else {
            currentSong.pause()
            playnow.src = "Images/play.svg"
        }
    })
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".song-time").innerHTML = `${formatTime(currentSong.currentTime)} | ${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        currentSong.currentTime = (currentSong.duration * percent / 100)
    })

    prev.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }


    })

    next.addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1])
        }

    })


    document.querySelector(".volume-bar").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = e.target.value / 100
    })

    let lastVol = currentSong.volume

    vol.addEventListener("click", () => {

        if (currentSong.muted) {
            currentSong.muted = false
            currentSong.volume = lastVol
            vol.src = "Images/volume.svg"
        } else {
            currentSong.muted = true
            currentSong.volume = 0
            vol.src = "Images/mute.svg"

        }

    })
    document.addEventListener("keydown", (e) => {
        if (e.key == "m" || e.key == "M") {
            if (currentSong.muted) {
                currentSong.muted = false
                currentSong.volume = lastVol
                vol.src = "Images/volume.svg"
            } else {
                currentSong.muted = true
                currentSong.volume = 0
                vol.src = "Images/mute.svg"

            }
        }

    })
    document.addEventListener("keydown", (e) => {
        if (e.code == "Space") {
            if (currentSong.paused) {
                currentSong.play()
                playnow.src = "Images/pause.svg"


            } else {
                currentSong.pause()
                playnow.src = "Images/play.svg"
            }
        }
    })

    Array.from(document.getElementsByClassName("card")).forEach(element => {
            element.addEventListener("click", async(e) => {
                console.log(`${e.currentTarget.dataset.folder}`)
                songs = await getSongs(`/Songs/${e.currentTarget.dataset.folder}`)
            })
        })
        //Happiness index
    let pop
    let happy = document.querySelector(".happy-seek")
    let currentTime = 0
    let duration = 1800
    let interval = setInterval(() => {
        currentTime++;
        let percent = (currentTime / duration) * 100 - 2
        happy.style.width = percent + "%"
        if (currentTime == duration) {
            currentTime = 0
            pop = document.querySelector(".popup")
            pop.style = "z-index: 5;"
        }

    }, 1000)
    let button = document.getElementById("butt")
    button.addEventListener("click", () => {
        currentTime = 0
        pop.style = "z-index: -1;"
    })

    function updateClock() {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        var period = "AM";

        if (hours >= 12) {
            period = "PM";
        }
        if (hours > 12) {
            hours = hours - 12;
        }
        if (hours === 0) {
            hours = 12;
        }

        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        var currentTime = hours + ':' + minutes + ' ' + period;
        document.getElementById('clock').innerHTML = currentTime;
    }
    setInterval(updateClock, 1000);
    updateClock();

    //dark_mode
    let co = 1;
    let dark = document.querySelector(".dark").addEventListener("click", () => {

        if (co == 1) {
            co = 0
            let darkbutton = document.getElementById("dark-button")
            darkbutton.src = "Images/dark.svg"
            document.body.style = "background-color: rgb(255 199 230); color: black;"
            document.querySelector(".popup").style = "background-color: rgb(250, 178, 220);"
            document.querySelector(".header").style = "background-color: rgb(176 1 104);"
            document.querySelector(".happy").style = "background-color: rgb(96 0 56);"
            document.querySelector(".happy-seek").style = "background-color: white;"
            var cards = document.querySelectorAll(".list-item")
            cards.forEach(e => {
                e.style = "background-color: #db9ec0; color: rgb(102 1 60)"
            })
            let dabba = document.querySelectorAll(".bg-gray")
            dabba.forEach(e => {
                e.style = "background-color: rgb(255 75 168);"
            })
            let patte = document.querySelectorAll(".card")
            patte.forEach(e => {
                e.style = " color: rgb(102 1 60);background-color: #db9ec0; border: 1px solid #db9ec0;"
            })
            document.querySelector(".playbar").style = "background-color: #db9ec0;"
            document.querySelector(".song-info").style =
                " color: rgb(102 1 60);"
            document.querySelector(".song-time").style =
                " color: rgb(102 1 60);"
            document.querySelector(".seekbar").style =
                " background-color: rgb(102 1 60);border: 1px solid rgb(102 1 60); "
            document.querySelector(".circle").style =
                " background-color: rgb(102 1 60);"
            document.querySelector(".volume-bar").style = "background-color: #db9ec0;"
            let icons = document.querySelectorAll(".invert")
            icons.forEach(e => {
                e.style = "filter: invert(0);"
            })
            document.getElementById("clock").style = "color: rgb(0 0 0)"
            document.querySelector(".heading").style = "color: rgb(0 0 0)"
            document.querySelector(".playlist").style = "color: rgb(0 0 0)"
            document.getElementById("logo").style = "width: 185px; position: relative;top: -31px; left: -24px;filter: invert(0);"
        } else {
            co = 1
            let darkbutton = document.getElementById("dark-button")
            darkbutton.src = "Images/light.svg"

            document.body.style = "background-color:black ;color: white"
            document.querySelector(".popup").style = "background-color: rgb(250, 178, 220);"
            document.querySelector(".header").style = "background-color: rgb(62, 62, 62);"
            document.querySelector(".happy").style = "background-color: #515151;"
            document.querySelector(".happy-seek").style = "background-color: pink;"
            var cards = document.querySelectorAll(".list-item")
            cards.forEach(e => {
                e.style = "background-color: rgb(71, 71, 71); color: rgb(255 255 255)"
            })
            let dabba = document.querySelectorAll(".bg-gray")
            dabba.forEach(e => {
                e.style = "background-color: rgb(45, 45, 45);"
            })
            let patte = document.querySelectorAll(".card")
            patte.forEach(e => {
                e.style = " color: white;background-color: rgb(61, 61, 61); border: 2px solid rgb(61, 61, 61);"
            })
            document.querySelector(".playbar").style = "background-color: rgb(70, 70, 70);"
            document.querySelector(".song-info").style =
                " color: rgb(255, 255, 255);"
            document.querySelector(".song-time").style =
                " color: rgb(255, 255, 255);"
            document.querySelector(".seekbar").style =
                " background-color: rgb(255, 255, 255);border: 1px solid white; "
            document.querySelector(".circle").style =
                " background-color: rgb(255 255 255);"
            document.querySelector(".volume-bar").style = "background-color: #474747;"
            let icons = document.querySelectorAll(".invert")
            icons.forEach(e => {
                e.style = "filter: invert(1);"
            })
            document.getElementById("clock").style = "color: rgb(255 255 255)"
            document.querySelector(".heading").style = "color: rgb(255 255 255)"
            document.querySelector(".playlist").style = "color: rgb(255 255 255)"
            document.getElementById("logo").style = "width: 185px; position: relative;top: -31px; left: -24px;filter: invert(1);"
        }
    })
}
main()