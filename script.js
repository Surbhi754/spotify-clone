const audio = document.getElementById("audio");

const playPause = document.getElementById("playPause");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");

const currentTitle = document.getElementById("currentTitle");
const currentArtist = document.getElementById("currentArtist");
const currentImage = document.getElementById("currentImage");

const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const albumCards = document.querySelectorAll(".album-card");

let currentIndex = 0;
let isPlaying = false;


/* SONG DATA */

const songs = Array.from(albumCards).map(card => ({
    title: card.dataset.title,
    artist: card.dataset.artist,
    song: card.dataset.song,
    image: card.dataset.image
}));


/* LOAD SONG */

function loadSong(index) {

    currentIndex = index;

    const song = songs[index];

    audio.src = song.song;

    currentTitle.textContent = song.title;
    currentArtist.textContent = song.artist;
    currentImage.src = song.image;

    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";
}


/* PLAY */

function playSong() {

    if (!audio.src) {
        loadSong(currentIndex);
    }

    audio.play();

    isPlaying = true;

    playPause.innerHTML =
        '<i class="fa-solid fa-pause"></i>';
}


/* PAUSE */

function pauseSong() {

    audio.pause();

    isPlaying = false;

    playPause.innerHTML =
        '<i class="fa-solid fa-play"></i>';
}


/* PLAY / PAUSE */

playPause.addEventListener("click", () => {

    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }

});


/* ALBUM CLICK */

albumCards.forEach((card, index) => {

    card.addEventListener("click", (event) => {

        if (event.target.closest(".play-button")) {
            event.stopPropagation();
        }

        loadSong(index);
        playSong();

    });

});


/* NEXT */

document.getElementById("next").addEventListener("click", () => {

    currentIndex++;

    if (currentIndex >= songs.length) {
        currentIndex = 0;
    }

    loadSong(currentIndex);
    playSong();

});


/* PREVIOUS */

document.getElementById("previous").addEventListener("click", () => {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = songs.length - 1;
    }

    loadSong(currentIndex);
    playSong();

});


/* PROGRESS UPDATE */

audio.addEventListener("timeupdate", () => {

    if (!audio.duration) return;

    const percentage =
        (audio.currentTime / audio.duration) * 100;

    progress.value = percentage;

    currentTime.textContent =
        formatTime(audio.currentTime);

});


/* DURATION */

audio.addEventListener("loadedmetadata", () => {

    duration.textContent =
        formatTime(audio.duration);

});


/* CHANGE PROGRESS */

progress.addEventListener("input", () => {

    if (!audio.duration) return;

    audio.currentTime =
        (progress.value / 100) * audio.duration;

});


/* VOLUME */

volume.addEventListener("input", () => {

    audio.volume = volume.value;

});


audio.volume = 0.7;


/* AUTO NEXT */

audio.addEventListener("ended", () => {

    currentIndex++;

    if (currentIndex >= songs.length) {
        currentIndex = 0;
    }

    loadSong(currentIndex);
    playSong();

});


/* FORMAT TIME */

function formatTime(seconds) {

    if (isNaN(seconds)) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        Math.floor(seconds % 60);

    return `${minutes}:${secs
        .toString()
        .padStart(2, "0")}`;
}


/* SEARCH */

const searchInput =
    document.getElementById("searchInput");

searchInput.addEventListener("input", () => {

    const search =
        searchInput.value.toLowerCase();

    albumCards.forEach(card => {

        const title =
            card.dataset.title.toLowerCase();

        const artist =
            card.dataset.artist.toLowerCase();

        if (
            title.includes(search) ||
            artist.includes(search)
        ) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });

});


/* LIKE BUTTON */

const likeButton =
    document.getElementById("likeButton");

likeButton.addEventListener("click", () => {

    const icon =
        likeButton.querySelector("i");

    icon.classList.toggle("fa-regular");
    icon.classList.toggle("fa-solid");

});


/* SHUFFLE */

document.getElementById("shuffle")
    .addEventListener("click", () => {

        const randomIndex =
            Math.floor(Math.random() * songs.length);

        loadSong(randomIndex);
        playSong();

    });


/* REPEAT */

const repeatButton =
    document.getElementById("repeat");

repeatButton.addEventListener("click", () => {

    audio.loop = !audio.loop;

    repeatButton.style.color =
        audio.loop ? "#1ed760" : "";

});


/* INITIAL SONG */

loadSong(0);