export async function onRequestPost(context) {
    try {
        const { request, env } = context
        const { db } = env

        const form = await request.formData()
        const file = form.get('image')

        const uploadRes = await fetch('https://picsur.org/api/image/upload', {
            method: 'POST',
            body: form
        })

        const { data } = await uploadRes.json()
        const imageURL = `https://picsur.org/i/${data.id}.jpg`
        const imageName = file.name

        await db.prepare('INSERT INTO images (name, url) VALUES (?, ?)')
            .bind(imageName, imageURL)
            .run()

        return new Response(
            JSON.stringify({success: true, message: 'Successfully uploaded image!', data: {imageURL}}),
            {status: 200}
        )
    } catch(err) {
        console.log(err)

        return new Response(
            JSON.stringify({success: false, message: 'Internal server error!', data: null}),
            {status: 500}
        )
    }
}