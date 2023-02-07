# Node.js E-commerce Application

## Introduction

### Description

The project implement a simple e-commerce website which includes the basic functions such as signing in, signing up, browsering products with filters,
adding to shopping cart, placing the order. The website also has a functioning admin capability. When an admin user signs in from a particular login page,
he will be redirected to a dashboard which shows data of sales and inventories.

## Object

The primary goal of the project is to learn to build a fully featured web application in Node.js. Specifically, I want to know how to produces dynamic web page (HTML)
with Embedded JavaScript Templating. Besides, I also want to prectice defining RESTful routes and learn the knowledge of Express Session and Authentication.
Besides, the project use session storage to maintain a shopping cart.

- Customized interface for different users and different types of users (Admin view vs Regular User view)
- Web forms for Signup, Login, and to allow users to edit their profile with form validation
- Enhanced interactions with JavaScript
- Polished responsive, and consistent design using CSS and Bootstrap
- MVC structure using Node, Express, and EJS
- Design the schemas of User and Products
- Log-in and sign-up functions
- Admin capabilities for performing advanced functions in the application that are only available to specific admin users
- Session management capabilities
- RESTful Web service API with CRUD operations and other interactions
- Validate and handle errors


## Technical Architecture

The project is based on Express.js, EJS, and MongoDB.

libraries: express, mongoose, express-session, connect-flash, passport, chart.js

frameworks: MDBootstrap

The design of the project follows MVC structure. The view dynamically renders data from controller, and the controller responds to the user input and performs interactions on the data model objects.

### Models

- user.js: Design the schema for users. It uses a boolean attribute to distinguish Admin User from Regular User. It also inculdes the functions to encrypt the password and check password.
- product.js: Design the schema for products.
- order.js: Design the schema for orders.

### Views

- \_header.ejs: Define the header for all pages.
- \_footer.ejs: Define the footer for all pages.
- index.ejs: Home page for the e-commerce website. It renders the products in database.
- login.ejs: Login page for Regular User.
- login2.ejs: Login page for Admin User.
- signup.ejs: Register page for Regular User.
- profile.ejs: Profile page for current user.
- cart.ejs: Checkout page for current user.
- order.ejs: Order placed page after checkout.
- admin.ejs: Dashboard for Admin view.
- products.ejs: A page to display full products information for Admin view.
- inventory.ejs: A page to modify specific product information for Admin view.

### Controllers

- server,js: Create Node.js web server and declare libriaries required.
- routes.js: Receive requests from the client and maps the request to a specific method that interacts with the request data and any relevant model objects and prepares a response using a view.
- setuppassport: Define the login strategies of passport for different types of users.

## Challenges

One challenge that remains to be resolved is how to dynamically display the shopping cart/the number of items in the shopping cart without reload the view of the page.
Because the data of shopping cart are modified and stored in server side, the onclick() event will not get the updated data if the modification is processing. Maybe an inline frame \<iframe> will help.

## Future Work

The first I want to improve is Infinite Scrolling to load. Now the amounts of products in the database is small so we can simply load all the products.
But usually an e-commerce websits will have a large scale of data, and it is needed to set Pagination to retrieve data to improve the efficiency.
Then the client can listen to the scroll events or "Load More" button events to dynamically send requests.

The second I want to implement is Uploading Images for avatar or products. That may need the help of Express multer middleware.

## Resources 

MDBootstrap: [https://mdbootstrap.com/docs/standard/]

Passport.js: [https://www.passportjs.org/docs/]

Chart.js: [https://www.chartjs.org/docs/latest/]