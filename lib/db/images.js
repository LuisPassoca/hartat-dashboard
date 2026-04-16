export async function getImages(db, { limit, offset, search }) {
    let query = `SELECT * FROM images WHERE 1 = 1`
    let params = []

    if (search) {
        query += ` AND name LIKE ? COLLATE NOCASE`
        params.push(`%${search}%`)
    }

    query += ` ORDER BY uploaded_at DESC LIMIT ? OFFSET ?`
    params.push(limit, offset)

    return await db.prepare(query).bind(...params).all()
}

export async function storeImage(db) {

}