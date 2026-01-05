/**
 * Question Utilities
 * Shared utilities for question handling
 */

import { QuestionType } from '@/types/api'

/**
 * Question type metadata
 */
interface QuestionTypeMetadata {
    label: string
    icon: string
    description: string
}

/**
 * Question type labels in Vietnamese
 */
const QUESTION_TYPE_LABELS: Record<QuestionType, QuestionTypeMetadata> = {
    [QuestionType.SINGLE_CHOICE]: {
        label: 'Một lựa chọn',
        icon: 'CircleDot',
        description: 'Chọn một đáp án đúng từ nhiều lựa chọn',
    },
    [QuestionType.TRUE_FALSE]: {
        label: 'Đúng/Sai',
        icon: 'CheckCircle',
        description: 'Câu hỏi với hai lựa chọn: Đúng hoặc Sai',
    },
    [QuestionType.MULTIPLE_CHOICE]: {
        label: 'Nhiều lựa chọn',
        icon: 'CheckSquare',
        description: 'Chọn nhiều đáp án đúng từ các lựa chọn',
    },
    [QuestionType.MATCHING]: {
        label: 'Ghép cặp',
        icon: 'Link',
        description: 'Ghép các mục bên trái với mục bên phải',
    },
    [QuestionType.ORDERING]: {
        label: 'Sắp xếp',
        icon: 'ArrowUpDown',
        description: 'Sắp xếp các mục theo thứ tự đúng',
    },
    [QuestionType.VIDEO]: {
        label: 'Video',
        icon: 'Video',
        description: 'Câu hỏi dựa trên video với dấu thời gian',
    },
    [QuestionType.AUDIO]: {
        label: 'Âm thanh',
        icon: 'Volume2',
        description: 'Câu hỏi dựa trên audio với dấu thời gian',
    },
}

/**
 * Get question type label in Vietnamese
 * @param type - Question type
 * @returns Vietnamese label for the question type
 */
export function getQuestionTypeLabel(type: QuestionType): string {
    return QUESTION_TYPE_LABELS[type]?.label || type
}

/**
 * Get question type icon name
 * @param type - Question type
 * @returns Icon name (Lucide icon)
 */
export function getQuestionTypeIcon(type: QuestionType): string {
    return QUESTION_TYPE_LABELS[type]?.icon || 'HelpCircle'
}

/**
 * Get question type description
 * @param type - Question type
 * @returns Description of the question type
 */
export function getQuestionTypeDescription(type: QuestionType): string {
    return QUESTION_TYPE_LABELS[type]?.description || ''
}

/**
 * Get question type metadata
 * @param type - Question type
 * @returns Complete metadata for the question type
 */
export function getQuestionTypeMetadata(type: QuestionType): QuestionTypeMetadata {
    return QUESTION_TYPE_LABELS[type] || {
        label: type,
        icon: 'HelpCircle',
        description: '',
    }
}

/**
 * Check if a question is choice-based (single, multiple, true/false)
 * @param type - Question type
 * @returns True if the question is choice-based
 */
export function isChoiceQuestion(type: QuestionType): boolean {
    return [
        QuestionType.SINGLE_CHOICE,
        QuestionType.MULTIPLE_CHOICE,
        QuestionType.TRUE_FALSE,
    ].includes(type)
}

/**
 * Check if a question has media (video or audio)
 * @param type - Question type
 * @returns True if the question has media
 */
export function hasMedia(type: QuestionType): boolean {
    return [QuestionType.VIDEO, QuestionType.AUDIO].includes(type)
}

/**
 * Check if an answer is provided (not null/undefined/empty)
 * @param answer - Answer to check
 * @returns True if answer is provided
 */
export function isAnswerProvided(answer: any): boolean {
    if (answer === null || answer === undefined) return false
    if (Array.isArray(answer)) return answer.length > 0
    if (typeof answer === 'object') return Object.keys(answer).length > 0
    return true
}
