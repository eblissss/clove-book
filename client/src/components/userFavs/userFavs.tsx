import { getFavoriteIDs, setFavorite } from "../../api/requests";

// maybe we should make a class
export class Favorites {

	favoriteSet = new Set<string>();
	userID: string;
	
	constructor(userID: string) {
		this.userID = userID;
		getFavoriteIDs(userID, "").then(data => {this.favoriteSet = new Set(data)});
	}

	isFavorite = (id: string) => {
		return this.favoriteSet.has(id)
	}

	updateFavorite = (id: string, set: boolean) => {
		if (set) {
			this.favoriteSet.add(id)	
		} else {
			this.favoriteSet.delete(id)
		}
	}
	
		setFavorite(userID, set, id);
	}
}
