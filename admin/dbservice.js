const mysql = require('mysql');
const dotenv = require('dotenv');
const { resolve } = require('path');
const { rejects } = require('assert');
const { response } = require('express');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: '',
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        return;
    }
    console.log('Connected to the database');
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async getEvents() {
        let response;
        try {
            response = await new Promise ((resolve, reject) => {
                const query = "SELECT * FROM webdev.events"
                connection.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message))
                    } else {
                        // console.log("Fetched data from DB:", results);
                        resolve(results)
                    }
                })
            }) 
            // console.log(response)
            return response
        } catch (error) {
            console.log(error + ' Fetching events from DB failed.')
        }
    }

    async searchEvent(Event) {
        let response;
        try {
            response = await new Promise ((resolve, reject) => {
                if (/^\d+$/.test(Event)){
                    console.log("received id")
                    const parsed = parseInt(Event, 10)
                    console.log("Parsed:", parsed)
                    const query = "SELECT * FROM webdev.events WHERE Event_ID = ?"
                    connection.query(query, [parsed], (err, results) => {
                        if (err) {
                            reject(new Error(err.message))
                        } else {
                            console.log("Res:", results)
                            resolve(results)
                        }
                    })
                } else {
                    console.log("RECEIVED NAME")
                    const query = "SELECT * FROM webdev.events WHERE Event_Name LIKE ?"
                    connection.query(query, [`%${Event}%`], (err, results) => {
                        if (err) {
                            reject(new Error(err.message))
                        } else {
                            resolve(results)
                        }
                    })
                }
            }) 
            console.log("Response: ", response)
            return response
        } catch (error) {
            console.log(error + ' Fetching events from DB failed.')
        }
    }

    async getAttn(a, b) {
        let response;
        try {
            response = await new Promise ((resolve, reject) => {
                const parsed = parseInt(a, 10)
                console.log("Parsed:", parsed)
                let query = ""
                switch (b) {
                    case 'onetime':
                        query = "SELECT * FROM webdev.onetime WHERE Event_ID = ?"
                        break;
                    case 'ampm':
                        query = "SELECT * FROM webdev.`am/pm` WHERE Event_ID = ?"
                        break;
                    case 'series':
                        query = "SELECT * FROM webdev.series WHERE Event_ID = ?"
                        break;
                    default:
                        break;
                }
                connection.query(query, [parsed], (err, results) => {
                    if (err) {
                        reject(new Error(err.message))
                    } else {
                        console.log("Res:", results)
                        resolve(results)
                    }
                })
            }) 
            console.log("Response: ", response)
            return response
        } catch (error) {
            console.log(error + ' Fetching events from DB failed.')
        }
    }

    async getExternal(a) {
        let response;
        try {
            response = await new Promise ((resolve, reject) => {
                const query = "SELECT * FROM webdev.eventlinks WHERE Event_ID = ?"
                connection.query(query, [a], (err, results) => {
                    if (err) {
                        reject(new Error(err.message))
                    } else {
                        console.log("Fetched data from DB (EL):", results);
                        resolve(results)
                    }
                })
            }) 
            // console.log(response)
            return response
        } catch (error) {
            console.log(error + ' Fetching event links from DB failed.')
        }
    }

    async verifyUser(username, password) {
        let response;
        try {
            const query = "SELECT * FROM webdev.admin WHERE Admin_ID = ? AND Password = ?"
            const results = await new Promise((resolve, reject) => {
                connection.query(query, [username, password], (err, results) => {
                    if (err) {
                        reject(new Error (err.message))
                    } else {
                        // console.log("Fethed data from DB: ", results)
                        resolve(results)
                    }
                })
            })
            console.log("Response: ", results)
            return results
        } catch (error) {
            console.log(error + ' Verification of admin credentials failed.')
        }
    }

    async lastEventID() {
        let response;
        try {
            response = await new Promise ((resolve, reject) => {
                const query = "SELECT Event_ID FROM webdev.events ORDER BY Event_ID DESC LIMIT 1"
                connection.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message))
                    } else {
                        resolve(results)
                    }
                })
            }) 
            console.log("Response: ", response)
            return response
        } catch (error) {
            console.log(error + ' Fetching events from DB failed.')
        }
    }

    async newEvent(a, b, c, d, e, f, g, h, i, j){
        let response
        try {
            const lastID = await this.lastEventID();
            let eventID = `${lastID[0].Event_ID + 1}`
            console.log("event id: ", eventID)
            response = await new Promise ((resolve, reject) => {
                const query = "INSERT INTO webdev.events (Event_ID, Event_Name, Event_Tagline, Event_Description, Event_StartDate, Event_EndDate, Event_Type, isOpen, isPublic, isLive, Evaluation_Link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                connection.query(query, [eventID, a, b, c, d, e, f, g, h, i, j],(err, results) => {
                    if (err) {
                        reject(new Error(err.message))
                    } else {
                        // console.log("Fetched data from DB:", results);
                        resolve(results.Event_ID)
                    }
                })
            }) 
            // console.log(response)
            return response
        } catch (error) {
            console.log(error + ' Creating new event failed.')
    
        }
    }

    async editEvent(a, b, c, d, e, f, g, h, i, j, k, l){
        let response
        if (l == true) {
            let query
            switch (g.toLowerCase()) {
                case "onetime":
                    query = "DELETE FROM webdev.onetime WHERE Event_ID = ?"
                    break;
                case "am/pm":
                    query = "DELETE FROM webdev.`am/pm` WHERE Event_ID = ?"
                    break;
                case "series":
                    query = "DELETE FROM webdev.series WHERE Event_ID = ?"
                    break;
                default:
                    break;
            }
            connection.query(query, a,(err, results) => {
                if (err) {
                    console.error('Error executing DELETE query:', err);
                } else {
                    console.log('DELETE operation successful. Rows affected:', results.affectedRows);
                }
            })
        }
        try {
            response = await new Promise ((resolve, reject) => {
                const query = `UPDATE webdev.events
                SET Event_Name = ?,
                Event_Tagline = ?,
                Event_Description = ?,
                Event_StartDate = ?,
                Event_EndDate = ?,
                Event_Type = ?,
                isOpen = ?,
                isPublic = ?,
                isLive = ?,
                Evaluation_Link = ?
                WHERE Event_ID = ?`
                connection.query(query, [b, c, d, e, f, g, h, i, j, k, a],(err, results) => {
                    if (err) {
                        reject(new Error(err.message))
                    } else {
                        resolve({
                            affectedRows: results.affectedRows,
                            updateSuccess: true
                          })
                    }
                })
            }) 
            // console.log(response)
            return response
        } catch (error) {
            console.log(error + ' Creating new event failed.')
    
        }
    }

    async oneTime(a, b, c){
        let response
        try {
            const lastID = await this.lastEventID();
            let eventID = `${lastID[0].Event_ID}`
            console.log("event id: ", eventID)
            response = await new Promise ((resolve, reject) => {
                const query = `INSERT INTO webdev.onetime (Event_ID, Start_Time, End_Time, Venue) VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                Start_Time = VALUES(Start_Time),
                End_Time = VALUES(End_Time),
                Venue = VALUES(Venue)`
                connection.query(query, [eventID, a, b, c],(err, results) => {
                    if (err) {
                        reject(new Error(err.message))
                    } else {
                        // console.log("Fetched data from DB:", results);
                        resolve(results.Event_ID)
                    }
                })
            }) 
            // console.log(response)
            return response
        } catch (error) {
            console.log(error + ' Creating new event in OneTime failed.')
    
        }
    }
    
    async amPM(a, b, c, d, e, f){
        let response
        try {
            const lastID = await this.lastEventID();
            let eventID = `${lastID[0].Event_ID}`
            console.log("event id: ", eventID)
            response = await new Promise ((resolve, reject) => {
                const query = "INSERT INTO webdev.`am/pm` (Event_ID, AM_Start, AM_End, AM_Venue, PM_Start, PM_End, PM_Venue) VALUES (?, ?, ?, ?, ?, ?, ?) " +
                "ON DUPLICATE KEY UPDATE AM_Start = VALUES(AM_Start), AM_End = VALUES(AM_End), AM_Venue = VALUES(AM_Venue), " +
                "PM_Start = VALUES(PM_Start), PM_End = VALUES(PM_End), PM_Venue = VALUES(PM_Venue)";
                connection.query(query, [eventID, a, b, c, d, e, f],(err, results) => {
                    if (err) {
                        reject(new Error(err.message))
                    } else {
                        // console.log("Fetched data from DB:", results);
                        resolve(results.Event_ID)
                    }
                })
            }) 
            // console.log(response)
            return response
        } catch (error) {
            console.log(error + ' Creating new event in AM/PM failed.')
    
        }
    }

    async series(a, b, c, d, e, f){
        let response
        try {
            const lastID = await this.lastEventID();
            let eventID = `${lastID[0].Event_ID}`
            console.log("event id: ", eventID)
            response = await new Promise ((resolve, reject) => {
                const query = `INSERT INTO webdev.series (Event_ID, Series_Num, Series_Name, Date, Start_Time, End_Time, Venue) 
                VALUES (?, ?, ?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                Series_Name = VALUES(Series_Name),
                Date = VALUES(Date), 
                Start_Time = VALUES(Start_Time), 
                End_Time = VALUES(End_Time), 
                Venue = VALUES(Venue)`
                connection.query(query, [eventID, a, b, c, d, e, f],(err, results) => {
                    if (err) {
                        reject(new Error(err.message))
                    } else {
                        // console.log("Fetched data from DB:", results);
                        resolve(results.Event_ID)
                    }
                })
            }) 
            // console.log(response)
            return response
        } catch (error) {
            console.log(error + ' Creating new event in Series failed.')
    
        }
    }

    async imgUpload(a, b){
        let response
        try {
            const lastID = await this.lastEventID();
            let eventID = `${lastID[0].Event_ID}`
            console.log("event id: ", eventID)
            response = await new Promise ((resolve, reject) => {
                const query = "UPDATE webdev.events SET Event_Pic = ?, Event_PicFilePath = ? WHERE Event_ID = ?"
                connection.query(query, [a, b, eventID],(err, results) => {
                    if (err) {
                        reject(new Error(err.message))
                    } else {
                        // console.log("Fetched data from DB:", results);
                        resolve(results.Event_ID)
                    }
                })
            }) 
            // console.log(response)
            return response
        } catch (error) {
            console.log(error + ' Adding image data failed.')
    
        }
    }

    async external(a, b){
        let response
        try {
            const lastID = await this.lastEventID();
            let eventID = `${parseInt(lastID[0].Event_ID, 10) + 1}`;
            console.log("event id: ", eventID)
            response = await new Promise ((resolve, reject) => {
                const query = `INSERT INTO webdev.eventLinks (Link_Name, Weblink, Event_ID) VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                Link_Name = VALUES(Link_Name)
                Weblink = VALUES(Weblink)
                Event_ID = VALUES(Event_ID)`
                connection.query(query, [a, b, eventID],(err, results) => {
                    if (err) {
                        reject(new Error(err.message))
                    } else {
                        // console.log("Fetched data from DB:", results);
                        resolve(results.Event_ID)
                    }
                })
            }) 
            // console.log(response)
            return response
        } catch (error) {
            console.log(error + ' Creating new external link/s failed.')
    
        }
    }

    async announce(a, b, c){
        let response
        try {
            response = await new Promise ((resolve, reject) => {
                const query = "INSERT INTO webdev.announcements (Date_Posted, Details, Event_ID) VALUES (?, ?, ?)"
                connection.query(query , [a, b, c], (err, results) => {
                    if (err) {
                        reject(new Error (err.message))
                    } else {
                        resolve(results.Event_ID)
                    }
                })
            })
            return response
        } catch (error) {
            console.log(error + ' Creating a new announcement failed.')
        }
    }

    async addRecord(a, b, c, d) {
        let response;
        try {
            const hasRecord = await new Promise((resolve, reject) => {
                const query = "SELECT COUNT(In_Time) AS record FROM webdev.attendance WHERE Event_ID = ? AND User_ID = ?";
                connection.query(query, [c, d], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        // console.log("Fetched data from DB:", results);
                        resolve(results);
                    }
                });
            });
    
            const count = hasRecord[0].record;
    
            if (count === 0) {
                response = await new Promise((resolve, reject) => {
                    const updateQuery = `
                        UPDATE webdev.attendance
                        SET Date = ?, In_Time = ?
                        WHERE Event_ID = ? AND User_ID = ?
                    `;
            
                    const insertQuery = `
                        INSERT INTO webdev.attendance (Event_ID, User_ID, Date, In_Time)
                        SELECT ?, ?, ?, ?
                        FROM dual
                        WHERE NOT EXISTS (
                            SELECT 1
                            FROM webdev.attendance
                            WHERE Event_ID = ? AND User_ID = ?
                        )
                    `;
            
                    connection.query(updateQuery, [a, b, c, d], (updateErr, updateResults) => {
                        if (updateErr) {
                            reject(new Error(updateErr.message));
                        } else {
                            if (updateResults.affectedRows > 0) {
                                resolve("Attendance updated successfully!");
                            } else {
                                connection.query(insertQuery, [c, d, a, b, c, d], (insertErr, insertResults) => {
                                    if (insertErr) {
                                        reject(new Error(insertErr.message));
                                    } else {
                                        resolve("Attendance recorded successfully!");
                                    }
                                });
                            }
                        }
                    });
                });
                return response;
            } else {
                return "Attendance was already recorded!";
            }            
        } catch (error) {
            console.log(error + ' Creating new attendance record failed.');
            return "Error creating new attendance record";
        }
    }
    

    async getRegistrants(a){
        let selectResponse;
        try {
            selectResponse = await new Promise ((resolve, reject) => {
                const query = `
                SELECT regisdetails.User_ID, registration.Name FROM regisdetails 
                JOIN registration ON regisdetails.User_ID = registration.User_ID 
                WHERE regisdetails.Event_ID = ?`
                connection.query(query, [a], (err, results) => {
                    if (err) {
                        reject(new Error(err.message))
                    } else {
                        console.log("Fetched data from DB (registrants - O):", results);
                        resolve(results)
                    }
                })
            }) 
            makeRecord(a, selectResponse, 1)

            const response = await new Promise((resolve, reject) => {
                const query = `
                SELECT regisdetails.User_ID, registration.Name, attendance.Series_Num, attendance.In_Time FROM regisdetails 
                JOIN registration ON regisdetails.User_ID = registration.User_ID 
                JOIN attendance ON regisdetails.User_ID = attendance.User_ID
                WHERE attendance.Event_ID = ?
                `
                connection.query(query, [a], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        console.log("Fetched data from DB (attendance - 0):", results);
                        resolve(results);
                    }
                });
            });
    
            console.log("NameS:", response);
            return response
        } catch (error) {
            console.log(error + ' Fetching registrants from DB failed.')
        }
    }

    async getRegistrantsAMPM(a){
        try {
            const selectResponse = await new Promise((resolve, reject) => {
                const query = `
                SELECT regisdetails.User_ID, registration.Name FROM regisdetails 
                JOIN registration ON regisdetails.User_ID = registration.User_ID 
                WHERE regisdetails.Event_ID = ?
                `
                connection.query(query, [a], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        console.log("Fetched data from DB (registrants - A):", results);
                        resolve(results);
                    }
                });
            });
            makeRecord(a, selectResponse, 2);

            const response = await new Promise((resolve, reject) => {
                const query = `
                SELECT regisdetails.User_ID, registration.Name, attendance.Series_Num, attendance.In_Time FROM regisdetails 
                JOIN registration ON regisdetails.User_ID = registration.User_ID 
                JOIN attendance ON regisdetails.User_ID = attendance.User_ID
                WHERE attendance.Event_ID = ?
                `
                connection.query(query, [a], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        console.log("Fetched data from DB (attendance - A):", results);
                        resolve(results);
                    }
                });
            });

            console.log("NameS:", response);
            return response;
        } catch (error) {
            console.log(error + ' Fetching registrants from DB failed.');
        }
    }

    async getRegistrantsSeries(a){
        try {
            const selectResponse = await new Promise((resolve, reject) => {
                const query = `
                SELECT regisdetails.User_ID, registration.Name FROM regisdetails 
                JOIN registration ON regisdetails.User_ID = registration.User_ID 
                WHERE regisdetails.Event_ID = ?
                `
                connection.query(query, [a], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        console.log("Fetched data from DB (GR-S):", results);
                        resolve(results);
                    }
                });
            });
    
            const countQuery = "SELECT COUNT(*) AS Series_Count FROM events JOIN series ON events.Event_ID = series.Event_ID WHERE events.Event_ID = ?";
            const countResults = await new Promise((resolve, reject) => {
                connection.query(countQuery, [a], (err, results) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        reject(new Error(err.message));
                    } else {
                        console.log('Execution successful(SeriesCount). Count:', results[0].Series_Count);
                        resolve(results);
                    }
                });
            });
    
            const count = countResults[0].Series_Count;
    
            makeRecord(a, selectResponse, count);

            const response = await new Promise((resolve, reject) => {
                const query = `
                SELECT regisdetails.User_ID, registration.Name, attendance.Series_Num, attendance.In_Time FROM regisdetails 
                JOIN registration ON regisdetails.User_ID = registration.User_ID 
                JOIN attendance ON regisdetails.User_ID = attendance.User_ID
                WHERE attendance.Event_ID = ?
                `
                connection.query(query, [a], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        console.log("Fetched data from DB (attendance - A):", results);
                        resolve(results);
                    }
                });
            });

            console.log("NameS:", response);

            return response;
        } catch (error) {
            console.log(error + ' Fetching registrants from DB failed.');
        }
    }
    

    
}


function makeRecord(ID, names, count){
    console.log("nAMEs:", names)
    const userIDs = names.map(row => row.User_ID);
    console.log("USER IDs: ", userIDs);
    console.log("No. of series: ", count)
    console.log("Event ID: ", ID)
    const values = []
    for (var j = 1; j <= count; j++){
        for (var k = 0; k < userIDs.length; k++){
            values.push([j, ID, userIDs[k]])
        }
    }
    
    console.log(values)
    values.forEach(value => {recordQuery(value)})
}


function recordQuery(val){
    const selectQuery = "SELECT * FROM webdev.attendance WHERE Series_Num = ? AND Event_ID = ? AND User_ID = ?";
    connection.query(selectQuery , [val[0], parseInt(val[1],10), val[2]], (err, results) => {
        if (err) {
            console.error('Error executing SELECT query:', err);
        } else {
            if (results && results.length === 0){
                const insertQuery = "INSERT INTO webdev.attendance (Series_Num, Event_ID, User_ID) VALUES (?, ?, ?)"
                connection.query(insertQuery , [val[0], parseInt(val[1],10), val[2]], (err, results) => {
                    if (err) {
                        console.error('Error executing INSERT query:', err);
                    } else {
                        console.log('Attendance Record creation successful. Rows affected:', results.affectedRows);
                    }
                })
            }
        }
    })
}


module.exports = DbService;