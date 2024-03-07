import fs from "fs-extra";
import inquirer from "inquirer";
import path from "path";

import { setupVue } from "./frameworks/vue.js";
import { installDependencies } from "./utils/generator.js";

export async function setupProject(options) {
	const projectPath = path.resolve(process.cwd(), options.path);

	const answers = await inquirer.prompt([
		{
			type: "checkbox",
			name: "frameworks",
			message: "Which frameworks do you want to setup?",
			choices: ["vue", "react", "svelte"],
		},
		{
			type: "list",
			name: "packageManager",
			message: "Which package manager are you using?",
			choices: ["pnpm", "yarn", "npm"],
		},
	]);

	const eslintConfig = {
		extends: ["@kembec/eslint-config/typescript", "plugin:astro/base"],
		overrides: [
			{
				files: ["*.astro"],
				parser: "astro-eslint-parser",
				parserOptions: {
					parser: "@typescript-eslint/parser",
					extraFileExtensions: [".astro"],
				},
			},
			{
				files: ["*.ts", "*.tsx"],
				parser: "@typescript-eslint/parser",
			},
		],
		plugins: ["astro"],
		settings: {
			"import/resolver": {
				typescript: {},
			},
		},
	};

	const dependencies = {
		devDependencies: [
			"@kembec/eslint-config",
			"@typescript-eslint/eslint-plugin",
			"@typescript-eslint/parser",
			"eslint-import-resolver-typescript",
			"eslint-plugin-astro",
			"prettier-plugin-astro",
			"prettier",
			"eslint",
			"astro-eslint-parser",
		],
	};

	if (answers.frameworks.includes("vue")) {
		setupVue(eslintConfig, dependencies);
	}

	installDependencies(dependencies, projectPath, answers.packageManager);
	await fs.writeJSON(path.join(projectPath, ".eslintrc.json"), eslintConfig, { spaces: 2 });

	console.log(`Setup completed for ${answers.frameworks.join(", ")} at ${projectPath}`);
}