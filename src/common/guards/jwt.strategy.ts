import { PassportStrategy } from "@nestjs/passport";
import {Strategy, ExtractJwt} from 'passport-jwt'

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({ 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT,
             ignoreExpiration: false
        })
    }
    async validate (paylaod: any) {
        return  {id: paylaod.id, role: paylaod.role, email: paylaod.email}
    }
}