import apiClient from "./apiClient";

export const getOrganizations = async () => {
    const response = await apiClient.get('/users/organizations/');
    return response.data;
};