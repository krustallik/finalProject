import { api } from './api';


export async function postOffense(payload) {
    const { data } = await api.post('/offenses', {
        description: payload.description,
        category: payload.category,
        photoUrl: payload.photoUrl,
        photoId: payload.photoId,
        latitude: payload.latitude,
        longitude: payload.longitude,
        createdAt: payload.createdAt, // ISO
    });
    return data;
}

export async function getMyOffenses() {
    const { data } = await api.get('/offenses/mine');
    return data;
}

export async function getAllOffenses() {
    const { data } = await api.get('/offenses/all');
    return data;
}

export async function deleteOffenseRemote(id) {
    await api.delete(`/offenses/${id}`);
}
