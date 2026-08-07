import protectedInstance from "../instances/protectedInstance";

export const myNews=async()=>{
    const response=await protectedInstance.get('/editors/my-news')
    return response.data
}

export const dashboard=async()=>{
    const response=await protectedInstance.get('/editors/dashboard');
    return response.data
}