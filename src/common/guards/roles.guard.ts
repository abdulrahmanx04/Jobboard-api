import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { AuthRequest } from "../interfaces/all.interfaces";
import { Roles } from "../decorators/roles";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles= this.reflector.getAllAndOverride<string[]>('roles',[context.getHandler(),context.getClass()])
        const request= context.switchToHttp().getRequest<AuthRequest>()
        if(!request.user) return false
        return requiredRoles.includes(request.user.role)
    }
}