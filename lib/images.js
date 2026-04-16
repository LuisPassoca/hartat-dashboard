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

export async function storeImage(db, { imageName, imageURL }) {
    return await db.prepare('INSERT INTO images (name, url) VALUES (?, ?)')
        .bind(imageName, imageURL)
        .run()
}

export async function uploadImage(formData) {
    const res = await fetch('https://picsur.org/api/image/upload', {
        method: 'POST',
        body: formData
    })

    if (!res.ok) {throw new Error('Could not upload image!')}

    const { data } = await res.json()
    const imageURL = `https://picsur.org/i/${data.id}.jpg`

    return { imageURL }
}