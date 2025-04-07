// Global variables
let currentMode = 'default'; // 'default', 'random', or 'darken'
let gridSize = 16;

// DOM elements
const container = document.getElementById('container');
const gridSizeBtn = document.getElementById('grid-size-btn');
const clearBtn = document.getElementById('clear-btn');
const colorModeBtn = document.getElementById('color-mode-btn');
const darkenModeBtn = document.getElementById('darken-mode-btn');

// Initialize the grid
createGrid(gridSize);

// Event listeners
gridSizeBtn.addEventListener('click', changeGridSize);
clearBtn.addEventListener('click', clearGrid);
colorModeBtn.addEventListener('click', () => {
    currentMode = 'random';
    updateButtonStyles();
});
darkenModeBtn.addEventListener('click', () => {
    currentMode = 'darken';
    updateButtonStyles();
});

// Function to create the grid
function createGrid(size) {
    // Clear existing grid
    container.innerHTML = '';

    // Calculate square size
    const squareSize = 960 / size;

    // Create grid squares
    for (let i = 0; i < size * size; i++) {
        const square = document.createElement('div');
        square.classList.add('grid-square');
        square.style.width = `${squareSize}px`;
        square.style.height = `${squareSize}px`;

        // Store original color for darkening mode
        square.dataset.originalColor = '';
        square.dataset.darkenLevel = '0';

        // Add event listeners
        square.addEventListener('mouseover', changeColor);

        container.appendChild(square);
    }
}

// Function to change square color
function changeColor(e) {
    const square = e.target;

    switch(currentMode) {
        case 'random':
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            square.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            square.dataset.originalColor = `rgb(${r}, ${g}, ${b})`;
            square.dataset.darkenLevel = '0';
            break;

        case 'darken':
            if (square.dataset.darkenLevel < 10) {
                let originalColor = square.dataset.originalColor;

                // If no color set yet, start with white
                if (!originalColor) {
                    originalColor = 'rgb(255, 255, 255)';
                    square.dataset.originalColor = originalColor;
                }

                // Extract RGB values
                const rgb = originalColor.match(/\d+/g);
                let r = parseInt(rgb[0]);
                let g = parseInt(rgb[1]);
                let b = parseInt(rgb[2]);

                // Calculate darken amount (10% of remaining to black)
                const darkenAmount = 0.1 * (10 - square.dataset.darkenLevel);

                // Darken each channel
                r = Math.max(0, Math.floor(r * (1 - darkenAmount)));
                g = Math.max(0, Math.floor(g * (1 - darkenAmount)));
                b = Math.max(0, Math.floor(b * (1 - darkenAmount)));

                square.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                square.dataset.darkenLevel = parseInt(square.dataset.darkenLevel) + 1;
            }
            break;

        default:
            square.style.backgroundColor = '#333';
            square.dataset.originalColor = '#333';
            square.dataset.darkenLevel = '0';
    }
}

// Function to change grid size
function changeGridSize() {
    let newSize = prompt('Enter number of squares per side (max 100):', gridSize);

    // Validate input
    newSize = parseInt(newSize);
    if (isNaN(newSize) || newSize <= 0) {
        alert('Please enter a positive number');
        return;
    }

    if (newSize > 100) {
        alert('Maximum size is 100');
        newSize = 100;
    }

    gridSize = newSize;
    createGrid(gridSize);
}

// Function to clear the grid
function clearGrid() {
    const squares = document.querySelectorAll('.grid-square');
    squares.forEach(square => {
        square.style.backgroundColor = '';
        square.dataset.originalColor = '';
        square.dataset.darkenLevel = '0';
    });
}

// Function to update button styles based on current mode
function updateButtonStyles() {
    // Reset all buttons
    colorModeBtn.style.backgroundColor = '#4CAF50';
    darkenModeBtn.style.backgroundColor = '#4CAF50';

    // Highlight active mode
    if (currentMode === 'random') {
        colorModeBtn.style.backgroundColor = '#2E7D32';
    } else if (currentMode === 'darken') {
        darkenModeBtn.style.backgroundColor = '#2E7D32';
    }
}
