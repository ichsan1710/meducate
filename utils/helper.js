const helper = {
    age: (value) => {
        const today = new Date()
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        return age
    }
}

module.exports = helper