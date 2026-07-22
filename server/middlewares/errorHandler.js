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

  if (error.name === "userNotFound") {
    message = "User Not Found";
    status = 403;
  }

  if (error.name === "RoomNotFound") {
    message = "Room Not Found";
    status = 403;
  }

  res.status(status).json({
    message,
  });
}

module.exports = errorHandler;
