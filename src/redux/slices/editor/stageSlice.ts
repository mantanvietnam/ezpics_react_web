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
    currentPage: {
      page: 0,
      pageLayers: []
    },
    totalPages: 0
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
    setCurrentPage: (state, action: PayloadAction<any>) => {
      state.stageData.currentPage = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<any>) => {
      state.stageData.totalPages = action.payload;
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
    // addLayerSVG: (state, action: PayloadAction<string>) => {
    //   state.stageData.designLayers = [
    //     ...state.stageData.designLayers,
    //     { type: "svg", content: action.payload },
    //   ];
    // },
    updatePageLayer: (state, action: PayloadAction<any>) => {
      state.stageData.currentPage.pageLayers = [
        ...state.stageData.currentPage.pageLayers,
        action.payload
      ]
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
    updatePageLayerText: (state, action: PayloadAction<any>) => {
      // Tìm giá trị sort lớn nhất hiện tại trong designLayers
      const maxSort =
        state.stageData.currentPage.pageLayers.length > 0
          ? Math.max(
            ...state.stageData.currentPage.pageLayers.map((layer: any) => layer.sort)
          )
          : 0;

      // Tạo phần tử mới với giá trị sort được cập nhật
      const newLayer = {
        ...action.payload,
        sort: maxSort + 1,
      };

      // Cập nhật state với phần tử mới
      state.stageData.currentPage.pageLayers = [
        ...state.stageData.currentPage.pageLayers,
        newLayer,
      ];
    },
    updateListLayers: (state, action: PayloadAction<any>) => {
      // Cập nhật pageLayers với dữ liệu mới
      state.stageData.currentPage.pageLayers = action.payload;

      // Cập nhật designLayers dựa trên pageLayers
      state.stageData.designLayers = [...action.payload]; // Ví dụ đơn giản, có thể thay đổi theo logic của bạn

      // Lưu vào history
      const { history, historyStep } = addToHistory(state);
      state.history = history;
      state.historyStep = historyStep;
    },
    removeLayer: (state, action: PayloadAction<any>) => {
      state.stageData.designLayers = state.stageData.designLayers.filter(
        (layer: any) => layer.id !== action.payload
      );
      state.stageData.currentPage.pageLayers = state.stageData.currentPage.pageLayers.filter(
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
      state.stageData.currentPage.pageLayers = state.stageData.currentPage.pageLayers.map(
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
      const designLayers = [...state.stageData.currentPage.pageLayers];

      // Save the original sort order if not already saved
      designLayers.forEach(layer => {
        if (layer.originalSort === undefined) {
          layer.originalSort = layer.sort;
        }
      });

      // Find the selected layer in currentPage.pageLayers
      const selectedLayerIndex = designLayers.findIndex(layer => layer.id === id);
      if (selectedLayerIndex !== -1) {
        const selectedLayer = designLayers[selectedLayerIndex];

        // Remove the selected layer from its current position
        designLayers.splice(selectedLayerIndex, 1);
        // Set it to the top with the highest sort value
        selectedLayer.sort = designLayers.length + 1; // Move it to the top by assigning the highest sort value
        designLayers.push(selectedLayer); // Add it to the end of the array

        // Update the sort order for all layers
        designLayers.forEach((layer, index) => {
          layer.sort = designLayers.length - index; // Highest sort value at the top
        });

        // Update the state
        state.stageData.currentPage.pageLayers = designLayers;
        state.stageData.selectedLayer = selectedLayer;

        // Optionally, if you need to reflect these changes in designLayers as well
        state.stageData.designLayers = designLayers;
      }
    },

    deselectLayerTool: (state) => {
      // Restore the original sort order of layers
      const designLayers = state.stageData.currentPage.pageLayers.map((layer: any) => ({
        ...layer,
        selected: false, // Unselect all layers
        sort: layer.originalSort !== undefined ? layer.originalSort : layer.sort, // Restore to original sort or keep current if undefined
      }));

      // Sort layers back to their original order
      designLayers.sort((a: any, b: any) => b.sort - a.sort); // Sort in descending order so highest sort values are at the top

      // Update the state with the modified layers
      state.stageData.currentPage.pageLayers = designLayers;
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

      //update
      const layerIndexCurrent = state.stageData.currentPage.pageLayers.findIndex(
        (layer: any) => layer.id === action.payload.id
      );
      if (layerIndexCurrent > -1) {
        const layer = state.stageData.currentPage.pageLayers[layerIndexCurrent];
        const updatedLayers = [
          layer,
          ...state.stageData.currentPage.pageLayers.filter(
            (_: any, index: any) => index !== layerIndexCurrent
          ),
        ].map((layer, index) => ({ ...layer, sort: index + 1 }));

        state.stageData.currentPage.pageLayers = updatedLayers;
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

      //update
      const layerIndexCurrent = state.stageData.currentPage.pageLayers.findIndex(
        (layer: any) => layer.id === action.payload.id
      );
      if (layerIndexCurrent > -1) {
        const layer = state.stageData.currentPage.pageLayers[layerIndexCurrent];
        const updatedLayers = [
          ...state.stageData.currentPage.pageLayers.filter(
            (_: any, index: any) => index !== layerIndexCurrent
          ),
          layer,
        ].map((layer, index) => ({ ...layer, sort: index + 1 }));

        state.stageData.currentPage.pageLayers = updatedLayers;
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

      //update
      const layerIndexCurrent = state.stageData.currentPage.pageLayers.findIndex(
        (layer: any) => layer.id === action.payload.id
      );
      if (layerIndexCurrent > 0) {
        const updatedLayers = [...state.stageData.currentPage.pageLayers];
        const temp = updatedLayers[layerIndexCurrent - 1];
        updatedLayers[layerIndexCurrent - 1] = updatedLayers[layerIndexCurrent];
        updatedLayers[layerIndexCurrent] = temp;

        updatedLayers.forEach((layer, index) => {
          layer.sort = index + 1;
        });

        state.stageData.currentPage.pageLayers = updatedLayers;
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
      //update
      const layerIndexCurrent = state.stageData.currentPage.pageLayers.findIndex(
        (layer: any) => layer.id === action.payload.id
      );
      if (layerIndexCurrent < state.stageData.currentPage.pageLayers.length - 1) {
        const updatedLayers = [...state.stageData.currentPage.pageLayers];
        const temp = updatedLayers[layerIndexCurrent];
        updatedLayers[layerIndexCurrent] = updatedLayers[layerIndexCurrent + 1];
        updatedLayers[layerIndexCurrent + 1] = temp;

        updatedLayers.forEach((layer, index) => {
          layer.sort = index + 1;
        });

        state.stageData.currentPage.pageLayers = updatedLayers;
      }
    },
    deletePage: (state, action: PayloadAction<number>) => {
      state.stageData.designLayers = state.stageData.designLayers.filter((layer: any) => layer.content.page !== action.payload);
      // Điều chỉnh `page` của các layer còn lại
      state.stageData.designLayers = state.stageData.designLayers.map(
        (layer: any) => {
          if (layer.content.page > action.payload) {
            return {
              ...layer,
              content: {
                ...layer.content,
                page: layer.content.page - 1,
              },
            };
          }
          return layer;
        }
      );
      // Giảm tổng số trang (nếu có lưu trữ)
      if (state.stageData.totalPages) {
        state.stageData.totalPages -= 1;
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
    addPage: (state) => {
      state.stageData.totalPages = state.stageData.totalPages + 1
    }
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
  setCurrentPage,
  setTotalPages,
  updatePageLayer,
  updatePageLayerText,
  undo,
  redo,
  addPage,
  deletePage
} = stageSlice.actions;
export default stageSlice.reducer;
