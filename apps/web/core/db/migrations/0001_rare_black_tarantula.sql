CREATE TABLE `audio_files` (
	`id` text PRIMARY KEY NOT NULL,
	`generation_id` text NOT NULL,
	`storage_type` text DEFAULT 'local' NOT NULL,
	`file_path` text NOT NULL,
	`public_url` text,
	`file_name` text,
	`file_size` integer,
	`content_type` text,
	`checksum` text,
	`duration` real,
	`bitrate` integer,
	`sample_rate` integer,
	`channels` integer,
	`source_url` text,
	`downloaded_at` integer,
	`cover_url` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`generation_id`) REFERENCES `generations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_audio_files_generation_id` ON `audio_files` (`generation_id`);--> statement-breakpoint
CREATE INDEX `idx_audio_files_storage_type` ON `audio_files` (`storage_type`);--> statement-breakpoint
CREATE TABLE `generation_params` (
	`generation_id` text PRIMARY KEY NOT NULL,
	`prompt` text NOT NULL,
	`lyrics_prompt` text,
	`is_instrumental` integer DEFAULT true,
	`duration` integer,
	`bitrate` integer,
	`sample_rate` integer,
	`channels` integer,
	`raw_parameters` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`generation_id`) REFERENCES `generations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_params_generation_id` ON `generation_params` (`generation_id`);--> statement-breakpoint
CREATE INDEX `idx_generations_status` ON `generations` (`status`);--> statement-breakpoint
CREATE INDEX `idx_generations_created_at` ON `generations` (`created_at`);--> statement-breakpoint
ALTER TABLE `generations` DROP COLUMN `prompt`;--> statement-breakpoint
ALTER TABLE `generations` DROP COLUMN `lyrics_prompt`;--> statement-breakpoint
ALTER TABLE `generations` DROP COLUMN `is_instrumental`;--> statement-breakpoint
ALTER TABLE `generations` DROP COLUMN `audio_url`;--> statement-breakpoint
ALTER TABLE `generations` DROP COLUMN `duration`;