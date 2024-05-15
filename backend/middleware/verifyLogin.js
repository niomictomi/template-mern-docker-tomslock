const verifyLogin = async (req, res, next) => {
  if (!req.session._id || !req.session.role)
    return res.status(403).json({ pesan: "Otorisasi gagal" });

  next();
};

export default verifyLogin;
