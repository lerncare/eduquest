document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.getElementById('game-container');
    const startButton = document.getElementById('start-game');
    const resultDiv = document.getElementById('result');
    
    let tasks = [
        {name: 'Grade papers', priority: 3},
        {name: 'Prepare lesson', priority: 2},
        {name: 'Staff meeting', priority: 1},
        {name: 'Parent conference', priority: 2},
        {name: 'Professional development', priority: 1}
    ];
    
    let currentTask = 0;
    let score = 0;
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    function startGame() {
        shuffleArray(tasks);
        currentTask = 0;
        score = 0;
        displayTask();
        startButton.style.display = 'none';
    }
    
    function displayTask() {
        if (currentTask < tasks.length) {
            const task = tasks[currentTask];
            gameContainer.innerHTML = `
                <h3>Task: ${task.name}</h3>
                <p>Choose the priority:</p>
                <button onclick="choosePriority(1)">Low</button>
                <button onclick="choosePriority(2)">Medium</button>
                <button onclick="choosePriority(3)">High</button>
            `;
        } else {
            endGame();
        }
    }
    
    window.choosePriority = function(priority) {
        const task = tasks[currentTask];
        if (priority === task.priority) {
            score++;
            resultDiv.textContent = "Correct!";
            resultDiv.style.color = 'green';
        } else {
            resultDiv.textContent = "Incorrect. The correct priority was " + 
                (task.priority === 1 ? "Low" : task.priority === 2 ? "Medium" : "High");
            resultDiv.style.color = 'red';
        }
        currentTask++;
        setTimeout(displayTask, 1500);
    }
    
    function endGame() {
        gameContainer.innerHTML = `<h2>Game Over!</h2><p>Your score: ${score}/${tasks.length}</p>`;
        startButton.style.display = 'block';
        startButton.textContent = 'Play Again';
    }
    
    startButton.addEventListener('click', startGame);
});
