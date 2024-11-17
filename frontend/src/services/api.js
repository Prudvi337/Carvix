import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchCustomizationData = async (options) => {
    const response = await axios.post(`${API_URL}/customize`, options);
    return response.data;
};
