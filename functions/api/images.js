import { getImages } from "../../lib/db/images"

//GET api/images
export async function onRequestGet({ request, env }) {
    try {
        const { db } = env

        const url = new URL(request.url)
        const params = url.searchParams

        const limit = Number(params.get('limit')) || 10
        const page = Number(params.get('page')) || 1
        const search = params.get('search')

        const offset = (page - 1) * limit

        const { results } = await getImages(db, {limit, offset, search})

        return Response.json(
            {success: true, message: 'Successfully retrieved images!', results}, 
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

//POST api/images
export async function onRequestPost({ request, env }) {
    try {
        const { db } = env
        let form

        try {
            form = await request.formData()
        } catch (err) {
            return Response.json(
                {success: false, message: 'Invalid formData!'}, 
                {status: 400}
            )
        }
        
        const file = form.get('image')
        if (!file) {
            return Response.json(
                {success: false, message: 'Image not provided!'}, 
                {status: 400}
            )
        }

        //finish upload code

    } catch(err) {
        console.log(err)
        return Response.json(
            {success: false, message: 'Internal server error!'}, 
            {status: 500}
        )
    }
}