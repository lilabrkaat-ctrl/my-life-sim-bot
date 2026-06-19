// src/images.js

const IMG = {
    // قبلی
    main: "AgACAgQAAxkBAAEq6gABajUSmQmi2dgKSe-mMhBGac5Du8MAApkOaxsw4ahRBU6BXKC1iP4BAAMCAAN4AAM8BA",
    scout: "AgACAgQAAxkBAAEq6gFqNRKZMX_2DsIKHkdhZJsEJsaEEAACkA5rGzDhqFH33QABNqECBEQBAAMCAAN4AAM8BA",
    player: "AgACAgQAAxkBAAEq6gJqNRKZvYoG5JT3dL96dZg9EFSrBQACkg5rGzDhqFGvLg1dXyM42wEAAwIAA3gAAzwE",
    training: "AgACAgQAAxkBAAEq6gNqNRKZfMM__OhyB17UhtAzVvbRQQAClA5rGzDhqFGgAAEPDzznJ2UBAAMCAAN4AAM8BA",
    contract: "AgACAgQAAxkBAAEq6gVqNRKZDZlswJLRNhWNrVd6_x_3KwACmg5rGzDhqFFnqUrHYgQRxgEAAwIAA3gAAzwE",
    sell: "AgACAgQAAxkBAAEq6gZqNRKZcW2HZKS0Grop9XwnlpC39QACmw5rGzDhqFGf8qbn0ZxCjgEAAwIAA3gAAzwE",
    // جدید
    host: "AgACAgQAAxkBAAEq7iBqNVdr5Ez3dRG3RsDiHBVGSe9ypAAC7g5rGzDhqFGcfK9wUEep5QEAAwIAA3gAAzwE",
    reporter: "AgACAgQAAxkBAAEq7h9qNVdrZdoOoRxVBTXzBuJpJU_xBAAC7A5rGzDhqFGYotMuDCQZJgEAAwIAA3gAAzwE",
    trophy: "AgACAgQAAxkBAAEq7iJqNVdrloVa4_pSMPtZOuSCA4SLTgAC7w5rGzDhqFEDMDTjFqEVoAEAAwIAA3gAAzwE",
    clinic: "AgACAgQAAxkBAAEq7iNqNVdrX2zklFc5ujl01uGAlzifuQACHQ9rGzDhqFFUKuW65EXwJgEAAwIAA3gAAzwE",
    newspaper: "AgACAgQAAxkBAAEq7iRqNVdrjAbiyEbFjyPkazyArS8NigACHg9rGzDhqFGJ_GPv6-bEOAEAAwIAA3gAAzwE"
};

function G(n) { return IMG[n] || IMG.main; }

module.exports = { IMG, G };