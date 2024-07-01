import { RootState } from "@/redux/store";

export const selectFonts = (state: RootState) => state.fonts.fonts;
