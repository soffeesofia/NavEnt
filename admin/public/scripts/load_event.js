const eventNameField = document.querySelector('.form-control#eventName')
const eventTagField = document.querySelector('.form-control#tagline')
const eventDescField = document.querySelector('.form-control#description')
const eventTypeRadios = document.querySelectorAll('input[name="eventType"]');
const oneTimeDateField = document.querySelector('.form-control#startDate')
const oneTimeStartField = document.querySelector('.form-control#startTime')
const oneTimeEndField = document.querySelector('.form-control#endTime')
const oneTimeVenueField = document.querySelector('.form-control#eventVenue')
const amPmDateField = document.querySelector('.form-control#ampmDate')
const startAMField = document.querySelector('.form-control#startAM')
const endAMField = document.querySelector('.form-control#endAM')
const venueAMField = document.querySelector('.form-control#AMeventVenue')
const startPMField = document.querySelector('.form-control#startPM')
const endPMField = document.querySelector('.form-control#endPM')
const venuePMField = document.querySelector('.form-control#PMeventVenue')
const seriesNumberField = document.querySelector('.form-control#seriesNumber')
const publicButton = document.getElementById('true');
const privateButton = document.getElementById('false');
const evaluationLinkField = document.querySelector('.form-control#evaluationLink')
const otherLinksCheckbox = document.getElementById('other-link')
const linkNumberField = document.querySelector('.form-control#linkNumber')
const regisCheckbox = document.getElementById('reg-open')
const inputElement = document.getElementById('eventImage')
const previewImage = document.getElementById('previewImage');
const imageContainer = document.getElementById("imageContainer");
const errorMsgContainer = document.querySelector('.errorMessageDiv');
const toHomeBtn = document.querySelector('.toHome')
const logoutBtn = document.querySelector('.logout-btn');
document.getElementById('seriesNumber').addEventListener('input', generateSeriesFields);
document.getElementById('linkNumber').addEventListener('input', generateLinkFields);
const urlParams = new URLSearchParams(window.location.search)

var eventID = urlParams.get('eventID')
var changedPic = ''
var eventType = ''
var eventPic = ''


console.log(eventID)



document.addEventListener('DOMContentLoaded', function () {
    fetch(`/search/${eventID}`)
    .then(response => response.json())
    .then(data => {
      loadEvent(data['data'])
    })
    .catch(error => console.error("Error fetching data:", error)); 
})

logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    fetch('/logout', {
        method: 'GET',
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) {
        console.log('Logout successful');
        window.location.href = '/';
        } else {
        console.error('Logout failed');
        }
    })
    .catch(error => {
        console.error('Error during logout:', error);
    });
});

toHomeBtn.addEventListener('click', function(e) {
    console.log('home clicked')
    window.location.href = '/admin_home';
})


async function loadEvent(data) {
    console.log(data)
    eventNameField.value = data.map(event => event.Event_Name).join(', ')
    eventTagField.value = data.map(event => event.Event_Tagline).join(', ')
    eventDescField.value = data.map(event => event.Event_Description).join(', ')
    evaluationLinkField.value = data.map(event => event.Evaluation_Link).join(', ')

    eventType = data.length > 0 ? data[0].Event_Type : null;
    
    fillAttendanceDetails(eventType, data)
    
    const externalLength = await getexternalLinksDetails(eventID)
    console.log("EL length: ", externalLength.length)
    if (externalLength.length > 0 ){
        otherLinksCheckbox.checked = true
        $('#externalLinks').show();
        links(true)
    }
    
    fillPublish(data)
    if(!data[0].Event_PicFilePath){
        imageContainer.style.display = "none";
    } else {
        console.log("FP: ", data[0].Event_PicFilePath)
        fillImage(data)
    }
}


async function links(type){
    const externalLinksData = await getexternalLinksDetails(eventID)
    console.log("Received data (EL): ", externalLinksData);
    if (type) {
        linkNumberField.value = externalLinksData.length
        generateLinkFields()
    }
    
    for (var l = 0; l <= externalLinksData.length - 1; l++) {
        document.getElementById(`linkName${l+1}`).value = externalLinksData[l].Link_Name
        document.getElementById(`weblink${l+1}`).value = externalLinksData[l].Weblink
    }
}

function fillPublish(data){
    if (data[0].isPublic == 1) {
        publicButton.checked = true
    } else {
        privateButton.checked = true
    }

    if (data[0].isOpen == 1){
        regisCheckbox.checked = true
    }

}

function fillImage(data){
    const imagePath = data[0].Event_PicFilePath;
    previewImage.src = imagePath
    previewImage.alt = "Event Preview Image";
}

function fillAttendanceDetails(type, data){
    let radioToCheck = null
    const startDate = new Date(data[0].Event_StartDate);
    const formattedStartDate = startDate.toISOString().split('T')[0];
    console.log(formattedStartDate)
    switch (type.toLowerCase()) {
        case 'onetime':
            radioToCheck = document.getElementById('oneTime')
            console.log(data[0].Event_StartDate)
            oneTimeDateField.value = formattedStartDate
            oneTime()
            break;
        case 'am/pm':
            radioToCheck = document.getElementById('ampm')
            amPmDateField.value = formattedStartDate
            ampm()
            break;
        case 'series':
            radioToCheck = document.getElementById('series')
            series(true)
            break;
        default:
            break;
    }

    eventTypeRadios.forEach(radio => {
        if (radio === radioToCheck) {
            radio.checked = true;
        }
        $('#oneTimeSection, #ampmSection, #seriesSection').hide();
        if ($('#oneTime').prop('checked')) {
            $('#oneTimeSection').show();
        } else if ($('#ampm').prop('checked')) {
            $('#ampmSection').show();
        } else if ($('#series').prop('checked')) {
            $('#seriesSection').show();
        }
    });
}

async function oneTime(){
    const oneTimeData = await getAttendanceDetails("onetime", eventID)
    console.log("Received data:", oneTimeData);
    oneTimeVenueField.value = oneTimeData[0].Venue
    oneTimeStartField.value = oneTimeData[0].Start_Time
    oneTimeEndField.value = oneTimeData[0].End_Time
}

async function ampm(){
    const ampmData = await getAttendanceDetails("ampm", eventID)
    console.log("Received data:", ampmData);
    startAMField.value = ampmData[0].AM_Start
    startPMField.value = ampmData[0].PM_Start
    endAMField.value = ampmData[0].AM_End
    endPMField.value = ampmData[0].PM_End
    venueAMField.value = ampmData[0].AM_Venue
    venuePMField.value = ampmData[0].PM_Venue
}

async function series(type){
    const seriesData = await getAttendanceDetails("series", eventID)
    console.log("Received data:", seriesData);
    if (type && seriesData.length !== undefined) {
        seriesNumberField.value = seriesData.length
        generateSeriesFields()
    }
    for (var k = 0; k <= seriesData.length - 1; k++) {
        document.getElementById(`name${k+1}`).value = seriesData[k].Series_Name
        document.getElementById(`startDate${k+1}`).value = new Date(seriesData[k].Date).toISOString().split('T')[0]
        document.getElementById(`startTime${k+1}`).value = seriesData[k].Start_Time
        document.getElementById(`endTime${k+1}`).value = seriesData[k].End_Time
    }
}

function getexternalLinksDetails(ID) {
    return fetch(`/getExternalDetails/${ID}`)
        .then(response => response.json())
        .then(data => data['data'])
        .catch(error => {
            console.error("Error fetching data:", error);
            throw error; 
    });
}

function getAttendanceDetails(type, ID){
    console.log("From edit.js: ", type)
    return fetch(`/getAttnDetails/${ID}/${type}`)
        .then(response => response.json())
        .then(data => data['data'])
        .catch(error => {
            console.error("Error fetching data:", error);
            throw error; 
     });
}

$(document).ready(function () {
    $('input[name="eventType"]').change(function () {
        $('#oneTimeSection, #ampmSection, #seriesSection').hide();
        if ($('#oneTime').prop('checked')) {
            $('#oneTimeSection').show();
        } else if ($('#ampm').prop('checked')) {
            $('#ampmSection').show();
        } else if ($('#series').prop('checked')) {
            $('#seriesSection').show();
        }
    });
});

$(document).ready(function() {
    $('#other-link').change(function() {
        if (this.checked) {
            $('#externalLinks').show();
        } else {
            $('#externalLinks').hide();
        }
    });
});



publicButton.addEventListener('change', function() {
    if (this.checked) {
      console.log('Is Public:', isPublic);
    }
});

privateButton.addEventListener('change', function() {
    if (this.checked) {
        console.log('Is Public:', isPublic);
    }
});

regisCheckbox.addEventListener('change', function() {
    if (regisCheckbox.checked) {
      console.log('Checkbox is checked. Open for Registration!');
    } else {
      console.log('Checkbox is unchecked. Registration closed.');
    }
})

otherLinksCheckbox.addEventListener('change', function() {
    if (otherLinksCheckbox.checked) {
      console.log('Event has External links');
    } else {
      console.log('Event has no External Links');
    }
})





function displayMessage(message, div, type) {
    const msgDiv = document.createElement('div');
    msgDiv.id = 'msg'
    msgDiv.textContent = message;
    if (type) {
      msgDiv.style.color = 'green';
    } else {
      msgDiv.style.color = 'red';
    }
    div.appendChild(msgDiv);
  }

  
function generateLinkFields(){
    var linkNumber = document.getElementById('linkNumber').value
    var linkContainer = document.getElementById('linkFieldsContainer')
    linkContainer.innerHTML = ''

    for (var j = 1; j <= linkNumber; j++) {
        var linkContainerDiv = document.createElement('div')
        linkContainerDiv.style.display = 'flex'
        linkContainerDiv.style.gap = '10px'

        var linkNameContainerDiv = document.createElement('div')
        linkNameContainerDiv.style.flex = '1'

        var linkNameLabel = document.createElement('label');
        linkNameLabel.innerHTML = 'Link Name ' + j;

        var linkNameInput = document.createElement('input');
        linkNameInput.type = 'text';
        linkNameInput.className = 'form-control';
        linkNameInput.id = `linkName${j}`

        var weblinkContainerDiv = document.createElement('div')
        weblinkContainerDiv.style.flex = '1'

        var weblinkLabel = document.createElement('label');
        weblinkLabel.innerHTML = 'Web Link ' + j;

        var weblinkInput = document.createElement('input');
        weblinkInput.type = 'text';
        weblinkInput.className = 'form-control';
        weblinkInput.id = `weblink${j}`

        linkNameContainerDiv.appendChild(linkNameLabel)
        linkNameContainerDiv.appendChild(linkNameInput)
        weblinkContainerDiv.appendChild(weblinkLabel);
        weblinkContainerDiv.appendChild(weblinkInput);

        linkContainerDiv.appendChild(linkNameContainerDiv);
        linkContainerDiv.appendChild(weblinkContainerDiv);

        linkContainer.appendChild(linkContainerDiv);
    }

    links(false)
}


function generateSeriesFields() {
    var seriesNumber = document.getElementById('seriesNumber').value;
    var seriesContainer = document.getElementById('seriesFieldsContainer');
    seriesContainer.innerHTML = '';

    for (var i = 1; i <= seriesNumber; i++) {
        var seriesContainerDiv = document.createElement('div');
        seriesContainerDiv.style.display = 'flex';
        seriesContainerDiv.style.gap = '10px';

        var nameContainerDiv = document.createElement('div');
        nameContainerDiv.style.flex = '1';

        var nameLabel = document.createElement('label');
        nameLabel.innerHTML = 'Name for Series ' + i;

        var nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'form-control';
        nameInput.id = `name${i}`

        var startDateContainerDiv = document.createElement('div');
        startDateContainerDiv.style.flex = '1';

        var startDateLabel = document.createElement('label');
        startDateLabel.innerHTML = 'Date for Series ' + i;

        var startDateInput = document.createElement('input');
        startDateInput.type = 'date';
        startDateInput.className = 'form-control';
        startDateInput.id = `startDate${i}`
        
        var startContainerDiv = document.createElement('div');
        startContainerDiv.style.flex = '1';

        var startLabel = document.createElement('label');
        startLabel.innerHTML = 'Start Time for Series ' + i;

        var startInput = document.createElement('input');
        startInput.type = 'time';
        startInput.className = 'form-control';
        startInput.id = `startTime${i}`

        var endContainerDiv = document.createElement('div');
        endContainerDiv.style.flex = '1';

        var endLabel = document.createElement('label');
        endLabel.innerHTML = 'End Time for Series ' + i;

        var endInput = document.createElement('input');
        endInput.type = 'time';
        endInput.className = 'form-control';
        endInput.id = `endTime${i}`

        var venueContainerDiv = document.createElement('div');
        venueContainerDiv.style.flex = '1';

        var venueLabel = document.createElement('label');
        venueLabel.innerHTML = 'Event Venue for Series ' + i;

        var venueInput = document.createElement('input');
        venueInput.type = 'text';
        venueInput.className = 'form-control';
        venueInput.id = `venue${i}`

        nameContainerDiv.appendChild(nameLabel)
        nameContainerDiv.appendChild(nameInput)
        startDateContainerDiv.appendChild(startDateLabel)
        startDateContainerDiv.appendChild(startDateInput)
        startContainerDiv.appendChild(startLabel);
        startContainerDiv.appendChild(startInput);
        endContainerDiv.appendChild(endLabel);
        endContainerDiv.appendChild(endInput);
        venueContainerDiv.appendChild(venueLabel);
        venueContainerDiv.appendChild(venueInput);

        seriesContainerDiv.appendChild(nameContainerDiv);
        seriesContainerDiv.appendChild(startDateContainerDiv);
        seriesContainerDiv.appendChild(startContainerDiv);
        seriesContainerDiv.appendChild(endContainerDiv);
        seriesContainerDiv.appendChild(venueContainerDiv);

        seriesContainer.appendChild(seriesContainerDiv);
    }

    series(false)
}