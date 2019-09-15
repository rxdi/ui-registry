declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/lib/part' {
	/**
	 * @license
	 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	/**
	 * @module lit-html
	 */
	/**
	 * The Part interface represents a dynamic part of a template instance rendered
	 * by lit-html.
	 */
	export interface Part {
	    readonly value: unknown;
	    /**
	     * Sets the current part value, but does not write it to the DOM.
	     * @param value The value that will be committed.
	     */
	    setValue(value: unknown): void;
	    /**
	     * Commits the current part value, causing it to actually be written to the
	     * DOM.
	     *
	     * Directives are run at the start of `commit`, so that if they call
	     * `part.setValue(...)` synchronously that value will be used in the current
	     * commit, and there's no need to call `part.commit()` within the directive.
	     * If directives set a part value asynchronously, then they must call
	     * `part.commit()` manually.
	     */
	    commit(): void;
	}
	/**
	 * A sentinel value that signals that a value was handled by a directive and
	 * should not be written to the DOM.
	 */
	export const noChange: {};
	/**
	 * A sentinel value that signals a NodePart to fully clear its content.
	 */
	export const nothing: {};

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/lib/template' {
	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	/**
	 * @module lit-html
	 */
	import { TemplateResult } from './template-result';
	/**
	 * An expression marker with embedded unique key to avoid collision with
	 * possible text in templates.
	 */
	export const marker: string;
	/**
	 * An expression marker used text-positions, multi-binding attributes, and
	 * attributes with markup-like text values.
	 */
	export const nodeMarker: string;
	export const markerRegex: RegExp;
	/**
	 * Suffix appended to all bound attribute names.
	 */
	export const boundAttributeSuffix = "$lit$";
	/**
	 * An updateable Template that tracks the location of dynamic parts.
	 */
	export class Template {
	    readonly parts: TemplatePart[];
	    readonly element: HTMLTemplateElement;
	    constructor(result: TemplateResult, element: HTMLTemplateElement);
	}
	/**
	 * A placeholder for a dynamic expression in an HTML template.
	 *
	 * There are two built-in part types: AttributePart and NodePart. NodeParts
	 * always represent a single dynamic expression, while AttributeParts may
	 * represent as many expressions are contained in the attribute.
	 *
	 * A Template's parts are mutable, so parts can be replaced or modified
	 * (possibly to implement different template semantics). The contract is that
	 * parts can only be replaced, not removed, added or reordered, and parts must
	 * always consume the correct number of values in their `update()` method.
	 *
	 * TODO(justinfagnani): That requirement is a little fragile. A
	 * TemplateInstance could instead be more careful about which values it gives
	 * to Part.update().
	 */
	export type TemplatePart = {
	    readonly type: 'node';
	    index: number;
	} | {
	    readonly type: 'attribute';
	    index: number;
	    readonly name: string;
	    readonly strings: ReadonlyArray<string>;
	};
	export const isTemplatePartActive: (part: TemplatePart) => boolean;
	export const createMarker: () => Comment;
	/**
	 * This regex extracts the attribute name preceding an attribute-position
	 * expression. It does this by matching the syntax allowed for attributes
	 * against the string literal directly preceding the expression, assuming that
	 * the expression is in an attribute-value position.
	 *
	 * See attributes in the HTML spec:
	 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
	 *
	 * " \x09\x0a\x0c\x0d" are HTML space characters:
	 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
	 *
	 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
	 * space character except " ".
	 *
	 * So an attribute is:
	 *  * The name: any character except a control character, space character, ('),
	 *    ("), ">", "=", or "/"
	 *  * Followed by zero or more space characters
	 *  * Followed by "="
	 *  * Followed by zero or more space characters
	 *  * Followed by:
	 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
	 *    * (") then any non-("), or
	 *    * (') then any non-(')
	 */
	export const lastAttributeNameRegex: RegExp;

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/lib/template-factory' {
	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	/**
	 * @module lit-html
	 */
	import { TemplateResult } from './template-result';
	import { Template } from './template';
	/**
	 * A function type that creates a Template from a TemplateResult.
	 *
	 * This is a hook into the template-creation process for rendering that
	 * requires some modification of templates before they're used, like ShadyCSS,
	 * which must add classes to elements and remove styles.
	 *
	 * Templates should be cached as aggressively as possible, so that many
	 * TemplateResults produced from the same expression only do the work of
	 * creating the Template the first time.
	 *
	 * Templates are usually cached by TemplateResult.strings and
	 * TemplateResult.type, but may be cached by other keys if this function
	 * modifies the template.
	 *
	 * Note that currently TemplateFactories must not add, remove, or reorder
	 * expressions, because there is no way to describe such a modification
	 * to render() so that values are interpolated to the correct place in the
	 * template instances.
	 */
	export type TemplateFactory = (result: TemplateResult) => Template;
	/**
	 * The default TemplateFactory which caches Templates keyed on
	 * result.type and result.strings.
	 */
	export function templateFactory(result: TemplateResult): Template;
	/**
	 * The first argument to JS template tags retain identity across multiple
	 * calls to a tag for the same literal, so we can cache work done per literal
	 * in a Map.
	 *
	 * Safari currently has a bug which occasionally breaks this behaviour, so we
	 * need to cache the Template at two levels. We first cache the
	 * TemplateStringsArray, and if that fails, we cache a key constructed by
	 * joining the strings array.
	 */
	export type templateCache = {
	    readonly stringsArray: WeakMap<TemplateStringsArray, Template>;
	    readonly keyString: Map<string, Template>;
	};
	export const templateCaches: Map<string, templateCache>;

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/lib/render-options' {
	/**
	 * @license
	 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	/**
	 * @module lit-html
	 */
	import { TemplateFactory } from './template-factory';
	export interface RenderOptions {
	    readonly templateFactory: TemplateFactory;
	    readonly eventContext?: EventTarget;
	}

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/lib/parts' {
	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	import { Part } from './part';
	import { RenderOptions } from './render-options';
	export type Primitive = null | undefined | boolean | number | string | Symbol | bigint;
	export const isPrimitive: (value: unknown) => value is Primitive;
	export const isIterable: (value: unknown) => value is Iterable<unknown>;
	/**
	 * Writes attribute values to the DOM for a group of AttributeParts bound to a
	 * single attibute. The value is only set once even if there are multiple parts
	 * for an attribute.
	 */
	export class AttributeCommitter {
	    readonly element: Element;
	    readonly name: string;
	    readonly strings: ReadonlyArray<string>;
	    readonly parts: ReadonlyArray<AttributePart>;
	    dirty: boolean;
	    constructor(element: Element, name: string, strings: ReadonlyArray<string>);
	    /**
	     * Creates a single part. Override this to create a differnt type of part.
	     */
	    protected _createPart(): AttributePart;
	    protected _getValue(): unknown;
	    commit(): void;
	}
	/**
	 * A Part that controls all or part of an attribute value.
	 */
	export class AttributePart implements Part {
	    readonly committer: AttributeCommitter;
	    value: unknown;
	    constructor(committer: AttributeCommitter);
	    setValue(value: unknown): void;
	    commit(): void;
	}
	/**
	 * A Part that controls a location within a Node tree. Like a Range, NodePart
	 * has start and end locations and can set and update the Nodes between those
	 * locations.
	 *
	 * NodeParts support several value types: primitives, Nodes, TemplateResults,
	 * as well as arrays and iterables of those types.
	 */
	export class NodePart implements Part {
	    readonly options: RenderOptions;
	    startNode: Node;
	    endNode: Node;
	    value: unknown;
	    private __pendingValue;
	    constructor(options: RenderOptions);
	    /**
	     * Appends this part into a container.
	     *
	     * This part must be empty, as its contents are not automatically moved.
	     */
	    appendInto(container: Node): void;
	    /**
	     * Inserts this part after the `ref` node (between `ref` and `ref`'s next
	     * sibling). Both `ref` and its next sibling must be static, unchanging nodes
	     * such as those that appear in a literal section of a template.
	     *
	     * This part must be empty, as its contents are not automatically moved.
	     */
	    insertAfterNode(ref: Node): void;
	    /**
	     * Appends this part into a parent part.
	     *
	     * This part must be empty, as its contents are not automatically moved.
	     */
	    appendIntoPart(part: NodePart): void;
	    /**
	     * Inserts this part after the `ref` part.
	     *
	     * This part must be empty, as its contents are not automatically moved.
	     */
	    insertAfterPart(ref: NodePart): void;
	    setValue(value: unknown): void;
	    commit(): void;
	    private __insert;
	    private __commitNode;
	    private __commitText;
	    private __commitTemplateResult;
	    private __commitIterable;
	    clear(startNode?: Node): void;
	}
	/**
	 * Implements a boolean attribute, roughly as defined in the HTML
	 * specification.
	 *
	 * If the value is truthy, then the attribute is present with a value of
	 * ''. If the value is falsey, the attribute is removed.
	 */
	export class BooleanAttributePart implements Part {
	    readonly element: Element;
	    readonly name: string;
	    readonly strings: ReadonlyArray<string>;
	    value: unknown;
	    private __pendingValue;
	    constructor(element: Element, name: string, strings: ReadonlyArray<string>);
	    setValue(value: unknown): void;
	    commit(): void;
	}
	/**
	 * Sets attribute values for PropertyParts, so that the value is only set once
	 * even if there are multiple parts for a property.
	 *
	 * If an expression controls the whole property value, then the value is simply
	 * assigned to the property under control. If there are string literals or
	 * multiple expressions, then the strings are expressions are interpolated into
	 * a string first.
	 */
	export class PropertyCommitter extends AttributeCommitter {
	    readonly single: boolean;
	    constructor(element: Element, name: string, strings: ReadonlyArray<string>);
	    protected _createPart(): PropertyPart;
	    protected _getValue(): unknown;
	    commit(): void;
	}
	export class PropertyPart extends AttributePart {
	} type EventHandlerWithOptions = EventListenerOrEventListenerObject & Partial<AddEventListenerOptions>;
	export class EventPart implements Part {
	    readonly element: Element;
	    readonly eventName: string;
	    readonly eventContext?: EventTarget;
	    value: undefined | EventHandlerWithOptions;
	    private __options?;
	    private __pendingValue;
	    private readonly __boundHandleEvent;
	    constructor(element: Element, eventName: string, eventContext?: EventTarget);
	    setValue(value: undefined | EventHandlerWithOptions): void;
	    commit(): void;
	    handleEvent(event: Event): void;
	}
	export {};

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/lib/template-processor' {
	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	/**
	 * @module lit-html
	 */
	import { Part } from './part';
	import { NodePart } from './parts';
	import { RenderOptions } from './render-options';
	export interface TemplateProcessor {
	    /**
	     * Create parts for an attribute-position binding, given the event, attribute
	     * name, and string literals.
	     *
	     * @param element The element containing the binding
	     * @param name  The attribute name
	     * @param strings The string literals. There are always at least two strings,
	     *   event for fully-controlled bindings with a single expression.
	     */
	    handleAttributeExpressions(element: Element, name: string, strings: ReadonlyArray<string>, options: RenderOptions): ReadonlyArray<Part>;
	    /**
	     * Create parts for a text-position binding.
	     * @param partOptions
	     */
	    handleTextExpression(options: RenderOptions): NodePart;
	}

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/lib/template-result' {
	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	import { TemplateProcessor } from './template-processor';
	/**
	 * The return type of `html`, which holds a Template and the values from
	 * interpolated expressions.
	 */
	export class TemplateResult {
	    readonly strings: TemplateStringsArray;
	    readonly values: ReadonlyArray<unknown>;
	    readonly type: string;
	    readonly processor: TemplateProcessor;
	    constructor(strings: TemplateStringsArray, values: ReadonlyArray<unknown>, type: string, processor: TemplateProcessor);
	    /**
	     * Returns a string of HTML used to create a `<template>` element.
	     */
	    getHTML(): string;
	    getTemplateElement(): HTMLTemplateElement;
	}
	/**
	 * A TemplateResult for SVG fragments.
	 *
	 * This class wraps HTML in an `<svg>` tag in order to parse its contents in the
	 * SVG namespace, then modifies the template to remove the `<svg>` tag so that
	 * clones only container the original fragment.
	 */
	export class SVGTemplateResult extends TemplateResult {
	    getHTML(): string;
	    getTemplateElement(): HTMLTemplateElement;
	}

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/lib/default-template-processor' {
	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	/**
	 * @module lit-html
	 */
	import { Part } from './part';
	import { NodePart } from './parts';
	import { RenderOptions } from './render-options';
	import { TemplateProcessor } from './template-processor';
	/**
	 * Creates Parts when a template is instantiated.
	 */
	export class DefaultTemplateProcessor implements TemplateProcessor {
	    /**
	     * Create parts for an attribute-position binding, given the event, attribute
	     * name, and string literals.
	     *
	     * @param element The element containing the binding
	     * @param name  The attribute name
	     * @param strings The string literals. There are always at least two strings,
	     *   event for fully-controlled bindings with a single expression.
	     */
	    handleAttributeExpressions(element: Element, name: string, strings: string[], options: RenderOptions): ReadonlyArray<Part>;
	    /**
	     * Create parts for a text-position binding.
	     * @param templateFactory
	     */
	    handleTextExpression(options: RenderOptions): NodePart;
	}
	export const defaultTemplateProcessor: DefaultTemplateProcessor;

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/lib/directive' {
	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	/**
	 * @module lit-html
	 */
	import { Part } from './part.js';
	export type DirectiveFactory = (...args: any[]) => object;
	export type DirectiveFn = (part: Part) => void;
	/**
	 * Brands a function as a directive factory function so that lit-html will call
	 * the function during template rendering, rather than passing as a value.
	 *
	 * A _directive_ is a function that takes a Part as an argument. It has the
	 * signature: `(part: Part) => void`.
	 *
	 * A directive _factory_ is a function that takes arguments for data and
	 * configuration and returns a directive. Users of directive usually refer to
	 * the directive factory as the directive. For example, "The repeat directive".
	 *
	 * Usually a template author will invoke a directive factory in their template
	 * with relevant arguments, which will then return a directive function.
	 *
	 * Here's an example of using the `repeat()` directive factory that takes an
	 * array and a function to render an item:
	 *
	 * ```js
	 * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
	 * ```
	 *
	 * When `repeat` is invoked, it returns a directive function that closes over
	 * `items` and the template function. When the outer template is rendered, the
	 * return directive function is called with the Part for the expression.
	 * `repeat` then performs it's custom logic to render multiple items.
	 *
	 * @param f The directive factory function. Must be a function that returns a
	 * function of the signature `(part: Part) => void`. The returned function will
	 * be called with the part object.
	 *
	 * @example
	 *
	 * import {directive, html} from 'lit-html';
	 *
	 * const immutable = directive((v) => (part) => {
	 *   if (part.value !== v) {
	 *     part.setValue(v)
	 *   }
	 * });
	 */
	export const directive: <F extends DirectiveFactory>(f: F) => F;
	export const isDirective: (o: unknown) => o is DirectiveFn;

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/lib/dom' {
	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	/**
	 * True if the custom elements polyfill is in use.
	 */
	export const isCEPolyfill: boolean;
	/**
	 * Reparents nodes, starting from `start` (inclusive) to `end` (exclusive),
	 * into another container (could be the same container), before `before`. If
	 * `before` is null, it appends the nodes to the container.
	 */
	export const reparentNodes: (container: Node, start: Node, end?: Node, before?: Node) => void;
	/**
	 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
	 * `container`.
	 */
	export const removeNodes: (container: Node, start: Node, end?: Node) => void;

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/lib/render' {
	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	import { NodePart } from './parts';
	import { RenderOptions } from './render-options';
	import { TemplateResult } from './template-result';
	export const parts: WeakMap<Node, NodePart>;
	/**
	 * Renders a template to a container.
	 *
	 * To update a container with new values, reevaluate the template literal and
	 * call `render` with the new result.
	 *
	 * @param result a TemplateResult created by evaluating a template tag like
	 *     `html` or `svg`.
	 * @param container A DOM parent to render to. The entire contents are either
	 *     replaced, or efficiently updated if the same result type was previous
	 *     rendered there.
	 * @param options RenderOptions for the entire render tree rendered to this
	 *     container. Render options must *not* change between renders to the same
	 *     container, as those changes will not effect previously rendered DOM.
	 */
	export const render: (result: TemplateResult, container: Element | DocumentFragment, options?: Partial<RenderOptions>) => void;

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/lib/template-instance' {
	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	import { RenderOptions } from './render-options';
	import { TemplateProcessor } from './template-processor';
	import { Template } from './template';
	/**
	 * An instance of a `Template` that can be attached to the DOM and updated
	 * with new values.
	 */
	export class TemplateInstance {
	    private readonly __parts;
	    readonly processor: TemplateProcessor;
	    readonly options: RenderOptions;
	    readonly template: Template;
	    constructor(template: Template, processor: TemplateProcessor, options: RenderOptions);
	    update(values: ReadonlyArray<unknown>): void;
	    _clone(): DocumentFragment;
	}

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/directives/async-append' {
	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	import { Part } from '../lit-html.js';
	/**
	 * A directive that renders the items of an async iterable[1], appending new
	 * values after previous values, similar to the built-in support for iterables.
	 *
	 * Async iterables are objects with a [Symbol.asyncIterator] method, which
	 * returns an iterator who's `next()` method returns a Promise. When a new
	 * value is available, the Promise resolves and the value is appended to the
	 * Part controlled by the directive. If another value other than this
	 * directive has been set on the Part, the iterable will no longer be listened
	 * to and new values won't be written to the Part.
	 *
	 * [1]: https://github.com/tc39/proposal-async-iteration
	 *
	 * @param value An async iterable
	 * @param mapper An optional function that maps from (value, index) to another
	 *     value. Useful for generating templates for each item in the iterable.
	 */
	export const asyncAppend: (value: AsyncIterable<unknown>, mapper?: (v: unknown, index?: number) => unknown) => (part: Part) => Promise<void>;

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/directives/async-replace' {
	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	import { Part } from '../lit-html.js';
	/**
	 * A directive that renders the items of an async iterable[1], replacing
	 * previous values with new values, so that only one value is ever rendered
	 * at a time.
	 *
	 * Async iterables are objects with a [Symbol.asyncIterator] method, which
	 * returns an iterator who's `next()` method returns a Promise. When a new
	 * value is available, the Promise resolves and the value is rendered to the
	 * Part controlled by the directive. If another value other than this
	 * directive has been set on the Part, the iterable will no longer be listened
	 * to and new values won't be written to the Part.
	 *
	 * [1]: https://github.com/tc39/proposal-async-iteration
	 *
	 * @param value An async iterable
	 * @param mapper An optional function that maps from (value, index) to another
	 *     value. Useful for generating templates for each item in the iterable.
	 */
	export const asyncReplace: (value: AsyncIterable<unknown>, mapper?: (v: unknown, index?: number) => unknown) => (part: Part) => Promise<void>;

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/directives/cache' {
	/**
	 * @license
	 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	import { Part } from '../lit-html.js';
	/**
	 * Enables fast switching between multiple templates by caching the DOM nodes
	 * and TemplateInstances produced by the templates.
	 *
	 * Example:
	 *
	 * ```
	 * let checked = false;
	 *
	 * html`
	 *   ${cache(checked ? html`input is checked` : html`input is not checked`)}
	 * `
	 * ```
	 */
	export const cache: (value: unknown) => (part: Part) => void;

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/directives/class-map' {
	/**
	 * @license
	 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	import { Part } from '../lit-html.js';
	export interface ClassInfo {
	    readonly [name: string]: string | boolean | number;
	}
	/**
	 * A directive that applies CSS classes. This must be used in the `class`
	 * attribute and must be the only part used in the attribute. It takes each
	 * property in the `classInfo` argument and adds the property name to the
	 * element's `classList` if the property value is truthy; if the property value
	 * is falsey, the property name is removed from the element's `classList`. For
	 * example
	 * `{foo: bar}` applies the class `foo` if the value of `bar` is truthy.
	 * @param classInfo {ClassInfo}
	 */
	export const classMap: (classInfo: ClassInfo) => (part: Part) => void;

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/directives/guard' {
	/**
	 * @license
	 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	import { Part } from '../lit-html.js';
	/**
	 * Prevents re-render of a template function until a single value or an array of
	 * values changes.
	 *
	 * Example:
	 *
	 * ```js
	 * html`
	 *   <div>
	 *     ${guard([user.id, company.id], () => html`...`)}
	 *   </div>
	 * ```
	 *
	 * In this case, the template only renders if either `user.id` or `company.id`
	 * changes.
	 *
	 * guard() is useful with immutable data patterns, by preventing expensive work
	 * until data updates.
	 *
	 * Example:
	 *
	 * ```js
	 * html`
	 *   <div>
	 *     ${guard([immutableItems], () => immutableItems.map(i => html`${i}`))}
	 *   </div>
	 * ```
	 *
	 * In this case, items are mapped over only when the array reference changes.
	 *
	 * @param value the value to check before re-rendering
	 * @param f the template function
	 */
	export const guard: (value: unknown, f: () => unknown) => (part: Part) => void;

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/directives/if-defined' {
	/**
	 * @license
	 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	import { Part } from '../lit-html.js';
	/**
	 * For AttributeParts, sets the attribute if the value is defined and removes
	 * the attribute if the value is undefined.
	 *
	 * For other part types, this directive is a no-op.
	 */
	export const ifDefined: (value: unknown) => (part: Part) => void;

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/directives/repeat' {
	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	import { DirectiveFn } from '../lib/directive.js';
	export type KeyFn<T> = (item: T, index: number) => unknown;
	export type ItemTemplate<T> = (item: T, index: number) => unknown;
	/**
	 * A directive that repeats a series of values (usually `TemplateResults`)
	 * generated from an iterable, and updates those items efficiently when the
	 * iterable changes based on user-provided `keys` associated with each item.
	 *
	 * Note that if a `keyFn` is provided, strict key-to-DOM mapping is maintained,
	 * meaning previous DOM for a given key is moved into the new position if
	 * needed, and DOM will never be reused with values for different keys (new DOM
	 * will always be created for new keys). This is generally the most efficient
	 * way to use `repeat` since it performs minimum unnecessary work for insertions
	 * amd removals.
	 *
	 * IMPORTANT: If providing a `keyFn`, keys *must* be unique for all items in a
	 * given call to `repeat`. The behavior when two or more items have the same key
	 * is undefined.
	 *
	 * If no `keyFn` is provided, this directive will perform similar to mapping
	 * items to values, and DOM will be reused against potentially different items.
	 */
	export const repeat: <T>(items: Iterable<T>, keyFnOrTemplate: KeyFn<T> | ItemTemplate<T>, template?: ItemTemplate<T>) => DirectiveFn;

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/directives/style-map' {
	/**
	 * @license
	 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	import { Part } from '../lit-html.js';
	export interface StyleInfo {
	    readonly [name: string]: string;
	}
	/**
	 * A directive that applies CSS properties to an element.
	 *
	 * `styleMap` can only be used in the `style` attribute and must be the only
	 * expression in the attribute. It takes the property names in the `styleInfo`
	 * object and adds the property values as CSS propertes. Property names with
	 * dashes (`-`) are assumed to be valid CSS property names and set on the
	 * element's style object using `setProperty()`. Names without dashes are
	 * assumed to be camelCased JavaScript property names and set on the element's
	 * style object using property assignment, allowing the style object to
	 * translate JavaScript-style names to CSS property names.
	 *
	 * For example `styleMap({backgroundColor: 'red', 'border-top': '5px', '--size':
	 * '0'})` sets the `background-color`, `border-top` and `--size` properties.
	 *
	 * @param styleInfo {StyleInfo}
	 */
	export const styleMap: (styleInfo: StyleInfo) => (part: Part) => void;

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/directives/unsafe-html' {
	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	import { Part } from '../lit-html.js';
	/**
	 * Renders the result as HTML, rather than text.
	 *
	 * Note, this is unsafe to use with any user-provided input that hasn't been
	 * sanitized or escaped, as it may lead to cross-site-scripting
	 * vulnerabilities.
	 */
	export const unsafeHTML: (value: unknown) => (part: Part) => void;

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/directives/until' {
	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	import { Part } from '../lit-html.js';
	/**
	 * Renders one of a series of values, including Promises, to a Part.
	 *
	 * Values are rendered in priority order, with the first argument having the
	 * highest priority and the last argument having the lowest priority. If a
	 * value is a Promise, low-priority values will be rendered until it resolves.
	 *
	 * The priority of values can be used to create placeholder content for async
	 * data. For example, a Promise with pending content can be the first,
	 * highest-priority, argument, and a non_promise loading indicator template can
	 * be used as the second, lower-priority, argument. The loading indicator will
	 * render immediately, and the primary content will render when the Promise
	 * resolves.
	 *
	 * Example:
	 *
	 *     const content = fetch('./content.txt').then(r => r.text());
	 *     html`${until(content, html`<span>Loading...</span>`)}`
	 */
	export const until: (...args: unknown[]) => (part: Part) => void;

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/directives/index' {
	export * from './async-append';
	export * from './async-replace';
	export * from './cache';
	export * from './class-map';
	export * from './guard';
	export * from './if-defined';
	export * from './repeat';
	export * from './style-map';
	export * from './unsafe-html';
	export * from './until';

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/lit-html' {
	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	import { SVGTemplateResult, TemplateResult } from './lib/template-result.js';
	export { DefaultTemplateProcessor, defaultTemplateProcessor } from './lib/default-template-processor.js';
	export { directive, DirectiveFn, isDirective } from './lib/directive';
	export { removeNodes, reparentNodes } from './lib/dom.js';
	export { noChange, nothing, Part } from './lib/part.js';
	export { AttributeCommitter, AttributePart, BooleanAttributePart, EventPart, isIterable, isPrimitive, NodePart, PropertyCommitter, PropertyPart } from './lib/parts.js';
	export { RenderOptions } from './lib/render-options.js';
	export { parts, render } from './lib/render.js';
	export { templateCaches, templateFactory } from './lib/template-factory.js';
	export { TemplateInstance } from './lib/template-instance.js';
	export { TemplateProcessor } from './lib/template-processor.js';
	export { SVGTemplateResult, TemplateResult } from './lib/template-result.js';
	export { createMarker, isTemplatePartActive, Template } from './lib/template.js'; global {
	    interface Window {
	        litHtmlVersions: string[];
	    }
	}
	/**
	 * Interprets a template literal as an HTML template that can efficiently
	 * render to and update a container.
	 */
	export const html: (strings: TemplateStringsArray, ...values: unknown[]) => TemplateResult;
	/**
	 * Interprets a template literal as an SVG template that can efficiently
	 * render to and update a container.
	 */
	export const svg: (strings: TemplateStringsArray, ...values: unknown[]) => SVGTemplateResult;
	export * from './directives/index';

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/decorators/template-observable' {
	export function TemplateObservable(animationFrame?: boolean): (target: any, key: string) => void;

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-element/lib/css-tag' {
	/**
	@license
	Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
	This code may only be used under the BSD style license found at
	http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
	http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
	found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
	part of the polymer project is also subject to an additional IP rights grant
	found at http://polymer.github.io/PATENTS.txt
	*/
	export const supportsAdoptingStyleSheets: boolean;
	interface CSSStyleSheetPrivate extends CSSStyleSheet {
	    replaceSync(cssText: string): void;
	    replace(cssText: string): Promise<unknown>;
	}
	export class CSSResult {
	    _styleSheet?: CSSStyleSheetPrivate | null;
	    readonly cssText: string;
	    constructor(cssText: string, safeToken: symbol);
	    readonly styleSheet: CSSStyleSheetPrivate | null;
	    toString(): string;
	}
	/**
	 * Wrap a value for interpolation in a css tagged template literal.
	 *
	 * This is unsafe because untrusted CSS text can be used to phone home
	 * or exfiltrate data to an attacker controlled site. Take care to only use
	 * this with trusted input.
	 */
	export const unsafeCSS: (value: unknown) => CSSResult;
	/**
	 * Template tag which which can be used with LitElement's `style` property to
	 * set element styles. For security reasons, only literal string values may be
	 * used. To incorporate non-literal values `unsafeCSS` may be used inside a
	 * template string part.
	 */
	export const css: (strings: TemplateStringsArray, ...values: (number | CSSResult)[]) => CSSResult;
	export {};

}
declare module '@my-project/module-view/node_modules/rxjs/internal/Subscription' {
	import { SubscriptionLike, TeardownLogic } from './types';
	/**
	 * Represents a disposable resource, such as the execution of an Observable. A
	 * Subscription has one important method, `unsubscribe`, that takes no argument
	 * and just disposes the resource held by the subscription.
	 *
	 * Additionally, subscriptions may be grouped together through the `add()`
	 * method, which will attach a child Subscription to the current Subscription.
	 * When a Subscription is unsubscribed, all its children (and its grandchildren)
	 * will be unsubscribed as well.
	 *
	 * @class Subscription
	 */
	export class Subscription implements SubscriptionLike {
	    /** @nocollapse */
	    static EMPTY: Subscription;
	    /**
	     * A flag to indicate whether this Subscription has already been unsubscribed.
	     * @type {boolean}
	     */
	    closed: boolean;
	    /** @internal */
	    protected _parentOrParents: Subscription | Subscription[];
	    /** @internal */
	    private _subscriptions;
	    /**
	     * @param {function(): void} [unsubscribe] A function describing how to
	     * perform the disposal of resources when the `unsubscribe` method is called.
	     */
	    constructor(unsubscribe?: () => void);
	    /**
	     * Disposes the resources held by the subscription. May, for instance, cancel
	     * an ongoing Observable execution or cancel any other type of work that
	     * started when the Subscription was created.
	     * @return {void}
	     */
	    unsubscribe(): void;
	    /**
	     * Adds a tear down to be called during the unsubscribe() of this
	     * Subscription. Can also be used to add a child subscription.
	     *
	     * If the tear down being added is a subscription that is already
	     * unsubscribed, is the same reference `add` is being called on, or is
	     * `Subscription.EMPTY`, it will not be added.
	     *
	     * If this subscription is already in an `closed` state, the passed
	     * tear down logic will be executed immediately.
	     *
	     * When a parent subscription is unsubscribed, any child subscriptions that were added to it are also unsubscribed.
	     *
	     * @param {TeardownLogic} teardown The additional logic to execute on
	     * teardown.
	     * @return {Subscription} Returns the Subscription used or created to be
	     * added to the inner subscriptions list. This Subscription can be used with
	     * `remove()` to remove the passed teardown logic from the inner subscriptions
	     * list.
	     */
	    add(teardown: TeardownLogic): Subscription;
	    /**
	     * Removes a Subscription from the internal list of subscriptions that will
	     * unsubscribe during the unsubscribe process of this Subscription.
	     * @param {Subscription} subscription The subscription to remove.
	     * @return {void}
	     */
	    remove(subscription: Subscription): void;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/types' {
	import { Observable } from './Observable';
	import { Subscription } from './Subscription';
	/** OPERATOR INTERFACES */
	export interface UnaryFunction<T, R> {
	    (source: T): R;
	}
	export interface OperatorFunction<T, R> extends UnaryFunction<Observable<T>, Observable<R>> {
	}
	export type FactoryOrValue<T> = T | (() => T);
	export interface MonoTypeOperatorFunction<T> extends OperatorFunction<T, T> {
	}
	export interface Timestamp<T> {
	    value: T;
	    timestamp: number;
	}
	export interface TimeInterval<T> {
	    value: T;
	    interval: number;
	}
	/** SUBSCRIPTION INTERFACES */
	export interface Unsubscribable {
	    unsubscribe(): void;
	}
	export type TeardownLogic = Unsubscribable | Function | void;
	export interface SubscriptionLike extends Unsubscribable {
	    unsubscribe(): void;
	    readonly closed: boolean;
	}
	export type SubscribableOrPromise<T> = Subscribable<T> | Subscribable<never> | PromiseLike<T> | InteropObservable<T>;
	/** OBSERVABLE INTERFACES */
	export interface Subscribable<T> {
	    subscribe(observer?: PartialObserver<T>): Unsubscribable;
	    /** @deprecated Use an observer instead of a complete callback */
	    subscribe(next: null | undefined, error: null | undefined, complete: () => void): Unsubscribable;
	    /** @deprecated Use an observer instead of an error callback */
	    subscribe(next: null | undefined, error: (error: any) => void, complete?: () => void): Unsubscribable;
	    /** @deprecated Use an observer instead of a complete callback */
	    subscribe(next: (value: T) => void, error: null | undefined, complete: () => void): Unsubscribable;
	    subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Unsubscribable;
	}
	export type ObservableInput<T> = SubscribableOrPromise<T> | ArrayLike<T> | Iterable<T>;
	/** @deprecated use {@link InteropObservable } */
	export type ObservableLike<T> = InteropObservable<T>;
	export type InteropObservable<T> = {
	    [Symbol.observable]: () => Subscribable<T>;
	};
	/** OBSERVER INTERFACES */
	export interface NextObserver<T> {
	    closed?: boolean;
	    next: (value: T) => void;
	    error?: (err: any) => void;
	    complete?: () => void;
	}
	export interface ErrorObserver<T> {
	    closed?: boolean;
	    next?: (value: T) => void;
	    error: (err: any) => void;
	    complete?: () => void;
	}
	export interface CompletionObserver<T> {
	    closed?: boolean;
	    next?: (value: T) => void;
	    error?: (err: any) => void;
	    complete: () => void;
	}
	export type PartialObserver<T> = NextObserver<T> | ErrorObserver<T> | CompletionObserver<T>;
	export interface Observer<T> {
	    closed?: boolean;
	    next: (value: T) => void;
	    error: (err: any) => void;
	    complete: () => void;
	}
	/** SCHEDULER INTERFACES */
	export interface SchedulerLike {
	    now(): number;
	    schedule<T>(work: (this: SchedulerAction<T>, state?: T) => void, delay?: number, state?: T): Subscription;
	}
	export interface SchedulerAction<T> extends Subscription {
	    schedule(state?: T, delay?: number): Subscription;
	}
	export type ObservedValueOf<O> = O extends ObservableInput<infer T> ? T : never;
	export type ObservedValuesFromArray<X> = X extends Array<ObservableInput<infer T>> ? T : never;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/Subscriber' {
	import { Observer, PartialObserver } from './types';
	import { Subscription } from './Subscription';
	/**
	 * Implements the {@link Observer} interface and extends the
	 * {@link Subscription} class. While the {@link Observer} is the public API for
	 * consuming the values of an {@link Observable}, all Observers get converted to
	 * a Subscriber, in order to provide Subscription-like capabilities such as
	 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
	 * implementing operators, but it is rarely used as a public API.
	 *
	 * @class Subscriber<T>
	 */
	export class Subscriber<T> extends Subscription implements Observer<T> {
	    /**
	     * A static factory for a Subscriber, given a (potentially partial) definition
	     * of an Observer.
	     * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
	     * @param {function(e: ?any): void} [error] The `error` callback of an
	     * Observer.
	     * @param {function(): void} [complete] The `complete` callback of an
	     * Observer.
	     * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
	     * Observer represented by the given arguments.
	     * @nocollapse
	     */
	    static create<T>(next?: (x?: T) => void, error?: (e?: any) => void, complete?: () => void): Subscriber<T>;
	    /** @internal */ syncErrorValue: any;
	    /** @internal */ syncErrorThrown: boolean;
	    /** @internal */ syncErrorThrowable: boolean;
	    protected isStopped: boolean;
	    protected destination: PartialObserver<any> | Subscriber<any>;
	    /**
	     * @param {Observer|function(value: T): void} [destinationOrNext] A partially
	     * defined Observer or a `next` callback function.
	     * @param {function(e: ?any): void} [error] The `error` callback of an
	     * Observer.
	     * @param {function(): void} [complete] The `complete` callback of an
	     * Observer.
	     */
	    constructor(destinationOrNext?: PartialObserver<any> | ((value: T) => void), error?: (e?: any) => void, complete?: () => void);
	    /**
	     * The {@link Observer} callback to receive notifications of type `next` from
	     * the Observable, with a value. The Observable may call this method 0 or more
	     * times.
	     * @param {T} [value] The `next` value.
	     * @return {void}
	     */
	    next(value?: T): void;
	    /**
	     * The {@link Observer} callback to receive notifications of type `error` from
	     * the Observable, with an attached `Error`. Notifies the Observer that
	     * the Observable has experienced an error condition.
	     * @param {any} [err] The `error` exception.
	     * @return {void}
	     */
	    error(err?: any): void;
	    /**
	     * The {@link Observer} callback to receive a valueless notification of type
	     * `complete` from the Observable. Notifies the Observer that the Observable
	     * has finished sending push-based notifications.
	     * @return {void}
	     */
	    complete(): void;
	    unsubscribe(): void;
	    protected _next(value: T): void;
	    protected _error(err: any): void;
	    protected _complete(): void;
	    /** @deprecated This is an internal implementation detail, do not use. */
	    _unsubscribeAndRecycle(): Subscriber<T>;
	}
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	export class SafeSubscriber<T> extends Subscriber<T> {
	    private _parentSubscriber;
	    private _context;
	    constructor(_parentSubscriber: Subscriber<T>, observerOrNext?: PartialObserver<T> | ((value: T) => void), error?: (e?: any) => void, complete?: () => void);
	    next(value?: T): void;
	    error(err?: any): void;
	    complete(): void;
	    private __tryOrUnsub;
	    private __tryOrSetError;
	    /** @internal This is an internal implementation detail, do not use. */
	    _unsubscribe(): void;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/Operator' {
	import { Subscriber } from './Subscriber';
	import { TeardownLogic } from './types';
	export interface Operator<T, R> {
	    call(subscriber: Subscriber<R>, source: any): TeardownLogic;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/iif' {
	import { Observable } from '../Observable';
	import { SubscribableOrPromise } from '../types';
	/**
	 * Decides at subscription time which Observable will actually be subscribed.
	 *
	 * <span class="informal">`If` statement for Observables.</span>
	 *
	 * `iif` accepts a condition function and two Observables. When
	 * an Observable returned by the operator is subscribed, condition function will be called.
	 * Based on what boolean it returns at that moment, consumer will subscribe either to
	 * the first Observable (if condition was true) or to the second (if condition was false). Condition
	 * function may also not return anything - in that case condition will be evaluated as false and
	 * second Observable will be subscribed.
	 *
	 * Note that Observables for both cases (true and false) are optional. If condition points to an Observable that
	 * was left undefined, resulting stream will simply complete immediately. That allows you to, rather
	 * then controlling which Observable will be subscribed, decide at runtime if consumer should have access
	 * to given Observable or not.
	 *
	 * If you have more complex logic that requires decision between more than two Observables, {@link defer}
	 * will probably be a better choice. Actually `iif` can be easily implemented with {@link defer}
	 * and exists only for convenience and readability reasons.
	 *
	 *
	 * ## Examples
	 * ### Change at runtime which Observable will be subscribed
	 * ```ts
	 * import { iif, of } from 'rxjs';
	 *
	 * let subscribeToFirst;
	 * const firstOrSecond = iif(
	 *   () => subscribeToFirst,
	 *   of('first'),
	 *   of('second'),
	 * );
	 *
	 * subscribeToFirst = true;
	 * firstOrSecond.subscribe(value => console.log(value));
	 *
	 * // Logs:
	 * // "first"
	 *
	 * subscribeToFirst = false;
	 * firstOrSecond.subscribe(value => console.log(value));
	 *
	 * // Logs:
	 * // "second"
	 *
	 * ```
	 *
	 * ### Control an access to an Observable
	 * ```ts
	 * let accessGranted;
	 * const observableIfYouHaveAccess = iif(
	 *   () => accessGranted,
	 *   of('It seems you have an access...'), // Note that only one Observable is passed to the operator.
	 * );
	 *
	 * accessGranted = true;
	 * observableIfYouHaveAccess.subscribe(
	 *   value => console.log(value),
	 *   err => {},
	 *   () => console.log('The end'),
	 * );
	 *
	 * // Logs:
	 * // "It seems you have an access..."
	 * // "The end"
	 *
	 * accessGranted = false;
	 * observableIfYouHaveAccess.subscribe(
	 *   value => console.log(value),
	 *   err => {},
	 *   () => console.log('The end'),
	 * );
	 *
	 * // Logs:
	 * // "The end"
	 * ```
	 *
	 * @see {@link defer}
	 *
	 * @param {function(): boolean} condition Condition which Observable should be chosen.
	 * @param {Observable} [trueObservable] An Observable that will be subscribed if condition is true.
	 * @param {Observable} [falseObservable] An Observable that will be subscribed if condition is false.
	 * @return {Observable} Either first or second Observable, depending on condition.
	 * @static true
	 * @name iif
	 * @owner Observable
	 */
	export function iif<T, F>(condition: () => boolean, trueResult?: SubscribableOrPromise<T>, falseResult?: SubscribableOrPromise<F>): Observable<T | F>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/throwError' {
	import { Observable } from '../Observable';
	import { SchedulerLike } from '../types';
	/**
	 * Creates an Observable that emits no items to the Observer and immediately
	 * emits an error notification.
	 *
	 * <span class="informal">Just emits 'error', and nothing else.
	 * </span>
	 *
	 * ![](throw.png)
	 *
	 * This static operator is useful for creating a simple Observable that only
	 * emits the error notification. It can be used for composing with other
	 * Observables, such as in a {@link mergeMap}.
	 *
	 * ## Examples
	 * ### Emit the number 7, then emit an error
	 * ```ts
	 * import { throwError, concat, of } from 'rxjs';
	 *
	 * const result = concat(of(7), throwError(new Error('oops!')));
	 * result.subscribe(x => console.log(x), e => console.error(e));
	 *
	 * // Logs:
	 * // 7
	 * // Error: oops!
	 * ```
	 *
	 * ---
	 *
	 * ### Map and flatten numbers to the sequence 'a', 'b', 'c', but throw an error for 2
	 * ```ts
	 * import { throwError, interval, of } from 'rxjs';
	 * import { mergeMap } from 'rxjs/operators';
	 *
	 * interval(1000).pipe(
	 *   mergeMap(x => x === 2
	 *     ? throwError('Twos are bad')
	 *     : of('a', 'b', 'c')
	 *   ),
	 * ).subscribe(x => console.log(x), e => console.error(e));
	 *
	 * // Logs:
	 * // a
	 * // b
	 * // c
	 * // a
	 * // b
	 * // c
	 * // Twos are bad
	 * ```
	 *
	 * @see {@link Observable}
	 * @see {@link empty}
	 * @see {@link never}
	 * @see {@link of}
	 *
	 * @param {any} error The particular Error to pass to the error notification.
	 * @param {SchedulerLike} [scheduler] A {@link SchedulerLike} to use for scheduling
	 * the emission of the error notification.
	 * @return {Observable} An error Observable: emits only the error notification
	 * using the given error argument.
	 * @static true
	 * @name throwError
	 * @owner Observable
	 */
	export function throwError(error: any, scheduler?: SchedulerLike): Observable<never>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/Observable' {
	import { Operator } from './Operator';
	import { Subscriber } from './Subscriber';
	import { Subscription } from './Subscription';
	import { TeardownLogic, OperatorFunction, PartialObserver, Subscribable } from './types';
	import { iif } from './observable/iif';
	import { throwError } from './observable/throwError';
	/**
	 * A representation of any set of values over any amount of time. This is the most basic building block
	 * of RxJS.
	 *
	 * @class Observable<T>
	 */
	export class Observable<T> implements Subscribable<T> {
	    /** Internal implementation detail, do not use directly. */
	    _isScalar: boolean;
	    /** @deprecated This is an internal implementation detail, do not use. */
	    source: Observable<any>;
	    /** @deprecated This is an internal implementation detail, do not use. */
	    operator: Operator<any, T>;
	    /**
	     * @constructor
	     * @param {Function} subscribe the function that is called when the Observable is
	     * initially subscribed to. This function is given a Subscriber, to which new values
	     * can be `next`ed, or an `error` method can be called to raise an error, or
	     * `complete` can be called to notify of a successful completion.
	     */
	    constructor(subscribe?: (this: Observable<T>, subscriber: Subscriber<T>) => TeardownLogic);
	    /**
	     * Creates a new cold Observable by calling the Observable constructor
	     * @static true
	     * @owner Observable
	     * @method create
	     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
	     * @return {Observable} a new cold observable
	     * @nocollapse
	     * @deprecated use new Observable() instead
	     */
	    static create: Function;
	    /**
	     * Creates a new Observable, with this Observable as the source, and the passed
	     * operator defined as the new observable's operator.
	     * @method lift
	     * @param {Operator} operator the operator defining the operation to take on the observable
	     * @return {Observable} a new observable with the Operator applied
	     */
	    lift<R>(operator: Operator<T, R>): Observable<R>;
	    subscribe(observer?: PartialObserver<T>): Subscription;
	    /** @deprecated Use an observer instead of a complete callback */
	    subscribe(next: null | undefined, error: null | undefined, complete: () => void): Subscription;
	    /** @deprecated Use an observer instead of an error callback */
	    subscribe(next: null | undefined, error: (error: any) => void, complete?: () => void): Subscription;
	    /** @deprecated Use an observer instead of a complete callback */
	    subscribe(next: (value: T) => void, error: null | undefined, complete: () => void): Subscription;
	    subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Subscription;
	    /** @deprecated This is an internal implementation detail, do not use. */
	    _trySubscribe(sink: Subscriber<T>): TeardownLogic;
	    /**
	     * @method forEach
	     * @param {Function} next a handler for each value emitted by the observable
	     * @param {PromiseConstructor} [promiseCtor] a constructor function used to instantiate the Promise
	     * @return {Promise} a promise that either resolves on observable completion or
	     *  rejects with the handled error
	     */
	    forEach(next: (value: T) => void, promiseCtor?: PromiseConstructorLike): Promise<void>;
	    /** @internal This is an internal implementation detail, do not use. */
	    _subscribe(subscriber: Subscriber<any>): TeardownLogic;
	    /**
	     * @nocollapse
	     * @deprecated In favor of iif creation function: import { iif } from 'rxjs';
	     */
	    static if: typeof iif;
	    /**
	     * @nocollapse
	     * @deprecated In favor of throwError creation function: import { throwError } from 'rxjs';
	     */
	    static throw: typeof throwError;
	    pipe(): Observable<T>;
	    pipe<A>(op1: OperatorFunction<T, A>): Observable<A>;
	    pipe<A, B>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>): Observable<B>;
	    pipe<A, B, C>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>): Observable<C>;
	    pipe<A, B, C, D>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>): Observable<D>;
	    pipe<A, B, C, D, E>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>): Observable<E>;
	    pipe<A, B, C, D, E, F>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>): Observable<F>;
	    pipe<A, B, C, D, E, F, G>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>): Observable<G>;
	    pipe<A, B, C, D, E, F, G, H>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>): Observable<H>;
	    pipe<A, B, C, D, E, F, G, H, I>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>, op9: OperatorFunction<H, I>): Observable<I>;
	    pipe<A, B, C, D, E, F, G, H, I>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>, op9: OperatorFunction<H, I>, ...operations: OperatorFunction<any, any>[]): Observable<{}>;
	    toPromise<T>(this: Observable<T>): Promise<T>;
	    toPromise<T>(this: Observable<T>, PromiseCtor: typeof Promise): Promise<T>;
	    toPromise<T>(this: Observable<T>, PromiseCtor: PromiseConstructorLike): Promise<T>;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/Subject' {
	import { Operator } from './Operator';
	import { Observable } from './Observable';
	import { Subscriber } from './Subscriber';
	import { Subscription } from './Subscription';
	import { Observer, SubscriptionLike, TeardownLogic } from './types';
	/**
	 * @class SubjectSubscriber<T>
	 */
	export class SubjectSubscriber<T> extends Subscriber<T> {
	    protected destination: Subject<T>;
	    constructor(destination: Subject<T>);
	}
	/**
	 * A Subject is a special type of Observable that allows values to be
	 * multicasted to many Observers. Subjects are like EventEmitters.
	 *
	 * Every Subject is an Observable and an Observer. You can subscribe to a
	 * Subject, and you can call next to feed values as well as error and complete.
	 *
	 * @class Subject<T>
	 */
	export class Subject<T> extends Observable<T> implements SubscriptionLike {
	    observers: Observer<T>[];
	    closed: boolean;
	    isStopped: boolean;
	    hasError: boolean;
	    thrownError: any;
	    constructor();
	    /**@nocollapse
	     * @deprecated use new Subject() instead
	    */
	    static create: Function;
	    lift<R>(operator: Operator<T, R>): Observable<R>;
	    next(value?: T): void;
	    error(err: any): void;
	    complete(): void;
	    unsubscribe(): void;
	    /** @deprecated This is an internal implementation detail, do not use. */
	    _trySubscribe(subscriber: Subscriber<T>): TeardownLogic;
	    /** @deprecated This is an internal implementation detail, do not use. */
	    _subscribe(subscriber: Subscriber<T>): Subscription;
	    /**
	     * Creates a new Observable with this Subject as the source. You can do this
	     * to create customize Observer-side logic of the Subject and conceal it from
	     * code that uses the Observable.
	     * @return {Observable} Observable that the Subject casts to
	     */
	    asObservable(): Observable<T>;
	}
	/**
	 * @class AnonymousSubject<T>
	 */
	export class AnonymousSubject<T> extends Subject<T> {
	    protected destination?: Observer<T>;
	    constructor(destination?: Observer<T>, source?: Observable<T>);
	    next(value: T): void;
	    error(err: any): void;
	    complete(): void;
	    /** @deprecated This is an internal implementation detail, do not use. */
	    _subscribe(subscriber: Subscriber<T>): Subscription;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/ConnectableObservable' {
	import { Subject } from '../Subject';
	import { Observable } from '../Observable';
	import { Subscriber } from '../Subscriber';
	import { Subscription } from '../Subscription';
	/**
	 * @class ConnectableObservable<T>
	 */
	export class ConnectableObservable<T> extends Observable<T> {
	    source: Observable<T>;
	    protected subjectFactory: () => Subject<T>;
	    protected _subject: Subject<T>;
	    protected _refCount: number;
	    protected _connection: Subscription;
	    /** @internal */
	    _isComplete: boolean;
	    constructor(source: Observable<T>, subjectFactory: () => Subject<T>);
	    /** @deprecated This is an internal implementation detail, do not use. */
	    _subscribe(subscriber: Subscriber<T>): Subscription;
	    protected getSubject(): Subject<T>;
	    connect(): Subscription;
	    refCount(): Observable<T>;
	}
	export const connectableObservableDescriptor: PropertyDescriptorMap;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/operators/groupBy' {
	import { Subscriber } from '../Subscriber';
	import { Subscription } from '../Subscription';
	import { Observable } from '../Observable';
	import { Subject } from '../Subject';
	import { OperatorFunction } from '../types';
	export function groupBy<T, K>(keySelector: (value: T) => K): OperatorFunction<T, GroupedObservable<K, T>>;
	export function groupBy<T, K>(keySelector: (value: T) => K, elementSelector: void, durationSelector: (grouped: GroupedObservable<K, T>) => Observable<any>): OperatorFunction<T, GroupedObservable<K, T>>;
	export function groupBy<T, K, R>(keySelector: (value: T) => K, elementSelector?: (value: T) => R, durationSelector?: (grouped: GroupedObservable<K, R>) => Observable<any>): OperatorFunction<T, GroupedObservable<K, R>>;
	export function groupBy<T, K, R>(keySelector: (value: T) => K, elementSelector?: (value: T) => R, durationSelector?: (grouped: GroupedObservable<K, R>) => Observable<any>, subjectSelector?: () => Subject<R>): OperatorFunction<T, GroupedObservable<K, R>>;
	export interface RefCountSubscription {
	    count: number;
	    unsubscribe: () => void;
	    closed: boolean;
	    attemptedToUnsubscribe: boolean;
	}
	/**
	 * An Observable representing values belonging to the same group represented by
	 * a common key. The values emitted by a GroupedObservable come from the source
	 * Observable. The common key is available as the field `key` on a
	 * GroupedObservable instance.
	 *
	 * @class GroupedObservable<K, T>
	 */
	export class GroupedObservable<K, T> extends Observable<T> {
	    key: K;
	    private groupSubject;
	    private refCountSubscription?;
	    /** @deprecated Do not construct this type. Internal use only */
	    constructor(key: K, groupSubject: Subject<T>, refCountSubscription?: RefCountSubscription);
	    /** @deprecated This is an internal implementation detail, do not use. */
	    _subscribe(subscriber: Subscriber<T>): Subscription;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/symbol/observable' {
	 global {
	    interface SymbolConstructor {
	        readonly observable: symbol;
	    }
	}
	/** Symbol.observable or a string "@@observable". Used for interop */
	export const observable: string | symbol;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/BehaviorSubject' {
	import { Subject } from './Subject';
	import { Subscriber } from './Subscriber';
	import { Subscription } from './Subscription';
	/**
	 * A variant of Subject that requires an initial value and emits its current
	 * value whenever it is subscribed to.
	 *
	 * @class BehaviorSubject<T>
	 */
	export class BehaviorSubject<T> extends Subject<T> {
	    private _value;
	    constructor(_value: T);
	    readonly value: T;
	    /** @deprecated This is an internal implementation detail, do not use. */
	    _subscribe(subscriber: Subscriber<T>): Subscription;
	    getValue(): T;
	    next(value: T): void;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/ReplaySubject' {
	import { Subject } from './Subject';
	import { SchedulerLike } from './types';
	import { Subscriber } from './Subscriber';
	import { Subscription } from './Subscription';
	/**
	 * A variant of Subject that "replays" or emits old values to new subscribers.
	 * It buffers a set number of values and will emit those values immediately to
	 * any new subscribers in addition to emitting new values to existing subscribers.
	 *
	 * @class ReplaySubject<T>
	 */
	export class ReplaySubject<T> extends Subject<T> {
	    private scheduler?;
	    private _events;
	    private _bufferSize;
	    private _windowTime;
	    private _infiniteTimeWindow;
	    constructor(bufferSize?: number, windowTime?: number, scheduler?: SchedulerLike);
	    private nextInfiniteTimeWindow;
	    private nextTimeWindow;
	    /** @deprecated This is an internal implementation detail, do not use. */
	    _subscribe(subscriber: Subscriber<T>): Subscription;
	    _getNow(): number;
	    private _trimBufferThenGetEvents;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/AsyncSubject' {
	import { Subject } from './Subject';
	import { Subscriber } from './Subscriber';
	import { Subscription } from './Subscription';
	/**
	 * A variant of Subject that only emits a value when it completes. It will emit
	 * its latest value to all its observers on completion.
	 *
	 * @class AsyncSubject<T>
	 */
	export class AsyncSubject<T> extends Subject<T> {
	    private value;
	    private hasNext;
	    private hasCompleted;
	    /** @deprecated This is an internal implementation detail, do not use. */
	    _subscribe(subscriber: Subscriber<any>): Subscription;
	    next(value: T): void;
	    error(error: any): void;
	    complete(): void;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/Scheduler' {
	import { Action } from './scheduler/Action';
	import { Subscription } from './Subscription';
	import { SchedulerLike, SchedulerAction } from './types';
	/**
	 * An execution context and a data structure to order tasks and schedule their
	 * execution. Provides a notion of (potentially virtual) time, through the
	 * `now()` getter method.
	 *
	 * Each unit of work in a Scheduler is called an `Action`.
	 *
	 * ```ts
	 * class Scheduler {
	 *   now(): number;
	 *   schedule(work, delay?, state?): Subscription;
	 * }
	 * ```
	 *
	 * @class Scheduler
	 * @deprecated Scheduler is an internal implementation detail of RxJS, and
	 * should not be used directly. Rather, create your own class and implement
	 * {@link SchedulerLike}
	 */
	export class Scheduler implements SchedulerLike {
	    private SchedulerAction;
	    /**
	     * Note: the extra arrow function wrapper is to make testing by overriding
	     * Date.now easier.
	     * @nocollapse
	     */
	    static now: () => number;
	    constructor(SchedulerAction: typeof Action, now?: () => number);
	    /**
	     * A getter method that returns a number representing the current time
	     * (at the time this function was called) according to the scheduler's own
	     * internal clock.
	     * @return {number} A number that represents the current time. May or may not
	     * have a relation to wall-clock time. May or may not refer to a time unit
	     * (e.g. milliseconds).
	     */
	    now: () => number;
	    /**
	     * Schedules a function, `work`, for execution. May happen at some point in
	     * the future, according to the `delay` parameter, if specified. May be passed
	     * some context object, `state`, which will be passed to the `work` function.
	     *
	     * The given arguments will be processed an stored as an Action object in a
	     * queue of actions.
	     *
	     * @param {function(state: ?T): ?Subscription} work A function representing a
	     * task, or some unit of work to be executed by the Scheduler.
	     * @param {number} [delay] Time to wait before executing the work, where the
	     * time unit is implicit and defined by the Scheduler itself.
	     * @param {T} [state] Some contextual data that the `work` function uses when
	     * called by the Scheduler.
	     * @return {Subscription} A subscription in order to be able to unsubscribe
	     * the scheduled work.
	     */
	    schedule<T>(work: (this: SchedulerAction<T>, state?: T) => void, delay?: number, state?: T): Subscription;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/scheduler/Action' {
	import { Scheduler } from '../Scheduler';
	import { Subscription } from '../Subscription';
	import { SchedulerAction } from '../types';
	/**
	 * A unit of work to be executed in a `scheduler`. An action is typically
	 * created from within a {@link SchedulerLike} and an RxJS user does not need to concern
	 * themselves about creating and manipulating an Action.
	 *
	 * ```ts
	 * class Action<T> extends Subscription {
	 *   new (scheduler: Scheduler, work: (state?: T) => void);
	 *   schedule(state?: T, delay: number = 0): Subscription;
	 * }
	 * ```
	 *
	 * @class Action<T>
	 */
	export class Action<T> extends Subscription {
	    constructor(scheduler: Scheduler, work: (this: SchedulerAction<T>, state?: T) => void);
	    /**
	     * Schedules this action on its parent {@link SchedulerLike} for execution. May be passed
	     * some context object, `state`. May happen at some point in the future,
	     * according to the `delay` parameter, if specified.
	     * @param {T} [state] Some contextual data that the `work` function uses when
	     * called by the Scheduler.
	     * @param {number} [delay] Time to wait before executing the work, where the
	     * time unit is implicit and defined by the Scheduler.
	     * @return {void}
	     */
	    schedule(state?: T, delay?: number): Subscription;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/scheduler/AsyncScheduler' {
	import { Scheduler } from '../Scheduler';
	import { Action } from './Action';
	import { AsyncAction } from './AsyncAction';
	import { SchedulerAction } from '../types';
	import { Subscription } from '../Subscription';
	export class AsyncScheduler extends Scheduler {
	    static delegate?: Scheduler;
	    actions: Array<AsyncAction<any>>;
	    /**
	     * A flag to indicate whether the Scheduler is currently executing a batch of
	     * queued actions.
	     * @type {boolean}
	     * @deprecated internal use only
	     */
	    active: boolean;
	    /**
	     * An internal ID used to track the latest asynchronous task such as those
	     * coming from `setTimeout`, `setInterval`, `requestAnimationFrame`, and
	     * others.
	     * @type {any}
	     * @deprecated internal use only
	     */
	    scheduled: any;
	    constructor(SchedulerAction: typeof Action, now?: () => number);
	    schedule<T>(work: (this: SchedulerAction<T>, state?: T) => void, delay?: number, state?: T): Subscription;
	    flush(action: AsyncAction<any>): void;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/scheduler/AsyncAction' {
	import { Action } from './Action';
	import { SchedulerAction } from '../types';
	import { Subscription } from '../Subscription';
	import { AsyncScheduler } from './AsyncScheduler';
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	export class AsyncAction<T> extends Action<T> {
	    protected scheduler: AsyncScheduler;
	    protected work: (this: SchedulerAction<T>, state?: T) => void;
	    id: any;
	    state: T;
	    delay: number;
	    protected pending: boolean;
	    constructor(scheduler: AsyncScheduler, work: (this: SchedulerAction<T>, state?: T) => void);
	    schedule(state?: T, delay?: number): Subscription;
	    protected requestAsyncId(scheduler: AsyncScheduler, id?: any, delay?: number): any;
	    protected recycleAsyncId(scheduler: AsyncScheduler, id: any, delay?: number): any;
	    /**
	     * Immediately executes this action and the `work` it contains.
	     * @return {any}
	     */
	    execute(state: T, delay: number): any;
	    protected _execute(state: T, delay: number): any;
	    /** @deprecated This is an internal implementation detail, do not use. */
	    _unsubscribe(): void;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/scheduler/AsapScheduler' {
	import { AsyncAction } from './AsyncAction';
	import { AsyncScheduler } from './AsyncScheduler';
	export class AsapScheduler extends AsyncScheduler {
	    flush(action?: AsyncAction<any>): void;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/scheduler/asap' {
	import { AsapScheduler } from './AsapScheduler';
	/**
	 *
	 * Asap Scheduler
	 *
	 * <span class="informal">Perform task as fast as it can be performed asynchronously</span>
	 *
	 * `asap` scheduler behaves the same as {@link asyncScheduler} scheduler when you use it to delay task
	 * in time. If however you set delay to `0`, `asap` will wait for current synchronously executing
	 * code to end and then it will try to execute given task as fast as possible.
	 *
	 * `asap` scheduler will do its best to minimize time between end of currently executing code
	 * and start of scheduled task. This makes it best candidate for performing so called "deferring".
	 * Traditionally this was achieved by calling `setTimeout(deferredTask, 0)`, but that technique involves
	 * some (although minimal) unwanted delay.
	 *
	 * Note that using `asap` scheduler does not necessarily mean that your task will be first to process
	 * after currently executing code. In particular, if some task was also scheduled with `asap` before,
	 * that task will execute first. That being said, if you need to schedule task asynchronously, but
	 * as soon as possible, `asap` scheduler is your best bet.
	 *
	 * ## Example
	 * Compare async and asap scheduler<
	 * ```ts
	 * import { asapScheduler, asyncScheduler } from 'rxjs';
	 *
	 * asyncScheduler.schedule(() => console.log('async')); // scheduling 'async' first...
	 * asapScheduler.schedule(() => console.log('asap'));
	 *
	 * // Logs:
	 * // "asap"
	 * // "async"
	 * // ... but 'asap' goes first!
	 * ```
	 * @static true
	 * @name asap
	 * @owner Scheduler
	 */
	export const asap: AsapScheduler;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/scheduler/async' {
	import { AsyncScheduler } from './AsyncScheduler';
	/**
	 *
	 * Async Scheduler
	 *
	 * <span class="informal">Schedule task as if you used setTimeout(task, duration)</span>
	 *
	 * `async` scheduler schedules tasks asynchronously, by putting them on the JavaScript
	 * event loop queue. It is best used to delay tasks in time or to schedule tasks repeating
	 * in intervals.
	 *
	 * If you just want to "defer" task, that is to perform it right after currently
	 * executing synchronous code ends (commonly achieved by `setTimeout(deferredTask, 0)`),
	 * better choice will be the {@link asapScheduler} scheduler.
	 *
	 * ## Examples
	 * Use async scheduler to delay task
	 * ```ts
	 * import { asyncScheduler } from 'rxjs';
	 *
	 * const task = () => console.log('it works!');
	 *
	 * asyncScheduler.schedule(task, 2000);
	 *
	 * // After 2 seconds logs:
	 * // "it works!"
	 * ```
	 *
	 * Use async scheduler to repeat task in intervals
	 * ```ts
	 * import { asyncScheduler } from 'rxjs';
	 *
	 * function task(state) {
	 *   console.log(state);
	 *   this.schedule(state + 1, 1000); // `this` references currently executing Action,
	 *                                   // which we reschedule with new state and delay
	 * }
	 *
	 * asyncScheduler.schedule(task, 3000, 0);
	 *
	 * // Logs:
	 * // 0 after 3s
	 * // 1 after 4s
	 * // 2 after 5s
	 * // 3 after 6s
	 * ```
	 *
	 * @static true
	 * @name async
	 * @owner Scheduler
	 */
	export const async: AsyncScheduler;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/scheduler/QueueScheduler' {
	import { AsyncScheduler } from './AsyncScheduler';
	export class QueueScheduler extends AsyncScheduler {
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/scheduler/queue' {
	import { QueueScheduler } from './QueueScheduler';
	/**
	 *
	 * Queue Scheduler
	 *
	 * <span class="informal">Put every next task on a queue, instead of executing it immediately</span>
	 *
	 * `queue` scheduler, when used with delay, behaves the same as {@link asyncScheduler} scheduler.
	 *
	 * When used without delay, it schedules given task synchronously - executes it right when
	 * it is scheduled. However when called recursively, that is when inside the scheduled task,
	 * another task is scheduled with queue scheduler, instead of executing immediately as well,
	 * that task will be put on a queue and wait for current one to finish.
	 *
	 * This means that when you execute task with `queue` scheduler, you are sure it will end
	 * before any other task scheduled with that scheduler will start.
	 *
	 * ## Examples
	 * Schedule recursively first, then do something
	 * ```ts
	 * import { queueScheduler } from 'rxjs';
	 *
	 * queueScheduler.schedule(() => {
	 *   queueScheduler.schedule(() => console.log('second')); // will not happen now, but will be put on a queue
	 *
	 *   console.log('first');
	 * });
	 *
	 * // Logs:
	 * // "first"
	 * // "second"
	 * ```
	 *
	 * Reschedule itself recursively
	 * ```ts
	 * import { queueScheduler } from 'rxjs';
	 *
	 * queueScheduler.schedule(function(state) {
	 *   if (state !== 0) {
	 *     console.log('before', state);
	 *     this.schedule(state - 1); // `this` references currently executing Action,
	 *                               // which we reschedule with new state
	 *     console.log('after', state);
	 *   }
	 * }, 0, 3);
	 *
	 * // In scheduler that runs recursively, you would expect:
	 * // "before", 3
	 * // "before", 2
	 * // "before", 1
	 * // "after", 1
	 * // "after", 2
	 * // "after", 3
	 *
	 * // But with queue it logs:
	 * // "before", 3
	 * // "after", 3
	 * // "before", 2
	 * // "after", 2
	 * // "before", 1
	 * // "after", 1
	 * ```
	 *
	 * @static true
	 * @name queue
	 * @owner Scheduler
	 */
	export const queue: QueueScheduler;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/scheduler/AnimationFrameScheduler' {
	import { AsyncAction } from './AsyncAction';
	import { AsyncScheduler } from './AsyncScheduler';
	export class AnimationFrameScheduler extends AsyncScheduler {
	    flush(action?: AsyncAction<any>): void;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/scheduler/animationFrame' {
	import { AnimationFrameScheduler } from './AnimationFrameScheduler';
	/**
	 *
	 * Animation Frame Scheduler
	 *
	 * <span class="informal">Perform task when `window.requestAnimationFrame` would fire</span>
	 *
	 * When `animationFrame` scheduler is used with delay, it will fall back to {@link asyncScheduler} scheduler
	 * behaviour.
	 *
	 * Without delay, `animationFrame` scheduler can be used to create smooth browser animations.
	 * It makes sure scheduled task will happen just before next browser content repaint,
	 * thus performing animations as efficiently as possible.
	 *
	 * ## Example
	 * Schedule div height animation
	 * ```ts
	 * // html: <div style="background: #0ff;"></div>
	 * import { animationFrameScheduler } from 'rxjs';
	 *
	 * const div = document.querySelector('div');
	 *
	 * animationFrameScheduler.schedule(function(height) {
	 *   div.style.height = height + "px";
	 *
	 *   this.schedule(height + 1);  // `this` references currently executing Action,
	 *                               // which we reschedule with new state
	 * }, 0, 0);
	 *
	 * // You will see a div element growing in height
	 * ```
	 *
	 * @static true
	 * @name animationFrame
	 * @owner Scheduler
	 */
	export const animationFrame: AnimationFrameScheduler;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/scheduler/VirtualTimeScheduler' {
	import { AsyncAction } from './AsyncAction';
	import { Subscription } from '../Subscription';
	import { AsyncScheduler } from './AsyncScheduler';
	import { SchedulerAction } from '../types';
	export class VirtualTimeScheduler extends AsyncScheduler {
	    maxFrames: number;
	    protected static frameTimeFactor: number;
	    frame: number;
	    index: number;
	    constructor(SchedulerAction?: typeof AsyncAction, maxFrames?: number);
	    /**
	     * Prompt the Scheduler to execute all of its queued actions, therefore
	     * clearing its queue.
	     * @return {void}
	     */
	    flush(): void;
	}
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @nodoc
	 */
	export class VirtualAction<T> extends AsyncAction<T> {
	    protected scheduler: VirtualTimeScheduler;
	    protected work: (this: SchedulerAction<T>, state?: T) => void;
	    protected index: number;
	    protected active: boolean;
	    constructor(scheduler: VirtualTimeScheduler, work: (this: SchedulerAction<T>, state?: T) => void, index?: number);
	    schedule(state?: T, delay?: number): Subscription;
	    protected requestAsyncId(scheduler: VirtualTimeScheduler, id?: any, delay?: number): any;
	    protected recycleAsyncId(scheduler: VirtualTimeScheduler, id?: any, delay?: number): any;
	    protected _execute(state: T, delay: number): any;
	    static sortActions<T>(a: VirtualAction<T>, b: VirtualAction<T>): 1 | 0 | -1;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/Notification' {
	import { PartialObserver } from './types';
	import { Observable } from './Observable';
	/**
	 * @deprecated NotificationKind is deprecated as const enums are not compatible with isolated modules. Use a string literal instead.
	 */
	export enum NotificationKind {
	    NEXT = "N",
	    ERROR = "E",
	    COMPLETE = "C"
	}
	/**
	 * Represents a push-based event or value that an {@link Observable} can emit.
	 * This class is particularly useful for operators that manage notifications,
	 * like {@link materialize}, {@link dematerialize}, {@link observeOn}, and
	 * others. Besides wrapping the actual delivered value, it also annotates it
	 * with metadata of, for instance, what type of push message it is (`next`,
	 * `error`, or `complete`).
	 *
	 * @see {@link materialize}
	 * @see {@link dematerialize}
	 * @see {@link observeOn}
	 *
	 * @class Notification<T>
	 */
	export class Notification<T> {
	    kind: 'N' | 'E' | 'C';
	    value?: T;
	    error?: any;
	    hasValue: boolean;
	    constructor(kind: 'N' | 'E' | 'C', value?: T, error?: any);
	    /**
	     * Delivers to the given `observer` the value wrapped by this Notification.
	     * @param {Observer} observer
	     * @return
	     */
	    observe(observer: PartialObserver<T>): any;
	    /**
	     * Given some {@link Observer} callbacks, deliver the value represented by the
	     * current Notification to the correctly corresponding callback.
	     * @param {function(value: T): void} next An Observer `next` callback.
	     * @param {function(err: any): void} [error] An Observer `error` callback.
	     * @param {function(): void} [complete] An Observer `complete` callback.
	     * @return {any}
	     */
	    do(next: (value: T) => void, error?: (err: any) => void, complete?: () => void): any;
	    /**
	     * Takes an Observer or its individual callback functions, and calls `observe`
	     * or `do` methods accordingly.
	     * @param {Observer|function(value: T): void} nextOrObserver An Observer or
	     * the `next` callback.
	     * @param {function(err: any): void} [error] An Observer `error` callback.
	     * @param {function(): void} [complete] An Observer `complete` callback.
	     * @return {any}
	     */
	    accept(nextOrObserver: PartialObserver<T> | ((value: T) => void), error?: (err: any) => void, complete?: () => void): any;
	    /**
	     * Returns a simple Observable that just delivers the notification represented
	     * by this Notification instance.
	     * @return {any}
	     */
	    toObservable(): Observable<T>;
	    private static completeNotification;
	    private static undefinedValueNotification;
	    /**
	     * A shortcut to create a Notification instance of the type `next` from a
	     * given value.
	     * @param {T} value The `next` value.
	     * @return {Notification<T>} The "next" Notification representing the
	     * argument.
	     * @nocollapse
	     */
	    static createNext<T>(value: T): Notification<T>;
	    /**
	     * A shortcut to create a Notification instance of the type `error` from a
	     * given error.
	     * @param {any} [err] The `error` error.
	     * @return {Notification<T>} The "error" Notification representing the
	     * argument.
	     * @nocollapse
	     */
	    static createError<T>(err?: any): Notification<T>;
	    /**
	     * A shortcut to create a Notification instance of the type `complete`.
	     * @return {Notification<any>} The valueless "complete" Notification.
	     * @nocollapse
	     */
	    static createComplete(): Notification<any>;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/util/pipe' {
	import { UnaryFunction } from '../types';
	export function pipe<T>(): UnaryFunction<T, T>;
	export function pipe<T, A>(fn1: UnaryFunction<T, A>): UnaryFunction<T, A>;
	export function pipe<T, A, B>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>): UnaryFunction<T, B>;
	export function pipe<T, A, B, C>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>): UnaryFunction<T, C>;
	export function pipe<T, A, B, C, D>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>): UnaryFunction<T, D>;
	export function pipe<T, A, B, C, D, E>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>): UnaryFunction<T, E>;
	export function pipe<T, A, B, C, D, E, F>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>): UnaryFunction<T, F>;
	export function pipe<T, A, B, C, D, E, F, G>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>, fn7: UnaryFunction<F, G>): UnaryFunction<T, G>;
	export function pipe<T, A, B, C, D, E, F, G, H>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>, fn7: UnaryFunction<F, G>, fn8: UnaryFunction<G, H>): UnaryFunction<T, H>;
	export function pipe<T, A, B, C, D, E, F, G, H, I>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>, fn7: UnaryFunction<F, G>, fn8: UnaryFunction<G, H>, fn9: UnaryFunction<H, I>): UnaryFunction<T, I>;
	export function pipe<T, A, B, C, D, E, F, G, H, I>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>, fn7: UnaryFunction<F, G>, fn8: UnaryFunction<G, H>, fn9: UnaryFunction<H, I>, ...fns: UnaryFunction<any, any>[]): UnaryFunction<T, {}>;
	/** @internal */
	export function pipeFromArray<T, R>(fns: Array<UnaryFunction<T, R>>): UnaryFunction<T, R>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/util/noop' {
	export function noop(): void;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/util/identity' {
	export function identity<T>(x: T): T;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/util/isObservable' {
	import { Observable } from '../Observable';
	/**
	 * Tests to see if the object is an RxJS {@link Observable}
	 * @param obj the object to test
	 */
	export function isObservable<T>(obj: any): obj is Observable<T>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/util/ArgumentOutOfRangeError' {
	export interface ArgumentOutOfRangeError extends Error {
	}
	export interface ArgumentOutOfRangeErrorCtor {
	    new (): ArgumentOutOfRangeError;
	}
	/**
	 * An error thrown when an element was queried at a certain index of an
	 * Observable, but no such index or position exists in that sequence.
	 *
	 * @see {@link elementAt}
	 * @see {@link take}
	 * @see {@link takeLast}
	 *
	 * @class ArgumentOutOfRangeError
	 */
	export const ArgumentOutOfRangeError: ArgumentOutOfRangeErrorCtor;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/util/EmptyError' {
	export interface EmptyError extends Error {
	}
	export interface EmptyErrorCtor {
	    new (): EmptyError;
	}
	/**
	 * An error thrown when an Observable or a sequence was queried but has no
	 * elements.
	 *
	 * @see {@link first}
	 * @see {@link last}
	 * @see {@link single}
	 *
	 * @class EmptyError
	 */
	export const EmptyError: EmptyErrorCtor;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/util/ObjectUnsubscribedError' {
	export interface ObjectUnsubscribedError extends Error {
	}
	export interface ObjectUnsubscribedErrorCtor {
	    new (): ObjectUnsubscribedError;
	}
	/**
	 * An error thrown when an action is invalid because the object has been
	 * unsubscribed.
	 *
	 * @see {@link Subject}
	 * @see {@link BehaviorSubject}
	 *
	 * @class ObjectUnsubscribedError
	 */
	export const ObjectUnsubscribedError: ObjectUnsubscribedErrorCtor;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/util/UnsubscriptionError' {
	export interface UnsubscriptionError extends Error {
	    readonly errors: any[];
	}
	export interface UnsubscriptionErrorCtor {
	    new (errors: any[]): UnsubscriptionError;
	}
	/**
	 * An error thrown when one or more errors have occurred during the
	 * `unsubscribe` of a {@link Subscription}.
	 */
	export const UnsubscriptionError: UnsubscriptionErrorCtor;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/util/TimeoutError' {
	export interface TimeoutError extends Error {
	}
	export interface TimeoutErrorCtor {
	    new (): TimeoutError;
	}
	/**
	 * An error thrown when duetime elapses.
	 *
	 * @see {@link operators/timeout}
	 *
	 * @class TimeoutError
	 */
	export const TimeoutError: TimeoutErrorCtor;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/bindCallback' {
	import { SchedulerLike } from '../types';
	import { Observable } from '../Observable';
	/** @deprecated resultSelector is no longer supported, use a mapping function. */
	export function bindCallback(callbackFunc: Function, resultSelector: Function, scheduler?: SchedulerLike): (...args: any[]) => Observable<any>;
	export function bindCallback<R1, R2, R3, R4>(callbackFunc: (callback: (res1: R1, res2: R2, res3: R3, res4: R4, ...args: any[]) => any) => any, scheduler?: SchedulerLike): () => Observable<any[]>;
	export function bindCallback<R1, R2, R3>(callbackFunc: (callback: (res1: R1, res2: R2, res3: R3) => any) => any, scheduler?: SchedulerLike): () => Observable<[R1, R2, R3]>;
	export function bindCallback<R1, R2>(callbackFunc: (callback: (res1: R1, res2: R2) => any) => any, scheduler?: SchedulerLike): () => Observable<[R1, R2]>;
	export function bindCallback<R1>(callbackFunc: (callback: (res1: R1) => any) => any, scheduler?: SchedulerLike): () => Observable<R1>;
	export function bindCallback(callbackFunc: (callback: () => any) => any, scheduler?: SchedulerLike): () => Observable<void>;
	export function bindCallback<A1, R1, R2, R3, R4>(callbackFunc: (arg1: A1, callback: (res1: R1, res2: R2, res3: R3, res4: R4, ...args: any[]) => any) => any, scheduler?: SchedulerLike): (arg1: A1) => Observable<any[]>;
	export function bindCallback<A1, R1, R2, R3>(callbackFunc: (arg1: A1, callback: (res1: R1, res2: R2, res3: R3) => any) => any, scheduler?: SchedulerLike): (arg1: A1) => Observable<[R1, R2, R3]>;
	export function bindCallback<A1, R1, R2>(callbackFunc: (arg1: A1, callback: (res1: R1, res2: R2) => any) => any, scheduler?: SchedulerLike): (arg1: A1) => Observable<[R1, R2]>;
	export function bindCallback<A1, R1>(callbackFunc: (arg1: A1, callback: (res1: R1) => any) => any, scheduler?: SchedulerLike): (arg1: A1) => Observable<R1>;
	export function bindCallback<A1>(callbackFunc: (arg1: A1, callback: () => any) => any, scheduler?: SchedulerLike): (arg1: A1) => Observable<void>;
	export function bindCallback<A1, A2, R1, R2, R3, R4>(callbackFunc: (arg1: A1, arg2: A2, callback: (res1: R1, res2: R2, res3: R3, res4: R4, ...args: any[]) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2) => Observable<any[]>;
	export function bindCallback<A1, A2, R1, R2, R3>(callbackFunc: (arg1: A1, arg2: A2, callback: (res1: R1, res2: R2, res3: R3) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2) => Observable<[R1, R2, R3]>;
	export function bindCallback<A1, A2, R1, R2>(callbackFunc: (arg1: A1, arg2: A2, callback: (res1: R1, res2: R2) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2) => Observable<[R1, R2]>;
	export function bindCallback<A1, A2, R1>(callbackFunc: (arg1: A1, arg2: A2, callback: (res1: R1) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2) => Observable<R1>;
	export function bindCallback<A1, A2>(callbackFunc: (arg1: A1, arg2: A2, callback: () => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2) => Observable<void>;
	export function bindCallback<A1, A2, A3, R1, R2, R3, R4>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, callback: (res1: R1, res2: R2, res3: R3, res4: R4, ...args: any[]) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3) => Observable<any[]>;
	export function bindCallback<A1, A2, A3, R1, R2, R3>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, callback: (res1: R1, res2: R2, res3: R3) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3) => Observable<[R1, R2, R3]>;
	export function bindCallback<A1, A2, A3, R1, R2>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, callback: (res1: R1, res2: R2) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3) => Observable<[R1, R2]>;
	export function bindCallback<A1, A2, A3, R1>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, callback: (res1: R1) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3) => Observable<R1>;
	export function bindCallback<A1, A2, A3>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, callback: () => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3) => Observable<void>;
	export function bindCallback<A1, A2, A3, A4, R1, R2, R3, R4>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, callback: (res1: R1, res2: R2, res3: R3, res4: R4, ...args: any[]) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Observable<any[]>;
	export function bindCallback<A1, A2, A3, A4, R1, R2, R3>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, callback: (res1: R1, res2: R2, res3: R3) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Observable<[R1, R2, R3]>;
	export function bindCallback<A1, A2, A3, A4, R1, R2>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, callback: (res1: R1, res2: R2) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Observable<[R1, R2]>;
	export function bindCallback<A1, A2, A3, A4, R1>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, callback: (res1: R1) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Observable<R1>;
	export function bindCallback<A1, A2, A3, A4>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, callback: () => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Observable<void>;
	export function bindCallback<A1, A2, A3, A4, A5, R1, R2, R3, R4>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, callback: (res1: R1, res2: R2, res3: R3, res4: R4, ...args: any[]) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => Observable<any[]>;
	export function bindCallback<A1, A2, A3, A4, A5, R1, R2, R3>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, callback: (res1: R1, res2: R2, res3: R3) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => Observable<[R1, R2, R3]>;
	export function bindCallback<A1, A2, A3, A4, A5, R1, R2>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, callback: (res1: R1, res2: R2) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => Observable<[R1, R2]>;
	export function bindCallback<A1, A2, A3, A4, A5, R1>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, callback: (res1: R1) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => Observable<R1>;
	export function bindCallback<A1, A2, A3, A4, A5>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, callback: () => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => Observable<void>;
	export function bindCallback<A, R>(callbackFunc: (...args: Array<A | ((result: R) => any)>) => any, scheduler?: SchedulerLike): (...args: A[]) => Observable<R>;
	export function bindCallback<A, R>(callbackFunc: (...args: Array<A | ((...results: R[]) => any)>) => any, scheduler?: SchedulerLike): (...args: A[]) => Observable<R[]>;
	export function bindCallback(callbackFunc: Function, scheduler?: SchedulerLike): (...args: any[]) => Observable<any>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/bindNodeCallback' {
	import { Observable } from '../Observable';
	import { SchedulerLike } from '../types';
	/** @deprecated resultSelector is deprecated, pipe to map instead */
	export function bindNodeCallback(callbackFunc: Function, resultSelector: Function, scheduler?: SchedulerLike): (...args: any[]) => Observable<any>;
	export function bindNodeCallback<R1, R2, R3, R4>(callbackFunc: (callback: (err: any, res1: R1, res2: R2, res3: R3, res4: R4, ...args: any[]) => any) => any, scheduler?: SchedulerLike): (...args: any[]) => Observable<any[]>;
	export function bindNodeCallback<R1, R2, R3>(callbackFunc: (callback: (err: any, res1: R1, res2: R2, res3: R3) => any) => any, scheduler?: SchedulerLike): () => Observable<[R1, R2, R3]>;
	export function bindNodeCallback<R1, R2>(callbackFunc: (callback: (err: any, res1: R1, res2: R2) => any) => any, scheduler?: SchedulerLike): () => Observable<[R1, R2]>;
	export function bindNodeCallback<R1>(callbackFunc: (callback: (err: any, res1: R1) => any) => any, scheduler?: SchedulerLike): () => Observable<R1>;
	export function bindNodeCallback(callbackFunc: (callback: (err: any) => any) => any, scheduler?: SchedulerLike): () => Observable<void>;
	export function bindNodeCallback<A1, R1, R2, R3, R4>(callbackFunc: (arg1: A1, callback: (err: any, res1: R1, res2: R2, res3: R3, res4: R4, ...args: any[]) => any) => any, scheduler?: SchedulerLike): (...args: any[]) => Observable<any[]>;
	export function bindNodeCallback<A1, R1, R2, R3>(callbackFunc: (arg1: A1, callback: (err: any, res1: R1, res2: R2, res3: R3) => any) => any, scheduler?: SchedulerLike): (arg1: A1) => Observable<[R1, R2, R3]>;
	export function bindNodeCallback<A1, R1, R2>(callbackFunc: (arg1: A1, callback: (err: any, res1: R1, res2: R2) => any) => any, scheduler?: SchedulerLike): (arg1: A1) => Observable<[R1, R2]>;
	export function bindNodeCallback<A1, R1>(callbackFunc: (arg1: A1, callback: (err: any, res1: R1) => any) => any, scheduler?: SchedulerLike): (arg1: A1) => Observable<R1>;
	export function bindNodeCallback<A1>(callbackFunc: (arg1: A1, callback: (err: any) => any) => any, scheduler?: SchedulerLike): (arg1: A1) => Observable<void>;
	export function bindNodeCallback<A1, A2, R1, R2, R3, R4>(callbackFunc: (arg1: A1, arg2: A2, callback: (err: any, res1: R1, res2: R2, res3: R3, res4: R4, ...args: any[]) => any) => any, scheduler?: SchedulerLike): (...args: any[]) => Observable<any[]>;
	export function bindNodeCallback<A1, A2, R1, R2, R3>(callbackFunc: (arg1: A1, arg2: A2, callback: (err: any, res1: R1, res2: R2, res3: R3) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2) => Observable<[R1, R2, R3]>;
	export function bindNodeCallback<A1, A2, R1, R2>(callbackFunc: (arg1: A1, arg2: A2, callback: (err: any, res1: R1, res2: R2) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2) => Observable<[R1, R2]>;
	export function bindNodeCallback<A1, A2, R1>(callbackFunc: (arg1: A1, arg2: A2, callback: (err: any, res1: R1) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2) => Observable<R1>;
	export function bindNodeCallback<A1, A2>(callbackFunc: (arg1: A1, arg2: A2, callback: (err: any) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2) => Observable<void>;
	export function bindNodeCallback<A1, A2, A3, R1, R2, R3, R4>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, callback: (err: any, res1: R1, res2: R2, res3: R3, res4: R4, ...args: any[]) => any) => any, scheduler?: SchedulerLike): (...args: any[]) => Observable<any[]>;
	export function bindNodeCallback<A1, A2, A3, R1, R2, R3>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, callback: (err: any, res1: R1, res2: R2, res3: R3) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3) => Observable<[R1, R2, R3]>;
	export function bindNodeCallback<A1, A2, A3, R1, R2>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, callback: (err: any, res1: R1, res2: R2) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3) => Observable<[R1, R2]>;
	export function bindNodeCallback<A1, A2, A3, R1>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, callback: (err: any, res1: R1) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3) => Observable<R1>;
	export function bindNodeCallback<A1, A2, A3>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, callback: (err: any) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3) => Observable<void>;
	export function bindNodeCallback<A1, A2, A3, A4, R1, R2, R3, R4>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, callback: (err: any, res1: R1, res2: R2, res3: R3, res4: R4, ...args: any[]) => any) => any, scheduler?: SchedulerLike): (...args: any[]) => Observable<any[]>;
	export function bindNodeCallback<A1, A2, A3, A4, R1, R2, R3>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, callback: (err: any, res1: R1, res2: R2, res3: R3) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Observable<[R1, R2, R3]>;
	export function bindNodeCallback<A1, A2, A3, A4, R1, R2>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, callback: (err: any, res1: R1, res2: R2) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Observable<[R1, R2]>;
	export function bindNodeCallback<A1, A2, A3, A4, R1>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, callback: (err: any, res1: R1) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Observable<R1>;
	export function bindNodeCallback<A1, A2, A3, A4>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, callback: (err: any) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Observable<void>;
	export function bindNodeCallback<A1, A2, A3, A4, A5, R1, R2, R3, R4>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, callback: (err: any, res1: R1, res2: R2, res3: R3, res4: R4, ...args: any[]) => any) => any, scheduler?: SchedulerLike): (...args: any[]) => Observable<any[]>;
	export function bindNodeCallback<A1, A2, A3, A4, A5, R1, R2, R3>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, callback: (err: any, res1: R1, res2: R2, res3: R3) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => Observable<[R1, R2, R3]>;
	export function bindNodeCallback<A1, A2, A3, A4, A5, R1, R2>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, callback: (err: any, res1: R1, res2: R2) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => Observable<[R1, R2]>;
	export function bindNodeCallback<A1, A2, A3, A4, A5, R1>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, callback: (err: any, res1: R1) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => Observable<R1>;
	export function bindNodeCallback<A1, A2, A3, A4, A5>(callbackFunc: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, callback: (err: any) => any) => any, scheduler?: SchedulerLike): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => Observable<void>;
	export function bindNodeCallback(callbackFunc: Function, scheduler?: SchedulerLike): (...args: any[]) => Observable<any[]>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/InnerSubscriber' {
	import { Subscriber } from './Subscriber';
	import { OuterSubscriber } from './OuterSubscriber';
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	export class InnerSubscriber<T, R> extends Subscriber<R> {
	    private parent;
	    outerValue: T;
	    outerIndex: number;
	    private index;
	    constructor(parent: OuterSubscriber<T, R>, outerValue: T, outerIndex: number);
	    protected _next(value: R): void;
	    protected _error(error: any): void;
	    protected _complete(): void;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/OuterSubscriber' {
	import { Subscriber } from './Subscriber';
	import { InnerSubscriber } from './InnerSubscriber';
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	export class OuterSubscriber<T, R> extends Subscriber<T> {
	    notifyNext(outerValue: T, innerValue: R, outerIndex: number, innerIndex: number, innerSub: InnerSubscriber<T, R>): void;
	    notifyError(error: any, innerSub: InnerSubscriber<T, R>): void;
	    notifyComplete(innerSub: InnerSubscriber<T, R>): void;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/combineLatest' {
	import { Observable } from '../Observable';
	import { ObservableInput, SchedulerLike, ObservedValueOf } from '../types';
	import { Subscriber } from '../Subscriber';
	import { OuterSubscriber } from '../OuterSubscriber';
	import { Operator } from '../Operator';
	import { InnerSubscriber } from '../InnerSubscriber';
	/** @deprecated resultSelector no longer supported, pipe to map instead */
	export function combineLatest<O1 extends ObservableInput<any>, R>(sources: [O1], resultSelector: (v1: ObservedValueOf<O1>) => R, scheduler?: SchedulerLike): Observable<R>;
	/** @deprecated resultSelector no longer supported, pipe to map instead */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, R>(sources: [O1, O2], resultSelector: (v1: ObservedValueOf<O1>, v2: ObservedValueOf<O2>) => R, scheduler?: SchedulerLike): Observable<R>;
	/** @deprecated resultSelector no longer supported, pipe to map instead */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, R>(sources: [O1, O2, O3], resultSelector: (v1: ObservedValueOf<O1>, v2: ObservedValueOf<O2>, v3: ObservedValueOf<O3>) => R, scheduler?: SchedulerLike): Observable<R>;
	/** @deprecated resultSelector no longer supported, pipe to map instead */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, R>(sources: [O1, O2, O3, O4], resultSelector: (v1: ObservedValueOf<O1>, v2: ObservedValueOf<O2>, v3: ObservedValueOf<O3>, v4: ObservedValueOf<O4>) => R, scheduler?: SchedulerLike): Observable<R>;
	/** @deprecated resultSelector no longer supported, pipe to map instead */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, O5 extends ObservableInput<any>, R>(sources: [O1, O2, O3, O4, O5], resultSelector: (v1: ObservedValueOf<O1>, v2: ObservedValueOf<O2>, v3: ObservedValueOf<O3>, v4: ObservedValueOf<O4>, v5: ObservedValueOf<O5>) => R, scheduler?: SchedulerLike): Observable<R>;
	/** @deprecated resultSelector no longer supported, pipe to map instead */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, O5 extends ObservableInput<any>, O6 extends ObservableInput<any>, R>(sources: [O1, O2, O3, O4, O5, O6], resultSelector: (v1: ObservedValueOf<O1>, v2: ObservedValueOf<O2>, v3: ObservedValueOf<O3>, v4: ObservedValueOf<O4>, v5: ObservedValueOf<O5>, v6: ObservedValueOf<O6>) => R, scheduler?: SchedulerLike): Observable<R>;
	/** @deprecated resultSelector no longer supported, pipe to map instead */
	export function combineLatest<O extends ObservableInput<any>, R>(sources: O[], resultSelector: (...args: ObservedValueOf<O>[]) => R, scheduler?: SchedulerLike): Observable<R>;
	/** @deprecated resultSelector no longer supported, pipe to map instead */
	export function combineLatest<O1 extends ObservableInput<any>, R>(v1: O1, resultSelector: (v1: ObservedValueOf<O1>) => R, scheduler?: SchedulerLike): Observable<R>;
	/** @deprecated resultSelector no longer supported, pipe to map instead */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, R>(v1: O1, v2: O2, resultSelector: (v1: ObservedValueOf<O1>, v2: ObservedValueOf<O2>) => R, scheduler?: SchedulerLike): Observable<R>;
	/** @deprecated resultSelector no longer supported, pipe to map instead */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, R>(v1: O1, v2: O2, v3: O3, resultSelector: (v1: ObservedValueOf<O1>, v2: ObservedValueOf<O2>, v3: ObservedValueOf<O3>) => R, scheduler?: SchedulerLike): Observable<R>;
	/** @deprecated resultSelector no longer supported, pipe to map instead */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, R>(v1: O1, v2: O2, v3: O3, v4: O4, resultSelector: (v1: ObservedValueOf<O1>, v2: ObservedValueOf<O2>, v3: ObservedValueOf<O3>, v4: ObservedValueOf<O4>) => R, scheduler?: SchedulerLike): Observable<R>;
	/** @deprecated resultSelector no longer supported, pipe to map instead */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, O5 extends ObservableInput<any>, R>(v1: O1, v2: O2, v3: O3, v4: O4, v5: O5, resultSelector: (v1: ObservedValueOf<O1>, v2: ObservedValueOf<O2>, v3: ObservedValueOf<O3>, v4: ObservedValueOf<O4>, v5: ObservedValueOf<O5>) => R, scheduler?: SchedulerLike): Observable<R>;
	/** @deprecated resultSelector no longer supported, pipe to map instead */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, O5 extends ObservableInput<any>, O6 extends ObservableInput<any>, R>(v1: O1, v2: O2, v3: O3, v4: O4, v5: O5, v6: O6, resultSelector: (v1: ObservedValueOf<O1>, v2: ObservedValueOf<O2>, v3: ObservedValueOf<O3>, v4: ObservedValueOf<O4>, v5: ObservedValueOf<O5>, v6: ObservedValueOf<O6>) => R, scheduler?: SchedulerLike): Observable<R>;
	/** @deprecated Passing a scheduler here is deprecated, use {@link subscribeOn} and/or {@link observeOn} instead */
	export function combineLatest<O1 extends ObservableInput<any>>(sources: [O1], scheduler: SchedulerLike): Observable<[ObservedValueOf<O1>]>;
	/** @deprecated Passing a scheduler here is deprecated, use {@link subscribeOn} and/or {@link observeOn} instead */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>>(sources: [O1, O2], scheduler: SchedulerLike): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>]>;
	/** @deprecated Passing a scheduler here is deprecated, use {@link subscribeOn} and/or {@link observeOn} instead */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>>(sources: [O1, O2, O3], scheduler: SchedulerLike): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>]>;
	/** @deprecated Passing a scheduler here is deprecated, use {@link subscribeOn} and/or {@link observeOn} instead */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>>(sources: [O1, O2, O3, O4], scheduler: SchedulerLike): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>]>;
	/** @deprecated Passing a scheduler here is deprecated, use {@link subscribeOn} and/or {@link observeOn} instead */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, O5 extends ObservableInput<any>>(sources: [O1, O2, O3, O4, O5], scheduler: SchedulerLike): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>, ObservedValueOf<O5>]>;
	/** @deprecated Passing a scheduler here is deprecated, use {@link subscribeOn} and/or {@link observeOn} instead */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, O5 extends ObservableInput<any>, O6 extends ObservableInput<any>>(sources: [O1, O2, O3, O4, O5, O6], scheduler: SchedulerLike): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>, ObservedValueOf<O5>, ObservedValueOf<O6>]>;
	/** @deprecated Passing a scheduler here is deprecated, use {@link subscribeOn} and/or {@link observeOn} instead */
	export function combineLatest<O extends ObservableInput<any>>(sources: O[], scheduler: SchedulerLike): Observable<ObservedValueOf<O>[]>;
	export function combineLatest<O1 extends ObservableInput<any>>(sources: [O1]): Observable<[ObservedValueOf<O1>]>;
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>>(sources: [O1, O2]): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>]>;
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>>(sources: [O1, O2, O3]): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>]>;
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>>(sources: [O1, O2, O3, O4]): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>]>;
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, O5 extends ObservableInput<any>>(sources: [O1, O2, O3, O4, O5]): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>, ObservedValueOf<O5>]>;
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, O5 extends ObservableInput<any>, O6 extends ObservableInput<any>>(sources: [O1, O2, O3, O4, O5, O6]): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>, ObservedValueOf<O5>, ObservedValueOf<O6>]>;
	export function combineLatest<O extends ObservableInput<any>>(sources: O[]): Observable<ObservedValueOf<O>[]>;
	/** @deprecated Pass arguments in a single array instead `combineLatest([a, b, c])` */
	export function combineLatest<O1 extends ObservableInput<any>>(v1: O1, scheduler?: SchedulerLike): Observable<[ObservedValueOf<O1>]>;
	/** @deprecated Pass arguments in a single array instead `combineLatest([a, b, c])` */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>>(v1: O1, v2: O2, scheduler?: SchedulerLike): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>]>;
	/** @deprecated Pass arguments in a single array instead `combineLatest([a, b, c])` */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>>(v1: O1, v2: O2, v3: O3, scheduler?: SchedulerLike): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>]>;
	/** @deprecated Pass arguments in a single array instead `combineLatest([a, b, c])` */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>>(v1: O1, v2: O2, v3: O3, v4: O4, scheduler?: SchedulerLike): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>]>;
	/** @deprecated Pass arguments in a single array instead `combineLatest([a, b, c])` */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, O5 extends ObservableInput<any>>(v1: O1, v2: O2, v3: O3, v4: O4, v5: O5, scheduler?: SchedulerLike): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>, ObservedValueOf<O5>]>;
	/** @deprecated Pass arguments in a single array instead `combineLatest([a, b, c])` */
	export function combineLatest<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, O5 extends ObservableInput<any>, O6 extends ObservableInput<any>>(v1: O1, v2: O2, v3: O3, v4: O4, v5: O5, v6: O6, scheduler?: SchedulerLike): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>, ObservedValueOf<O5>, ObservedValueOf<O6>]>;
	/** @deprecated Pass arguments in a single array instead `combineLatest([a, b, c])` */
	export function combineLatest<O extends ObservableInput<any>>(...observables: O[]): Observable<any[]>;
	/** @deprecated Pass arguments in a single array instead `combineLatest([a, b, c])` */
	export function combineLatest<O extends ObservableInput<any>, R>(...observables: Array<ObservableInput<any> | ((...values: Array<any>) => R)>): Observable<R>;
	/** @deprecated resultSelector no longer supported, pipe to map instead */
	export function combineLatest<O extends ObservableInput<any>, R>(array: O[], resultSelector: (...values: ObservedValueOf<O>[]) => R, scheduler?: SchedulerLike): Observable<R>;
	/** @deprecated Passing a scheduler here is deprecated, use {@link subscribeOn} and/or {@link observeOn} instead */
	export function combineLatest<O extends ObservableInput<any>>(...observables: Array<O | SchedulerLike>): Observable<any[]>;
	/** @deprecated Passing a scheduler here is deprecated, use {@link subscribeOn} and/or {@link observeOn} instead */
	export function combineLatest<O extends ObservableInput<any>, R>(...observables: Array<O | ((...values: ObservedValueOf<O>[]) => R) | SchedulerLike>): Observable<R>;
	/** @deprecated Passing a scheduler here is deprecated, use {@link subscribeOn} and/or {@link observeOn} instead */
	export function combineLatest<R>(...observables: Array<ObservableInput<any> | ((...values: Array<any>) => R) | SchedulerLike>): Observable<R>;
	export class CombineLatestOperator<T, R> implements Operator<T, R> {
	    private resultSelector?;
	    constructor(resultSelector?: (...values: Array<any>) => R);
	    call(subscriber: Subscriber<R>, source: any): any;
	}
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	export class CombineLatestSubscriber<T, R> extends OuterSubscriber<T, R> {
	    private resultSelector?;
	    private active;
	    private values;
	    private observables;
	    private toRespond;
	    constructor(destination: Subscriber<R>, resultSelector?: (...values: Array<any>) => R);
	    protected _next(observable: any): void;
	    protected _complete(): void;
	    notifyComplete(unused: Subscriber<R>): void;
	    notifyNext(outerValue: T, innerValue: R, outerIndex: number, innerIndex: number, innerSub: InnerSubscriber<T, R>): void;
	    private _tryResultSelector;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/concat' {
	import { Observable } from '../Observable';
	import { ObservableInput, SchedulerLike, ObservedValueOf } from '../types';
	/** @deprecated Use {@link scheduled} and {@link concatAll} (e.g. `scheduled([o1, o2, o3], scheduler).pipe(concatAll())`) */
	export function concat<O1 extends ObservableInput<any>>(v1: O1, scheduler: SchedulerLike): Observable<ObservedValueOf<O1>>;
	/** @deprecated Use {@link scheduled} and {@link concatAll} (e.g. `scheduled([o1, o2, o3], scheduler).pipe(concatAll())`) */
	export function concat<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>>(v1: O1, v2: O2, scheduler: SchedulerLike): Observable<ObservedValueOf<O1> | ObservedValueOf<O2>>;
	/** @deprecated Use {@link scheduled} and {@link concatAll} (e.g. `scheduled([o1, o2, o3], scheduler).pipe(concatAll())`) */
	export function concat<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>>(v1: O1, v2: O2, v3: O3, scheduler: SchedulerLike): Observable<ObservedValueOf<O1> | ObservedValueOf<O2> | ObservedValueOf<O3>>;
	/** @deprecated Use {@link scheduled} and {@link concatAll} (e.g. `scheduled([o1, o2, o3], scheduler).pipe(concatAll())`) */
	export function concat<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>>(v1: O1, v2: O2, v3: O3, v4: O4, scheduler: SchedulerLike): Observable<ObservedValueOf<O1> | ObservedValueOf<O2> | ObservedValueOf<O3> | ObservedValueOf<O4>>;
	/** @deprecated Use {@link scheduled} and {@link concatAll} (e.g. `scheduled([o1, o2, o3], scheduler).pipe(concatAll())`) */
	export function concat<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, O5 extends ObservableInput<any>>(v1: O1, v2: O2, v3: O3, v4: O4, v5: O5, scheduler: SchedulerLike): Observable<ObservedValueOf<O1> | ObservedValueOf<O2> | ObservedValueOf<O3> | ObservedValueOf<O4> | ObservedValueOf<O5>>;
	/** @deprecated Use {@link scheduled} and {@link concatAll} (e.g. `scheduled([o1, o2, o3], scheduler).pipe(concatAll())`) */
	export function concat<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, O5 extends ObservableInput<any>, O6 extends ObservableInput<any>>(v1: O1, v2: O2, v3: O3, v4: O4, v5: O5, v6: O6, scheduler: SchedulerLike): Observable<ObservedValueOf<O1> | ObservedValueOf<O2> | ObservedValueOf<O3> | ObservedValueOf<O4> | ObservedValueOf<O5> | ObservedValueOf<O6>>;
	export function concat<O1 extends ObservableInput<any>>(v1: O1): Observable<ObservedValueOf<O1>>;
	export function concat<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>>(v1: O1, v2: O2): Observable<ObservedValueOf<O1> | ObservedValueOf<O2>>;
	export function concat<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>>(v1: O1, v2: O2, v3: O3): Observable<ObservedValueOf<O1> | ObservedValueOf<O2> | ObservedValueOf<O3>>;
	export function concat<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>>(v1: O1, v2: O2, v3: O3, v4: O4): Observable<ObservedValueOf<O1> | ObservedValueOf<O2> | ObservedValueOf<O3> | ObservedValueOf<O4>>;
	export function concat<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, O5 extends ObservableInput<any>>(v1: O1, v2: O2, v3: O3, v4: O4, v5: O5): Observable<ObservedValueOf<O1> | ObservedValueOf<O2> | ObservedValueOf<O3> | ObservedValueOf<O4> | ObservedValueOf<O5>>;
	export function concat<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, O5 extends ObservableInput<any>, O6 extends ObservableInput<any>>(v1: O1, v2: O2, v3: O3, v4: O4, v5: O5, v6: O6): Observable<ObservedValueOf<O1> | ObservedValueOf<O2> | ObservedValueOf<O3> | ObservedValueOf<O4> | ObservedValueOf<O5> | ObservedValueOf<O6>>;
	export function concat<O extends ObservableInput<any>>(...observables: O[]): Observable<ObservedValueOf<O>>;
	/** @deprecated Use {@link scheduled} and {@link concatAll} (e.g. `scheduled([o1, o2, o3], scheduler).pipe(concatAll())`) */
	export function concat<O extends ObservableInput<any>>(...observables: (O | SchedulerLike)[]): Observable<ObservedValueOf<O>>;
	export function concat<R>(...observables: ObservableInput<any>[]): Observable<R>;
	/** @deprecated Use {@link scheduled} and {@link concatAll} (e.g. `scheduled([o1, o2, o3], scheduler).pipe(concatAll())`) */
	export function concat<R>(...observables: (ObservableInput<any> | SchedulerLike)[]): Observable<R>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/defer' {
	import { Observable } from '../Observable';
	import { ObservedValueOf, ObservableInput } from '../types';
	/**
	 * Creates an Observable that, on subscribe, calls an Observable factory to
	 * make an Observable for each new Observer.
	 *
	 * <span class="informal">Creates the Observable lazily, that is, only when it
	 * is subscribed.
	 * </span>
	 *
	 * ![](defer.png)
	 *
	 * `defer` allows you to create the Observable only when the Observer
	 * subscribes, and create a fresh Observable for each Observer. It waits until
	 * an Observer subscribes to it, and then it generates an Observable,
	 * typically with an Observable factory function. It does this afresh for each
	 * subscriber, so although each subscriber may think it is subscribing to the
	 * same Observable, in fact each subscriber gets its own individual
	 * Observable.
	 *
	 * ## Example
	 * ### Subscribe to either an Observable of clicks or an Observable of interval, at random
	 * ```ts
	 * import { defer, fromEvent, interval } from 'rxjs';
	 *
	 * const clicksOrInterval = defer(function () {
	 *   return Math.random() > 0.5
	 *     ? fromEvent(document, 'click')
	 *     : interval(1000);
	 * });
	 * clicksOrInterval.subscribe(x => console.log(x));
	 *
	 * // Results in the following behavior:
	 * // If the result of Math.random() is greater than 0.5 it will listen
	 * // for clicks anywhere on the "document"; when document is clicked it
	 * // will log a MouseEvent object to the console. If the result is less
	 * // than 0.5 it will emit ascending numbers, one every second(1000ms).
	 * ```
	 *
	 * @see {@link Observable}
	 *
	 * @param {function(): SubscribableOrPromise} observableFactory The Observable
	 * factory function to invoke for each Observer that subscribes to the output
	 * Observable. May also return a Promise, which will be converted on the fly
	 * to an Observable.
	 * @return {Observable} An Observable whose Observers' subscriptions trigger
	 * an invocation of the given Observable factory function.
	 * @static true
	 * @name defer
	 * @owner Observable
	 */
	export function defer<O extends ObservableInput<any>>(observableFactory: () => O | void): Observable<ObservedValueOf<O>>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/empty' {
	import { Observable } from '../Observable';
	import { SchedulerLike } from '../types';
	/**
	 * The same Observable instance returned by any call to {@link empty} without a
	 * `scheduler`. It is preferrable to use this over `empty()`.
	 */
	export const EMPTY: Observable<never>;
	/**
	 * Creates an Observable that emits no items to the Observer and immediately
	 * emits a complete notification.
	 *
	 * <span class="informal">Just emits 'complete', and nothing else.
	 * </span>
	 *
	 * ![](empty.png)
	 *
	 * This static operator is useful for creating a simple Observable that only
	 * emits the complete notification. It can be used for composing with other
	 * Observables, such as in a {@link mergeMap}.
	 *
	 * ## Examples
	 * ### Emit the number 7, then complete
	 * ```ts
	 * import { empty } from 'rxjs';
	 * import { startWith } from 'rxjs/operators';
	 *
	 * const result = empty().pipe(startWith(7));
	 * result.subscribe(x => console.log(x));
	 * ```
	 *
	 * ### Map and flatten only odd numbers to the sequence 'a', 'b', 'c'
	 * ```ts
	 * import { empty, interval } from 'rxjs';
	 * import { mergeMap } from 'rxjs/operators';
	 *
	 * const interval$ = interval(1000);
	 * result = interval$.pipe(
	 *   mergeMap(x => x % 2 === 1 ? of('a', 'b', 'c') : empty()),
	 * );
	 * result.subscribe(x => console.log(x));
	 *
	 * // Results in the following to the console:
	 * // x is equal to the count on the interval eg(0,1,2,3,...)
	 * // x will occur every 1000ms
	 * // if x % 2 is equal to 1 print abc
	 * // if x % 2 is not equal to 1 nothing will be output
	 * ```
	 *
	 * @see {@link Observable}
	 * @see {@link never}
	 * @see {@link of}
	 * @see {@link throwError}
	 *
	 * @param scheduler A {@link SchedulerLike} to use for scheduling
	 * the emission of the complete notification.
	 * @return An "empty" Observable: emits only the complete
	 * notification.
	 * @deprecated Deprecated in favor of using {@link EMPTY} constant, or {@link scheduled} (e.g. `scheduled([], scheduler)`)
	 */
	export function empty(scheduler?: SchedulerLike): Observable<never>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/forkJoin' {
	import { Observable } from '../Observable';
	import { ObservableInput, ObservedValuesFromArray, ObservedValueOf, SubscribableOrPromise } from '../types';
	/** @deprecated Use the version that takes an array of Observables instead */
	export function forkJoin<T>(v1: SubscribableOrPromise<T>): Observable<[T]>;
	/** @deprecated Use the version that takes an array of Observables instead */
	export function forkJoin<T, T2>(v1: ObservableInput<T>, v2: ObservableInput<T2>): Observable<[T, T2]>;
	/** @deprecated Use the version that takes an array of Observables instead */
	export function forkJoin<T, T2, T3>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>): Observable<[T, T2, T3]>;
	/** @deprecated Use the version that takes an array of Observables instead */
	export function forkJoin<T, T2, T3, T4>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>): Observable<[T, T2, T3, T4]>;
	/** @deprecated Use the version that takes an array of Observables instead */
	export function forkJoin<T, T2, T3, T4, T5>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>): Observable<[T, T2, T3, T4, T5]>;
	/** @deprecated Use the version that takes an array of Observables instead */
	export function forkJoin<T, T2, T3, T4, T5, T6>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>): Observable<[T, T2, T3, T4, T5, T6]>;
	export function forkJoin<A>(sources: [ObservableInput<A>]): Observable<[A]>;
	export function forkJoin<A, B>(sources: [ObservableInput<A>, ObservableInput<B>]): Observable<[A, B]>;
	export function forkJoin<A, B, C>(sources: [ObservableInput<A>, ObservableInput<B>, ObservableInput<C>]): Observable<[A, B, C]>;
	export function forkJoin<A, B, C, D>(sources: [ObservableInput<A>, ObservableInput<B>, ObservableInput<C>, ObservableInput<D>]): Observable<[A, B, C, D]>;
	export function forkJoin<A, B, C, D, E>(sources: [ObservableInput<A>, ObservableInput<B>, ObservableInput<C>, ObservableInput<D>, ObservableInput<E>]): Observable<[A, B, C, D, E]>;
	export function forkJoin<A, B, C, D, E, F>(sources: [ObservableInput<A>, ObservableInput<B>, ObservableInput<C>, ObservableInput<D>, ObservableInput<E>, ObservableInput<F>]): Observable<[A, B, C, D, E, F]>;
	export function forkJoin<A extends ObservableInput<any>[]>(sources: A): Observable<ObservedValuesFromArray<A>[]>;
	export function forkJoin(sourcesObject: {}): Observable<never>;
	export function forkJoin<T, K extends keyof T>(sourcesObject: T): Observable<{
	    [K in keyof T]: ObservedValueOf<T[K]>;
	}>;
	/** @deprecated resultSelector is deprecated, pipe to map instead */
	export function forkJoin(...args: Array<ObservableInput<any> | Function>): Observable<any>;
	/** @deprecated Use the version that takes an array of Observables instead */
	export function forkJoin<T>(...sources: ObservableInput<T>[]): Observable<T[]>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/from' {
	import { Observable } from '../Observable';
	import { ObservableInput, SchedulerLike, ObservedValueOf } from '../types';
	export function from<O extends ObservableInput<any>>(input: O): Observable<ObservedValueOf<O>>;
	/** @deprecated use {@link scheduled} instead. */
	export function from<O extends ObservableInput<any>>(input: O, scheduler: SchedulerLike): Observable<ObservedValueOf<O>>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/fromEvent' {
	import { Observable } from '../Observable';
	export interface NodeStyleEventEmitter {
	    addListener: (eventName: string | symbol, handler: NodeEventHandler) => this;
	    removeListener: (eventName: string | symbol, handler: NodeEventHandler) => this;
	}
	export type NodeEventHandler = (...args: any[]) => void;
	export interface NodeCompatibleEventEmitter {
	    addListener: (eventName: string, handler: NodeEventHandler) => void | {};
	    removeListener: (eventName: string, handler: NodeEventHandler) => void | {};
	}
	export interface JQueryStyleEventEmitter {
	    on: (eventName: string, handler: Function) => void;
	    off: (eventName: string, handler: Function) => void;
	}
	export interface HasEventTargetAddRemove<E> {
	    addEventListener(type: string, listener: ((evt: E) => void) | null, options?: boolean | AddEventListenerOptions): void;
	    removeEventListener(type: string, listener?: ((evt: E) => void) | null, options?: EventListenerOptions | boolean): void;
	}
	export type EventTargetLike<T> = HasEventTargetAddRemove<T> | NodeStyleEventEmitter | NodeCompatibleEventEmitter | JQueryStyleEventEmitter;
	export type FromEventTarget<T> = EventTargetLike<T> | ArrayLike<EventTargetLike<T>>;
	export interface EventListenerOptions {
	    capture?: boolean;
	    passive?: boolean;
	    once?: boolean;
	}
	export interface AddEventListenerOptions extends EventListenerOptions {
	    once?: boolean;
	    passive?: boolean;
	}
	export function fromEvent<T>(target: FromEventTarget<T>, eventName: string): Observable<T>;
	/** @deprecated resultSelector no longer supported, pipe to map instead */
	export function fromEvent<T>(target: FromEventTarget<T>, eventName: string, resultSelector: (...args: any[]) => T): Observable<T>;
	export function fromEvent<T>(target: FromEventTarget<T>, eventName: string, options: EventListenerOptions): Observable<T>;
	/** @deprecated resultSelector no longer supported, pipe to map instead */
	export function fromEvent<T>(target: FromEventTarget<T>, eventName: string, options: EventListenerOptions, resultSelector: (...args: any[]) => T): Observable<T>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/fromEventPattern' {
	import { Observable } from '../Observable';
	import { NodeEventHandler } from './fromEvent';
	export function fromEventPattern<T>(addHandler: (handler: NodeEventHandler) => any, removeHandler?: (handler: NodeEventHandler, signal?: any) => void): Observable<T>;
	/** @deprecated resultSelector no longer supported, pipe to map instead */
	export function fromEventPattern<T>(addHandler: (handler: NodeEventHandler) => any, removeHandler?: (handler: NodeEventHandler, signal?: any) => void, resultSelector?: (...args: any[]) => T): Observable<T>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/generate' {
	import { Observable } from '../Observable';
	import { SchedulerLike } from '../types';
	export type ConditionFunc<S> = (state: S) => boolean;
	export type IterateFunc<S> = (state: S) => S;
	export type ResultFunc<S, T> = (state: S) => T;
	export interface GenerateBaseOptions<S> {
	    /**
	     * Initial state.
	     */
	    initialState: S;
	    /**
	     * Condition function that accepts state and returns boolean.
	     * When it returns false, the generator stops.
	     * If not specified, a generator never stops.
	     */
	    condition?: ConditionFunc<S>;
	    /**
	     * Iterate function that accepts state and returns new state.
	     */
	    iterate: IterateFunc<S>;
	    /**
	     * SchedulerLike to use for generation process.
	     * By default, a generator starts immediately.
	     */
	    scheduler?: SchedulerLike;
	}
	export interface GenerateOptions<T, S> extends GenerateBaseOptions<S> {
	    /**
	     * Result selection function that accepts state and returns a value to emit.
	     */
	    resultSelector: ResultFunc<S, T>;
	}
	/**
	 * Generates an observable sequence by running a state-driven loop
	 * producing the sequence's elements, using the specified scheduler
	 * to send out observer messages.
	 *
	 * ![](generate.png)
	 *
	 * @example <caption>Produces sequence of 0, 1, 2, ... 9, then completes.</caption>
	 * const res = generate(0, x => x < 10, x => x + 1, x => x);
	 *
	 * @example <caption>Using asap scheduler, produces sequence of 2, 3, 5, then completes.</caption>
	 * const res = generate(1, x => x < 5, x => x * 2, x => x + 1, asap);
	 *
	 * @see {@link from}
	 * @see {@link Observable}
	 *
	 * @param {S} initialState Initial state.
	 * @param {function (state: S): boolean} condition Condition to terminate generation (upon returning false).
	 * @param {function (state: S): S} iterate Iteration step function.
	 * @param {function (state: S): T} resultSelector Selector function for results produced in the sequence. (deprecated)
	 * @param {SchedulerLike} [scheduler] A {@link SchedulerLike} on which to run the generator loop. If not provided, defaults to emit immediately.
	 * @returns {Observable<T>} The generated sequence.
	 */
	export function generate<T, S>(initialState: S, condition: ConditionFunc<S>, iterate: IterateFunc<S>, resultSelector: ResultFunc<S, T>, scheduler?: SchedulerLike): Observable<T>;
	/**
	 * Generates an Observable by running a state-driven loop
	 * that emits an element on each iteration.
	 *
	 * <span class="informal">Use it instead of nexting values in a for loop.</span>
	 *
	 * <img src="./img/generate.png" width="100%">
	 *
	 * `generate` allows you to create stream of values generated with a loop very similar to
	 * traditional for loop. First argument of `generate` is a beginning value. Second argument
	 * is a function that accepts this value and tests if some condition still holds. If it does,
	 * loop continues, if not, it stops. Third value is a function which takes previously defined
	 * value and modifies it in some way on each iteration. Note how these three parameters
	 * are direct equivalents of three expressions in regular for loop: first expression
	 * initializes some state (for example numeric index), second tests if loop can make next
	 * iteration (for example if index is lower than 10) and third states how defined value
	 * will be modified on every step (index will be incremented by one).
	 *
	 * Return value of a `generate` operator is an Observable that on each loop iteration
	 * emits a value. First, condition function is ran. If it returned true, Observable
	 * emits currently stored value (initial value at the first iteration) and then updates
	 * that value with iterate function. If at some point condition returned false, Observable
	 * completes at that moment.
	 *
	 * Optionally you can pass fourth parameter to `generate` - a result selector function which allows you
	 * to immediately map value that would normally be emitted by an Observable.
	 *
	 * If you find three anonymous functions in `generate` call hard to read, you can provide
	 * single object to the operator instead. That object has properties: `initialState`,
	 * `condition`, `iterate` and `resultSelector`, which should have respective values that you
	 * would normally pass to `generate`. `resultSelector` is still optional, but that form
	 * of calling `generate` allows you to omit `condition` as well. If you omit it, that means
	 * condition always holds, so output Observable will never complete.
	 *
	 * Both forms of `generate` can optionally accept a scheduler. In case of multi-parameter call,
	 * scheduler simply comes as a last argument (no matter if there is resultSelector
	 * function or not). In case of single-parameter call, you can provide it as a
	 * `scheduler` property on object passed to the operator. In both cases scheduler decides when
	 * next iteration of the loop will happen and therefore when next value will be emitted
	 * by the Observable. For example to ensure that each value is pushed to the observer
	 * on separate task in event loop, you could use `async` scheduler. Note that
	 * by default (when no scheduler is passed) values are simply emitted synchronously.
	 *
	 *
	 * @example <caption>Use with condition and iterate functions.</caption>
	 * const generated = generate(0, x => x < 3, x => x + 1);
	 *
	 * generated.subscribe(
	 *   value => console.log(value),
	 *   err => {},
	 *   () => console.log('Yo!')
	 * );
	 *
	 * // Logs:
	 * // 0
	 * // 1
	 * // 2
	 * // "Yo!"
	 *
	 *
	 * @example <caption>Use with condition, iterate and resultSelector functions.</caption>
	 * const generated = generate(0, x => x < 3, x => x + 1, x => x * 1000);
	 *
	 * generated.subscribe(
	 *   value => console.log(value),
	 *   err => {},
	 *   () => console.log('Yo!')
	 * );
	 *
	 * // Logs:
	 * // 0
	 * // 1000
	 * // 2000
	 * // "Yo!"
	 *
	 *
	 * @example <caption>Use with options object.</caption>
	 * const generated = generate({
	 *   initialState: 0,
	 *   condition(value) { return value < 3; },
	 *   iterate(value) { return value + 1; },
	 *   resultSelector(value) { return value * 1000; }
	 * });
	 *
	 * generated.subscribe(
	 *   value => console.log(value),
	 *   err => {},
	 *   () => console.log('Yo!')
	 * );
	 *
	 * // Logs:
	 * // 0
	 * // 1000
	 * // 2000
	 * // "Yo!"
	 *
	 * @example <caption>Use options object without condition function.</caption>
	 * const generated = generate({
	 *   initialState: 0,
	 *   iterate(value) { return value + 1; },
	 *   resultSelector(value) { return value * 1000; }
	 * });
	 *
	 * generated.subscribe(
	 *   value => console.log(value),
	 *   err => {},
	 *   () => console.log('Yo!') // This will never run.
	 * );
	 *
	 * // Logs:
	 * // 0
	 * // 1000
	 * // 2000
	 * // 3000
	 * // ...and never stops.
	 *
	 *
	 * @see {@link from}
	 * @see {@link index/Observable.create}
	 *
	 * @param {S} initialState Initial state.
	 * @param {function (state: S): boolean} condition Condition to terminate generation (upon returning false).
	 * @param {function (state: S): S} iterate Iteration step function.
	 * @param {function (state: S): T} [resultSelector] Selector function for results produced in the sequence.
	 * @param {Scheduler} [scheduler] A {@link Scheduler} on which to run the generator loop. If not provided, defaults to emitting immediately.
	 * @return {Observable<T>} The generated sequence.
	 */
	export function generate<S>(initialState: S, condition: ConditionFunc<S>, iterate: IterateFunc<S>, scheduler?: SchedulerLike): Observable<S>;
	/**
	 * Generates an observable sequence by running a state-driven loop
	 * producing the sequence's elements, using the specified scheduler
	 * to send out observer messages.
	 * The overload accepts options object that might contain initial state, iterate,
	 * condition and scheduler.
	 *
	 * ![](generate.png)
	 *
	 * @example <caption>Produces sequence of 0, 1, 2, ... 9, then completes.</caption>
	 * const res = generate({
	 *   initialState: 0,
	 *   condition: x => x < 10,
	 *   iterate: x => x + 1,
	 * });
	 *
	 * @see {@link from}
	 * @see {@link Observable}
	 *
	 * @param {GenerateBaseOptions<S>} options Object that must contain initialState, iterate and might contain condition and scheduler.
	 * @returns {Observable<S>} The generated sequence.
	 */
	export function generate<S>(options: GenerateBaseOptions<S>): Observable<S>;
	/**
	 * Generates an observable sequence by running a state-driven loop
	 * producing the sequence's elements, using the specified scheduler
	 * to send out observer messages.
	 * The overload accepts options object that might contain initial state, iterate,
	 * condition, result selector and scheduler.
	 *
	 * ![](generate.png)
	 *
	 * @example <caption>Produces sequence of 0, 1, 2, ... 9, then completes.</caption>
	 * const res = generate({
	 *   initialState: 0,
	 *   condition: x => x < 10,
	 *   iterate: x => x + 1,
	 *   resultSelector: x => x,
	 * });
	 *
	 * @see {@link from}
	 * @see {@link Observable}
	 *
	 * @param {GenerateOptions<T, S>} options Object that must contain initialState, iterate, resultSelector and might contain condition and scheduler.
	 * @returns {Observable<T>} The generated sequence.
	 */
	export function generate<T, S>(options: GenerateOptions<T, S>): Observable<T>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/interval' {
	import { Observable } from '../Observable';
	import { SchedulerLike } from '../types';
	/**
	 * Creates an Observable that emits sequential numbers every specified
	 * interval of time, on a specified {@link SchedulerLike}.
	 *
	 * <span class="informal">Emits incremental numbers periodically in time.
	 * </span>
	 *
	 * ![](interval.png)
	 *
	 * `interval` returns an Observable that emits an infinite sequence of
	 * ascending integers, with a constant interval of time of your choosing
	 * between those emissions. The first emission is not sent immediately, but
	 * only after the first period has passed. By default, this operator uses the
	 * `async` {@link SchedulerLike} to provide a notion of time, but you may pass any
	 * {@link SchedulerLike} to it.
	 *
	 * ## Example
	 * Emits ascending numbers, one every second (1000ms) up to the number 3
	 * ```ts
	 * import { interval } from 'rxjs';
	 * import { take } from 'rxjs/operators';
	 *
	 * const numbers = interval(1000);
	 *
	 * const takeFourNumbers = numbers.pipe(take(4));
	 *
	 * takeFourNumbers.subscribe(x => console.log('Next: ', x));
	 *
	 * // Logs:
	 * // Next: 0
	 * // Next: 1
	 * // Next: 2
	 * // Next: 3
	 * ```
	 *
	 * @see {@link timer}
	 * @see {@link delay}
	 *
	 * @param {number} [period=0] The interval size in milliseconds (by default)
	 * or the time unit determined by the scheduler's clock.
	 * @param {SchedulerLike} [scheduler=async] The {@link SchedulerLike} to use for scheduling
	 * the emission of values, and providing a notion of "time".
	 * @return {Observable} An Observable that emits a sequential number each time
	 * interval.
	 * @static true
	 * @name interval
	 * @owner Observable
	 */
	export function interval(period?: number, scheduler?: SchedulerLike): Observable<number>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/merge' {
	import { Observable } from '../Observable';
	import { ObservableInput, SchedulerLike } from '../types';
	/** @deprecated use {@link scheduled} and {@link mergeAll} (e.g. `scheduled([ob1, ob2, ob3], scheduled).pipe(mergeAll())*/
	export function merge<T>(v1: ObservableInput<T>, scheduler: SchedulerLike): Observable<T>;
	/** @deprecated use {@link scheduled} and {@link mergeAll} (e.g. `scheduled([ob1, ob2, ob3], scheduled).pipe(mergeAll())*/
	export function merge<T>(v1: ObservableInput<T>, concurrent: number, scheduler: SchedulerLike): Observable<T>;
	/** @deprecated use {@link scheduled} and {@link mergeAll} (e.g. `scheduled([ob1, ob2, ob3], scheduled).pipe(mergeAll())*/
	export function merge<T, T2>(v1: ObservableInput<T>, v2: ObservableInput<T2>, scheduler: SchedulerLike): Observable<T | T2>;
	/** @deprecated use {@link scheduled} and {@link mergeAll} (e.g. `scheduled([ob1, ob2, ob3], scheduled).pipe(mergeAll())*/
	export function merge<T, T2>(v1: ObservableInput<T>, v2: ObservableInput<T2>, concurrent: number, scheduler: SchedulerLike): Observable<T | T2>;
	/** @deprecated use {@link scheduled} and {@link mergeAll} (e.g. `scheduled([ob1, ob2, ob3], scheduled).pipe(mergeAll())*/
	export function merge<T, T2, T3>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, scheduler: SchedulerLike): Observable<T | T2 | T3>;
	/** @deprecated use {@link scheduled} and {@link mergeAll} (e.g. `scheduled([ob1, ob2, ob3], scheduled).pipe(mergeAll())*/
	export function merge<T, T2, T3>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, concurrent: number, scheduler: SchedulerLike): Observable<T | T2 | T3>;
	/** @deprecated use {@link scheduled} and {@link mergeAll} (e.g. `scheduled([ob1, ob2, ob3], scheduled).pipe(mergeAll())*/
	export function merge<T, T2, T3, T4>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, scheduler: SchedulerLike): Observable<T | T2 | T3 | T4>;
	/** @deprecated use {@link scheduled} and {@link mergeAll} (e.g. `scheduled([ob1, ob2, ob3], scheduled).pipe(mergeAll())*/
	export function merge<T, T2, T3, T4>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, concurrent: number, scheduler: SchedulerLike): Observable<T | T2 | T3 | T4>;
	/** @deprecated use {@link scheduled} and {@link mergeAll} (e.g. `scheduled([ob1, ob2, ob3], scheduled).pipe(mergeAll())*/
	export function merge<T, T2, T3, T4, T5>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, scheduler: SchedulerLike): Observable<T | T2 | T3 | T4 | T5>;
	/** @deprecated use {@link scheduled} and {@link mergeAll} (e.g. `scheduled([ob1, ob2, ob3], scheduled).pipe(mergeAll())*/
	export function merge<T, T2, T3, T4, T5>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, concurrent: number, scheduler: SchedulerLike): Observable<T | T2 | T3 | T4 | T5>;
	/** @deprecated use {@link scheduled} and {@link mergeAll} (e.g. `scheduled([ob1, ob2, ob3], scheduled).pipe(mergeAll())*/
	export function merge<T, T2, T3, T4, T5, T6>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, scheduler: SchedulerLike): Observable<T | T2 | T3 | T4 | T5 | T6>;
	/** @deprecated use {@link scheduled} and {@link mergeAll} (e.g. `scheduled([ob1, ob2, ob3], scheduled).pipe(mergeAll())*/
	export function merge<T, T2, T3, T4, T5, T6>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, concurrent: number, scheduler: SchedulerLike): Observable<T | T2 | T3 | T4 | T5 | T6>;
	export function merge<T>(v1: ObservableInput<T>): Observable<T>;
	export function merge<T>(v1: ObservableInput<T>, concurrent?: number): Observable<T>;
	export function merge<T, T2>(v1: ObservableInput<T>, v2: ObservableInput<T2>): Observable<T | T2>;
	export function merge<T, T2>(v1: ObservableInput<T>, v2: ObservableInput<T2>, concurrent?: number): Observable<T | T2>;
	export function merge<T, T2, T3>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>): Observable<T | T2 | T3>;
	export function merge<T, T2, T3>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, concurrent?: number): Observable<T | T2 | T3>;
	export function merge<T, T2, T3, T4>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>): Observable<T | T2 | T3 | T4>;
	export function merge<T, T2, T3, T4>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, concurrent?: number): Observable<T | T2 | T3 | T4>;
	export function merge<T, T2, T3, T4, T5>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>): Observable<T | T2 | T3 | T4 | T5>;
	export function merge<T, T2, T3, T4, T5>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, concurrent?: number): Observable<T | T2 | T3 | T4 | T5>;
	export function merge<T, T2, T3, T4, T5, T6>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>): Observable<T | T2 | T3 | T4 | T5 | T6>;
	export function merge<T, T2, T3, T4, T5, T6>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, concurrent?: number): Observable<T | T2 | T3 | T4 | T5 | T6>;
	export function merge<T>(...observables: (ObservableInput<T> | number)[]): Observable<T>;
	/** @deprecated use {@link scheduled} and {@link mergeAll} (e.g. `scheduled([ob1, ob2, ob3], scheduled).pipe(mergeAll())*/
	export function merge<T>(...observables: (ObservableInput<T> | SchedulerLike | number)[]): Observable<T>;
	export function merge<T, R>(...observables: (ObservableInput<any> | number)[]): Observable<R>;
	/** @deprecated use {@link scheduled} and {@link mergeAll} (e.g. `scheduled([ob1, ob2, ob3], scheduled).pipe(mergeAll())*/
	export function merge<T, R>(...observables: (ObservableInput<any> | SchedulerLike | number)[]): Observable<R>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/never' {
	import { Observable } from '../Observable';
	/**
	 * An Observable that emits no items to the Observer and never completes.
	 *
	 * ![](never.png)
	 *
	 * A simple Observable that emits neither values nor errors nor the completion
	 * notification. It can be used for testing purposes or for composing with other
	 * Observables. Please note that by never emitting a complete notification, this
	 * Observable keeps the subscription from being disposed automatically.
	 * Subscriptions need to be manually disposed.
	 *
	 * ##  Example
	 * ### Emit the number 7, then never emit anything else (not even complete)
	 * ```ts
	 * import { NEVER } from 'rxjs';
	 * import { startWith } from 'rxjs/operators';
	 *
	 * function info() {
	 *   console.log('Will not be called');
	 * }
	 * const result = NEVER.pipe(startWith(7));
	 * result.subscribe(x => console.log(x), info, info);
	 *
	 * ```
	 *
	 * @see {@link Observable}
	 * @see {@link index/EMPTY}
	 * @see {@link of}
	 * @see {@link throwError}
	 */
	export const NEVER: Observable<never>;
	/**
	 * @deprecated Deprecated in favor of using {@link NEVER} constant.
	 */
	export function never(): Observable<never>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/of' {
	import { SchedulerLike } from '../types';
	import { Observable } from '../Observable';
	/** @deprecated use {@link scheduled} instead `scheduled([a, b, c], scheduler)` */
	export function of<T>(a: T, scheduler: SchedulerLike): Observable<T>;
	/** @deprecated use {@link scheduled} instead `scheduled([a, b, c], scheduler)` */
	export function of<T, T2>(a: T, b: T2, scheduler: SchedulerLike): Observable<T | T2>;
	/** @deprecated use {@link scheduled} instead `scheduled([a, b, c], scheduler)` */
	export function of<T, T2, T3>(a: T, b: T2, c: T3, scheduler: SchedulerLike): Observable<T | T2 | T3>;
	/** @deprecated use {@link scheduled} instead `scheduled([a, b, c], scheduler)` */
	export function of<T, T2, T3, T4>(a: T, b: T2, c: T3, d: T4, scheduler: SchedulerLike): Observable<T | T2 | T3 | T4>;
	/** @deprecated use {@link scheduled} instead `scheduled([a, b, c], scheduler)` */
	export function of<T, T2, T3, T4, T5>(a: T, b: T2, c: T3, d: T4, e: T5, scheduler: SchedulerLike): Observable<T | T2 | T3 | T4 | T5>;
	/** @deprecated use {@link scheduled} instead `scheduled([a, b, c], scheduler)` */
	export function of<T, T2, T3, T4, T5, T6>(a: T, b: T2, c: T3, d: T4, e: T5, f: T6, scheduler: SchedulerLike): Observable<T | T2 | T3 | T4 | T5 | T6>;
	/** @deprecated use {@link scheduled} instead `scheduled([a, b, c], scheduler)` */
	export function of<T, T2, T3, T4, T5, T6, T7>(a: T, b: T2, c: T3, d: T4, e: T5, f: T6, g: T7, scheduler: SchedulerLike): Observable<T | T2 | T3 | T4 | T5 | T6 | T7>;
	/** @deprecated use {@link scheduled} instead `scheduled([a, b, c], scheduler)` */
	export function of<T, T2, T3, T4, T5, T6, T7, T8>(a: T, b: T2, c: T3, d: T4, e: T5, f: T6, g: T7, h: T8, scheduler: SchedulerLike): Observable<T | T2 | T3 | T4 | T5 | T6 | T7 | T8>;
	/** @deprecated use {@link scheduled} instead `scheduled([a, b, c], scheduler)` */
	export function of<T, T2, T3, T4, T5, T6, T7, T8, T9>(a: T, b: T2, c: T3, d: T4, e: T5, f: T6, g: T7, h: T8, i: T9, scheduler: SchedulerLike): Observable<T | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>;
	export function of<T>(...args: (T | SchedulerLike)[]): Observable<T>;
	export function of<T>(a: T): Observable<T>;
	export function of<T, T2>(a: T, b: T2): Observable<T | T2>;
	export function of<T, T2, T3>(a: T, b: T2, c: T3): Observable<T | T2 | T3>;
	export function of<T, T2, T3, T4>(a: T, b: T2, c: T3, d: T4): Observable<T | T2 | T3 | T4>;
	export function of<T, T2, T3, T4, T5>(a: T, b: T2, c: T3, d: T4, e: T5): Observable<T | T2 | T3 | T4 | T5>;
	export function of<T, T2, T3, T4, T5, T6>(a: T, b: T2, c: T3, d: T4, e: T5, f: T6): Observable<T | T2 | T3 | T4 | T5 | T6>;
	export function of<T, T2, T3, T4, T5, T6, T7>(a: T, b: T2, c: T3, d: T4, e: T5, f: T6, g: T7): Observable<T | T2 | T3 | T4 | T5 | T6 | T7>;
	export function of<T, T2, T3, T4, T5, T6, T7, T8>(a: T, b: T2, c: T3, d: T4, e: T5, f: T6, g: T7, h: T8): Observable<T | T2 | T3 | T4 | T5 | T6 | T7 | T8>;
	export function of<T, T2, T3, T4, T5, T6, T7, T8, T9>(a: T, b: T2, c: T3, d: T4, e: T5, f: T6, g: T7, h: T8, i: T9): Observable<T | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>;
	export function of<T>(...args: T[]): Observable<T>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/onErrorResumeNext' {
	import { Observable } from '../Observable';
	import { ObservableInput } from '../types';
	export function onErrorResumeNext<R>(v: ObservableInput<R>): Observable<R>;
	export function onErrorResumeNext<T2, T3, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>): Observable<R>;
	export function onErrorResumeNext<T2, T3, T4, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>): Observable<R>;
	export function onErrorResumeNext<T2, T3, T4, T5, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>): Observable<R>;
	export function onErrorResumeNext<T2, T3, T4, T5, T6, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>): Observable<R>;
	export function onErrorResumeNext<R>(...observables: Array<ObservableInput<any> | ((...values: Array<any>) => R)>): Observable<R>;
	export function onErrorResumeNext<R>(array: ObservableInput<any>[]): Observable<R>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/pairs' {
	import { Observable } from '../Observable';
	import { SchedulerAction, SchedulerLike } from '../types';
	import { Subscriber } from '../Subscriber';
	import { Subscription } from '../Subscription';
	/**
	 * Convert an object into an Observable of `[key, value]` pairs.
	 *
	 * <span class="informal">Turn entries of an object into a stream.</span>
	 *
	 * <img src="./img/pairs.png" width="100%">
	 *
	 * `pairs` takes an arbitrary object and returns an Observable that emits arrays. Each
	 * emitted array has exactly two elements - the first is a key from the object
	 * and the second is a value corresponding to that key. Keys are extracted from
	 * an object via `Object.keys` function, which means that they will be only
	 * enumerable keys that are present on an object directly - not ones inherited
	 * via prototype chain.
	 *
	 * By default these arrays are emitted synchronously. To change that you can
	 * pass a {@link SchedulerLike} as a second argument to `pairs`.
	 *
	 * @example <caption>Converts a javascript object to an Observable</caption>
	 * ```ts
	 * import { pairs } from 'rxjs';
	 *
	 * const obj = {
	 *   foo: 42,
	 *   bar: 56,
	 *   baz: 78
	 * };
	 *
	 * pairs(obj)
	 * .subscribe(
	 *   value => console.log(value),
	 *   err => {},
	 *   () => console.log('the end!')
	 * );
	 *
	 * // Logs:
	 * // ["foo", 42],
	 * // ["bar", 56],
	 * // ["baz", 78],
	 * // "the end!"
	 * ```
	 *
	 * @param {Object} obj The object to inspect and turn into an
	 * Observable sequence.
	 * @param {Scheduler} [scheduler] An optional IScheduler to schedule
	 * when resulting Observable will emit values.
	 * @returns {(Observable<Array<string|T>>)} An observable sequence of
	 * [key, value] pairs from the object.
	 */
	export function pairs<T>(obj: Object, scheduler?: SchedulerLike): Observable<[string, T]>;
	/** @internal */
	export function dispatch<T>(this: SchedulerAction<any>, state: {
	    keys: string[];
	    index: number;
	    subscriber: Subscriber<[string, T]>;
	    subscription: Subscription;
	    obj: Object;
	}): void;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/partition' {
	import { ObservableInput } from '../types';
	import { Observable } from '../Observable';
	/**
	 * Splits the source Observable into two, one with values that satisfy a
	 * predicate, and another with values that don't satisfy the predicate.
	 *
	 * <span class="informal">It's like {@link filter}, but returns two Observables:
	 * one like the output of {@link filter}, and the other with values that did not
	 * pass the condition.</span>
	 *
	 * ![](partition.png)
	 *
	 * `partition` outputs an array with two Observables that partition the values
	 * from the source Observable through the given `predicate` function. The first
	 * Observable in that array emits source values for which the predicate argument
	 * returns true. The second Observable emits source values for which the
	 * predicate returns false. The first behaves like {@link filter} and the second
	 * behaves like {@link filter} with the predicate negated.
	 *
	 * ## Example
	 * Partition a set of numbers into odds and evens observables
	 * ```ts
	 * import { of, partition } from 'rxjs';
	 *
	 * const observableValues = of(1, 2, 3, 4, 5, 6);
	 * const [evens$, odds$] = partition(observableValues, (value, index) => value % 2 === 0);
	 *
	 * odds$.subscribe(x => console.log('odds', x));
	 * evens$.subscribe(x => console.log('evens', x));
	 *
	 * // Logs:
	 * // odds 1
	 * // odds 3
	 * // odds 5
	 * // evens 2
	 * // evens 4
	 * // evens 6
	 * ```
	 *
	 * @see {@link filter}
	 *
	 * @param {function(value: T, index: number): boolean} predicate A function that
	 * evaluates each value emitted by the source Observable. If it returns `true`,
	 * the value is emitted on the first Observable in the returned array, if
	 * `false` the value is emitted on the second Observable in the array. The
	 * `index` parameter is the number `i` for the i-th source emission that has
	 * happened since the subscription, starting from the number `0`.
	 * @param {any} [thisArg] An optional argument to determine the value of `this`
	 * in the `predicate` function.
	 * @return {[Observable<T>, Observable<T>]} An array with two Observables: one
	 * with values that passed the predicate, and another with values that did not
	 * pass the predicate.
	 */
	export function partition<T>(source: ObservableInput<T>, predicate: (value: T, index: number) => boolean, thisArg?: any): [Observable<T>, Observable<T>];

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/race' {
	import { Observable } from '../Observable';
	import { Operator } from '../Operator';
	import { Subscriber } from '../Subscriber';
	import { TeardownLogic, ObservableInput } from '../types';
	import { OuterSubscriber } from '../OuterSubscriber';
	import { InnerSubscriber } from '../InnerSubscriber';
	export function race<A>(arg: [ObservableInput<A>]): Observable<A>;
	export function race<A, B>(arg: [ObservableInput<A>, ObservableInput<B>]): Observable<A | B>;
	export function race<A, B, C>(arg: [ObservableInput<A>, ObservableInput<B>, ObservableInput<C>]): Observable<A | B | C>;
	export function race<A, B, C, D>(arg: [ObservableInput<A>, ObservableInput<B>, ObservableInput<C>, ObservableInput<D>]): Observable<A | B | C | D>;
	export function race<A, B, C, D, E>(arg: [ObservableInput<A>, ObservableInput<B>, ObservableInput<C>, ObservableInput<D>, ObservableInput<E>]): Observable<A | B | C | D | E>;
	export function race<T>(arg: ObservableInput<T>[]): Observable<T>;
	export function race(arg: ObservableInput<any>[]): Observable<{}>;
	export function race<A>(a: ObservableInput<A>): Observable<A>;
	export function race<A, B>(a: ObservableInput<A>, b: ObservableInput<B>): Observable<A | B>;
	export function race<A, B, C>(a: ObservableInput<A>, b: ObservableInput<B>, c: ObservableInput<C>): Observable<A | B | C>;
	export function race<A, B, C, D>(a: ObservableInput<A>, b: ObservableInput<B>, c: ObservableInput<C>, d: ObservableInput<D>): Observable<A | B | C | D>;
	export function race<A, B, C, D, E>(a: ObservableInput<A>, b: ObservableInput<B>, c: ObservableInput<C>, d: ObservableInput<D>, e: ObservableInput<E>): Observable<A | B | C | D | E>;
	export function race<T>(observables: ObservableInput<T>[]): Observable<T>;
	export function race(observables: ObservableInput<any>[]): Observable<{}>;
	export function race<T>(...observables: ObservableInput<T>[]): Observable<T>;
	export function race(...observables: ObservableInput<any>[]): Observable<{}>;
	export class RaceOperator<T> implements Operator<T, T> {
	    call(subscriber: Subscriber<T>, source: any): TeardownLogic;
	}
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	export class RaceSubscriber<T> extends OuterSubscriber<T, T> {
	    private hasFirst;
	    private observables;
	    private subscriptions;
	    constructor(destination: Subscriber<T>);
	    protected _next(observable: any): void;
	    protected _complete(): void;
	    notifyNext(outerValue: T, innerValue: T, outerIndex: number, innerIndex: number, innerSub: InnerSubscriber<T, T>): void;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/range' {
	import { SchedulerAction, SchedulerLike } from '../types';
	import { Observable } from '../Observable';
	/**
	 * Creates an Observable that emits a sequence of numbers within a specified
	 * range.
	 *
	 * <span class="informal">Emits a sequence of numbers in a range.</span>
	 *
	 * ![](range.png)
	 *
	 * `range` operator emits a range of sequential integers, in order, where you
	 * select the `start` of the range and its `length`. By default, uses no
	 * {@link SchedulerLike} and just delivers the notifications synchronously, but may use
	 * an optional {@link SchedulerLike} to regulate those deliveries.
	 *
	 * ## Example
	 * Emits the numbers 1 to 10</caption>
	 * ```ts
	 * import { range } from 'rxjs';
	 *
	 * const numbers = range(1, 10);
	 * numbers.subscribe(x => console.log(x));
	 * ```
	 * @see {@link timer}
	 * @see {@link index/interval}
	 *
	 * @param {number} [start=0] The value of the first integer in the sequence.
	 * @param {number} count The number of sequential integers to generate.
	 * @param {SchedulerLike} [scheduler] A {@link SchedulerLike} to use for scheduling
	 * the emissions of the notifications.
	 * @return {Observable} An Observable of numbers that emits a finite range of
	 * sequential integers.
	 * @static true
	 * @name range
	 * @owner Observable
	 */
	export function range(start?: number, count?: number, scheduler?: SchedulerLike): Observable<number>;
	/** @internal */
	export function dispatch(this: SchedulerAction<any>, state: any): void;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/timer' {
	import { Observable } from '../Observable';
	import { SchedulerLike } from '../types';
	/**
	 * Creates an Observable that starts emitting after an `dueTime` and
	 * emits ever increasing numbers after each `period` of time thereafter.
	 *
	 * <span class="informal">Its like {@link index/interval}, but you can specify when
	 * should the emissions start.</span>
	 *
	 * ![](timer.png)
	 *
	 * `timer` returns an Observable that emits an infinite sequence of ascending
	 * integers, with a constant interval of time, `period` of your choosing
	 * between those emissions. The first emission happens after the specified
	 * `dueTime`. The initial delay may be a `Date`. By default, this
	 * operator uses the {@link asyncScheduler} {@link SchedulerLike} to provide a notion of time, but you
	 * may pass any {@link SchedulerLike} to it. If `period` is not specified, the output
	 * Observable emits only one value, `0`. Otherwise, it emits an infinite
	 * sequence.
	 *
	 * ## Examples
	 * ### Emits ascending numbers, one every second (1000ms), starting after 3 seconds
	 * ```ts
	 * import { timer } from 'rxjs';
	 *
	 * const numbers = timer(3000, 1000);
	 * numbers.subscribe(x => console.log(x));
	 * ```
	 *
	 * ### Emits one number after five seconds
	 * ```ts
	 * import { timer } from 'rxjs';
	 *
	 * const numbers = timer(5000);
	 * numbers.subscribe(x => console.log(x));
	 * ```
	 * @see {@link index/interval}
	 * @see {@link delay}
	 *
	 * @param {number|Date} [dueTime] The initial delay time specified as a Date object or as an integer denoting
	 * milliseconds to wait before emitting the first value of 0`.
	 * @param {number|SchedulerLike} [periodOrScheduler] The period of time between emissions of the
	 * subsequent numbers.
	 * @param {SchedulerLike} [scheduler=async] The {@link SchedulerLike} to use for scheduling
	 * the emission of values, and providing a notion of "time".
	 * @return {Observable} An Observable that emits a `0` after the
	 * `dueTime` and ever increasing numbers after each `period` of time
	 * thereafter.
	 * @static true
	 * @name timer
	 * @owner Observable
	 */
	export function timer(dueTime?: number | Date, periodOrScheduler?: number | SchedulerLike, scheduler?: SchedulerLike): Observable<number>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/using' {
	import { Observable } from '../Observable';
	import { Unsubscribable, ObservableInput } from '../types';
	/**
	 * Creates an Observable that uses a resource which will be disposed at the same time as the Observable.
	 *
	 * <span class="informal">Use it when you catch yourself cleaning up after an Observable.</span>
	 *
	 * `using` is a factory operator, which accepts two functions. First function returns a disposable resource.
	 * It can be an arbitrary object that implements `unsubscribe` method. Second function will be injected with
	 * that object and should return an Observable. That Observable can use resource object during its execution.
	 * Both functions passed to `using` will be called every time someone subscribes - neither an Observable nor
	 * resource object will be shared in any way between subscriptions.
	 *
	 * When Observable returned by `using` is subscribed, Observable returned from the second function will be subscribed
	 * as well. All its notifications (nexted values, completion and error events) will be emitted unchanged by the output
	 * Observable. If however someone unsubscribes from the Observable or source Observable completes or errors by itself,
	 * the `unsubscribe` method on resource object will be called. This can be used to do any necessary clean up, which
	 * otherwise would have to be handled by hand. Note that complete or error notifications are not emitted when someone
	 * cancels subscription to an Observable via `unsubscribe`, so `using` can be used as a hook, allowing you to make
	 * sure that all resources which need to exist during an Observable execution will be disposed at appropriate time.
	 *
	 * @see {@link defer}
	 *
	 * @param {function(): ISubscription} resourceFactory A function which creates any resource object
	 * that implements `unsubscribe` method.
	 * @param {function(resource: ISubscription): Observable<T>} observableFactory A function which
	 * creates an Observable, that can use injected resource object.
	 * @return {Observable<T>} An Observable that behaves the same as Observable returned by `observableFactory`, but
	 * which - when completed, errored or unsubscribed - will also call `unsubscribe` on created resource object.
	 */
	export function using<T>(resourceFactory: () => Unsubscribable | void, observableFactory: (resource: Unsubscribable | void) => ObservableInput<T> | void): Observable<T>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/observable/zip' {
	import { Observable } from '../Observable';
	import { Operator } from '../Operator';
	import { ObservableInput, ObservedValueOf } from '../types';
	import { Subscriber } from '../Subscriber';
	/** @deprecated resultSelector is no longer supported, pipe to map instead */
	export function zip<O1 extends ObservableInput<any>, R>(v1: O1, resultSelector: (v1: ObservedValueOf<O1>) => R): Observable<R>;
	/** @deprecated resultSelector is no longer supported, pipe to map instead */
	export function zip<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, R>(v1: O1, v2: O2, resultSelector: (v1: ObservedValueOf<O1>, v2: ObservedValueOf<O2>) => R): Observable<R>;
	/** @deprecated resultSelector is no longer supported, pipe to map instead */
	export function zip<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, R>(v1: O1, v2: O2, v3: O3, resultSelector: (v1: ObservedValueOf<O1>, v2: ObservedValueOf<O2>, v3: ObservedValueOf<O3>) => R): Observable<R>;
	/** @deprecated resultSelector is no longer supported, pipe to map instead */
	export function zip<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, R>(v1: O1, v2: O2, v3: O3, v4: O4, resultSelector: (v1: ObservedValueOf<O1>, v2: ObservedValueOf<O2>, v3: ObservedValueOf<O3>, v4: ObservedValueOf<O4>) => R): Observable<R>;
	/** @deprecated resultSelector is no longer supported, pipe to map instead */
	export function zip<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, O5 extends ObservableInput<any>, R>(v1: O1, v2: O2, v3: O3, v4: O4, v5: O5, resultSelector: (v1: ObservedValueOf<O1>, v2: ObservedValueOf<O2>, v3: ObservedValueOf<O3>, v4: ObservedValueOf<O4>, v5: ObservedValueOf<O5>) => R): Observable<R>;
	/** @deprecated resultSelector is no longer supported, pipe to map instead */
	export function zip<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, O5 extends ObservableInput<any>, O6 extends ObservableInput<any>, R>(v1: O1, v2: O2, v3: O3, v4: O4, v5: O5, v6: O6, resultSelector: (v1: ObservedValueOf<O1>, v2: ObservedValueOf<O2>, v3: ObservedValueOf<O3>, v4: ObservedValueOf<O4>, v5: ObservedValueOf<O5>, v6: ObservedValueOf<O6>) => R): Observable<R>;
	export function zip<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>>(v1: O1, v2: O2): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>]>;
	export function zip<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>>(v1: O1, v2: O2, v3: O3): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>]>;
	export function zip<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>>(v1: O1, v2: O2, v3: O3, v4: O4): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>]>;
	export function zip<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, O5 extends ObservableInput<any>>(v1: O1, v2: O2, v3: O3, v4: O4, v5: O5): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>, ObservedValueOf<O5>]>;
	export function zip<O1 extends ObservableInput<any>, O2 extends ObservableInput<any>, O3 extends ObservableInput<any>, O4 extends ObservableInput<any>, O5 extends ObservableInput<any>, O6 extends ObservableInput<any>>(v1: O1, v2: O2, v3: O3, v4: O4, v5: O5, v6: O6): Observable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>, ObservedValueOf<O5>, ObservedValueOf<O6>]>;
	export function zip<O extends ObservableInput<any>>(array: O[]): Observable<ObservedValueOf<O>[]>;
	export function zip<R>(array: ObservableInput<any>[]): Observable<R>;
	/** @deprecated resultSelector is no longer supported, pipe to map instead */
	export function zip<O extends ObservableInput<any>, R>(array: O[], resultSelector: (...values: ObservedValueOf<O>[]) => R): Observable<R>;
	/** @deprecated resultSelector is no longer supported, pipe to map instead */
	export function zip<R>(array: ObservableInput<any>[], resultSelector: (...values: any[]) => R): Observable<R>;
	export function zip<O extends ObservableInput<any>>(...observables: O[]): Observable<ObservedValueOf<O>[]>;
	export function zip<O extends ObservableInput<any>, R>(...observables: Array<O | ((...values: ObservedValueOf<O>[]) => R)>): Observable<R>;
	export function zip<R>(...observables: Array<ObservableInput<any> | ((...values: Array<any>) => R)>): Observable<R>;
	export class ZipOperator<T, R> implements Operator<T, R> {
	    resultSelector: (...values: Array<any>) => R;
	    constructor(resultSelector?: (...values: Array<any>) => R);
	    call(subscriber: Subscriber<R>, source: any): any;
	}
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	export class ZipSubscriber<T, R> extends Subscriber<T> {
	    private values;
	    private resultSelector;
	    private iterators;
	    private active;
	    constructor(destination: Subscriber<R>, resultSelector?: (...values: Array<any>) => R, values?: any);
	    protected _next(value: any): void;
	    protected _complete(): void;
	    notifyInactive(): void;
	    checkIterators(): void;
	    protected _tryresultSelector(args: any[]): void;
	}

}
declare module '@my-project/module-view/node_modules/rxjs/internal/scheduled/scheduled' {
	import { ObservableInput, SchedulerLike, Observable } from 'rxjs';
	/**
	 * Converts from a common {@link ObservableInput} type to an observable where subscription and emissions
	 * are scheduled on the provided scheduler.
	 *
	 * @see from
	 * @see of
	 *
	 * @param input The observable, array, promise, iterable, etc you would like to schedule
	 * @param scheduler The scheduler to use to schedule the subscription and emissions from
	 * the returned observable.
	 */
	export function scheduled<T>(input: ObservableInput<T>, scheduler: SchedulerLike): Observable<T>;

}
declare module '@my-project/module-view/node_modules/rxjs/internal/config' {
	/**
	 * The global configuration object for RxJS, used to configure things
	 * like what Promise contructor should used to create Promises
	 */
	export const config: {
	    /**
	     * The promise constructor used by default for methods such as
	     * {@link toPromise} and {@link forEach}
	     */
	    Promise: PromiseConstructorLike;
	    /**
	     * If true, turns on synchronous error rethrowing, which is a deprecated behavior
	     * in v6 and higher. This behavior enables bad patterns like wrapping a subscribe
	     * call in a try/catch block. It also enables producer interference, a nasty bug
	     * where a multicast can be broken for all observers by a downstream consumer with
	     * an unhandled error. DO NOT USE THIS FLAG UNLESS IT'S NEEDED TO BY TIME
	     * FOR MIGRATION REASONS.
	     */
	    useDeprecatedSynchronousErrorHandling: boolean;
	};

}
declare module '@my-project/module-view/node_modules/rxjs/index' {
	export { Observable } from './internal/Observable';
	export { ConnectableObservable } from './internal/observable/ConnectableObservable';
	export { GroupedObservable } from './internal/operators/groupBy';
	export { Operator } from './internal/Operator';
	export { observable } from './internal/symbol/observable';
	export { Subject } from './internal/Subject';
	export { BehaviorSubject } from './internal/BehaviorSubject';
	export { ReplaySubject } from './internal/ReplaySubject';
	export { AsyncSubject } from './internal/AsyncSubject';
	export { asap as asapScheduler } from './internal/scheduler/asap';
	export { async as asyncScheduler } from './internal/scheduler/async';
	export { queue as queueScheduler } from './internal/scheduler/queue';
	export { animationFrame as animationFrameScheduler } from './internal/scheduler/animationFrame';
	export { VirtualTimeScheduler, VirtualAction } from './internal/scheduler/VirtualTimeScheduler';
	export { Scheduler } from './internal/Scheduler';
	export { Subscription } from './internal/Subscription';
	export { Subscriber } from './internal/Subscriber';
	export { Notification, NotificationKind } from './internal/Notification';
	export { pipe } from './internal/util/pipe';
	export { noop } from './internal/util/noop';
	export { identity } from './internal/util/identity';
	export { isObservable } from './internal/util/isObservable';
	export { ArgumentOutOfRangeError } from './internal/util/ArgumentOutOfRangeError';
	export { EmptyError } from './internal/util/EmptyError';
	export { ObjectUnsubscribedError } from './internal/util/ObjectUnsubscribedError';
	export { UnsubscriptionError } from './internal/util/UnsubscriptionError';
	export { TimeoutError } from './internal/util/TimeoutError';
	export { bindCallback } from './internal/observable/bindCallback';
	export { bindNodeCallback } from './internal/observable/bindNodeCallback';
	export { combineLatest } from './internal/observable/combineLatest';
	export { concat } from './internal/observable/concat';
	export { defer } from './internal/observable/defer';
	export { empty } from './internal/observable/empty';
	export { forkJoin } from './internal/observable/forkJoin';
	export { from } from './internal/observable/from';
	export { fromEvent } from './internal/observable/fromEvent';
	export { fromEventPattern } from './internal/observable/fromEventPattern';
	export { generate } from './internal/observable/generate';
	export { iif } from './internal/observable/iif';
	export { interval } from './internal/observable/interval';
	export { merge } from './internal/observable/merge';
	export { never } from './internal/observable/never';
	export { of } from './internal/observable/of';
	export { onErrorResumeNext } from './internal/observable/onErrorResumeNext';
	export { pairs } from './internal/observable/pairs';
	export { partition } from './internal/observable/partition';
	export { race } from './internal/observable/race';
	export { range } from './internal/observable/range';
	export { throwError } from './internal/observable/throwError';
	export { timer } from './internal/observable/timer';
	export { using } from './internal/observable/using';
	export { zip } from './internal/observable/zip';
	export { scheduled } from './internal/scheduled/scheduled';
	export { EMPTY } from './internal/observable/empty';
	export { NEVER } from './internal/observable/never';
	export * from './internal/types';
	export { config } from './internal/config';

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/decorators/tokens' {
	import { CSSResult } from '../lit-element/lib/css-tag';
	import { CSSResultArray } from '../lit-element/lit-element';
	import { Subscription } from 'rxjs';
	import { TemplateResult } from '../lit-html/lit-html';
	export class RXDIElement extends HTMLElement {
	    static setElement?<T>(component: T, document: RXDIElement): T;
	    static is?(document: RXDIElement): RXDIElement;
	    static styles?: CSSResult | CSSResultArray;
	    static subscriptions?: Map<Subscription, Subscription>;
	    getTemplateResult?(): TemplateResult;
	    OnBefore?: () => void;
	    OnInit?: () => void;
	    OnUpdate?: () => void;
	    OnUpdateFirst?: () => void;
	}

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/decorators/component.decorator' {
	import { CSSResult } from '../lit-element/lib/css-tag';
	import { TemplateResult } from '../lit-html/lit-html';
	import { RXDIElement } from './tokens';
	interface CustomElementConfig<T> {
	    selector: string;
	    template?: (self: T) => TemplateResult;
	    style?: CSSResult;
	    styles?: CSSResult[];
	    useShadow?: boolean;
	    extends?: string;
	    container?: Element | DocumentFragment;
	}
	interface ClassDescriptor {
	    kind: 'class';
	    elements: ClassElement[];
	    finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
	}
	interface ClassElement {
	    kind: 'field' | 'method';
	    key: PropertyKey;
	    placement: 'static' | 'prototype' | 'own';
	    initializer?: Function;
	    extras?: ClassElement[];
	    finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
	    descriptor?: PropertyDescriptor;
	} type Constructor<T> = new (...args: unknown[]) => T;
	export const customElement: <T>(tag: string, config?: CustomElementConfig<T>) => (classOrDescriptor: ClassDescriptor | Constructor<RXDIElement>) => void;
	export const Component: <T>(config: CustomElementConfig<T>) => (classOrDescriptor: ClassDescriptor | Constructor<RXDIElement>) => void;
	export {};

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/decorators/hooks/on-before' {
	export interface OnBefore {
	    OnBefore(): void;
	}

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/decorators/hooks/on-destroy' {
	export interface OnDestroy {
	    OnDestroy(): void;
	}

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/decorators/hooks/on-init' {
	export interface OnInit {
	    OnInit(): void;
	}

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/decorators/hooks/on-update' {
	export interface OnUpdate {
	    OnUpdate(): void;
	}

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/decorators/hooks/on-update-first' {
	export interface OnUpdateFirst {
	    OnUpdateFirst(): void;
	}

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/decorators/hooks/index' {
	export * from './on-before';
	export * from './on-destroy';
	export * from './on-init';
	export * from './on-update';
	export * from './on-update-first';

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/decorators/test.helpers' {
	import { TemplateResult } from '../lit-html/lit-html';
	import { RXDIElement } from './tokens';
	export function setElement<T>(element: T, container: HTMLElement): T;
	export function MockComponent<T>(component: any): T;
	export function getTemplateResult(component: RXDIElement): TemplateResult;

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/decorators/index' {
	export * from './template-observable';
	export * from './component.decorator';
	export * from './hooks/index';
	export * from './tokens';
	export * from './test.helpers';

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-element/lib/updating-element' {
	import { RXDIElement } from '../../decorators/index'; global {
	    var JSCompiler_renameProperty: <P extends PropertyKey>(prop: P, _obj: unknown) => P;
	    interface Window {
	        JSCompiler_renameProperty: typeof JSCompiler_renameProperty;
	    }
	}
	/**
	 * Converts property values to and from attribute values.
	 */
	export interface ComplexAttributeConverter<Type = unknown, TypeHint = unknown> {
	    /**
	     * Function called to convert an attribute value to a property
	     * value.
	     */
	    fromAttribute?(value: string | null, type?: TypeHint): Type;
	    /**
	     * Function called to convert a property value to an attribute
	     * value.
	     *
	     * It returns unknown instead of string, to be compatible with
	     * https://github.com/WICG/trusted-types (and similar efforts).
	     */
	    toAttribute?(value: Type, type?: TypeHint): unknown;
	} type AttributeConverter<Type = unknown, TypeHint = unknown> = ComplexAttributeConverter<Type> | ((value: string, type?: TypeHint) => Type);
	/**
	 * Defines options for a property accessor.
	 */
	export interface PropertyDeclaration<Type = unknown, TypeHint = unknown> {
	    /**
	     * Indicates how and whether the property becomes an observed attribute.
	     * If the value is `false`, the property is not added to `observedAttributes`.
	     * If true or absent, the lowercased property name is observed (e.g. `fooBar`
	     * becomes `foobar`). If a string, the string value is observed (e.g
	     * `attribute: 'foo-bar'`).
	     */
	    readonly attribute?: boolean | string;
	    /**
	     * Indicates the type of the property. This is used only as a hint for the
	     * `converter` to determine how to convert the attribute
	     * to/from a property.
	     */
	    readonly type?: TypeHint;
	    /**
	     * Indicates how to convert the attribute to/from a property. If this value
	     * is a function, it is used to convert the attribute value a the property
	     * value. If it's an object, it can have keys for `fromAttribute` and
	     * `toAttribute`. If no `toAttribute` function is provided and
	     * `reflect` is set to `true`, the property value is set directly to the
	     * attribute. A default `converter` is used if none is provided; it supports
	     * `Boolean`, `String`, `Number`, `Object`, and `Array`. Note,
	     * when a property changes and the converter is used to update the attribute,
	     * the property is never updated again as a result of the attribute changing,
	     * and vice versa.
	     */
	    readonly converter?: AttributeConverter<Type, TypeHint>;
	    /**
	     * Indicates if the property should reflect to an attribute.
	     * If `true`, when the property is set, the attribute is set using the
	     * attribute name determined according to the rules for the `attribute`
	     * property option and the value of the property converted using the rules
	     * from the `converter` property option.
	     */
	    readonly reflect?: boolean;
	    /**
	     * A function that indicates if a property should be considered changed when
	     * it is set. The function should take the `newValue` and `oldValue` and
	     * return `true` if an update should be requested.
	     */
	    hasChanged?(value: Type, oldValue: Type): boolean;
	    /**
	     * Indicates whether an accessor will be created for this property. By
	     * default, an accessor will be generated for this property that requests an
	     * update when set. If this flag is `true`, no accessor will be created, and
	     * it will be the user's responsibility to call
	     * `this.requestUpdate(propertyName, oldValue)` to request an update when
	     * the property changes.
	     */
	    readonly noAccessor?: boolean;
	}
	/**
	 * Map of properties to PropertyDeclaration options. For each property an
	 * accessor is made, and the property is processed according to the
	 * PropertyDeclaration options.
	 */
	export interface PropertyDeclarations {
	    readonly [key: string]: PropertyDeclaration;
	}
	export type PropertyValues = Map<PropertyKey, unknown>;
	export const defaultConverter: ComplexAttributeConverter;
	export interface HasChanged {
	    (value: unknown, old: unknown): boolean;
	}
	/**
	 * Change function that returns true if `value` is different from `oldValue`.
	 * This method is used as the default for a property's `hasChanged` function.
	 */
	export const notEqual: HasChanged;
	/**
	 * Base element class which manages element properties and attributes. When
	 * properties change, the `update` method is asynchronously called. This method
	 * should be supplied by subclassers to render updates as desired.
	 */
	export abstract class UpdatingElement extends RXDIElement {
	    /**
	     * Maps attribute names to properties; for example `foobar` attribute to
	     * `fooBar` property. Created lazily on user subclasses when finalizing the
	     * class.
	     */
	    private static _attributeToPropertyMap;
	    /**
	     * Marks class as having finished creating properties.
	     */
	    protected static finalized: boolean;
	    /**
	     * Memoized list of all class properties, including any superclass properties.
	     * Created lazily on user subclasses when finalizing the class.
	     */
	    private static _classProperties?;
	    /**
	     * User-supplied object that maps property names to `PropertyDeclaration`
	     * objects containing options for configuring the property.
	     */
	    static properties: PropertyDeclarations;
	    /**
	     * Returns a list of attributes corresponding to the registered properties.
	     * @nocollapse
	     */
	    static readonly observedAttributes: string[];
	    /**
	     * Ensures the private `_classProperties` property metadata is created.
	     * In addition to `finalize` this is also called in `createProperty` to
	     * ensure the `@property` decorator can add property metadata.
	     */
	    /** @nocollapse */
	    private static _ensureClassProperties;
	    /**
	     * Creates a property accessor on the element prototype if one does not exist.
	     * The property setter calls the property's `hasChanged` property option
	     * or uses a strict identity check to determine whether or not to request
	     * an update.
	     * @nocollapse
	     */
	    static createProperty(name: PropertyKey, options?: PropertyDeclaration): void;
	    /**
	     * Creates property accessors for registered properties and ensures
	     * any superclasses are also finalized.
	     * @nocollapse
	     */
	    protected static finalize(): void;
	    /**
	     * Returns the property name for the given attribute `name`.
	     * @nocollapse
	     */
	    private static _attributeNameForProperty;
	    /**
	     * Returns true if a property should request an update.
	     * Called when a property value is set and uses the `hasChanged`
	     * option for the property if present or a strict identity check.
	     * @nocollapse
	     */
	    private static _valueHasChanged;
	    /**
	     * Returns the property value for the given attribute value.
	     * Called via the `attributeChangedCallback` and uses the property's
	     * `converter` or `converter.fromAttribute` property option.
	     * @nocollapse
	     */
	    private static _propertyValueFromAttribute;
	    /**
	     * Returns the attribute value for the given property value. If this
	     * returns undefined, the property will *not* be reflected to an attribute.
	     * If this returns null, the attribute will be removed, otherwise the
	     * attribute will be set to the value.
	     * This uses the property's `reflect` and `type.toAttribute` property options.
	     * @nocollapse
	     */
	    private static _propertyValueToAttribute;
	    private _updateState;
	    private _instanceProperties;
	    private _updatePromise;
	    private _hasConnectedResolver;
	    /**
	     * Map with keys for any properties that have changed since the last
	     * update cycle with previous values.
	     */
	    private _changedProperties;
	    /**
	     * Map with keys of properties that should be reflected when updated.
	     */
	    private _reflectingProperties;
	    constructor();
	    /**
	     * Performs element initialization. By default captures any pre-set values for
	     * registered properties.
	     */
	    protected initialize(): void;
	    /**
	     * Fixes any properties set on the instance before upgrade time.
	     * Otherwise these would shadow the accessor and break these properties.
	     * The properties are stored in a Map which is played back after the
	     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
	     * (<=41), properties created for native platform properties like (`id` or
	     * `name`) may not have default values set in the element constructor. On
	     * these browsers native properties appear on instances and therefore their
	     * default value will overwrite any element default (e.g. if the element sets
	     * this.id = 'id' in the constructor, the 'id' will become '' since this is
	     * the native platform default).
	     */
	    private _saveInstanceProperties;
	    /**
	     * Applies previously saved instance properties.
	     */
	    private _applyInstanceProperties;
	    connectedCallback(): void;
	    /**
	     * Allows for `super.disconnectedCallback()` in extensions while
	     * reserving the possibility of making non-breaking feature additions
	     * when disconnecting at some point in the future.
	     */
	    disconnectedCallback(): void;
	    /**
	     * Synchronizes property values when attributes change.
	     */
	    attributeChangedCallback(name: string, old: string | null, value: string | null): void;
	    private _propertyToAttribute;
	    private _attributeToProperty;
	    /**
	     * This private version of `requestUpdate` does not access or return the
	     * `updateComplete` promise. This promise can be overridden and is therefore
	     * not free to access.
	     */
	    private _requestUpdate;
	    /**
	     * Requests an update which is processed asynchronously. This should
	     * be called when an element should update based on some state not triggered
	     * by setting a property. In this case, pass no arguments. It should also be
	     * called when manually implementing a property setter. In this case, pass the
	     * property `name` and `oldValue` to ensure that any configured property
	     * options are honored. Returns the `updateComplete` Promise which is resolved
	     * when the update completes.
	     *
	     * @param name {PropertyKey} (optional) name of requesting property
	     * @param oldValue {any} (optional) old value of requesting property
	     * @returns {Promise} A Promise that is resolved when the update completes.
	     */
	    requestUpdate(name?: PropertyKey, oldValue?: unknown): Promise<unknown>;
	    /**
	     * Sets up the element to asynchronously update.
	     */
	    private _enqueueUpdate;
	    private readonly _hasConnected;
	    private readonly _hasRequestedUpdate;
	    protected readonly hasUpdated: number;
	    /**
	     * Performs an element update. Note, if an exception is thrown during the
	     * update, `firstUpdated` and `updated` will not be called.
	     *
	     * You can override this method to change the timing of updates. If this
	     * method is overridden, `super.performUpdate()` must be called.
	     *
	     * For instance, to schedule updates to occur just before the next frame:
	     *
	     * ```
	     * protected async performUpdate(): Promise<unknown> {
	     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
	     *   super.performUpdate();
	     * }
	     * ```
	     */
	    protected performUpdate(): void | Promise<unknown>;
	    private _markUpdated;
	    /**
	     * Returns a Promise that resolves when the element has completed updating.
	     * The Promise value is a boolean that is `true` if the element completed the
	     * update without triggering another update. The Promise result is `false` if
	     * a property was set inside `updated()`. If the Promise is rejected, an
	     * exception was thrown during the update. This getter can be implemented to
	     * await additional state. For example, it is sometimes useful to await a
	     * rendered element before fulfilling this Promise. To do this, first await
	     * `super.updateComplete` then any subsequent state.
	     *
	     * @returns {Promise} The Promise returns a boolean that indicates if the
	     * update resolved without triggering another update.
	     */
	    readonly updateComplete: Promise<unknown>;
	    /**
	     * Controls whether or not `update` should be called when the element requests
	     * an update. By default, this method always returns `true`, but this can be
	     * customized to control when to update.
	     *
	     * * @param _changedProperties Map of changed properties with old values
	     */
	    protected shouldUpdate(_changedProperties: PropertyValues): boolean;
	    /**
	     * Updates the element. This method reflects property values to attributes.
	     * It can be overridden to render and keep updated element DOM.
	     * Setting properties inside this method will *not* trigger
	     * another update.
	     *
	     * * @param _changedProperties Map of changed properties with old values
	     */
	    protected update(_changedProperties: PropertyValues): void;
	    /**
	     * Invoked whenever the element is updated. Implement to perform
	     * post-updating tasks via DOM APIs, for example, focusing an element.
	     *
	     * Setting properties inside this method will trigger the element to update
	     * again after this update cycle completes.
	     *
	     * * @param _changedProperties Map of changed properties with old values
	     */
	    protected updated(_changedProperties: PropertyValues): void;
	    /**
	     * Invoked when the element is first updated. Implement to perform one time
	     * work on the element after update.
	     *
	     * Setting properties inside this method will trigger the element to update
	     * again after this update cycle completes.
	     *
	     * * @param _changedProperties Map of changed properties with old values
	     */
	    protected firstUpdated(_changedProperties: PropertyValues): void;
	}
	export {};

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-element/lib/decorators' {
	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	import { PropertyDeclaration } from './updating-element';
	export type Constructor<T> = {
	    new (...args: unknown[]): T;
	};
	interface ClassElement {
	    kind: 'field' | 'method';
	    key: PropertyKey;
	    placement: 'static' | 'prototype' | 'own';
	    initializer?: Function;
	    extras?: ClassElement[];
	    finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
	    descriptor?: PropertyDescriptor;
	}
	/**
	 * A property decorator which creates a LitElement property which reflects a
	 * corresponding attribute value. A `PropertyDeclaration` may optionally be
	 * supplied to configure property features.
	 *
	 * @ExportDecoratedItems
	 */
	export function property(options?: PropertyDeclaration): (protoOrDescriptor: Object | ClassElement, name?: string | number | symbol) => any;
	/**
	 * A property decorator that converts a class property into a getter that
	 * executes a querySelector on the element's renderRoot.
	 *
	 * @ExportDecoratedItems
	 */
	export function query(selector: string): (protoOrDescriptor: Object | ClassElement, name?: string | number | symbol) => any;
	/**
	 * A property decorator that converts a class property into a getter
	 * that executes a querySelectorAll on the element's renderRoot.
	 *
	 * @ExportDecoratedItems
	 */
	export function queryAll(selector: string): (protoOrDescriptor: Object | ClassElement, name?: string | number | symbol) => any;
	/**
	 * Adds event listener options to a method used as an event listener in a
	 * lit-html template.
	 *
	 * @param options An object that specifis event listener options as accepted by
	 * `EventTarget#addEventListener` and `EventTarget#removeEventListener`.
	 *
	 * Current browsers support the `capture`, `passive`, and `once` options. See:
	 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters
	 *
	 * @example
	 *
	 *     class MyElement {
	 *
	 *       clicked = false;
	 *
	 *       render() {
	 *         return html`<div @click=${this._onClick}`><button></button></div>`;
	 *       }
	 *
	 *       @eventOptions({capture: true})
	 *       _onClick(e) {
	 *         this.clicked = true;
	 *       }
	 *     }
	 */
	export const eventOptions: (options: AddEventListenerOptions) => any;
	export {};

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-html/lib/shady-render' {
	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	import { RenderOptions } from './render-options.js';
	import { TemplateResult } from './template-result.js';
	export { html, svg, TemplateResult } from '../lit-html.js';
	export interface ShadyRenderOptions extends Partial<RenderOptions> {
	    scopeName: string;
	}
	/**
	 * Extension to the standard `render` method which supports rendering
	 * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
	 * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
	 * or when the webcomponentsjs
	 * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
	 *
	 * Adds a `scopeName` option which is used to scope element DOM and stylesheets
	 * when native ShadowDOM is unavailable. The `scopeName` will be added to
	 * the class attribute of all rendered DOM. In addition, any style elements will
	 * be automatically re-written with this `scopeName` selector and moved out
	 * of the rendered DOM and into the document `<head>`.
	 *
	 * It is common to use this render method in conjunction with a custom element
	 * which renders a shadowRoot. When this is done, typically the element's
	 * `localName` should be used as the `scopeName`.
	 *
	 * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
	 * custom properties (needed only on older browsers like IE11) and a shim for
	 * a deprecated feature called `@apply` that supports applying a set of css
	 * custom properties to a given location.
	 *
	 * Usage considerations:
	 *
	 * * Part values in `<style>` elements are only applied the first time a given
	 * `scopeName` renders. Subsequent changes to parts in style elements will have
	 * no effect. Because of this, parts in style elements should only be used for
	 * values that will never change, for example parts that set scope-wide theme
	 * values or parts which render shared style elements.
	 *
	 * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
	 * custom element's `constructor` is not supported. Instead rendering should
	 * either done asynchronously, for example at microtask timing (for example
	 * `Promise.resolve()`), or be deferred until the first time the element's
	 * `connectedCallback` runs.
	 *
	 * Usage considerations when using shimmed custom properties or `@apply`:
	 *
	 * * Whenever any dynamic changes are made which affect
	 * css custom properties, `ShadyCSS.styleElement(element)` must be called
	 * to update the element. There are two cases when this is needed:
	 * (1) the element is connected to a new parent, (2) a class is added to the
	 * element that causes it to match different custom properties.
	 * To address the first case when rendering a custom element, `styleElement`
	 * should be called in the element's `connectedCallback`.
	 *
	 * * Shimmed custom properties may only be defined either for an entire
	 * shadowRoot (for example, in a `:host` rule) or via a rule that directly
	 * matches an element with a shadowRoot. In other words, instead of flowing from
	 * parent to child as do native css custom properties, shimmed custom properties
	 * flow only from shadowRoots to nested shadowRoots.
	 *
	 * * When using `@apply` mixing css shorthand property names with
	 * non-shorthand names (for example `border` and `border-width`) is not
	 * supported.
	 */
	export const render: (result: TemplateResult, container: Element | DocumentFragment | ShadowRoot, options: ShadyRenderOptions) => void;

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-element/lit-element' {
	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	import { TemplateResult } from '../lit-html/lit-html';
	import { PropertyValues, UpdatingElement } from './lib/updating-element';
	export * from './lib/updating-element';
	export * from './lib/decorators';
	import { CSSResult } from './lib/css-tag';
	export * from './lib/css-tag'; global {
	    interface Window {
	        litElementVersions: string[];
	    }
	}
	export interface FlattenArray extends Array<CSSResult | CSSResultArray> {
	    flat(number: number): CSSResult[];
	}
	export interface CSSResultArray extends FlattenArray {
	}
	export class LitElement extends UpdatingElement {
	    /**
	     * Ensure this class is marked as `finalized` as an optimization ensuring
	     * it will not needlessly try to `finalize`.
	     */
	    protected static finalized: boolean;
	    /**
	     * Render method used to render the lit-html TemplateResult to the element's
	     * DOM.
	     * @param {TemplateResult} Template to render.
	     * @param {Element|DocumentFragment} Node into which to render.
	     * @param {String} Element name.
	     * @nocollapse
	     */
	    static render: (result: TemplateResult, container: Element | DocumentFragment | ShadowRoot, options: import("../lit-html/lib/shady-render").ShadyRenderOptions) => void;
	    /**
	     * Array of styles to apply to the element. The styles should be defined
	     * using the `css` tag function.
	     */
	    static styles?: CSSResult | CSSResultArray;
	    private static _styles;
	    /** @nocollapse */
	    protected static finalize(): void;
	    /** @nocollapse */
	    private static _getUniqueStyles;
	    private _needsShimAdoptedStyleSheets?;
	    /**
	     * Node or ShadowRoot into which element DOM should be rendered. Defaults
	     * to an open shadowRoot.
	     */
	    readonly renderRoot: Element | DocumentFragment;
	    /**
	     * Performs element initialization. By default this calls `createRenderRoot`
	     * to create the element `renderRoot` node and captures any pre-set values for
	     * registered properties.
	     */
	    protected initialize(): void;
	    /**
	     * Returns the node into which the element should render and by default
	     * creates and returns an open shadowRoot. Implement to customize where the
	     * element's DOM is rendered. For example, to render into the element's
	     * childNodes, return `this`.
	     * @returns {Element|DocumentFragment} Returns a node into which to render.
	     */
	    protected createRenderRoot(): Element | ShadowRoot;
	    /**
	     * Applies styling to the element shadowRoot using the `static get styles`
	     * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
	     * available and will fallback otherwise. When Shadow DOM is polyfilled,
	     * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
	     * is available but `adoptedStyleSheets` is not, styles are appended to the
	     * end of the `shadowRoot` to [mimic spec
	     * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
	     */
	    protected adoptStyles(): void;
	    connectedCallback(): void;
	    /**
	     * Updates the element. This method reflects property values to attributes
	     * and calls `render` to render DOM via lit-html. Setting properties inside
	     * this method will *not* trigger another update.
	     * * @param _changedProperties Map of changed properties with old values
	     */
	    protected update(changedProperties: PropertyValues): void;
	    /**
	     * Invoked on each update to perform rendering tasks. This method must return
	     * a lit-html TemplateResult. Setting properties inside this method will *not*
	     * trigger the element to update.
	     */
	    protected render(): TemplateResult | void;
	}

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/mixins/index' {
	import { LitElement } from '../lit-element/lit-element';
	export class BaseComponent extends LitElement {
	    createRenderRoot(): this;
	}

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/lit-rx/index' {
	import { Part } from '../lit-html/lit-html';
	import { Subscribable } from 'rxjs'; type SubscribableOrPromiseLike<T> = Subscribable<T> | PromiseLike<T>;
	/**
	 * A directive that renders the items of a subscribable, replacing
	 * previous values with new values, so that only one value is ever rendered
	 * at a time.
	 *
	 * @param value A subscribable
	 */
	export const subscribe: (subscribableOrPromiseLike: SubscribableOrPromiseLike<unknown>) => (part: Part) => void;
	export const async: (subscribableOrPromiseLike: SubscribableOrPromiseLike<unknown>) => (part: Part) => void;
	export {};

}
declare module '@my-project/module-view/node_modules/@rxdi/lit-html/dist/index' {
	export * from './mixins/index';
	export * from './decorators/index';
	export * from './lit-html/lit-html';
	export * from './lit-rx/index';
	export * from './lit-element/lit-element';

}
declare module '@my-project/module-view/module-view.component' {
	export {};

}
