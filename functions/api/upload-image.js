export async function onRequestPost(context) {
    const request = context.request

    const res = await fetch('https://picsur.org/api/image/upload', {
        method: 'POST',
        headers: request.headers,
        body: request.body
    })

    const { data } = await res.json()
    console.log(data)

    return new Response(JSON.stringify({data}))
}