import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface PlacesState {
  places: Place[];
}

const initialState: PlacesState = {
  places: [],
};

const placesSlice = createSlice({
  name: "places",
  initialState,
  reducers: {
    setPlaces: (state, action: PayloadAction<Place[]>) => {
      state.places = action.payload;
    },
    addPlace: (state, action: PayloadAction<Place>) => {
      state.places = [...state.places, action.payload];
    },
    updatePlace: (
      state,
      action: PayloadAction<{ placeIndex: number; updatedPlace: Place }>
    ) => {
      const { placeIndex, updatedPlace } = action.payload;
      state.places = state.places.map((place, index) =>
        index === placeIndex ? updatedPlace : place
      );
    },
    deletePlace: (state, action: PayloadAction<number>) => {
      const placeIndexToDelete = action.payload;
      state.places = state.places.filter(
        (_, index) => index !== placeIndexToDelete
      );
    },
  },
});

export const { setPlaces, addPlace, updatePlace, deletePlace } =
  placesSlice.actions;
export default placesSlice.reducer;
