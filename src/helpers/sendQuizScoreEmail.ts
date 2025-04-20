import { resend } from "@/lib/resend";  
import QuizScoreEmail from "../../emails/QuizScoreEmail";
import { ApiResponse } from "@/types/ApiResponse";  

export async function sendQuizScoreEmail(
  email: string,
  username: string,
  score: number,
  maxScore: number
): Promise<ApiResponse> {
  const { data, error } = await resend.emails.send({
    from: "anonimo@techtrap.site",
    to: [email],
    subject: "Your Quiz Score",
    react: QuizScoreEmail({ username, score, maxScore }),
  });

  if (error) {
    console.log(error);
    return { success: false, message: "Unable to send quiz score email" };
  }

  return { success: true, message: "Quiz score email sent successfully" };
}
