import { CAT_PATTERNS } from '../data/moods'

interface CatProps {
  pattern?: string
  expression?: string
  accessory?: string | null
  size?: number
}

export default function CatSVG({ pattern = 'tabby', expression = 'happy', accessory, size = 180 }: CatProps) {
  const p = CAT_PATTERNS.find(c => c.key === pattern) ?? CAT_PATTERNS.find(c => c.key === 'tabby')!
  const { body, belly, detail } = p.colors

  // Eye states
  const eyes = {
    happy: { shape: 'arc', pupils: false },
    calm: { shape: 'half', pupils: false },
    sad: { shape: 'oval', pupils: true, angle: -15 },
    angry: { shape: 'oval', pupils: true, angle: 15 },
    worried: { shape: 'wide', pupils: true },
    sleepy: { shape: 'squint', pupils: false },
    curious: { shape: 'wide', pupils: true },
    default: { shape: 'oval', pupils: true },
  }

  const eyeConfig = (eyes as Record<string, {shape:string;pupils:boolean;angle?:number}>)[expression as keyof typeof eyes] ?? eyes.default

  // Tail position
  const tail = {
    happy: 'up',
    calm: 'curl',
    sad: 'low',
    angry: 'puff',
    worried: 'low',
    sleepy: 'low',
    curious: 'up',
    default: 'low',
  }[expression] ?? 'low'

  function Eye({ cx, cy, flip }: { cx: number; cy: number; flip?: boolean }) {
    const angle = eyeConfig.angle ?? 0
    const ang = flip ? -angle : angle
    return (
      <g transform={`translate(${cx},${cy}) rotate(${ang})`}>
        {eyeConfig.shape === 'arc' && (
          <path d="M -10 0 Q 0 -12 10 0" fill="none" stroke={detail} strokeWidth="3" strokeLinecap="round" />
        )}
        {eyeConfig.shape === 'half' && (
          <path d="M -10 2 Q 0 -8 10 2" fill={detail} />
        )}
        {eyeConfig.shape === 'oval' && (
          <>
            <ellipse rx="10" ry="11" fill={detail} />
            {eyeConfig.pupils && <ellipse rx="5" ry="6" fill="#1a1008" />}
            <circle cx="3" cy="-3" r="2.5" fill="white" opacity="0.7" />
          </>
        )}
        {eyeConfig.shape === 'wide' && (
          <>
            <ellipse rx="11" ry="13" fill={detail} />
            <ellipse rx="6" ry="7" fill="#1a1008" />
            <circle cx="3" cy="-3" r="2.5" fill="white" opacity="0.7" />
          </>
        )}
        {eyeConfig.shape === 'squint' && (
          <path d="M -10 2 Q 0 8 10 2" fill="none" stroke={detail} strokeWidth="3" strokeLinecap="round" />
        )}
      </g>
    )
  }

  function Ear({ x, y, flip }: { x: number; y: number; flip?: boolean }) {
    const scaleX = flip ? -1 : 1
    const puffed = expression === 'angry' ? 1.15 : 1
    return (
      <g transform={`translate(${x},${y}) scale(${scaleX * puffed},${puffed})`}>
        <polygon points="0,0 22,-38 44,0" fill={body} />
        <polygon points="6,0 22,-26 38,0" fill={detail} opacity="0.4" />
        <polygon points="10,-4 22,-20 34,-4" fill="#e8a8b0" opacity="0.5" />
      </g>
    )
  }

  function Tail() {
    if (tail === 'up') return (
      <path d="M 200 320 Q 240 240 210 180 Q 195 160 205 200" fill="none" stroke={body} strokeWidth="24" strokeLinecap="round" />
    )
    if (tail === 'curl') return (
      <path d="M 200 320 Q 250 300 240 260 Q 230 230 200 240 Q 175 248 185 268" fill="none" stroke={body} strokeWidth="22" strokeLinecap="round" />
    )
    if (tail === 'puff') return (
      <>
        <path d="M 200 320 Q 250 280 260 240 Q 268 210 248 220" fill="none" stroke={body} strokeWidth="28" strokeLinecap="round" />
        <path d="M 200 320 Q 250 280 260 240 Q 268 210 248 220" fill="none" stroke={detail} strokeWidth="8" strokeLinecap="round" strokeDasharray="4 8" opacity="0.3" />
      </>
    )
    // low
    return (
      <path d="M 200 320 Q 160 330 140 310 Q 130 295 148 300" fill="none" stroke={body} strokeWidth="22" strokeLinecap="round" />
    )
  }

  function Whiskers() {
    const wobble = expression === 'worried' ? 3 : 0
    return (
      <g opacity="0.7">
        <line x1="115" y1={240 - wobble} x2="80" y2="232" stroke="#c8bdb0" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="115" y1="248" x2="80" y2="248" stroke="#c8bdb0" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="115" y1={256 + wobble} x2="80" y2="264" stroke="#c8bdb0" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="215" y1={240 - wobble} x2="250" y2="232" stroke="#c8bdb0" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="215" y1="248" x2="250" y2="248" stroke="#c8bdb0" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="215" y1={256 + wobble} x2="250" y2="264" stroke="#c8bdb0" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    )
  }

  function Mouth() {
    if (expression === 'happy') return (
      <>
        <path d="M 148 268 Q 165 282 182 268" fill="none" stroke={detail} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 148 268 Q 140 260 145 252" fill="none" stroke={detail} strokeWidth="2.5" strokeLinecap="round" />
      </>
    )
    if (expression === 'sad') return (
      <path d="M 145 275 Q 165 265 185 275" fill="none" stroke={detail} strokeWidth="2.5" strokeLinecap="round" />
    )
    if (expression === 'angry') return (
      <path d="M 145 272 Q 165 268 185 272" fill="none" stroke={detail} strokeWidth="2.5" strokeLinecap="round" />
    )
    return (
      <path d="M 152 268 Q 165 272 178 268" fill="none" stroke={detail} strokeWidth="2.5" strokeLinecap="round" />
    )
  }

  function Accessory() {
    if (!accessory) return null
    if (accessory === 'blue_collar' || accessory === 'sparkle_collar') {
      const sparkle = accessory === 'sparkle_collar'
      return (
        <g>
          <rect x="125" y="315" width="80" height="16" rx="8" fill={sparkle ? '#a78fd4' : '#4a90d4'} opacity="0.9" />
          {sparkle && <>
            <circle cx="160" cy="323" r="3" fill="white" opacity="0.8" />
            <circle cx="150" cy="323" r="2" fill="white" opacity="0.6" />
            <circle cx="170" cy="323" r="2" fill="white" opacity="0.6" />
          </>}
          {!sparkle && <circle cx="165" cy="323" r="4" fill="#fdd68a" />}
        </g>
      )
    }
    if (accessory === 'wizard_hat') {
      return (
        <g>
          <polygon points="165,80 190,160 140,160" fill="#5a2d9a" />
          <rect x="130" y="156" width="70" height="14" rx="7" fill="#7a3db8" />
          <circle cx="165" cy="85" r="5" fill="#fdd68a" opacity="0.9" />
          <circle cx="155" cy="120" r="3" fill="#fdd68a" opacity="0.7" />
        </g>
      )
    }
    if (accessory === 'crown') {
      return (
        <g>
          <polygon points="165,70 178,100 200,82 195,110 135,110 130,82 152,100" fill="#f5c842" />
          <circle cx="165" cy="74" r="5" fill="#e07030" />
          <circle cx="198" cy="84" r="4" fill="#50c878" />
          <circle cx="132" cy="84" r="4" fill="#4090d0" />
        </g>
      )
    }
    if (accessory === 'fish_toy') {
      return (
        <g transform="translate(205, 300) rotate(-30)">
          <ellipse cx="0" cy="0" rx="16" ry="10" fill="#6db3d4" opacity="0.9" />
          <path d="M 14 0 L 22 -8 L 22 8 Z" fill="#6db3d4" />
          <circle cx="-5" cy="-2" r="2.5" fill="white" />
          <circle cx="-5" cy="-2" r="1.2" fill="#2a2a4a" />
          <path d="M -14 0 Q 0 5 14 0" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />
        </g>
      )
    }
    if (accessory === 'cosy_blanket') {
      return (
        <g>
          <path d="M 100 340 Q 165 325 230 340 L 240 390 Q 165 380 90 390 Z" fill="#e8c8a0" opacity="0.85" />
          <path d="M 100 340 Q 165 328 230 340" fill="none" stroke="#c8a880" strokeWidth="2" />
        </g>
      )
    }
    if (accessory === 'cat_bed') {
      return (
        <g>
          <ellipse cx="165" cy="370" rx="80" ry="22" fill="#e87090" opacity="0.4" />
          <path d="M 88 355 Q 165 345 242 355 L 240 380 Q 165 390 90 380 Z" fill="#f0a0b8" opacity="0.7" />
          <path d="M 88 355 Q 165 348 242 355" fill="none" stroke="#e87090" strokeWidth="2.5" />
        </g>
      )
    }
    return null
  }

  // Stripe marks for tabby/calico
  function Stripes() {
    if (pattern !== 'tabby' && pattern !== 'calico') return null
    return (
      <g opacity="0.2" fill={detail}>
        {pattern === 'tabby' && <>
          <path d="M 140 200 Q 150 195 155 205" fill="none" stroke={detail} strokeWidth="2.5" />
          <path d="M 140 213 Q 152 208 157 218" fill="none" stroke={detail} strokeWidth="2.5" />
          <path d="M 175 200 Q 182 195 190 205" fill="none" stroke={detail} strokeWidth="2.5" />
          <path d="M 173 213 Q 181 208 189 218" fill="none" stroke={detail} strokeWidth="2.5" />
        </>}
        {pattern === 'calico' && <>
          <circle cx="145" cy="205" r="14" fill={detail} opacity="0.35" />
          <circle cx="185" cy="215" r="10" fill="#e87090" opacity="0.3" />
        </>}
      </g>
    )
  }

  return (
    <svg
      viewBox="0 0 330 420"
      width={size}
      height={size * 420 / 330}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Cat in ${expression} mood`}
      style={{ overflow: 'visible', display: 'block' }}
    >
      {/* Tail (behind body) */}
      <Tail />

      {/* Accessory behind cat (blanket, bed) */}
      {(accessory === 'cosy_blanket' || accessory === 'cat_bed') && <Accessory />}

      {/* Body */}
      <ellipse cx="165" cy="300" rx="80" ry="90" fill={body} />

      {/* Belly */}
      <ellipse cx="165" cy="310" rx="46" ry="58" fill={belly} opacity="0.7" />

      {/* Stripes */}
      <Stripes />

      {/* Head */}
      <circle cx="165" cy="195" r="72" fill={body} />

      {/* Ears */}
      <Ear x={108} y={140} />
      <Ear x={196} y={140} flip />

      {/* Eyes */}
      <Eye cx={138} cy={190} />
      <Eye cx={192} cy={190} flip />

      {/* Nose */}
      <path d="M 165 240 L 158 248 L 172 248 Z" fill="#e87090" />

      {/* Mouth */}
      <Mouth />

      {/* Whiskers */}
      <Whiskers />

      {/* Front paws */}
      <ellipse cx="130" cy="375" rx="24" ry="16" fill={body} />
      <ellipse cx="200" cy="375" rx="24" ry="16" fill={body} />
      <ellipse cx="124" cy="380" rx="7" ry="5" fill={belly} opacity="0.6" />
      <ellipse cx="138" cy="382" rx="7" ry="5" fill={belly} opacity="0.6" />
      <ellipse cx="194" cy="380" rx="7" ry="5" fill={belly} opacity="0.6" />
      <ellipse cx="208" cy="382" rx="7" ry="5" fill={belly} opacity="0.6" />

      {/* Accessory (front, not blanket/bed) */}
      {accessory && accessory !== 'cosy_blanket' && accessory !== 'cat_bed' && <Accessory />}

      {/* Expression-specific: worried sweat drop */}
      {expression === 'worried' && (
        <ellipse cx="215" cy="165" rx="6" ry="9" fill="#6db3d4" opacity="0.6" />
      )}

      {/* Sleepy zzz */}
      {expression === 'sleepy' && (
        <text x="205" y="150" fontSize="18" fill={detail} opacity="0.7" fontFamily="serif" fontWeight="bold">z z</text>
      )}
    </svg>
  )
}
