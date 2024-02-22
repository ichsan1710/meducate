// middleware/authenticate.js
const isUser = (req, res, next) => {
  // Periksa apakah pengguna sudah login
  if (req.session.user) {
    if (req.session.user.role == "user") {
      return next(); // Lanjutkan jika sudah otentikasi
    }
    req.flash("errors", "anda tidak memiliki akses");
    return res.redirect("/login");
  }

  // Redirect atau tanggapan lain jika belum otentikasi
  res.redirect("/login");
};

module.exports = isUser;
