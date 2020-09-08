function generateId(length: number = 12): string {
    let possibleChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMONPQRSTUVWXYZ0123456789';
    let possibleLength = possibleChars.length;
    let chars = '';

    for(let i = 0; i < length; i++) {
        chars += possibleChars.charAt(Math.floor(Math.random() * possibleLength));
    }
    return chars;
}

export {generateId}