document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.getElementById('game-container');
    const startButton = document.getElementById('start-game');
    const resultDiv = document.getElementById('result');
    
    let tasks = [
        {name: 'Arbeiten korrigieren', priority: 3},
        {name: 'Unterricht vorbereiten', priority: 2},
        {name: 'Lehrerkonferenz', priority: 1},
        {name: 'Elterngespräch', priority: 2},
        {name: 'Fortbildung', priority: 1}
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
                <h3>Aufgabe: ${task.name}</h3>
                <p>Wähle die Priorität:</p>
                <button onclick="choosePriority(1)">Niedrig</button>
                <button onclick="choosePriority(2)">Mittel</button>
                <button onclick="choosePriority(3)">Hoch</button>
            `;
        } else {
            endGame();
        }
    }
    
    window.choosePriority = function(priority) {
        const task = tasks[currentTask];
        if (priority === task.priority) {
            score++;
            resultDiv.textContent = "Richtig!";
            resultDiv.style.color = 'green';
        } else {
            resultDiv.textContent = "Falsch. Die richtige Priorität war " + 
                (task.priority === 1 ? "Niedrig" : task.priority === 2 ? "Mittel" : "Hoch");
            resultDiv.style.color = 'red';
        }
        currentTask++;
        setTimeout(displayTask, 1500);
    }
    
    function endGame() {
        gameContainer.innerHTML = `<h2>Spiel beendet!</h2><p>Deine Punktzahl: ${score}/${tasks.length}</p>`;
        startButton.style.display = 'block';
        startButton.textContent = 'Erneut spielen';
    }
    
    startButton.addEventListener('click', startGame);
});
