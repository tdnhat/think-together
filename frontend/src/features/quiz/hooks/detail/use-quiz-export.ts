import { useState, useCallback } from 'react';
import { quizSetService } from '@/features/quiz/api/quiz-set.service';
import { toast } from '@/lib/utils/toast';
import type { QuizSetDto } from '@/types/api';

export function useQuizExport(quizSet: QuizSetDto | null | undefined) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = useCallback(async () => {
    if (!quizSet) return;

    setIsExporting(true);
    try {
      const blob = await quizSetService.exportPdf(quizSet.id);
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${quizSet.title}-export.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        toast.success('Đã xuất file PDF thành công');
      } else {
        toast.error('Không thể xuất file PDF');
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi xuất file');
    } finally {
      setIsExporting(false);
    }
  }, [quizSet]);

  return {
    isExporting,
    handleExportPdf,
  };
}

