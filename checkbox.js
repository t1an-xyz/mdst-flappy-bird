document.getElementById('challenge-checkbox').checked = false;

document.getElementById('challenge-checkbox').addEventListener('change', () => {
    const canvas = document.querySelector('canvas');
    canvas.setAttribute('tabindex', '0');
    canvas.focus();
});