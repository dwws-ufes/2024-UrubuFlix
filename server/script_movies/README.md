# movie_data_collector

Collects data from movies using the OMDb API and TMDB API.

## API Documentation
- [OMDb API](http://www.omdbapi.com/)
- [The Movie Database API](https://www.themoviedb.org/documentation/api)

## Installation

To use this script, it is necessary to configure the environment variables in the `.env` . To do this, follow the steps below:

- Open the `.env` file and fill in the environment variables with their values:

   ```shell
    OMDb_API_KEY="your_api_key"
    TMDB_API_KEY="your_api_key"
    ```

### Usage
Open a terminal in the [server](server) folder and run the following command:
```sh
 npm codar_movies
``` 
Data is saved in a [csv](https://en.wikipedia.org/wiki/Comma-separated_values) or [json](https://en.wikipedia.org/wiki/JSON) file.

## Search settings
### Number of films returned
The script is configured to collect data from approximately 100 movies, but you can change this value by changing the `MAX_PAGES` constant in the `requester.py` file. One page contains approximately 19 movies.

### List Type
The script is configured to collect data from the most popular movies, but you can change this value by changing the `list_type` parameter in the `get_tmdb_movies` function in the `requester.py` file. Possible values ​​are:
- `POPULAR` - Popular movies
- `TOP_RATED` - Top rated movies
- `UPCOMING` - Upcoming movies
