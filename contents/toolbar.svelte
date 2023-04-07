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
</script>

<div
    class="fixed bottom-4 left-1/2 items-center leading-none -translate-x-1/2 p-4 bg-gray-900 text-white rounded shadow-lg flex gap-4 z-50">
    <h1>HTML Edit</h1>
    <button class="p-2 border rounded" on:click={toggleEdit}>Edit</button>
</div>
