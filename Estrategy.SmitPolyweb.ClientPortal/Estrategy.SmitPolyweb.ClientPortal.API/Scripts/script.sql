-- MySqlBackup.NET 2.3.8.0
-- Dump Time: 2024-11-29 09:27:53
-- --------------------------------------
-- Server version 8.0.39 MySQL Community Server - GPL


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- 
-- Definition of __efmigrationshistory
-- 

DROP TABLE IF EXISTS `__efmigrationshistory`;
CREATE TABLE IF NOT EXISTS `__efmigrationshistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table __efmigrationshistory
-- 

/*!40000 ALTER TABLE `__efmigrationshistory` DISABLE KEYS */;
INSERT INTO `__efmigrationshistory`(`MigrationId`,`ProductVersion`) VALUES('20241111091802_initialMigration','8.0.10'),('20241111134454_Added unique','8.0.10'),('20241112130151_InspectionDateCertificate','8.0.10'),('20241113090936_UserAccountActiveBlocked','8.0.10'),('20241115104555_RemovePropList','8.0.10'),('20241118090331_AddedAllUniques','8.0.10'),('20241120142237_Added CertificateTicket','8.0.10'),('20241122080221_CertificateAddress','8.0.10'),('20241122114529_CustomerFaxNumber','8.0.10'),('20241125090138_PasswordHistoryExpirationDate','8.0.10'),('20241127074858_RemoveArticleTypeFromCertificate','8.0.10');
/*!40000 ALTER TABLE `__efmigrationshistory` ENABLE KEYS */;

-- 
-- Definition of addresses
-- 

DROP TABLE IF EXISTS `addresses`;
CREATE TABLE IF NOT EXISTS `addresses` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `StreetName` longtext NOT NULL,
  `HouseNumber` int NOT NULL,
  `Addition` longtext,
  `PostalCode` longtext NOT NULL,
  `City` longtext NOT NULL,
  `Country` longtext NOT NULL,
  `CreatedBy` int NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `ModifiedBy` int NOT NULL,
  `LastModified` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table addresses
-- 

/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses`(`ID`,`StreetName`,`HouseNumber`,`Addition`,`PostalCode`,`City`,`Country`,`CreatedBy`,`CreationDate`,`ModifiedBy`,`LastModified`) VALUES(1,'Boerkensleen',23,'b','4705RL','Roosendaal','Netherlands',1,'2024-11-28 13:27:23.634331',1,'2024-11-28 13:27:23.634331'),(2,'Westerdoksdijk',1,NULL,'1013AD','Amsterdam','Netherlands',1,'2024-11-28 13:27:23.634789',1,'2024-11-28 13:27:23.634789'),(3,'Jan van Lieshoutstraat',23,NULL,'5611EE','Eindhoven','Netherlands',1,'2024-11-28 13:27:23.634805',1,'2024-11-28 13:27:23.634805'),(4,'place Stanislas',151,'A','541002','Nancy','France',1,'2024-11-28 13:27:23.634806',1,'2024-11-28 13:27:23.634806'),(5,'Nijverheidstraat',15,NULL,'7511JM','Enschede','Netherlands',1,'2024-11-28 13:27:23.634810',1,'2024-11-28 13:27:23.634810'),(6,'Jan Ligthartlaan',125,NULL,'3312KG','Dordrecht','Netherlands',1,'2024-11-28 13:27:23.634810',1,'2024-11-28 13:27:23.634810'),(7,'Wolfskers',64,NULL,'Venray','5803LX','Netherlands',1,'2024-11-28 13:27:23.634811',1,'2024-11-28 13:27:23.634811'),(8,'Gingerslaan',153,NULL,'4464VA','Goes','Netherlands',1,'2024-11-28 13:27:23.634811',1,'2024-11-28 13:27:23.634811'),(9,'Vondellaan',81,NULL,'1401SB','Bussum','Netherlands',1,'2024-11-28 13:27:23.634812',1,'2024-11-28 13:27:23.634812'),(10,'Dominee Bartelsstraat',74,NULL,'7141ZW','Groenlo','Netherlands',1,'2024-11-28 13:27:23.634812',1,'2024-11-28 13:27:23.634812'),(11,'Nachtegaalweg',148,NULL,'8191XX','Wapenveld','Netherlands',1,'2024-11-28 13:27:23.634813',1,'2024-11-28 13:27:23.634813'),(12,'Johannes Daniël van Suurmondstraat',75,NULL,'4461GH','Dordrecht','Netherlands',1,'2024-11-28 13:27:23.634813',1,'2024-11-28 13:27:23.634813'),(13,'A.V.H. Destreelaan',7,NULL,'1834EC','Sint Pancras','Netherlands',1,'2024-11-28 13:27:23.634814',1,'2024-11-28 13:27:23.634814'),(14,'Trooststraat',146,NULL,'Den Haag','2525GP','Netherlands',1,'2024-11-28 13:27:23.634814',1,'2024-11-28 13:27:23.634814'),(15,'Hofstraat',23,NULL,'5801BJ','Venray','Netherlands',1,'2024-11-28 13:27:23.634815',1,'2024-11-28 13:27:23.634815');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;

-- 
-- Definition of articletypes
-- 

DROP TABLE IF EXISTS `articletypes`;
CREATE TABLE IF NOT EXISTS `articletypes` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` longtext NOT NULL,
  `StandardPrice` double NOT NULL,
  `CreatedBy` int NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `ModifiedBy` int NOT NULL,
  `LastModified` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table articletypes
-- 

/*!40000 ALTER TABLE `articletypes` DISABLE KEYS */;
INSERT INTO `articletypes`(`ID`,`Name`,`StandardPrice`,`CreatedBy`,`CreationDate`,`ModifiedBy`,`LastModified`) VALUES(1,'Hijsapparatuur',50.53,1,'2024-11-28 13:27:23.746215',1,'2024-11-28 13:27:23.746215'),(2,'Kettingwerk en haken',102.53,1,'2024-11-28 13:27:23.746421',1,'2024-11-28 13:27:23.746421'),(3,'ValBeveiliging',27623.73,1,'2024-11-28 13:27:23.746429',1,'2024-11-28 13:27:23.746429'),(4,'Sterkte',0,3,'2024-11-28 14:36:15.114549',3,'2024-11-28 14:37:36.762465');
/*!40000 ALTER TABLE `articletypes` ENABLE KEYS */;

-- 
-- Definition of articles
-- 

DROP TABLE IF EXISTS `articles`;
CREATE TABLE IF NOT EXISTS `articles` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ArticleNumber` varchar(255) NOT NULL,
  `Name` longtext NOT NULL,
  `Description` longtext,
  `ArticleTypeID` int NOT NULL,
  `CreatedBy` int NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `ModifiedBy` int NOT NULL,
  `LastModified` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `IX_Articles_ArticleNumber` (`ArticleNumber`),
  KEY `IX_Articles_ArticleTypeID` (`ArticleTypeID`),
  CONSTRAINT `FK_Articles_ArticleTypes_ArticleTypeID` FOREIGN KEY (`ArticleTypeID`) REFERENCES `articletypes` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table articles
-- 

/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles`(`ID`,`ArticleNumber`,`Name`,`Description`,`ArticleTypeID`,`CreatedBy`,`CreationDate`,`ModifiedBy`,`LastModified`) VALUES(1,'152638','Lewis handkettingtakel','Een handketting',1,1,'2024-11-28 13:27:23.746431',1,'2024-11-28 13:27:23.746431'),(2,'937460','Yale Handy','Een haak die zwaardere gewichten kan heffen.',2,1,'2024-11-28 13:27:23.746659',1,'2024-11-28 13:27:23.746659'),(3,'658204','Eller Balkenklem','Grote balk klem met verschillende opties in kleur',3,1,'2024-11-28 13:27:23.746668',1,'2024-11-28 13:27:23.746668'),(4,'test','test','test',4,3,'2024-11-28 14:27:41.215251',3,'2024-11-28 14:38:06.896298');
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;

-- 
-- Definition of certificatetypes
-- 

DROP TABLE IF EXISTS `certificatetypes`;
CREATE TABLE IF NOT EXISTS `certificatetypes` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` longtext,
  `Description` longtext,
  `CreatedBy` int NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `ModifiedBy` int NOT NULL,
  `LastModified` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table certificatetypes
-- 

/*!40000 ALTER TABLE `certificatetypes` DISABLE KEYS */;
INSERT INTO `certificatetypes`(`ID`,`Name`,`Description`,`CreatedBy`,`CreationDate`,`ModifiedBy`,`LastModified`) VALUES(1,'eindgebruiker','type certificaat voor eindgebruikers',1,'2024-11-28 13:27:23.746669',1,'2024-11-28 13:27:23.746669'),(2,'tussenhandel','Type certificaat voor tussenhandel',1,'2024-11-28 13:27:23.746852',1,'2024-11-28 13:27:23.746852');
/*!40000 ALTER TABLE `certificatetypes` ENABLE KEYS */;

-- 
-- Definition of checklists
-- 

DROP TABLE IF EXISTS `checklists`;
CREATE TABLE IF NOT EXISTS `checklists` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` longtext NOT NULL,
  `ChecklistFieldIDs` longtext NOT NULL,
  `ChecklistPropertyIDs` longtext NOT NULL,
  `CreatedBy` int NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `ModifiedBy` int NOT NULL,
  `LastModified` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table checklists
-- 

/*!40000 ALTER TABLE `checklists` DISABLE KEYS */;
INSERT INTO `checklists`(`ID`,`Name`,`ChecklistFieldIDs`,`ChecklistPropertyIDs`,`CreatedBy`,`CreationDate`,`ModifiedBy`,`LastModified`) VALUES(1,'Article checker','[1,2,3]','[1]',1,'2024-11-28 13:27:23.634816',1,'2024-11-28 13:27:23.634816');
/*!40000 ALTER TABLE `checklists` ENABLE KEYS */;

-- 
-- Definition of checklistfields
-- 

DROP TABLE IF EXISTS `checklistfields`;
CREATE TABLE IF NOT EXISTS `checklistfields` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` longtext NOT NULL,
  `Checked` tinyint(1) NOT NULL,
  `CreatedBy` int NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `ModifiedBy` int NOT NULL,
  `LastModified` datetime(6) NOT NULL,
  `ChecklistID` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `IX_ChecklistFields_ChecklistID` (`ChecklistID`),
  CONSTRAINT `FK_ChecklistFields_Checklists_ChecklistID` FOREIGN KEY (`ChecklistID`) REFERENCES `checklists` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table checklistfields
-- 

/*!40000 ALTER TABLE `checklistfields` DISABLE KEYS */;
INSERT INTO `checklistfields`(`ID`,`Name`,`Checked`,`CreatedBy`,`CreationDate`,`ModifiedBy`,`LastModified`,`ChecklistID`) VALUES(1,'Checked on Location',0,1,'2024-11-28 13:27:23.745985',1,'2024-11-28 13:27:23.745985',NULL),(2,'Safety check',1,1,'2024-11-28 13:27:23.746205',1,'2024-11-28 13:27:23.746205',NULL),(3,'Quality check',0,1,'2024-11-28 13:27:23.746214',1,'2024-11-28 13:27:23.746214',NULL);
/*!40000 ALTER TABLE `checklistfields` ENABLE KEYS */;

-- 
-- Definition of logos
-- 

DROP TABLE IF EXISTS `logos`;
CREATE TABLE IF NOT EXISTS `logos` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `FileName` longtext NOT NULL,
  `FileDescription` longtext,
  `FileExtension` longtext,
  `FileSizeInBytes` bigint NOT NULL,
  `FilePath` longtext,
  `CreatedBy` int NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `ModifiedBy` int NOT NULL,
  `LastModified` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table logos
-- 

/*!40000 ALTER TABLE `logos` DISABLE KEYS */;

/*!40000 ALTER TABLE `logos` ENABLE KEYS */;

-- 
-- Definition of customers
-- 

DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(255) NOT NULL,
  `DebtorNumber` longtext NOT NULL,
  `SearchName` longtext NOT NULL,
  `CustomerName` longtext NOT NULL,
  `PhoneNumber` longtext NOT NULL,
  `FaxNumber` longtext,
  `CertificateEmailSettings` int NOT NULL,
  `CertificateExpirationReminder` int NOT NULL,
  `SalePercentage` int NOT NULL,
  `LogoID` int DEFAULT NULL,
  `AddressID` int NOT NULL,
  `CreatedBy` int NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `ModifiedBy` int NOT NULL,
  `LastModified` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `IX_Customers_Email` (`Email`),
  KEY `IX_Customers_AddressID` (`AddressID`),
  KEY `IX_Customers_LogoID` (`LogoID`),
  CONSTRAINT `FK_Customers_Addresses_AddressID` FOREIGN KEY (`AddressID`) REFERENCES `addresses` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_Customers_Logos_LogoID` FOREIGN KEY (`LogoID`) REFERENCES `logos` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table customers
-- 

/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers`(`ID`,`Email`,`DebtorNumber`,`SearchName`,`CustomerName`,`PhoneNumber`,`FaxNumber`,`CertificateEmailSettings`,`CertificateExpirationReminder`,`SalePercentage`,`LogoID`,`AddressID`,`CreatedBy`,`CreationDate`,`ModifiedBy`,`LastModified`) VALUES(1,'home@gmail.com','12ve','HomeCompany','HomerThuisbedrijflocatieAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA','1234567890','123456fe436egr450',1,1,0,NULL,3,1,'2024-11-28 13:27:23.745587',1,'2024-11-28 13:27:23.745587'),(2,'matsbv@outlook.com','3436jegi','Mats','Mats','347635734','34gmp36jipjfpin43',2,2,0,NULL,1,1,'2024-11-28 13:27:23.745951',1,'2024-11-28 13:27:23.745951'),(3,'farmer@gmail.com','hbtrrt5464','FarmerTrucks','Farmer','75454365437','34643gdrg43dg4t',1,1,0,NULL,2,1,'2024-11-28 13:27:23.745977',1,'2024-11-28 13:27:23.745977'),(4,'farmer1@gmail.com','hbtrrt5464','FarmerTrucks','Farmer','75454365437','34643gdrg43dg4t',1,1,0,NULL,2,1,'2024-11-28 13:27:23.745978',1,'2024-11-28 13:27:23.745978'),(5,'farmer2@gmail.com','hbtrrt5464','FarmerTrucks','Farmer','75454365437','34643gdrg43dg4t',1,1,0,NULL,2,1,'2024-11-28 13:27:23.745979',1,'2024-11-28 13:27:23.745979'),(6,'farmer3@gmail.com','hbtrrt5464','FarmerTrucks','Farmer','75454365437','34643gdrg43dg4t',1,1,0,NULL,2,1,'2024-11-28 13:27:23.745979',1,'2024-11-28 13:27:23.745979'),(7,'farmer4@gmail.com','hbtrrt5464','FarmerTrucks','Farmer','75454365437','34643gdrg43dg4t',1,1,0,NULL,2,1,'2024-11-28 13:27:23.745979',1,'2024-11-28 13:27:23.745979'),(8,'farmer5@gmail.com','hbtrrt5464','FarmerTrucks','Farmer','75454365437','34643gdrg43dg4t',1,1,0,NULL,2,1,'2024-11-28 13:27:23.745980',1,'2024-11-28 13:27:23.745980'),(9,'farmer6@gmail.com','hbtrrt5464','FarmerTrucks','Farmer','75454365437','34643gdrg43dg4t',1,1,0,NULL,2,1,'2024-11-28 13:27:23.745981',1,'2024-11-28 13:27:23.745981'),(10,'farmer7@gmail.com','hbtrrt5464','FarmerTrucks','Farmer','75454365437','34643gdrg43dg4t',1,1,0,NULL,2,1,'2024-11-28 13:27:23.745981',1,'2024-11-28 13:27:23.745981'),(11,'farmer8@gmail.com','hbtrrt5464','FarmerTrucks','Farmer','75454365437','34643gdrg43dg4t',1,1,0,NULL,2,1,'2024-11-28 13:27:23.745981',1,'2024-11-28 13:27:23.745981'),(12,'farmer9@gmail.com','hbtrrt5464','FarmerTrucks','Farmer','75454365437','34643gdrg43dg4t',1,1,0,NULL,2,1,'2024-11-28 13:27:23.745982',1,'2024-11-28 13:27:23.745982'),(13,'farmer10@gmail.com','hbtrrt5464','FarmerTrucks','Farmer','75454365437','34643gdrg43dg4t',1,1,0,NULL,2,1,'2024-11-28 13:27:23.745983',1,'2024-11-28 13:27:23.745983'),(14,'farmer11@gmail.com','hbtrrt5464','FarmerTrucks','Farmer','75454365437','34643gdrg43dg4t',1,1,0,NULL,2,1,'2024-11-28 13:27:23.745983',1,'2024-11-28 13:27:23.745983'),(15,'farmer12@gmail.com','hbtrrt5464','FarmerTrucks','Farmer','75454365437','34643gdrg43dg4t',1,1,0,NULL,2,1,'2024-11-28 13:27:23.745983',1,'2024-11-28 13:27:23.745983'),(16,'farmer13@gmail.com','hbtrrt5464','FarmerTrucks','Farmer','75454365437','34643gdrg43dg4t',1,1,0,NULL,2,1,'2024-11-28 13:27:23.745984',1,'2024-11-28 13:27:23.745984'),(17,'farmer14@gmail.com','hbtrrt5464','FarmerTrucks','Farmer','75454365437','34643gdrg43dg4t',1,1,0,NULL,2,1,'2024-11-28 13:27:23.745984',1,'2024-11-28 13:27:23.745984');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;

-- 
-- Definition of properties
-- 

DROP TABLE IF EXISTS `properties`;
CREATE TABLE IF NOT EXISTS `properties` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` longtext NOT NULL,
  `EnglishName` longtext NOT NULL,
  `PropertyName` longtext NOT NULL,
  `FieldType` int NOT NULL,
  `CreatedBy` int NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `ModifiedBy` int NOT NULL,
  `LastModified` datetime(6) NOT NULL,
  `ChecklistID` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `IX_Properties_ChecklistID` (`ChecklistID`),
  CONSTRAINT `FK_Properties_Checklists_ChecklistID` FOREIGN KEY (`ChecklistID`) REFERENCES `checklists` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table properties
-- 

/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties`(`ID`,`Name`,`EnglishName`,`PropertyName`,`FieldType`,`CreatedBy`,`CreationDate`,`ModifiedBy`,`LastModified`,`ChecklistID`) VALUES(1,'Lengte','length','Lengte precies',1,1,'2024-11-28 13:27:23.634020',1,'2024-11-28 13:27:23.634020',NULL),(2,'gewicht','weight','gewicht precies',2,1,'2024-11-28 13:27:23.634301',1,'2024-11-28 13:27:23.634301',NULL),(3,'hoogte','height','hoogte precies',3,1,'2024-11-28 13:27:23.634330',1,'2024-11-28 13:27:23.634330',NULL),(4,'Breekkracht','Breakingforce','Breekkracht',1,3,'2024-11-28 14:36:56.460311',3,'2024-11-28 14:36:56.460311',NULL),(5,'Gebruiksfactor','Usefactor','Gebruiksfactor',1,3,'2024-11-28 14:37:19.662528',3,'2024-11-28 14:37:19.662528',NULL);
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;

-- 
-- Definition of articletypeproperties
-- 

DROP TABLE IF EXISTS `articletypeproperties`;
CREATE TABLE IF NOT EXISTS `articletypeproperties` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Required` tinyint(1) NOT NULL,
  `Visable` tinyint(1) NOT NULL,
  `ArticletypeID` int NOT NULL,
  `PropertyID` int NOT NULL,
  `CreatedBy` int NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `ModifiedBy` int NOT NULL,
  `LastModified` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `IX_ArticleTypeProperties_ArticletypeID` (`ArticletypeID`),
  KEY `IX_ArticleTypeProperties_PropertyID` (`PropertyID`),
  CONSTRAINT `FK_ArticleTypeProperties_ArticleTypes_ArticletypeID` FOREIGN KEY (`ArticletypeID`) REFERENCES `articletypes` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_ArticleTypeProperties_Properties_PropertyID` FOREIGN KEY (`PropertyID`) REFERENCES `properties` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table articletypeproperties
-- 

/*!40000 ALTER TABLE `articletypeproperties` DISABLE KEYS */;
INSERT INTO `articletypeproperties`(`ID`,`Required`,`Visable`,`ArticletypeID`,`PropertyID`,`CreatedBy`,`CreationDate`,`ModifiedBy`,`LastModified`) VALUES(1,1,1,4,4,3,'2024-11-28 14:37:27.532100',3,'2024-11-28 14:37:36.938722'),(2,0,1,4,5,3,'2024-11-28 14:37:28.747366',3,'2024-11-28 14:37:36.954416');
/*!40000 ALTER TABLE `articletypeproperties` ENABLE KEYS */;

-- 
-- Definition of certificateproperties
-- 

DROP TABLE IF EXISTS `certificateproperties`;
CREATE TABLE IF NOT EXISTS `certificateproperties` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Value` longtext,
  `CertificateID` int NOT NULL,
  `PropertyID` int NOT NULL,
  `CreatedBy` int NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `ModifiedBy` int NOT NULL,
  `LastModified` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `IX_CertificateProperties_CertificateID` (`CertificateID`),
  KEY `IX_CertificateProperties_PropertyID` (`PropertyID`),
  CONSTRAINT `FK_CertificateProperties_Certificates_CertificateID` FOREIGN KEY (`CertificateID`) REFERENCES `certificates` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_CertificateProperties_Properties_PropertyID` FOREIGN KEY (`PropertyID`) REFERENCES `properties` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table certificateproperties
-- 

/*!40000 ALTER TABLE `certificateproperties` DISABLE KEYS */;

/*!40000 ALTER TABLE `certificateproperties` ENABLE KEYS */;

-- 
-- Definition of propertychoises
-- 

DROP TABLE IF EXISTS `propertychoises`;
CREATE TABLE IF NOT EXISTS `propertychoises` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Value` longtext NOT NULL,
  `PropertyID` int NOT NULL,
  `CreatedBy` int NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `ModifiedBy` int NOT NULL,
  `LastModified` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `IX_PropertyChoises_PropertyID` (`PropertyID`),
  CONSTRAINT `FK_PropertyChoises_Properties_PropertyID` FOREIGN KEY (`PropertyID`) REFERENCES `properties` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table propertychoises
-- 

/*!40000 ALTER TABLE `propertychoises` DISABLE KEYS */;

/*!40000 ALTER TABLE `propertychoises` ENABLE KEYS */;

-- 
-- Definition of refreshtokens
-- 

DROP TABLE IF EXISTS `refreshtokens`;
CREATE TABLE IF NOT EXISTS `refreshtokens` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `OwnerID` int NOT NULL,
  `RefreshTokenValue` longtext NOT NULL,
  `TokenID` int DEFAULT NULL,
  `ValidUntill` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table refreshtokens
-- 

/*!40000 ALTER TABLE `refreshtokens` DISABLE KEYS */;
INSERT INTO `refreshtokens`(`ID`,`OwnerID`,`RefreshTokenValue`,`TokenID`,`ValidUntill`) VALUES(1,3,'B8DeVqvA8ipDihDitk1EHapbuJYAWWzK4oDeB0cuLGI=',NULL,'2024-12-05 14:22:43.629418'),(2,3,'VhilgLlS1HBEiKLQSFgyHkcuMz906gfuaLzfZoh9T5Q=',NULL,'2024-12-05 15:14:18.247683'),(3,3,'l+GfCNFak3wmDd7/7/LXXR9xghYuoU+pjX/CqnUPTmo=',NULL,'2024-12-05 15:49:56.349584'),(4,3,'yfFqxez3ZUonxus6gomKiQ6eEBoIYEwOxEW1aIzbOT0=',NULL,'2024-12-05 16:42:01.611618'),(5,3,'WWTrPfSxIiMjfOSV3A9uZzYXvw0Oqg6LSP/RY8VLm7I=',NULL,'2024-12-06 09:25:41.311871');
/*!40000 ALTER TABLE `refreshtokens` ENABLE KEYS */;

-- 
-- Definition of roles
-- 

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Permissions` longtext NOT NULL,
  `CreatedBy` int NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `ModifiedBy` int NOT NULL,
  `LastModified` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `IX_Roles_Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table roles
-- 

/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles`(`ID`,`Name`,`Permissions`,`CreatedBy`,`CreationDate`,`ModifiedBy`,`LastModified`) VALUES(1,'Admin','[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]',1,'2024-11-28 13:27:23.635311',1,'2024-11-28 13:27:23.635311'),(2,'Customer','[4,19,20,12,8,21]',1,'2024-11-28 13:27:23.635509',1,'2024-11-28 13:27:23.635509'),(3,'CustomerRead','[4,21]',1,'2024-11-28 13:27:23.635525',1,'2024-11-28 13:27:23.635525'),(4,'Mechanic','[16,17,4,5,2,8,14,0,1,10,21]',1,'2024-11-28 13:27:23.635525',1,'2024-11-28 13:27:23.635525');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;

-- 
-- Definition of suppliers
-- 

DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE IF NOT EXISTS `suppliers` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` longtext NOT NULL,
  `AddressID` int NOT NULL,
  `CreatedBy` int NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `ModifiedBy` int NOT NULL,
  `LastModified` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `IX_Suppliers_AddressID` (`AddressID`),
  CONSTRAINT `FK_Suppliers_Addresses_AddressID` FOREIGN KEY (`AddressID`) REFERENCES `addresses` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table suppliers
-- 

/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers`(`ID`,`Name`,`AddressID`,`CreatedBy`,`CreationDate`,`ModifiedBy`,`LastModified`) VALUES(1,'Smit Polyweb',1,1,'2024-11-28 13:27:23.635076',1,'2024-11-28 13:27:23.635076'),(2,'Rayen Elmira',2,1,'2024-11-28 13:27:23.635299',1,'2024-11-28 13:27:23.635299'),(3,'Piet van Doren',3,1,'2024-11-28 13:27:23.635310',1,'2024-11-28 13:27:23.635310'),(4,'Bo Rob',4,1,'2024-11-28 13:27:23.635310',1,'2024-11-28 13:27:23.635310');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;

-- 
-- Definition of certificates
-- 

DROP TABLE IF EXISTS `certificates`;
CREATE TABLE IF NOT EXISTS `certificates` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `RegistrationNumber` int NOT NULL,
  `CertificateTypeID` int NOT NULL,
  `CustomerID` int NOT NULL,
  `SupplierID` int NOT NULL,
  `ArticleID` int NOT NULL,
  `CustomerSearchName` longtext,
  `Description` longtext,
  `WorkType` longtext NOT NULL,
  `SupplyDate` datetime(6) NOT NULL,
  `ExtraInfo` longtext,
  `DebtorNumber` longtext NOT NULL,
  `ExpirationDate` datetime(6) NOT NULL,
  `CustomerReferenceNumber` longtext NOT NULL,
  `Status` int NOT NULL,
  `CreatedBy` int NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `ModifiedBy` int NOT NULL,
  `LastModified` datetime(6) NOT NULL,
  `DateOfInspection` datetime(6) DEFAULT NULL,
  `CustomerAddressID` int DEFAULT NULL,
  `SupplierAddressID` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `IX_Certificates_RegistrationNumber` (`RegistrationNumber`),
  KEY `IX_Certificates_ArticleID` (`ArticleID`),
  KEY `IX_Certificates_CertificateTypeID` (`CertificateTypeID`),
  KEY `IX_Certificates_CustomerID` (`CustomerID`),
  KEY `IX_Certificates_SupplierID` (`SupplierID`),
  KEY `IX_Certificates_CustomerAddressID` (`CustomerAddressID`),
  KEY `IX_Certificates_SupplierAddressID` (`SupplierAddressID`),
  CONSTRAINT `FK_Certificates_Addresses_CustomerAddressID` FOREIGN KEY (`CustomerAddressID`) REFERENCES `addresses` (`ID`),
  CONSTRAINT `FK_Certificates_Addresses_SupplierAddressID` FOREIGN KEY (`SupplierAddressID`) REFERENCES `addresses` (`ID`),
  CONSTRAINT `FK_Certificates_Articles_ArticleID` FOREIGN KEY (`ArticleID`) REFERENCES `articles` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_Certificates_CertificateTypes_CertificateTypeID` FOREIGN KEY (`CertificateTypeID`) REFERENCES `certificatetypes` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_Certificates_Customers_CustomerID` FOREIGN KEY (`CustomerID`) REFERENCES `customers` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_Certificates_Suppliers_SupplierID` FOREIGN KEY (`SupplierID`) REFERENCES `suppliers` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table certificates
-- 

/*!40000 ALTER TABLE `certificates` DISABLE KEYS */;
INSERT INTO `certificates`(`ID`,`RegistrationNumber`,`CertificateTypeID`,`CustomerID`,`SupplierID`,`ArticleID`,`CustomerSearchName`,`Description`,`WorkType`,`SupplyDate`,`ExtraInfo`,`DebtorNumber`,`ExpirationDate`,`CustomerReferenceNumber`,`Status`,`CreatedBy`,`CreationDate`,`ModifiedBy`,`LastModified`,`DateOfInspection`,`CustomerAddressID`,`SupplierAddressID`) VALUES(1,152624,1,1,1,2,'Homer','Trekhaak','Inspect','2024-09-15 13:27:22.914900','0112','12ve','2024-12-03 13:27:22.914941','655326',0,1,'2024-11-28 13:27:23.746861',1,'2024-11-28 13:27:23.746861','2024-11-28 13:27:22.914941',1,1),(2,932543,2,2,1,3,'Polyweb','Oogbout','reUse','2019-09-13 13:27:22.915751','0112','3436jegi','2025-01-07 13:27:22.915762','934573',0,1,'2024-11-28 13:27:23.747054',1,'2024-11-28 13:27:23.747054','2024-09-03 13:27:22.915762',1,1),(3,456434,1,3,1,2,'Klant123','Takel','InspectAndTest','2024-11-25 13:27:22.915766','0112','hbtrrt5464','2029-07-19 13:27:22.915766','940183',0,1,'2024-11-28 13:27:23.747063',1,'2024-11-28 13:27:23.747063','2014-07-17 13:27:22.915766',1,1);
/*!40000 ALTER TABLE `certificates` ENABLE KEYS */;

-- 
-- Definition of tokens
-- 

DROP TABLE IF EXISTS `tokens`;
CREATE TABLE IF NOT EXISTS `tokens` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `TokenValue` longtext NOT NULL,
  `RefreshTokenID` int NOT NULL,
  `ValidUntill` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `IX_Tokens_RefreshTokenID` (`RefreshTokenID`),
  CONSTRAINT `FK_Tokens_RefreshTokens_RefreshTokenID` FOREIGN KEY (`RefreshTokenID`) REFERENCES `refreshtokens` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table tokens
-- 

/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
INSERT INTO `tokens`(`ID`,`TokenValue`,`RefreshTokenID`,`ValidUntill`) VALUES(1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzdGFnZW1haWxAZXhhbXBsZS5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOlsiQWRkcmVzc1JlYWQiLCJBZGRyZXNzV3JpdGUiLCJBcnRpY2xlUmVhZCIsIkFydGljbGVXcml0ZSIsIkNlcnRpZmljYXRlUmVhZCIsIkNlcnRpZmljYXRlV3JpdGUiLCJDaGVja2xpc3RSZWFkIiwiQ2hlY2tsaXN0V3JpdGUiLCJDdXN0b21lclJlYWQiLCJDdXN0b21lcldyaXRlIiwiUHJvcGVydHlSZWFkIiwiUHJvcGVydHlXcml0ZSIsIlJvbGVSZWFkIiwiUm9sZVdyaXRlIiwiU3VwcGxpZXJSZWFkIiwiU3VwcGxpZXJXcml0ZSIsIlRpY2tldFJlYWQiLCJUaWNrZXRXcml0ZSIsIkltYWdlVXBsb2FkIiwiVXNlclJlYWQiLCJVc2VyV3JpdGUiLCJVcGRhdGVQYXNzd29yZCJdLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZ2l2ZW5uYW1lIjoiQWRtaW4iLCJleHAiOjE3MzI4MDM3NjMsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcxMDcvIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzEwNy8ifQ.Rv7t3p6jXOGfz9xBfUXgb7hi7PRlzExrF_gyxJ0C5CU',1,'2024-11-28 15:22:43.700222'),(2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzdGFnZW1haWxAZXhhbXBsZS5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOlsiQWRkcmVzc1JlYWQiLCJBZGRyZXNzV3JpdGUiLCJBcnRpY2xlUmVhZCIsIkFydGljbGVXcml0ZSIsIkNlcnRpZmljYXRlUmVhZCIsIkNlcnRpZmljYXRlV3JpdGUiLCJDaGVja2xpc3RSZWFkIiwiQ2hlY2tsaXN0V3JpdGUiLCJDdXN0b21lclJlYWQiLCJDdXN0b21lcldyaXRlIiwiUHJvcGVydHlSZWFkIiwiUHJvcGVydHlXcml0ZSIsIlJvbGVSZWFkIiwiUm9sZVdyaXRlIiwiU3VwcGxpZXJSZWFkIiwiU3VwcGxpZXJXcml0ZSIsIlRpY2tldFJlYWQiLCJUaWNrZXRXcml0ZSIsIkltYWdlVXBsb2FkIiwiVXNlclJlYWQiLCJVc2VyV3JpdGUiLCJVcGRhdGVQYXNzd29yZCJdLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZ2l2ZW5uYW1lIjoiQWRtaW4iLCJleHAiOjE3MzI4MDY4NTgsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcxMDcvIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzEwNy8ifQ.-K_YVCZNI8LC2hp8K9LxfUTl3xJk_7Tt-Esv9bqbScA',2,'2024-11-28 16:14:18.274829'),(3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzdGFnZW1haWxAZXhhbXBsZS5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOlsiQWRkcmVzc1JlYWQiLCJBZGRyZXNzV3JpdGUiLCJBcnRpY2xlUmVhZCIsIkFydGljbGVXcml0ZSIsIkNlcnRpZmljYXRlUmVhZCIsIkNlcnRpZmljYXRlV3JpdGUiLCJDaGVja2xpc3RSZWFkIiwiQ2hlY2tsaXN0V3JpdGUiLCJDdXN0b21lclJlYWQiLCJDdXN0b21lcldyaXRlIiwiUHJvcGVydHlSZWFkIiwiUHJvcGVydHlXcml0ZSIsIlJvbGVSZWFkIiwiUm9sZVdyaXRlIiwiU3VwcGxpZXJSZWFkIiwiU3VwcGxpZXJXcml0ZSIsIlRpY2tldFJlYWQiLCJUaWNrZXRXcml0ZSIsIkltYWdlVXBsb2FkIiwiVXNlclJlYWQiLCJVc2VyV3JpdGUiLCJVcGRhdGVQYXNzd29yZCJdLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZ2l2ZW5uYW1lIjoiQWRtaW4iLCJleHAiOjE3MzI4MDg5OTksImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcxMDcvIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzEwNy8ifQ.W3N6mfzIJY9J2lZ9G9gFKdeludX1VxXGx1rP-oRaBQU',3,'2024-11-28 16:49:59.135952'),(4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzdGFnZW1haWxAZXhhbXBsZS5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOlsiQWRkcmVzc1JlYWQiLCJBZGRyZXNzV3JpdGUiLCJBcnRpY2xlUmVhZCIsIkFydGljbGVXcml0ZSIsIkNlcnRpZmljYXRlUmVhZCIsIkNlcnRpZmljYXRlV3JpdGUiLCJDaGVja2xpc3RSZWFkIiwiQ2hlY2tsaXN0V3JpdGUiLCJDdXN0b21lclJlYWQiLCJDdXN0b21lcldyaXRlIiwiUHJvcGVydHlSZWFkIiwiUHJvcGVydHlXcml0ZSIsIlJvbGVSZWFkIiwiUm9sZVdyaXRlIiwiU3VwcGxpZXJSZWFkIiwiU3VwcGxpZXJXcml0ZSIsIlRpY2tldFJlYWQiLCJUaWNrZXRXcml0ZSIsIkltYWdlVXBsb2FkIiwiVXNlclJlYWQiLCJVc2VyV3JpdGUiLCJVcGRhdGVQYXNzd29yZCJdLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZ2l2ZW5uYW1lIjoiQWRtaW4iLCJleHAiOjE3MzI4MTIxMjIsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcxMDcvIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzEwNy8ifQ.jkIXaCLfX3N_nYpBeY5AlSJgJ3RkrdET36vd0k87FJ0',4,'2024-11-28 17:42:02.178362'),(5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzdGFnZW1haWxAZXhhbXBsZS5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOlsiQWRkcmVzc1JlYWQiLCJBZGRyZXNzV3JpdGUiLCJBcnRpY2xlUmVhZCIsIkFydGljbGVXcml0ZSIsIkNlcnRpZmljYXRlUmVhZCIsIkNlcnRpZmljYXRlV3JpdGUiLCJDaGVja2xpc3RSZWFkIiwiQ2hlY2tsaXN0V3JpdGUiLCJDdXN0b21lclJlYWQiLCJDdXN0b21lcldyaXRlIiwiUHJvcGVydHlSZWFkIiwiUHJvcGVydHlXcml0ZSIsIlJvbGVSZWFkIiwiUm9sZVdyaXRlIiwiU3VwcGxpZXJSZWFkIiwiU3VwcGxpZXJXcml0ZSIsIlRpY2tldFJlYWQiLCJUaWNrZXRXcml0ZSIsIkltYWdlVXBsb2FkIiwiVXNlclJlYWQiLCJVc2VyV3JpdGUiLCJVcGRhdGVQYXNzd29yZCJdLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZ2l2ZW5uYW1lIjoiQWRtaW4iLCJleHAiOjE3MzI4NzIzNDEsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcxMDcvIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzEwNy8ifQ.aPKswF5Xgf797O91hR0orzsw1ItEjTAxDgIrihceHhA',5,'2024-11-29 10:25:41.806193');
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;

-- 
-- Definition of users
-- 

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(255) NOT NULL,
  `Password` longtext NOT NULL,
  `PasswordHashType` int NOT NULL,
  `FirstName` longtext NOT NULL,
  `Infix` longtext,
  `LastName` longtext NOT NULL,
  `RoleID` int NOT NULL,
  `RefreshTokenID` int DEFAULT NULL,
  `CustomerID` int DEFAULT NULL,
  `CreatedBy` int NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `ModifiedBy` int NOT NULL,
  `LastModified` datetime(6) NOT NULL,
  `AccountActive` tinyint(1) NOT NULL DEFAULT '0',
  `AccountBlocked` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `IX_Users_Email` (`Email`),
  UNIQUE KEY `IX_Users_RefreshTokenID` (`RefreshTokenID`),
  KEY `IX_Users_CustomerID` (`CustomerID`),
  KEY `IX_Users_RoleID` (`RoleID`),
  CONSTRAINT `FK_Users_Customers_CustomerID` FOREIGN KEY (`CustomerID`) REFERENCES `customers` (`ID`),
  CONSTRAINT `FK_Users_RefreshTokens_RefreshTokenID` FOREIGN KEY (`RefreshTokenID`) REFERENCES `refreshtokens` (`ID`),
  CONSTRAINT `FK_Users_Roles_RoleID` FOREIGN KEY (`RoleID`) REFERENCES `roles` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table users
-- 

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users`(`ID`,`Email`,`Password`,`PasswordHashType`,`FirstName`,`Infix`,`LastName`,`RoleID`,`RefreshTokenID`,`CustomerID`,`CreatedBy`,`CreationDate`,`ModifiedBy`,`LastModified`,`AccountActive`,`AccountBlocked`) VALUES(1,'gerard@gmail.com','F453A475BBB20EEB61CEC5722240B8E32E7C5FB7F343AD4AFB4BA0D0A7A86619',1,'Gerard','De','Lange',1,NULL,NULL,1,'2024-11-28 13:27:23.635526',1,'2024-11-28 13:27:23.635526',1,0),(2,'customer@gmail.com','DD756E0C843E5CBBC888BA96B3972BF673368DD94FC073ECA9A27B38FA9BB7EE',1,'Piet',NULL,'Herder',2,NULL,1,1,'2024-11-28 13:27:23.658786',1,'2024-11-28 13:27:23.658786',1,0),(3,'stagemail@example.com','4AA7A48E0D2559DED4AB4B4F39DBD89D4EFA983F2C2BEFAAB9C0633F9A92D631',1,'Elize','De','Boer',1,5,NULL,1,'2024-11-28 13:27:23.679933',1,'2024-11-28 13:27:23.679933',1,0),(4,'customerread@gmail.com','3F8003EE820E1E19497C9520079083D2C846F4E263C18A17B7F5DB4AC45D127E',1,'Piet',NULL,'Herder',3,NULL,2,1,'2024-11-28 13:27:23.700760',1,'2024-11-28 13:27:23.700760',1,0),(5,'mechanic@gmail.com','139BAAD7FA26491BED735FC1141C38BCB0AA8542AF526769E77416B23BB6D58F',1,'Piet',NULL,'Herder',4,NULL,NULL,1,'2024-11-28 13:27:23.723401',1,'2024-11-28 13:27:23.723401',1,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

-- 
-- Definition of passwordhistories
-- 

DROP TABLE IF EXISTS `passwordhistories`;
CREATE TABLE IF NOT EXISTS `passwordhistories` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `OldPasswordHash` longtext NOT NULL,
  `ActivationDate` datetime(6) NOT NULL,
  `UserID` int NOT NULL,
  `CreatedBy` int NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `ModifiedBy` int NOT NULL,
  `LastModified` datetime(6) NOT NULL,
  `ExpirationDate` datetime(6) NOT NULL DEFAULT '0001-01-01 00:00:00.000000',
  PRIMARY KEY (`ID`),
  KEY `IX_PasswordHistories_UserID` (`UserID`),
  CONSTRAINT `FK_PasswordHistories_Users_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table passwordhistories
-- 

/*!40000 ALTER TABLE `passwordhistories` DISABLE KEYS */;
INSERT INTO `passwordhistories`(`ID`,`OldPasswordHash`,`ActivationDate`,`UserID`,`CreatedBy`,`CreationDate`,`ModifiedBy`,`LastModified`,`ExpirationDate`) VALUES(1,'F453A475BBB20EEB61CEC5722240B8E32E7C5FB7F343AD4AFB4BA0D0A7A86619','2024-11-28 13:27:23.658425',1,1,'2024-11-28 13:27:23.658425',1,'2024-11-28 13:27:23.658425','2025-02-28 13:27:23.658425'),(2,'4AA7A48E0D2559DED4AB4B4F39DBD89D4EFA983F2C2BEFAAB9C0633F9A92D631','2024-11-28 13:27:23.700752',3,1,'2024-11-28 13:27:23.700752',1,'2024-11-28 13:27:23.700752','2025-02-28 13:27:23.700752'),(3,'139BAAD7FA26491BED735FC1141C38BCB0AA8542AF526769E77416B23BB6D58F','2024-11-28 13:27:23.745580',5,1,'2024-11-28 13:27:23.745580',1,'2024-11-28 13:27:23.745580','2025-02-28 13:27:23.745580'),(4,'DD756E0C843E5CBBC888BA96B3972BF673368DD94FC073ECA9A27B38FA9BB7EE','2024-11-28 13:27:23.679923',2,1,'2024-11-28 13:27:23.679923',1,'2024-11-28 13:27:23.679923','2025-02-28 13:27:23.679923'),(5,'3F8003EE820E1E19497C9520079083D2C846F4E263C18A17B7F5DB4AC45D127E','2024-11-28 13:27:23.723391',4,1,'2024-11-28 13:27:23.723391',1,'2024-11-28 13:27:23.723391','2025-02-28 13:27:23.723391');
/*!40000 ALTER TABLE `passwordhistories` ENABLE KEYS */;

-- 
-- Definition of tickets
-- 

DROP TABLE IF EXISTS `tickets`;
CREATE TABLE IF NOT EXISTS `tickets` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `TicketNumber` int NOT NULL,
  `Description` longtext,
  `Scheduled` datetime(6) NOT NULL,
  `Status` int NOT NULL,
  `ArticleID` int NOT NULL,
  `CustomerID` int NOT NULL,
  `UserID` int NOT NULL,
  `AddressID` int NOT NULL,
  `CustomerSearchName` longtext,
  `UserFirstName` longtext,
  `CreatedBy` int NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `ModifiedBy` int NOT NULL,
  `LastModified` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `IX_Tickets_TicketNumber` (`TicketNumber`),
  KEY `IX_Tickets_AddressID` (`AddressID`),
  KEY `IX_Tickets_ArticleID` (`ArticleID`),
  KEY `IX_Tickets_CustomerID` (`CustomerID`),
  KEY `IX_Tickets_UserID` (`UserID`),
  CONSTRAINT `FK_Tickets_Addresses_AddressID` FOREIGN KEY (`AddressID`) REFERENCES `addresses` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_Tickets_Articles_ArticleID` FOREIGN KEY (`ArticleID`) REFERENCES `articles` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_Tickets_Customers_CustomerID` FOREIGN KEY (`CustomerID`) REFERENCES `customers` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_Tickets_Users_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table tickets
-- 

/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets`(`ID`,`TicketNumber`,`Description`,`Scheduled`,`Status`,`ArticleID`,`CustomerID`,`UserID`,`AddressID`,`CustomerSearchName`,`UserFirstName`,`CreatedBy`,`CreationDate`,`ModifiedBy`,`LastModified`) VALUES(1,153532,'Description','2024-11-28 00:00:00.000000',0,1,1,5,1,'Homer','Gerard',1,'2024-11-28 13:27:23.747064',1,'2024-11-28 13:27:23.747064'),(2,946263,'Description','2024-11-28 00:00:00.000000',1,2,2,5,2,'Homer','Gerard',1,'2024-11-28 13:27:23.747251',1,'2024-11-28 13:27:23.747251'),(3,237415,'Description','2024-11-28 00:00:00.000000',2,3,3,5,3,'Homer','Gerard',1,'2024-11-28 13:27:23.747260',1,'2024-11-28 13:27:23.747260'),(4,436436,'Description','2024-11-28 00:00:00.000000',2,3,3,5,3,'Homer','Gerard',1,'2024-11-28 13:27:23.747260',1,'2024-11-28 13:27:23.747260'),(5,346436,'Description','2024-11-28 00:00:00.000000',2,3,3,5,3,'Homer','Gerard',1,'2024-11-28 13:27:23.747261',1,'2024-11-28 13:27:23.747261'),(6,754747,'Description','2024-11-28 00:00:00.000000',2,3,3,5,3,'Homer','Gerard',1,'2024-11-28 13:27:23.747261',1,'2024-11-28 13:27:23.747261'),(7,374873,'Description','2024-11-28 00:00:00.000000',2,3,3,5,3,'Homer','Gerard',1,'2024-11-28 13:27:23.747262',1,'2024-11-28 13:27:23.747262');
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;

-- 
-- Definition of certificatetickets
-- 

DROP TABLE IF EXISTS `certificatetickets`;
CREATE TABLE IF NOT EXISTS `certificatetickets` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `CertificateID` int NOT NULL,
  `TicketID` int NOT NULL,
  `CreatedBy` int NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `ModifiedBy` int NOT NULL,
  `LastModified` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `IX_CertificateTickets_CertificateID` (`CertificateID`),
  KEY `IX_CertificateTickets_TicketID` (`TicketID`),
  CONSTRAINT `FK_CertificateTickets_Certificates_CertificateID` FOREIGN KEY (`CertificateID`) REFERENCES `certificates` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_CertificateTickets_Tickets_TicketID` FOREIGN KEY (`TicketID`) REFERENCES `tickets` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 
-- Dumping data for table certificatetickets
-- 

/*!40000 ALTER TABLE `certificatetickets` DISABLE KEYS */;

/*!40000 ALTER TABLE `certificatetickets` ENABLE KEYS */;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;


-- Dump completed on 2024-11-29 09:27:54
-- Total time: 0:0:0:0:336 (d:h:m:s:ms)
