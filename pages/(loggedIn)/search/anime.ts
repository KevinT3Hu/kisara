export interface Anime {
	id: number;
	name: string;
	name_cn: string;
	summary: string;
	date?: string;
	images: {
		large: string;
		common: string;
		medium: string;
		small: string;
		grid: string;
	};
}
