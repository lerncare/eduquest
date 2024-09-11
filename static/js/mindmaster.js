document.addEventListener('DOMContentLoaded', function() {
    const puzzleContainer = document.getElementById('puzzle-container');
    const submitButton = document.getElementById('submit-puzzle');
    const resultDiv = document.getElementById('result');
    
    let tasks = ['Aufgabe 1', 'Aufgabe 2', 'Aufgabe 3', 'Aufgabe 4'];
    let correctOrder = [2, 0, 3, 1];  // Korrekte Prioritätsreihenfolge (0-basierter Index)
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    function renderPuzzle() {
        shuffleArray(tasks);
        puzzleContainer.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.textContent = task;
            taskElement.draggable = true;
            taskElement.id = `task-${index}`;
            taskElement.classList.add('task');
            puzzleContainer.appendChild(taskElement);
        });
        
        // Drag-and-Drop-Funktionalität hinzufügen
        const draggables = document.querySelectorAll('.task');
        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', dragStart);
            draggable.addEventListener('dragover', dragOver);
            draggable.addEventListener('drop', drop);
        });
    }
    
    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
    }
    
    function dragOver(e) {
        e.preventDefault();
    }
    
    function drop(e) {
        e.preventDefault();
        const id = e.dataTransfer.getData('text');
        const draggableElement = document.getElementById(id);
        const dropzone = e.target;
        puzzleContainer.insertBefore(draggableElement, dropzone);
    }
    
    submitButton.addEventListener('click', checkOrder);
    
    function checkOrder() {
        const currentOrder = Array.from(puzzleContainer.children).map(child => parseInt(child.id.split('-')[1]));
        const isCorrect = currentOrder.every((task, index) => task === correctOrder[index]);
        
        if (isCorrect) {
            resultDiv.textContent = "Richtig! Du hast die Aufgaben korrekt priorisiert.";
            resultDiv.style.color = 'green';
        } else {
            resultDiv.textContent = "Nicht ganz richtig. Versuche es noch einmal!";
            resultDiv.style.color = 'red';
        }
    }
    
    renderPuzzle();
});
