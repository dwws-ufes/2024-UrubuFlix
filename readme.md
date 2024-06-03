# 2024-UrubuFlix
Assignment for the 2023 edition of the "Web Development and the Semantic Web" course, by Andre Guimaraes Barros, Bruno Santos Fernandes and Renan Campista


# Configuration and Dependencies

This project utilizes React with Vite and Node.js with MySQL and requires specific extensions and dependencies to function properly.

## Required Extensions

Make sure to have the following extensions installed:

- [Node.js](https://nodejs.org/) - Runtime environment for JavaScript.
- [Vite](https://vitejs.dev/) - A build tool for modern frontend projects with React.
- [VS Code](https://code.visualstudio.com/) (recommended) - A popular code editor with extension support for easier development.

## Project Dependencies

Before getting started, install the following dependencies using npm or yarn:

**Running the Backend**
1. With a terminal, navigate to the [server](server) folder and run the following commands:

   ```shell
    npm install prisma
   ```

2. Copy the `.env.example` file to a new file called `.env`:
   ```shell
    cp .env.example .env
   ```

3. Open the `.env` file and fill in the environment variables with their values. For the server, configure the variables below:
   ```shell
    DATABASE_URL="your_database_url"
    KEY="your_jwt_secret"
    USER_NAME="your_email_to_recover_password"
    USER_PASSWORD="your_password_to_recover_password"
    ```
4. Run the following command to create the database schema:
    ```shell
    npx prisma db push
    ```
5. Run the following command to start the server:
    ```shell
    npm start
    ```


**Running the Frontend**
1. With a terminal, navigate to the [client](client) folder and run the following commands:

   ```shell
    npm install
   ```
2. Run the following command to start the client:
    ```shell
    npm run dev
    ```
3. Open your browser and navigate to http://localhost:5173/ to see the application running.



# Movie Data Collector

The project includes a data collector script to populate the database with movies. To run the script, follow the steps below:
1. Open the .env file in the [server](server) folder and fill in the environment variables with their values. For the data collector, configure the variables below:
   ```shell
    OMDb_API_KEY="your_api_key"
    TMDB_API_KEY="your_api_key"
   ```
2. To get the API keys, create an account on the [OMDb API](http://www.omdbapi.com/apikey.aspx) and [The Movie Database API](https://www.themoviedb.org/documentation/api).

3. Run the following command to start the data collector:
```shell
 npm codar_movies
```

## Observations
- This script does not automatically upload movies to the database. It only collects the data and saves it to a JSON file.
- Sending to the database is performed when starting the server.
- It is not necessary to run this script to run the web application. A [file](server/script_movies/movies.json) with film data to be inserted into the database has already been made available along with this project.
- More information about the itinerary can be accessed by [clicking here](server/script_movies/README.md)


Ensure you have the environment properly set up and database configurations to make the application work as expected.

Happy coding!
