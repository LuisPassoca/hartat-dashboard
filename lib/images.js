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

export async function uploadImages({ db, bucket, images, thumbnails, origin }) {
    const uploadedFiles = []
    const errorFiles = []

    //Main code
    for (let i = 0; i < images.length; i++) {
        const image = images[i]
        const thumbnail = thumbnails[i]

        if (!image.type.startsWith('image/')) {
            pushError(image)
            continue
        }

        const uuid = crypto.randomUUID()
        const extension = image.name.slice(image.name.lastIndexOf('.'))
        const name = image.name.replace(extension, '')
        const url = `${origin}/api/images/${uuid}`

        let uploadedOriginal = false
        let uploadedPreview = false

        try {
            await bucket.put(uuid, image, {httpMetadata: {'Content-Type': image.type}})
            uploadedOriginal = true

            await bucket.put(uuid + '_preview', thumbnail, {httpMetadata: {'Content-Type': thumbnail.type}})
            uploadedPreview = true

            const res = await db.prepare('INSERT INTO images (name, extension, uuid) VALUES (?, ?, ?)')
                .bind(name, extension, uuid)
                .run()
                
            if (!res.success) {throw new Error('Unable to store images in DB!')}

            uploadedFiles.push({ name, extension, uuid, url })
        } catch(err) {
            console.log(err)
            
            if (uploadedOriginal) {await bucket.delete(uuid)}
            if (uploadedPreview) {await bucket.delete(uuid + '_preview')}
            errorFiles.push({ name: image.name, type: image.type })
        }
    }

    return { uploadedFiles, errorFiles }
}

export async function renameImage(db, { uuid, name }) {
    return await db.prepare('UPDATE images SET name = ? WHERE uuid = ?')
        .bind(name, uuid)
        .run()
}

export async function deleteImage(db, bucket, uuid) {
    await bucket.delete(uuid)

    await db.prepare('DELETE FROM images WHERE uuid = ?')
        .bind(uuid)
        .run()
}