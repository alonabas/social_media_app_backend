import JWT from "jsonwebtoken";
import { IncomingMessage } from "node:http";

const parseUserId = async (req: IncomingMessage): Promise<string | undefined> => {
    const token = req?.headers?.authorization;
    if (token) {
        try {
            const decoded: any = JWT.verify(token, String(process.env.JWT_PRIVATE_KEY));
            return decoded?.userId;
        }
        catch(error) {
            return;
        }
    }
    return;
}

export default parseUserId;