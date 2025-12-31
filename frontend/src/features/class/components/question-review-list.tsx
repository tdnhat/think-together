import { QuestionReviewCard } from './question-review-card'
import type { HomeworkSubmissionQuestionDto } from '../types'

interface QuestionReviewListProps {
    questions: HomeworkSubmissionQuestionDto[]
    title?: string
}

export function QuestionReviewList({ questions, title = 'Chi tiết câu trả lời' }: QuestionReviewListProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-semibold text-foreground">
                    {title}
                </h2>
                <span className="text-sm text-muted-foreground">
                    {questions.length} câu hỏi
                </span>
            </div>

            <div className="space-y-6">
                {questions.map((question, index) => (
                    <QuestionReviewCard
                        key={question.id}
                        question={question}
                        questionNumber={index + 1}
                    />
                ))}
            </div>
        </div>
    )
}
