# 2021 Master's Project - Alex Tenczar
# BandViz: A Web Application for Visualizing Music Discovery
BandViz is a web application that uses both Last.fm and Spotify's APIs to visualize similar musical artists of a user-queried artist. BandViz uses the following technologies:

 - Create React App: A Pre-configured React environment.
 - Axios: Promise-based library for easier HTTP requests to the APIs.
 - D3.js: Powerful data visualization library.
 - Last.fm's API: Provides endpoints for retrieving similar and trending artists.
 - Spotify's API: Provides endpoints for artist images, genres, and song previews.
 - React Helmet: Library for easily updating the web site's head.
 - React Audio Player: More easily create components for playing song previews.
 - React Lottie: Add Lottie JSON animation files as components to the web app.
 - React Router: Dynamically route artist visualizations through URL query parameters.
 - Deployed to Vercel for automatic commit-based deployments.

## Requirements:

 1. NPM and Node.js installed locally.
 2. Client/Secret keys for Last.fm and Spotify's free APIs.

## Build:
This web app can be built locally by following these steps:
 1. Clone the GitHub repository.
 2. In the clone repo's base directory, create an .env.local file with the following environment variables:
`REACT_APP_LAST_API_KEY=,
 REACT_APP_SPOTIFY_CLIENT=,
 REACT_APP_SPOTIFY_SECRET=`
 3. Add your unique API keys to these environment variables.
 4. Run "NPM i" on the base directory to install all dependencies.
 5. To start up your application, run "NPM start".
 6. BandViz should now be accessible at http://localhost:3000/

## Usage:
 - Type in the search bar for an artist whom you want to visualize their similar artists.
	 - Either click an auto completed result in the drop-down menu or press enter.
 - Once the visualization is rendered: 
     - All similar artists are rendered in the center of the screen as bubbles.
     - The bigger the artist's bubble, the more similar they are. 
	 - Hover over an artist's bubble to display their name and similarity value.
	 - Scroll or pinch to zoom in order to render the visualization bigger or smaller.
	 - Drag the visualization to position a specific bubble in view.
	 - Click your searched artist's name at the top of the page to listen to preview tracks and see their genres.
     - Click a similar artist's bubble to search for their similar artists.

![Imgur Image](https://i.imgur.com/lQcefW8.gif)