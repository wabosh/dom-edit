<script context="module" lang="ts">
    import cssText from 'data-text:~style.css';
    import type {
        PlasmoCSConfig,
        PlasmoGetInlineAnchor,
        PlasmoGetStyle,
        PlasmoMountShadowHost
    } from 'plasmo';

    export const config: PlasmoCSConfig = {
        matches: ['<all_urls>']
    };

    export const getInlineAnchor: PlasmoGetInlineAnchor = () => {
        return document.querySelector('#edit-picker');
    };

    export const mountShadowHost: PlasmoMountShadowHost = ({ anchor, shadowHost }) => {
        anchor!.element!.insertBefore(shadowHost!, anchor!.element!.firstChild);
    };

    export const getStyle: PlasmoGetStyle = () => {
        const style = document.createElement('style');
        style.textContent = cssText;
        style.textContent += `
            .indicator-position {
                left: var(--x);
                top: var(--y);
                width: var(--w);
                height: var(--h);
            }`;
        return style;
    };
</script>

<script lang="ts">
    import ace from 'ace-builds';
    import keybindings from 'ace-builds/src-min-noconflict/keybinding-vscode';
    import mode from 'ace-builds/src-min-noconflict/mode-html';
    import theme from 'ace-builds/src-min-noconflict/theme-twilight';
    import cash from 'cash-dom';
    import beautify from 'js-beautify';
    import { onMount } from 'svelte';
    import { tv } from 'tailwind-variants';

    let x = 0;
    let y = 0;
    let w = 0;
    let h = 0;

    let docWidth = 0;
    let docHeight = 0;

    let editorElement: HTMLElement;
    let focussedElement: HTMLElement;
    let editor: ace.Ace.Editor;

    onMount(() => {
        // Create editor
        const htmlMode = new mode.Mode();

        editor = ace.edit(editorElement, {
            mode: htmlMode,
            keyboardHandler: keybindings.handler,
            theme: theme,
            useWorker: false
        });

        // If not attached, weird glitches happen
        editor.renderer.attachToShadowRoot();

        // Add listeners
        const selectableElements = cash('body *')
            .not('plasmo-csui')
            .not('#edit-picker')
            .not(editorElement);

        selectableElements.on('mousemove', (e) => {
            const target = cash(e.target);
            const { left, top } = target.offset();
            x = left;
            y = top;

            w = target.outerWidth();
            h = target.outerHeight();

            docWidth = cash(document).width();
            docHeight = cash(document).height();
        });

        selectableElements.on('click', (e) => {
            e.preventDefault();

            if (focussedElement) return;
            focussedElement = e.target;
            const indentedCode = beautify.html_beautify(focussedElement.innerHTML, {
                wrap_line_length: 80,
                indent_size: 4
            });
            editor.setValue(indentedCode);
            console.log(cash(e.target));
        });
    });

    const appendToElement = () => {
        focussedElement.innerHTML = editor.getValue();
        focussedElement = undefined;
    };

    const focusIndicator = tv({
        base: 'absolute bg-white/10 rounded-[2px] backdrop-invert z-30 block pointer-events-none',
        variants: {
            hidden: {
                true: 'hidden'
            }
        }
    });

    const borderIndicator = tv({
        base: 'absolute border-spacing-[4px] border-dashed border-black drop-shadow-lg shadow-white z-30 pointer-events-none indicator-position',
        variants: {
            direction: {
                horizontal: 'border-t-2 border-b-2',
                vertical: 'border-l-2 border-r-2'
            },
            hidden: {
                true: 'hidden'
            }
        }
    });

    const editorVariants = tv({
        base: 'fixed top-0 left-0 w-full h-[550px] p-[25px] flex flex-col gap-4 drop-shadow-lg',
        variants: {
            hidden: {
                true: 'hidden'
            }
        }
    });
</script>

<!-- Picker -->
{#if focussedElement === undefined}
    <!-- Main focus indicator -->
    <div
        class={focusIndicator({ hidden: focussedElement !== undefined })}
        style="left: {x}px; top: {y}px; width: {w}px; height: {h}px" />

    <!-- Left dotted borders -->
    <div
        class={borderIndicator({ direction: 'horizontal', hidden: focussedElement !== undefined })}
        style="--x: 0; --y: {y}px; --w: {x}px; --h: {h}px" />

    <!-- Right borders -->
    <div
        class={borderIndicator({ direction: 'horizontal', hidden: focussedElement !== undefined })}
        style="--x: {x + w}px; --y: {y}px; --w: {docWidth - x - w}px; --h: {h}px" />

    <!-- Top borders -->
    <div
        class={borderIndicator({ direction: 'vertical', hidden: focussedElement !== undefined })}
        style="--x: {x}px; --y: 0; --w: {w}px; --h: {y}px" />

    <!-- Bottom borders -->
    <div
        class={borderIndicator({ direction: 'vertical', hidden: focussedElement !== undefined })}
        style="--x: {x}px; --y: {y + h}px; --w: {w}px; --h: {docHeight - y - h}px" />
{/if}

<div class={editorVariants({ hidden: focussedElement === undefined })}>
    <div class="rounded w-full h-full" bind:this={editorElement} />
    <button
        on:click={appendToElement}
        class="px-4 py-2 rounded bg-gray-900 hover:bg-gray-800 text-white grow-0">Update</button>
</div>
