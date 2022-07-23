import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import validator from 'validator';
import { Context, ErrorOutputType } from "../../types/Types";

interface AuthInputArgs {
    email: string,
    password: string
}

interface SignUpInputArgs {
    auth: AuthInputArgs,
    bio: string,
    name: string,
}

interface AuthOutputType {
    token?: string,
    errors: ErrorOutputType[]
}

const isNotValidAsNew = (email: string, password: string): boolean => {
    if (!validator.isEmail(email)) return true;
    if (!validator.isStrongPassword(password)) return true
    return false;
}

export const authResolvers = {
    signup: async (
        _: any,
        { auth, name, bio }: SignUpInputArgs,
        { prisma }: Context
    ): Promise<AuthOutputType> => {
        const { email, password } = auth;
        if (isNotValidAsNew(email, password)) {
            return {
                errors: [{ message: 'Email or password are not valid, password should be at least 8 symbols with at least one number, one uppercase letter, one lowercase letter and one symbol' }],
                token: undefined
            }
        }
        let userObj = await prisma.user.findUnique({ where: { email: email } });
        if (userObj) {
            return {
                errors: [{ message: 'User already exists' }],
                token: undefined
            }
        }
        const encryptedPass = await bcrypt.hash(password, 10);
        userObj = await prisma.user.create({
            data: {
                email,
                password: encryptedPass,
                name,
            }
        });

        const bioObj = await prisma.profile.create({
            data: {
                bio,
                userId: userObj.id
            }
        });

        const token = JWT.sign(
            { userId: userObj.id },
            String(process.env.JWT_PRIVATE_KEY), 
            { expiresIn: 3600000 }
        )

        return {
            errors: [],
            token
        };
    },
    signin: async (
        _: any,
        { auth }: SignUpInputArgs,
        { prisma }: Context
    ) => {
        const {email, password} = auth;
        let userObj = await prisma.user.findUnique({ where: { email: email } });
        if (!userObj) {
            return {
                errors: [{ message: 'Email or password are incorrect' }],
                token: undefined
            }
        }
        const isMatch = await bcrypt.compare(password, userObj.password);

        if (!isMatch) {
            return {
                errors: [{ message: 'Email or password are incorrect' }],
                token: undefined
            }
        }
        return {
            errors: [],
            token: JWT.sign(
                { userId: userObj.id },
                String(process.env.JWT_PRIVATE_KEY), 
                { expiresIn: 360000 }
            )
        }
    }
}