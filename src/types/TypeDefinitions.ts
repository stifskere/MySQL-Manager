import {Dispatch, SetStateAction} from "react";

export type StateTuple<S> = [S, Dispatch<SetStateAction<S>>];