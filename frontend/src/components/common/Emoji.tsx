interface EmojiProps {
  children: string;
  className?: string;
  size?: string;
}

// 이모지를 유니코드 코드포인트로 변환
function getEmojiCodePoint(emoji: string): string {
  const codePoint = emoji.codePointAt(0);
  if (!codePoint) return '';
  return codePoint.toString(16);
}

export function Emoji({ children, className = '', size = '1.2em' }: EmojiProps) {
  const codePoint = getEmojiCodePoint(children);

  // Twemoji CDN 사용
  const twemojiUrl = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${codePoint}.svg`;

  return (
    <img
      src={twemojiUrl}
      alt={children}
      className={`inline-block ${className}`}
      style={{
        width: size,
        height: size,
        verticalAlign: 'middle',
        margin: '0 0.1em'
      }}
      draggable={false}
    />
  );
}
