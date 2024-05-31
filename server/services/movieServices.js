import fs from 'fs';
import prisma from "./prisma.js";
import * as genreENUM from "../enum/genreENUM.js";
import * as reviewServices from "./reviewServices.js";

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
    try {
        const movie = await prisma.movie.update({
            where: { id: id },
            data: {
                duration: duration,
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

export const deleteMovie = async (id) => {
    try {
        const movie = await prisma.movie.delete({
            where: { id: id },
        });
        return movie;
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


export const updateRating = async (id) => {
    
    const reviews = await reviewServices.findReviewByMovie(id);

    const rating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    
    try {
        const movie = await prisma.movie.update({
            where: { id: id },
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



export const loadMoviesFromJSON = async (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const movies = JSON.parse(data);

        for (const movieData of movies) {
            const { Title, Rated, Released, Runtime, Genre, Director, Plot, Poster, Ratings, Trailer } = movieData;

            // Converta o formato de dados conforme necessário
            const genres = Genre.split(',').map(genre => genre.trim());
            const rating = Ratings.length > 0 ? parseFloat(Ratings[0].Value.split('/')[0]) : 0;
            const duration = parseInt(Runtime.split(' ')[0]);

            const movie = {
                name: Title,
                genres: genres,
                synopsis: Plot,
                total_rating: rating,
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