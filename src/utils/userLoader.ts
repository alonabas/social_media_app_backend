import DataLoader from "dataloader";
import { prisma } from "..";

const batchGetUsers = async (keys: [number]) => {
    const result = await prisma.user.findMany({where: {id: {in: keys}}})
    return keys.map(e => result.find(r => r.id === e));
}

//@ts-ignore
export const userLoader = new DataLoader(batchGetUsers)
