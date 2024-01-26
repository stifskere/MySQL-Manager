import {FocusEvent, KeyboardEvent, MutableRefObject, ReactElement, useRef, useState} from "react";
import {StateTuple} from "@/types/TypeDefinitions";

import {FaXmark} from "react-icons/fa6";

import "./index.css";

export interface Tab<TArgs> {
	icon?: ReactElement
	name: string;
	isRenaming: boolean;
	args: TArgs;
}

export type TabView<TArgs> = [
	ReactElement, // element,
	number, // current index
	MutableRefObject<Tab<TArgs>[]>, // all tabs
	(tab: string | number) => void // move current
];

export default function useTabView<TArgs>(minimumTabs: number = 1, onChangeTab: ((tab: Tab<TArgs>) => void) = (): void => {}): TabView<TArgs> {
	const [forceReKey, setForceReKey]: StateTuple<number> = useState<number>(0);
	const [currentTab, setCurrentTab]: StateTuple<number> = useState<number>(0);
	const tabs: MutableRefObject<Tab<TArgs>[]> = useRef<Tab<TArgs>[]>([]);

	function forceReRender(): void {
		setForceReKey(forceReKey > 1000 ? 0 : forceReKey + 1);
	}

	function onChangeTabWrapper(index?: number): void {
		onChangeTab(tabs.current[index ?? currentTab]);
	}

	function setCurrent(tab: string | number): void {
		const index: number = typeof tab === "string"
			? tabs.current.findIndex((t: Tab<TArgs>): boolean => t.name == tab)
			: tab;

		if (index !== -1)
			setCurrentTab(index);
	}

	function closeTab(index: number): (() => void) {
		return (): void => {
			tabs.current.splice(index, 1);
			const nextFile: number = index - 1 < 0 ? index : index - 1;

			if (nextFile === currentTab)
				forceReRender();

			setCurrentTab(nextFile);
			onChangeTabWrapper(nextFile);
		}
	}

	function changeTab(index: number): (() => void) {
		return (): void => {
			setCurrentTab(index);
			onChangeTabWrapper();
		};
	}

	function renameTab(index: number): (() => void) {
		return (): void => {
			for (const file in tabs.current)
				tabs.current[file].isRenaming = false;

			tabs.current[index].isRenaming = true;

			forceReRender();
		};
	}

	function onSubmitRename(index: number): ((event: KeyboardEvent<HTMLInputElement>) => void) {
		return (event: KeyboardEvent<HTMLInputElement>): void => {
			if (event.code !== "Enter")
				return;

			tabs.current[index].isRenaming = false;
			tabs.current[index].name = (event.target as HTMLInputElement).value;

			forceReRender();
			onChangeTabWrapper();
		};
	}

	function onBlurRename(index: number): ((event: FocusEvent<HTMLInputElement>) => void) {
		return (event: FocusEvent<HTMLInputElement>): void => {
			tabs.current[index].isRenaming = false;
			tabs.current[index].name = (event.target as HTMLInputElement).value;

			forceReRender();
			onChangeTabWrapper();
		};
	}

	const component: ReactElement = (<div className="tab-bar-main">
		{tabs.current.map(({name, isRenaming, icon}: Tab<TArgs>, key: number): ReactElement => (
			<div draggable onAuxClick={tabs.current.length > minimumTabs ? closeTab(key) : undefined}
				 key={key} className={`tab-bar-tab ${currentTab === key && "tab-bar-current-tab"}`}>
				{icon && icon}
				{isRenaming
					? <input onBlur={onBlurRename(key)} onKeyDown={onSubmitRename(key)} autoFocus
							 className="tab-bar-edit-input" defaultValue={name}/>
					: <p onClick={changeTab(key)} onDoubleClick={renameTab(key)}>{name}</p>}
				{tabs.current.length > minimumTabs && <FaXmark className="tab-bar-close-tab" onClick={closeTab(key)}/>}
			</div>
		))}
	</div>);

	return [component, currentTab, tabs, setCurrent];
}