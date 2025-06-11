const slides = [
  { type: "image", src: "../media/routine1.png", audio: "../media/01-Intro.WakingUp.mp3" },
  { type: "image", src: "../media/routine2.png", audio: "../media/01-Intro.Teeth.mp3" },
  { type: "image", src: "../media/routine3.png", audio: "../media/01-Intro.part3.mp3" },
  { type: "tv-static", audio: "../media/static.mp3" },
  { type: "channel-choice", audio: null },
  { type: "end", src: "../media/leaving.png", audio: null }
];

let currentSlide = 0;
const container = document.getElementById("slide-container");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const audioPlayer = document.getElementById("narration");

function renderSlide(index) {
  container.innerHTML = "";
  const slide = slides[index];

  if (slide.type === "image") {
    const img = document.createElement("img");
    img.src = slide.src;
    img.alt = "Slide image";
    container.appendChild(img);
  }

  if (slide.type === "tv-static") {
    const img = document.createElement("img");
    img.src = "../media/background.gif";
    img.alt = "TV static";
    container.appendChild(img);
  }

  if (slide.type === "channel-choice") {
    const tvImg = document.createElement("img");
    tvImg.src = "../media/choice.png";
    tvImg.alt = "TV channel choice";
    container.appendChild(tvImg);

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("channel-buttons");

    const btnCN = document.createElement("button");
    btnCN.textContent = "Cartoon Network";
    btnCN.onclick = () => showChannel("CN");

    const btnNick = document.createElement("button");
    btnNick.textContent = "Nickelodeon";
    btnNick.onclick = () => showChannel("Nick");

    btnContainer.appendChild(btnCN);
    btnContainer.appendChild(btnNick);
    container.appendChild(btnContainer);

    nextBtn.style.display = "none"; // Wait for user to choose
  }

  if (slide.type === "end") {
    const img = document.createElement("img");
    img.src = slide.src;
    img.alt = "End screen";
    container.appendChild(img);
  }

  // Load & play audio for this slide
  if (slide.audio) {
    audioPlayer.src = slide.audio;
    audioPlayer.style.display = "block";
    audioPlayer.load();
    audioPlayer.play().catch(err => {
      console.warn("Audio play blocked or failed:", err);
    });
  } else {
    audioPlayer.pause();
    audioPlayer.removeAttribute("src");
    audioPlayer.style.display = "none";
  }

  updateButtons();
}

function updateButtons() {
  prevBtn.style.display = currentSlide > 0 ? "block" : "none";

  const isLastSlide = currentSlide === slides.length - 1;
  const isChoiceSlide = slides[currentSlide].type === "channel-choice";
  const isEndSlide = slides[currentSlide].type === "end";

  if (!isLastSlide && !isChoiceSlide && !isEndSlide) {
    nextBtn.style.display = "inline-block";
  }

  if (isLastSlide || isEndSlide) {
    nextBtn.style.display = "none";
  }
}

function showChannel(choice) {
  const channelImg = document.createElement("img");
  channelImg.src = choice === "CN" ? "../media/CN.gif" : "../media/nickelodeon.gif";
  channelImg.alt = choice + " channel";
  container.innerHTML = "";
  container.appendChild(channelImg);

  // Optional: Play a specific sound for channel choice
  audioPlayer.pause();
  audioPlayer.removeAttribute("src");
  audioPlayer.style.display = "none";

  nextBtn.style.display = "inline-block";
  prevBtn.style.display = "inline-block";
}

function nextSlide() {
  if (currentSlide < slides.length - 1) {
    currentSlide++;
    renderSlide(currentSlide);
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    renderSlide(currentSlide);
  }
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

// Initial state
nextBtn.style.display = "inline-block";
prevBtn.style.display = "none";
renderSlide(currentSlide);
