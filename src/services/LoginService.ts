import axios from "axios";
export class LoginService {
    static sendVerifyCodeByEmail(email:string){
        return axios.get(`/api/login/getVerificationCode/${email}`)
    }
    static loginVerify(params:{email:string,verificationCode:string}){
        return axios.post(`/api/login/verify`, params)
    }
}