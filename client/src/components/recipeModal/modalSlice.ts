import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface ModalState {
	id: string;
	isOpen: boolean;
}

const initialState: ModalState = {
	id: "",
	isOpen: false,
};

export const modalSlice = createSlice({
	name: "modal",
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setModal: (state, action: PayloadAction<{ id: string }>) => {
			state.id = action.payload.id;
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
