import prisma from "./prisma.js";
import * as genreENUM from "../enum/genreENUM.js";

export const createMovie = async (data) => {
    const { name, genres } = data;
    const genreValues = genres.map(genre => genreENUM.getGenreValue(genre));

    try {
        const movie = await prisma.movie.create({
            data: {
                name: name,
                total_rating: 0,
                genres: {
                    connectOrCreate: genreValues.map(genreId => ({
                        where: { id: genreId },
                        create: { id: genreId }
                    }))
                },
            },
        });
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
    const genreValues = genres.map(genre => genreENUM.getGenreValue(genre));

    try {
        const movie = await prisma.movie.update({
            where: { id: id },
            data: {
                genres: {
                    set: [],  // clear existing genres
                    connectOrCreate: genreValues.map(genreId => ({
                        where: { id: genreId },
                        create: { id: genreId }
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

export const createFullMovieCSV = async (data) => {
    const {
        Title, Rated, Released, Runtime, Genre, Director, Plot, Poster, Ratings, Trailer
    } = data;

    // Calcular total_rating a partir das Ratings
    const totalRating = Ratings.reduce((sum, rating) => {
        const value = parseFloat(rating.Value.replace(/[^0-9.]/g, ''));
        return sum + value;
    }, 0) / Ratings.length;

    // Dividir Genre em valores separados por vírgula e mapear para IDs
    const genreValues = Genre.split(',').map(genre => genre.trim()).map(genreENUM.getGenreValue);

    try {
        const movie = await prisma.movie.create({
            data: {
                name: Title,
                age_rating: Rated,
                release_date: new Date(Released),
                duration: parseInt(Runtime),
                director: Director,
                synopsis: Plot,
                poster: Poster,
                total_rating: totalRating,
                trailer: Trailer,
                genres: {
                    connectOrCreate: genreValues.map(genreId => ({
                        where: { id: genreId },
                        create: { id: genreId, name: genreENUM.getGenreName(genreId) }
                    }))
                },
            },
        });
        return { status: true, message: 'Movie created successfully', movie };
    } catch (err) {
        console.error('Movie not created', err);
        throw new Error('Movie not created');
    }
}