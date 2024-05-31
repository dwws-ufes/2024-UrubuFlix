import prisma from "./prisma.js";
import * as userServices from "./userServices.js";
import * as movieServices from "./movieServices.js";

export const createReview = async (data) => {
    const { userId, movieId, rating, comment } = data;
    try {
        const user = await userServices.findUserById(userId);
        const movie = await movieServices.findMovieById(movieId);

        const review = await prisma.review.create({
            data: {
                rating: rating,
                comment: comment,
                user: { connect: { id: user.id } },
                movie: { connect: { id: movie.id } }
            },
        });
        return review;
    } catch (err) {
        console.error('Review not created', err);
        throw new Error('Review not created');
    }
};

export const deleteReview = async (id) => {
    try {
        const review = await prisma.review.delete({
            where: { id: id },
        });
        return review;
    } catch (err) {
        console.error('Error deleting review', err);
        throw new Error('Error deleting review');
    }
};

export const findReviewById = async (id) => {
    try {
        const review = await prisma.review.findUnique({
            where: { id: id },
            include: {
                user: true,
                movie: true,
            },
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
            where: { movieId: movieId },
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
