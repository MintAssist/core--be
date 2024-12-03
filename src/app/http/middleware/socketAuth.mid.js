const auth = require("../../../kernel/auth")
const jwt = auth.getJWT()
module.exports = async function (socket, next) {
    try {
        const token = socket.handshake.query.accessToken;

        if (!token) {
            socket.emit("error", { message: "Authentication error" });
            return next(new Error("Authentication error: Token not provided"));
        }
		
        const verifiedPayload = await jwt.verify(token).catch(error => {
            return {
                error
            }
        })

        if (!verifiedPayload || verifiedPayload.error || checkBlacklist) {
            socket.emit("error", { message: "Authentication error" });
            return next(new Error("Authentication error: Invalid token"));
        }

        socket.handshake.currentUser = verifiedPayload

        next()
    } catch (error) {
        console.error("Socket authentication error:", error);
        return next(new Error("Authentication error"));
    }
}