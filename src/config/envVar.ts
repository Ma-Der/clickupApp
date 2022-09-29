import dotenv from 'dotenv';

dotenv.config();

export const port = process.env.PORT as string;
export const apiToken = process.env.API_TOKEN as string;
export const clientId = process.env.CLIENT_ID as string;
export const clientSecret = process.env.CLIENT_SECRET as string;
export const baseUrl = process.env.BASE_URL as string;