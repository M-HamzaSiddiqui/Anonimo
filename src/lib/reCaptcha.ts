import axios from "axios";

console.log("is it prod",  process.env.NODE_ENV === "production")

const RECAPTCHA_SECRET_KEY = process.env.NODE_ENV !== "production" ? process.env.CAPTCHA_DEV_SECRET_KEY! : process.env.CAPTCHA_PROD_SECRET_KEY!

console.log("RECAPTCHA_SECRET_KEY", RECAPTCHA_SECRET_KEY )

export async function verifyRecaptchaToken(recaptchatoken: string): Promise<boolean> {
    try {
        console.log("recaptchatoken", recaptchatoken)
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            null,
            {
                params: {
                    secret: RECAPTCHA_SECRET_KEY,
                    response: recaptchatoken
                }
            }
        )
        console.log("response", response.data.success)
        return response.data.success
    } catch (error) {
            console.error("Error verifying reCAPTCHA", error)
            return false
    }
}