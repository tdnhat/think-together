import { CheckCircle, XCircle, Play, Volume2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import type { HomeworkSubmissionQuestionDto } from '../types'

interface QuestionReviewCardProps {
  question: HomeworkSubmissionQuestionDto
  questionNumber: number
}

export function QuestionReviewCard({ question, questionNumber }: QuestionReviewCardProps) {
  const hasAnswer = question.studentAnswer !== null && question.studentAnswer !== undefined
  const isCorrect = question.studentAnswer?.isCorrect ?? false

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">
            Câu {questionNumber}: {question.content}
          </CardTitle>
          {hasAnswer ? (
            isCorrect ? (
              <div className="flex items-center gap-1 text-green-600 shrink-0">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Đúng</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600 shrink-0">
                <XCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Sai</span>
              </div>
            )
          ) : (
            <div className="flex items-center gap-1 text-orange-500 shrink-0">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Chưa trả lời</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline">{question.type}</Badge>
          {hasAnswer && (
            <span className="text-sm text-[var(--text-secondary)]">
              {question.studentAnswer?.pointsEarned ?? 0} điểm
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <QuestionContent question={question} />
      </CardContent>
    </Card>
  )
}

function QuestionContent({ question }: { question: HomeworkSubmissionQuestionDto }) {
  switch (question.type) {
    case 'SingleChoice':
    case 'TrueFalse':
    case 'MultipleChoice':
      return <ChoiceQuestionContent question={question} />
    case 'Matching':
      return <MatchingQuestionContent question={question} />
    case 'Ordering':
      return <OrderingQuestionContent question={question} />
    case 'Video':
      return <VideoQuestionContent question={question} />
    case 'Audio':
      return <AudioQuestionContent question={question} />
    default:
      return <div className="text-[var(--text-secondary)]">Loại câu hỏi không được hỗ trợ</div>
  }
}

function ChoiceQuestionContent({ question }: { question: HomeworkSubmissionQuestionDto }) {
  if (!question.options) return null

  const hasAnswer = question.studentAnswer !== null && question.studentAnswer !== undefined

  return (
    <div className="space-y-2">
      {question.options.map((option, idx) => {
        const isCorrectOption = option.isCorrect
        const isStudentSelected = question.studentAnswer?.selectedOptionIndexes?.includes(idx) ?? false

        // Determine styling based on state
        let bgClass = 'bg-gray-50 border-gray-200'
        let textClass = 'text-[var(--text-primary)]'

        if (isCorrectOption) {
          bgClass = 'bg-green-50 border-green-300'
          textClass = 'text-green-700 font-medium'
        } else if (isStudentSelected) {
          bgClass = 'bg-red-50 border-red-300'
          textClass = 'text-red-700'
        }

        return (
          <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border-2 ${bgClass}`}>
            {/* Icon indicator */}
            <div className="shrink-0">
              {isCorrectOption ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : isStudentSelected ? (
                <XCircle className="h-5 w-5 text-red-600" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
              )}
            </div>

            {/* Option content */}
            <span className={`flex-1 ${textClass}`}>{option.content}</span>

            {/* Status indicators */}
            <div className="flex items-center gap-2 shrink-0">
              {isStudentSelected && (
                <span className={`text-xs px-2 py-0.5 rounded ${isCorrectOption ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  Bạn chọn
                </span>
              )}
            </div>
          </div>
        )
      })}

      {/* Not answered indicator */}
      {!hasAnswer && (
        <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-sm text-orange-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>Bạn chưa trả lời câu hỏi này</span>
        </div>
      )}
    </div>
  )
}

function MatchingQuestionContent({ question }: { question: HomeworkSubmissionQuestionDto }) {
  if (!question.matchingPairs) return null

  const hasAnswer = question.studentAnswer?.matchingPairs && question.studentAnswer.matchingPairs.length > 0

  return (
    <div className="space-y-6">
      {/* Correct Answer */}
      <div className="space-y-3">
        <h4 className="font-medium text-[var(--text-primary)] flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span>Đáp án đúng</span>
        </h4>
        <div className="space-y-2">
          {question.matchingPairs.map((pair, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="h-6 w-6 flex items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-xs shrink-0">
                {idx + 1}
              </div>
              <span className="text-green-800 font-medium">{pair.leftContent}</span>
              <span className="text-green-600">→</span>
              <span className="text-green-800 font-medium">{pair.rightContent}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Student Answer */}
      {hasAnswer ? (
        <div className="space-y-3">
          <h4 className="font-medium text-[var(--text-primary)] flex items-center gap-2">
            <span>Bài làm của bạn</span>
          </h4>
          <div className="space-y-2">
            {question.studentAnswer!.matchingPairs!.map((pair, idx) => {
              const isCorrect = question.matchingPairs?.some(correct =>
                correct.leftContent === pair.leftContent && correct.rightContent === pair.rightContent
              ) ?? false

              return (
                <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border-2 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                  )}
                  <span className={isCorrect ? 'text-green-800' : 'text-red-800'}>{pair.leftContent}</span>
                  <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>→</span>
                  <span className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>{pair.rightContent}</span>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-sm text-orange-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>Bạn chưa trả lời câu hỏi này</span>
        </div>
      )}
    </div>
  )
}

function OrderingQuestionContent({ question }: { question: HomeworkSubmissionQuestionDto }) {
  if (!question.orderingItems) return null

  // Sort correct order by correctPosition
  const correctOrder = [...question.orderingItems].sort((a, b) => (a.correctPosition || 0) - (b.correctPosition || 0))

  const hasAnswer = question.studentAnswer?.orderingItems && question.studentAnswer.orderingItems.length > 0
  const studentOrder = hasAnswer
    ? [...question.studentAnswer!.orderingItems!].sort((a, b) => a.position - b.position)
    : null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Correct Order */}
        <div className="space-y-3">
          <h4 className="font-medium text-[var(--text-primary)] flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Đáp án đúng</span>
          </h4>
          <div className="space-y-2">
            {correctOrder.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="h-6 w-6 flex items-center justify-center rounded-full bg-green-200 text-green-800 font-bold text-xs shrink-0">
                  {idx + 1}
                </div>
                <span className="text-green-800 font-medium">{item.content}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Student Order */}
        <div className="space-y-3">
          <h4 className="font-medium text-[var(--text-primary)]">Bài làm của bạn</h4>
          {studentOrder ? (
            <div className="space-y-2">
              {studentOrder.map((item, idx) => {
                const correctItem = correctOrder[idx]
                const isCorrectPosition = correctItem && correctItem.content === item.content

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 ${isCorrectPosition ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                  >
                    <div className={`h-6 w-6 flex items-center justify-center rounded-full font-bold text-xs shrink-0 ${isCorrectPosition ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {idx + 1}
                    </div>
                    <span className={isCorrectPosition ? 'text-green-800 font-medium' : 'text-red-800'}>
                      {item.content}
                    </span>
                    <div className="ml-auto">
                      {isCorrectPosition ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-sm text-orange-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Bạn chưa trả lời câu hỏi này</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function VideoQuestionContent({ question }: { question: HomeworkSubmissionQuestionDto }) {
  const hasAnswer = question.studentAnswer !== null && question.studentAnswer !== undefined

  return (
    <div className="space-y-4">
      {question.videoUrl && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-[var(--text-primary)]">Video câu hỏi</span>
          </div>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <video
              src={question.videoUrl}
              controls
              className="w-full h-full rounded-lg"
              poster={question.videoUrl}
            >
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>
          {question.videoTimestamp && (
            <p className="text-sm text-[var(--text-secondary)]">
              Timestamp: {Math.floor(question.videoTimestamp / 60)}:{(question.videoTimestamp % 60).toString().padStart(2, '0')}
            </p>
          )}
        </div>
      )}

      {hasAnswer ? (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            <strong>Đáp án của bạn:</strong> {question.studentAnswer?.selectedOptionIndexes?.length ? 'Đã trả lời' : 'Chưa trả lời'}
          </p>
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-sm text-orange-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>Bạn chưa trả lời câu hỏi này</span>
        </div>
      )}
    </div>
  )
}

function AudioQuestionContent({ question }: { question: HomeworkSubmissionQuestionDto }) {
  const hasAnswer = question.studentAnswer !== null && question.studentAnswer !== undefined

  return (
    <div className="space-y-4">
      {question.audioUrl && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-purple-600" />
            <span className="font-medium text-[var(--text-primary)]">Audio câu hỏi</span>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <audio
              src={question.audioUrl}
              controls
              className="w-full"
            >
              Trình duyệt của bạn không hỗ trợ audio.
            </audio>
          </div>
          {question.audioTimestamp && (
            <p className="text-sm text-[var(--text-secondary)]">
              Timestamp: {Math.floor(question.audioTimestamp / 60)}:{(question.audioTimestamp % 60).toString().padStart(2, '0')}
            </p>
          )}
        </div>
      )}

      {hasAnswer ? (
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-700">
            <strong>Đáp án của bạn:</strong> {question.studentAnswer?.selectedOptionIndexes?.length ? 'Đã trả lời' : 'Chưa trả lời'}
          </p>
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-sm text-orange-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>Bạn chưa trả lời câu hỏi này</span>
        </div>
      )}
    </div>
  )
}
