# Chat Application
https://github.com/user-attachments/assets/33cc0dda-6f21-4064-a728-1b07bcc95ce4

A real-time chat application built using the MERN (MongoDB, Express.js, React, Node.js) stack with Socket.IO for real-time messaging, authentication with JWT, and additional features like QR code contact addition. This project serves as a full-stack implementation of a chat app with individual messaging functionalities.

## Features

- **User Authentication**: JWT-based login and signup with Passport.js.
- **Social Login**: Authentication options via Google and Facebook.
- **Real-Time Messaging**: Real-time private messaging using Socket.IO.
- **AI Chatbot**: Integration with Llama-based AI bot for automated responses and support.
- **Contact Management**: Add friends by scanning a friend's QR code.
- **Presence Tracking**: Online/offline presence indicator for contacts.
- **Responsive Chat Layout**: Messages displayed on different sides for sender and receiver.
- **Forgot Password**: Password recovery using Nodemailer for email-based reset links.
- **UI**: Clean, responsive design using Material tailwind and Tailwind CSS.
- **Enhanced Security**: Token-based authentication without cookies.
- **Dynamic Routing**: User-specific chat history fetched using `userId` and `recipientId` URL parameters. 




## Technologies Used

### Frontend
- **React.js**: Component-based UI development.
- **Socket.IO-Client**: Real-time bidirectional communication for the chat functionality.
- **Material Tailwind **: UI components for consistent and professional design.
- **Tailwind CSS**: Utility-first CSS framework for responsive design.

### Backend
- **Node.js**: JavaScript runtime environment for building the backend.
- **Express.js**: Minimal and flexible Node.js framework.
- **Socket.IO**: Real-time engine for communication between server and client.
- **MongoDB**: NoSQL database for storing user data and messages.

### Authentication & Authorization
- **JWT (JSON Web Token)**: Secure authentication and session management.
- **Passport.js**: Middleware for authentication with Google and Facebook.

### AI Integration
- **Llama-based AI Bot**: Handles automated responses and support queries.

### Additional Libraries
- **Nodemailer**: Email service for password reset functionality.
- **Zod**: Schema-based validation for form data.
- **QR Code Generator**: QR code generation for adding contacts.
- **React-rouer**: for dynamic routing.
## Getting Started


### Installation

1. **Clone the repository**:


2. **Install dependencies**:

    ```bash
    # In the server directory
    cd backend
    npm install
    
    # In the client directory
    cd frontend
    npm install
   





4. **Run the application**:

    - Start the backend server:

        ```bash
        cd backend
       node server.js
        ```

    - Start the frontend:

        ```bash
        cd frontend
        npm run dev
        ```







