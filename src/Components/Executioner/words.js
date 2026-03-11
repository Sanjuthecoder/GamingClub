export const WORDS_3_LETTER = [
    "ANT", "BAT", "CAT", "DOG", "EGG", "FOX", "HAT", "ICE", "JAR", "KEY",
    "LOG", "MUD", "NUT", "OWL", "PIG", "RAT", "SUN", "TOY", "VAN", "ZOO",
    "BUG", "COW", "FLY", "HEN", "JOY", "MAP", "PEN", "RUN", "SAD", "TOP"
];

export const WORDS_4_LETTER = [
    "BALL", "BEAR", "BIRD", "BOAT", "BOOK", "CAKE", "DOOR", "DUCK", "FISH", "FROG",
    "GIRL", "GOAT", "HELP", "JUMP", "KIND", "LION", "MILK", "MOON", "NEST", "PLAY",
    "RAIN", "RING", "SNOW", "STAR", "TREE", "WIND", "WOLF", "WOOD", "YARD", "ZERO"
];

export const WORDS_5_LETTER = [
    "APPLE", "BEACH", "CHAIR", "CLOUD", "DANCE", "EARTH", "GRAPE", "HAPPY", "HORSE", "HOUSE",
    "JUICE", "LEMON", "MAGIC", "MOUSE", "NIGHT", "OCEAN", "PANDA", "PIZZA", "QUEEN", "RIVER",
    "SHEEP", "SMILE", "SNAKE", "TABLE", "TIGER", "TRAIN", "WATER", "WHEEL", "ZEBRA"
];

export const getRandomWord = (length) => {
    let wordList = WORDS_5_LETTER; // default
    if (length === 3) wordList = WORDS_3_LETTER;
    if (length === 4) wordList = WORDS_4_LETTER;

    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
};

export const shuffleLetters = (word) => {
    let letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    // If shuffle didn't change it, shuffle again
    if (letters.join('') === word) {
        return shuffleLetters(word);
    }
    return letters;
};

