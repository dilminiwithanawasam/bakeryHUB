# 🍞 Bakery HUB  
### Bakery Management System

Bakery HUB is a web-based Bakery Management System developed to automate bakery operations such as sales, inventory management, factory distribution, and online customer ordering. The system replaces manual billing and stock handling with a centralized digital solution.

This project is developed as part of **IS 3920 – Individual Project on Business Solutions** at the **University of Moratuwa**.

---

## 📌 Overview
Traditional bakery operations suffer from manual billing errors, poor inventory visibility, and disconnected factory–outlet communication. Bakery HUB addresses these problems by providing a real-time, role-based system that manages the entire bakery workflow from production to customer pickup.

---

## 🏗 System Architecture
The system follows a **Three-Tier Monolithic Architecture**:

- **Frontend:** React (Vite) + Tailwind CSS  
- **Backend:** Django + Django REST Framework  
- **Database:** PostgreSQL  
- **Storage:** AWS S3 for images and design uploads  

All communication is handled via **RESTful APIs over HTTPS** using **JSON**.

---

## ✨ Key Features
- Secure authentication with **JWT** and **Role-Based Access Control**
- Automated **Point of Sale (POS)** system
- Real-time **inventory and expiry management**
- Factory batch creation and outlet dispatching
- Online **advance cake ordering** with customization
- Sales and outlet performance **reports**

---

## 👥 User Roles
- **Admin:** System and user management  
- **Manager:** View reports and outlet performance  
- **Salesperson:** POS operations and outlet stock handling  
- **Factory Distributor:** Batch management and dispatching  
- **Customer:** Online ordering and order tracking  

---

## 🛠 Technology Stack
- **Frontend:** React, Tailwind CSS  
- **Backend:** Python 3.10+, Django, Django REST Framework  
- **Database:** PostgreSQL  
- **Deployment:** AWS Cloud  

---

## 📈 Business Rules
- Cake orders must be placed **at least 24 hours in advance**
- Pickup only (no delivery)
- Orders are confirmed only after successful payment
- Expired or near-expiry items cannot be sold

---

## 📚 Documentation
- Software Requirements Specification (SRS)
- User Manual for staff
- Technical documentation with UML diagrams

---

## 👨‍💻 Contributor
**D.C. Withanawasam**  
Faculty of Information Technology  
University of Moratuwa

---

## 📄 License
This project is developed for **academic purposes only**.  
© 2025 All Rights Reserved.
