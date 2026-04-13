export async function getPost(db, id){
    if(!id) return Error('Invalid ID');
    return await db.prepare(
        "SELECT * FROM posts WHERE id = ?"
    ).bind(id).first();
}

export async function createPost(db, html){
    return await db.prepare(
        "INSERT INTO posts (html) VALUE (?)"
    ).bind(html).run();
}

export async function UpdatePost(db, id){
    return await db.prepare(
        "UPDATE * FROM posts WHERE id = ?"
    ).bind(id).run();
}

export async function deletePost(db, id){
    return await db.prepare(
        "DELETE * FROM posts WHERE id = ?"
    ).bind(id).run();
}
