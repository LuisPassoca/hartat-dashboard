export async function onRequestGet({ request, env, params }) {
    try {

        const { db } = env
        const { id } = params

        const data = await db
            .prepare(`
                SELECT
                    m.*,
                    b.name AS banner_name,
                    b.extension AS banner_extension,
                    c.name AS cover_name,
                    c.extension AS cover_extension
                FROM movies m
                    LEFT JOIN images b ON b.uuid = m.banner_uuid
                    LEFT JOIN images c ON c.uuid = m.cover_uuid
                WHERE m.id = ?
            `)
            .bind(id)
            .first()

        if (!data) {
            return Response.json(
                {success: false, message: 'Unable to find data!'}, 
                {status: 404}
            )
        }

        return Response.json(
            {success: true, message: 'Successfully retrieved data!', data},
            {status: 200}
        )
    } catch (err) {
        console.log(err)
        return Response.json(
            {success: false, message: 'Internal server error!'}, 
            {status: 500}
        )
    }
}

export async function onRequestPut({ request, env, params }) {
    try { 
        const { db } = env
        const { id } = params

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

        const { title, description, genre, rating, banner, cover } = data

        //Implement better validation later
        if (
            !id ||
            !title.trim() ||
            !description.trim() ||
            !genre.trim() ||
            !rating.trim() ||
            !banner.trim() ||
            !cover.trim()
        ) {
            return Response.json(
                {success: false, message: 'Missing fields!'}, 
                {status: 400}
            )
        }

        const res = await db
            .prepare(`
                UPDATE movies
                    SET title = ?,
                        description = ?,
                        genre = ?,
                        age_rating = ?,
                        banner_uuid = ?,
                        cover_uuid = ?
                WHERE id = ?
            `)
            .bind(title, description, genre, rating, banner, cover, id)
            .run()
        
        if (!res.success) {
            return Response.json(
                {success: false, message: 'Internal server error!'},
                {status: 500}
            )
        }

        if (res.meta.changes == 0) {
            return Response.json(
                {success: false, message: 'Movie not found!'},
                {status: 404}
            )
        }

        return Response.json(
            {success: true, message: 'Successfully updated movie!'},
            {status: 200}
        )

    } catch (err) {
        console.log(err)
        return Response.json(
            {success: false, message: 'Internal server error!'}, 
            {status: 500}
        )
    }
}

export async function onRequestDelete({ env, params }) {
    try {
        const { id } = params
        const { db } = env

        const res = await db
            .prepare('DELETE FROM movies WHERE id = ?')
            .bind(id)
            .run()

        if (res.meta.changes == 0) {
            return Response.json(
                {success: false, message: 'Movie not found!'},
                {status: 404}
            )
        }

        return Response.json(
            {success: true, message: 'Successfully deleted movie!'},
            {status: 200}
        )

    } catch (err) {
        console.log(err)
        return Response.json(
            {success: false, message: 'Internal server error!'},
            {status: 500}
        )
    }
}