CREATE TABLE `app_state` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`current_phase` text DEFAULT 'submit' NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `designs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`image_url` text NOT NULL,
	`submitter_name` text NOT NULL,
	`submitter_token` text NOT NULL,
	`submitted_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `results` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`round` text NOT NULL,
	`finalist_ids` text NOT NULL,
	`total_voters` integer NOT NULL,
	`elimination_data` text,
	`computed_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `results_round_unique` ON `results` (`round`);--> statement-breakpoint
CREATE TABLE `votes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`voter_token` text NOT NULL,
	`voter_name` text NOT NULL,
	`round` text NOT NULL,
	`first_choice` integer NOT NULL,
	`second_choice` integer NOT NULL,
	`third_choice` integer NOT NULL,
	`submitted_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `votes_voter_token_round_unique` ON `votes` (`voter_token`,`round`);