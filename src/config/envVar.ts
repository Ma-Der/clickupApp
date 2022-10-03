import dotenv from 'dotenv';

dotenv.config();

export const apiToken = process.env.API_TOKEN as string;
export const baseUrl = process.env.BASE_URL as string;