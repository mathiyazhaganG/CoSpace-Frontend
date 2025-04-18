# Client Application Setup and Usage

This document provides instructions to set up and run the Client application for the CoSpace project.

## Prerequisites

- Node.js (version 14 or higher recommended)
- npm (comes with Node.js)
- Access to the backend API with environment variable `BASE_API` set accordingly

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Client
   ```

2. **Install dependencies**

   Run the following command in the `Client` directory to install all required packages:

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `Client` directory (if not already present) and set the following environment variable:

   ```env
   BASE_API=http://localhost:5000/api
   ```

   Replace the URL with the actual backend API endpoint.

4. **Run the development server**

   Start the development server with:

   ```bash
   npm start
   ```

   This will launch the app on `http://localhost:3000` by default.

5. **Build for production**

   To create a production build, run:

   ```bash
   npm run build
   ```

   The build output will be in the `dist/` directory.

## Project Structure

- `src/` - Source code for the React application
  - `components/` - Reusable UI components
  - `Pages/` - Page components for routing
  - `utils/` - Utility functions and Redux store setup
- `.env` - Environment variables
- `package.json` - Project dependencies and scripts

## Notes

- The app uses Redux Toolkit for state management.
- React Router v6 is used for routing.
- API endpoints are configured via the `BASE_API` environment variable.
- Authentication token is expected to be stored in cookies.
- The app includes error handling and toast notifications.

## Troubleshooting

- Ensure the backend API is running and accessible.
- Verify the `BASE_API` environment variable is correctly set.
- If you encounter issues with authentication, check cookie settings in your browser.

## Contact

For further assistance, please contact the project maintainer.
