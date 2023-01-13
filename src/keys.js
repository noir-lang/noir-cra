let ctrlRPressed = () => { /* noop */ }

export function useForCtrlR(ctrlRFunction) {
    ctrlRPressed = ctrlRFunction;
}

document.onkeydown = function (e) {
    e = e || window.event;

    var code = e.code | e.keyCode;

    if (e.ctrlKey) {

        switch (code) {
            case 83:
                e.preventDefault();
                e.stopPropagation();
                break;
            case 82:
                e.preventDefault();
                e.stopPropagation();
                ctrlRPressed();
                break;
            case 80:
                e.preventDefault();
                e.stopPropagation();
                ctrlRPressed();
                break;
            default:
        }

        return;
    }

    if (e.altKey) {

        switch (code) {
            case 37:
                e.preventDefault();
                e.stopPropagation();
                console.log('Blocking back navigation key shortcut')
                break;
            default:
        }

        return;

    }

};
