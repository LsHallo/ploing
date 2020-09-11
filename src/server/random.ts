function generateId(length: number = 12): string {
    let possibleChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMONPQRSTUVWXYZ0123456789';
    let possibleLength = possibleChars.length;
    let chars = '';

    for(let i = 0; i < length; i++) {
        chars += possibleChars.charAt(Math.floor(Math.random() * possibleLength));
    }
    return chars;
}

function random(min: number, max: number) {
    let random = Math.random() * (max - min) + min;
    while(random === 0) {
        random = Math.random() * (max - min) + min;
    }
    return random;
}

export {generateId, random}