export type LabStatus = 'ready' | 'soon'

export type LabModule = {
  id: string
  number: number
  title: string
  short: string
  path: string
  status: LabStatus
}

export const labs: LabModule[] = [
  {
    id: 'tp1',
    number: 1,
    title: 'Mediciones y error',
    short: 'Volumen, densidad y propagación',
    path: '/labs/tp1',
    status: 'ready',
  },
  {
    id: 'tp2',
    number: 2,
    title: 'Movimiento circular',
    short: '15 de septiembre',
    path: '/labs/tp2',
    status: 'soon',
  },
  {
    id: 'tp3',
    number: 3,
    title: 'Laboratorio 3',
    short: '20 de octubre',
    path: '/labs/tp3',
    status: 'soon',
  },
  {
    id: 'tp4',
    number: 4,
    title: 'Laboratorio 4',
    short: '10 de noviembre',
    path: '/labs/tp4',
    status: 'soon',
  },
]
