export async function getImages(db, { limit, offset, search }) {
    let params = []
    let where = `WHERE 1 = 1`

    if (search) {
        where += ` AND name LIKE ? COLLATE NOCASE`
        params.push(`%${search}%`)
    }

    const { results: images } = await db.prepare(`SELECT * FROM images ${where} ORDER BY uploaded_at DESC LIMIT ? OFFSET ?`)
        .bind(...params, limit, offset)
        .all()

    const { results: imagesData } = await db.prepare(`SELECT COUNT(*) AS total FROM images ${where}`)
        .bind(...params)
        .all()

    const totalImages = imagesData[0].total
    const pages = Math.ceil(totalImages / limit)

    return { images, pages }
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