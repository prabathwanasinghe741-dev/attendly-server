import Database from "../database/config.js";
import { jwtToken } from "../middleware/jwt.token.js";
import { sendErrorResponse } from "../middleware/response.js";
import sql_executor from "../pages/sql-stmt.js";

const userController = {
    addUser: (req, res) => {
        try {
            const { firstname, lastname, email, password, role = 'user', section } = req.body;
            if (!firstname || !lastname || !email || !password) {
                sendErrorResponse(res, 406, "Required data are missing");
            } else {
                sql_executor.addNewUser(firstname, lastname, email, password, jwtToken(), role, section, res);
            }
        } catch (error) {
            sendErrorResponse(res, 500, error);
        }
    },
    verifyToken: (req, res) => {
        try {
            const userToken = req.params.id;
            sql_executor.verifyUserToken(userToken, res);
        } catch (error) {
            sendErrorResponse(res, 500, error);
        }
    },
    loginUser: (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                sendErrorResponse(res, 400, "Missing Required Data");
            } else {
                sql_executor.loginUser(email, password, res);
            }
        } catch (error) {
            sendErrorResponse(res, 500, error);
        }
    },
    aboutMe: (req, res) => {
        const userID = req.headers['x-user-id'];
        sql_executor.aboutMe(userID, res);
    }
};

export default userController;