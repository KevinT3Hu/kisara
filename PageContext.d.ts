declare global {
	namespace Vike {
		interface PageContext {
			session?: string;

			Page: () => JSX.Element;
		}
	}
}

export {};
