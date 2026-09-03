export function sendSuccessResponse(res, status, msg, data) {
    return res.status(status).json({ success: true, massage: msg, data: data });
}
export function sendErrorResponse(res, status, error) {
    return res.status(200).json({ success: false, error: error, status: status });
}