const scenes = [
    { type: "image", src: "media/routine1.png", endTime: 22 },
    { type: "image", src: "media/routine2.png", endTime: 42 },
    { type: "image", src: "media/routine3.png", endTime: 54 },
    { type: "channel-choice", src: "media/choice.png", endTime: Infinity }
];

const nickPath = [
    { type: "video", src: "media/nickelodeon.gif", endTime: 127 }, // 2:07 minutes
    { type: "image", src: "media/leaving.png", endTime: Infinity }
];

const cnPath = [
    { type: "video", src: "media/CN.gif", endTime: 136 }, // 2:16 minutes
    { type: "image", src: "media/leaving.png", endTime: Infinity }
];

let currentSlide = 0;
let currentPath = null;
let currentPathIndex = 0;
let experienceStarted = false;
const container = document.getElementById("slide-container");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const loading = document.getElementById("loading");
const audio = document.getElementById("narration");

// Preload all images
function preloadImages() {
    const allImages = [
        ...scenes.map(scene => scene.src),
        ...nickPath.map(scene => scene.src),
        ...cnPath.map(scene => scene.src)
    ];
    
    return Promise.all(allImages.map(imageSrc => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = imageSrc;
        });
    }));
}

function renderSlide(index, fadeEffect = true) {
    const slide = scenes[index];
    
    if (slide.type === "channel-choice") {
        showChoice();
        return;
    }

    // Create new image and load it before showing
    const newImg = document.createElement("img");
    newImg.src = slide.src;
    newImg.style.position = "absolute";
    newImg.style.top = "0";
    newImg.style.left = "0";
    newImg.style.width = "100%";
    newImg.style.height = "100%";
    newImg.style.objectFit = "cover";
    newImg.style.opacity = "0";
    newImg.style.transition = "opacity 0.5s ease-in-out";

    // Wait for the new image to load
    newImg.onload = () => {
        const currentContent = container.querySelector('img');
        // Remove any existing channel buttons
        const channelButtons = container.querySelector('.channel-buttons');
        if (channelButtons) {
            channelButtons.remove();
        }

        if (currentContent) {
            // Add new image while keeping the old one
            container.appendChild(newImg);
            
            // Fade in new image
            setTimeout(() => {
                newImg.style.opacity = "1";
                // Fade out old image
                currentContent.style.opacity = "0";
                
                // Remove old image after transition
                setTimeout(() => {
                    currentContent.remove();
                }, 500);
            }, 50);
        } else {
            container.appendChild(newImg);
            setTimeout(() => {
                newImg.style.opacity = "1";
            }, 50);
        }
    };
    
    updateButtons();
}

function showChoice() {
    const currentContent = container.querySelector('img');
    const choiceContent = `
        <img src="media/choice.png" style="width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease-in-out;">
        <div class="channel-buttons">
            <button onclick="selectChannel('nick')">Nickelodeon</button>
            <button onclick="selectChannel('cn')">Cartoon Network</button>
        </div>
    `;

    if (currentContent) {
        // Start fade out of current content
        currentContent.style.opacity = "0";
        
        // After fade out, show choice screen with fade in
        setTimeout(() => {
            container.innerHTML = choiceContent;
            const newImage = container.querySelector('img');
            setTimeout(() => {
                newImage.style.opacity = "1";
            }, 50);
        }, 500);
    } else {
        container.innerHTML = choiceContent;
        const newImage = container.querySelector('img');
        setTimeout(() => {
            newImage.style.opacity = "1";
        }, 50);
    }

    // Hide navigation buttons during choice
    nextBtn.style.display = "none";
    prevBtn.style.display = "block";
}

function selectChannel(channel) {
    currentPath = channel;
    currentPathIndex = 0;

    // Create and preload the new image
    const newImg = document.createElement("img");
    newImg.src = (channel === 'nick' ? nickPath : cnPath)[0].src;
    newImg.style.position = "absolute";
    newImg.style.top = "0";
    newImg.style.left = "0";
    newImg.style.width = "100%";
    newImg.style.height = "100%";
    newImg.style.objectFit = "cover";
    newImg.style.opacity = "0";
    newImg.style.transition = "opacity 0.5s ease-in-out";

    // Change audio source based on selection
    audio.src = channel === 'nick' ? 'audio/03-ChoosingNick.mp3' : 'audio/02-ChoosingCN.mp3';
    audio.load();
    
    // Set initial time for Nickelodeon to 2.3 seconds
    if (channel === 'nick') {
        audio.currentTime = 2.3;
    } else {
        audio.currentTime = 0;
    }

    // Wait for the new image to load
    newImg.onload = () => {
        // Add the new image while keeping the choice interface
        container.appendChild(newImg);
        
        // Start fading in the new image
        setTimeout(() => {
            newImg.style.opacity = "1";
            
            // Remove the choice interface after fade-in
            const choiceInterface = container.querySelector('.channel-buttons');
            const choiceImage = container.querySelector('img:not([style*="opacity: 1"])');
            if (choiceInterface) {
                choiceInterface.style.opacity = "0";
                setTimeout(() => {
                    choiceInterface.remove();
                    if (choiceImage) choiceImage.remove();
                }, 500);
            }
        }, 50);

        // Show navigation buttons
        nextBtn.style.display = "block";
        prevBtn.style.display = "block";

        audio.play().then(() => {
            updateButtons();
        }).catch(error => {
            console.error('Error playing audio:', error);
            updateButtons();
        });
    };
}

function showPathScene(index) {
    const pathScenes = currentPath === 'nick' ? nickPath : cnPath;
    const scene = pathScenes[index];

    // Create new image and load it before showing
    const newImg = document.createElement("img");
    newImg.src = scene.src;
    newImg.style.position = "absolute";
    newImg.style.top = "0";
    newImg.style.left = "0";
    newImg.style.width = "100%";
    newImg.style.height = "100%";
    newImg.style.objectFit = "cover";
    newImg.style.opacity = "0";
    newImg.style.transition = "opacity 0.5s ease-in-out";

    // Wait for the new image to load
    newImg.onload = () => {
        const currentContent = container.querySelector('img');
        
        if (currentContent) {
            // Add new image while keeping the old one
            container.appendChild(newImg);
            
            // Fade in new image
            setTimeout(() => {
                newImg.style.opacity = "1";
                // Fade out old image
                currentContent.style.opacity = "0";
                
                // Remove old image after transition
                setTimeout(() => {
                    currentContent.remove();
                }, 500);
            }, 50);
        } else {
            container.appendChild(newImg);
            setTimeout(() => {
                newImg.style.opacity = "1";
            }, 50);
        }
    };

    updateButtons();
}

function updateButtons() {
    if (currentPath) {
        const pathScenes = currentPath === 'nick' ? nickPath : cnPath;
        prevBtn.style.display = "block"; // Always show to allow returning to start
        nextBtn.style.display = currentPathIndex < pathScenes.length - 1 ? "block" : "none";
    } else {
        prevBtn.style.display = currentSlide > 0 ? "block" : "none";
        nextBtn.style.display = currentSlide < scenes.length - 1 ? "block" : "none";
    }
}

function nextSlide() {
    if (!experienceStarted) return;

    if (currentPath) {
        const pathScenes = currentPath === 'nick' ? nickPath : cnPath;
        if (currentPathIndex < pathScenes.length - 1) {
            currentPathIndex++;
            showPathScene(currentPathIndex);
            if (pathScenes[currentPathIndex - 1]) {
                audio.currentTime = pathScenes[currentPathIndex - 1].endTime;
                audio.play().catch(error => {
                    console.error('Error playing audio:', error);
                });
            }
        }
    } else if (currentSlide < scenes.length - 1) {
        currentSlide++;
        renderSlide(currentSlide);
        if (scenes[currentSlide - 1]) {
            audio.currentTime = scenes[currentSlide - 1].endTime;
            audio.play();
        }
    }
    updateButtons();
}

function prevSlide() {
    if (!experienceStarted) return;

    if (currentPath) {
        if (currentPathIndex > 0) {
            currentPathIndex--;
            showPathScene(currentPathIndex);
            if (currentPathIndex > 0 && pathScenes[currentPathIndex - 1]) {
                audio.currentTime = pathScenes[currentPathIndex - 1].endTime;
            } else {
                audio.currentTime = currentPath === 'nick' ? 2.3 : 0;
            }
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
            });
        } else {
            // Return to main sequence
            currentPath = null;
            currentSlide = scenes.length - 2; // Go to scene before choice
            
            // Remove channel buttons if they exist
            const channelButtons = container.querySelector('.channel-buttons');
            if (channelButtons) {
                channelButtons.remove();
            }

            audio.src = 'audio/01-WakingUp.mp3';
            audio.load();
            if (scenes[currentSlide - 1]) {
                audio.currentTime = scenes[currentSlide - 1].endTime;
            }
            audio.play().then(() => {
                renderSlide(currentSlide);
            }).catch(error => {
                console.error('Error playing audio:', error);
                renderSlide(currentSlide);
            });
        }
    } else if (currentSlide > 0) {
        currentSlide--;
        renderSlide(currentSlide);
        if (currentSlide === 0) {
            audio.currentTime = 0;
        } else if (scenes[currentSlide - 1]) {
            audio.currentTime = scenes[currentSlide - 1].endTime;
        }
        audio.play();
    }
    updateButtons();
}

// Handle audio timeupdate for automatic scene transitions
audio.addEventListener("timeupdate", () => {
    if (!experienceStarted) return;
    
    if (currentPath) {
        const pathScenes = currentPath === 'nick' ? nickPath : cnPath;
        const currentTime = audio.currentTime;
        const targetScene = pathScenes.findIndex(scene => currentTime < scene.endTime);
        
        if (targetScene !== -1 && targetScene !== currentPathIndex && targetScene < pathScenes.length) {
            currentPathIndex = targetScene;
            showPathScene(currentPathIndex);
            updateButtons();
        }
    } else {
        const currentTime = audio.currentTime;
        const targetScene = scenes.findIndex(scene => currentTime < scene.endTime);
        
        if (targetScene !== -1 && targetScene !== currentSlide && targetScene < scenes.length) {
            currentSlide = targetScene;
            renderSlide(currentSlide);
            updateButtons();
        }
    }
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!experienceStarted) return;
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prevSlide();
    }
});

// Event listeners
nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

// Initialize experience
Promise.all([
    new Promise(resolve => {
        if (audio.readyState >= 2) resolve();
        else audio.addEventListener('canplay', resolve);
    }),
    preloadImages()
]).then(() => {
    // Show first slide immediately as background
    const firstSlide = document.createElement("img");
    firstSlide.src = scenes[0].src;
    firstSlide.style.width = "100%";
    firstSlide.style.height = "100%";
    firstSlide.style.objectFit = "cover";
    container.insertBefore(firstSlide, loading);
    
    startExperience();
}).catch(error => {
    console.error('Failed to load resources:', error);
    loading.innerHTML = `
        <div class="loading-message">
            Failed to load resources. Please refresh the page.
        </div>
    `;
});

function startExperience() {
    if (experienceStarted) return;
    
    audio.play().then(() => {
        experienceStarted = true;
        loading.style.display = 'none';
        renderSlide(0);
        updateButtons();
    }).catch(error => {
        console.error('Audio playback failed:', error);
        loading.innerHTML = `
            <div class="start-container">
                <button id="manualStart">Start Experience</button>
            </div>
        `;
        
        document.getElementById('manualStart').addEventListener('click', () => {
            audio.play().then(() => {
                experienceStarted = true;
                loading.style.display = 'none';
                renderSlide(0);
                updateButtons();
            }).catch(error => {
                console.error('Failed to play audio even after user interaction:', error);
                // Still start the experience without audio if it fails
                experienceStarted = true;
                loading.style.display = 'none';
                renderSlide(0);
                updateButtons();
            });
        });
    });
}

function restartExperience() {
    // Reset all state variables
    currentSlide = 0;
    currentPath = null;
    currentPathIndex = 0;
    
    // Reset audio to beginning
    audio.src = 'audio/01-WakingUp.mp3';
    audio.load();
    audio.currentTime = 0;

    // Clear container and remove any existing content
    container.innerHTML = '';

    // Start from beginning
    audio.play().then(() => {
        renderSlide(0);
        updateButtons();
    }).catch(error => {
        console.error('Failed to restart audio:', error);
        renderSlide(0);
        updateButtons();
    });
}

// Event listeners
nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);
document.getElementById('restart-btn').addEventListener("click", restartExperience);

// Initialize experience
Promise.all([
    new Promise(resolve => {
        if (audio.readyState >= 2) resolve();
        else audio.addEventListener('canplay', resolve);
    }),
    preloadImages()
]).then(() => {
    // Show first slide immediately as background
    const firstSlide = document.createElement("img");
    firstSlide.src = scenes[0].src;
    firstSlide.style.width = "100%";
    firstSlide.style.height = "100%";
    firstSlide.style.objectFit = "cover";
    container.insertBefore(firstSlide, loading);
    
    startExperience();
}).catch(error => {
    console.error('Failed to load resources:', error);
    loading.innerHTML = `
        <div class="loading-message">
            Failed to load resources. Please refresh the page.
        </div>
    `;
});

// Remove any conflicting styles for the restart button
const existingStyles = document.querySelectorAll('style');
existingStyles.forEach(style => {
    if (style.textContent.includes('#restart-btn')) {
        style.remove();
    }
});

// Add unified button styles
const buttonStyles = document.createElement('style');
buttonStyles.textContent = `
    .controls {
        position: fixed;
        bottom: clamp(4rem, 6vh, 6rem);
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        z-index: 10;
        padding: 0 1rem;
    }

    .progress-container {
        width: 100%;
        max-width: 600px;
        background: rgba(255, 255, 255, 0.2);
        height: 4px;
        border-radius: 2px;
        cursor: pointer;
        position: relative;
    }

    .progress-bar {
        background: rgba(255, 255, 255, 0.85);
        height: 100%;
        border-radius: 2px;
        width: 0;
        transition: width 0.1s linear;
    }

    .progress-handle {
        position: absolute;
        top: 50%;
        width: 12px;
        height: 12px;
        background: white;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
    }

    .progress-container:hover .progress-handle {
        opacity: 1;
    }

    .button-controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: clamp(0.75rem, 1.5vw, 1.5rem);
    }

    .controls-center {
        display: flex;
        align-items: center;
        position: static;
        transform: none;
    }

    #prev-btn, #next-btn, #restart-btn {
        all: unset;
        background-color: rgba(255, 255, 255, 0.85);
        padding: clamp(0.4rem, 0.8vw, 0.8rem) clamp(0.8rem, 1.2vw, 1.2rem);
        font-size: clamp(0.8rem, 0.9vw, 0.9rem);
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.3s ease;
        height: clamp(2.2rem, 2.8vw, 2.8rem);
        min-width: clamp(5rem, 6vw, 6rem);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        margin: 0;
        position: static;
        color: #000;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
        line-height: 1;
    }

    #prev-btn:hover, #next-btn:hover, #restart-btn:hover {
        background-color: rgba(255, 255, 255, 0.95);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 768px) {
        .controls {
            bottom: clamp(3rem, 5vh, 5rem);
            gap: 0.6rem;
        }
    }

    @media (max-width: 480px) {
        .controls {
            bottom: clamp(2.5rem, 4vh, 4rem);
            gap: 0.4rem;
            padding: 0 0.5rem;
        }
    }
`;
document.head.appendChild(buttonStyles);

// Add loading overlay styles
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    .start-container {
        text-align: center;
    }
    #manualStart {
        background: transparent;
        border: 2px solid rgba(255, 255, 255, 0.8);
        color: rgba(255, 255, 255, 0.9);
        padding: 8px 20px;
        font-size: 16px;
        letter-spacing: 0.5px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
        border-radius: 4px;
    }
    #manualStart:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: white;
        color: white;
    }
    .loading-message {
        color: rgba(255, 255, 255, 0.9);
        font-size: 16px;
        text-align: center;
    }
`;
document.head.appendChild(loadingStyles);

// Add audio progress functionality
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const progressHandle = document.getElementById('progress-handle');
let isDragging = false;

function updateProgress() {
    if (!isDragging && audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
        progressHandle.style.left = `${progress}%`;
    }
}

function seek(e) {
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const seekTime = pos * audio.duration;
    if (!isNaN(seekTime) && isFinite(seekTime)) {
        audio.currentTime = seekTime;
        updateProgress();
    }
}

progressContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    seek(e);
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        seek(e);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

progressContainer.addEventListener('mouseleave', () => {
    if (!isDragging) {
        progressHandle.style.opacity = '0';
    }
});

progressContainer.addEventListener('mouseenter', () => {
    progressHandle.style.opacity = '1';
});

// Update progress bar as audio plays
audio.addEventListener('timeupdate', updateProgress);

// Update progress bar when audio is loaded
audio.addEventListener('loadedmetadata', updateProgress);

document.getElementById('year').textContent = new Date().getFullYear();