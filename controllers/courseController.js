const { Course, Category } = require("../models")

class CourseController {
  
  static async findAll(req, res)  {
    try {
      var courses = await Course.findAll({
        include: "category",
      });
      var categories = await Category.findAll()
      res.render("admin_course", {
        courses,
        categories,
      });
    } catch (error) {
      console.log(error)
      res.redirect("/users/dashboard")
    }
  }

  static async post(req, res)  {
    try {
      const { title, description, instructor, duration, CategoryId } = req.body
      let data = {
        title: title,
        description: description,
        instructor: instructor,
        duration: duration,
        CategoryId: parseInt(CategoryId),
      };
      await Course.create(data)
      res.redirect("/courses")
    } catch (errors) {
      const message = errors.errors[0].message
      res.redirect(`/courses?message=${message}`)
    }
  }

  static async findById (req, res)  {
    const id = req.params.id
    try {
      let course = await Course.findByPk(id, {
        include: "category",
      });
      let categories = await Category.findAll()

      if (!course) {
        // Redirect kalau Course nya gak ada
        return res.redirect("/courses")
      } else {
        res.render("admin_course_edit", {
          course,
          categories,
        });
      }
    } catch (error) {
      console.log(error)
      res.redirect("/courses")
    }
  }

  static async update (req, res)  {
    const id = req.params.id
    const { title, description, instructor, duration, CategoryId } = req.body
    try {
      // Validasi antara course dan Id nya
      const existingCourse = await Course.findByPk(id)
      if (!existingCourse) {
        return res.redirect("/courses")
      }
      const data = {
        title: title,
        description: description,
        instructor: instructor,
        duration: duration,
        CategoryId: parseInt(CategoryId),
      };
      await Course.update(data, {
        where: {
          id: id,
        },
      });
      res.redirect(`/courses`)
    } catch (error) {
      console.log(error)
      res.redirect(`/courses/${id}`)
    }
  }

  static async remove (req, res)  {
    const id = req.params.id

    let displayTitle = ""
    // validasi lagi antara course dan Id nya
    try {
      Course.findByPk(id)
        .then((existingCourse) => {
          if (!existingCourse) {
            return res.redirect("/courses")
          }

          displayTitle = existingCourse.title

          // delete course dari database nya
          return Course.destroy({
            where: {
              id: id,
            },
          })
        })
        .then(() => {
          res.redirect(`/courses?message=success delete ${displayTitle}`)
        })
        .catch((error) => {
          res.redirect(`/courses?message=success delete ${error.message}`)
        })
    } catch (error) {
      console.log(error)
      res.redirect(`/courses?message=success delete ${displayTitle}`)
    }
  }
}


module.exports = CourseController
