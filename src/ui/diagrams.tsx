type DiagramProps = { highlight?: string }

function mark(name: string, highlight?: string): string {
  return highlight === name ? '#c45c26' : '#1c2834'
}

function width(name: string, highlight?: string): number {
  return highlight === name ? 3.2 : 1.2
}

export function SolidCylinderDiagram({ highlight }: DiagramProps) {
  return (
    <svg className="diagram" viewBox="-8 0 236 148" role="img" aria-label="Cilindro: altura h y diámetro d">
      <ellipse cx="110" cy="36" rx="48" ry="14" fill="#d7e3dc" stroke="#1c2834" />
      <path d="M62 36 v68 a48 14 0 0 0 96 0 v-68" fill="#eef4f0" stroke="#1c2834" />
      <ellipse cx="110" cy="36" rx="48" ry="14" fill="#c5d6cc" stroke="#1c2834" />
      <line x1="110" y1="36" x2="158" y2="36" stroke={mark('d', highlight)} strokeWidth={width('d', highlight)} />
      <text x="164" y="40" className="diagram-label" fill={mark('d', highlight)}>
        diámetro d
      </text>
      <line x1="168" y1="36" x2="168" y2="104" stroke={mark('h', highlight)} strokeWidth={width('h', highlight)} />
      <text x="176" y="74" className="diagram-label" fill={mark('h', highlight)}>
        altura h
      </text>
    </svg>
  )
}

export function SteppedDiagram({ highlight }: DiagramProps) {
  return (
    <svg className="diagram" viewBox="0 0 280 160" role="img" aria-label="Cilindro escalonado">
      <rect x="70" y="20" width="50" height="40" fill="#d7e3dc" stroke="#1c2834" />
      <rect x="50" y="60" width="90" height="55" fill="#eef4f0" stroke="#1c2834" />
      <line x1="70" y1="20" x2="120" y2="20" stroke={mark('d', highlight)} strokeWidth={width('d', highlight)} />
      <text x="72" y="16" className="diagram-label" fill={mark('d', highlight)}>
        d
      </text>
      <line x1="128" y1="20" x2="128" y2="60" stroke={mark('h', highlight)} strokeWidth={width('h', highlight)} />
      <text x="134" y="44" className="diagram-label" fill={mark('h', highlight)}>
        h
      </text>
      <line x1="50" y1="124" x2="140" y2="124" stroke={mark('D', highlight)} strokeWidth={width('D', highlight)} />
      <text x="86" y="140" className="diagram-label" fill={mark('D', highlight)}>
        D
      </text>
      <line x1="160" y1="60" x2="160" y2="115" stroke={mark('H', highlight)} strokeWidth={width('H', highlight)} />
      <text x="166" y="92" className="diagram-label" fill={mark('H', highlight)}>
        H
      </text>
    </svg>
  )
}

export function TubeDiagram({ highlight }: DiagramProps) {
  return (
    <svg className="diagram" viewBox="0 0 260 160" role="img" aria-label="Tubo: H, Di, De">
      <ellipse cx="110" cy="40" rx="60" ry="18" fill="#d7e3dc" stroke="#1c2834" />
      <path d="M50 40 v70 a60 18 0 0 0 120 0 v-70" fill="#eef4f0" stroke="#1c2834" />
      <ellipse cx="110" cy="40" rx="60" ry="18" fill="#c5d6cc" stroke="#1c2834" />
      <ellipse cx="110" cy="40" rx="24" ry="8" fill="#e7eee9" stroke="#1c2834" />
      <line x1="110" y1="40" x2="170" y2="40" stroke={mark('De', highlight)} strokeWidth={width('De', highlight)} />
      <text x="142" y="32" className="diagram-label" fill={mark('De', highlight)}>
        De afuera
      </text>
      <line x1="110" y1="50" x2="134" y2="50" stroke={mark('Di', highlight)} strokeWidth={width('Di', highlight)} />
      <text x="88" y="68" className="diagram-label" fill={mark('Di', highlight)}>
        Di adentro
      </text>
      <line x1="180" y1="40" x2="180" y2="110" stroke={mark('H', highlight)} strokeWidth={width('H', highlight)} />
      <text x="186" y="80" className="diagram-label" fill={mark('H', highlight)}>
        altura H
      </text>
    </svg>
  )
}
