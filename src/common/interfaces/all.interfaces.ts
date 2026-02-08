



export interface UserData {
    id: string,
    email: string,
    role: string
}
export interface AuthRequest {
    user?: UserData
}