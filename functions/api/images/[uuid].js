import { deleteImage, renameImage } from "../../../lib/images"

//GET api/images/[uuid]
export async function onRequestGet({ request, params, env }) {
    const { bucket } = env

    const { uuid } = params
    const url = new URL(request.url)
    const previewMode = (url.searchParams.get('preview') !== null) ? '_preview' : ''

    const object = await bucket.get(uuid + previewMode)
    
    if (object == null) {
        return new Response('Unable to retrieve image!', {status: 404})
    }

    const type = object.httpMetadata.contentType

    return new Response(object.body, {
        headers: {
            'Content-Type': type
        }
    })
}

//PATCH api/images/[uuid]
export async function onRequestPatch({ request, params, env }) {
    try {
        const { db } = env

        const { uuid } = params
        const url = new URL(request.url)
        const name = url.searchParams.get('name')

        if (!name) {
            return Response.json(
                {success: false, message: 'Rename value not provided!'},
                {status: 400}
            )
        }

        const res = await renameImage(db, { uuid, name })
        if (!res.success) {
            return Response.json(
                {success: false, message: 'Internal server error!'},
                {status: 500}
            )
        }
        
        return Response.json(
            {success: true, message: 'Successfully renamed image!'},
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

//DELETE api/images/[uuid]
export async function onRequestDelete({ request, params, env }) {
    try {
        const { db, bucket } = env

        const { uuid } = params
        await deleteImage(db, bucket, uuid)

        return Response.json(
            {success: true, message: 'Successfully deleted image!'},
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