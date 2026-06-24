export async function onRequestGet({ request, env }) {
    try {

        const { db } = env

        const url = new URL(request.url)
        const params = url.searchParams

        const limit = Number(params.get('limit')) || 10
        const page = Number(params.get('page')) || 1
        const search = params.get('search')
        
        const offset = (page - 1) * limit

        let queryParams = []
        let where = `WHERE 1 = 1`

        if (search) {
            where += ` AND title LIKE ? COLLATE NOCASE`
            queryParams.push(`%${search}%`)
        }

        const { results: movies} = await db
            .prepare(`SELECT * FROM movies ${where} ORDER BY id DESC LIMIT ? OFFSET ?`)
            .bind(...queryParams, limit, offset)
            .all()

        const { results: movieCount } = await db
            .prepare(`SELECT COUNT(*) AS total FROM movies ${where}`)
            .bind(...queryParams)
            .all()

        const totalMovies = movieCount[0].total
        const pages = Math.ceil(totalMovies / limit)

        return Response.json(
            {success: true, message: 'Successfully retrieved movies!', pages, movies}, 
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

export async function onRequestPost({ request, env }) {
    const { db } = env

    try {

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

        await db
            .prepare(`
                INSERT INTO movies 
                (title, description, genre, age_rating, banner_uuid, cover_uuid)
                VALUES (?, ?, ?, ?, ?, ?)    
                `)
            .bind(title, description, genre, rating, banner, cover)
            .run()

        return Response.json(
            {success: true, message: 'Movie created successfully!', data},
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