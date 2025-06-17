const holes = document.querySelectorAll(".hole");
      const scoreBoard = document.querySelector(".score");
      const timeDisplay = document.getElementById('time');
      const moles = document.querySelectorAll(".mole");
      const gameOverModal = document.getElementById('gameOver');
      const finalScoreDisplay = document.getElementById('finalScore');
      const highScoreDisplay = document.getElementById('highScore');
      
      let lastHole;
      let timeUp = false;
      let score = 0;
      let countdown;
      let highScore = 0;

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
        const time = randomTime(200, 1000);
        const hole = randomHole(holes);
        hole.classList.add("up");
        setTimeout(() => {
          hole.classList.remove("up");
          if (!timeUp) peep();
        }, time);
      }

      function startGame() {
        clearInterval(countdown);
        scoreBoard.textContent = 0;
        timeUp = false;
        score = 0;
        let timeLeft = 120; // 2 minutes = 120 seconds
        timeDisplay.textContent = timeLeft;
        
        // Remove all moles from view
        holes.forEach(hole => hole.classList.remove("up"));
        
        peep();
        countdown = setInterval(() => {
          timeLeft--;
          timeDisplay.textContent = timeLeft;
          if (timeLeft <= 0) {
            clearInterval(countdown);
            endGame();
          }
        }, 1000);
        
        setTimeout(() => {
          timeUp = true;
          endGame();
        }, 120000); // 2 minutes
      }

      function endGame() {
        timeUp = true;
        clearInterval(countdown);
        
        // Remove all moles from view
        holes.forEach(hole => hole.classList.remove("up"));
        
        // Update high score
        if (score > highScore) {
          highScore = score;
          // In a real application, you would save this to localStorage
          // localStorage.setItem('whackAMoleHighScore', highScore);
        }
        
        // Show game over modal
        finalScoreDisplay.textContent = score;
        highScoreDisplay.textContent = highScore;
        gameOverModal.style.display = 'flex';
      }

      function closeGameOver() {
        gameOverModal.style.display = 'none';
        // Reset timer display
        timeDisplay.textContent = '120';
      }

      function bonk(e) {
        if (!e.isTrusted) return;
        if (timeUp) return;
        
        score++;
        this.parentNode.classList.remove("up");
        scoreBoard.textContent = score;
        
        // Add some visual feedback
        this.style.transform = 'scale(0.8)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 100);
      }

      moles.forEach((mole) => mole.addEventListener("click", bonk));

      // Initialize high score display
      highScoreDisplay.textContent = highScore;