import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserData } from "../interfaces/all.interfaces";


export const User = createParamDecorator<UserData>(
     (data: any, context: ExecutionContext): UserData => {
        const request = context.switchToHttp().getRequest()
        return request.user
     }
)