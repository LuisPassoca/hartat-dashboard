export async function onRequestGet(context) {
    console.log(context)
    
    return Response.json(
        {message: 'Hello world!', success: true},
        {status: 200}
    )
}