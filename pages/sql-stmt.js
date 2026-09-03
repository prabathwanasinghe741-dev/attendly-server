import Database from "../database/config.js";
import { sendErrorResponse, sendSuccessResponse } from "../middleware/response.js";

const logError = (error, success) => { if (error) { console.log(error); } else { console.log(success) } };
const decodeErrNo = (errno) => {
    switch (errno) {
        case 5: return "Database Locked Under Maintainence";
        case 19: return "Already Existing Data. Couldn't Add New Record";
        default: return `UNKNOWN_ERROR: Unrecognized errno ${errno}`;
    }
}

const sql_executor = {
    createUserTable: () => {
        Database.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstname TEXT NOT NULL,
            lastname TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            section TEXT NOT NULL,
            token TEXT,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (error) => logError(error, "Users Table Created"));
    },
    addNewUser: (fname, lname, email, password, token, role, section, res) => {
        Database.run(`INSERT INTO users (firstname, lastname, email, password, token, role, section) VALUES (?,?,?,?,?,?,?);`,
            [fname, lname, email, password, token, role, section], (error) => {
                if (error) {
                    sendErrorResponse(res, 406, decodeErrNo(error.errno));
                } else {
                    sendSuccessResponse(res, 201, "User Created", token);
                }
            }
        );
    },
    verifyUserToken: (token, res) => {
        Database.get(`SELECT role FROM users WHERE token =?;`, [token], (err, row) => {
            if (err) {
                sendErrorResponse(res, 500, err.message);
            } else if (!row) {
                sendErrorResponse(res, 404, "Invalid Token")
            } else {
                sendSuccessResponse(res, 200, "User Found", row.role)
            }
        });
    },
    loginUser: (email, password, res) => {
        Database.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
            if (err) {
                sendErrorResponse(res, 500, err);
            } else if (!row) {
                sendErrorResponse(res, 400, "Invalid Credentials");
            } else if (password == row.password) {
                sendSuccessResponse(res, 200, row.token);
            } else {
                sendErrorResponse(res, 400, "Incorrect Password");
            }
        });
    },
    getUserSection: (token, res) => {
        Database.get(`SELECT * FROM users WHERE token = ?`, [token], (err, row) => {
            if (err) {
                sendErrorResponse(res, 500, err);
            } else if (!row) {
                sendErrorResponse(res, 400, "Invalid token");
            } else {
                sql_executor.getAllInSection(row.section, res)
            }
        });
    },
    aboutMe: (token, res) => {
        Database.get(`SELECT * FROM users WHERE token = ?`, [token], (err, row) => {
            if (err) {
                sendErrorResponse(res, 400, err);
            } else if (row) {
                sendSuccessResponse(res, 200, "User Found", row)
            } else { sendErrorResponse(res, 400, "No user Found"); };
        })
    },
    // Section 
    createSectionTable: () => {
        Database.run(`CREATE TABLE IF NOT EXISTS sections (
            id TEXT NOT NULL,
            name TEXT NOT NULL UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (error) => logError(error, "Sections Table Created"));
    },
    addNewSection: (id, name, res) => {
        Database.run(`INSERT INTO sections (id, name) VALUES (?,?)`, [id, name], (err) => {
            if (err) {
                sendErrorResponse(res, 400, "Section Name Already Added");
            } else {
                sendSuccessResponse(res, 200, "Section Added Successfully");
            }
        })
    },
    getAllSections: (res) => {
        Database.all(`SELECT * FROM sections`, (err, row) => {
            if (err) {
                sendErrorResponse(res, 500, err);
            } else {
                sendSuccessResponse(res, 200, row);
            }
        })
    },
    deleteSection: (name, res) => {
        Database.run(`DELETE FROM sections WHERE name = ?`, [name], (err) => {
            if (err) {
                sendErrorResponse(res, 400, err);
            } else {
                Database.run(`DELETE FROM class WHERE section = ?`, [name], (err) => {
                    if (err) {
                        sendErrorResponse(res, 500, err);
                    } else {
                        sendSuccessResponse(res, 200, "Section and Classes Deleted");
                    }
                })
            }
        })
    },
    // Class
    createClassTable: () => {
        Database.run(`CREATE TABLE IF NOT EXISTS class (
            id TEXT NOT NULL,
            section TEXT NOT NULL,
            name TEXT NOT NULL,
            teacherIn BOOLEAN DEFAULT 0,
            teacher TEXT DEFAULT '',
            rTeacher BOOLEAN DEFAULT 0,
            lastUpdate TEXT NOT NULL,
            teacherToken TEXT DEFAULT ''
        );`, (error) => logError(error, "Class Table Created"))
    },
    addNewClass: (id, section, name, res) => {
        Database.run(`INSERT INTO class (id, section, name, lastUpdate) VALUES (?,?,?,?)`, [id, section, name, new Date().toISOString()], (err) => {
            if (err) {
                sendErrorResponse(res, 400, err);
            } else {
                sendSuccessResponse(res, 200, "Class Added");
            }
        });
    },
    getAllInSection: (section, res) => {
        Database.all(`SELECT * FROM class WHERE section = ?`, [section], (err, row) => {
            if (err) {
                sendErrorResponse(res, 400, err)
            } else {
                sendSuccessResponse(res, 200, "Classes Found", row);
            }
        })
    },
    deleteClass: (section, name, res) => {
        Database.run(`DELETE FROM class WHERE section = ? AND name = ?`, [section, name], (err, row) => {
            if (err) {
                sendErrorResponse(res, 400, err)
            } else {
                sendSuccessResponse(res, 200, "Class Deleted");
            }
        })
    },
    getAllClass: (res) => {
        Database.all(`SELECT * FROM class`, (err, row) => {
            if (err) {
                sendErrorResponse(res, 400, err)
            } else {
                sendSuccessResponse(res, 200, "All Class Found", row);
            }
        });
    },
    enterClass: (teacher, token, classID, res) => {
        Database.run(`UPDATE class SET teacherIn = 1, teacher =?, teacherToken=? WHERE TRIM(id) =?`, [teacher, token, String(classID).trim()], function (err) {
            if (err) return sendErrorResponse(res, 400, err.message);
            sendSuccessResponse(res, 200, "Updated " + this.changes);
        })
    },

    leaveClass: (classID, res) => {
        Database.run(`UPDATE class SET teacherIn = 0, teacher = 'NO', teacherToken = 'NO' WHERE TRIM(id) =?`, [String(classID).trim()], function (err) {
            if (err) return sendErrorResponse(res, 400, err.message);
            sendSuccessResponse(res, 200, "Updated " + this.changes);
        })
    },
    isEntered: (token, res) => {
        Database.get(`SELECT * FROM class WHERE teacherToken = ?`, [token], (err, row) => {
            if (err) {
                sendErrorResponse(res, 400, err)
            } else if (!row) {
                sendSuccessResponse(res, 200, "Not Enterd", false);
            } else {
                sendSuccessResponse(res, 200, row, true);
            }
        })
    }
};
export default sql_executor;