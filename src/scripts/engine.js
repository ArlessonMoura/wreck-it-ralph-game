const state = {
  view: {
    squares: document.querySelectorAll('.square'),
    enemy: document.querySelector('.enemy'),
    timeLeft: document.querySelector('#time-left'),
    score: document.querySelector('#score'),
  },
  values: {
    gameVelocity: 1000,
    hitPosition: 0,
    result: 0,
    currentTime: 60,
  },
  actions: {
    timerId: null,
    countDownTimerId: null,
  },
};

function setRankingOnLocalStorage(value) {
  const maxKeys = 5;
  const existingKeys = Object.keys(localStorage);
  if (existingKeys.length >= maxKeys) {
    const oldestKey = existingKeys[0];
    localStorage.removeItem(oldestKey);
  }
  localStorage.setItem(`Record ${existingKeys.length + 1}`, value);
}

function mountRankingBoard() {
  let mensagem = '';
  const existingKeys = Object.keys(localStorage);
  existingKeys.forEach((key) => {
    const value = localStorage.getItem(key);
    mensagem += `${key}: ${value}\n`;
  });

  return mensagem;
}

function startGameCore(button) {
  if (button.name === 'refresh') {
    location.reload();
  }
  setInterval(randomSquare, 1000);
  setInterval(countDown, 1000);
  button.name = 'refresh';
}

function startGameCore(button) {
  if (button.name === 'refresh') {
    location.reload();
  }
  state.actions.timerId = setInterval(randomSquare, 1000);
  state.actions.countDownTimerId = setInterval(countDown, 1000);

  button.name = 'refresh';
}

function countDown() {
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;

  if (state.values.currentTime <= 0) {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
    setRankingOnLocalStorage(state.values.result);
    const rankingBoard = mountRankingBoard();
    alert(`Game Over! O seu resultado foi: ${state.values.result}
    ${rankingBoard}`);
  }
}

function playSound(audioName) {
  let audio = new Audio(`./src/audios/${audioName}.m4a`);
  audio.volume = 0.2;
  audio.play();
}

function randomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove('enemy');
  });

  let randomNumber = Math.floor(Math.random() * 9);
  let randomSquare = state.view.squares[randomNumber];
  randomSquare.classList.add('enemy');
  state.values.hitPosition = randomSquare.id;
}

function addListenerHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener('mousedown', () => {
      if (square.id === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playSound('hit');
      }
    });
  });
}

function initialize() {
  addListenerHitBox();
}

initialize();
