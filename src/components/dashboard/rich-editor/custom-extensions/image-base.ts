import { Image } from "@tiptap/extension-image";

// Image schema without the editing node view, so the server can render it too.
export const ImageBase = Image.extend({
	addAttributes() {
		return {
			src: {
				default: null,
			},
			alt: {
				default: null,
			},
			title: {
				default: null,
			},
			width: {
				default: "100%",
			},
			height: {
				default: null,
			},
			align: {
				default: "center",
			},
			caption: {
				default: null,
				parseHTML: (element) => element.getAttribute("data-caption"),
				renderHTML: (attributes) =>
					attributes.caption
						? { "data-caption": attributes.caption }
						: {},
			},
		};
	},
});
