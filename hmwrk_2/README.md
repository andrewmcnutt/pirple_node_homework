# Homework assignment #2 for the Node.js Masterclass from Pirple

This is the second homework assignment for the class. In this assignment we create a pizza shop that has a menu, can charge customers and email them a receipt. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Tasks to complete the assignment	

1. New users can be created, their information can be edited, and they can be deleted. We should store their name, email address, and street address.

2. Users can log in and log out by creating or destroying a token.

3. When a user is logged in, they should be able to GET all the possible menu items (these items can be hardcoded into the system). 

4. A logged-in user should be able to fill a shopping cart with menu items

5. A logged-in user should be able to create an order. You should integrate with the Sandbox of Stripe.com to accept their payment. Note: Use the stripe sandbox for your testing. Follow this link and click on the "tokens" tab to see the fake tokens you can use server-side to confirm the integration is working: https://stripe.com/docs/testing#cards

6. When an order is placed, you should email the user a receipt. You should integrate with the sandbox of Mailgun.com for this. Note: Every Mailgun account comes with a sandbox email account domain (whatever@sandbox123.mailgun.org) that you can send from by default. So, there's no need to setup any DNS for your domain for this task https://documentation.mailgun.com/en/latest/faqs.html#how-do-i-pick-a-domain-name-for-my-mailgun-account

### Installing
After downloading the repo please run the code below to add the necessary subfolders. After that you will need to create a .env file that will contain the api keys for Stripe & Mailgun as well as the domain name for Mailgun. 

```
npm run create-data-subfolders
```

To test the calls in Postman you can import the "NMC Homework 2" collection under the postman folder in the root directory.

```
postman/NMC Homework 2
```
