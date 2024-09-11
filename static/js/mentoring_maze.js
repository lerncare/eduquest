document.addEventListener('DOMContentLoaded', function() {
    const mazeContainer = document.getElementById('maze-container');
    const startButton = document.getElementById('start-game');
    const challengeDescription = document.getElementById('challenge-description');
    const resultDiv = document.getElementById('result');

    const mazeSize = 10;
    let maze = [];
    let playerPosition = { x: 0, y: 0 };

    function generateMaze() {
        for (let y = 0; y < mazeSize; y++) {
            maze[y] = [];
            for (let x = 0; x < mazeSize; x++) {
                maze[y][x] = Math.random() < 0.3 ? 1 : 0; // 30% chance of wall
            }
        }
        maze[0][0] = 0; // Ensure start is open
        maze[mazeSize-1][mazeSize-1] = 0; // Ensure end is open
    }

    function renderMaze() {
        mazeContainer.innerHTML = '';
        for (let y = 0; y < mazeSize; y++) {
            for (let x = 0; x < mazeSize; x++) {
                const cell = document.createElement('div');
                cell.style.position = 'absolute';
                cell.style.left = `${x * 50}px`;
                cell.style.top = `${y * 50}px`;
                cell.style.width = '48px';
                cell.style.height = '48px';
                cell.style.border = '1px solid #ccc';
                cell.style.backgroundColor = maze[y][x] ? '#333' : '#fff';
                if (x === playerPosition.x && y === playerPosition.y) {
                    cell.style.backgroundColor = '#00f';
                }
                mazeContainer.appendChild(cell);
            }
        }
    }

    function movePlayer(dx, dy) {
        const newX = playerPosition.x + dx;
        const newY = playerPosition.y + dy;
        if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize && maze[newY][newX] === 0) {
            playerPosition.x = newX;
            playerPosition.y = newY;
            renderMaze();
            checkWin();
        }
    }

    function checkWin() {
        if (playerPosition.x === mazeSize - 1 && playerPosition.y === mazeSize - 1) {
            resultDiv.textContent = 'Gratulation! Sie haben das Labyrinth gemeistert!';
            document.removeEventListener('keydown', handleKeyPress);
        }
    }

    function handleKeyPress(e) {
        switch(e.key) {
            case 'ArrowUp': movePlayer(0, -1); break;
            case 'ArrowDown': movePlayer(0, 1); break;
            case 'ArrowLeft': movePlayer(-1, 0); break;
            case 'ArrowRight': movePlayer(1, 0); break;
        }
    }

    function startGame() {
        generateMaze();
        playerPosition = { x: 0, y: 0 };
        renderMaze();
        challengeDescription.textContent = 'Navigieren Sie durch das Labyrinth mit den Pfeiltasten. Erreichen Sie das untere rechte Feld.';
        document.addEventListener('keydown', handleKeyPress);
        startButton.style.display = 'none';
    }

    startButton.addEventListener('click', startGame);
});
