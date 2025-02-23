# Tube Station Crowding Viewer

This project was originally developed as part of the coursework for the **5CCS2INS Internet Systems** module at **King's College London** during the **2022/23** academic year. It has since been improved upon by me to enhance its functionality, design, and user experience.

## Project Overview
The website allows users to view crowding information at selected London tube stations for different days of the week. It fetches data from the Transport for London (TfL) API and presents it through an interactive chart, peak time indicators, and a detailed table.

## Improvements Made
- **Theme Support**: Added automatic light and dark mode switching based on the user's system preferences, ensuring a better user experience in different environments.
- **UI Enhancements**: Improved the layout and styling using Bootstrap components like cards and alerts for a cleaner, more professional look.
- **Performance Optimizations**: Refactored JavaScript to reduce DOM manipulations, improve chart rendering, and handle API requests more efficiently.
- **Code Cleanup**: Streamlined the HTML, CSS, and JavaScript files with better comments, consistent naming conventions, and organized structure for easier maintenance.

This project serves as an example of building a responsive, user-friendly web application that integrates external APIs and adapts to user preferences.

## Setting Up the API Key
This project uses the Transport for London (TfL) API to fetch crowding data. To run the application locally, you will need to obtain your own API key from the TfL API portal and insert it into the code. Follow these steps:

1. Visit the [TfL API Portal](https://api-portal.tfl.gov.uk/) and sign up for a free account.
2. Once registered, navigate to the "My Account" section to find your API key.
3. Copy your API key.
4. In the `scripts.js` file (located in the `js` directory), find the line:
   ```javascript
   'app_key': 'YOUR_API_KEY_HERE', // Replace with your own API key