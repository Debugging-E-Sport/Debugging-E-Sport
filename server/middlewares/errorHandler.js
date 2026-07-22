function errorHandler(error, req, res, next) {
  console.log(error);
  let message = "Internal Server Error";
  let status = 500;

  if (error.name === "userNotNull") {
    message = "username or password cannot be empty.";
    status = 400;
  }

  if (error.name === "SequelizeValidationError") {
    message = error.errors[0].message;
    status = 400;
  }

  if (error.name === "userNotFound") {
    message = "user not found";
    status = 403;
  }

  if (error.name === "notFoundAuthorization") {
    message = "Token Not Found";
    status = 403;
  }

  if (error.name === "RoomNotFound") {
    message = "Room Not Found";
    status = 403;
  }

  if (error.name === "JsonWebTokenError") {
    message = "Invalid token";
    status = 401;
  }
  if (error.name === "TokenExpiredError") {
    message = "Token expired";
    status = 401;
  }
  if (error.name === "SequelizeUniqueConstraintError") {
    message = error.errors[0].message;
    status = 409;
  }
  if (error.name === "Forbidden") {
    message = "Forbidden";
    status = 403;
  }
  if (error.name === "GameAlreadyStarted") {
    message = "Game already started";
    status = 400;
  }

  res.status(status).json({
    message,
  });
}

module.exports = errorHandler;
