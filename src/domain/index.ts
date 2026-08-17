export { piValue, piLabel, PI_MODES, type PiMode } from './pi.ts'
export { parseDecimal } from './parse.ts'
export {
  LENGTH_UNITS,
  MASS_UNITS,
  VOLUME_UNITS,
  lengthToCm,
  massToG,
  volumeToMl,
  volumeUnitLabel,
  type LengthUnit,
  type MassUnit,
  type VolumeUnit,
} from './units.ts'
export {
  roundErrorUp,
  roundValueToDelta,
  roundToSigFigs,
  decimalPlacesForDelta,
} from './rounding.ts'
export {
  formatDecimal,
  formatAuto,
  formatScientific,
  formatMeasurement,
  formatCopyLine,
} from './format.ts'
export {
  express,
  percentDifference,
  errorVsReference,
  ALUMINUM_DENSITY_G_CM3,
  type Expressed,
} from './measurement.ts'
export { comparePropagation, propagateExtremes, propagatePartials, type CompareResult, type Contribution, type NamedValue } from './propagation.ts'
export {
  geometryById,
  solidCylinder,
  steppedSolid,
  steppedHole,
  tube,
  velocityModel,
  type GeometryId,
  type GeometryModel,
} from './geometries.ts'
export { linearRegression, type LinearFit } from './regression.ts'
export { densityFromMassVolume, densityPropagation } from './density.ts'
