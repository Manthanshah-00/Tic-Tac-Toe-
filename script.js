// ── DOM ──
const cells       = document.querySelectorAll('.cell');
const statusEl    = document.getElementById('status');
const restartEl   = document.getElementById('restart');
const scoreXEl    = document.getElementById('score-x');
const scoreOEl    = document.getElementById('score-o');
const scoreDrawEl = document.getElementById('score-draw');

// ── State ──
let board         = Array(9).fill('');
let currentPlayer = 'X';
let gameActive    = true;
let scores        = { X: 0, O: 0, Draw: 0 };

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// ── Helpers ──
const mark = p => p === 'X'
  ? '<span class="x-mark">✕</span>'
  : '<span class="o-mark">◯</span>';

const symbol = p => p === 'X' ? '✕' : '◯';

function updateScores() {
  scoreXEl.textContent    = scores.X;
  scoreOEl.textContent    = scores.O;
  scoreDrawEl.textContent = scores.Draw;
}

function findWinner() {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return { winner: board[a], line: [a, b, c] };
  }
  return null;
}

// ── Cell Click ──
function handleClick(e) {
  const cell  = e.currentTarget;
  const index = +cell.dataset.index;

  if (board[index] || !gameActive) return;

  // Place
  board[index] = currentPlayer;
  cell.textContent = symbol(currentPlayer);
  cell.classList.add(currentPlayer.toLowerCase());

  // Win?
  const result = findWinner();
  if (result) {
    gameActive = false;
    result.line.forEach(i => cells[i].classList.add('win'));
    scores[result.winner]++;
    updateScores();
    statusEl.innerHTML = `${mark(result.winner)} wins! 🎉`;
    return;
  }

  // Draw?
  if (board.every(c => c)) {
    gameActive = false;
    scores.Draw++;
    updateScores();
    statusEl.innerHTML = "It's a draw 🤝";
    return;
  }

  // Next turn
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusEl.innerHTML = `Player ${mark(currentPlayer)}'s turn`;
}

// ── Restart ──
function restart() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;

  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
  });

  statusEl.innerHTML = `Player ${mark('X')}'s turn`;
}

// ── Bind ──
cells.forEach(c => c.addEventListener('click', handleClick));
restartEl.addEventListener('click', restart);