document.addEventListener('DOMContentLoaded', function () {
    fetch('/getEvents')
    .then(response => response.json())
    .then(data => {
        load(data['data'])

        const editBtns = document.querySelectorAll('.btn_edit')
        const announceBtns = document.querySelectorAll('.btn_announce')
        const attendanceBtns = document.querySelectorAll('.btn_attendance')
        
        editBtns.forEach(function(editBtn) {
          editBtn.addEventListener('click', function(e) {
            const eventID = this.getAttribute('data-id')
              console.log(eventID)
              console.log('edit clicked')
              window.location.href = '/edit_event?eventID=' +eventID
          });
        })

        announceBtns.forEach(function(announceBtn) {
          announceBtn.addEventListener('click', function(e) {
              const eventID = this.getAttribute('data-id')
              console.log(eventID)
              console.log('announce clicked')
              window.location.href = '/post_announce?eventID=' +eventID
          });
        })

        attendanceBtns.forEach(function(attendanceBtn) {
          attendanceBtn.addEventListener('click', function(e) {
              const eventID = this.getAttribute('data-id')
              console.log(eventID)
              console.log('attendance clicked')
              window.location.href = '/attendance?eventID=' +eventID
          });
        })
    })
})

const table = document.querySelector('table.events tbody')
const searchBtn = document.querySelector('nav.search a')
const tableTitle = document.querySelector('.table-title')
const newEventBtn = document.querySelector('.crt-btn')
const toHomeBtn = document.querySelector('.toHome')
const logoutBtn = document.querySelector('.logout-btn');

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

searchBtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('searched clicked')
    const searchValue = document.querySelector('.search-input').value.trim()
    console.log("search val: ", searchValue)
    tableTitle.innerHTML = "Search Results"
    fetch(`/search/${searchValue}`)
    .then(response => response.json())
    .then(data => load(data['data']))
})

newEventBtn.addEventListener('click', function(e) {
    e.preventDefault()
    console.log('new clicked')
    window.location.href = '/create_event_details'
})

toHomeBtn.addEventListener('click', function(e) {
    console.log('home clicked')
    window.location.reload();
})

function load(data) {
    // console.log("Received data:", data);
    if (!data || data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='8'>No Data</td></tr>";
        return;
    }
    let tableHTML = "";
    data.forEach(function ({ Event_ID, Event_Name, Event_StartDate, Event_EndDate, Participants, Event_Type, isLive, isOpen }) {
        tableHTML += "<tr>"
        tableHTML += `<td>${Event_Name}</td>`
        tableHTML += `<td>${String(Participants)}</td>` 
        tableHTML += `<td>${new Date(Event_StartDate).toLocaleDateString()}</td>`
        tableHTML += `<td>${new Date(Event_EndDate).toLocaleDateString()}</td>`
        tableHTML += `<td>${Event_Type}</td>`
        tableHTML += `<td>${isLive ? 'Published' : 'Draft'}</td>`;
        tableHTML += `<td>${isOpen ? 'Open' : 'Closed'}</td>`;
        tableHTML += `<td>
                        <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                            <button type="button" class="btn_edit" data-id=${Event_ID}>Edit</button>
                            <button type="button" class="btn_announce" data-id=${Event_ID}>Announce</button>
                            <button type="button" class="btn_attendance" data-id=${Event_ID}>Attendance</button>
                        </div>
                     </td>`
        tableHTML += "</tr>"
    })

    table.innerHTML = tableHTML;
}
