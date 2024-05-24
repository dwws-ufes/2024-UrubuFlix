import prisma from "./prisma.js";
import * as genreENUM from "../enum/genreENUM.js";

export const createCatalog = async (data) => {
    const { name, genre} = data;
    const genreValue = genreENUM.getGenreValue(genre);
    try {
        const catalog = await prisma.catalog.create({
            data: {
                name: name,
                genre: genreValue
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

export const setGenre = async (id, genre) => {
    try {
        const catalog = await prisma.catalog.update({
            where: { id: id },
            data: {
                genre: genreENUM.getGenreValue(genre),
            },
        });
        return catalog;
    } catch (err) {
        console.error('Error setting genre', err);
        throw new Error('Error setting genre');
    }
};

export const setdescription = async (id, description) => {
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