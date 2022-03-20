import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface ModalState {
	id: number;
	isCookbookID: boolean;
	isOpen: boolean;
}

const initialState: ModalState = {
	id: 0,
	isCookbookID: true,
	isOpen: false,
};

export const modalSlice = createSlice({
	name: "modal",
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setModal: (
			state,
			action: PayloadAction<{ id: number; isCookbookID: boolean }>
		) => {
			state.id = action.payload.id;
			state.isCookbookID = action.payload.isCookbookID;
		},
		openModal: (state) => {
			state.isOpen = true;
		},
		closeModal: (state) => {
			state.isOpen = false;
		},
	},
});

export const { setModal, openModal, closeModal } = modalSlice.actions;

export const selectModal = (state: RootState) => state.modal;

export default modalSlice.reducer;
