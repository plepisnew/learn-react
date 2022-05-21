class User {
    constructor(id, login, name) {
        this.id = id;
        this.login = login;
        this.name = name;
    }
}

const parseUser = (user) => {
    return Boolean(user.id) &&
        Boolean(user.login) &&
        Boolean(user.name)
}

module.exports = parseUser;