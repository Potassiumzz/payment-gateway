import React from "react";

interface MediaQueryValue {
	type: "min-width" | "max-width";
	value: number;
}

export function useMediaQuery({ type, value }: MediaQueryValue) {
	const [matches, setMatches] = React.useState(false);

	React.useEffect(() => {
		const query = `(${type}: ${value}px)`;
		const mediaQuery = window.matchMedia(query);

		const handleChange = (event: MediaQueryListEvent) => {
			setMatches(event.matches);
		};

		setMatches(mediaQuery.matches);
		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, [type, value]);

	return matches;
}
