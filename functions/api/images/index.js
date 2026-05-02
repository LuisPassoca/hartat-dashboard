import { getImages, uploadImages } from "../../../lib/images"

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
        const { images, pages } = await getImages(db, {limit, offset, search})

        const { origin } = url
        for (const image of images) {
            image.url = origin + '/api/images/' + image.uuid
        }

        return Response.json(
            {success: true, message: 'Successfully retrieved images!', pages, images}, 
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
    const { bucket, db } = env

    try {
        let formData

        try {
            formData = await request.formData()
        } catch(err) {
            return Response.json(
                {success: false, message: 'Invalid formData!'}, 
                {status: 400}
            )
        }

        const images = formData.getAll('image')
        if (images.length == 0) {
            return Response.json(
                {success: false, message: 'No images were provided!'}, 
                {status: 400}
            )
        }

        const url = new URL(request.url)
        const origin = url.origin

        const { uploadedFiles, errorFiles } = await uploadImages({ images, bucket, db, origin })

        if (uploadedFiles.length == 0) {
            return Response.json(
                {success: false, message: 'Unable to upload images!', errorFiles}, 
                {status: 400}
            )
        }

        if (errorFiles.length != 0) {
            return Response.json(
                {success: true, partial: true, message: 'Some images failed to upload!', uploadedFiles, errorFiles},
                {status: 207}
            )
        }

        return Response.json(
            {success: true, message: 'Images uploaded successfully!', uploadedFiles},
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