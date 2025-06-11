const slides = [
  { type: "image", src: "../media/routine1.png" },
  { type: "image", src: "../media/routine2.png" },
  { type: "image", src: "../media/routine3.png" },
  { type: "tv-static" },
  { type: "channel-choice" },
  { type: "end", src: "../media/leaving.png" }
];

let currentSlide = 0;
const container = document.getElementById("slide-container");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");

function renderSlide(index) {
  container.innerHTML = "";
  const slide = slides[index];

  if (slide.type === "image") {
    const img = document.createElement("img");
    img.src = slide.src;
    container.appendChild(img);
  }

  if (slide.type === "tv-static") {
    const img = document.createElement("img");
    img.src = "../media/background.gif";
    container.appendChild(img);
  }

  if (slide.type === "channel-choice") {
    const tvImg = document.createElement("img");
    tvImg.src = "../media/choice.png";
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
    container.appendChild(img);
  }

  updateButtons();
}

function updateButtons() {
  // Show previous only if we're past the first slide
  prevBtn.style.display = currentSlide > 0 ? "block" : "none";

  // Show next unless we're at the last slide or it's a channel-choice waiting for input
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
  channelImg.src = choice === "CN" ? "../media/CN.gif" : "../media/nickelodeon..gif";
  container.innerHTML = "";
  container.appendChild(channelImg);

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
nextBtn.style.display = "inline-block"; // Only next is shown at first
prevBtn.style.display = "none";         // Hide previous initially
renderSlide(currentSlide);
