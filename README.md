## Employee Recognition Portal

An application to create recognition certificates as part of a company employee recognition program.

### Description

This application was created as a capstone project for the Computer Science program at Oregon State University.  It is a web-based client that allows a user to create an employee recognition certification. Upon creation, the certificate is automatically sent to the recognized employee. This project is built using a full-stack javascript environment with a back-end using a javascrip Node web server with the Express framework and a SQLite database, and the front-end using handlebars templates and client-side javascript.  It provides authorization through Auth0 authentication services.

### Dependencies
The project uses the following Node.js packages: 

Express - The framework used in order to create the backbone of our web client.

Express-Handlebars - The view engine used to process our various dynamic pages.

Express-Session - Express-Session is used to maintain the users login state.

Body-Parser - Used to convert all incoming parameters into JSON. This makes access of the data easier and more convenient for use.

Node-Auth0 - A middleware implementation of the Auth0 API. It simplifies the process of maintaining management and client tokens.

Dotenv - A node module that allows for loading environmental variables. Primarily it is used to keep secure information out of the code 
base. In our case that includes credentials to Auth0 and email service.

Node-latex - A node module used in order to assist in converting our LaTex files into PDFs.

Multer - This is a node middleware component for uploading files via forms.  This was used to handle the uploading of user signature images.

Passport - Used along with Passport-auth0 to allow for authentication between the Auth0 service.

Passport-auth0 - A auth0 implementation of Passport to allow for authentication using the Auth0 service.

Path - Provides us with access to the file system in order to generate our LaTex and PDF files.

Sqlite3 - Node.js implementation of SQLite commands in order to access our database.

Nodemailer - Module used to email certificate pdfs to a specified email address.
HTML/CSS/JS

Bootstrap(for formatting and templating) - Primary resource for CSS that helped create a more unified look throughout the site.

Notify.js - A module that includes the ability to add a notification to the user. Primarily used to notify the user of successful updates.

In addition to the Node.js packages, the following technologies are also used: 

SQLite3 - The framework for our database storage.

Auth0 API (user authentication)

Open Iconic - Open source icons that were used in the various button designs throughout the site.

Google Charts

