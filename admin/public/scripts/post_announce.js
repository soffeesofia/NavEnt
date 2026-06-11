const urlParams = new URLSearchParams(window.location.search)
var eventID = urlParams.get('eventID')
console.log(eventID)

document.addEventListener('DOMContentLoaded', function () {
  eventNameElement.innerHTML = ''
  fetch(`/search/${eventID}`)
  .then(response => response.json())
  .then(data => {
    loadEventName(data['data'])
  })
  .catch(error => console.error("Error fetching data:", error));
})

const toHomeBtn = document.querySelector('.toHome')
const logoutBtn = document.querySelector('.logout-btn');
const eventNameElement = document.querySelector('#name');
const announcement = document.getElementById('description');
const unfilledMsgContainer = document.querySelector('.unfilledFieldsDiv');
const confirmationMsgContainer = document.querySelector('.confirmationDiv');
const publishBtn = document.querySelector('.button-save-publish')


publishBtn.addEventListener('click', function(e) {
  unfilledMsgContainer.innerHTML = ''
  confirmationMsgContainer.innerHTML = ''
  if (!announcement.value.trim()){
    displayMessage("Enter an announcement before publishing.", unfilledMsgContainer, false)
  } else {
    anncmntBody = {
      date: getCurrentDate(),
      anncmnt: announcement.value.trim(),
      event: eventID
    }
    console.log(JSON.stringify(anncmntBody))
    sendToServer(anncmntBody)
    displayMessage("Announcement successfully published.", confirmationMsgContainer, true)
    setTimeout(function() {
      window.location.href = '/admin_home';
  }, 1000);
  }
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

function getCurrentDate(){
  const now = new Date()

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    
    return formattedDateTime;
}

function sendToServer(body){
  fetch('/announce', {
    headers:{
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
  })
  .catch(error => {
    console.error("Error sending to server: ", error)
  })
}

function loadEventName(data) {
  console.log("here")
  console.log("Received data:", data);
  let inner = ""

  if (Array.isArray(data) && data.length > 0) {
    inner = data.map(event => event.Event_Name).join(', ');
  }

  eventNameElement.innerHTML = inner;
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


