import "telefunc";

declare global {
	namespace Vike {
		interface PageContext {
			session?: string;

			Page: () => JSX.Element;
		}
	}
}

declare module "telefunc" {
	namespace Telefunc {
		interface Context {
			session?: string;
		}
	}
}
