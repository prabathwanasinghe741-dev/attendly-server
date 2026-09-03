import { idGen } from "../middleware/jwt.token.js";
import { sendErrorResponse } from "../middleware/response.js";
import sql_executor from "../pages/sql-stmt.js";

const sectionController = {
    addNew: (req, res) => {
        const name = req.params.name;
        if (!name || name == 'null') {
            sendErrorResponse(res, 400, "Missing Reqiured Data");
        } else {
            sql_executor.addNewSection(idGen('SEC'), name, res);
        }
    },
    getAll: (req, res) => {
        sql_executor.getAllSections(res);
    },
    deleteOne: (req, res) => {
        try {
            const name = req.params.name;
            if (!name || name == 'null') {
                sendErrorResponse(res, 400, "Missing Reqiured Data");
            } else {
                sql_executor.deleteSection(name, res);
            }
        } catch (error) {
            sendErrorResponse(res, 500, error);
        }
    }
};
export default sectionController;