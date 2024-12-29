import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface InitialStateTypes {
 showSideBar:boolean
}
const initialState: InitialStateTypes = {
showSideBar:true,
}
export const globalSlice = createSlice({
 name:'global',
 initialState,
 reducers:{
  setShowSideBar: (state, action:PayloadAction<boolean>)=>{
   state.showSideBar = action.payload
  }
 }
})
export const {setShowSideBar} = globalSlice.actions
export default globalSlice.reducer 