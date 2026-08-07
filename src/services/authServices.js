import instances from "../instances/instances"
import protectedInstance from '../instances/protectedInstance';

export const registerUser = async (userData) => {
    const response = await instances.post('/auth/register', userData);
    return response.data;
}

export const loginUser = async (credentials) => {
    const response = await protectedInstance.post('/auth/login', credentials);
    return response.data;
};

export const getMe = async () => {
    const response = await protectedInstance.get('/auth/me');
    return response.data;
};

export const logoutUser = async () => {
    const response = await protectedInstance.post('/auth/logout');
    return response.data;
};