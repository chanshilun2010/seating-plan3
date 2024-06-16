// script.js
let seatingPlan = {};

function createSeatingPlan() {
    const rows = document.getElementById('rows').value;
    const columns = document.getElementById('columns').value;
    const seatingPlanDiv = document.getElementById('seatingPlan');
    seatingPlanDiv.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    seatingPlanDiv.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    seatingPlanDiv.innerHTML = '';
    seatingPlan = Array.from({ length: rows }, () => 
        Array.from({ length: columns }, () => ({ name: '', good: 0, bad: 0 }))
    );

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const seat = document.createElement('div');
            seat.classList.add('seat');
            seat.setAttribute('data-row', i);
            seat.setAttribute('data-col', j);
            seat.innerHTML = `
                <input type="text" placeholder="Name">
                <div class="buttons">
                    <button class="good" onclick="incrementCount(this, 'good')">Good</button>
                    <button class="bad" onclick="incrementCount(this, 'bad')">Bad</button>
                </div>
                <div class="counts">
                    <span class="good-count">0</span> / 
                    <span class="bad-count">0</span>
                </div>`;
            seatingPlanDiv.appendChild(seat);
        }
    }
}

function incrementCount(button, type) {
    const seat = button.closest('.seat');
    const row = seat.getAttribute('data-row');
    const col = seat.getAttribute('data-col');
    if (type === 'good') {
        seatingPlan[row][col].good++;
    } else {
        seatingPlan[row][col].bad++;
    }
    updateCounts(seat, row, col);
}

function updateCounts(seat, row, col) {
    seat.querySelector('.good-count').textContent = seatingPlan[row][col].good;
    seat.querySelector('.bad-count').textContent = seatingPlan[row][col].bad;
}

function saveSeatingPlan() {
    const className = document.getElementById('className').value;
    if (!className) {
        alert('Please enter a class name.');
        return;
    }

    document.querySelectorAll('.seat').forEach(seat => {
        const row = seat.getAttribute('data-row');
        const col = seat.getAttribute('data-col');
        seatingPlan[row][col].name = seat.querySelector('input').value;
    });

    const savedPlans = JSON.parse(localStorage.getItem('seatingPlans')) || {};
    savedPlans[className] = seatingPlan;
    localStorage.setItem('seatingPlans', JSON.stringify(savedPlans));
    updateClassSelect();
    alert('Seating plan saved!');
}

function loadSelectedClass() {
    const className = document.getElementById('classSelect').value;
    if (!className) return;

    const savedPlans = JSON.parse(localStorage.getItem('seatingPlans'));
    seatingPlan = savedPlans[className];
    const rows = seatingPlan.length;
    const columns = seatingPlan[0].length;
    const seatingPlanDiv = document.getElementById('seatingPlan');
    seatingPlanDiv.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    seatingPlanDiv.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    seatingPlanDiv.innerHTML = '';

    seatingPlan.forEach((row, i) => {
        row.forEach((seatData, j) => {
            const seat = document.createElement('div');
            seat.classList.add('seat');
            seat.setAttribute('data-row', i);
            seat.setAttribute('data-col', j);
            seat.innerHTML = `
                <input type="text" value="${seatData.name}">
                <div class="buttons">
                    <button class="good" onclick="incrementCount(this, 'good')">Good</button>
                    <button class="bad" onclick="incrementCount(this, 'bad')">Bad</button>
                </div>
                <div class="counts">
                    <span class="good-count">${seatData.good}</span> / 
                    <span class="bad-count">${seatData.bad}</span>
                </div>`;
            seatingPlanDiv.appendChild(seat);
        });
    });
}

function resetComments() {
    seatingPlan.forEach((row, i) => {
        row.forEach((seatData, j) => {
            seatData.good = 0;
            seatData.bad = 0;
        });
    });
    document.querySelectorAll('.seat').forEach(seat => {
        const row = seat.getAttribute('data-row');
        const col = seat.getAttribute('data-col');
        updateCounts(seat, row, col);
    });
    alert('All comments have been reset.');
}

function updateClassSelect() {
    const classSelect = document.getElementById('classSelect');
    const savedPlans = JSON.parse(localStorage.getItem('seatingPlans')) || {};
    classSelect.innerHTML = '<option value="">Select Class</option>';
    for (const className in savedPlans) {
        const option = document.createElement('option');
        option.value = className;
        option.textContent = className;
        classSelect.appendChild(option);
    }
}

// Initialize the class dropdown on page load
document.addEventListener('DOMContentLoaded', updateClassSelect);