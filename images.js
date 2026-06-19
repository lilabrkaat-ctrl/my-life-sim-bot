// images.js

const IMAGES = {
    main: "AgACAgQAAxkBAAEq6gABajUSmQmi2dgKSe-mMhBGac5Du8MAApkOaxsw4ahRBU6BXKC1iP4BAAMCAAN5AAM8BA",
    scout: "AgACAgQAAxkBAAEq6gFqNRKZMX_2DsIKHkdhZJsEJsaEEAACkA5rGzDhqFH33QABNqECBEQBAAMCAAN5AAM8BA",
    player: "AgACAgQAAxkBAAEq6gJqNRKZvYoG5JT3dL96dZg9EFSrBQACkg5rGzDhqFGvLg1dXyM42wEAAwIAA3kAAzwE",
    training: "AgACAgQAAxkBAAEq6gNqNRKZfMM__OhyB17UhtAzVvbRQQAClA5rGzDhqFGgAAEPDzznJ2UBAAMCAAN5AAM8BA",
    contract: "AgACAgQAAxkBAAEq6gVqNRKZDZlswJLRNhWNrVd6_x_3KwACmg5rGzDhqFFnqUrHYgQRxgEAAwIAA3kAAzwE",
    sell: "AgACAgQAAxkBAAEq6gZqNRKZcW2HZKS0Grop9XwnlpC39QACmw5rGzDhqFGf8qbn0ZxCjgEAAwIAA3kAAzwE",
    fame: "AgACAgQAAxkBAAEq6gdqNRKZr6S4FG0DyZwS1phMkOtsEwACnA5rGzDhqFEubOIDLZvWsgEAAwIAA3kAAzwE"
};

function getImage(name) {
    return IMAGES[name] || IMAGES.main;
}

module.exports = { IMAGES, getImage };