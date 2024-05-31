import prisma from "../services/prisma.js";

//MUDAR ISSO AQUI PRA DEIXAR CERTINHO OS TIPOS DE GENERO
export const Genre = Object.freeze({
    PLACEHOLDER: 1,
    ACTION: 2,
    COMEDY: 3,
    DRAMA: 4,
    HORROR: 5
});
  

// services/genre.js
export async function findOrCreateGenre(genreName) {
    try {
        const genre = await prisma.genre.upsert({
            where: { name: genreName },
            update: {},
            create: { name: genreName },
        });
        return genre;
    } catch (err) {
        console.error('Error finding or creating genre', err);
        throw new Error('Error finding or creating genre');
    }
};
export async function getGenreName(genreValue)  {
    try{
        const genre = await prisma.genre.findUnique({
            where: { id: genreValue },
        });
        return genre.name;
    }
    catch (err) {
        console.error('Error finding genre by value', err);
        throw new Error('Error finding genre');
    }
}
  
export async function getGenreValue(genreName){
    try{
        const genre = await prisma.genre.findUnique({
            where: { name: genreName },
        });
        return genre.id;
    }
    catch (err) {
        console.error('Error finding genre by name', err);
        throw new Error('Error finding genre');
    }
}

export async function initializeGenres() {
    const nome = 'PLACEHOLDER';
    try {
        const genre = await findOrCreateGenre(nome);
        console.log('Genre initialized', genre);
    } catch (err) {
        console.error('Error initializing genre', err);
    }
};

export async function getAllGenres() {
    try {
        const genres = await prisma.genre.findMany();
        return genres;
    } catch (err) {
        console.error('Error getting genres', err);
        throw new Error('Error getting genres');
    }
}