export let users = [];

export const addUser = (user) => {
    users.push(user);
};

export const findUserByEmail = (email) => {
    return users.find(user => user.email === email);
};

export const updateUser = (userId, data) => {
    const userIndex = users.findIndex(user => user.userId === userId);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...data };
    }
};