document.addEventListener("DOMContentLoaded", () => {
    // Автоматическое ограничение выбора прошедших дат в календаре
    const dateInput = document.getElementById('dateInput');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.min = today;
    }

    // Сетка доступных интервалов времени
    const timeSlots = [
        "09:00", "10:30", "12:00", "13:30", 
        "15:00", "16:30", "18:00", "19:30", "21:00"
    ];
    
    let selectedSlot = null;

    // Генерация кнопок для тайм-слотов
    function renderSlots() {
        const container = document.getElementById('slotsContainer');
        if (!container) return;
        container.innerHTML = '';
        
        timeSlots.forEach((time, index) => {
            const btn = document.createElement('div');
            btn.classList.add('slot-btn');
            btn.innerText = time;
            
            // Заглушка занятого времени (блокируем 3-й и 7-й слоты для симуляции реальной работы)
            if (index === 2 || index === 6) {
                btn.classList.add('disabled');
                btn.title = "Это время уже занято";
            } else {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    selectedSlot = time;
                });
            }
            container.appendChild(btn);
        });
    }

    // Слушатель для кнопок "Выбрать" в карточках тарифов
    document.querySelectorAll('.dynamic-service-select').forEach(element => {
        element.addEventListener('click', (e) => {
            const serviceName = e.target.getAttribute('data-service');
            const selectWidget = document.getElementById('serviceSelect');
            if (selectWidget) {
                selectWidget.value = serviceName;
            }
        });
    });

    // Обработка отправки всей формы
    const bookingForm = document.getElementById('padelBookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            if (!selectedSlot) {
                alert("Пожалуйста, выберите удобное время для игры на кортах!");
                return;
            }

            const chosenService = document.getElementById('serviceSelect').value;
            const chosenDate = document.getElementById('dateInput').value;

            // Форматируем вывод даты на русском языке
            const formattedDate = new Date(chosenDate).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            // Выводим структурированные данные в окно чека
            const modalDetails = document.getElementById('modalDetails');
            if (modalDetails) {
                modalDetails.innerHTML = `
                    <div><strong>Услуга:</strong> ${chosenService}</div>
                    <div><strong>Дата:</strong> ${formattedDate}</div>
                    <div><strong>Время:</strong> ${selectedSlot}</div>
                    <div><strong>Статус:</strong> <span style="color: var(--primary);">Резерв подтвержден</span></div>
                `;
            }

            // Активируем появление модального окна
            const successModal = document.getElementById('successModal');
            if (successModal) {
                successModal.classList.add('active');
            }
        });
    }

    // Закрытие модального окна по кнопке
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            const successModal = document.getElementById('successModal');
            if (successModal) {
                successModal.classList.remove('active');
            }
            selectedSlot = null;
            renderSlots(); // Перерисовываем сетку времени
        });
    }

    // Первичный вызов генерации слотов при загрузке страницы
    renderSlots();
});
