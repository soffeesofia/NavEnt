-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: webdev
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `User_ID` int(11) NOT NULL,
  `First_Name` varchar(45) NOT NULL,
  `Last_Name` varchar(45) NOT NULL,
  `Email_Address` varchar(255) NOT NULL,
  `Password` varchar(45) NOT NULL,
  PRIMARY KEY (`User_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (2212173,'Sofia','Surro','2212173@slu.edu.ph','12345'),(2221097,'Kaizer','Gura','2221097@slu.edu.ph','12345'),(2223144,'Ezrha','Dangilan','2223144@slu.edu.ph','12345'),(2223451,'Leovide','Bato','2223451@slu.edu.ph','12345'),(2224512,'Ava','Narag','2224512@slu.edu.ph','12345'),(2226098,'Geoff','Dulnuan','2226098@slu.edu.ph','12345');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `Admin_ID` varchar(45) NOT NULL,
  `Password` varchar(45) NOT NULL,
  PRIMARY KEY (`Admin_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES ('ad01','1234');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `am/pm`
--

DROP TABLE IF EXISTS `am/pm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `am/pm` (
  `Event_ID` varchar(255) NOT NULL,
  `AM_Start` time DEFAULT NULL,
  `AM_End` time DEFAULT NULL,
  `AM_Venue` varchar(255) DEFAULT NULL,
  `PM_Start` time DEFAULT NULL,
  `PM_End` time DEFAULT NULL,
  `PM_Venue` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Event_ID`),
  KEY `EventID_AM/PM` (`Event_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `am/pm`
--

LOCK TABLES `am/pm` WRITE;
/*!40000 ALTER TABLE `am/pm` DISABLE KEYS */;
INSERT INTO `am/pm` VALUES ('10002','09:00:00','12:00:00','lorem ipsum','13:00:00','14:00:00','loremipma'),('10005 ','10:30:00','12:30:00',NULL,'14:00:00','16:00:00',NULL),('10010','08:45:00','11:30:00',NULL,'13:00:00','15:00:00',NULL);
/*!40000 ALTER TABLE `am/pm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `Announcement_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Date_Posted` datetime NOT NULL,
  `Details` text NOT NULL,
  `Event_ID` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Announcement_ID`),
  KEY `Event_ID_Announcement` (`Event_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
INSERT INTO `announcements` VALUES (1,'2023-11-24 08:30:00','Bring a notepad and pen.','10001'),(2,'2023-11-25 10:15:00','Food and water is provided.','10002'),(3,'2023-12-02 13:45:00','Event starts at 9 AM.','10004'),(4,'2023-12-05 09:00:00','Dress code: Business casual.','10003'),(5,'2023-12-10 16:20:00','Networking session at 3 PM.','10005'),(6,'2023-12-15 11:55:00','Attire: Business casual for the guest speaker event.','10006'),(7,'2023-12-18 14:40:00','Access to event only with valid university identification.','10009'),(8,'2023-12-20 10:30:00','Live streaming available for remote participants.','10002'),(9,'2023-12-22 12:10:00','Parking instructions for on-site event attendees.','10007'),(10,'2023-12-28 09:45:00','Registration closing soon for the annual conference.','10008'),(13,'2024-01-24 03:25:51','lorem','10001'),(14,'2024-01-24 03:29:40','loo','10001'),(15,'2024-01-24 03:30:39','lol','10001');
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `Attendance_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Date` date DEFAULT NULL,
  `Series_Num` int(11) DEFAULT NULL,
  `In_Time` time DEFAULT NULL,
  `Event_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  PRIMARY KEY (`Attendance_ID`),
  KEY `UserID_Attendance_idx` (`User_ID`),
  KEY `EventID_Attendance_idx` (`Event_ID`),
  CONSTRAINT `EventID_Attendance` FOREIGN KEY (`Event_ID`) REFERENCES `events` (`Event_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `UserID_Attendance` FOREIGN KEY (`User_ID`) REFERENCES `accounts` (`User_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (10,'2024-01-25',1,'15:13:47',10001,2212173),(11,'2024-01-25',1,'19:26:34',10001,2224512),(13,NULL,1,NULL,10003,2226098),(14,NULL,2,NULL,10003,2226098),(15,NULL,3,NULL,10003,2226098),(16,NULL,1,NULL,10002,2221097),(17,NULL,2,NULL,10002,2221097),(18,'2024-01-25',1,'18:59:41',10001,2221097);
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookmarks`
--

DROP TABLE IF EXISTS `bookmarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookmarks` (
  `Bookmark_ID` int(11) NOT NULL,
  `Date_Bookmarked` date NOT NULL,
  `User_ID` int(11) DEFAULT NULL,
  `Event_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`Bookmark_ID`),
  KEY `UserID_Bookmarks_idx` (`User_ID`),
  KEY `EventID_Bookmarks_idx` (`Event_ID`),
  CONSTRAINT `EventID_Bookmarks` FOREIGN KEY (`Event_ID`) REFERENCES `events` (`Event_ID`),
  CONSTRAINT `UserID_Bookmarks` FOREIGN KEY (`User_ID`) REFERENCES `accounts` (`User_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookmarks`
--

LOCK TABLES `bookmarks` WRITE;
/*!40000 ALTER TABLE `bookmarks` DISABLE KEYS */;
INSERT INTO `bookmarks` VALUES (1000001,'2023-12-15',2212173,10006),(1000002,'2023-11-27',2223451,10003),(1000003,'2023-12-17',2224512,10008),(1000004,'2023-11-14',2223144,10001),(1000005,'2024-12-11',2221097,10010),(1000006,'2023-12-15',2226098,10007);
/*!40000 ALTER TABLE `bookmarks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluations`
--

DROP TABLE IF EXISTS `evaluations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evaluations` (
  `Evaluation_ID` int(11) NOT NULL,
  `isAccomplished` tinyint(4) NOT NULL DEFAULT 0,
  `Date_Accomplished` datetime DEFAULT NULL,
  `User_ID` int(11) NOT NULL,
  `Event_ID` int(11) NOT NULL,
  PRIMARY KEY (`Evaluation_ID`),
  KEY `UserID_Eval` (`User_ID`),
  KEY `EventID_Eval` (`Event_ID`),
  CONSTRAINT `EventID_Eval` FOREIGN KEY (`Event_ID`) REFERENCES `events` (`Event_ID`),
  CONSTRAINT `UserID_Eval` FOREIGN KEY (`User_ID`) REFERENCES `accounts` (`User_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluations`
--

LOCK TABLES `evaluations` WRITE;
/*!40000 ALTER TABLE `evaluations` DISABLE KEYS */;
/*!40000 ALTER TABLE `evaluations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventlinks`
--

DROP TABLE IF EXISTS `eventlinks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventlinks` (
  `Link_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Link_Name` varchar(255) DEFAULT NULL,
  `Weblink` varchar(255) DEFAULT NULL,
  `Event_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`Link_ID`),
  KEY `EventID_Links_idx` (`Event_ID`),
  CONSTRAINT `EventID_Links` FOREIGN KEY (`Event_ID`) REFERENCES `events` (`Event_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventlinks`
--

LOCK TABLES `eventlinks` WRITE;
/*!40000 ALTER TABLE `eventlinks` DISABLE KEYS */;
INSERT INTO `eventlinks` VALUES (1,'FB page','facebook.com/kindling.slu',10011);
/*!40000 ALTER TABLE `eventlinks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `Event_ID` int(11) NOT NULL,
  `Event_Name` varchar(255) NOT NULL,
  `Event_Tagline` varchar(255) DEFAULT NULL,
  `Event_Description` text DEFAULT NULL,
  `Event_StartDate` date DEFAULT NULL,
  `Event_EndDate` date DEFAULT NULL,
  `Event_Type` varchar(255) DEFAULT NULL,
  `isOpen` tinyint(4) DEFAULT 0,
  `isPublic` tinyint(4) DEFAULT 0,
  `isLive` tinyint(4) DEFAULT NULL,
  `Participants` int(11) DEFAULT 0,
  `Event_Pic` blob DEFAULT NULL,
  `Event_PicFilePath` varchar(255) DEFAULT NULL,
  `Evaluation_Link` text DEFAULT NULL,
  PRIMARY KEY (`Event_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (10001,'Academic Odessey: Exploring Minds','\"Navigating Knowledge, Exploring Minds\"','Embark on a journey through the realms of knowledge! Join us for a day filled with captivating lectures, interactive workshops, and thought-provoking discussions led by experts in various fields. Dive deep into the wonders of science, humanities, and technology, fostering curiosity and a thirst for learning.','2023-11-26','2023-11-26','OneTime',0,1,1,45,'','',''),(10002,'Cultural Mosaic Festival','\"Celebrate Diversity in Unity\"','Celebrate diversity and unity in our vibrant school community! Experience a colorful tapestry of traditions, music, dance, and cuisine from around the world. Engage in cultural exchanges, participate in interactive displays, and embrace the rich tapestry of global heritage that unites us all.','2023-11-28','2023-11-28','AM/PM',0,1,0,67,'','',''),(10003,'STEMpalooza: Innovation Showcase','\"Innovation Unleashed, Ideas Ignited\"','Unleash your inner innovator! Get ready for an exhilarating exhibition showcasing groundbreaking projects and cutting-edge technology. Dive into hands-on demonstrations, competitions, and presentations highlighting the wonders of science, technology, engineering, and mathematics. Explore, create, and inspire the future!','2023-11-30','2023-12-02','Series',1,1,1,59,'','',''),(10004,'\"Future of AI: Ethical Implications Summit','\"Shaping Tomorrow Responsibly\"',' Deliberate the ethical considerations shaping the future of artificial intelligence.','2023-12-10','2023-12-12','Series',0,1,0,95,'','',''),(10005,'Quantum Computing Conference ','\"Unveiling the Quantum Future\"','Delve into the revolutionary world of quantum computing. Engage with experts, witness demos, and explore the potential applications of quantum technologies.','2023-12-15','2023-12-15','AM/PM',1,0,1,63,'','',''),(10006,'Artificial Intelligence in Sports Analytics Symposium','\"Elevating Play with Intelligent Insights\"','Explore the transformative role of AI in redefining sports analytics and strategy.','2023-12-20','2023-12-20','OneTime',0,1,0,84,'','',''),(10007,'Sustainability Summit  ','\"Empowering Change, Sustaining Tomorrow\"','Explore innovative approaches to sustainability and environmental conservation. Join discussions, workshops, and presentations on green initiatives.','2023-12-28','2023-12-30','OneTime',1,1,1,52,'','',''),(10008,'HealthTech Expo   ','\"Revolutionizing Health, Empowering Lives\"','Discover the latest advancements in healthcare technology. Experience demos, attend seminars, and interact with pioneers in the HealthTech industry.','2023-12-29','2023-12-29','Series',1,1,1,61,'','',''),(10009,'Business Innovation Forum','\"Where Ideas Meet Impact\"','Foster creativity and strategize innovation in the business landscape. Engage in discussions, case studies, and workshops led by industry leaders.','2024-01-05','2024-01-07','OneTime',0,0,0,42,'','',''),(10010,'Music and Technology Conference','\"Harmony of Innovation and Sound\"','Explore the intersection of music and technology. Experience live demonstrations, discussions, and performances showcasing technological advancements in music.','2024-01-10','2024-01-12','AM/PM',1,1,1,76,'','',''),(10011,'Kinang','Gearing towards the Future with SLU','Lorem ipsum','2024-01-23','2024-01-23','OneTime',1,1,1,0,'','','kindling.slu.edu.ph/evaluation');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `onetime`
--

DROP TABLE IF EXISTS `onetime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onetime` (
  `Event_ID` int(11) NOT NULL,
  `Start_Time` time DEFAULT NULL,
  `End_Time` time DEFAULT NULL,
  `Venue` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Event_ID`),
  KEY `EventID_OneTime` (`Event_ID`),
  CONSTRAINT `EventID_OneTime` FOREIGN KEY (`Event_ID`) REFERENCES `events` (`Event_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onetime`
--

LOCK TABLES `onetime` WRITE;
/*!40000 ALTER TABLE `onetime` DISABLE KEYS */;
INSERT INTO `onetime` VALUES (10001,'09:00:00','16:00:00',NULL),(10006,'10:00:00','17:00:00',NULL),(10007,'11:30:00','18:30:00',NULL),(10009,'09:30:00','16:30:00',NULL),(10011,'15:30:00','17:30:00','Bakakeng AVR');
/*!40000 ALTER TABLE `onetime` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regisdetails`
--

DROP TABLE IF EXISTS `regisdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regisdetails` (
  `User_ID` int(11) NOT NULL,
  `Event_ID` int(11) NOT NULL,
  `QR_Code` longtext DEFAULT NULL,
  PRIMARY KEY (`User_ID`,`Event_ID`),
  KEY `EventID_RegisDetails_idx` (`Event_ID`),
  KEY `UserID_RegisDetails` (`User_ID`),
  CONSTRAINT `EventID_RegisDetails` FOREIGN KEY (`Event_ID`) REFERENCES `events` (`Event_ID`),
  CONSTRAINT `UserID_RegisDetails` FOREIGN KEY (`User_ID`) REFERENCES `accounts` (`User_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regisdetails`
--

LOCK TABLES `regisdetails` WRITE;
/*!40000 ALTER TABLE `regisdetails` DISABLE KEYS */;
INSERT INTO `regisdetails` VALUES (2212173,10001,NULL),(2221097,10002,NULL),(2224512,10001,NULL),(2226098,10003,NULL);
/*!40000 ALTER TABLE `regisdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registration`
--

DROP TABLE IF EXISTS `registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registration` (
  `Registration_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  `Course` varchar(255) NOT NULL,
  `School` varchar(45) DEFAULT NULL,
  `Role` varchar(45) DEFAULT NULL,
  `Organization` varchar(255) DEFAULT NULL,
  `Org_Position` varchar(255) DEFAULT NULL,
  `User_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`Registration_ID`),
  KEY `UserID_Registration` (`User_ID`),
  CONSTRAINT `UserID_Regis` FOREIGN KEY (`User_ID`) REFERENCES `accounts` (`User_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registration`
--

LOCK TABLES `registration` WRITE;
/*!40000 ALTER TABLE `registration` DISABLE KEYS */;
INSERT INTO `registration` VALUES (1,'Sofia Surro','BSCS 3','SAMCIS',NULL,NULL,NULL,2212173),(2,'Ava Narag','BSCS 3','SAMCIS',NULL,NULL,NULL,2224512),(3,'Geoff Dulnuan','BSCS 3','SAMCIS',NULL,NULL,NULL,2226098),(4,'Kaizer Gura','BSCS 3','SAMCIS',NULL,NULL,NULL,2221097);
/*!40000 ALTER TABLE `registration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `series`
--

DROP TABLE IF EXISTS `series`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `series` (
  `Event_ID` int(11) NOT NULL,
  `Series_Num` int(11) NOT NULL,
  `Series_Name` varchar(255) DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `Start_Time` time DEFAULT NULL,
  `End_Time` time DEFAULT NULL,
  `Venue` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Event_ID`,`Series_Num`),
  KEY `EventID_Series` (`Event_ID`),
  CONSTRAINT `Event_ID` FOREIGN KEY (`Event_ID`) REFERENCES `events` (`Event_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `series`
--

LOCK TABLES `series` WRITE;
/*!40000 ALTER TABLE `series` DISABLE KEYS */;
INSERT INTO `series` VALUES (10003,1,'Lorem 1','2023-11-30','10:00:00','12:00:00','Ipsum'),(10003,2,'Lorem 2','2023-12-01','13:00:00','14:00:00','Ipsum'),(10003,3,'Lorem 3','2023-12-02','15:00:00','16:00:00','Ipsum'),(10004,1,NULL,NULL,'09:30:00','11:30:00',NULL),(10004,2,NULL,NULL,'12:30:00','14:30:00',NULL),(10008,1,NULL,NULL,'10:00:00','12:00:00',NULL),(10008,2,NULL,NULL,'13:30:00','15:30:00',NULL),(10008,3,NULL,NULL,'16:30:00','18:30:00',NULL);
/*!40000 ALTER TABLE `series` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-26 16:14:33
