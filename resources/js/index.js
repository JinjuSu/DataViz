function init() {
    // Show the loading screen and hide the main content initially
    document.querySelector('.intro-container').style.display = 'none';
    document.querySelector('.loading-page').style.display = 'flex';

    // Wait for 5 seconds before showing the main content and hiding the loading screen
    setTimeout(() => {
        document.querySelector('.intro-container').style.display = 'flex';
        document.querySelector('.loading-page').classList.add('hidden');
        document.querySelector('.intro-container').classList.add('visible');
    }, 5000);

    // Add binary background animation
    const binaryContainer = document.createElement('div');
    binaryContainer.classList.add('binary-background');
    for (let i = 0; i < 100; i++) {
        const binarySpan = document.createElement('span');
        binarySpan.textContent = Math.random() > 0.5 ? '1' : '0';
        binarySpan.style.left = `${Math.random() * 100}%`;
        binarySpan.style.animationDelay = `${Math.random() * 5}s`;
        binaryContainer.appendChild(binarySpan);
    }
    document.body.appendChild(binaryContainer);
}

window.onload = init;
