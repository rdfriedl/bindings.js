module bindings {
	export module utils {
		export function setAttr(el: HTMLElement, attr: string, value: any) {
			if (value != null)
				el.setAttribute(attr, value);
			else
				el.removeAttribute(attr);
		}
	}
}