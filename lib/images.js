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

export async function uploadImages({ db, bucket, images, origin }) {
    const uploadedFiles = [], errorFiles = []

    //Helper functions
    const pushError = ({ name, type }) => {
        errorFiles.push({ name, type })
    }

    const uploadImage = async ({ uuid, image }) => {
        try {
            const httpMetadata = {contentType: image.type}
            return await bucket.put(uuid, image, {httpMetadata})
            
        }  catch(err) {
            console.log(err)
            return null
        }
    }

    const storeImage = async ({ name, extension, uuid }) => {
        try {
            const res = await db.prepare('INSERT INTO images (name, extension, uuid) VALUES (?, ?, ?)')
                .bind(name, extension, uuid)
                .run()
            
            return(res.success)

        } catch (err) {
            console.log(err)
            return false
        }
    }

    //Main code
    for (const image of images) {
        if (!image.type.startsWith('image/')) {
            pushError(image)
            continue
        }

        const uuid = crypto.randomUUID()
        const extension = image.name.slice(image.name.lastIndexOf('.'))
        const name = image.name.replace(extension, '')
        const url = `${origin}/api/images/${uuid}`

        const object = await uploadImage({ uuid, image })
        if (object === null) {
            pushError(image)
            continue
        }

        const success = await storeImage({ name, extension, uuid })
        if (!success) {
            await bucket.delete(uuid)
            pushError(image)
            continue
        }

        uploadedFiles.push({ name, extension, uuid, url })
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