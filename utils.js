
// function that paginate an array
export function paginate(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice(page_size * (page_number - 1), page_size * page_number);
}

// check if string lenth more than 20 characters and add ..
export function checkStringLength(str) {
    if (str.length > 40) {
        return str.substring(0, 40) + "...";
    } else {
        return str;
    }
}

// check if an object is empty
export function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

// function that check if the user is verified in database
export async function isUserVerified(db,email) {
    let user = await db.db.collection('users').findOne({email})
    if(user){
        return user.verified
    }
    return false
}

