# NaveEnt: Event Manager Web Application

A full-stack event management system built with **Node.js**, **Express.js**, and **PHP**, developed as a finals project for Web Development (CS312) at Saint Louis University, Baguio City.

---

## Team Members

- Bato, Leovide Daniel
- Dangilan, Ezrha Leigh
- Dulnuan, Geoff Anthony
- Gura, Kaizer Cyn
- Narag, Ava
- Surro, Jaymee Sofia

**Instructor:** Ma. Conception Clemente 

---

## Overview

This web application allows students and guests to discover, register for, and attend events at Saint Louis University. Admins can create and manage events, track attendance via QR codes, and post announcements.

---

## Features

### User
- Register via SLU email or as a guest
- Log in with student or guest account
- Browse ongoing and upcoming events
- Register as a participant for an event
- Bookmark events for later
- Receive a QR code for event attendance
- View announcements and event information
- Receive notifications for post-event evaluation forms
- View history of attended, registered, and bookmarked events

### Admin
- Log in with admin credentials
- Create and edit events
- Upload event-related images and links
- Post announcements
- Open and close event registration periods
- Scan attendee QR codes
- Log attendance

---

## Project Structure

```
project-root/
│
├── admin/                      # Node.js-based admin application
│   ├── node_modules/           # Node.js dependencies
│   ├── public/
│   │   ├── css/                # Admin stylesheets
│   │   ├── scripts/            # Client-side JavaScript
│   │   └── uploads/            # Uploaded event images
│   ├── views/                  # EJS templates
│   │   ├── admin_home.ejs
│   │   ├── admin_login.ejs
│   │   ├── attendance.ejs
│   │   ├── create_event_details.ejs
│   │   ├── edit_event.ejs
│   │   └── post_announce.ejs
│   ├── .env                    # Environment variables (DB & server config)
│   ├── app.js                  # Express.js server, routes, and session management
│   └── dbservice.js            # MySQL database service class
│
├── client/                     # PHP-based client-side application
│   ├── home.php                # Public event listing page
│   ├── logged_home.php         # Authenticated event listing page
│   ├── user_login.php          # User login page
│   ├── user_signup.php         # User registration page
│   ├── event_details.php       # Event info and registration form
│   ├── account_details.php     # User account details
│   ├── change_password.php     # Password change page
│   ├── bookmarked_events.php   # User's bookmarked events
│   ├── event_history.php       # User's event attendance history
│   ├── announcement.php        # Event announcements
│   ├── pending_evaluation.php  # Pending evaluation forms
│   ├── search.php              # Search handler
│   ├── search_results.php      # Search results display
│   └── successfully_registered.php  # Registration confirmation
│
├── php/                        # Shared PHP backend logic (DB connections, sign-up)
├── res/                        # Visual assets and fonts
├── vendor/                     # Composer dependencies
├── composer.json
├── composer.lock
├── index.php                   # Application entry point
└── README.md
```

---

## 🗃️ Database Schema

The application uses a **MySQL** relational database with the following tables:

| Table | Description |
|---|---|
| `ACCOUNTS` | Stores user credentials and profile info |
| `ADMIN` | Admin login credentials |
| `EVENTS` | Core event data (name, dates, type, status) |
| `REGISTRATION` | Event registration form submissions |
| `REGISDETAILS` | Links users to events with QR codes |
| `ATTENDANCE` | Attendance logs per event session |
| `ANNOUNCEMENTS` | Event-related announcements |
| `BOOKMARKS` | User-bookmarked events |
| `EVALUATIONS` | Post-event evaluation completion tracking |
| `EVENTLINKS` | External links attached to events |
| `ONETIME` | Schedule data for one-time events |
| `AMPM` | AM/PM session schedule data |
| `SERIES` | Schedule data for multi-session (series) events |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Admin Backend | Node.js, Express.js |
| Client Backend | PHP |
| Templating | EJS (admin), PHP (client) |
| Database | MySQL |
| File Uploads | Multer (Node.js) |
| Session Management | Express-session |
| Dependency Management | npm, Composer |

---

## 📄 License

This project was created for academic purposes at Saint Louis University. All rights reserved by the respective authors.
