# Files Manager - Backend Project

## Project Overview

This project is a simple file management platform where users can upload files, view files, and manage file permissions. The project focuses on building a backend API with authentication, file management functionality, and background processing. The backend is built using **Node.js**, **Express.js**, **MongoDB**, **Redis**, and **Kue**.

## Features

- **User Authentication**: Secure token-based authentication.
- **File Management**: Users can upload, view, and manage files.
- **Permissions Management**: Users can change the permissions for their files.
- **Thumbnail Generation**: For image files, generate thumbnails upon upload.
- **Redis Integration**: Temporary data storage and cache with Redis.
- **Background Jobs**: File-related background tasks using Kue.

## Technologies Used

- **Node.js**: JavaScript runtime for building the backend.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: NoSQL database for storing files and user data.
- **Redis**: In-memory data structure store, used for caching and session management.
- **Kue**: Library for handling background jobs in Node.js.

## Setup

### Prerequisites

1. **Node.js**: Ensure you have Node.js installed (version 12.x.x).
2. **MongoDB**: Make sure you have a MongoDB instance running locally or in the cloud.
3. **Redis**: Ensure Redis is installed and running on your machine or use a cloud Redis service.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/alx-files_manager.git
   cd alx-files_manager
   ```
