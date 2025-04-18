'use client'
import { useParams } from "next/navigation";
import FormAnalytics from "@/components/FormAnalytics";

const FormAnalyticsPage = () => {
  const params = useParams();
  const { slug } = params;  // Extract slug from the URL

  if (!slug || typeof slug !== "string") return <p>Loading...</p>;

  return <FormAnalytics slug={slug} />;
};

export default FormAnalyticsPage;
