import "express";

declare global {
    namespace Express {
        interface Request {
            decodedEmail?: string; // Just this one for now
        }
    }
}

export {};
