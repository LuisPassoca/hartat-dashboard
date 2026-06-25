export async function onRequestPost({ request, env }) {
    try {
        const { db } = env
        let data

        try {
            data = await request.json()
        } catch(err) {
            console.log(err)
            return Response.json(
                {success: false, message: 'Invalid json!'}, 
                {status: 400}
            )
        }

        const { title, description, cover, gallery = [] } = data

        if (
            !title.trim() ||
            !description.trim() ||
            !cover.trim()
        ) {
            return Response.json(
                {success: false, message: 'Missing fields!'}, 
                {status: 400}
            )
        }

        const res = await db
            .prepare(`
                INSERT INTO exhibitions
                (title, description, cover_uuid)
                VALUES (?, ?, ?)
            `)
            .bind(title, description, cover)
            .run()

        const exhibitionId = res.meta.last_row_id

        for (const image of gallery) {
            await db
                .prepare(`
                    INSERT INTO exhibition_images
                    (exhibition_id, image_uuid)
                    VALUES (?, ?)
                `)
                .bind(exhibitionId, image)
                .run()
        }

        return Response.json(
            {success: true, message: 'Exhibition created successfully!', data},
            {status: 200}
        )

    } catch(err) {
        console.log(err)
        return Response.json(
            {success: false, message: 'Internal server error!'}, 
            {status: 500}
        )
    }
}