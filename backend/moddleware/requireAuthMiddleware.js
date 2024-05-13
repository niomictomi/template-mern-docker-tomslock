const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    res.status(401).json({ message: "Unauthorized. Please log in." });
  }
};

export default requireAuth;
