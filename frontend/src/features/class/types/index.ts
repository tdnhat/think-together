/**
 * Class Feature Types
 * Type definitions for class-related data structures
 */

// Class DTO
export interface ClassDto {
  id: string
  teacherId: string
  teacherName?: string
  name: string
  description?: string
  joinCode: string
  coverImageUrl?: string
  memberCount?: number
  homeworkCount?: number
  createdAt: string
  updatedAt?: string
}

// Class Member DTO
export interface ClassMemberDto {
  id: string
  classId: string
  userId: string
  userName?: string
  userEmail?: string
  joinedAt: string
  leftAt?: string
}

// Homework DTO
export interface HomeworkDto {
  id: string
  classId: string
  quizSetId: string
  quizSetTitle?: string
  title: string
  dueDate?: string
  assignedAt: string
  submissionCount?: number
  isOverdue?: boolean
}

// Homework Submission DTO
export interface HomeworkSubmissionDto {
  id: string
  homeworkId: string
  studentId: string
  studentName?: string
  challengeAttemptId: string
  score: number
  submittedAt: string
  status: 'NotSubmitted' | 'Submitted' | 'Late'
}

// Class Query Parameters
export interface ClassQueryParams {
  search?: string
  page?: number
  pageSize?: number
}

// Homework Query Parameters
export interface HomeworkQueryParams {
  classId: string
  page?: number
  pageSize?: number
}

// Create Class Request
export interface CreateClassRequest {
  name: string
  description?: string
  coverImageUrl?: string
}

// Update Class Request
export interface UpdateClassRequest {
  name?: string
  description?: string
  coverImageUrl?: string
}

// Join Class Request
export interface JoinClassRequest {
  joinCode: string
}

// Create Homework Request
export interface CreateHomeworkRequest {
  classId: string
  quizSetId: string
  title: string
  dueDate?: string
}

// Update Homework Request
export interface UpdateHomeworkRequest {
  title?: string
  dueDate?: string
}

// Class Response DTO
export interface ClassResponseDto {
  data: ClassDto[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Homework Response DTO
export interface HomeworkResponseDto {
  data: HomeworkDto[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Class Detail DTO (includes members and homeworks)
export interface ClassDetailDto extends ClassDto {
  members: ClassMemberDto[]
  homeworks: HomeworkDto[]
}

// Homework Detail DTO (includes submissions)
export interface HomeworkDetailDto extends HomeworkDto {
  submissions: HomeworkSubmissionDto[]
}
