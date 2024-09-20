
import { User, UserCredentials } from "../types";
import apiClient from "./apiClient";

export const registerUser = async (data : User) => {
    const response = await apiClient.post('/users/register/', data);
    return response.data;
};

export const loginUser = async (data : UserCredentials) => {
    const response = await apiClient.post('/users/login/', data);
    return response.data;
};