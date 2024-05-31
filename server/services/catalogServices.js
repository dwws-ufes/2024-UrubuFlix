import prisma from "./prisma.js";
import * as genreENUM from "../enum/genreENUM.js";
import * as movieServices from "./movieServices.js";
export const createCatalog = async (data) => {
    const { name, genres} = data;
   
    try {
        const catalog = await prisma.catalog.create({
            data: {
                name: name,
                
            },
        });
        await setGenres(catalog.id,genres);
        return catalog;
    } catch (err) {
        const catalog = await findCatalogName(name);
        await deleteCatalog(catalog.id);
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
    const genreEntities = await Promise.all(genres.map(genre => genreENUM.findOrCreateGenre(genre)));
    
    try {
        const catalog = await prisma.catalog.update({
            where: { id: id },
            data: {
                genres: {
                    set: [],  // clear existing genres
                    create: genreEntities.map(genre => ({
                        genre: {
                            connect: { id: genre.id }
                        }
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


export const addMovie= async (catalogId, movieId) => {
    try {
        // Verifica se a relação já existe
        const existingEntry = await prisma.catalog_has_movie.findUnique({
            where: {
                catalog_id_movie_id: {
                    catalog_id: catalogId,
                    movie_id: movieId,
                },
            },
        });

        if (existingEntry) {
            return ;
        }

        // Adiciona o filme ao catálogo
        const catalogMovie = await prisma.catalog_has_movie.create({
            data: {
                catalog_id: catalogId,
                movie_id: movieId,
            },
        });

        return { status: true, message: 'Movie added successfully', catalogMovie };
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
export const findCatalogID = async (id) => {
    try {
        const catalog = await prisma.catalog.findUnique({
            where: { id: id },
        });
        return catalog;
    } catch (err) {
        console.error('Error finding catalog', err);
        throw new Error('Error finding catalog');
    }
};
export const findCatalogName = async (name) => {
    try {
        const catalog = await prisma.catalog.findUnique({
            where: { name: name },
        });
        return catalog;
    } catch (err) {
        console.error('Error finding catalog', err);
        throw new Error('Error finding catalog');
    }
};

export const initializeCatalogs = async () => {
    const genres = await genreENUM.getAllGenres();
    for(let i = 0; i < genres.length; i++) {
        if(genres[i].name != 'PLACEHOLDER') {
            try{
                let catalog=await findCatalogName(genres[i].name);
                if(!catalog){
                    catalog = await createCatalog({name:genres[i].name, genres :[genres[i].name]});
                }
                const movies=await movieServices.getMoviesByGenre(genres[i].id);
                for(let j=0;j<movies.length;j++){
                    await addMovie(catalog.id,movies[j].id);
                }
            }
            catch (err) {
                console.error('Error creating catalog genre', err);
            }
        }
    }
    console.log('Catalogs initialized');
    


};

export const getAllCatalogs = async () => {
    const genreP = await genreENUM.getGenreValue('PLACEHOLDER');
    try {
        const catalogs = await prisma.catalog.findMany({
            where: {
                NOT: {
                    genres: {
                        some: {
                            genreId: genreP
                        }
                    }
                }
            }     
        });  
        return catalogs;
    } catch (err) {
        console.error('Error getting all catalogs', err);
        throw new Error('Error getting all catalogs');
    }
}