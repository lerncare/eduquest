document.addEventListener('DOMContentLoaded', function() {
    const scenarioContainer = document.getElementById('scenario-container');
    const userAnswer = document.getElementById('user-answer');
    const submitButton = document.getElementById('submit-answer');
    const resultDiv = document.getElementById('result');

    const scenarios = [
        {
            id: 1,
            description: "Ein Schüler bricht während des Unterrichts in Tränen aus.",
            emotion: "Traurigkeit/Überforderung"
        },
        {
            id: 2,
            description: "Zwei Schüler geraten in einen heftigen Streit auf dem Schulhof.",
            emotion: "Wut/Frustration"
        },
        {
            id: 3,
            description: "Ein Schüler zeigt plötzlich Desinteresse am Unterricht und zieht sich zurück.",
            emotion: "Langeweile/Demotivation"
        }
    ];

    let currentScenario;

    function startGame() {
        currentScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        scenarioContainer.innerHTML = `<p><strong>Szenario:</strong> ${currentScenario.description}</p>`;
        userAnswer.value = '';
        resultDiv.textContent = '';
    }

    function submitAnswer() {
        const answer = userAnswer.value.trim();
        if (answer === '') {
            resultDiv.textContent = 'Bitte geben Sie eine Antwort ein.';
            return;
        }

        fetch('{{ url_for("games.submit_ei_answer") }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `scenario_id=${currentScenario.id}&answer=${encodeURIComponent(answer)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                resultDiv.textContent = `Ihre Antwort wurde übermittelt. Die Emotion in diesem Szenario war: ${currentScenario.emotion}`;
                setTimeout(startGame, 3000);
            }
        });
    }

    submitButton.addEventListener('click', submitAnswer);
    startGame();
});
