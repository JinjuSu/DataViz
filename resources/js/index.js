function init() {
    // Show the loading screen and hide the main content initially
    document.querySelector('.intro-container').style.display = 'none'; // Hide the main content
    document.querySelector('.loading-page').style.display = 'flex';    // Display the loading screen

    // Wait for 5 seconds before showing the main content and hiding the loading screen
    setTimeout(() => {
        document.querySelector('.intro-container').style.display = 'flex'; // Show the main content
        document.querySelector('.loading-page').classList.add('hidden');   // Hide the loading screen with a fade-out effect
        document.querySelector('.intro-container').classList.add('visible'); // Make the main content visible with a fade-in effect
    }, 5000);

    // Add binary background animation
    const binaryContainer = document.createElement('div'); // Create a new div element for the binary background
    binaryContainer.classList.add('binary-background'); // Add a class to style the binary background

    // Create 100 binary elements (0s and 1s) and add them to the binaryContainer
    for (let i = 0; i < 100; i++) {
        const binarySpan = document.createElement('span'); // Create a new span element for each binary character
        binarySpan.textContent = Math.random() > 0.5 ? '1' : '0'; // Randomly set the text content to '0' or '1'
        binarySpan.style.left = `${Math.random() * 100}%`; // Randomly position the span horizontally within the container
        binarySpan.style.animationDelay = `${Math.random() * 5}s`; // Randomly set an animation delay for the span
        binaryContainer.appendChild(binarySpan); // Add the span to the binaryContainer
    }

    // Append the binaryContainer to the body of the document
    document.body.appendChild(binaryContainer);
}

// Call the init function when the window loads
window.onload = init;
