// if User request invalid route.
const notFound = (req, res, next) => {
    const error = new Error(`Invalid request - ${req.originalURL}`);
    res.status(404);
    next(error);
};
// General error handler
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        error: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

export { notFound, errorHandler };
