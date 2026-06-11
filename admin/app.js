const express = require('express');
const app = express();
const multer = require('multer');
const session = require('express-session')
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
dotenv.config();

const dbService = require('./dbservice');
const { request } = require('http');

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, './uploads')
    },
    filename: async (request, file, cb) => {
        console.log(file)
        const fileName = await createFileName();
        cb(null, fileName + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage })

var filename = ''

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended : false }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true}))

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')));

app.use('/font', express.static(path.join(__dirname, 'public/css/font')));

app.use('/res', express.static(path.join(__dirname, 'public/css/res')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('views', path.join(__dirname, 'views'));


const sessionAuth = (request, response, next) => {
    if (request.session.username) {
        next()
    } else {
        response.redirect('/')
    }
}
app.get('/', (request, response) => {
    if (request.session.username) {
        console.log("IF app get /: ", request.session)
        response.redirect('/admin_home');
      } else {
        console.log("ELSE app get /: ", request.session)
        response.render('admin_login');
      }
});

app.get('/admin_home', sessionAuth, (request, response) => {
    response.render('admin_home');
});

app.get('/edit_event', sessionAuth,  (request, response) => {
    response.render('edit_event');
});

app.get('/post_announce', sessionAuth, (request, response) => {
    response.render('post_announce');
});

app.get('/admin_event', sessionAuth, (request, response) => {
    response.render('admin_event');
});

app.get('/admin_profile', sessionAuth, (request, response) => {
    response.render('admin_profile');
});

app.get('/create_event_details', sessionAuth, (request, response) => {
    response.render('create_event_details');
});

app.get('/create_event_img', sessionAuth, (request, response) => {
    response.render('create_event_img');
});

app.get('/attendance', sessionAuth, (request, response) => {
    response.render('attendance');
});

app.get('/admin_home.js', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/scripts/admin_home.js'), {
      headers: {
        'Content-Type': 'application/javascript'
        }
    });
});

app.get('/admin_login.js', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/scripts/admin_login.js'), {
      headers: {
        'Content-Type': 'application/javascript'
        }
    });
});

app.get('/create_event.js', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/scripts/create_event.js'), {
      headers: {
        'Content-Type': 'application/javascript'
        }
    });
});

app.get('/edit_event.js', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/scripts/edit_event.js'), {
      headers: {
        'Content-Type': 'application/javascript'
        }
    });
});

app.get('/load_event.js', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/scripts/load_event.js'), {
      headers: {
        'Content-Type': 'application/javascript'
        }
    });
});

app.get('/post_announce.js', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/scripts/post_announce.js'), {
      headers: {
        'Content-Type': 'application/javascript'
        }
    });
});

app.get('/attendance.js', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/scripts/attendance.js'), {
      headers: {
        'Content-Type': 'application/javascript'
        }
    });
});

app.get('/admin_login.css', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/css/admin_login.css'), {
        headers: {
            'Content-Type': 'text/css'
        }
    });
});

app.get('/admin_home.css', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/css/admin_home.css'), {
        headers: {
            'Content-Type': 'text/css'
        }
    });
});

app.get('/admin_event.css', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/css/admin_event.css'), {
        headers: {
            'Content-Type': 'text/css'
        }
    });
});

app.get('/create_event.css', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/css/create_event.css'), {
        headers: {
            'Content-Type': 'text/css'
        }
    });
});

app.get('/edit_event.css', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/css/edit_event.css'), {
        headers: {
            'Content-Type': 'text/css'
        }
    });
});

app.get('/post_announce.css', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/css/post_announce.css'), {
        headers: {
            'Content-Type': 'text/css'
        }
    });
});

app.get('/attendance.css', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/css/attendance.css'), {
        headers: {
            'Content-Type': 'text/css'
        }
    });
});

app.get('/getEvents', async (request, response) => {
    try {
        const db = dbService.getDbServiceInstance()
        const results = await db.getEvents()
        response.json({data: results});
    } catch (error) {
        console.log(error + " Error getting events.");
        response.status(500).json({ error: error.message });
    }
})

app.get('/search/:Event', async (request, response) => {
    try {
        const { Event } = request.params
        console.log({Event})
        const db = dbService.getDbServiceInstance()
        const results = await db.searchEvent(Event)
        response.json({data: results});
    } catch (error) {
        console.log(error + " Error getting searched events");
        response.status(500).json({ error: err.message });
    }
})

app.post('/login', async (request, response) => {
    try {
        let username = request.body.username
        let password = request.body.password

        if (username && password) {
            console.log({ username, password })
            const db = dbService.getDbServiceInstance()
            const results = await db.verifyUser(username, password)
            // console.log("app.js:", results)

            if (results.length > 0) {
                request.session.username = username;
                response.redirect('/admin_home')
            } else {
                console.log("Login credentials invalid")
                response.redirect('/')
            }
        }
    } catch (error) {
        console.log(error + " Error verifying user credentials");
        response.status(500).json({ error: error.message }); 
    }

    console.log(request.session)
})

app.get('/logout', (request, response) => {
    console.log("logging out...")
    request.session.destroy()
    console.log(request.session)
    response.redirect('/')
})

app.post('/addEvent', async (request, response) => {
    try {
        let eventName = request.body.name
        let eventTagline = request.body.tagline
        let eventDesc = request.body.desc
        let startDate = request.body.start
        let endDate = request.body.end
        let eventType = request.body.type
        let isOpen = request.body.open
        let isPublic = request.body.public
        let isLive = request.body.live
        let evalLink = request.body.eval

        const db = dbService.getDbServiceInstance()
        const result = await db.newEvent(eventName, eventTagline, eventDesc, startDate, endDate,
            eventType, isOpen, isPublic, isLive, evalLink)
        response.json({
            data: result,
            success: true})
    } catch (error) {
        console.log(error + " Error creating event");
        response.status(500).json({ error: error.message }); 
    }
})

app.post('/editEvent/:eventID/:willDel', async (request, response) => {
    try {
        let eventId = request.params.eventID
        let del = request.params.willDel
        let eventName = request.body.name
        let eventTagline = request.body.tagline
        let eventDesc = request.body.desc
        let startDate = request.body.start
        let endDate = request.body.end
        let eventType = request.body.type
        let evalLink = request.boddel
        let isOpen = request.body.open
        let isPublic = request.body.public
        let isLive = request.body.live

        const db = dbService.getDbServiceInstance()
        const result = await db.editEvent(eventId, eventName, eventTagline, eventDesc, startDate, endDate,
            eventType, isOpen, isPublic, isLive, evalLink, del)
        response.json({
            data: result,
            success: true
        })
    } catch (error) {
        console.log(error + " Error creating event");
        response.status(500).json({ error: error.message }); 
    }
})

app.post('/oneTime', async (request, response) => {
    try {
        let startTime = request.body.startTime
        let endTime = request.body.endTime
        let venue = request.body.venue

        const db = dbService.getDbServiceInstance()
        const result = await db.oneTime(startTime, endTime, venue)
        response.json({
            data: result,
            success: true
        })
    } catch (error) {
        console.log(error + " Error creating OneTime event");
        response.status(500).json({ error: error.message }); 
    }
})

app.post('/amPm', async (request, response) => {
    try {
        let AMstartTime = request.body.amStart
        let AMendTime = request.body.amEnd
        let AMVenue = request.body.amVenue
        let PMstartTime = request.body.pmStart
        let PMendTime = request.body.pmEnd
        let PMVenue = request.body.pmVenue

        const db = dbService.getDbServiceInstance()
        const result = await db.amPM(AMstartTime, AMendTime, AMVenue, PMstartTime, PMendTime, PMVenue)
        response.json({
            data: result,
            success: true
        })
    } catch (error) {
        console.log(error + " Error creating AM/PM event");
        response.status(500).json({ error: error.message }); 
    }
})

app.post('/series', async (request, response) => {
    try {
        let num = request.body.seriesNum
        let name = request.body.seriesName
        let date = request.body.seriesDate
        let start = request.body.startTime
        let end = request.body.endTime
        let venue = request.body.venue

        const db = dbService.getDbServiceInstance()
        const result = await db.series(num, name, date, start, end, venue)
        response.json({
            data: result,
            success: true
        })
    } catch (error) {
        console.log(error + " Error creating AM/PM event");
        response.status(500).json({ error: error.message }); 
    }
})

app.post('/upload/', upload.single("eventImage"), async (req, res) => {
    try {
        const filePath = req.file.path;
        fs.readFile(filePath, (err, data) => {
            if (err) {
                return res.status(500).send('Error reading file.');
            }
            const base64Data = Buffer.from(data).toString('base64');
            const db = dbService.getDbServiceInstance();
            db.imgUpload(base64Data, filePath)
                .then(result => {
                    res.json({ success: true });
                })
                .catch(error => {
                    res.status(500).json({ success: false, error: 'Error uploading image to database' });
                });
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ success: false, error: 'Error uploading image' });
    }
});

app.post('/external', async (request, response) => {
    try {
        let name = request.body.name
        let weblink = request.body.weblink

        const db = dbService.getDbServiceInstance()
        const result = await db.external(name, weblink)
        response.json({
            data: result,
            success: true
        })
    } catch (error) {
        console.log(error + " Error adding Event Links");
        response.status(500).json({ error: error.message }); 
    }
})

app.post('/announce', async (request, response) =>{
    try {
        let date = request.body.date
        let anncmnt = request.body.anncmnt
        let eventID = request.body.event

        const db = dbService.getDbServiceInstance()
        const result = await db.announce(date, anncmnt, eventID)
        response.json({
            data: result,
            success: true
        })
    } catch (error) {
        console.log(error + " Error adding Announcement");
        response.status(500).json({ error: error.message }); 
    }
})

app.get('/getAttnDetails/:eventID/:type', async (request, response) => {
    try {
        const eventID = request.params.eventID;
        const type = request.params.type;
        const db = dbService.getDbServiceInstance()
        const results = await db.getAttn(eventID, type)
        response.json({
            data: results,
            success: true
        })
    } catch (error) {
        console.log(error + " Error getting event's attendance type details.");
        response.status(500).json({ error: error.message });
    }
})

app.get('/getExternalDetails/:eventID', async (request, response) => {
    try {
        const eventID = request.params.eventID;
        const db = dbService.getDbServiceInstance()
        const results = await db.getExternal(eventID)
        response.json({
            data: results,
            success: true
        })
    } catch (error) {
        console.log(error + " Error getting event's external links' details.");
        response.status(500).json({ error: error.message });
    }
})

app.get('/getRegistrants/:eventID', async (request, response) => {
    try {
        const eventID = request.params.eventID;
        const db = dbService.getDbServiceInstance()
        const results = await db.getRegistrants(eventID)
        response.json({
            data: results,
            success: true
        })
    } catch (error) {
        console.log(error + " Error getting event's registrants (OT) details.");
        response.status(500).json({ error: error.message });
    }
})

app.get('/getRegistrantsAMPM/:eventID', async (request, response) => {
    try {
        const eventID = request.params.eventID;
        const db = dbService.getDbServiceInstance()
        const results = await db.getRegistrantsAMPM(eventID)
        response.json({
            data: results,
            success: true
        })
    } catch (error) {
        console.log(error + " Error getting event's registrants (AP) details.");
        response.status(500).json({ error: error.message });
    }
})

app.get('/getRegistrantsSeries/:eventID', async (request, response) => {
    try {
        const eventID = request.params.eventID;
        const db = dbService.getDbServiceInstance()
        const results = await db.getRegistrantsSeries(eventID)
        response.json({
            data: results,
            success: true
        })
    } catch (error) {
        console.log(error + " Error getting event's registrants (S) details.");
        response.status(500).json({ error: error.message });
    }
})

app.post('/addRecord', async (request, response) => {
    try {
        let date = request.body.Date
        let time = request.body.InTime
        let user = request.body.user
        let event = request.body.event

        const db = dbService.getDbServiceInstance()
        const result = await db.addRecord(date, time, event, user)
        response.json({
            data: result,
            success: true
        })
    } catch (error) {
        console.log(error + " Error adding attendance records");
        response.status(500).json({ error: error.message }); 
    }
})

async function createFileName() {
    return new Promise((resolve) => {
      const timestamp = Date.now();
      const filename = `NavEnt_file_${timestamp}.txt`;
  
      
  
    // Example usage
    createFileName().then((filename) => {
        console.log('Generated Filename:', filename);
    });
})}
  

app.listen(process.env.PORT, () => console.log('app is running'))
