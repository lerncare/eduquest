document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.getElementById('amygdala-game-container');
    const startButton = document.getElementById('start-amygdala-game');
    const resultDiv = document.getElementById('amygdala-result');
    
    let scenarios = [
        {
            situation: "Ein Schüler wird während des Unterrichts störend.",
            options: [
                { text: "Die Stimme erheben und Ruhe fordern", score: 0 },
                { text: "Den Schüler ruhig bitten, kurz nach draußen zu gehen", score: 2 },
                { text: "Das Verhalten ignorieren und mit dem Unterricht fortfahren", score: 1 }
            ]
        },
        {
            situation: "Ein Elternteil beschwert sich wütend über die Note ihres Kindes.",
            options: [
                { text: "Die Benotungskriterien entschieden verteidigen", score: 1 },
                { text: "Aktiv zuhören und anbieten, die Arbeit gemeinsam durchzugehen", score: 2 },
                { text: "Sich entschuldigen und anbieten, die Note zu ändern", score: 0 }
            ]
        },
        {
            situation: "Zwei Schüler beginnen während der Gruppenarbeit laut zu streiten.",
            options: [
                { text: "Die Schüler sofort trennen", score: 1 },
                { text: "Die Klasse bitten, eine kurze Pause zu machen, während Sie vermitteln", score: 2 },
                { text: "Ihnen sagen, sie sollen es selbst lösen oder nachsitzen", score: 0 }
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
                <h3>Szenario:</h3>
                <p>${scenario.situation}</p>
                <h4>Wie würdest du reagieren?</h4>
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
            "Großartige Wahl! Das ist ein effektiver Weg, die Situation zu deeskalieren." :
            scenario.options[index].score === 1 ?
            "Das könnte funktionieren, aber es gibt möglicherweise einen besseren Ansatz." :
            "Sei vorsichtig, dieser Ansatz könnte die Situation eskalieren.";
        
        currentScenario++;
        setTimeout(displayScenario, 2000);
    }
    
    function endGame() {
        gameContainer.innerHTML = `<h2>Spiel beendet!</h2><p>Deine Punktzahl: ${score}/${scenarios.length * 2}</p>`;
        startButton.style.display = 'block';
        startButton.textContent = 'Erneut spielen';
    }
    
    startButton.addEventListener('click', startGame);
});
