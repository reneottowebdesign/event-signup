# Event Registration Application

This project is a simple event registration application built with Node.js and Express. It allows users to register for an event by submitting their name, email, and choice (attending or not attending). The application stores the submissions in a text file and provides feedback to the user about the success or duplication of their registration.

## Features

- **Event Registration Form**: A web form for users to submit their registration details.
- **Server-Side Processing**: Handles form submissions, checks for duplicates, and updates the registration list.
- **Feedback Messages**: Displays success or duplicate messages to the user based on their submission.
- **Static File Serving**: Serves static files including CSS and JavaScript libraries.
- **Data Storage**: Stores registration data in a text file.

## Included Files

- **index.html**: The main HTML file containing the registration form and feedback messages.
- **server.js**: The main server file that handles form submissions and serves static files.
- **style.css**: Custom CSS styles for the application.
- **submissions.txt**: The file where registration data is stored.
- **package.json**: Contains the project dependencies and scripts.
- **README.md**: Project description and instructions (this file).
- **.gitignore**: Specifies files and directories to be ignored by Git.

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Start the server**:
    ```sh
    npm start
    ```

4. **Open your browser** and navigate to `http://localhost:3000` to see the application in action.

## Dependencies

- **Express**: Web framework for Node.js.
- **Body-Parser**: Middleware to parse incoming request bodies.
- **Bootstrap**: CSS framework for styling.