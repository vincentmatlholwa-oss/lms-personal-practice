interface MdihubLogoProps {
  className?: string
  width?: number
  height?: number
}

export function MdihubLogo({ className, width = 120, height = 120 }: MdihubLogoProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="30 80 360 370" width={width} height={height} className={className}>
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b8842a" />
          <stop offset="40%" stopColor="#d4a24a" />
          <stop offset="70%" stopColor="#c49038" />
          <stop offset="100%" stopColor="#8a6018" />
        </linearGradient>
      </defs>
      <g stroke="url(#logo-grad)" strokeWidth="7" strokeLinecap="round" fill="none">
        <line x1="284" y1="113" x2="368" y2="236" />
        <line x1="284" y1="113" x2="53" y2="305" />
        <line x1="284" y1="113" x2="111" y2="147" />
        <line x1="368" y1="236" x2="111" y2="147" />
        <line x1="366" y1="384" x2="256" y2="463" />
        <line x1="366" y1="384" x2="137" y2="431" />
        <line x1="256" y1="463" x2="137" y2="431" />
        <line x1="256" y1="463" x2="53" y2="305" />
        <line x1="137" y1="431" x2="53" y2="305" />
        <line x1="137" y1="431" x2="111" y2="147" />
        <line x1="53" y1="305" x2="111" y2="147" />
      </g>
      <g fill="url(#logo-grad)">
        <circle cx="284" cy="113" r="10" />
        <circle cx="368" cy="236" r="14" />
        <circle cx="366" cy="384" r="10" />
        <circle cx="256" cy="463" r="14" />
        <circle cx="137" cy="431" r="10" />
        <circle cx="53" cy="305" r="14" />
        <circle cx="111" cy="147" r="10" />
      </g>
      <text
        x="260" y="302"
        textAnchor="middle"
        fontFamily="'Arial Black','Helvetica Neue',Arial,sans-serif"
        fontSize="52"
        fontWeight="900"
        fill="#111111"
        letterSpacing="-1"
      >MDiHub</text>
      <text
        x="260" y="320"
        textAnchor="middle"
        fontFamily="Arial,'Helvetica Neue',Arial,sans-serif"
        fontSize="11.5"
        fontWeight="700"
        fill="#222222"
        letterSpacing="0.6"
      >Mafikeng Digital Innovation Hub</text>
    </svg>
  )
}
