let audio = document.querySelector('.quranPlayer'),
    surahsContainer = document.querySelector('.surah'),
    ayah = document.querySelector('.ayah'),
    next = document.querySelector('.next'),
    prev = document.querySelector('.prev'),
    play = document.querySelector('.play')

getSurahs()
function getSurahs() {
    fetch('https://api.quran.gading.dev/surah')
        .then(response => response.json())
        .then(data => {

            for (let surah in data.data) {

                surahsContainer.innerHTML +=
                    ` <div>
                    <p>${data.data[surah].name.long}</p>
                    <p>${data.data[surah].name.transliteration.en}</p>
                 </div> `

            }
            //select all surah
            let allSurahs = document.querySelectorAll('.surah div'),
                AyahsAudio,
                AyahsText;

            allSurahs.forEach((surah, index) => {
                surah.addEventListener('click', () => {
                    fetch(`https://api.quran.gading.dev/surah/${index + 1}`)
                        .then(response => response.json())
                        .then(data => {
                            let verses = data.data.verses;
                            AyahsAudio = [];
                            AyahsText = [];
                            verses.forEach(verse => {
                                AyahsAudio.push(verse.audio.primary);
                                AyahsText.push(verse.text.arab)
                            })
                            let AyahsIndex = 0;
                            changeAyah(AyahsIndex)
                            audio.addEventListener('ended', () => {
                                AyahsIndex++;
                                if (AyahsIndex < AyahsAudio.length) {
                                    changeAyah(AyahsIndex)
                                } else {
                                    alert('surah ended');

                                    AyahsIndex = 0;
                                    changeAyah(AyahsIndex);
                                    audio.pause();
                                    Swal.fire({
                                        position: "center",
                                        icon: "success",
                                        title: "Surah has been ended",
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                    isPlaying=true;
                                    togglePlay()
                                }
                            })
                            //handle Next and Prev
                            next.addEventListener('click', () => {
                                AyahsIndex < AyahsAudio.length - 1 ? AyahsIndex++ : AyahsIndex = 0;
                                changeAyah(AyahsIndex)
                            })
                            prev.addEventListener('click', () => {
                                AyahsIndex == 0 ? AyahsIndex = AyahsAudio.length - 1 : AyahsIndex--;
                                changeAyah(AyahsIndex)
                            })
                            //handle play and pause audio
                            let isPlaying = false;
                            togglePlay()
                            function togglePlay(){
                                if(isPlaying){
                                    audio.pause();
                                    play.innerHTML=`<i class="fas fa-play"></i>`
                                    isPlaying=false;
                                }
                                else{
                                    audio.play();
                                    play.innerHTML=`<i class="fas fa-pause"></i>`
                                    isPlaying=true;
                                }
                            }
                            play.addEventListener('click' , togglePlay)
                            function changeAyah(index) {
                                audio.src = AyahsAudio[index];
                                ayah.innerHTML = AyahsText[index];
                                audio.play()
                            
                            }
                        })
                })
            })

        })
}
