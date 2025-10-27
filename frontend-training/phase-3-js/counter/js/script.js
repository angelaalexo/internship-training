const counter = document.querySelector('#counter');
const increaseBtn = document.querySelector('#increase');
const decreaseBtn = document.querySelector('#decrease');
const resetBtn = document.querySelector('#reset');

let count = 0;

/* Increase number */
increaseBtn.addEventListener('click', () => {
    count++;
    updateCounter()
});

/* Decrease number */
decreaseBtn.addEventListener('click', () => {
    count--;
    updateCounter()
});

/* Reset to 0 */
resetBtn.addEventListener('click', () => {
    count=0;
    updateCounter()
});

/* Color to the text */
function updateCounter() {
    counter.textContent = count;

    if (count > 0) {
        counter.style.color = 'green';
    } else if (count < 0) {
        counter.style.color = 'red';
    } else {
        counter.style.color = 'black';
    }
}
