import { relative } from "path";

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => relative(process.cwd(), f))
    .join(" --file ")}`;

const check = {
  "*.(ts|tsx)": () => "npm run type-check",
  "*.{js,jsx,ts,tsx,json,md,css,scss}": "npm run prettier",
  "*.{js,jsx,ts,tsx}": [buildEslintCommand],
};
export default check;
