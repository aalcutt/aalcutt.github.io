(() => {
  var myrng = new Math.seedrandom('hello.');
  const buttonSides = ['left', 'right'];
  const instructionEl = document.getElementById('instruction');
  let currentButtonSide = null;
  let gameOverTimer = null;  
  let startTime = null;
  let score = 0;
  let isGameOver = false;
  
  buttonSides.forEach((buttonSide) => {
    const buttonEl = document.getElementsByClassName(buttonSide)[0];
    buttonEl.addEventListener('click', () => onButtonClick(buttonSide))
  })

  function onButtonClick(buttonSide) {
    if (isGameOver) {
      return;
    }
    if (buttonSide === currentButtonSide) {
      instructionEl.textContent = 'correct';
      score += 1;
      if (score >= 10) {
        gameOver(true);
      }
      else {
        nextButtonSideInSequence();
      }
    }
    else {
      gameOver(false);
    }
  }

  function nextButtonSideInSequence() {
    const r = Math.floor(myrng.quick() * 2);
    const nextSide = buttonSides[r];

    currentButtonSide = nextSide;
    instructionEl.textContent = nextSide;
  }

  function gameOver(didWin) {
    isGameOver = true;
    const endTime = Date.now();
    const elapsed = (endTime - startTime) / 1000
    if (didWin) {
      instructionEl.innerHTML = 'you win<br />score: ' + score + '<br />time: ' + elapsed + ' seconds';
    }
    else {
      instructionEl.innerHTML = 'game over<br />score: ' + score + '<br />time: ' + elapsed + ' seconds';
    }
  }

  function start() {
    isGameOver = false;
    startTime = Date.now();
    score = 0;
    nextButtonSideInSequence();
  }

  start();
})();