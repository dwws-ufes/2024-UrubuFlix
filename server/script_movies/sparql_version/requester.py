import json
from SPARQLWrapper import SPARQLWrapper, JSON

ENDPOINT_URL = "https://dbpedia.org/sparql"

def start_sparql(endpoint: str) -> dict:
    """Start SPARQL connection with Wikidata and return results."""
    
    sparql = SPARQLWrapper(endpoint)
    sparql.setQuery("""
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        
        SELECT ?film ?title ?abstract ?releaseDate ?director ?ageRating ?poster ?rating ?trailer ?genreLabel ?runtime
        WHERE {
            ?film a dbo:Film .
            ?film rdfs:label ?title .
            ?film dbo:genre ?genre .
            ?film dbo:runtime ?runtime .
            ?film dbo:director ?director .
            OPTIONAL { ?film dbo:abstract ?abstract . }
            OPTIONAL { ?film dbo:releaseDate ?releaseDate . }
            OPTIONAL { ?film dbo:ageRating ?ageRating . }
            OPTIONAL { ?film dbo:thumbnail ?poster . }
            OPTIONAL { ?film dbo:rating ?rating . }
            OPTIONAL { ?film dbo:trailer ?trailer . }
            OPTIONAL {
                ?genre rdfs:label ?genreLabel .
                FILTER (lang(?genreLabel) = 'en')
            }
            FILTER (lang(?title) = 'en') .
            FILTER (lang(?abstract) = 'en') .
            FILTER (?releaseDate >= "2005-01-01"^^xsd:date)
        }
        LIMIT 500
    """)
    sparql.setReturnFormat(JSON)
    
    results = sparql.query().convert()
    
    return results


def get_movies(results: dict) -> list:
    """Get movies from SPARQL results, removing duplicates based on title."""

    movies = []
    seen_titles = set()  # Set for storing previously viewed titles

    for result in results["results"]["bindings"]:
        title = result["title"]["value"]
        if title not in seen_titles:  # Verify if the title has already been seen
            movie = {
                "Title": title,
                "Plot": result.get("abstract", {}).get("value", "N/A"),
                "Released": result.get("releaseDate", {}).get("value", "N/A"),
                "Director": result.get("director", {}).get("value", "N/A").split('/')[-1].replace('_', ' '),
                "Rated": result.get("ageRating", {}).get("value", "N/A"),
                "Poster": result.get("poster", {}).get("value", "N/A"),
                "Ratings": result.get("rating", {}).get("value", "N/A"),
                "Trailer": result.get("trailer", {}).get("value", "N/A"),
                "Genre": result.get("genreLabel", {}).get("value", "N/A"),
                "Runtime": result.get("runtime", {}).get("value", "N/A").replace('-', '')
            }
            movies.append(movie)
            seen_titles.add(title)  # Add title to the set of seen titles

    return movies


def save_json(movies: list):
    """Save data in json file with UTF-8 encoding."""
    
    with open('movies.json', 'w', encoding='utf-8') as json_file:
        json.dump(movies, json_file, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    results = start_sparql(ENDPOINT_URL)
    movies = get_movies(results)
    save_json(movies)
    print("Data saved in movies.json")