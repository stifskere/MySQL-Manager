import {useState} from "react";
import {StateTuple} from "@/types/TypeDefinitions";

export default function useTriggerReRender(): (() => void) {
	const [phase, setPhase]: StateTuple<boolean> = useState(false);

	return (): void => setPhase(!phase);
}