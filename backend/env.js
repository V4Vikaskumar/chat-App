import dotenv from 'dotenv';
dotenv.config();

const env = {
    CROSS_ORIGIN : process.env.CROSS_ORIGIN,
    PORT : process.env.PORT || 4444,
    JWT_SECRET : process.env.JWT_SECRET,
    Cloud_name: process.env.Cloudinary_cloud_name,
    Api_key: process.env.Cloudinary_api_key,
    Api_secret: process.env.Cloudinary_api_secret   
}
export default env;