import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useChallengeResultsActions(shareLink: string) {
  const router = useRouter();

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/challenge/${shareLink}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ThinkTogether Challenge',
          text: 'Tham gia thử thách này cùng tôi!',
          url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url);
      alert('Đã sao chép liên kết!');
    }
  }, [shareLink]);

  const handleRetry = useCallback(() => {
    router.push(`/challenge/${shareLink}`);
  }, [router, shareLink]);

  const handleHome = useCallback(() => {
    router.push('/home');
  }, [router]);

  return {
    handleShare,
    handleRetry,
    handleHome,
  };
}

