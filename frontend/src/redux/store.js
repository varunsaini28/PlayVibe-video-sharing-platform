import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice.js"
import contentSlice from "./contentSlice.js"
import uploadSlice from "./uploadSlice.js"

export const store = configureStore({
    reducer:{
     user:userSlice,
     content:contentSlice,
     upload:uploadSlice,
    }
}) 