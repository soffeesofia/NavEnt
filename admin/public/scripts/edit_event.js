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
const unfilledMsgContainer = document.querySelector('.unfilledFieldsDiv');
const draftBtn = document.querySelector('.button-save-draft')
const publishBtn = document.querySelector('.button-save-publish')
const confirmationMsgContainer = document.querySelector('.confirmationDiv');
const errorMsgContainer = document.querySelector('.errorMessageDiv');
const urlParams = new URLSearchParams(window.location.search)

var eventID = urlParams.get('eventID')

var eventType
var newEventType = ''
var selectedEventType = eventType
var isPublic = ''
var isOpen = ''
var willDel = ''
var hasExternal = ''
var eventPic = ''
var changedPic = ''

document.addEventListener('DOMContentLoaded', function () {
    fetch(`/search/${eventID}`)
    .then(response => response.json())
    .then(data => {
      loadEventDefine(data['data'])
    })
    .catch(error => console.error("Error fetching data:", error)); 
})    

function loadEventDefine(data) {
    console.log("Edit.JS:",data)
    eventType = data.length > 0 ? data[0].Event_Type : null;
    console.log("Loaded:", eventType)
}


inputElement.addEventListener('change', (event) => {
    changedPic = true
    errorMsgContainer.innerHTML = ''
    eventPic = event.target.files[0];
    const maxSizeInBytes = 1048576;
    
    if (eventPic.size > maxSizeInBytes) {
        console.error('File size exceeds the allowed limit.');
        displayMessage('The chosen file is too large.', errorMsgContainer, false);
    } else {
        if (eventPic && eventPic.type.startsWith('image/')) {
            overlayImg()
            displayMessage('Image uploaded.', errorMsgContainer, true);
        } else {
            displayMessage('Please upload an image file.', errorMsgContainer, false);
        }
    }

     
});


function overlayImg(){
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlay.style.width = `${previewImage.width}px`;
    overlay.style.height = `${previewImage.height}px`
    overlay.style.top = '50%';
    overlay.style.left = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    document.getElementById('imageContainer').appendChild(overlay);
}

function getBtnValues(){

    eventTypeRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.checked) {
                newEventType = this.id
                console.log(`Selected event type: ${newEventType}`);
            }
        });
    });
    

    eventTypeRadios.forEach(radio => {
        if (radio.checked) {
            eventType = radio.id;
            console.log(`Checked event type: ${eventType}`);
        }
    });

    if (newEventType.toLowerCase() == eventType){
        selectedEventType = eventType // means attendance type is the same
        console.log(`Checked event type: same`);
        willDel = false
    } else if (newEventType.toLowerCase() != eventType && !newEventType) {
        selectedEventType = eventType
        console.log(`SAME`);
        willDel = false
    } else {
        selectedEventType = newEventType
        console.log(`DIFF`);
        willDel = true
    }

    console.log("SELECTED: ", selectedEventType)
    
    if (publicButton.checked = true ) {
        isPublic = true
    } else {
        isPublic = false
    }
    
    if (regisCheckbox.checked = true) {
        isOpen = true
    } else {
        isOpen = false
    }
    
    if (otherLinksCheckbox.checked = true){
        hasExternal = true
    } else {
        hasExternal = false
    }

}

draftBtn.addEventListener('click', function(e) {
    unfilledMsgContainer.innerHTML = ''
    getBtnValues()
    if (!eventNameField.value.trim()){
        displayMessage("Please enter a name for the event.", unfilledMsgContainer, false)
    } else {
        const eventBody = getEventBody()
        eventBody.live = false
        console.log(JSON.stringify(eventBody))
        sendToServer(eventBody)
        if (hasExternal === true){
            sendExternalLinks(linkNumberField.value.trim())
        }
        if(changedPic == true) {
            uploadEventImg(eventPic)
        }
        displayMessage("Draft successfully saved.", confirmationMsgContainer, true)
        setTimeout(function() {
            window.location.href = '/admin_home';
        }, 1000);
    }
})

publishBtn.addEventListener('click', function(e) {
    unfilledMsgContainer.innerHTML = ''
    getBtnValues()
    if (checkValues() == false){
        displayMessage("Please fill out all fields before publishing.", unfilledMsgContainer, false)
    } else {
        const eventBody = getEventBody()
        eventBody.live = true
        console.log(JSON.stringify(eventBody))
        sendToServer(eventBody)
        if (hasExternal === true){
            sendExternalLinks(linkNumberField.value.trim())
        }
        uploadEventImg(eventPic)
        displayMessage("Event successfully published", confirmationMsgContainer, true)
        setTimeout(function() {
            window.location.href = '/admin_home';
        }, 1000);
    }
})

function getEventBody(){
    let eventStartDate
    let eventEndDate
    let eType

    switch (selectedEventType) {
        case "oneTime":
            eventStartDate = getValidDate(oneTimeDateField.value);
            eventEndDate = eventStartDate;
            eType = "OneTime";
            break;
        case "ampm":
            eventStartDate = getValidDate(amPmDateField.value);
            eventEndDate = eventStartDate;
            eType = "AM/PM";
            break;
        case "series":
            eventStartDate = getValidDate(document.getElementById('startDate1').value);
            eventEndDate = getValidDate(document.getElementById(`startDate${seriesNumberField.value.trim()}`).value);
            eType = "Series";
            break;
        default:
            console.log("No type selected")
            break;
    }

    if (eventStartDate === null || eventEndDate === null) {
        console.error('Invalid date format');
        return;
    }

    const eventBody = {
        name : eventNameField.value.trim(),
        tagline : eventTagField.value.trim(),
        desc : eventDescField.value.trim(),
        start : eventStartDate,
        end : eventEndDate,
        type : eType,
        open : isOpen,
        public : isPublic,
        eval: evaluationLinkField.value.trim(),
    }

    console.log(JSON.stringify(eventBody))
    
    return eventBody
}

function getValidDate(dateString) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(dateString)) {
        const dateParts = dateString.split('-');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; 
        const day = parseInt(dateParts[2]);

        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            const date = new Date(year, month, day);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        }
    }
    return null;
}


function checkValues(){
    var unfilled = true
    if (!eventNameField.value.trim() || !eventTagField.value.trim() || !eventDescField.value.trim()) {
        console.log("top 3")
        unfilled =  false;
    }

    if (!Array.from(eventTypeRadios).some(radio => radio.checked)) {
        console.log("event type!")
        unfilled =  false;
    }

    switch (selectedEventType) {
        case "oneTime":
            if (!oneTimeDateField.value || !oneTimeEndField.value || !oneTimeStartField.value || !oneTimeVenueField.value.trim()) {
                console.log("onetime!")
                unfilled =  false;
            }
            break
        case "ampm":
            if (!amPmDateField.value || !startAMField.value || !startPMField.value || !endAMField.value || !endPMField.value || !venueAMField.value.trim() || !venuePMField.value.trim()) {
                console.log("ampm!")
                unfilled =  false;
            }
            break;
        case "series":
            let seriesName = []
            let seriesStart = []
            let seriesDate = []
            let seriesEnd = []
            let seriesVenue = []
            for (var i = 1; i <= seriesNumberField.value; i++){
                seriesName.push(document.getElementById(`name${i}`).value)
                seriesDate.push(getValidDate(document.getElementById(`startDate${i}`).value))
                seriesStart.push(document.getElementById(`startTime${i}`).value)
                seriesEnd.push(document.getElementById(`endTime${i}`).value)
                seriesVenue.push(document.getElementById(`venue${i}`).value)
            }

            if (
                seriesName.length !== seriesNumberField.value ||
                seriesDate.length !== seriesNumberField.value ||
                seriesStart.length !== seriesNumberField.value ||
                seriesEnd.length !== seriesNumberField.value ||
                seriesVenue.length !== seriesNumberField.value
            ) {
                console.log("top 2")
                unfilled =  false;
                return false;
            }
            break;
        default:
            console.log("no type")
            unfilled =  false;
            return false
    }

    if (!publicButton.checked && !privateButton.checked) {
        console.log("public")
        unfilled =  false;
    }

    if (!inputElement.files || inputElement.files.length === 0) {
        console.log("no img")
        unfilled =  false;
    }

    return unfilled
}

function sendToServer(eventBody){
    fetch(`/editEvent/${eventID}/${willDel}`, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(eventBody)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        sendEventType(selectedEventType)
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function sendExternalLinks(count){
    let linkNames = []
    let weblinks = []
    for (var i = 1; i <= count; i++){
        linkNames.push(document.getElementById(`linkName${i}`).value)
        weblinks.push(document.getElementById(`weblink${i}`).value)
    }
    console.log(linkNames)
    console.log(weblinks)

    for (var i = 1; i <= count; i++){
        const linkBody = {
            name: linkNames[`${i-1}`],
            weblink: weblinks[`${i-1}`]
        }
        fetch('/external', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(linkBody)
        })
        .then(response => response.json())
        .then(data => {
            console.log('External link details uploaded', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

function sendEventType(type){
    switch (type.toLowerCase()) {
        case "onetime":
            let oneTimeStart = oneTimeStartField.value
            let oneTimeEnd = oneTimeEndField.value
            let oneTimeVenue = oneTimeVenueField.value
            console.log(oneTimeStart, oneTimeEnd, oneTimeVenue)
            const oneTimeBody = {
                startTime: oneTimeStart,
                endTime: oneTimeEnd,
                venue: oneTimeVenue
            }
            fetch('/oneTime', {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(oneTimeBody)
            })
            .then(response => response.json())
            .then(data => {
                console.log('One Time details uploaded', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
            break;
        case "ampm":
            let startAM = startAMField.value
            let endAM = endAMField.value
            let venueAM = venueAMField.value
            let startPM = startPMField.value
            let endPM = endPMField.value
            let venuePM = venuePMField.value
            console.log(startAM, endAM, venueAM, startPM, endPM, venuePM)
            const amPmBody = {
                amStart : startAM,
                amEnd: endPM,
                amVenue: venueAM,
                pmStart: startPM,
                pmEnd: endPM,
                pmVenue: venuePM
            }
            fetch('/amPm', {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(amPmBody)
            })
            .then(response => response.json())
            .then(data => {
                console.log('AM/PM details uploaded', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
            break;
        case "series":
            let seriesName = []
            let seriesDate = []
            let seriesStart = []
            let seriesEnd = []
            let seriesVenue = []
            for (var i = 1; i <= seriesNumberField.value; i++){
                seriesName.push(document.getElementById(`name${i}`).value)
                seriesDate.push(getValidDate(document.getElementById(`startDate${i}`).value))
                seriesStart.push(document.getElementById(`startTime${i}`).value)
                seriesEnd.push(document.getElementById(`endTime${i}`).value)
                seriesVenue.push(document.getElementById(`venue${i}`).value)
            }
            console.log(seriesName)
            console.log(seriesDate)
            console.log(seriesStart)
            console.log(seriesEnd)
            console.log(seriesVenue)

            for (var i = 1; i <= seriesNumberField.value; i++){
                const seriesBody = {
                    seriesNum: i,
                    seriesName:seriesName[`${i-1}`],
                    seriesDate:seriesDate[`${i-1}`],
                    startTime: seriesStart[`${i-1}`],
                    endTime: seriesEnd[`${i-1}`],
                    venue: seriesVenue[`${i-1}`]
                }
                fetch('/series', {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify(seriesBody)
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Series details uploaded', data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
            break;
        default:
            console.log("No type selected")
            break;
    }
}

function uploadEventImg() {
    const formData = new FormData()
    formData.append("eventImage", eventPic)

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json(); 
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        console.log('Upload successful:', data);
    })
    .catch(error => {
        console.error('There was an error with the upload:', error);
    });
    
}

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