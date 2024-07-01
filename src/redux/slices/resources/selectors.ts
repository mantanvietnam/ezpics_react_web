import { RootState } from "@/redux/store";

export const selectPixabayResources = (state: RootState) =>
  state.resources.pixabay;
