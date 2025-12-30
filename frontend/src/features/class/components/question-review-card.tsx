import { CheckCircle, XCircle, Play, Volume2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import type { HomeworkSubmissionQuestionDto } from '../types'

interface QuestionReviewCardProps {
  question: HomeworkSubmissionQuestionDto
  questionNumber: number
}

export function QuestionReviewCard({ question, questionNumber }: QuestionReviewCardProps) {
  const isCorrect = question.studentAnswer?.isCorrect ?? false

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">
            Câu {questionNumber}: {question.content}
          </CardTitle>
          {question.studentAnswer && (
            <Badge variant={isCorrect ? 'default' : 'destructive'} className="shrink-0">
              {isCorrect ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Đúng
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Sai
                </>
              )}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline">{question.type}</Badge>
          {question.studentAnswer && (
            <span className="text-sm text-[var(--text-secondary)]">
              {question.studentAnswer.pointsEarned} điểm
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

  return (
    <div className="space-y-2">
      {question.options.map((option, idx) => {
        const isCorrectOption = option.isCorrect
        const isStudentSelected = question.studentAnswer?.selectedOptionIndexes?.includes(idx) ?? false

        return (
          <div
            key={idx}
            className={`p-3 rounded-lg border ${
              isCorrectOption
                ? 'bg-green-50 border-green-200'
                : isStudentSelected
                ? 'bg-red-50 border-red-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {isCorrectOption && (
                <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
              )}
              {!isCorrectOption && isStudentSelected && (
                <XCircle className="h-4 w-4 text-red-600 shrink-0" />
              )}
              <span className={
                isCorrectOption
                  ? 'text-green-700 font-medium'
                  : isStudentSelected
                  ? 'text-red-700'
                  : ''
              }>
                {option.content}
              </span>
              <div className="ml-auto flex gap-1">
                {isCorrectOption && (
                  <Badge variant="default" className="text-xs">
                    Đáp án đúng
                  </Badge>
                )}
                {isStudentSelected && !isCorrectOption && (
                  <Badge variant="destructive" className="text-xs">
                    Bạn chọn
                  </Badge>
                )}
                {isStudentSelected && isCorrectOption && (
                  <Badge variant="default" className="text-xs">
                    Bạn chọn đúng
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function MatchingQuestionContent({ question }: { question: HomeworkSubmissionQuestionDto }) {
  if (!question.matchingPairs || !question.studentAnswer?.matchingPairs) return null

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-[var(--text-primary)] mb-3">Đáp án đúng:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {question.matchingPairs.map((pair, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
              <span className="text-green-700">{pair.leftContent}</span>
              <span className="text-green-700 mx-2">→</span>
              <span className="text-green-700 font-medium">{pair.rightContent}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-[var(--text-primary)] mb-3">Đáp án của bạn:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {question.studentAnswer.matchingPairs.map((pair, idx) => {
            const isCorrect = question.matchingPairs?.some(correct =>
              correct.leftContent === pair.leftContent && correct.rightContent === pair.rightContent
            ) ?? false

            return (
              <div
                key={idx}
                className={`flex items-center gap-2 p-2 rounded border ${
                  isCorrect
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                {isCorrect ? (
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                )}
                <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                  {pair.leftContent}
                </span>
                <span className={`mx-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>→</span>
                <span className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {pair.rightContent}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function OrderingQuestionContent({ question }: { question: HomeworkSubmissionQuestionDto }) {
  if (!question.orderingItems || !question.studentAnswer?.orderingItems) return null

  // Sort correct order by correctPosition
  const correctOrder = [...question.orderingItems].sort((a, b) => (a.correctPosition || 0) - (b.correctPosition || 0))

  // Sort student's order by position
  const studentOrder = [...question.studentAnswer.orderingItems].sort((a, b) => a.position - b.position)

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-[var(--text-primary)] mb-3">Thứ tự đúng:</h4>
        <div className="space-y-2">
          {correctOrder.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 bg-green-50 rounded border border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
              <span className="font-medium text-green-700">{idx + 1}.</span>
              <span className="text-green-700">{item.content}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-[var(--text-primary)] mb-3">Thứ tự của bạn:</h4>
        <div className="space-y-2">
          {studentOrder.map((item, idx) => {
            const correctItem = correctOrder[idx]
            const isCorrect = correctItem?.content === item.content

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2 rounded border ${
                  isCorrect
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                {isCorrect ? (
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                )}
                <span className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {idx + 1}.
                </span>
                <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                  {item.content}
                </span>
                {!isCorrect && correctItem && (
                  <span className="ml-auto text-xs text-[var(--text-secondary)]">
                    Đúng: {correctItem.content}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function VideoQuestionContent({ question }: { question: HomeworkSubmissionQuestionDto }) {
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

      {question.studentAnswer && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            <strong>Đáp án của bạn:</strong> {question.studentAnswer.selectedOptionIndexes?.length ? 'Đã trả lời' : 'Chưa trả lời'}
          </p>
        </div>
      )}
    </div>
  )
}

function AudioQuestionContent({ question }: { question: HomeworkSubmissionQuestionDto }) {
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

      {question.studentAnswer && (
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-700">
            <strong>Đáp án của bạn:</strong> {question.studentAnswer.selectedOptionIndexes?.length ? 'Đã trả lời' : 'Chưa trả lời'}
          </p>
        </div>
      )}
    </div>
  )
}
