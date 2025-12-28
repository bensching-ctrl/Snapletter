interface SnapletterIconProps {
  className?: string;
}

export function SnapletterIcon({ className = 'w-8 h-8' }: SnapletterIconProps) {
  return (
    <svg
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Gradient für oberen Streifen - Blau zu Cyan */}
        <linearGradient id="snap_grad_top" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#5B7FFF" />
          <stop offset="50%" stopColor="#5B9FFF" />
          <stop offset="100%" stopColor="#3ABEF9" />
        </linearGradient>
        
        {/* Gradient für mittleren Streifen - Blau zu Hellblau */}
        <linearGradient id="snap_grad_middle" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#5B7FFF" />
          <stop offset="100%" stopColor="#5BA8FF" />
        </linearGradient>
        
        {/* Gradient für unteren Streifen - Blau zu Lila */}
        <linearGradient id="snap_grad_bottom" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#6B6FFF" />
          <stop offset="50%" stopColor="#7A5FF8" />
          <stop offset="100%" stopColor="#8A4FF8" />
        </linearGradient>
      </defs>
      
      {/* Oberer Streifen - Parallelogramm schräg nach rechts oben */}
      <path
        d="M 220 160 L 700 110 L 780 220 L 300 270 Z"
        fill="url(#snap_grad_top)"
        opacity="0.95"
      />
      
      {/* Mittlerer Streifen - Parallelogramm schräg nach rechts oben */}
      <path
        d="M 160 290 L 640 240 L 720 350 L 240 400 Z"
        fill="url(#snap_grad_middle)"
        opacity="0.95"
      />
      
      {/* Unterer Streifen - Parallelogramm schräg nach rechts oben */}
      <path
        d="M 220 420 L 700 370 L 780 480 L 300 530 Z"
        fill="url(#snap_grad_bottom)"
        opacity="0.95"
      />
    </svg>
  );
}

interface SnapletterLogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function SnapletterLogo({
  className = '',
  iconClassName = 'w-8 h-8',
  textClassName = 'text-lg font-semibold tracking-tight',
}: SnapletterLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <SnapletterIcon className={iconClassName} />
      <span className={textClassName}>Snapletter</span>
    </div>
  );
}
