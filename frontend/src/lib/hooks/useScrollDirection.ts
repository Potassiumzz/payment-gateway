import React from "react";

export function useScrollDirection() {
	const [hidden, setHidden] = React.useState(false);
	const lastY = React.useRef(0);

	React.useEffect(() => {
		function handleScroll() {
			const currentY = window.scrollY;
			const diff = currentY - lastY.current;

			if (currentY < 50) {
				setHidden(false); // always show near top
			} else if (Math.abs(diff) > 5) {
				setHidden(diff > 0); // diff > 0 means scrolling down
			}

			lastY.current = currentY;
		}

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return hidden;
}
