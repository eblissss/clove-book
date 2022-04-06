import { getFavoriteIDs, setFavorite, updateAllFavorites } from "../../api/requests";

import React from 'react'

function userFavs() {
  return (
	<div>userFavs</div>
  )
}

export default userFavs



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
	
	reuploadFavorites = (userID: string) => {
		let array : Array<string> = Array.from(this.favoriteSet);
		updateAllFavorites(userID, array);
	}
		//setFavorite(userID, set, id);
	}
	let bonk = new Favorites("6248ac5bcb536d2a6c1d76b2");
}
