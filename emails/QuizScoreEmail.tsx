import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
  } from "@react-email/components";
  
  interface QuizScoreEmailProps {
    username: string;
    score: number;
    maxScore: number;
  }
  
  export default function QuizScoreEmail({
    username,
    score,
    maxScore,
  }: QuizScoreEmailProps) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Your Quiz Score</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Preview>Your quiz score: {String(score)} out of {String(maxScore)}</Preview>
        <Section>
          <Row>
            <Heading as="h2">Hello {username}</Heading>
          </Row>
          <Row>
            <Text>
              Thank you for completing the quiz. Here are your results:
            </Text>
          </Row>
          <Row>
            <Text>
              Your score: {score} out of {maxScore}
            </Text>
          </Row>
          <Row>
            <Text>
              If you have any questions about your score, please feel free to
              reach out to us.
            </Text>
          </Row>
        </Section>
      </Html>
    );
  }