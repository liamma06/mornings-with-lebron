'use client';

interface EmotionBadgeProps {
  emotion: string;
  compact?: boolean;
}

export default function EmotionBadge({ emotion, compact = false }: EmotionBadgeProps) {
  // Define colors and icons for each emotion
  const emotionStyles: Record<string, { bg: string, text: string, emoji: string }> = {
    happy: { bg: 'bg-yellow-100', text: 'text-yellow-800', emoji: '😊' },
    sad: { bg: 'bg-blue-100', text: 'text-blue-800', emoji: '😢' },
    anxious: { bg: 'bg-purple-100', text: 'text-purple-800', emoji: '😰' },
    hopeful: { bg: 'bg-green-100', text: 'text-green-800', emoji: '🌱' },
    tired: { bg: 'bg-gray-100', text: 'text-gray-800', emoji: '😴' },
    angry: { bg: 'bg-red-100', text: 'text-red-800', emoji: '😠' },
    calm: { bg: 'bg-teal-100', text: 'text-teal-800', emoji: '😌' },
    neutral: { bg: 'bg-gray-100', text: 'text-gray-800', emoji: '😐' }
  };

  const style = emotionStyles[emotion] || emotionStyles.neutral;

  if (compact) {
    return (
      <span className="ml-2" title={`Feeling: ${emotion}`}>
        {style.emoji}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      <span className="mr-1">{style.emoji}</span>
      <span className="capitalize">{emotion}</span>
    </span>
  );
}