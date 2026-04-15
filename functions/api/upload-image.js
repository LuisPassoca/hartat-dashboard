export async function onRequestPost(context) {
    const request = context.request

    const res = await fetch('https://picsur.org/api/image/upload', {
        method: 'POST',
        headers: request.headers,
        body: request.body
    })

    const { data } = await res.json()
    const imageURL = `https://picsur.org/i/${data.id}.jpg`

    return new Response(
        JSON.stringify({success: true, message: 'Successfully uploaded image!', data: {imageURL}}),
        {status: 200}
    )
}