import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
    const { data, error } = await resend.emails.send({
        from: "anonimo@techtrap.site",
        to: [email],
        subject: "Mystery message verification code",
        react: VerificationEmail({ username, otp: verifyCode }),
      });

      if(error) {
        console.log(error)
        return {success: false, message: "Unable to send verification email"}
      }

      return {success: true, message: "Verification email send successfully"}
}
