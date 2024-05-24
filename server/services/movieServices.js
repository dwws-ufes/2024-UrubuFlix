import prisma from "./prisma.js";
import * as genreENUM from "../enum/genreENUM.js";

export const createMovie = async (data) => {
    const { name, genre} = data;

    try {
      const movie = await prisma.movie.create({
        data: {
          name: name,
          rating: 0,
          genre: genreENUM.getGenreValue(genre), 
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

export const setGenre = async (id, genre) => {
    try {
      const movie = await prisma.movie.update({
        where: { id: id },
        data: {
          genre: genreENUM.getGenreValue(genre),
        },
      });
      return movie;
    } catch (err) {
      console.error('Error setting genre', err);
      throw new Error('Error setting genre');
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
          rating: rating,
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
          ageRating: ageRating,
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
          releaseDate: releaseDate,
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
}







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
        where: { title: title },
      });
      return movie;
    } catch (err) {
      console.error('Error finding movie by title', err);
      throw new Error('Error finding movie');
    }
};