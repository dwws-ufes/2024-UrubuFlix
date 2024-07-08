import fs from 'fs';
import prisma from "./prisma.js";
import * as genreENUM from "../enum/genreENUM.js";
import * as reviewServices from "./reviewServices.js";
import { DataFactory } from 'rdf-data-factory';
import xmlbuilder from 'xmlbuilder';

const dataFactory = new DataFactory();


const isValidDate = (dateString) => {
    return !isNaN(Date.parse(dateString));
};

export const createMovie = async (data) => {
    const { name, genres } = data;
    try {
        const movie = await prisma.movie.create({
            data: {
                name: name,
                total_rating: 0,
            },
        });
        await setGenres(movie.id, genres);
        return { status: true, message: 'Movie created successfully', movie };
    } catch (err) {
        console.error('Movie not created', err);
        throw new Error('Movie not created');
    }
};

export const setName = async (id, name) => {
    try {
        const movie = await prisma.movie.update({
            where: { id: id },
            data: {
                name: name,
            },
        });
        return movie;
    } catch (err) {
        console.error('Error setting name', err);
        throw new Error('Error setting name');
    }
};

export const setGenres = async (id, genres) => {
    const genreEntities = await Promise.all(genres.map(genre => genreENUM.findOrCreateGenre(genre)));
   
    try {
        const movie = await prisma.movie.update({
            where: { id: id },
            data: {
                genres: {
                    set: [],  // clear existing genres
                    create: genreEntities.map(genre => ({
                        genre: {
                            connect: { id: genre.id }
                        }
                    }))
                },
            },
        });
        return movie;
    } catch (err) {
        console.error('Error setting genres', err);
        throw new Error('Error setting genres');
    }
};

export const setSynopsis = async (id, synopsis) => {
    try {
        const movie = await prisma.movie.update({
            where: { id: id },
            data: {
                synopsis: synopsis,
            },
        });
        return movie;
    } catch (err) {
        console.error('Error setting synopsis', err);
        throw new Error('Error setting synopsis');
    }
};

export const setRating = async (id, rating) => {
    try {
        const movie = await prisma.movie.update({
            where: { id: id },
            data: {
                total_rating: rating,
            },
        });
        return movie;
    } catch (err) {
        console.error('Error setting rating', err);
        throw new Error('Error setting rating');
    }
};

export const setAgeRating = async (id, ageRating) => {
    try {
        const movie = await prisma.movie.update({
            where: { id: id },
            data: {
                age_rating: ageRating,
            },
        });
        return movie;
    } catch (err) {
        console.error('Error setting age rating', err);
        throw new Error('Error setting age rating');
    }
};

export const setTrailer = async (id, trailer) => {
    try {
        const movie = await prisma.movie.update({
            where: { id: id },
            data: {
                trailer: trailer,
            },
        });
        return movie;
    } catch (err) {
        console.error('Error setting trailer', err);
        throw new Error('Error setting trailer');
    }
};

export const setReleaseDate = async (id, releaseDate) => {
    try {
        const movie = await prisma.movie.update({
            where: { id: id },
            data: {
                release_date: releaseDate,
            },
        });
        return movie;
    } catch (err) {
        console.error('Error setting release date', err);
        throw new Error('Error setting release date');
    }
};

export const setDirector = async (id, director) => {
    try {
        const movie = await prisma.movie.update({
            where: { id: id },
            data: {
                director: director,
            },
        });
        return movie;
    } catch (err) {
        console.error('Error setting director', err);
        throw new Error('Error setting director');
    }
};

export const setDuration = async (id, duration) => {
    const durationInt = parseInt(duration);
    try {
        const movie = await prisma.movie.update({
            where: { id: id },
            data: {
                duration: durationInt,
            },
        });
        return movie;
    } catch (err) {
        console.error('Error setting duration', err);
        throw new Error('Error setting duration');
    }
};

export const findMovieById = async (id) => {
    try {
        const movie = await prisma.movie.findUnique({
            where: { id: id },
            include: {
                genres: {
                    include: {
                        genre: true,
                    },
                },
            },
        });
        return movie;
    } catch (err) {
        console.error('Error finding movie by id', err);
        throw new Error('Error finding movie');
    }
};

export const findMovieByTitle = async (title) => {
    try {
        const movie = await prisma.movie.findMany({
            where: { name: title },
        });
        return movie;
    } catch (err) {
        console.error('Error finding movie by title', err);
        throw new Error('Error finding movie');
    }
};

export const deleteMovie = async (data) => {
    try {
        await prisma.movie.delete({
            where: { id: data },
        });

    } catch (err) {
        console.error('Error deleting movie', err);
        throw new Error('Error deleting movie');
    }
};

export const translateAgeRating = (ageRating) => {
    switch (ageRating) {
        case 'G':
            return 0;
        case 'PG':
            return 10;
        case 'PG-13':
            return 12;
        case 'R':
            return 17;
        case 'NC-17':
            return 16;
        case 'Not Rated':
            return null;
        default:
            return 18;
    }

};   

export const createFullMovie = async (data) => {
    const { name, genres, synopsis, total_rating, age_rating, trailer, release_date, director, duration, poster } = data;
    
    const age = translateAgeRating(age_rating);
    try {
        const movie = await prisma.movie.create({
            data: {
                name: name,
                total_rating: total_rating,
                synopsis: synopsis,
                age_rating: age,
                trailer: trailer,
                director: director,
                duration: duration,
                poster: poster,
            },
        });
        await setGenres(movie.id, genres);
        if (isValidDate(release_date)) {
            await prisma.movie.update({
                where: { id: movie.id },
                data: {
                    release_date: release_date,
                }
            });
        }
        return { status: true, message: 'Movie created successfully', movie };
    }
    catch (err) {
        console.error('Movie not created', err);
        throw new Error('Movie not created');
    }
};

export const setReviews = async (review) => {
    console.log("isso au",review);
    try {
        const movie = await prisma.movie.update({
            where: { id: review.movie_id },
            data: {
                reviews: review,
            },
        });
        return movie;
    } catch (err) {
        console.error('Error setting movies', err);
        throw new Error('Error setting movies');
    }

}

export const updateRating = async (id) => {
    
    const reviews = await reviewServices.findReviewByMovie(id);
   
    const rating  = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;
    try {
        const movie = await prisma.movie.update({
            where: { 
                id: id 
            },
            data: {
                total_rating: rating,
            },
        });
        return movie;
    } catch (err) {
        console.error('Error updating rating', err);
        throw new Error('Error updating rating');
    }
};

export const setMoviePoster = async (id, poster) => {
    try {
        const movie = await prisma.movie.update({
            where: { id: id },
            data: {
                poster: poster,
            },
        });
        return movie;
    } catch (err) {
        console.error('Error setting poster', err);
        throw new Error('Error setting poster');
    }
};
export const updateMovie = async (movieId, movieName, movieImage, movieDescription, movieGenre, movieYear, movieDuration, movieDirector) => {
   
    //console.log(movieId, movieName, movieImage, movieDescription, movieGenre, movieYear, movieDuration, movieDirector);

    // Verifique se movieId está presente
    if (!movieId) {
        return { status: false, message: 'Movie ID is required' };
    }

    try {
        // Verifique e atualize cada campo individualmente, se fornecido
        if (movieName && movieName.trim() !== '') {
            await setName(movieId, movieName);
        }
        if (movieImage && movieImage.trim() !== '') {
            await setMoviePoster(movieId, movieImage);
        }
        if (movieDescription && movieDescription.trim() !== '') {
            await setSynopsis(movieId, movieDescription);
        }
        if (movieGenre && Array.isArray(movieGenre) && movieGenre.length > 0) {
            await setGenres(movieId, movieGenre);
        }
        if (movieYear && !isNaN(Date.parse(movieYear))) {
            await setReleaseDate(movieId, new Date(movieYear));
        }
        if (movieDuration && !isNaN(movieDuration) && movieDuration > 0) {
            await setDuration(movieId, movieDuration);
        }
        if (movieDirector && movieDirector.trim() !== '') {
            await setDirector(movieId, movieDirector);
        }
        return { status: true, message: 'Movie updated successfully' };
    } catch (err) {
        console.error('Error updating movie', err);
        return { status: false, message: 'Error updating movie' };
    }
};

export const loadMoviesFromJSON = async (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const movies = JSON.parse(data);

        for (const movieData of movies) {
            const { Title, Rated, Released, Runtime, Genre, Director, Plot, Poster, Ratings, Trailer } = movieData;

            // Converta o formato de dados conforme necessário
            const genres = Genre.split(',').map(genre => genre.trim());
            const ratin = Ratings;
            const rating = ratin > 5 ? ratin/2 : ratin;
            const duration = parseInt(Runtime.split(' ')[0]);

            const movie = {
                name: Title,
                genres: genres,
                synopsis: Plot,
                total_rating: rating !== 'N/A' ? rating : 0,
                age_rating: Rated !== 'N/A' ? Rated : null,
                trailer: Trailer,
                release_date: new Date(Released),
                director: Director,
                duration: duration,
                poster: Poster,
            };

            await createFullMovie(movie);
        }

        console.log('Movies loaded and created successfully');
        return { status: true, message: 'Movies loaded and created successfully'}
    } catch (err) {
        console.error('Error loading movies from JSON', err);
        throw new Error('Error loading movies from JSON');
    }
};

export const initializeMovies = async (filePath) => {
    const countMovies = await prisma.movie.count();
    if(!fs.existsSync(filePath)){
        return console.log('File not found - movies.json, not starting the load of movies, please check the path');
    }
    else if(countMovies > 0){
        return console.log('Movies already loaded');
    }
    else{
        await loadMoviesFromJSON(filePath);
        return { status: true, message: 'Movies loaded and created successfully'}
    }
};

export const getMoviesByCatalog = async (catalogID) => {
    try {
        const movies = await prisma.movie.findMany({
            where: { catalog_has_movie: { id: catalogID } },
        });
        return movies;
    } catch (err) {
        console.error('Error finding movies by catalog', err);
        throw new Error('Error finding movies');
    }
};

export const getAllMovies = async () => {
    try {
        const movies = await prisma.movie.findMany({
            include: {
                genres: {
                    include: {
                        genre: true,
                    },
                },
            },
        });
        return movies;
    } catch (err) {
        console.error('Error finding movies', err);
        throw new Error('Error finding movies');
    }
};

export const getMoviesByGenre = async (genreID) => {
    try {
        const movies = await prisma.movie.findMany({
            where: { 
                genres: { 
                    some: { 
                        genreId: genreID 
                    } 
                } 
            },
        });
        return movies;
    } catch (err) {
        console.error('Error finding movies by genre', err);
        throw new Error('Error finding movies');
    }
};

export const getMoviesByFilter = async (movie) => {
    try {
        const movies = await prisma.movie.findMany({
            where : {
                name: {
                    contains: movie,
                  },
            }
        })
        return movies
    }
    catch (error){
        console.log(error);
        throw new Error('Error finding movies');
    } 
}

export async function createRDFXML(movieID) {
    const movie = await findMovieById(movieID);
    const reviews = await reviewServices.findReviewByMovie(movieID);

    const movieNode = dataFactory.namedNode(`http://localhost5173.org/movie/${movie.id}`);
    const dataset = [];

    
    dataset.push(dataFactory.quad(movieNode, dataFactory.namedNode('http://purl.org/dc/elements/1.1/title'), dataFactory.literal(movie.name)));

    if (movie.director) {
    dataset.push(dataFactory.quad(movieNode, dataFactory.namedNode('http://purl.org/dc/elements/1.1/creator'), dataFactory.literal(movie.director)));
    }

    if (movie.release_date) {
    dataset.push(dataFactory.quad(movieNode, dataFactory.namedNode('http://purl.org/dc/elements/1.1/date'), dataFactory.literal(movie.release_date.toISOString())));
    }

    if (movie.duration) {
    dataset.push(dataFactory.quad(movieNode, dataFactory.namedNode('http://purl.org/dc/elements/1.1/description'), dataFactory.literal(movie.duration.toString())));
    }

    // Adiciona reviews
    reviews.forEach((review, index) => {
    const reviewNode = dataFactory.namedNode(`http://localhost5173.org/review/${movie.id}/${index}`);

    if (review.comment) {
        dataset.push(dataFactory.quad(reviewNode, dataFactory.namedNode('http://purl.org/stuff/rev#text'), dataFactory.literal(review.comment)));
    }

    dataset.push(dataFactory.quad(reviewNode, dataFactory.namedNode('http://purl.org/stuff/rev#rating'), dataFactory.literal(review.rating.toString())));
    dataset.push(dataFactory.quad(reviewNode, dataFactory.namedNode('http://xmlns.com/foaf/0.1/name'), dataFactory.literal(review.user.username)));
    dataset.push(dataFactory.quad(movieNode, dataFactory.namedNode('http://purl.org/stuff/rev#hasReview'), reviewNode));
    });

    // Criar o documento RDF usando xmlbuilder
    const rdf = xmlbuilder.create('rdf:RDF', {
    version: '1.0',
    encoding: 'UTF-8'
    })
    .att('xmlns:rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
    .att('xmlns:rdfs', 'http://www.w3.org/2000/01/rdf-schema#')
    .att('xmlns:dc', 'http://purl.org/dc/elements/1.1/')
    .att('xmlns:foaf', 'http://xmlns.com/foaf/0.1/')
    .att('xmlns:rev', 'http://purl.org/stuff/rev#');

    // Adicionar o nó do filme
    const movieDesc = rdf.ele('rdf:Description', { 'rdf:about': movieNode.value });
    movieDesc.ele('rdf:type', { 'rdf:resource': 'http://schema.org/Movie' });
    movieDesc.ele('dc:title', movie.name);
    if (movie.director) {
    movieDesc.ele('dc:creator', movie.director);
    }
    if (movie.release_date) {
    movieDesc.ele('dc:date', movie.release_date.toISOString());
    }
    if (movie.duration) {
    movieDesc.ele('dc:description', movie.duration.toString());
    }

    // Adicionar reviews
    reviews.forEach((review, index) => {
    const reviewNode = `http://localhost5173.org/review/${movie.id}/${index}`;
    const reviewDesc = rdf.ele('rdf:Description', { 'rdf:about': reviewNode });
    reviewDesc.ele('rdf:type', { 'rdf:resource': 'http://schema.org/Review' });
    if (review.comment) {
        reviewDesc.ele('rev:text', review.comment);
    }
    reviewDesc.ele('rev:rating', review.rating.toString());
    reviewDesc.ele('foaf:name', review.user.username);
    movieDesc.ele('rev:hasReview', { 'rdf:resource': reviewNode });
    });

    // Converter para string XML
    const rdfXml = rdf.end({ pretty: true });
    return rdfXml;
     
 }