import { JwtService } from '@nestjs/jwt';
export const generateAccessToken=async(user)=>{
    const payload={
        email:user.email,
        fullName:user.fullName,
        userName:user.userName,
        userId:user.id,
    }
    return {
        accessToken:await new JwtService().signAsync(payload)
    }
}