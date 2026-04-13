export async function onRequestGet(context) {
    console.log(context)
    
    return new Response(
        JSON.stringify({message: 'Hello world!', success: true}),
        {status: 200, headers: {'Content-Type': 'application/json'}}
    )
}