import Constants from 'expo-constants';

const extra = Constants.expoConfig.extra;

export const CLOUDINARY = {
    cloudName: "dctwua7xj",
    uploadPreset: "citizen_offenses",
    folder: "citizen/offenses",
};

export const CLOUDINARY_UPLOAD_URL =
    `https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`;