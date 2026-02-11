const reset = "\x1b[0m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const red = "\x1b[31m";

export const logIt = (...args) => {
	console.log(`${green}LOG:${reset}`, ...args);
};

export const logWarn = (...args) => {
	console.warn(`${yellow}WARN:${reset}`, ...args);
};

export const logError = (...args) => {
	console.error(`${red}ERROR:${reset}`, ...args);
};
