import { request } from "express";
import { idGen } from "../middleware/jwt.token.js";
import { sendErrorResponse } from "../middleware/response.js";
import sql_executor from "../pages/sql-stmt.js";

const classController = {
    addNew: (req, res) => {
        try {
            const { section, name } = req.body;
            if (!section || !name) {
                sendErrorResponse(res, 400, "Missing Required data");
            } else {
                sql_executor.addNewClass(idGen('CLS'), section, name, res);
            }
        } catch (error) {
            sendErrorResponse(res, 500, error);
        }
    },
    getBySection: (req, res) => {
        try {
            const section = req.params.section;
            if (!section) {
                sendErrorResponse(res, 400, "Missing Required data");
            } else {
                sql_executor.getAllInSection(section, res);
            }
        } catch (error) {
            sendErrorResponse(res, 500, error);
        }
    },
    deleteOne: (req, res) => {
        const { section, name } = req.params;
        if (!section || !name) {
            sendErrorResponse(res, 400, "Missing Required data");
        } else {
            sql_executor.deleteClass(section, name, res)
        }
    },
    selectForToken: (req, res) => {
        const token = req.headers['x-user-id'];
        if (!token) {
            sendErrorResponse(res, 400, "Missing Required data");
        } else {
            sql_executor.getUserSection(token, res)
        }
    },
    getAllClass: (req, res) => sql_executor.getAllClass(res),
    enterClass: (req, res) => {
        const { firstname, lastname, classID } = req.body;
        const token = req.headers['x-user-id'];
        const fullName = `${firstname} ${lastname}`;
        if (!firstname || !lastname || !classID) {
            sendErrorResponse(res, 400, "Missiong required Data")
        } else {
            sql_executor.enterClass(fullName, token, classID, res);
        }
    },
    leaveClass: (req, res) => {
        const classID = req.params.id;
        console.log(classID)
        sql_executor.leaveClass(classID, res);
    },
    isEntered: (req, res) => {
        const token = req.headers['x-user-id'];
        sql_executor.isEntered(token, res);
    }

};
export default classController;