export async function onRequestGet({ env, params }) {
    try {
        const { db } = env
        const { id } = params

        const exhibition = await db
            .prepare(`
                SELECT 
                    e.*,
                    c.name AS cover_name,
                    c.extension AS cover_extension
                FROM exhibitions e
                    LEFT JOIN images c ON c.uuid = e.cover_uuid
                WHERE e.id = ?
            `)
            .bind(id)
            .first()

        if (!exhibition) {
            return Response.json(
                {success: false, message: 'Exhibition not found!'},
                {status: 404}
            ) 
        }
        
        const { results: gallery } = await db
            .prepare(`
                SELECT *
                FROM exhibition_images
                WHERE exhibition_id = ?    
            `)
            .bind(id)
            .all()
        
        return Response.json(
            {success: true, message: 'Successfully retrieved data!', data: {...exhibition, gallery}},
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
        


    } catch (err) {
        console.log(err)
        return Response.json(
            {success: false, message: 'Internal server error!'}, 
            {status: 500}
        )
    }
}