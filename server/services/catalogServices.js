import prisma from "./prisma.js";
import * as genreENUM from "../enum/genreENUM.js";

export const createCatalog = async (data) => {
    const { name, genres, genre } = data;
    const genreValues = genres.map(genre => genreENUM.getGenreValue(genre));
   
    try {
        const catalog = await prisma.catalog.create({
            data: {
                name: name,
                genres: {
                    connectOrCreate: genreValues.map(genreId => ({
                        where: { id: genreId },
                        create: { id: genreId }
                    }))
                }
            },
        });
        return catalog;
    } catch (err) {
        console.error('Catalog not created', err);
        throw new Error('Catalog not created');
    }
};

export const setName = async (id, name) => {
    try {
        const catalog = await prisma.catalog.update({
            where: { id: id },
            data: {
                name: name,
            },
        });
        return catalog;
    } catch (err) {
        console.error('Error setting name', err);
        throw new Error('Error setting name');
    }
};

export const setGenres = async (id, genres) => {
    const genreValues = genres.map(genre => genreENUM.getGenreValue(genre));

    try {
        const catalog = await prisma.catalog.update({
            where: { id: id },
            data: {
                genres: {
                    set: [],  // clear existing genres
                    connectOrCreate: genreValues.map(genreId => ({
                        where: { id: genreId },
                        create: { id: genreId }
                    }))
                }
            },
        });
        return catalog;
    } catch (err) {
        console.error('Error setting genres', err);
        throw new Error('Error setting genres');
    }
};

export const setDescription = async (id, description) => {
    try {
        const catalog = await prisma.catalog.update({
            where: { id: id },
            data: {
                description: description,
            },
        });
        return catalog;
    } catch (err) {
        console.error('Error setting description', err);
        throw new Error('Error setting description');
    }
};

export const deleteCatalog = async (id) => {
    try {
        const catalog = await prisma.catalog.delete({
            where: { id: id },
        });
        return catalog;
    } catch (err) {
        console.error('Error deleting catalog', err);
        throw new Error('Error deleting catalog');
    }
};

export const addMovie = async (catalogId, movieId) => {
    try {
        const catalog = await prisma.catalog.update({
            where: { id: catalogId },
            data: {
                movies: {
                    connect: { id: movieId },
                },
            },
        });
        return catalog;
    } catch (err) {
        console.error('Error adding movie', err);
        throw new Error('Error adding movie');
    }
};

export const removeMovie = async (catalogId, movieId) => {
    try {
        const catalog = await prisma.catalog.update({
            where: { id: catalogId },
            data: {
                movies: {
                    disconnect: { id: movieId },
                },
            },
        });
        return catalog;
    } catch (err) {
        console.error('Error removing movie', err);
        throw new Error('Error removing movie');
    }
};