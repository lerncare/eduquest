document.addEventListener('DOMContentLoaded', function() {
    const emojiDisplay = document.getElementById('emoji-display');
    const userAnswer = document.getElementById('user-answer');
    const submitButton = document.getElementById('submit-answer');
    const resultDiv = document.getElementById('result');

    const emojiChallenges = [
        { emojis: '😊📚❓', meaning: 'Wie läuft es in der Schule?' },
        { emojis: '😢📝❌', meaning: 'Mein Kind hat Probleme mit den Hausaufgaben' },
        { emojis: '😠👫👊', meaning: 'Mein Kind wird gemobbt' },
        { emojis: '🤔📊🎓', meaning: 'Wie stehen die Chancen fürs Gymnasium?' },
        { emojis: '😴🏫⏰', meaning: 'Mein Kind ist immer müde in der Schule' }
    ];

    let currentChallenge;

    function startGame() {
        currentChallenge = emojiChallenges[Math.floor(Math.random() * emojiChallenges.length)];
        emojiDisplay.textContent = currentChallenge.emojis;
        userAnswer.value = '';
        resultDiv.textContent = '';
    }

    function checkAnswer() {
        const userInterpretation = userAnswer.value.trim().toLowerCase();
        const correctInterpretation = currentChallenge.meaning.toLowerCase();

        fetch('{{ url_for("games.submit_empathie_enigma") }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `answer=${encodeURIComponent(userInterpretation)}&correct_answer=${encodeURIComponent(correctInterpretation)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.correct) {
                    resultDiv.textContent = 'Richtig! Sie haben das Anliegen korrekt interpretiert.';
                    resultDiv.style.color = 'green';
                } else {
                    resultDiv.textContent = `Nicht ganz. Die korrekte Interpretation wäre: "${currentChallenge.meaning}"`;
                    resultDiv.style.color = 'red';
                }
                setTimeout(startGame, 3000);
            }
        });
    }

    submitButton.addEventListener('click', checkAnswer);
    startGame();
});
