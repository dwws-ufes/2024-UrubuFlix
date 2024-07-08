import requests
import csv
import json
import os
from enum import Enum
from dotenv import load_dotenv

load_dotenv()
TMDB_API_KEY = os.getenv('TMDB_API_KEY')
OMDB_API_KEY = os.getenv('OMDB_API_KEY')
BASE_TMBD_URL = 'https://api.themoviedb.org/3/movie/'
BASE_OMDB_URL = 'http://www.omdbapi.com/'
MAX_PAGES = 5


class ListType(Enum):
    POPULAR = 'popular'
    TOP_RATED = 'top_rated'
    UPCOMING = 'upcoming'


def save_to_json(movie_data: list, filename: str = 'movies.json'):
    """Saves movie data to a JSON file"""
    
    if not movie_data:
        print("No data to save.")
        return
    
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(movie_data, file, ensure_ascii=False, indent=4)
        

def save_to_csv(movie_data: list, filename: str = 'movies.csv'):
    """Saves movie data to a CSV file"""
    
    if not movie_data:
        print("No data to save.")
        return
    
    fieldnames = movie_data[0].keys()
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(movie_data)
        

def get_tmdb_movies(list_type: ListType, page: int = 1, max_pages: int = 5) -> list:
    """Fetches movie data from TMDB API"""
    
    url = f'{BASE_TMBD_URL}{list_type.value}'
    
    params = {
        'api_key': TMDB_API_KEY,
        'language': 'en-US',
        'page': page
    }
    
    movie_data_list = []
    
    for page_num in range(1, max_pages+1):
        params['page'] = page_num
        response = requests.get(url, params=params)

        if response.status_code == 200:
            data = response.json()
            results = data.get('results', [])
            if results:
                movie_data_list.extend(results)
            else:
                break
        else:
            print(f"Error: Unable to fetch data, status code: {response.status_code}")
            
    return movie_data_list


def tmdb_movie_details(movie_id: int) -> dict:
    """Get movie details from TMDB API"""
    
    url = f'{BASE_TMBD_URL}{movie_id}'
    params = {
        'api_key': TMDB_API_KEY,
        'language': 'en-US'
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: Unable to fetch details for movie ID '{movie_id}', status code: {response.status_code}")
        return {}
    

def tmdb_movie_trailer(movie_id: int) -> str:
    """Get the movie trailer link from TMDB API"""
    
    url = f'{BASE_TMBD_URL}{movie_id}/videos'
    params = {
        'api_key': TMDB_API_KEY,
        'language': 'en-US'
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        data = response.json()
        results = data.get('results', [])
        for video in results:
            if video['type'] == 'Trailer' and video['site'] == 'YouTube':
                return f"https://www.youtube.com/watch?v={video['key']}"
            else:
                return "N/A"
    else:
        print(f"Error: Unable to fetch trailer for movie ID '{movie_id}', status code: {response.status_code}")
    
    return None


def get_omdb_data(imdb_id: str) -> dict:
    """Fetches movie data from OMDb API"""

    params = {
        'apikey': OMDB_API_KEY,
        'i': imdb_id
    }
    
    response = requests.get(BASE_OMDB_URL, params=params)
    
    if response.status_code == 200:
        data = response.json()
        if response.json().get('Response') == 'True':
            return {
                'Title': data.get('Title', 'N/A'),
                'Rated': data.get('Rated', 'N/A'),
                'Released': data.get('Released', 'N/A'),
                'Runtime': data.get('Runtime', 'N/A'),
                'Genre': data.get('Genre', 'N/A'),
                'Director': data.get('Director', 'N/A'),
                'Plot': data.get('Plot', 'N/A'),
                'Poster': data.get('Poster', 'N/A'),
                'Ratings': data.get('Ratings', []),
            }  
        else:
            print(f"Error: Movie '{imdb_id}' not found in OMDb!")
            return None
    else:
        print(f"Error: Unable to fetch data for '{imdb_id}', status code: {response.status_code}")
        return None
    
    
def get_movie_data(movies: list) -> list:
    """Fetches movie data from OMDb API"""
    
    movie_data = []
    for movie in movies:
        imdb_id = movie.get('imdb_id')
        if not imdb_id:
            # Fetch the IMDb ID if not present (additional TMDb API call)
            movie_details = tmdb_movie_details(movie['id'])
            imdb_id = movie_details.get('imdb_id')
            
        if imdb_id:
            omdb_data = get_omdb_data(imdb_id)
            if omdb_data:
                trailer_url = tmdb_movie_trailer(movie['id'])
                if trailer_url == "N/A":
                    continue
                omdb_data['Trailer'] = trailer_url
                movie_data.append(omdb_data)
    return movie_data    
    
    
if __name__ == '__main__':
    print("Starting extraction...")
    movies = get_tmdb_movies(ListType.UPCOMING, max_pages=MAX_PAGES)
    
    movie_data = get_movie_data(movies)            

    save_to_json(movie_data, 'movies.json')
    print("Extraction completed.")