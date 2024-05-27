import prisma from "../services/prisma.js";

//MUDAR ISSO AQUI PRA DEIXAR CERTINHO OS TIPOS DE GENERO
export const Genre = Object.freeze({
    PLACEHOLDER: 1,
    ACTION: 2,
    COMEDY: 3,
    DRAMA: 4,
    HORROR: 5
   
});
  
export const GenreNames = Object.freeze({
    1: 'PLACEHOLDER',
    2: 'ACTION',
    3: 'COMEDY',
    4: 'DRAMA',
    5: 'HORROR'
   
});

// services/genre.js
export function getGenreName(genreValue) {
    return GenreNames[genreValue] || 'UNKNOWN';
}
  
export function getGenreValue(genreName) {
    return Genre[genreName.toUpperCase()] || null;
}
  
export const initializeGenres = async () => {
    const genreEntries = Object.entries(Genre);
    for (const [genreName, genreId] of genreEntries) {
        try {
            await prisma.genre.upsert({
                where: { id: genreId },
                update: {},
                create: { id: genreId, name: genreName },
            });
        } catch (err) {
            console.error(`Error creating genre ${genreName}`, err);
        }
    }
};
