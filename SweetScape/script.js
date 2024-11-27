document.getElementById('birthdayForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const messages = [
        "Surprises are on the way, be patient!",
        "Special offers are being loaded for you...",
        "Almost Done..."
    ];

    const randomDelay = Math.random() < 0.5 ? 5000 : 7000; // Randomly choose between 5 and 7 seconds
    const loadingTextElement = document.getElementById('loadingText');
    const loadingElement = document.getElementById('loading');

    // Show the loading spinner
    loadingElement.classList.remove('hidden');

    let messageIndex = 0;
    const updateMessage = () => {
        if (messageIndex < messages.length) {
            loadingTextElement.textContent = messages[messageIndex];
            messageIndex++;
        }
    };

    updateMessage(); 
    const messageInterval = setInterval(updateMessage, randomDelay / messages.length);

    const name = document.getElementById('name').value;
    const birthday = new Date(document.getElementById('birthday').value);
    const note = document.getElementById('note').value;

    if (note.length > 20) {
        alert("Note cannot exceed 20 characters!");
        loadingElement.classList.add('hidden'); 
        clearInterval(messageInterval);
        return;
    }

    localStorage.setItem('name', name);
    localStorage.setItem('birthday', birthday);
    localStorage.setItem('note', note);

    setTimeout(() => {
        clearInterval(messageInterval); 
        checkBirthday(birthday);

        loadingElement.classList.add('hidden');
    }, randomDelay); 
    });

function checkBirthday(birthday) {
    const today = new Date();
    const nextBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());

    if (today > nextBirthday) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const timeDifference = nextBirthday - today;
    const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    document.getElementById('suggestions').classList.remove('hidden');
    loadSuggestions();

    if (daysLeft === 0) {
        displayCampaigns();
    } else {
        displayCountdown(nextBirthday);
        document.getElementById('campaigns').classList.add('hidden');
    }
}

function displayCampaigns() {
    const campaignsSection = document.getElementById('campaigns');
    campaignsSection.classList.remove('hidden');
    campaignsSection.innerHTML = '<h2>Happy Birthday! Here are your campaigns:</h2>';

    fetch('campaigns.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(campaigns => {
            campaigns.forEach(campaign => {
                const campaignDiv = document.createElement('div');
                campaignDiv.classList.add('campaign');
                campaignDiv.innerHTML = `
                    <strong>${campaign.brand}</strong>: ${campaign.offer} 
                    (Valid until: ${campaign.validUntil}, Conditions: ${campaign.conditions}) 
                    <a href="${campaign.source}" target="_blank">More Info</a>`;
                campaignsSection.appendChild(campaignDiv);
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function displayCountdown(nextBirthday) {
    const countdownSection = document.getElementById('countdown');
    countdownSection.classList.remove('hidden');

    const updateCountdown = () => {
        const now = new Date();
        const timeDifference = nextBirthday - now;

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');

        if (timeDifference < 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdownDisplay').innerHTML = "<h2>Happy Birthday!</h2>";
            document.getElementById('campaigns').classList.remove('hidden');
        }
    };

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}

function loadSuggestions() {
    const suggestionList = document.getElementById('suggestionList');
    suggestionList.innerHTML = '';

    fetch('suggestions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(suggestions => {
            suggestions.forEach(suggestion => {
                const suggestionDiv = document.createElement('div');
                suggestionDiv.classList.add('suggestion');
                suggestionDiv.innerHTML = `
                    <img src="${suggestion.image}" alt="${suggestion.brand}" />
                    <strong>${suggestion.brand}</strong>
                    <p>${suggestion.offer}</p>
                    <p>(Valid until: ${suggestion.validUntil})</p>
                    <a href="${suggestion.source}" target="_blank">More Info</a>`;
                suggestionList.appendChild(suggestionDiv);
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            suggestionList.innerHTML = '<p>Failed to load suggestions. Please try again later.</p>';
        });
}

const noteTextarea = document.getElementById("note");
const characterCount = document.getElementById("character-count");
const noteCurrentCount = document.getElementById("current");

function countCharacters() {
    const noteCurrentLength = noteTextarea.value.length;
    noteCurrentCount.innerText = noteCurrentLength;
}

function showCharacterCount() {
    characterCount.style.visibility = "visible";
}

function hideCharacterCount() {
    characterCount.style.visibility = "hidden";
}

noteTextarea.addEventListener("focus", showCharacterCount);
noteTextarea.addEventListener("input", countCharacters);
noteTextarea.addEventListener("blur", hideCharacterCount);