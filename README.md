# VaccinationTime

VaccinationTime allows you to share and view waiting times to get a vaccine at a vaccination clinic in Toronto.

# Features

* Create reviews sharing your waiting time to get vaccinated at a vaccination clinic
* View waiting times and experiences of others
* Filter out vaccination clincs whose waiting times are too long

# Demo

https://vimeo.com/544267300

# Installation

To install all dependencies:

`npm install`

## Google Maps API Key

Inside a file named `.env.local`, set the key `REACT_APP_GOOGLE_MAPS_KEY` equal to your Google Maps API key

# How to Run (In Dev Mode)

Within the parent directory, start the React app by running

`npm start`

Within `src/server`, start the server by running

`node server.js`

# Technologies

* React
* Node.js and Express.js
* SQLite3

# Dataset

Data was pulled from https://open.toronto.ca/dataset/covid-19-immunization-clinics/ on April 30, 2021. The current version may be outdated.

## Created for RuHacks 2021
