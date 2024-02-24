import {createContext} from "react";
import {NavRoute} from "../types";

export const LocationContext = createContext<NavRoute | undefined>(undefined)