document.addEventListener('DOMContentLoaded', function() {
    const meditationContainer = document.getElementById('meditation-container');
    const startMeditationButton = document.getElementById('start-meditation');
    const meditationResult = document.getElementById('meditation-result');

    const resilienceContainer = document.getElementById('resilience-container');
    const startResilienceButton = document.getElementById('start-resilience');
    const resilienceResult = document.getElementById('resilience-result');

    const balanceContainer = document.getElementById('balance-container');
    const startBalanceButton = document.getElementById('start-balance');
    const balanceResult = document.getElementById('balance-result');

    // Meditation Mode
    let meditationInterval;
    let meditationScore = 0;

    function startMeditation() {
        meditationScore = 0;
        meditationContainer.innerHTML = '<div id="focus-object" style="width: 100px; height: 100px; background-color: blue; margin: 0 auto;"></div>';
        const focusObject = document.getElementById('focus-object');
        
        meditationInterval = setInterval(() => {
            const randomColor = Math.floor(Math.random()*16777215).toString(16);
            focusObject.style.backgroundColor = "#" + randomColor;
        }, 2000);

        setTimeout(() => {
            clearInterval(meditationInterval);
            meditationContainer.innerHTML = '<button onclick="reportMeditationColor()">What was the last color?</button>';
        }, 10000);
    }

    window.reportMeditationColor = function() {
        const userColor = prompt("What was the last color of the object? (in hex format, e.g., #FF0000 for red)");
        const actualColor = document.getElementById('focus-object').style.backgroundColor;
        if (userColor.toLowerCase() === rgb2hex(actualColor)) {
            meditationScore++;
            meditationResult.textContent = "Correct! You were focused.";
        } else {
            meditationResult.textContent = "Incorrect. Try to stay more focused next time.";
        }
    }

    function rgb2hex(rgb) {
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }
    
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }

    startMeditationButton.addEventListener('click', startMeditation);

    // Resilience Rätsel
    const resilienceScenarios = [
        {
            scenario: "A student consistently disrupts your class.",
            options: [
                { text: "Send the student to the principal's office", score: 0 },
                { text: "Have a private conversation with the student to understand their behavior", score: 2 },
                { text: "Ignore the behavior to avoid confrontation", score: 1 }
            ]
        },
        {
            scenario: "You receive negative feedback from a parent about your teaching methods.",
            options: [
                { text: "Dismiss the feedback as the parent doesn't understand modern teaching methods", score: 0 },
                { text: "Reflect on the feedback and consider ways to improve", score: 2 },
                { text: "Become defensive and argue with the parent", score: 1 }
            ]
        },
        {
            scenario: "You're feeling overwhelmed with your workload.",
            options: [
                { text: "Work longer hours to catch up, sacrificing personal time", score: 1 },
                { text: "Prioritize tasks and ask for help when needed", score: 2 },
                { text: "Ignore some tasks and hope they'll go away", score: 0 }
            ]
        }
    ];

    let currentScenario = 0;
    let resilienceScore = 0;

    function startResilience() {
        currentScenario = 0;
        resilienceScore = 0;
        displayResilienceScenario();
    }

    function displayResilienceScenario() {
        if (currentScenario < resilienceScenarios.length) {
            const scenario = resilienceScenarios[currentScenario];
            let optionsHtml = scenario.options.map((option, index) => 
                `<button onclick="selectResilienceOption(${index})">${option.text}</button>`
            ).join('');
            
            resilienceContainer.innerHTML = `
                <h4>Scenario:</h4>
                <p>${scenario.scenario}</p>
                <h5>How would you respond?</h5>
                ${optionsHtml}
            `;
        } else {
            endResilience();
        }
    }

    window.selectResilienceOption = function(index) {
        const scenario = resilienceScenarios[currentScenario];
        resilienceScore += scenario.options[index].score;
        
        resilienceResult.textContent = scenario.options[index].score === 2 ? 
            "Great choice! That's a resilient approach." :
            scenario.options[index].score === 1 ?
            "That could work, but there might be a more resilient approach." :
            "Be careful, that approach might not build resilience.";
        
        currentScenario++;
        setTimeout(displayResilienceScenario, 2000);
    }

    function endResilience() {
        resilienceContainer.innerHTML = `<h4>Challenge Complete!</h4><p>Your resilience score: ${resilienceScore}/${resilienceScenarios.length * 2}</p>`;
        startResilienceButton.textContent = 'Play Again';
    }

    startResilienceButton.addEventListener('click', startResilience);

    // Balance Battle
    let balanceItems = [];
    let balanceScore = 0;

    function startBalance() {
        balanceItems = [];
        balanceScore = 0;
        balanceContainer.innerHTML = '<div id="balance-area" style="width: 300px; height: 200px; border: 1px solid black; position: relative;"></div>';
        addBalanceItem();
    }

    function addBalanceItem() {
        if (balanceItems.length < 5) {
            const balanceArea = document.getElementById('balance-area');
            const item = document.createElement('div');
            item.style.width = '20px';
            item.style.height = '20px';
            item.style.backgroundColor = 'red';
            item.style.position = 'absolute';
            item.style.left = Math.random() * 280 + 'px';
            item.style.top = Math.random() * 180 + 'px';
            item.style.cursor = 'move';
            item.draggable = true;
            item.addEventListener('dragstart', drag);
            balanceArea.appendChild(item);
            balanceItems.push(item);

            setTimeout(addBalanceItem, 2000);
        } else {
            checkBalance();
        }
    }

    function drag(event) {
        event.dataTransfer.setData("text", event.target.id);
    }

    function checkBalance() {
        const balanceArea = document.getElementById('balance-area');
        const areaRect = balanceArea.getBoundingClientRect();
        const centerX = areaRect.width / 2;
        const centerY = areaRect.height / 2;

        let totalDistance = 0;
        balanceItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const itemCenterX = itemRect.left + itemRect.width / 2 - areaRect.left;
            const itemCenterY = itemRect.top + itemRect.height / 2 - areaRect.top;
            const distance = Math.sqrt(Math.pow(itemCenterX - centerX, 2) + Math.pow(itemCenterY - centerY, 2));
            totalDistance += distance;
        });

        const averageDistance = totalDistance / balanceItems.length;
        balanceScore = Math.max(0, 100 - Math.round(averageDistance));
        balanceResult.textContent = `Balance Score: ${balanceScore}. The lower the average distance from the center, the better!`;
    }

    startBalanceButton.addEventListener('click', startBalance);
});
