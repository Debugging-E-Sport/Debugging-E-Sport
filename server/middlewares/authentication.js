const authentication = async (req, res, next) => {
  try {
    console.log(req.headers);
    const { authorization } = req.headers;
  } catch (error) {
    next(error);
  }
};
