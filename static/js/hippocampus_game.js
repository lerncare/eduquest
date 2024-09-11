document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.getElementById('hippocampus-game-container');
    const startButton = document.getElementById('start-hippocampus-game');
    const resultDiv = document.getElementById('hippocampus-result');
    
    let tasks = [
        {name: 'Unterricht vorbereiten', duration: 30},
        {name: 'Arbeiten korrigieren', duration: 45},
        {name: 'Lehrerkonferenz', duration: 60},
        {name: 'Elterngespräch', duration: 20},
        {name: 'Fortbildung', duration: 90}
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
                <h3>Aufgabe: ${task.name}</h3>
                <p>Schätze die Dauer (in Minuten):</p>
                <input type="number" id="duration-input" min="1" max="120">
                <button onclick="submitEstimate()">Einreichen</button>
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
            resultDiv.textContent = "Ausgezeichnete Schätzung!";
        } else if (difference <= 15) {
            score += 1;
            resultDiv.textContent = "Gute Schätzung, aber es gibt noch Verbesserungspotenzial.";
        } else {
            resultDiv.textContent = "Deine Schätzung war nicht genau. Versuche beim nächsten Mal genauer zu sein.";
        }
        
        currentTask++;
        setTimeout(displayTask, 2000);
    }
    
    function endGame() {
        gameContainer.innerHTML = `<h2>Spiel beendet!</h2><p>Deine Punktzahl: ${score}/${shuffledTasks.length * 3}</p>`;
        startButton.style.display = 'block';
        startButton.textContent = 'Erneut spielen';
    }
    
    startButton.addEventListener('click', startGame);
});
