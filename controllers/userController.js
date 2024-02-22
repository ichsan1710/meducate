const { User, Course, Category, Enrollment, UserProfile} = require("../models")
const nodemailer = require("nodemailer")
const {Op} = require('sequelize')
const bcrypt = require("bcryptjs")
const { PDFDocument } = require('pdf-lib');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ichsanmochammad@gmail.com",
    pass: "gezutealdsqcfnpp",
  },
});

class UserController {
  constructor() {}
  static async createUser(req, res) {
    try {
      const { userName, password, email, role } = req.body;

      // Hash password sebelum disimpan di database
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        userName,
        password: hashedPassword,
        email,
        role,
      });

      res.redirect("/users");
    } catch (error) {
      console.log(error);
      const message = error.errors[0].message
      res.redirect(`/users?message=${message}`);
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll();

      res.render("admin_users", { users });
    } catch (error) {
      console.error(error);
      res.redirect("login");
    }
  }

  static async getUserById(req, res) {
    try {
      const id = req.params.id;

      const user = await User.findByPk(id);

      if (!user) {
        res.redirect("/users");
      }
      res.render("admin_users_edit", { user });
    } catch (error) {
      res.redirect("/users");
    }
  }

  static async getEnrollmentByUserId (req, res) {
    try {
      const id = req.params.id

      const user = await User.findByPk(id, {
        include: Enrollment,
      })

      res.render("admin_users_enrollment", { user })
    } catch (error) {
      res.redirect("/users")
    }
  }

  static async updateUserById(req, res) {
    const id = req.params.id;
    const { userName, password, email, role } = req.body
    try {
      console.log("update")

      if (password == "") {
        let user = await User.findByPk(id)
        res.render("admin_users_edit", {
          user,
          errors: [
            {
              message: "Tolong isi password",
            },
          ],
        })
      }

      const user = await User.findByPk(id)

      if (!user) {
        console.log("redirect");
        return res.redirect(`/users/${id}`)
      }

      // Hash password baru jika ada
      const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : user.password;

      await user.update({
        userName,
        password: hashedPassword,
        email,
        role,
      });

      return res.redirect("/users")
    } catch (errors) {
      let user = await User.findByPk(id)
      console.log(errors)
      res.render("admin_users_edit", { user, errors });
    }
  }

  static async remove(req, res) {
    const id = req.params.id

    let displayTitle = ""
    // validasi antara course dan user ID nya
    try {
      User.findByPk(id)
        .then((user) => {
          if (!user) {
            return res.redirect("/users")
          }

          displayTitle = user.userName

          // untuk remove Category dari database nya
          return User.destroy({
            where: {
              id: id,
            },
          })
        })
        .then(() => {
          res.redirect(`/users?message=success deleted ${displayTitle}`)
        })
        .catch((error) => {
          res.redirect(`/users?message=failed deleted ${error.message}`)
        })
    } catch (error) {
      res.redirect(`/users?message=failed deleted ${error.message}`)
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body

      const user = await User.findOne({
        where: {
          email: email,
        },
      })

      if (!user) {
        return res.redirect("/login")
      }

      // untuk validasi password nya
      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        return res.redirect("/login")
      }

      if (req.session) {
        req.session.user = {
          id: user.id,
          userName: user.username,
          email: user.email,
          role: user.role,
        };
        if (user.role == "admin") {
          return res.redirect("/users/home/dashboard")
        } else {
          return res.redirect("/users/role/home")
        }
      } else {
        res.status(500).send("Session not initialized")
      }
    } catch (error) {
      console.log(error);
      res.redirect("/login")
    }
  }

  static async dashboard(req, res) {
    const user = req.session.user
    try {
      if (user) {
        if (user.role === "admin") {
          let totalUser = await User.count()
          let totalCourse = await Course.count()
          let totalCategory = await Category.count()
          let courses = await Course.findAll({
            include: "category",
          })
          res.render("admin_dashboard", {
            totalUser,
            totalCourse,
            totalCategory,
            courses,
          });
        } else {
          return res.render("dashboard")
        }
      } else {
        res.redirect("/login")
      }
    } catch (error) {
      console.log(error)
      res.redirect("/login")
    }
  }

  static async register(req, res) {
    try {
      const { userName, password, email } = req.body

      // Hash password sebelum disimpan di database
      const hashedPassword = await bcrypt.hash(password, 10)
      await User.create({
        userName,
        password: hashedPassword,
        email,
        role: "user",
      });

      res.redirect("/login")
    } catch (error) {
      console.error(error)
      res.redirect("/register")
    }
  }

  static async userDashboard(req, res) {
    try {
      const user = req.session.user

      let enrollments = await Enrollment.findAll({
        include: {
          model: Course,
          as: "course"
        },
        where: {
          user_id: user.id,
          status: 0
        }
      })
      res.render("dashboard", {
        user,
        enrollments
      });
    } catch (error) {
      console.error("Error fetching enrollments:", error)
      res.redirect("/login")
    }
  }

  static async userAllCourse(req, res) {
    let courses

    try {
      if (req.query.search_box) {
        courses = await Course.findAll({
          include: [
            {
              model: Category,
              as: "category",
            },
          ],
          where: {
            title: {
              [Op.iLike]: `%${req.query.search_box}%`,
            },
          },
        })
      } else {
        courses = await Course.findAll({
          include: [
            {
              model: Category,
              as: "category",
            },
          ],
        });
      }

      let user = req.session.user

      res.render("user_courses", {
        courses,
        user,
      });
    } catch (error) {
      console.log(error)
    }
  }

  static async enroll(req, res) {
    const user = req.session.user

    try {
      const data = req.body

      let enrol = await Enrollment.create(data)
      const baseUrl = `${req.protocol}://${req.get("host")}`
      let url = `${baseUrl}/users/role/course/confirm/${enrol.id}`

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { height } = page.getSize();

      page.setFontSize(12);
      page.drawText('CONGRATULATIONS ' + user.email, { x: 50, y: height - 100 });
      page.drawText('You have enrolled in the course with ID ' + enrol.id + '.', { x: 50, y: height - 150 });
      page.drawText('We have sent an email verification, please open and verify your enrollment!', { x: 50, y: height - 175 });
      page.drawText('Thank you and Best Regards,', { x: 50, y: height - 225 });
      page.drawText('Meducate Admission Team', { x: 50, y: height - 250 });

      const pdfBytes = await pdfDoc.save();

      const mailOptions = {
        from: "meducatedummy@gmail.com",
        to: user.email,
        subject: "Enrollment Confirmation E-Mail",
        html: `
            <p>Thank you for enrolling in the course. Your enrollment has been confirmed.</p>
            <p>Please click the following link to confirm your enrollment:</p>
            <a href="${url}" target="_blank" style="display: inline-block; padding: 10px; background-color: #007BFF; color: #fff; text-decoration: none;">Confirm Enrollment</a>
          `,
          attachments: [
            {
              filename: 'enrollment_confirmation.pdf',
              content: pdfBytes,
              encoding: 'base64',
            },
          ],
      };

      await transporter.sendMail(mailOptions)
      return res.redirect("/users/role/home")
    } catch (error) {
      console.log(error)
      return res.redirect(`/users/role/courses?message=${error}`)
    }
  }

  static async updateStatusCourse(req, res) {
    try {
      const id = req.params.id
      await Enrollment.update(
        { status: 1 },
        { where: { id: id } }
      );
      res.render("status_update", {});
    } catch (error) {
      console.log(error)
      res.redirect("/")
    }
  }
  static async getUserCourseById(req, res) {
    try {
      const id = req.params.id;
      let course = await Course.findByPk(id, {
        include: "category",
      });
      if (course) {
        return res.render("user_course_detail", {
          course,
        });
      } else {
        res.redirect("/users/role/home")
      }
    } catch (error) {
      console.log(error);
      res.redirect("/users/role/home")
    }
  }

  static async getProfile(req, res) {
    const user = req.session.user
    try {
      // Check if the user already has a UserProfile
      const userProfile = await UserProfile.findOne({
        where: { user_id: user.id },
      });

      if (!userProfile) {
        const userProfile = await UserProfile.create({
          user_id: user.id,
        });
        return res.render("user_profile", { userProfile, user })
      } else {
        return res.render("user_profile", { userProfile, user })
      }
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).send("Internal Server Error")
    }
  }

  static async updateProfile(req, res) {
    const user = req.session.user

    const { bio, otherDetails, dateBirth } = req.body

    try {
      const userProfile = await UserProfile.findOne({
        where: { user_id: user.id },
      });
      await userProfile.update({
        bio,
        otherDetails,
        dateBirth,
      });
      return res.redirect("/users/role/profile?message=success update")
    } catch (error) {
      console.log(error);
      return res.redirect(`/users/role/profile?message=${error.message}`)
    }
  }
}

module.exports = UserController