import { createPost, deletePost, getPost, UpdatePost } from "../model/publicationModel.js";

export const PubliController = {
    
    async get(context){
        try {
            const {request, env} = context;
            const {db} = env;
            const {id} = await request.json();
        
            const data = await getPost(db, id);
            if (!data.success) return new Response(JSON.stringify({message: 'No response from the database', success: false}), {status: 404})
            return new Response(
                JSON.stringify({message: 'Data retrieved successfully!', data ,success: true}),
                {status: 200}
            );
        } catch (error) {
            console.log(error);
            return new Response(JSON.stringify({message: 'Internal Server Error!', success: false}),
            {status: 500}
            );
        }
    },

    async post(context){
        const {request, env} = context;
        const body = await request.json();

        return new Response(
            JSON.stringify({message: 'Data received successfully!', success: true}),
            {status: 200}
        );
    },

    async put(context){
        const {request, env} = context;
        const body = await request.json();

        return new Response(
            JSON.stringify({message: 'Data updated succesfully!', data: body, success: true}),
            {status: 200}
        );
    },

    async delete(context){
        const {request, env} = context;
        const body = await request.json();

        return new Response(
            JSON.stringify({message: 'Data deleted successfully!', data: body, success: true}),
            {status: 200}
        );
    },

    async patch(context){
        const {request, env} = context;
        const body = await request.json();

        return new Response(
            JSON.stringify({message: 'Data patched successfully!', data: body, success: true}),
            {status: 200}
        );
    }
}
