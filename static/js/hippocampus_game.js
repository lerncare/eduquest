document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.getElementById('hippocampus-game-container');
    const startButton = document.getElementById('start-hippocampus-game');
    const resultDiv = document.getElementById('hippocampus-result');
    
    let tasks = [
        {name: 'Prepare lesson', duration: 30},
        {name: 'Grade papers', duration: 45},
        {name: 'Staff meeting', duration: 60},
        {name: 'Parent conference', duration: 20},
        {name: 'Professional development', duration: 90}
    ];
    
    let shuffledTasks = [];
    let currentTask = 0;
    let score = 0;
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    function startGame() {
        shuffledTasks = [...tasks];
        shuffleArray(shuffledTasks);
        currentTask = 0;
        score = 0;
        displayTask();
        startButton.style.display = 'none';
    }
    
    function displayTask() {
        if (currentTask < shuffledTasks.length) {
            const task = shuffledTasks[currentTask];
            gameContainer.innerHTML = `
                <h3>Task: ${task.name}</h3>
                <p>Estimate the duration (in minutes):</p>
                <input type="number" id="duration-input" min="1" max="120">
                <button onclick="submitEstimate()">Submit</button>
            `;
        } else {
            endGame();
        }
    }
    
    window.submitEstimate = function() {
        const task = shuffledTasks[currentTask];
        const estimate = parseInt(document.getElementById('duration-input').value);
        const actualDuration = task.duration;
        const difference = Math.abs(estimate - actualDuration);
        
        if (difference <= 5) {
            score += 3;
            resultDiv.textContent = "Excellent estimate!";
        } else if (difference <= 15) {
            score += 1;
            resultDiv.textContent = "Good estimate, but there's room for improvement.";
        } else {
            resultDiv.textContent = "Your estimate was off. Try to be more accurate next time.";
        }
        
        currentTask++;
        setTimeout(displayTask, 2000);
    }
    
    function endGame() {
        gameContainer.innerHTML = `<h2>Game Over!</h2><p>Your score: ${score}/${shuffledTasks.length * 3}</p>`;
        startButton.style.display = 'block';
        startButton.textContent = 'Play Again';
    }
    
    startButton.addEventListener('click', startGame);
});
