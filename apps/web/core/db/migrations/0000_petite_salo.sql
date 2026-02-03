CREATE TABLE `generations` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`prompt` text NOT NULL,
	`lyrics_prompt` text,
	`is_instrumental` integer DEFAULT true NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`audio_url` text,
	`duration` real,
	`error_message` text,
	`fal_request_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
