document.addEventListener('DOMContentLoaded', function() {
    const tetrisContainer = document.getElementById('tetris-container');
    const startButton = document.getElementById('start-game');
    const pauseButton = document.getElementById('pause-game');
    const restartButton = document.getElementById('restart-game');
    const nextTaskDescription = document.getElementById('next-task-description');
    const currentScoreElement = document.getElementById('current-score');
    const finalScoreElement = document.getElementById('final-score');
    const gameOverElement = document.getElementById('game-over');

    const ROWS = 20;
    const COLS = 10;
    let grid = [];
    let currentPiece;
    let nextPiece;
    let score = 0;
    let gameInterval;
    let isPaused = false;

    const tasks = [
        { name: 'Unterricht vorbereiten', color: '#FF0000' },
        { name: 'Hausaufgaben korrigieren', color: '#00FF00' },
        { name: 'Elterngespräch führen', color: '#0000FF' },
        { name: 'Konferenz teilnehmen', color: '#FFFF00' },
        { name: 'Fortbildung besuchen', color: '#FF00FF' }
    ];

    function initGrid() {
        for (let i = 0; i < ROWS; i++) {
            grid[i] = [];
            for (let j = 0; j < COLS; j++) {
                grid[i][j] = 0;
            }
        }
    }

    function drawGrid() {
        tetrisContainer.innerHTML = '';
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                const cell = document.createElement('div');
                cell.style.position = 'absolute';
                cell.style.width = '30px';
                cell.style.height = '30px';
                cell.style.left = `${j * 30}px`;
                cell.style.top = `${i * 30}px`;
                cell.style.backgroundColor = grid[i][j] ? grid[i][j] : 'white';
                cell.style.border = '1px solid #ccc';
                tetrisContainer.appendChild(cell);
            }
        }
    }

    function createPiece() {
        const task = tasks[Math.floor(Math.random() * tasks.length)];
        return {
            shape: [
                [1, 1],
                [1, 1]
            ],
            color: task.color,
            name: task.name,
            x: 4,
            y: 0
        };
    }

    function drawPiece() {
        for (let i = 0; i < currentPiece.shape.length; i++) {
            for (let j = 0; j < currentPiece.shape[i].length; j++) {
                if (currentPiece.shape[i][j]) {
                    const x = currentPiece.x + j;
                    const y = currentPiece.y + i;
                    if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
                        grid[y][x] = currentPiece.color;
                    }
                }
            }
        }
    }

    function canMove(dx, dy) {
        for (let i = 0; i < currentPiece.shape.length; i++) {
            for (let j = 0; j < currentPiece.shape[i].length; j++) {
                if (currentPiece.shape[i][j]) {
                    const newX = currentPiece.x + j + dx;
                    const newY = currentPiece.y + i + dy;
                    if (newY >= ROWS || newX < 0 || newX >= COLS || (newY >= 0 && grid[newY][newX])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function movePiece(dx, dy) {
        if (canMove(dx, dy)) {
            currentPiece.x += dx;
            currentPiece.y += dy;
            return true;
        }
        return false;
    }

    function rotatePiece() {
        const rotated = currentPiece.shape[0].map((_, i) =>
            currentPiece.shape.map(row => row[i]).reverse()
        );
        const originalShape = currentPiece.shape;
        currentPiece.shape = rotated;
        if (!canMove(0, 0)) {
            currentPiece.shape = originalShape;
        }
    }

    function checkLines() {
        let linesCleared = 0;
        for (let i = ROWS - 1; i >= 0; i--) {
            if (grid[i].every(cell => cell !== 0)) {
                grid.splice(i, 1);
                grid.unshift(new Array(COLS).fill(0));
                linesCleared++;
            }
        }
        if (linesCleared > 0) {
            score += linesCleared * 100;
            currentScoreElement.textContent = score;
        }
    }

    function gameLoop() {
        if (!movePiece(0, 1)) {
            drawPiece();
            checkLines();
            currentPiece = nextPiece;
            nextPiece = createPiece();
            nextTaskDescription.textContent = nextPiece.name;
            if (!canMove(0, 0)) {
                clearInterval(gameInterval);
                gameOver();
            }
        }
        drawGrid();
    }

    function gameOver() {
        gameOverElement.style.display = 'block';
        finalScoreElement.textContent = score;
        submitScore(score);
    }

    function submitScore(score) {
        fetch('{{ url_for("games.submit_tetris_score") }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `score=${score}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data.message);
            }
        });
    }

    function startGame() {
        initGrid();
        score = 0;
        currentScoreElement.textContent = score;
        gameOverElement.style.display = 'none';
        currentPiece = createPiece();
        nextPiece = createPiece();
        nextTaskDescription.textContent = nextPiece.name;
        gameInterval = setInterval(gameLoop, 1000);
        isPaused = false;
    }

    startButton.addEventListener('click', startGame);

    pauseButton.addEventListener('click', function() {
        if (isPaused) {
            gameInterval = setInterval(gameLoop, 1000);
            pauseButton.textContent = 'Pause';
        } else {
            clearInterval(gameInterval);
            pauseButton.textContent = 'Fortsetzen';
        }
        isPaused = !isPaused;
    });

    restartButton.addEventListener('click', startGame);

    document.addEventListener('keydown', function(e) {
        if (isPaused) return;
        switch (e.key) {
            case 'ArrowLeft':
                movePiece(-1, 0);
                break;
            case 'ArrowRight':
                movePiece(1, 0);
                break;
            case 'ArrowDown':
                movePiece(0, 1);
                break;
            case 'ArrowUp':
                rotatePiece();
                break;
        }
        drawGrid();
    });

    initGrid();
    drawGrid();
});
