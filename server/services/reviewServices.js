import prisma from "./prisma.js";
import * as userServices from "./userServices.js";
import * as movieServices from "./movieServices.js";

export const createReview = async (data) => {
    const { userId, movieId, rating, comments } = data;
    try {
        const user = await userServices.findUserById(userId);
        
        const movie_id = Number(movieId);
        const movie = await movieServices.findMovieById(movie_id);
        
        const review = await prisma.review.upsert({
            where: { user_id_movie_id: { user_id: user.id, movie_id: movie.id } },
            update: { rating: rating, comment: comments },
            create: {
                rating: rating,
                comment: comments,
                user: { connect: { id: user.id } },
                movie: { connect: { id: movie.id } },
            },
        });
        return review;
    } catch (err) {
        console.error('Review not created', err);
        throw new Error('Review not created');
    }
};

export const deleteReview = async (data) => {
    const { userid, movieid } = data;
    
    const movie_id = Number(movieid);
    const user = await userServices.findUserById(userid);
    const movie = await movieServices.findMovieById(movie_id);
        
    try {
        await prisma.review.delete({
            where: { user_id_movie_id: { user_id: user.id, movie_id: movie.id } }
        });
        return;
    } catch (err) {
        console.error('Error deleting review', err);
        throw new Error('Error deleting review');
    }
};


export const findReviewById = async (userId, movieId) => {
    try {
        const review = await prisma.review.findUnique({
           where: { userId_movieId: { userId: userId, movieId: movieId } },
        });
        return review;
    } catch (err) {
        console.error('Error finding review by id', err);
        throw new Error('Error finding review');
    }
};

export const findReviewByUser = async (userId) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { userId: userId },
            include: {
                user: true,
                movie: true,
            },
        });
        return reviews;
    } catch (err) {
        console.error('Error finding review by user', err);
        throw new Error('Error finding review');
    }
};

export const findReviewByMovie = async (movieId) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { movie_id: movieId },
            include: {
                user: true,
                movie: true,
            },
        });
        return reviews;
    } catch (err) {
        console.error('Error finding review by movie', err);
        throw new Error('Error finding review');
    }
};

export const updateReview = async (data) => {
    const { id, rating, comment } = data;
    try {
        const review = await prisma.review.update({
            where: { id: id },
            data: {
                rating: rating,
                comment: comment,
            },
        });
        return review;
    } catch (err) {
        console.error('Error updating review', err);
        throw new Error('Error updating review');
    }
}
