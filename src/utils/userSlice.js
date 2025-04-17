import { createSlice } from "@reduxjs/toolkit";

const userslicer=createSlice({
	name:"user",
	initialState:null,
	reducers:{
		adduser:(state,action)=>{
			return action.payload;
		},
		removeuser:(state,action)=>{
			return null;
		}},
})

export const {adduser,removeuser}=userslicer.actions;
export default userslicer.reducer;