import { getImages, renameImage, storeImage, uploadImage } from "../../lib/images"

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
    try {
        const { db } = env
        let formData

        try {
            formData = await request.formData()
        } catch (err) {
            return Response.json(
                {success: false, message: 'Invalid formData!'}, 
                {status: 400}
            )
        }

        //TODO: add multiple uploads on backend rather than frontend
    } catch (err) {
        console.log(err)
        return Response.json(
            {success: false, message: 'Internal server error!'}, 
            {status: 500}
        )
    }
}

/*
export async function onRequestPost({ request, env }) {
    try {
        const { db } = env
        let formData

        try {
            formData = await request.formData()
        } catch (err) {
            return Response.json(
                {success: false, message: 'Invalid formData!'}, 
                {status: 400}
            )
        }
        
        const file = formData.get('image')
        if (!file) {
            return Response.json(
                {success: false, message: 'Image not provided!'}, 
                {status: 400}
            )
        }
        
        const { imageURL } = await uploadImage(formData)
        const imageName = file.name

        const res = await storeImage(db, { imageName, imageURL })

        if (!res.success) {
            //Handle image deletion from R2 here

            return Response.json(
                {success: false, message: 'Internal server error!'}, 
                {status: 500}
            )
        }

        return Response.json(
            {success: true, message: 'Successfully uploaded image!', data: {imageURL}},
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
*/

//PATCH api/images
export async function onRequestPatch({ request, env }) {
    try {
        const { db } = env

        const url = new URL(request.url)
        const params = url.searchParams

        const id = params.get('id')
        const name = params.get('name')

        if (!id || !name) {return Response.json(
            {success: false, message: 'Request missing parameters!'}, 
            {status: 400}
        )}

        const res = await renameImage(db, { id, name })

        if (!res.success) {return Response.json(
            {success: false, message: 'Internal server error!'}, 
            {status: 500}
        )}

        return Response.json(
            {success: true, message: 'Successfully renamed image!', data: {imageURL}},
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

//DELETE api/images
export async function onRequestDelete({ request, env }) {
    
}