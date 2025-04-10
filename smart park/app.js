// EFECTE D'ESCRITURA DEL PRINCIPI
document.addEventListener('DOMContentLoaded', function() {
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const text = typingText.textContent;
        typingText.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                typingText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        typeWriter();
    }

    // ACTUALITZAR L'HORA ACTUAL
    const currentTime = document.getElementById('current-time');
    if (currentTime) {
        function updateClock() {
            const now = new Date();
            const time = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            currentTime.textContent = time;
        }
        
        updateClock();
        setInterval(updateClock, 1000);
    }

    // FUNCIÓ PER ACTUALITZAR LA CUENTA ENRERE
    function updateCountdown(spot) {
        const endTimeStr = spot.dataset.endTime;
        if (!endTimeStr) return;

        const endTime = new Date(endTimeStr);
        const now = new Date();
        const diff = endTime - now;

        if (diff <= 0) {
            makeSpotAvailable(spot);
        } else {
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            spot.querySelector('.countdown').textContent = 
                `Time remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    }

    // FUNCIÓ PER FER UN SPOT DISPONIBLE
    function makeSpotAvailable(spot) {
        spot.classList.remove('occupied');
        spot.classList.add('available');
        spot.querySelector('.time').textContent = '00:00';
        spot.querySelector('.status').textContent = 'Available';
        spot.querySelector('.countdown').textContent = '';
        const actionsDiv = spot.querySelector('.actions');
        if (actionsDiv) {
            actionsDiv.innerHTML = '';
        }
        delete spot.dataset.endTime;
    }

    // FUNCIÓ PER AFEGIR EL BOTÓ DE CANCEL·LAR
    function addCancelButton(spot) {
        const actionsDiv = spot.querySelector('.actions');
        if (actionsDiv) {
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'cancel-btn';
            cancelBtn.innerHTML = '✕';
            cancelBtn.title = 'Cancel reservation';
            
            cancelBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (confirm('Are you sure you want to cancel this reservation?')) {
                    makeSpotAvailable(spot);
                }
            };
            
            actionsDiv.innerHTML = '';
            actionsDiv.appendChild(cancelBtn);
        }
    }

    // FUNCIÓ PER FER UN SPOT OCUPAT
    function makeSpotOccupied(spot) {
        spot.classList.remove('available');
        spot.classList.add('occupied');
        
        const now = new Date();
        const endTime = new Date(now.getTime() + 60 * 60000); // 60 minutos
        spot.dataset.endTime = endTime.toISOString();
        
        spot.querySelector('.time').textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        spot.querySelector('.status').textContent = 'Occupied';
        
        // AGREGAR EL BOTÓ DE CANCEL·LAR
        addCancelButton(spot);
        
        // INICIALITZAR LA CUENTA ENRERE
        updateCountdown(spot);
    }

    // ACTUALITZAR TOTS ELS SPOTS OCUPATS
    function updateAllCountdowns() {
        document.querySelectorAll('.spot.occupied').forEach(updateCountdown);
    }

    // MANEIG D'ESDEVENIMENTS PER A LA RESERVA I CANCEL·LACIÓ
    const parkingSpots = document.querySelector('.parking-spots');
    if (parkingSpots) {
        // Delegación de eventos para todo el contenedor de parking
        parkingSpots.addEventListener('click', function(e) {
            // Si se hace clic en el botón de cancelar
            if (e.target.classList.contains('cancel-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const spot = e.target.closest('.spot');
                if (spot) {
                    if (confirm('Are you sure you want to cancel this reservation?')) {
                        makeSpotAvailable(spot);
                    }
                }
                return;
            }

            // SI ES FA CLIC EN UN SPOT DISPONIBLE
            const spot = e.target.closest('.spot');
            if (spot && !spot.classList.contains('occupied')) {
                if (confirm('Would you like to reserve this parking spot?')) {
                    makeSpotOccupied(spot);
                }
            }
        });

        // EFECTES VISUALS PER A L'INTERACCIÓ
        parkingSpots.addEventListener('mouseover', function(e) {
            const spot = e.target.closest('.spot');
            if (spot && !spot.classList.contains('occupied')) {
                spot.style.transform = 'translateY(-5px)';
            }
        });

        parkingSpots.addEventListener('mouseout', function(e) {
            const spot = e.target.closest('.spot');
            if (spot && !spot.classList.contains('occupied')) {
                spot.style.transform = 'translateY(0)';
            }
        });
    }

    // INICIALITZAR TOTS ELS SPOTS OCUPATS
    document.querySelectorAll('.spot.occupied').forEach(spot => {
        addCancelButton(spot);
        updateCountdown(spot);
    });

    // ACTUALITZAR LA CUENTA ENRERE CADA SEGON
    setInterval(updateAllCountdowns, 1000);
});