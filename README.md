# Nice Bank

## Description/Motivation
Nice Bank is a full-stack web application that allows users to manage their banking activities, including account creation, deposits, withdrawals, transfers, and viewing transaction history. The project is built with a React frontend, a Node.js backend, and uses Firebase for authentication and MongoDB for data storage.

## Features

* User Registration and Login
* Account Creation
* Balance Inquiry
* Deposits and Withdrawals
* Fund Transfers
* Transaction History

## Technologies Used

* Frontend: React, Bootstrap
* Backend: Node.js, Express.js
* Authentication: Firebase
* Database: MongoDB
* Deployment: Heroku

## Installation Guidelines
Follow these steps to set up the project locally:

### 1. Clone the repository:
```
git clone https://github.com/Nerpassevera/nice-bank.git
cd nice-bank
```
### 2. Install dependencies for the backend and frontend:
```
npm install
cd client
npm install
cd ..
```
### 	3.	Set up environment variables:
Create a .env file in the root directory and add your configuration details:
```
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password
FIREBASE_ADMIN_KEY=your_base64_encoded_firebase_private_key
```
### 4. Run the back-end server:
```
npm start
```
### 5. Run the front-end development server:
```
cd ../client
npm start
```
### 6. Open the application:
Open your browser and go to http://localhost:3000.

## Screenshots

Home Page of the Bad Bank App  
<img src="./assets/home-page.png"/>


Create Account Page  
<img src="assets/create-account-page.png"/>


Deposit Money Page  
<img src="assets/home-page.png"/>


## Deployment

The application is deployed on:

* Frontend and Backend: Heroku
* Database: MongoDB Atlas

## Features
* __Create Account__: Users can create a new account by providing basic details.
* __Deposit__: Users can deposit money into their account.
* __Withdraw__: Users can withdraw money from their account.
* __Transfer__: Users can transfer money from their account to another bank client.
* __Balance__: Users can check their current account balance.

## Future Features
* __Account Management__: Edit account details and preferences.
* __User Profile Picture__: Add the ability for users to upload and manage their profile pictures.
* __Currency Exchange Rates__: Integrate a currency exchange feature to display current exchange rates and allow transactions in multiple currencies.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for review.

## License
This project is licensed under the [MIT License](./LICENSE). 




