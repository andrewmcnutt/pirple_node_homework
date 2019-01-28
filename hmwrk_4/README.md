# Homework assignment #4 for the Node.js Masterclass from Pirple

### Tasks to complete the assignment

It is time to build the Admin CLI for the pizza-delivery app you built in the previous assignments. Please build a CLI interface that would allow the manager of the pizza place to:

1. View all the current menu items

2. View all the recent orders in the system (orders placed in the last 24 hours)

3. Lookup the details of a specific order by order ID

4. View all the users who have signed up in the last 24 hours

5. Lookup the details of a specific user by email address


This is an open-ended assignment. You can take any direction you'd like to go with it, as long as your project includes the requirements. It can include anything else you wish as well. 

### Installing

This project was built using node v10.14.1. After downloading the repo please run the code below to add the necessary subfolders. After that you will need to create a .env file that will contain the api keys for Stripe & Mailgun as well as the domain name for Mailgun.

```
npm run create-data-subfolders
```

To test the calls in Postman you can import the "NMC Homework 2" collection under the postman folder in the root directory.

```
postman/NMC Homework 2
```
