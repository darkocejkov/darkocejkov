import React, {createContext} from 'react'
import {StateAPI} from "../types";

export const MenuContext = createContext<StateAPI | undefined>(undefined)