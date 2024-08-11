import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PrintState {
    stageData: {
        design: any; // Replace `any` with the actual type of your design data
        initSize: any;
        designLayers: any[];
        selectedLayer: any;
    };
}

const initialState: PrintState = {
    stageData: {
        design: {},
        initSize: {},
        designLayers: [],
        selectedLayer: {},
    },
};

const printSlice = createSlice({
    name: "print",
    initialState,
    reducers: {
        setStageData: (state, action: PayloadAction<any>) => {
            state.stageData = action.payload;
        },
        addLayerImage: (state, action: PayloadAction<any>) => {
            state.stageData.designLayers.push(action.payload);
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

            state.stageData.designLayers.push(newLayer);
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
        },
        selectLayer: (state, action: PayloadAction<{ id: string }>) => {
            const layer = state.stageData.designLayers.find(
                (layer: any) => layer.id === action.payload.id
            );
            if (layer) {
                state.stageData.selectedLayer = { ...layer };
            }
        },
        deselectLayerTool: (state) => {
            state.stageData.selectedLayer = {};
        },
        removeLayer: (state, action: PayloadAction<any>) => {
            state.stageData.designLayers = state.stageData.designLayers.filter(
                (layer: any) => layer.id !== action.payload
            );
        },
        moveLayerToFinal: (state, action: PayloadAction<{ id: string }>) => {
            const layerIndex = state.stageData.designLayers.findIndex(
                (layer: any) => layer.id === action.payload.id
            );
            if (layerIndex > -1) {
                const layer = state.stageData.designLayers[layerIndex];
                state.stageData.designLayers = [
                    layer,
                    ...state.stageData.designLayers.filter(
                        (_: any, index: any) => index !== layerIndex
                    ),
                ].map((layer, index) => ({ ...layer, sort: index + 1 }));
            }
        },
        moveLayerToFront: (state, action: PayloadAction<{ id: string }>) => {
            const layerIndex = state.stageData.designLayers.findIndex(
                (layer: any) => layer.id === action.payload.id
            );
            if (layerIndex > -1) {
                const layer = state.stageData.designLayers[layerIndex];
                state.stageData.designLayers = [
                    ...state.stageData.designLayers.filter(
                        (_: any, index: any) => index !== layerIndex
                    ),
                    layer,
                ].map((layer, index) => ({ ...layer, sort: index + 1 }));
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
            }
        },
    },
});

export const {
    setStageData,
    addLayerImage,
    addLayerText,
    updateLayer,
    selectLayer,
    deselectLayerTool,
    removeLayer,
    moveLayerToFinal,
    moveLayerToFront,
    sendLayerBack,
    bringLayerForward,
} = printSlice.actions;

export default printSlice.reducer;
