export const logIt = (...args) => {
	console.log("LOG:", ...args);
};

export const logError = (...args) => {
	console.error("ERROR:", ...args);
};

export const logWarn = (...args) => {
	console.warn("WARN:", ...args);
};
