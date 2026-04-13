import { PubliController } from "../../controllers/publiController.js";

export async function onRequestGet(context) {
    return PubliController.get(context);
}

export async function onRequestPost(context) {
    return PubliController.post(context);
}

export async function onRequestPut(context){
    return PubliController.put(context);
}
export async function onRequestDelete(context){
    return PubliController.delete(context);
}
export async function onRequestPatch(context){
    return PubliController.patch(context);
}
