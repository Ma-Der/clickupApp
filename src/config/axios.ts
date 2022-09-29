import axios from 'axios';
import { apiToken } from './envVar';

export const getRequest = async (url: string) => {
    return await axios.get(`${url}`, {
        headers: {
            "Authorization": `${apiToken}`,
        }                
    });
}