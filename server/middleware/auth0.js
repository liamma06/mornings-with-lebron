import { auth } from 'express-oauth2-jwt-bearer';

export const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

export const getUserFromToken = (req) =>{
    try{
        //validates the JWT token and extracts user information
        //if the token is not valid, it will throw an error and return null
        if(!req.auth || !req.auth.payload) {
            return null;
        }

        //return user information from the token
        return {
            auth0Id  :req.auth.payload.sub,
            email: req.auth.payload.email,
            name: req.auth.payload.name,
        };
    }catch (error){
        console.error("Error extracting user from token:", error);
        return null;
    }
}