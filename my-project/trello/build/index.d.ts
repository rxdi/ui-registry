declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/lib/part' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/lib/template' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/lib/template-factory' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/lib/render-options' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/lib/parts' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/lib/template-processor' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/lib/template-result' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/lib/default-template-processor' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/lib/directive' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/lib/dom' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/lib/render' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/lib/template-instance' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/directives/async-append' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/directives/async-replace' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/directives/cache' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/directives/class-map' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/directives/guard' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/directives/if-defined' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/directives/repeat' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/directives/style-map' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/directives/unsafe-html' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/directives/until' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/directives/index' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/lit-html' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/decorators/template-observable' {
	export function TemplateObservable(animationFrame?: boolean): (target: any, key: string) => void;

}
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-element/lib/css-tag' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/decorators/tokens' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/decorators/component.decorator' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/decorators/hooks/on-before' {
	export interface OnBefore {
	    OnBefore(): void;
	}

}
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/decorators/hooks/on-destroy' {
	export interface OnDestroy {
	    OnDestroy(): void;
	}

}
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/decorators/hooks/on-init' {
	export interface OnInit {
	    OnInit(): void;
	}

}
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/decorators/hooks/on-update' {
	export interface OnUpdate {
	    OnUpdate(): void;
	}

}
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/decorators/hooks/on-update-first' {
	export interface OnUpdateFirst {
	    OnUpdateFirst(): void;
	}

}
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/decorators/hooks/index' {
	export * from './on-before';
	export * from './on-destroy';
	export * from './on-init';
	export * from './on-update';
	export * from './on-update-first';

}
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/decorators/test.helpers' {
	import { TemplateResult } from '../lit-html/lit-html';
	import { RXDIElement } from './tokens';
	export function setElement<T>(element: T, container: HTMLElement): T;
	export function MockComponent<T>(component: any): T;
	export function getTemplateResult(component: RXDIElement): TemplateResult;

}
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/decorators/index' {
	export * from './template-observable';
	export * from './component.decorator';
	export * from './hooks/index';
	export * from './tokens';
	export * from './test.helpers';

}
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-element/lib/updating-element' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-element/lib/decorators' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-html/lib/shady-render' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-element/lit-element' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/mixins/index' {
	import { LitElement } from '../lit-element/lit-element';
	export class BaseComponent extends LitElement {
	    createRenderRoot(): this;
	}

}
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/lit-rx/index' {
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
declare module '@my-project/trello/node_modules/@rxdi/lit-html/dist/index' {
	export * from './mixins/index';
	export * from './decorators/index';
	export * from './lit-html/lit-html';
	export * from './lit-rx/index';
	export * from './lit-element/lit-element';

}
declare module '@my-project/trello/trello/trello.component' {
	import { LitElement, OnInit, OnDestroy, OnUpdate } from '@rxdi/lit-html';
	import '@my-project/trello/tailwind/tailwind.component';
	/**
	 * @customElement trello-component
	 */
	export class TrelloComponent extends LitElement implements OnInit, OnDestroy, OnUpdate {
	    private name;
	    private divs;
	    OnInit(): void;
	    OnDestroy(): void;
	    OnUpdate(): void;
	}

}
