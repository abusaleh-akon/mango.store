// JavaScript to handle Physics-like interactions natively without breaking the CSS layout!

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Floating interaction for bottom mangoes (Anti-gravity effect)
    const bottomMangoes = document.querySelectorAll('.bottom-mango');
    
    bottomMangoes.forEach(mango => {
        // Store original inline transform (the rotation)
        const originalTransform = mango.style.transform || '';
        
        mango.addEventListener('mouseenter', () => {
            // Float up (buoyancy)
            mango.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            mango.style.transform = `translateY(-40px) scale(1.1) ${originalTransform.replace(/translateY\([^)]+\)/, '')}`;
        });
        
        mango.addEventListener('mouseleave', () => {
            // Fall back down (gravity)
            mango.style.transition = 'transform 0.6s cubic-bezier(0.5, 0, 0.2, 1)';
            mango.style.transform = originalTransform;
        });
        
        // Touch support for mobile
        mango.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent scrolling when touching mango
            mango.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            mango.style.transform = `translateY(-40px) scale(1.1) ${originalTransform.replace(/translateY\([^)]+\)/, '')}`;
        });
        
        mango.addEventListener('touchend', () => {
            mango.style.transition = 'transform 0.6s cubic-bezier(0.5, 0, 0.2, 1)';
            mango.style.transform = originalTransform;
        });
    });

    // 2. Swinging interaction for the big hanging mango
    const bigMango = document.querySelector('.big-mango');
    let isSwinging = false;
    let swingTimeout;

    function applySwing(e) {
        if (!bigMango) return;
        
        const rect = bigMango.getBoundingClientRect();
        let clientX = e.clientX;
        
        // Handle touch events
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
        }

        // Calculate position relative to center
        const xPos = clientX - rect.left - (rect.width / 2);
        
        // Calculate rotation based on where mouse/finger is
        // Pushing from left makes it swing right, etc.
        const rotation = (xPos / rect.width) * 12; // Swing up to 12 degrees
        
        bigMango.style.transition = 'transform 0.2s ease-out';
        bigMango.style.transform = `rotate(${rotation}deg)`;
        isSwinging = true;
    }

    function resetSwing() {
        if (!bigMango) return;
        // Gravity pulls it back to center like a pendulum
        bigMango.style.transition = 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        bigMango.style.transform = 'rotate(0deg)';
        isSwinging = false;
    }

    bigMango.addEventListener('mousemove', applySwing);
    bigMango.addEventListener('touchmove', (e) => {
        // e.preventDefault(); // Optional: prevent scrolling while swinging
        applySwing(e);
    }, { passive: false });

    bigMango.addEventListener('mouseleave', resetSwing);
    bigMango.addEventListener('touchend', resetSwing);
    
    // Add a natural idle sway to the big mango when not interacting
    let swayAngle = 0;
    let swayDir = 1;
    
    function idleSway() {
        if (!isSwinging) {
            swayAngle += 0.05 * swayDir;
            if (swayAngle > 2 || swayAngle < -2) swayDir *= -1;
            
            // Only apply if it's back to center (or close)
            if (bigMango.style.transform === 'rotate(0deg)' || bigMango.style.transform === '') {
                // Apply very soft sway
                bigMango.style.transition = 'transform 2s ease-in-out';
                bigMango.style.transform = `rotate(${swayAngle}deg)`;
                
                // Clear it so it loops smoothly
                setTimeout(() => {
                    if (!isSwinging) bigMango.style.transform = 'rotate(0deg)';
                }, 2000);
            }
        }
        requestAnimationFrame(idleSway);
    }
    
    // Start idle sway
    // idleSway();
});
