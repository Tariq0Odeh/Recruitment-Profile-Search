const profilesTemplate = document.querySelector("[engineer-profiles-template]");
let  profilesContainer = document.querySelector("[engineer-profiles-container]");
const profileSearch = document.querySelector("[profile-search]");
let tempProfileContainer = []
const numberOfProfiles = 8;

// Using the fetch API (modern approach)
fetch('profiles.json')
    .then(response => response.json())
    .then(parsedData => {
        localStorage.setItem('profiles', JSON.stringify(parsedData));
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });

// Load data from local Storage
const savedProfiles = JSON.parse(localStorage.getItem('profiles'));

// Refresh button action
document.getElementById('refreshButton')
    .addEventListener('click', () => {
    location.reload();
});

let allProfiles = [] // To save all profiles

// Add the prfiles on the prfiles Container
for( let i=0 ; i<savedProfiles.length ; i++){
    const profile = profilesTemplate.content.cloneNode(true).children[0];
    profile.querySelector("[mini-profile-header]").textContent = savedProfiles[i].name;
    profile.querySelector("[mini-profile-body]").textContent = savedProfiles[i].city;
    profile.querySelector("#pushButton").addEventListener('click', () => {showFullProfile(savedProfiles[i]);});
    allProfiles.push(profile)
    profile.querySelector("#hiredButton").addEventListener('click', () => {hierdProfile(savedProfiles[i], i);});
}

// Random number with out repeat
function getRandomNoRepeat(min, max) {
    let randomNum = [];
    for( let i=0 ; i < numberOfProfiles ; i++){
        if (min >= max) {
            throw new Error("min must be less than max");
        }
        if (!getRandomNoRepeat.numbers || getRandomNoRepeat.numbers.length === 0) {
            getRandomNoRepeat.numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);
        }
        const index = Math.floor(Math.random() * getRandomNoRepeat.numbers.length);
        const randomNumber = getRandomNoRepeat.numbers[index];
        getRandomNoRepeat.numbers.splice(index, 1);
        randomNum.push(randomNumber);
    }
    return randomNum;
}

// Display 8 (randomized and sorted by name) Engineers by default at every refresh
const random = getRandomNoRepeat(0, savedProfiles.length-1);
for( let i=0 ; i < numberOfProfiles ; i++){
    tempProfileContainer.push(allProfiles[random[i]]);
}
sortEightProfiles ();

function sortEightProfiles (){
    tempProfileContainer.sort((a, b) => {
        const nameA = a.querySelector("[mini-profile-header]").textContent.toLowerCase();
        const nameB = b.querySelector("[mini-profile-header]").textContent.toLowerCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
            return 0;
    });

    for( let i=0 ; i < numberOfProfiles ; i++){
        profilesContainer.appendChild(tempProfileContainer[i]);
    }
}

// Search function
profileSearch.addEventListener("input", (event) => {
    const value = event.target.value.toLowerCase();
    profilesContainer.innerHTML = '';
    let filteredProfiles = [];

    for( let i=0 ; i < allProfiles.length ; i++){
        if(allProfiles[i].querySelector("[mini-profile-header]").textContent.toLowerCase().includes(value)){
            filteredProfiles.push(allProfiles[i])
        }
    }

    filteredProfiles.sort((a, b) => {
        const nameA = a.querySelector("[mini-profile-header]").textContent.toLowerCase();
        const nameB = b.querySelector("[mini-profile-header]").textContent.toLowerCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    filteredProfiles.forEach(profile => {
        profilesContainer.appendChild(profile);
    });
});

// Display full data (Popup)
const showFullProfile = (profile) => {
    let hiredColor = 'red'
    if (profile.hired){
        hiredColor = 'green'
    }

    const popupContent = `
        <title>Engineer's Full Profiles</title>

        <div class="full-profile-popup">
            <h2>${profile.name}</h2>
            <p>Age: ${profile.age}</p>
            <p>Email: ${profile.email}</p>
            <p>Phone: ${profile.phone}</p>
            <p>City: ${profile.city}</p>
            <h1>Hired: ${profile.hired}</p>
        </div>

        <style>
        h2 {
            color: black;
            text-align: center;
        }

        p{
            text-align: center;
        }

        h1 {
            text-align: center;
            color: ${hiredColor};
        }
        </style>
    `;

    const popupWindow = window.open('', 'Engineer Profile', 'width=400,height=300');
    popupWindow.document.body.innerHTML = popupContent;
}

const hierdProfile = (profile, ind) => {
    if(!(profile.hired)){
        profile.hired = true;
        showFullProfile(profile);
        savedProfiles[ind].hired = true;
        localStorage.setItem('profiles', JSON.stringify(savedProfiles));
    }
}
