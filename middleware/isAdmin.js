// middleware/authenticate.js
const isAdmin = (req, res, next) => {
  // Periksa apakah pengguna sudah login
  if (req.session.user) {
    if (req.session.user.role == "admin") {
      return next(); // Lanjutkan jika sudah otentikasi
    }
    req.flash("errors", "anda tidak memiliki akses");
    return res.redirect("/login");
  }

  // Redirect atau tanggapan lain jika belum otentikasi
  res.redirect("/login");
};

module.exports = isAdmin;
