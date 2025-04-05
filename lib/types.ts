export interface AnimeData {
	id: number;
	type: number;
	name: string;
	name_cn: string;
	summary: string;
	nsfw: boolean;
	date?: string;
	images: Images;
	volumes: number;
	eps: number;
	total_episodes: number;
	rating: Rating;
	collection: Collection;
	tags: Tag[];
}

interface Images {
	large: string;
	common: string;
	medium: string;
	small: string;
	grid: string;
}

interface Rating {
	rank: number;
	total: number;
	count: {
		"1": number;
		"2": number;
		"3": number;
		"4": number;
		"5": number;
		"6": number;
		"7": number;
		"8": number;
		"9": number;
		"10": number;
	};
	score: number;
}

interface Collection {
	wish: number;
	collect: number;
	doing: number;
	on_hold: number;
	dropped: number;
}

interface Tag {
	name: string;
	count: number;
}
