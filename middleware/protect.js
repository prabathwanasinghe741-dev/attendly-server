import Database from "../database/config.js";
import { sendErrorResponse } from "./response.js";

export function protect(req, res, next) {
    let headers = req.headers;
    if (headers.authorization && headers.authorization == process.env.JWT_TOKEN) {
        next();
    } else if (!headers.authorization) {
        return sendErrorResponse(res, 403, "Forbidden: Invalid or missing application credentials. Unauthorized client.");
    };
};

export function auth(req, res, next) {
    let headers = req.headers;
    let userID = headers['x-user-id'];
    if (userID) {
        Database.get(`SELECT * FROM users WHERE token = ?`,[userID], (err, row) => {
            if (err) {
                sendErrorResponse(res, 400, err);
            } else if (!row) {
                sendErrorResponse(res, 400, "Forbidden: Invalid or missing application credentials. Unauthorized client.")
            } else {
                next();
            }
        })
    } else {
        return sendErrorResponse(res, 403, "Forbidden: Invalid or missing application credentials. Unauthorized client.");
    }
}

export function adminOnly(req, res, next) {
    let headers = req.headers;
    let userID = headers['x-user-id'];
    if (userID) {
        Database.get(`SELECT * FROM users WHERE token = ?`, [userID], (err, row) => {
            if (err) {
                sendErrorResponse(res, 400, err);
            } else if (!row) {
                console.log(row.role)
                sendErrorResponse(res, 400, "Forbidden: Invalid or missing application credentials. Unauthorized client.")
            } else if (row.role == 'admin') {
                next();
            } else {
                sendErrorResponse(res, 400, "Forbidden: Invalid or missing application credentials. Unauthorized client.")
            }
        })
    } else {
        return sendErrorResponse(res, 403, "Forbidden: Invalid or missing application credentials. Unauthorized client.");
    }
}