"use client";

import { createContext, useContext } from "react";

export const RoadmapIdContext = createContext<string>("");
export const useRoadmapId = () => useContext(RoadmapIdContext);

export const ReadOnlyContext = createContext<boolean>(false);
export const useReadOnly = () => useContext(ReadOnlyContext);
