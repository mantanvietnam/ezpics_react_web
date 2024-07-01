import { RootState } from "../../rootReducer";

export const selectPages = (state: RootState) => state.designEditor.pages;
