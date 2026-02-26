# JLabs Assessment - IP Locator Project

Hello! This is my submission for the Full-Stack developer assessment. I built this using React for the frontend and Node.js for the backend. 

I focused on making sure the connection between the two was stable and that the Bonus features (the map and history) worked smoothly for the user.

## How to get it running:

### 1. The Backend (API)
- Go into the `api-server` folder.
- Run `npm install` to get the dependencies.
- Run `node server.js`.
- It runs on **port 8000**.

### 2. The Frontend (Web)
- Go into the `web-client` folder.
- Run `npm install`.
- Run `npm run dev` and open the link in your browser.

## Features I added:
- **Login:** Connects to the Node.js backend to verify the user.
- **IP Search:** You can search any IPv4 address, and it will fetch the details from IPInfo.
- **Interactive Map:** I used Leaflet so the map automatically jumps to the location of the IP.
- **History Logs:** Every search gets saved in the sidebar so you don't lose track of your work.
- **Cleanup:** You can delete specific items from your history if you don't need them anymore.

## Test Credentials:
- **Email:** admin@test.com
- **Password:** password123

Thanks for taking the time to check out my code!