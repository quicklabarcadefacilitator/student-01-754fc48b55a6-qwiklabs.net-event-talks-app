document.addEventListener('DOMContentLoaded', () => {
    // This data will be injected by the Node.js script
    const talks = [
        // TALKS_DATA_HERE
    ];

    const talksContainer = document.getElementById('talks-container');
    const categorySearch = document.getElementById('categorySearch');

    function renderSchedule(filteredTalks) {
        talksContainer.innerHTML = ''; // Clear existing talks

        let currentTime = new Date();
        currentTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

        filteredTalks.forEach((talk, index) => {
            // Add talk card
            const talkCard = document.createElement('div');
            talkCard.classList.add('talk-card');

            const startTime = new Date(currentTime);
            const endTime = new Date(startTime.getTime() + talk.duration * 60 * 1000);

            talkCard.innerHTML = `
                <p class="time">${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <h3>${talk.title}</h3>
                <p class="speakers">Speakers: <span>${talk.speakers.join(', ')}</span></p>
                <p class="categories">Categories: ${talk.category.join(', ')}</p>
                <p>${talk.description}</p>
            `;
            talksContainer.appendChild(talkCard);

            currentTime = new Date(endTime.getTime());

            // Add 10 minute transition after each talk, except the last one before lunch
            if (index < filteredTalks.length - 1) {
                currentTime = new Date(currentTime.getTime() + 10 * 60 * 1000); // Add 10 minutes transition
            }

            // Insert lunch break after the third talk
            if (index === 2) {
                const lunchBreak = document.createElement('div');
                lunchBreak.classList.add('lunch-break');
                const lunchStartTime = new Date(currentTime);
                const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60 * 1000); // 1 hour lunch
                lunchBreak.innerHTML = `
                    <h3>Lunch Break</h3>
                    <p>${lunchStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${lunchEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                `;
                talksContainer.appendChild(lunchBreak);
                currentTime = new Date(lunchEndTime.getTime());
                currentTime = new Date(currentTime.getTime() + 10 * 60 * 1000); // Add 10 minutes after lunch
            }
        });
    }

    function filterTalks() {
        const searchTerm = categorySearch.value.toLowerCase();
        const filtered = talks.filter(talk =>
            talk.category.some(cat => cat.toLowerCase().includes(searchTerm))
        );
        renderSchedule(filtered);
    }

    categorySearch.addEventListener('keyup', filterTalks);

    // Initial render
    renderSchedule(talks);
});
