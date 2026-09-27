import { Extension } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import { ReactRenderer } from "@tiptap/react";
import { Suggestion, type SuggestionProps } from "@tiptap/suggestion";
import { shift } from "@floating-ui/dom";
import { filterSlashItems, type SlashCommandItem } from "./items";
import { SlashMenu, type SlashMenuHandle } from "./slash-menu";

export { createSlashItems } from "./items";

type SlashCommandOptions = {
	items: SlashCommandItem[];
};

type SlashProps = SuggestionProps<SlashCommandItem, SlashCommandItem>;

export const SlashCommand = Extension.create<SlashCommandOptions>({
	name: "slashCommand",
	// Run before list and block keymaps so Enter and arrows reach the open menu.
	priority: 1000,

	addOptions() {
		return { items: [] };
	},

	addProseMirrorPlugins() {
		return [
			Suggestion<SlashCommandItem, SlashCommandItem>({
				pluginKey: new PluginKey("slashCommand"),
				editor: this.editor,
				char: "/",
				floatingUi: { middleware: [shift({ padding: 16 })] },
				items: ({ query }) =>
					filterSlashItems(this.options.items, query),
				allow: ({ state, range }) =>
					state.doc.resolve(range.from).parent.type.name !==
					"codeBlock",
				command: ({ editor, range, props }) =>
					props.command({ editor, range }),
				render: () => {
					let component: ReactRenderer<
						SlashMenuHandle,
						SlashProps
					> | null = null;
					let unmount: (() => void) | undefined;

					return {
						onStart: (props) => {
							component = new ReactRenderer(SlashMenu, {
								props,
								editor: props.editor,
								className: "z-[60]",
							});
							unmount = props.mount(
								component.element as HTMLElement,
							);
						},
						onUpdate: (props) => component?.updateProps(props),
						onKeyDown: ({ event }) =>
							component?.ref?.onKeyDown(event) ?? false,
						onExit: () => {
							unmount?.();
							component?.destroy();
							component = null;
						},
					};
				},
			}),
		];
	},
});
