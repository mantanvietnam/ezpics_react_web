import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StageState {
  stageData: any; // Replace `any` with the actual type of your stage data
  history: any[];
  historyStep: number;
}

const initialState: StageState = {
  stageData: {
    design: {},
    initSize: {},
    designLayers: [],
    selectedLayer: {},
  },
  history: [],
  historyStep: -1,
};

const addToHistory = (state: StageState) => {
  const newHistory = [
    ...state.history.slice(0, state.historyStep + 1),
    state.stageData,
  ];
  return {
    history: newHistory,
    historyStep: newHistory.length - 1,
  };
};

const stageSlice = createSlice({
  name: "stage",
  initialState,
  reducers: {
    setStageData: (state, action: PayloadAction<any>) => {
      state.stageData = action.payload;
      const { history, historyStep } = addToHistory(state);
      state.history = history;
      state.historyStep = historyStep;
    },
    addLayerImage: (state, action: PayloadAction<any>) => {
      state.stageData.designLayers = [
        ...state.stageData.designLayers,
        action.payload,
      ];
      const { history, historyStep } = addToHistory(state);
      state.history = history;
      state.historyStep = historyStep;
    },
    addLayerText: (state, action: PayloadAction<any>) => {
      const maxSort =
        state.stageData.designLayers.length > 0
          ? Math.max(
            ...state.stageData.designLayers.map((layer: any) => layer.sort)
          )
          : 0;

      const newLayer = {
        ...action.payload,
        sort: maxSort + 1,
      };

      state.stageData.designLayers = [
        ...state.stageData.designLayers,
        newLayer,
      ];
      const { history, historyStep } = addToHistory(state);
      state.history = history;
      state.historyStep = historyStep;
    },
    updateListLayers: (state, action: PayloadAction<any>) => {
      state.stageData.designLayers = action.payload;
      const { history, historyStep } = addToHistory(state);
      state.history = history;
      state.historyStep = historyStep;
    },
    removeLayer: (state, action: PayloadAction<any>) => {
      state.stageData.designLayers = state.stageData.designLayers.filter(
        (layer: any) => layer.id !== action.payload
      );
      const { history, historyStep } = addToHistory(state);
      state.history = history;
      state.historyStep = historyStep;
    },
    updateLayer: (state, action: PayloadAction<{ id: string; data: any }>) => {
      state.stageData.designLayers = state.stageData.designLayers.map(
        (layer: any) =>
          layer.id === action.payload.id
            ? {
              ...layer,
              content: { ...layer.content, ...action.payload.data },
            }
            : layer
      );
      const { history, historyStep } = addToHistory(state);
      state.history = history;
      state.historyStep = historyStep;
    },
    selectLayer: (state, action: PayloadAction<{ id: string }>) => {
      const layer = state.stageData.designLayers.find(
        (layer: any) => layer.id === action.payload.id
      );
      if (layer) {
        state.stageData.selectedLayer = { ...layer };
      }
    },
    selectLayerTool: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const designLayers = [...state.stageData.designLayers];

      // Save the original sort order
      designLayers.forEach((layer) => {
        layer.originalSort = layer.sort;
      });

      // Find the selected layer and move it to the top
      const selectedLayerIndex = designLayers.findIndex(layer => layer.id === id);
      if (selectedLayerIndex !== -1) {
        const selectedLayer = designLayers[selectedLayerIndex];

        // Remove the selected layer from its current position and add it to the end
        designLayers.splice(selectedLayerIndex, 1);
        selectedLayer.sort = designLayers.length;
        designLayers.push(selectedLayer);

        state.stageData.designLayers = designLayers;
        state.stageData.selectedLayer = selectedLayer;
      }
    },
    deselectLayerTool: (state) => {
      // Restore the original sort order of layers
      const designLayers = state.stageData.designLayers.map((layer: any) => ({
        ...layer,
        selected: false,
        sort: layer.originalSort || 0, // Restore to original sort or keep current if undefined
      })).sort((a: any, b: any) => a.sort - b.sort);

      state.stageData.designLayers = designLayers;
      state.stageData.selectedLayer = {};
    },

    moveLayerToFinal: (state, action: PayloadAction<{ id: string }>) => {
      const layerIndex = state.stageData.designLayers.findIndex(
        (layer: any) => layer.id === action.payload.id
      );
      if (layerIndex > -1) {
        const layer = state.stageData.designLayers[layerIndex];
        const updatedLayers = [
          layer,
          ...state.stageData.designLayers.filter(
            (_: any, index: any) => index !== layerIndex
          ),
        ].map((layer, index) => ({ ...layer, sort: index + 1 }));

        state.stageData.designLayers = updatedLayers;
        const { history, historyStep } = addToHistory(state);
        state.history = history;
        state.historyStep = historyStep;
      }
    },
    moveLayerToFront: (state, action: PayloadAction<{ id: string }>) => {
      const layerIndex = state.stageData.designLayers.findIndex(
        (layer: any) => layer.id === action.payload.id
      );
      if (layerIndex > -1) {
        const layer = state.stageData.designLayers[layerIndex];
        const updatedLayers = [
          ...state.stageData.designLayers.filter(
            (_: any, index: any) => index !== layerIndex
          ),
          layer,
        ].map((layer, index) => ({ ...layer, sort: index + 1 }));

        state.stageData.designLayers = updatedLayers;
        const { history, historyStep } = addToHistory(state);
        state.history = history;
        state.historyStep = historyStep;
      }
    },
    sendLayerBack: (state, action: PayloadAction<{ id: string }>) => {
      const layerIndex = state.stageData.designLayers.findIndex(
        (layer: any) => layer.id === action.payload.id
      );
      if (layerIndex > 0) {
        const updatedLayers = [...state.stageData.designLayers];
        const temp = updatedLayers[layerIndex - 1];
        updatedLayers[layerIndex - 1] = updatedLayers[layerIndex];
        updatedLayers[layerIndex] = temp;

        updatedLayers.forEach((layer, index) => {
          layer.sort = index + 1;
        });

        state.stageData.designLayers = updatedLayers;
        const { history, historyStep } = addToHistory(state);
        state.history = history;
        state.historyStep = historyStep;
      }
    },
    bringLayerForward: (state, action: PayloadAction<{ id: string }>) => {
      const layerIndex = state.stageData.designLayers.findIndex(
        (layer: any) => layer.id === action.payload.id
      );
      if (layerIndex < state.stageData.designLayers.length - 1) {
        const updatedLayers = [...state.stageData.designLayers];
        const temp = updatedLayers[layerIndex];
        updatedLayers[layerIndex] = updatedLayers[layerIndex + 1];
        updatedLayers[layerIndex + 1] = temp;

        updatedLayers.forEach((layer, index) => {
          layer.sort = index + 1;
        });

        state.stageData.designLayers = updatedLayers;
        const { history, historyStep } = addToHistory(state);
        state.history = history;
        state.historyStep = historyStep;
      }
    },
    undo: (state) => {
      if (state.historyStep > 0) {
        state.historyStep -= 1;
        state.stageData = state.history[state.historyStep];
      }
    },
    redo: (state) => {
      if (state.historyStep < state.history.length - 1) {
        state.historyStep += 1;
        state.stageData = state.history[state.historyStep];
      }
    },
  },
});

export const {
  setStageData,
  addLayerImage,
  removeLayer,
  updateLayer,
  selectLayer,
  selectLayerTool,
  deselectLayerTool,
  updateListLayers,
  moveLayerToFinal,
  moveLayerToFront,
  sendLayerBack,
  bringLayerForward,
  addLayerText,
  undo,
  redo,
} = stageSlice.actions;
export default stageSlice.reducer;
