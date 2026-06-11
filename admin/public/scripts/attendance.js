const oneTimeDiv = document.getElementById('onetime');
const ampmDiv = document.getElementById('ampm');
const seriesDiv = document.getElementById('series');
const missingTypeMsg = document.getElementById('none');
const oneTimeTitle = document.querySelector('#oneTimeTitle')
const oneTimeTagline = document.querySelector('#oneTimeTagline')
const oneTimeDesc = document.querySelector('#oneTimeDesc');
const oneTimeVenue = document.querySelector('#oneTimeVenue');
const oneTimeDate = document.querySelector('#oneTimeDate');
const oneTimeTable = document.querySelector('table#oneTimeTable tbody');
const ampmTitle = document.querySelector('#ampmTitle')
const ampmTagline = document.querySelector('#ampmTagline')
const ampmDesc = document.querySelector('#ampmDesc');
const ampmDate = document.querySelector('#ampmDate');
const venueAM = document.querySelector('#venueAM');
const venuePM = document.querySelector('#venuePM');
const amTable = document.querySelector('table#amTable tbody');
const pmTable = document.querySelector('table#pmTable tbody');
const seriesTitle = document.querySelector('#seriesTitle')
const seriesTagline = document.querySelector('#seriesTagline')
const seriesDesc = document.querySelector('#seriesDesc');
const seriesContainer = document.querySelector('.seriesContainer')
const toHomeBtn = document.querySelector('.toHome')
const logoutBtn = document.querySelector('.logout-btn');
const scanQrButtons = document.querySelectorAll('.btn-scan-qr');
const closeModalButtons = document.querySelectorAll('.closeModal');
const addModalButtons = document.querySelectorAll('.btn-addtoRecord');
const urlParams = new URLSearchParams(window.location.search)


var eventID = urlParams.get('eventID')
var eventType = ''
var seriesCount = ''
var eventData = ''
var seriesData = ''
var selectedOptionIndex = ''

let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", { 
        fps: 10, 
        qrbox: {width: 250, height: 250} 
    },
    false)

document.addEventListener('DOMContentLoaded', function () {
    fetch(`/search/${eventID}`)
    .then(response => response.json())
    .then(data => {
        eventData = data['data'];
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
    window.location.href = '/';
})

scanQrButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        document.getElementById('result').innerHTML = ''
        html5QrcodeScanner.render(onScanSuccess, onScanFailure)
    });
});

closeModalButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        document.getElementById('userID').value = ''
        document.getElementById('msgID').textContent = ''
        document.getElementById('msgDropdownQR').textContent = ''
        document.querySelector('.dropdown').innerHTML = ''
        selectedOptionIndex = ''
        const dropdownElement = document.querySelector('.dropdown')
        dropdownElement.innerHTML = ''
        html5QrcodeScanner.clear();
    });
});


function attachListener() {
    document.querySelector('.seriesSelect').addEventListener('change', function () {
        document.getElementById('msgID').textContent = '';
        selectedOptionIndex = parseInt(this.selectedIndex, 10);
        console.log('Selected Option Index:', selectedOptionIndex); 
    });
}
addModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        console.log('Button clicked: ', eventType)
        const userIDInput = document.getElementById('userID');
        const msgID = document.getElementById('msgID');
        
        if (!userIDInput.value.trim()) {
            msgID.textContent = "Please enter an ID Number";
        } else {
            const concat = userIDInput.value.trim() + eventID;

            if (eventType.toLowerCase() === "series") {
                genDropdown("AddDropdown");
                attachListener();

                if (selectedOptionIndex === 0 || selectedOptionIndex === '') {
                    msgID.innerHTML = 'Please select a series.';
                } else {
                    console.log(concat);
                    addRecord(concat);
                    userIDInput.value = '';
                }
            } else {
                console.log(concat);
                addRecord(concat);
                userIDInput.value = '';
            }
        }
    });
});


async function loadEvent(data) {
    console.log(data)
    eventType = data[0].Event_Type
    console.log(eventType)
    switch (data[0].Event_Type) {
        case "OneTime":
            ampmDiv.style.display = 'none';
            seriesDiv.style.display = 'none';
            oneTimeTitle.innerHTML = data[0].Event_Name
            oneTimeTagline.innerHTML = data[0].Event_Tagline
            oneTimeDesc.innerHTML = data[0].Event_Description
            oneTimeDate.innerHTML =  new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).format(new Date(data[0].Event_StartDate))
            const oneTimeData = await getAttendanceDetails("onetime", eventID)
            console.log("Received data:", oneTimeData);
            oneTimeVenue.innerHTML = (oneTimeData[0].Venue ? oneTimeData[0].Venue : "No venue specified")
            loadOneTime()
            break;
        case "AM/PM":
            oneTimeDiv.style.display = 'none';
            seriesDiv.style.display = 'none';
            ampmTitle.innerHTML = data[0].Event_Name
            ampmTagline.innerHTML = data[0].Event_Tagline
            ampmDesc.innerHTML = data[0].Event_Description
            ampmDate.innerHTML =  new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).format(new Date(data[0].Event_StartDate))
            const AMPMData = await getAttendanceDetails("ampm", eventID)
            console.log("Received data:", AMPMData);
            venueAM.innerHTML = "AM Session Venue: " + (AMPMData[0].AM_Venue ? AMPMData[0].AM_Venue : 'No venue specified');
            venuePM.innerHTML = "PM Session Venue: " + (AMPMData[0].PM_Venue ? AMPMData[0].PM_Venue : 'No venue specified');
            loadAMPM()
            break;
        case "Series":
            oneTimeDiv.style.display = 'none';
            ampmDiv.style.display = 'none';
            seriesTitle.innerHTML = data[0].Event_Name
            seriesTagline.innerHTML = data[0].Event_Tagline
            seriesDesc.innerHTML = data[0].Event_Description
            genSeriesTables()
            loadSeries()
            break;
        default:
            oneTimeDiv.style.display = 'none';
            ampmDiv.style.display = 'none';
            seriesDiv.style.display = 'none';
            missingTypeMsg.innerHTML = "Attendance record is unavailable. Please set an attendance type for this event first."
            break;
    }
}

async function loadOneTime(){
    oneTimeTable.innerHTML = ''
    const registrants  = await getRegistrants(eventID)
    console.log(registrants)

    if (!registrants || registrants.length === 0) {
        oneTimeTable.innerHTML = "<tr><td class='no-data' colspan='2'>No Participants Yet</td></tr>";
        return;
    }

    let tableHTML = ""
    registrants.forEach(function ({User_ID, Name, In_Time}){
        
        tableHTML += "<tr>"
        tableHTML += `<td>${Name}</td>`
        if(!In_Time){
            tableHTML += `<td class=${eventID} id=${User_ID}></td>`
        } else {
            tableHTML += `<td class= "attendance ${eventID}" id=${User_ID}>${In_Time}</td>`
        }
        tableHTML += "</tr>"
    })
    oneTimeTable.innerHTML = tableHTML
}

async function loadAMPM(){
    amTable.innerHTML = ''
    pmTable.innerHTML = ''
    const registrants  = await getRegistrantsAMPM(eventID)
    console.log(registrants)

    if (!registrants || registrants.length === 0) {
        amTable.innerHTML = "<tr><td class='no-data' colspan='2'>No Participants Yet</td></tr>";
        pmTable.innerHTML = "<tr><td class='no-data' colspan='2'>No Participants Yet</td></tr>";
        return;
    }

    let amTableHTML = '';
    let pmTableHTML = '';

    registrants.forEach(registrant => {
        const { Name, Series_Num, In_Time } = registrant;

        let tableHTML = "<tr>";
        tableHTML += `<td>${Name}</td>`;
        tableHTML += `<td class="${eventID} ${Series_Num}">${In_Time ? In_Time : ''}</td>`;
        tableHTML += "</tr>";

        if (Series_Num === 1) {
            amTableHTML += tableHTML;
        } else if (Series_Num === 2) {
            pmTableHTML += tableHTML;
        }
    });

    amTable.innerHTML = amTableHTML;
    pmTable.innerHTML = pmTableHTML;


}

async function genSeriesTables(){
    seriesData = await getAttendanceDetails("series", eventID)
    console.log("Received data:", seriesData);
    seriesCount = seriesData.length

    let containerHTMl = ""
    for (var i = 0; i < seriesCount; i++){
        let date = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(new Date(seriesData[i].Date))
        containerHTMl += `<div class=series${i+1}>`
        containerHTMl += `<h3>${seriesData[i].Venue ? seriesData[i].Series_Name : `Series ${i}`}</h3>`
        containerHTMl += `<p id="seriesVenue${i}">${seriesData[i].Venue ? seriesData[i].Venue : 'No venue specified'}</p>`
        containerHTMl += `<div class="row">
                            <div class="col-10"></div>
                            <div class="col-2 text-right">
                                <p class="date${i+1}">${date}</p>
                            </div>
                        </div>`
        containerHTMl += `<div class="table-responsive">
                            <table class="table table-striped table-hover" id="seriesTable${i+1}">
                                <thead class="thead-light">
                                    <tr>
                                        <th scope="col">Participant</th>
                                        <th scope="col">In Time</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                             </table>
                        </div>`
        containerHTMl += "</div>"
    }

    seriesContainer.innerHTML = containerHTMl
}
async function loadSeries(){
    for (let r = 0; r <= seriesCount; r++){
        let seriesTable = document.querySelector(`table#seriesTable${r} tbody`);
        if (seriesTable !== null) {
            seriesTable.innerHTML = '';
        }
    }
    const registrants  = await getRegistrantsSeries(eventID)
    console.log("Registrants: ", registrants)
    for (const registrant of registrants) {
        const j = registrant.Series_Num;
        const seriesTable = document.querySelector(`table#seriesTable${j} tbody`);
    
        const tableHTML = `
            <tr>
                <td>${registrant.Name}</td>
                <td class=${registrant.eventID} id=${registrant.User_ID}></td>
            </tr>
        `;
    
        seriesTable.innerHTML += tableHTML;
    }
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

function getRegistrants(ID){
    return fetch(`/getRegistrants/${ID}`)
        .then(response => response.json())
        .then(data => data['data'])
        .catch(error => {
            console.error("Error fetching data:", error);
            throw error; 
    });
}

function getRegistrantsAMPM(ID){
    return fetch(`/getRegistrantsAMPM/${ID}`)
        .then(response => response.json())
        .then(data => data['data'])
        .catch(error => {
            console.error("Error fetching data:", error);
            throw error; 
    });
}

function getRegistrantsSeries(ID){
    return fetch(`/getRegistrantsSeries/${ID}`)
        .then(response => response.json())
        .then(data => data['data'])
        .catch(error => {
            console.error("Error fetching data:", error);
            throw error; 
    });
}


function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code matched = ${decodedText}`, decodedResult)
    html5QrcodeScanner.clear()
    if (eventType === "Series") {
        genDropdown("QRDropdown")

        document.querySelector('.seriesSelect').addEventListener('change', function() {
            document.getElementById('msgDropdownQR').textContent = ''
            selectedOptionIndex = parseInt(this.selectedIndex, 10)
            console.log('Selected Option Index:', selectedOptionIndex);
            if (selectedOptionIndex == 0) {
                document.getElementById('msgDropdownQR').innerHTML = 'Please select a series.'
            } else {
                addRecord(decodedText)
            }
        });

    } else {
        addRecord(decodedText)
    }
    
}
  
function onScanFailure(error) {
    console.warn(`Code scan error = ${error}`);
}

function genDropdown(type) {
        var optionsHTML = ''
        var seriesNames = ''
        seriesNames = seriesData.map(item => item.Series_Name)
        console.log(seriesNames);
        optionsHTML = seriesNames.map(seriesName => `<option>${seriesName}</option>`).join('');
        console.log('Options HTML:', optionsHTML);


        let dropdownElement =''
        
        if (type === "QRDropdown") {
            dropdownElement = document.querySelector('#qrSeriesSelect');
        } else {
            dropdownElement = document.querySelector('#partiSeriesSelect');
        }
        console.log('Dropdown Element:', dropdownElement);

        dropdownElement.innerHTML = `
        <select class="form-select form-select-sm seriesSelect"  aria-label=".form-select-sm example">
            <option selected>Select a series</option>
            ${optionsHTML}
        </select>
`;
}


function addRecord(txt){
    const userID = txt.slice(0, 7)
    const eventID = txt.slice(7)
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().split(' ')[0];
    var num = ''
    switch (eventType) {
        case "OneTime":
            num = 1
            break;
        case "AM/PM":
            let period = time.slice(-2);
            if (period.toUpperCase() === "AM") {
                num = 1;
            } else {
                num = 2;
            }
            break;
        case "Series":
              num = selectedOptionIndex
            break;
        default:
            break;
    }
    
    console.log("User ID: " +userID)
    console.log("Event ID: " +eventID)
    console.log('Date:', date);
    console.log('Num:', num);
    console.log('Time:', time);
    const recordBody = {
        Date: date,
        // SeriesNum: num,
        InTime: time,
        user: userID,
        event: eventID
    }
    fetch('/addRecord', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(recordBody)
    })
    .then(response => response.json())
    .then(data => {
        handleRecordResult(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
  
function handleRecordResult(data) {
    console.log('Attendance record', data);
    document.querySelector('#result').innerHTML = `<h2>${data.data}</h2>`
    document.querySelector('#msgID').innerHTML = `<h2>${data.data}</h2>`
    switch (eventType) {
        case "OneTime":
            loadOneTime()
            break;
        case "AM/PM":
            loadAMPM()
            break;
        case "Series":
            loadSeries()
            break;
        default:
            break;
    }
}
