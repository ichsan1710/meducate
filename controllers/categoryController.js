const { Category } = require("../models")

class CategoryController {
  static async findAll(req, res) {
    try {
      var categories = await Category.findAll()

      res.render("admin_category", { categories })
    } catch (error) {
      console.log(error)
    }
  }

  static async post(req, res) {
    try {
      const { name } = req.body
     
      await Category.create({
        name: name,
      })
      res.redirect("/categories")
    } catch (error) {
      console.log(error);
      res.redirect("/categories")
    }
  }

  static async findById(req, res) {
    try {
      const id = req.params.id
      
      let category = await Category.findByPk(id)
      if (category) {
        res.render("admin_category_edit", {
          category,
        });
      } else {
        res.redirect("/categories")
      }
    } catch (error) {
      console.log(error)
    }
  }
  static async update(req, res) {
    const id = req.params.id
    const { name } = req.body

    try {
      // validasi antara course dan id nya
      const exitingCategory = await Category.findByPk(id)
      if (!exitingCategory) {
        return res.redirect("/categories")
      }
      const data = {
        name: name,
      };

      await Category.update(data, {
        where: {
          id: id,
        },
      });

      res.redirect(`/categories`)
    } catch (error) {
      console.log(error)
      res.redirect(`/categories/${id}`)
    }
  }

  static async remove(req, res) {
    try {
      const id = req.params.id
      let displayTitle = ""
      Category.findByPk(id)
        .then((category) => {
          if (!category) {
            return res.redirect("/categories?message=category not found")
          }
          displayTitle = category.name
          return Category.destroy({
            where: {
              id: id,
            },
          });
        })
        .then(() => {
          res.redirect(`/categories?message=category ${displayTitle} deleted`)
        })
        .catch((error) => {
          res.redirect(`/categories?message=category ${error.message} deleted`)
        });
    } catch (error) {
      console.log(error);
      res.redirect(`/categories?message=category ${error.message} deleted`)
    }
  }
}

module.exports = CategoryController