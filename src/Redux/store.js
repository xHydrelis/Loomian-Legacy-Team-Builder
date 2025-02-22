import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialTeamState = {
    team: [
        {name: 'Embit', loomipedia_id: "001", type: ['Fire']},
        {name: 'Unknown', loomipedia_id: "000", type: ['Unknown']},
        {name: 'Unknown', loomipedia_id: "000", type: ['Unknown']},
        {name: 'Unknown', loomipedia_id: "000", type: ['Unknown']},
        {name: 'Unknown', loomipedia_id: "000", type: ['Unknown']},
        {name: 'Unknown', loomipedia_id: "000", type: ['Unknown']},
        {name: 'Unknown', loomipedia_id: "000", type: ['Unknown']},
    ],
};

const teamSlice = createSlice({
    name: 'loomianTeam',
    initialState: initialTeamState,
    reducers: {
        editTeam(state, action) {
            state.team[action.payload.index] = action.payload.loomian;
        },

        removeLoomian(state, action) {
            const unknownLoomian = { 
              name: 'Unknown', 
              loomipedia_id: '000', 
              type: ['Unknown'] 
            };
            state.team[action.payload] = unknownLoomian;
        },
    },
});

const initialSearchState = {
    searchOn: false,
}

const searchSlice = createSlice({
    name: 'search',
    initialState: initialSearchState,
    reducers: {
        toggleSearch(state) {
            state.searchOn = !state.searchOn;
        }
    }
});

export const { toggleSearch } = searchSlice.actions;
export const { editTeam, removeLoomian } = teamSlice.actions;

const store = configureStore({
    reducer: {
        loomiansTeam: teamSlice.reducer,
        search: searchSlice.reducer,
    },
});

export default store;