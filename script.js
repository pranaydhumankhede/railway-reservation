// Global state
let currentStep = 1;
let bookingData = {
    from: '',
    to: '',
    date: '',
    class: '',
    passengers: 1
};
let selectedTrain = null;
let passengerDetails = [];

// Train data
const trains = [
    { 
        id: 1, 
        name: 'Rajdhani Express', 
        number: '12301', 
        departure: '06:00', 
        arrival: '14:30', 
        price: 1200, 
        duration: '8h 30m' 
    },
    { 
        id: 2, 
        name: 'Shatabdi Express', 
        number: '12002', 
        departure: '08:15', 
        arrival: '15:45', 
        price: 1500, 
        duration: '7h 30m' 
    },
    { 
        id: 3, 
        name: 'Duronto Express', 
        number: '12213', 
        departure: '10:30', 
        arrival: '18:00', 
        price: 1350, 
        duration: '7h 30m' 
    },
    { 
        id: 4, 
        name: 'Garib Rath', 
        number: '12909', 
        departure: '14:00', 
        arrival: '23:30', 
        price: 900, 
        duration: '9h 30m' 
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('journeyDate').setAttribute('min', today);

    // Search form submission
    document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        searchTrains();
    });
});

// Search trains
function searchTrains() {
    bookingData.from = document.getElementById('fromStation').value;
    bookingData.to = document.getElementById('toStation').value;
    bookingData.date = document.getElementById('journeyDate').value;
    bookingData.class = document.getElementById('trainClass').value;
    bookingData.passengers = parseInt(document.getElementById('passengers').value);

    if (bookingData.from && bookingData.to && bookingData.date) {
        displayTrains();
        goToStep(2);
    }
}

// Display available trains
function displayTrains() {
    const trainsList = document.getElementById('trainsList');
    trainsList.innerHTML = '';

    trains.forEach(train => {
        const trainCard = document.createElement('div');
        trainCard.className = 'train-card';
        trainCard.innerHTML = `
            <div class="train-header">
                <div class="train-name">${train.name}</div>
                <div class="train-number">Train No: ${train.number}</div>
            </div>
            <div class="train-info">
                <div class="train-time">
                    <span class="time">${train.departure}</span>
                    <span class="station">${bookingData.from}</span>
                </div>
                <div class="train-duration">
                    <div>${train.duration}</div>
                    <div class="arrow">→</div>
                </div>
                <div class="train-time">
                    <span class="time">${train.arrival}</span>
                    <span class="station">${bookingData.to}</span>
                </div>
                <div class="train-price">
                    <span class="price">₹${train.price}</span>
                    <button class="btn btn-primary" onclick="selectTrain(${train.id})">Select</button>
                </div>
            </div>
        `;
        trainsList.appendChild(trainCard);
    });
}

// Select train
function selectTrain(trainId) {
    selectedTrain = trains.find(t => t.id === trainId);
    createPassengerForms();
    updateTotalPrice();
    goToStep(3);
}

// Create passenger forms
function createPassengerForms() {
    const container = document.getElementById('passengerForms');
    container.innerHTML = '';
    passengerDetails = [];

    for (let i = 0; i < bookingData.passengers; i++) {
        passengerDetails.push({ name: '', age: '', gender: 'Male' });
        
        const passengerCard = document.createElement('div');
        passengerCard.className = 'passenger-card';
        passengerCard.innerHTML = `
            <h3>Passenger ${i + 1}</h3>
            <div class="form-grid">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="name${i}" placeholder="Enter full name" required>
                </div>
                <div class="form-group">
                    <label>Age</label>
                    <input type="number" id="age${i}" placeholder="Age" min="1" max="120" required>
                </div>
                <div class="form-group">
                    <label>Gender</label>
                    <select id="gender${i}">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>
            </div>
        `;
        container.appendChild(passengerCard);

        // Add event listeners
        document.getElementById(`name${i}`).addEventListener('input', (e) => {
            passengerDetails[i].name = e.target.value;
        });
        document.getElementById(`age${i}`).addEventListener('input', (e) => {
            passengerDetails[i].age = e.target.value;
        });
        document.getElementById(`gender${i}`).addEventListener('change', (e) => {
            passengerDetails[i].gender = e.target.value;
        });
    }
}

// Update total price
function updateTotalPrice() {
    const total = selectedTrain.price * bookingData.passengers;
    document.getElementById('totalAmount').textContent = `₹${total}`;
}

// Confirm booking
function confirmBooking() {
    const allFilled = passengerDetails.every(p => p.name && p.age);
    
    if (!allFilled) {
        alert('Please fill all passenger details');
        return;
    }

    // Generate PNR
    const pnr = Math.floor(Math.random() * 10000000000);
    const total = selectedTrain.price * bookingData.passengers;

    // Display confirmation
    document.getElementById('pnrNumber').textContent = pnr;
    document.getElementById('trainName').textContent = selectedTrain.name;
    document.getElementById('ticketDate').textContent = bookingData.date;
    document.getElementById('ticketPassengers').textContent = bookingData.passengers;
    document.getElementById('ticketTotal').textContent = `₹${total}`;

    goToStep(4);
}

// Download ticket
function downloadTicket() {
    alert('Ticket download functionality!\n\nIn a real application, this would generate a PDF ticket with all booking details.');
}

// Reset booking
function resetBooking() {
    bookingData = {
        from: '',
        to: '',
        date: '',
        class: 'Sleeper (SL)',
        passengers: 1
    };
    selectedTrain = null;
    passengerDetails = [];
    
    document.getElementById('searchForm').reset();
    goToStep(1);
}

// Navigate between steps
function goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.step-container').forEach(container => {
        container.classList.remove('active');
    });

    // Show current step
    document.getElementById(`step${step}`).classList.add('active');

    // Update progress bar
    document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
        stepEl.classList.remove('active', 'completed');
        if (index + 1 < step) {
            stepEl.classList.add('completed');
        } else if (index + 1 === step) {
            stepEl.classList.add('active');
        }
    });

    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}