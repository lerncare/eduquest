document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.getElementById('amygdala-game-container');
    const startButton = document.getElementById('start-amygdala-game');
    const resultDiv = document.getElementById('amygdala-result');
    
    let scenarios = [
        {
            situation: "A student becomes disruptive during class.",
            options: [
                { text: "Raise your voice and demand silence", score: 0 },
                { text: "Calmly ask the student to step outside for a moment", score: 2 },
                { text: "Ignore the behavior and continue teaching", score: 1 }
            ]
        },
        {
            situation: "A parent angrily complains about their child's grade.",
            options: [
                { text: "Defend your grading policy firmly", score: 1 },
                { text: "Listen actively and offer to review the work together", score: 2 },
                { text: "Apologize and offer to change the grade", score: 0 }
            ]
        },
        {
            situation: "Two students start arguing loudly during group work.",
            options: [
                { text: "Separate the students immediately", score: 1 },
                { text: "Ask the class to take a short break while you mediate", score: 2 },
                { text: "Tell them to resolve it themselves or face detention", score: 0 }
            ]
        }
    ];
    
    let currentScenario = 0;
    let score = 0;
    
    function startGame() {
        currentScenario = 0;
        score = 0;
        displayScenario();
        startButton.style.display = 'none';
    }
    
    function displayScenario() {
        if (currentScenario < scenarios.length) {
            const scenario = scenarios[currentScenario];
            let optionsHtml = scenario.options.map((option, index) => 
                `<button onclick="selectOption(${index})">${option.text}</button>`
            ).join('');
            
            gameContainer.innerHTML = `
                <h3>Scenario:</h3>
                <p>${scenario.situation}</p>
                <h4>How would you respond?</h4>
                ${optionsHtml}
            `;
        } else {
            endGame();
        }
    }
    
    window.selectOption = function(index) {
        const scenario = scenarios[currentScenario];
        score += scenario.options[index].score;
        
        resultDiv.textContent = scenario.options[index].score === 2 ? 
            "Great choice! That's an effective way to deescalate the situation." :
            scenario.options[index].score === 1 ?
            "That could work, but there might be a better approach." :
            "Be careful, that approach might escalate the situation.";
        
        currentScenario++;
        setTimeout(displayScenario, 2000);
    }
    
    function endGame() {
        gameContainer.innerHTML = `<h2>Game Over!</h2><p>Your score: ${score}/${scenarios.length * 2}</p>`;
        startButton.style.display = 'block';
        startButton.textContent = 'Play Again';
    }
    
    startButton.addEventListener('click', startGame);
});
