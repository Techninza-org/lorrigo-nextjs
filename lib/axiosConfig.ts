import { cookies } from 'next/headers';
import axios, { AxiosInstance } from 'axios';

const BASEURL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000/api';

const cookieStore = cookies();
const userCookie = cookieStore.get('user');
const user = userCookie ? JSON.parse(userCookie.value) : { token: null };

const axiosConfig = {
    baseURL: BASEURL,
    headers: {
        'Content-Type': 'application/json',
        ...(user.token && { 'Authorization': `Bearer ${user.token}` }), 
    },
};

export const axiosIWAuth: AxiosInstance = axios.create(axiosConfig);
