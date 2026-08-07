import protectedInstance from "../instances/protectedInstance";


export const getAllUsers=async()=>{
    const response=await protectedInstance.get('/admin/users');
    return response.data;
}

export const approveEditor=async(id,editor)=>{
    const response=await protectedInstance.put(`/admin/editor/${id}/approve`);
    return response.data;
}

export const rejectEditor=async(id,editor)=>{
    const response=await protectedInstance.put(`/admin/editor/${id}/reject`);
    return response.data;
}

export const approveNews=async(id,news)=>{
    const response=await protectedInstance.put(`/admin/news/${id}/approve`);
    return response.data;
}

export const rejectNews=async(id,news)=>{
    const response=await protectedInstance.put(`/admin/news/${id}/reject`);
    return response.data;
}

export const deleteUser=async(user,id)=>{
    const response=await protectedInstance.delete(`/admin/user/${id}`);
    return response.data;
}

export const deleteNews=async(news,id)=>{
    const response=await protectedInstance.delete(`/admin/news/${id}`);
    return response.data;
}