/**
 * Music Generation Feature
 *
 * @example
 * ```tsx
 * import { useCreateGeneration, useGeneration } from "@/features/music-generation";
 *
 * function MyComponent() {
 *   const { mutate } = useCreateGeneration();
 *   const { data } = useGeneration(id);
 * }
 * ```
 */

// API
export { useCreateGeneration, useGeneration } from "./api/client"

// Components
export {
  ArtworkSection,
  DetailsSection,
  ErrorState,
  LoadingState,
} from "./components"

// Utils
export { formatDate, getStatusText } from "./lib/utils"

// Types
export type {
  CreateGenerationInput,
  CreateGenerationResponse,
  Generation,
  GenerationStatusUpdate,
} from "./types"
