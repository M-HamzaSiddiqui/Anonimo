'use client'

import QuizAnalytics from '@/components/QuizAnalytics'
import { useParams } from 'next/navigation'

export default function QuizFormAnalyticsPage() {
  const { formId } = useParams()

  if (!formId || typeof formId !== 'string') return <p>Loading...</p>

  return <QuizAnalytics formId={formId} />
}

