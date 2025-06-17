const holes = document.querySelectorAll(".hole");
const scoreBoard = document.querySelector(".score");
const timeDisplay = document.getElementById('time');
const moles = document.querySelectorAll(".mole");
const gameOverModal = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');
const highScoreDisplay = document.getElementById('highScore');

// Add sound effects
const bombSound = new Audio('media/bomb.mp3');
const startSound = new Audio('media/start.mp3');
const endWarningSound = new Audio('media/end_warning.mp3');
const missSound = new Audio('media/miss.mp3');
const hitSound = new Audio('media/hit.mp3');
const clickSound = new Audio('media/click.mp3');
// clickSound is already declared later in the file, so this declaration should be removed

let lastHole;
let timeUp = false;
let score = 0;
let countdown;
// let highScore = 0;
let bombHits = 0;
let warningPlayed = false;

      // Load high score from memory
      let savedHighScore = 0;
      if (savedHighScore) {
        highScore = savedHighScore;
      }

      function randomTime(min, max) {
        return Math.round(Math.random() * (max - min) + min);
      }

      function randomHole(holes) {
        const idx = Math.floor(Math.random() * holes.length);
        const hole = holes[idx];
        if (hole === lastHole) {
          return randomHole(holes);
        }
        lastHole = hole;
        return hole;
      }

      function peep() {
        if (timeUp) return;
        
        const isBomb = Math.random() < 0.2; // 20% chance of bomb
        const time = isBomb ? randomTime(1500, 3000) : randomTime(1000, 2000); // Increased time ranges
        const hole = randomHole(holes);
        
        if (isBomb) {
            hole.classList.add("up", "bomb");
            hole.querySelector(".mole").style.backgroundImage = "url(assets/bomb.png)";
        } else {
            hole.classList.add("up");
            hole.querySelector(".mole").style.backgroundImage = "url(assets/mole.svg)";
        }
        
        hole.addEventListener('mouseleave', function onMouseLeave() {
            if (hole.classList.contains('up')) {
                missSound.play();
            }
            hole.removeEventListener('mouseleave', onMouseLeave);
        }, { once: true });
        
        setTimeout(() => {
            if (hole.classList.contains('up')) {
                missSound.play();
            }
            hole.classList.remove("up", "bomb");
            hole.querySelector(".mole").style.backgroundImage = "url(assets/mole.svg)";
            if (!timeUp) peep(); // This will keep calling peep until timeUp is true
        }, time);
      }

      // Add at the top with other DOM selections
      const bombHitsDisplay = document.getElementById('bombHitsDisplay');
      
      function startGame() {
          startSound.play();
          const startButton = document.querySelector('.start-button');
          startButton.style.display = 'none'; // Hide the button instead of just disabling it
          
          clearInterval(countdown);
          scoreBoard.textContent = 0;
          timeUp = false;
          score = 0;
          bombHits = 0;
          bombHitsDisplay.textContent = '0/3';
          warningPlayed = false;
          let timeLeft = 120;
          timeDisplay.textContent = timeLeft;
          timeDisplay.style.color = 'initial';
          
          holes.forEach(hole => {
              hole.classList.remove("up", "bomb");
              hole.querySelector(".mole").style.backgroundImage = "url(assets/mole.svg)";
          });
          
          peep();
          countdown = setInterval(() => {
              timeLeft--;
              timeDisplay.textContent = timeLeft;
              
              if (timeLeft <= 10 && !warningPlayed) {
                  endWarningSound.play();
                  timeDisplay.style.color = 'red';
                  warningPlayed = true;
              }
              
              if (timeLeft <= 0) {
                  clearInterval(countdown);
                  timeUp = true;
                  endGame();
              }
          }, 1000);
      }

      function bonk(e) {
          if (!e.isTrusted) return;
          if (timeUp) return;
          
          const hole = e.target.parentNode;
          if (hole.classList.contains("bomb")) {
              bombSound.play();
              bombHits++;
              bombHitsDisplay.textContent = `${bombHits}/3`; // Update bomb hits display
              if (bombHits >= 3) {
                  timeUp = true;
                  clearInterval(countdown); // Stop the timer
                  endGame();
                  return;
              }
          } else {
              hitSound.play();
              score++;
              scoreBoard.textContent = score;
          }
          
          hole.classList.remove("up", "bomb");
          hole.querySelector(".mole").style.backgroundImage = "url(assets/mole.svg)";
          
          // Add this line to spawn a new mole/bomb after clicking
          if (!timeUp) peep();
      }

      moles.forEach((mole) => mole.addEventListener("click", bonk));

      // Initialize high score display
      highScoreDisplay.textContent = highScore;

function endGame() {
    timeUp = true;
    clearInterval(countdown);
    
    finalScoreDisplay.textContent = score;
    gameOverModal.style.display = 'flex'; // Change to flex to match the CSS
    
    // Show the start button again
    const startButton = document.querySelector('.start-button');
    startButton.style.display = 'block';
}

function closeGameOver() {
    clickSound.play();
    gameOverModal.style.display = 'none';
    startGame(); // This will start a new game
}
    // Add this function to handle the Play Again button click
    // Add the click sound at the top with other audio declarations
    
    
    function closeGameOver() {
        clickSound.play();
        gameOverModal.style.display = 'none';
        
        // Reset game state
        scoreBoard.textContent = 0;
        timeUp = false;
        score = 0;
        bombHits = 0;
        bombHitsDisplay.textContent = '0/3';
        warningPlayed = false;
        
        // Reset timer
        let timeLeft = 120;
        timeDisplay.textContent = timeLeft;
        timeDisplay.style.color = 'initial';
        
        // Clear all moles/bombs
        holes.forEach(hole => {
            hole.classList.remove("up", "bomb");
            hole.querySelector(".mole").style.backgroundImage = "url(assets/mole.svg)";
        });
        
        // Start new game
        startSound.play();
        peep();
        countdown = setInterval(() => {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            
            if (timeLeft <= 10 && !warningPlayed) {
                endWarningSound.play();
                timeDisplay.style.color = 'red';
                warningPlayed = true;
            }
            
            if (timeLeft <= 0) {
                clearInterval(countdown);
                timeUp = true;
                endGame();
            }
        }, 1000);
    }
    
    // Update the start button click handler
    document.querySelector('.start-button').addEventListener('click', () => {
        clickSound.play();
    });
// This closing brace appears to be extra and should be removed as it doesn't match any opening brace
