import type { MiniMaxMusicV2Input, MiniMaxMusicV2Output } from "./types";

const FAL_API_BASE = "https://fal.run";

export interface FalClientOptions {
  apiKey?: string;
}

export class FalClient {
  private apiKey: string;

  constructor(options: FalClientOptions = {}) {
    this.apiKey = options.apiKey || process.env.FAL_API_KEY || "";
    if (!this.apiKey) {
      throw new Error("FAL_API_KEY is required");
    }
  }

  async run<TInput, TOutput>(
    modelId: string,
    input: TInput,
  ): Promise<TOutput> {
    const response = await fetch(`${FAL_API_BASE}/${modelId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${this.apiKey}`,
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Fal API error: ${response.status} - ${error}`);
    }

    return response.json() as Promise<TOutput>;
  }
}

// Singleton instance
let defaultClient: FalClient | null = null;

export function getFalClient(): FalClient {
  if (!defaultClient) {
    defaultClient = new FalClient();
  }
  return defaultClient;
}

export function createFalClient(options: FalClientOptions): FalClient {
  return new FalClient(options);
}

// MiniMax Music v2 specific function
export async function generateMusic(
  input: MiniMaxMusicV2Input,
): Promise<MiniMaxMusicV2Output> {
  const client = getFalClient();
  return client.run<MiniMaxMusicV2Input, MiniMaxMusicV2Output>(
    "fal-ai/minimax-music/v2",
    input,
  );
}
