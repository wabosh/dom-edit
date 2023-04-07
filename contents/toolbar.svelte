<script context="module" lang="ts">
    import cash from 'cash-dom';
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
        return document.querySelector('body');
    };

    export const mountShadowHost: PlasmoMountShadowHost = ({ anchor, shadowHost }) => {
        anchor!.element!.insertBefore(shadowHost!, anchor!.element!.firstChild);
    };

    export const getStyle: PlasmoGetStyle = () => {
        const style = document.createElement('style');
        style.textContent = cssText;
        return style;
    };
</script>

<script lang="ts">
    import { tv } from 'tailwind-variants';

    let active = false;

    const selectableElements = cash('body *').not('plasmo-csui').not('#edit-picker');

    const toggleEdit = () => {
        if (!active) {
            // Create edit anchor (for html-editor.svelte)
            const editElement = document.createElement('div');
            editElement.id = 'edit-picker';

            cash(editElement).css({
                position: 'absolute',
                top: 0,
                left: 0
            });

            document.body.append(editElement);
        } else {
            // Remove edit anchor & clean up
            const editElement = cash('#edit-picker');
            editElement.remove();

            // Remove mousemove & click listeners
            selectableElements.off('mousemove');
            selectableElements.off('click');
        }
        active = !active;
    };

    const toggleVariant = tv({
        base: 'w-8 h-4 rounded-full relative block transition-all duration-75 ease-in-out',
        variants: {
            active: {
                true: 'bg-green-800',
                false: 'bg-red-800'
            }
        }
    });

    const innerToggleVariant = tv({
        base: 'rounded-full h-4 w-4 bg-white transition-transform duration-75 ease-out',
        variants: {
            active: {
                false: 'translate-x-0',
                true: 'translate-x-4'
            }
        }
    });
</script>

<div
    class="fixed bottom-4 left-4 items-center leading-none p-2 bg-gray-900 text-white rounded shadow-lg flex gap-4 z-50 text-sm opacity-50 hover:opacity-100 transition-opacity ease-in-out duration-150">
    <h1 class="select-none">DOM Edit</h1>

    <button class={toggleVariant({ active: active })} on:click={toggleEdit}>
        <div class={innerToggleVariant({ active: active })} />
    </button>
</div>
