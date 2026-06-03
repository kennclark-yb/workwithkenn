// ============================================================================
// CONFIGURATION & PLUGINS
// ============================================================================
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// ============================================================================
// ANIMATION MODULES
// ============================================================================

/**
 * Typewriter effect for about.html
 */
function initTypewriter() {
    const p1 = "#type-part-1";
    const pLazy = "#type-lazy";
    const p2 = "#type-part-2";
    const strike = "#strike-line";
    const cursor = "#cursor";

    // Safety: Exit if typewriter elements aren't on this page
    if (!document.querySelector(p1)) return;

    const deepInk = "#013a6b";
    gsap.set(cursor, { borderColor: deepInk });

    const tl = gsap.timeline();

    tl.to(p1, {
        duration: 0.8,
        text: "I’m ",
        delay: 0.5,
        ease: "power1.inOut"
    })
        .to(pLazy, {
            duration: 0.6,
            text: "lazy",
            ease: "none"
        })
        .to({}, { duration: 2.5 })
        .to(p2, {
            duration: 1.2,
            text: " efficient.",
            ease: "power2.in"
        })
        .fromTo(strike,
            { width: "0%", left: "100%" },
            {
                width: "100%",
                left: "0%",
                duration: 0.9,
                backgroundColor: deepInk,
                ease: "power2.inOut"
            }
        )
        .to({}, { duration: 2 })
        .to(cursor, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                gsap.killTweensOf(cursor);
            }
        });

    // Independent Cursor Blink
    gsap.to(cursor, {
        opacity: 0,
        repeat: -1,
        duration: 0.6,
        ease: "steps(1)"
    });
}

/**
 * Global Reveal: Animates each element with the .reveal class individually
 */
function initScrollReveals() {
    // 1. YOUR ORIGINAL REVEAL
    const originalReveals = document.querySelectorAll(".reveal");
    if (originalReveals.length > 0) {
        originalReveals.forEach((el) => {
            gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none none"
                }
            });
        });
    }

    // 2. FADE IN (Hey! I'm Kenn)
    const fadeReveals = document.querySelectorAll(".reveal-fade");
    if (fadeReveals.length > 0) {
        fadeReveals.forEach(el => {
            gsap.to(el, {
                opacity: 1,
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: { trigger: el, start: "top 90%" }
            });
        });
    }

    // 3. SLIDE UP (Paragraphs)
    const slideReveals = document.querySelectorAll(".reveal-slide-up");
    if (slideReveals.length > 0) {
        slideReveals.forEach(el => {
            gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 92%" }
            });
        });
    }

    // 4. WIPE REVEAL (Portrait)
    const wipeReveals = document.querySelectorAll(".reveal-wipe-right");
    if (wipeReveals.length > 0) {
        wipeReveals.forEach(el => {
            gsap.fromTo(el,
                { clipPath: "inset(0% 0% 0% 100%)", opacity: 0 },
                {
                    clipPath: "inset(0% 0% 0% 0%)",
                    opacity: 1,
                    duration: 1.4,
                    ease: "expo.out",
                    scrollTrigger: { trigger: el, start: "top 80%" }
                }
            );
        });
    }
}
/**
 * Interactive "I Swear" Hover Effect
 */
function initHoverProof() {
    const trigger = document.querySelector('.hover-trigger');
    const imageContainer = document.querySelector('.hover-image-container');
    const imgTarget = document.getElementById('hover-img-target');

    if (!trigger || !imageContainer || !imgTarget) return;

    // 1. LOCK ON LOAD
    trigger.classList.add('is-locked');

    // 2. UNLOCK AFTER DELAY (Adjust 3000ms to your typewriter speed)
    setTimeout(() => {
        trigger.classList.remove('is-locked');
    }, 15000); 

    imgTarget.src = "assets/branding/cyclist-proof-1.png";

    const showImage = () => imageContainer.classList.add('visible');
    const hideImage = () => imageContainer.classList.remove('visible');

    trigger.addEventListener('mouseenter', showImage);

    trigger.addEventListener('mousemove', (e) => {
        imageContainer.style.left = `${e.clientX}px`;
        imageContainer.style.top = `${e.clientY}px`;
    });

    trigger.addEventListener('mouseleave', hideImage);

    document.addEventListener('mousemove', (e) => {
        if (!e.target.classList.contains('hover-trigger')) {
            hideImage();
        }
    });
}
/**
 * Smooth Scroll for Sidebar Dot Navigation
 */
function initDotNavScroll() {
    const dotLinks = document.querySelectorAll('.nav-dot-link');

    dotLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Prevent the default instant jump
            e.preventDefault();

            // Get the ID from the href (e.g., "#video-edit")
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Perform the smooth scroll
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });

                // Optional: Update the URL hash without jumping the page
                history.pushState(null, null, targetId);
            }
        });
    });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveals();
    initTypewriter();
    initHoverProof();
    initDotNavScroll();

    // If arriving from another page via a #hash, refresh ScrollTrigger
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                ScrollTrigger.refresh();
                // Optional: Smoothly scroll to the target if the browser jump was messy
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
});

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Run global reveals first
    initScrollReveals();

    // Run page-specific typewriter
    initTypewriter();

    initDotNavScroll();
});

// ============================================================================
// WORK TILE HOVER ANIMATIONS (Universal)
// ============================================================================

function initWorkTiles() {
    const workTiles = document.querySelectorAll('.work-tile-group');

    workTiles.forEach(tile => {
        const textContainer = tile.querySelector('.text-container');
        const gridBg = tile.querySelector('.grid-bg');
        const execTitle = tile.querySelector('.exec-title');
        const systemTitle = tile.querySelector('.system-title');
        const arrow = tile.querySelector('.arrow-circle');
        const execUnderline = tile.querySelector('.exec-underline');

        tile.addEventListener('mouseenter', () => {
            // overwrite: 'auto' kills any running 'out' animations immediately
            gsap.to(textContainer, { y: -20, duration: 0.4, ease: "power3.out", overwrite: 'auto' });
            gsap.to([execTitle, systemTitle], { color: "#2563eb", duration: 0.3, overwrite: 'auto' });
            gsap.to(gridBg, { scale: 1.15, opacity: 0.3, duration: 0.6, overwrite: 'auto' });

            gsap.fromTo(arrow,
                { opacity: 0, x: -40 },
                { opacity: 1, x: 0, duration: 0.5, ease: "back.out(1.5)", overwrite: 'auto' }
            );

            gsap.to(execUnderline, { width: "100%", duration: 0.3, ease: "expo.out", overwrite: 'auto' });
        });

        tile.addEventListener('mouseleave', () => {
            // We use overwrite: true here to force an immediate stop to all 'hover in' logic
            gsap.to(textContainer, { y: 0, duration: 0.4, ease: "power2.inOut", overwrite: true });
            gsap.to([execTitle, systemTitle], { color: "#ffffff", duration: 0.3, overwrite: true });
            gsap.to(gridBg, { scale: 1, opacity: 0.2, duration: 0.5, overwrite: true });

            // For the arrow and underline, we want them to vanish quickly
            gsap.to(arrow, { opacity: 0, x: -20, duration: 0.2, overwrite: true });
            gsap.to(execUnderline, { width: "0%", duration: 0.2, overwrite: true });
        });
    });
}
// Initialize on load
document.addEventListener('DOMContentLoaded', initWorkTiles);


// ============================================================================
// NAVIGATION SCROLL BEHAVIOR (Global)
// ============================================================================

let lastScroll = 0;

function initNavScroll() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 10) {
            nav.classList.remove('nav-hidden');
            return;
        }

        if (currentScroll > lastScroll && currentScroll > 150) {
            // Scrolling Down
            nav.classList.add('nav-hidden');
        } else if (currentScroll < lastScroll) {
            // Scrolling Up
            nav.classList.remove('nav-hidden');
        }
        lastScroll = currentScroll;
    });
}

// Ensure it runs on every page load
document.addEventListener('DOMContentLoaded', initNavScroll);


// ============================================================================
// MODAL UTILITIES
// ============================================================================

/**
 * Generic modal toggle helper
 * @param {string} modalId - The ID of the modal element
 * @param {boolean} open - true to open, false to close, undefined to toggle
 */
function toggleModal(modalId, open = undefined) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const shouldOpen = open !== undefined ? open : modal.classList.contains('hidden');

    if (shouldOpen) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

/**
 * Open/close modal with content and scale animation
 */
function setModalState(modalId, contentId, isOpen) {
    const modal = document.getElementById(modalId);
    const content = document.getElementById(contentId);

    if (!modal || !content) return;

    if (isOpen) {
        // 1. Show the parent (and its pre-rendered blur) immediately
        modal.classList.remove('opacity-0', 'pointer-events-none');

        // 2. Wait exactly two frames (roughly 32ms) to scale the box
        // This ensures the blur is already painting before the box moves
        setTimeout(() => {
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }, 30);
    } else {
        content.classList.add('scale-95');
        content.classList.remove('scale-100');
        modal.classList.add('opacity-0', 'pointer-events-none');
    }
}

function openTriage() {
    const modal = document.getElementById('triage-modal');
    const content = document.getElementById('triage-content');

    // 1. Fade in the background (Tint + Blur already active inside)
    modal.classList.remove('opacity-0', 'pointer-events-none');

    // 2. Delay the content so the background is "settled" first
    setTimeout(() => {
        content.classList.remove('opacity-0', 'scale-95');
        content.classList.add('opacity-100', 'scale-100');
    }, 150);
}

function closeTriage() {
    setModalState('triage-modal', 'triage-content', false);
}

function toggleEmailModal() {
    const modal = document.getElementById('email-modal');
    const content = document.getElementById('email-modal-content');
    const isOpening = modal.classList.contains('opacity-0');

    if (isOpening) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            content.classList.remove('opacity-0', 'scale-95');
            content.classList.add('opacity-100', 'scale-100');
        }, 50);
    } else {
        content.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            modal.classList.add('opacity-0', 'pointer-events-none');
            document.getElementById('copy-btn').innerText = 'Copy';
        }, 200);
    }
}

function toggleLinkedInModal() {
    const modal = document.getElementById('linkedin-modal');
    const content = document.getElementById('linkedin-modal-content');
    const isOpening = modal.classList.contains('opacity-0');

    if (isOpening) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            content.classList.remove('opacity-0', 'scale-95');
            content.classList.add('opacity-100', 'scale-100');
        }, 50);
    } else {
        content.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            modal.classList.add('opacity-0', 'pointer-events-none');
        }, 200);
    }
}


// ============================================================================
// OVERLAY & WORKFLOW DETAILS
// ============================================================================

function showWorkflowDetail(node) {
    const content = document.getElementById('overlayContent');
    const overlay = document.getElementById('workflowOverlay');

    if (!content || !overlay) return;

    overlay.classList.remove('hidden');
    overlay.classList.add('flex');

    if (node === 'extract') {
        content.innerHTML = `
            <div class="space-y-8 animate-in fade-in duration-700">
                <div class="flex flex-col gap-2">
                    <h2 class="text-4xl font-black tracking-tighter leading-none">Source Preparation</h2>
                    <p class="text-[13px] text-zinc-600 leading-relaxed mt-2 max-w-md">
                        Selecting and preparing the exact frames and assets needed for reconstruction.
                    </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <p class="text-[10px] font-bold uppercase opacity-70">Scene Start Reference</p>
                        <video controls class="rounded-2xl border w-full shadow-lg"><source src="assets/projects/creative/tokyo-drift/StartClip.MP4"></video>
                    </div>
                    <div class="space-y-2">
                        <p class="text-[10px] font-bold uppercase opacity-70">Scene End Reference</p>
                        <video controls class="rounded-2xl border w-full shadow-lg"><source src="assets/projects/creative/tokyo-drift/EndClip.MP4"></video>
                    </div>
                </div>
                <div class="pt-4">
                    <p class="text-[10px] font-bold uppercase opacity-70 mb-2">Replacement Asset</p>
                    <img src="assets/projects/creative/tokyo-drift/originalCarReference.PNG" class="w-full rounded-2xl border shadow-xl">
                </div>
            </div>
        `;
    }
    else if (node === 'generate') {
        content.innerHTML = `
            <div class="max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 class="text-5xl font-black tracking-tighter text-center mb-16">AI Scene Creation</h2>
                
                <div class="bg-white border-2 border-zinc-200 p-8 rounded-[2.5rem] shadow-sm">
                    <div class="flex items-center gap-3 mb-6 border-b pb-4">
                        <span class="w-3 h-3 bg-blue-600 rounded-full"></span>
                        <div class="flex flex-col">
                            <h3 class="text-sm font-bold uppercase tracking-[0.2em] leading-none">
                                01 // Source Inputs
                            </h3>
                            <!-- Subtext: Small, muted, and tracking-widest for a premium feel -->
                            <span class="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.15em] mt-1.5">
                                Reference frames and selected assets
                            </span>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-8">
                        <div class="space-y-2">
                            <p class="text-[11px] font-mono font-bold opacity-70">Source Vehicle</p>
                            <img src="assets/projects/creative/tokyo-drift/originalCarReference.PNG" class="rounded-2xl border-2 border-zinc-50 w-full shadow-md">
                        </div>
                        <div class="space-y-2">
                            <p class="text-[11px] font-mono font-bold opacity-70">Scene Reference Frame</p>
                            <img src="assets/projects/creative/tokyo-drift/input_hanOnCarReference.PNG" class="rounded-2xl border-2 border-zinc-50 w-full shadow-md">
                        </div>
                    </div>
                </div>

                <div class="flex justify-center py-4 text-blue-600 text-3xl font-bold">↓</div>

                <div class="bg-white border-2 border-zinc-200 p-8 rounded-[2.5rem] shadow-sm">
                    <div class="flex items-center gap-3 mb-6 border-b pb-4">
                        <span class="w-3 h-3 bg-yellow-400 rounded-full"></span>
                        <div class="flex flex-col">
                            <h3 class="text-sm font-bold uppercase tracking-[0.2em]">
                                02 // AI Frame Creation
                            </h3>
                            <span class="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.15em] mt-1.5">
                                Rebuilding the scene using AI prompting
                            </span>
                        </div>
                    </div>
                    <div class="space-y-6">
                        <div class="inline-flex flex-col gap-3 px-8 py-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                            <div class="flex items-center gap-3">
                                <div class="w-6 h-6 flex items-center justify-center text-lg flex-none">🍌</div>
                                <span class="text-sm font-black tracking-widest uppercase leading-none">
                                    Nano Banana Pro
                                </span>
                                <p class="text-[11px] text-zinc-500 max-w-[280px] leading-relaxed font-medium antialiased ml-9">
                                    Used AI tools with precise prompting to rebuild the scene with the new vehicle.
                                </p>
                            </div>
                        </div>
                        <div class="pt-4">
                            <p class="text-[11px] font-mono font-bold opacity-70 mb-2 uppercase text-left">AI Reconstructed Frame</p>
                            <img src="assets/projects/creative/tokyo-drift/output_carReplaced.PNG" class="rounded-2xl border-2 border-zinc-50 w-full shadow-lg">
                        </div>
                    </div>
                </div>

                <div class="flex justify-center py-4 text-blue-600 text-3xl font-bold">↓</div>

                <div class="bg-white border-2 border-zinc-200 p-8 rounded-[2.5rem] shadow-sm">
                    <div class="flex items-center gap-3 mb-6 border-b pb-4">
                        <span class="w-3 h-3 bg-black rounded-full"></span>
                        <div class="flex flex-col">
                            <h3 class="text-sm font-bold uppercase tracking-[0.2em]">
                            03 // Motion Generation
                            </h3>
                            <span class="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.15em] mt-1.5">
                                Converting the generated frame into video
                            </span>
                        </div>    
                    </div>
                    <div class="space-y-6">
                        <div class="flex items-center justify-center gap-4">
                            <div class="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white text-lg font-bold">H</div>
                            <span class="text-sm font-black tracking-widest uppercase">HIGGSFIELD AI</span>
                            <p class="text-[11px] text-zinc-500 max-w-[280px] leading-relaxed font-medium antialiased ml-9">
                                Generated motion from the reconstructed frame to match the original scene dynamics.
                            </p>
                        </div>
                        <div class="space-y-2">
                            <p class="text-[11px] font-mono font-bold opacity-70 uppercase">Original Scene Context</p>
                            <video controls class="rounded-2xl border-2 border-zinc-50 w-full aspect-video bg-black shadow-md">
                                <source src="assets/projects/creative/tokyo-drift/EndClip.MP4">
                            </video>
                        </div>
                    </div>
                </div>

                <div class="flex justify-center py-4 text-blue-600 text-3xl font-bold">↓</div>

                <div class="bg-black p-10 rounded-[2.5rem] shadow-2xl">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xs text-white font-black uppercase tracking-[0.3em]">Final Output</h3>
                        <span class="text-[10px] text-green-400 font-mono flex items-center gap-2">
                            <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Finalized
                        </span>
                    </div>
                    <video controls class="rounded-2xl w-full aspect-video shadow-2xl border border-white/10">
                        <source src="assets/projects/creative/tokyo-drift/CarReplacedClip.mp4">
                    </video>
                </div>
            </div>
        `;
    }
    else if (node === 'synthesize') {
        content.innerHTML = `
            <div class="max-w-3xl mx-auto py-8 animate-in fade-in zoom-in-95 duration-1000">
                <h2 class="text-4xl font-black tracking-tighter text-center mb-16 uppercase">Final Editing & Assembly</h2>
                
                <div class="flex flex-col items-center">
                    
                    <div class="relative group">
                        <div class="w-64 h-64 rounded-full border-2 border-zinc-200 bg-white p-2 overflow-hidden shadow-md flex flex-col items-center justify-center text-center">
                            <img src="assets/projects/creative/tokyo-drift/output_carReplaced.PNG" class="absolute inset-0 w-full h-full object-cover opacity-10 blur-[4px] scale-110">
                            
                            <div class="relative z-10 p-4">
                                <span class="text-[9px] font-black text-blue-600 uppercase tracking-widest block mb-2">Base Clip</span>
                                
                                <div class="w-32 h-32 rounded-full overflow-hidden border-2 border-white shadow-lg mx-auto bg-black">
                                    <video autoplay muted loop playsinline class="w-full h-full object-cover">
                                        <source src="assets/projects/creative/tokyo-drift/CarReplacedClip.mp4" type="video/mp4">
                                    </video>
                                </div>
                                <p class="mt-2 text-[9px] font-mono font-bold opacity-70 uppercase">Selected Scene</p>
                            </div>
                        </div>
                    </div>

                    <div class="py-4">
                        <svg class="w-8 h-12" viewBox="0 0 24 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0V44M12 44L6 38M12 44L18 38" stroke="url(#arrowGradient)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            <defs>
                                <linearGradient id="arrowGradient" x1="12" y1="0" x2="12" y2="44" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#2563eb"/>
                                    <stop offset="1" stop-color="#8b5cf6"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <div class="relative">
                        <div class="absolute inset-0 -m-4 border-2 border-dashed border-blue-100 rounded-full animate-[spin_30s_linear_infinite] opacity-70"></div>
                        <div class="relative p-1.5 bg-gradient-to-tr from-blue-600 via-purple-500 to-blue-400 rounded-full shadow-2xl scale-105">
                            <div class="bg-white w-72 h-72 rounded-full flex flex-col items-center justify-center shadow-inner border border-white/20">
                                <img src="assets/projects/creative/tokyo-drift/DaVinciResolve_logo.png" class="w-24 h-24 object-contain drop-shadow-xl">
                                <div class="text-center mt-4">
                                    <h3 class="text-xs font-black uppercase tracking-[0.2em]">Da Vinci Resolve</h3>
                                    <div class="flex gap-1.5 mt-3 justify-center">
                                        <span class="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                                        <span class="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                                        <span class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="py-4">
                        <svg class="w-8 h-12" viewBox="0 0 24 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0V44M12 44L6 38M12 44L18 38" stroke="url(#arrowGradient2)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            <defs>
                                <linearGradient id="arrowGradient2" x1="12" y1="0" x2="12" y2="44" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#8b5cf6"/>
                                    <stop offset="1" stop-color="#2563eb"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <div class="relative group">
                        <div class="w-80 h-80 rounded-full border-4 border-black bg-black overflow-hidden shadow-2xl flex items-center justify-center relative ring-4 ring-zinc-50">
                             <video autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover opacity-60">
                                <source src="assets/projects/creative/tokyo-drift/TokyoDriftAiEdit.mp4">
                            </video>
                            <div class="relative z-10 text-center p-8 bg-black/40 backdrop-blur-sm rounded-full border border-white/10">
                                <span class="text-[9px] text-blue-400 font-mono tracking-widest uppercase mb-1 block">Final</span>
                                <p class="text-[12px] text-white font-black uppercase tracking-tighter">Video Edit</p>
                                <div class="mt-4 flex justify-center">
                                    <div class="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center bg-white/10">
                                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                
            </div>
        `;
    }
    else if (node === 'deploy') {
        content.innerHTML = `
            <div class="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                <div class="flex justify-between items-end border-b-2 border-zinc-200 pb-6">
                    <div>
                        <h2 class="text-4xl font-black tracking-tighter uppercase">Performance & Results</h2>
                        <p class="text-[12px] font-mono text-blue-600 mt-1 uppercase tracking-widest font-bold">
                            Reached new audiences and sustained viewer attention
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
                    <div class="p-6 bg-blue-600 rounded-[2rem] text-white shadow-xl flex flex-col justify-center">
                        <p class="text-[11px] font-bold opacity-70 uppercase mb-1">Audience Reach</p>
                        <p class="text-3xl font-black tracking-tighter italic">90.8%</p>
                        <p class="text-[10px] font-mono mt-1 opacity-60 uppercase">Discovered through Reels & Explore</p>
                    </div>
                    <div class="p-6 bg-zinc-900 rounded-[2rem] text-white shadow-xl flex flex-col justify-center">
                        <p class="text-[11px] font-bold opacity-70 uppercase mb-1 text-blue-400">Average Watch Time</p>
                        <p class="text-3xl font-black tracking-tighter italic text-white">10.0s</p>
                        <p class="text-[10px] font-mono mt-1 opacity-70 uppercase text-white/60">Strong viewer retention</p>
                    </div>
                    <div class="p-6 bg-zinc-200 border-2 border-zinc-200 rounded-[2rem] text-black flex flex-col justify-center shadow-inner">
                        <p class="text-[11px] font-black opacity-50 uppercase mb-1">Non-Follower Reach</p>
                        <p class="text-3xl font-black tracking-tighter italic text-green-600">96.2%</p>
                        <p class="text-[10px] font-mono mt-1 opacity-70 uppercase">Viewed mostly by new audiences</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <div class="lg:col-span-7 bg-zinc-900 p-8 rounded-[2.5rem] border border-white/10 flex flex-col">
                        <h4 class="text-[11px] font-mono text-blue-400 tracking-[0.4em] uppercase mb-6">Where Views Came From</h4>
                        <div class="rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex-1">
                            <img src="assets/projects/creative/tokyo-drift/metrics/top-views-srcs.PNG" 
                                 class="w-full opacity-90 hover:opacity-100 transition-all duration-500 metrics-img-glow">
                        </div>
                        <p class="text-[11px] text-white/40 mt-6 italic font-mono leading-relaxed border-t border-white/5 pt-4">
                            Distributed to new audiences through Reels and Explore
                        </p>
                    </div>

                    <div class="lg:col-span-5 bg-white border-2 border-zinc-200 p-8 rounded-[2.5rem] shadow-sm flex flex-col">
                        <h3 class="text-[12px] font-mono text-zinc-700 tracking-[0.4em] uppercase mb-4">What Made <br>People Watch</h3>
                        <div class="rounded-xl overflow-hidden border border-zinc-200 mb-4">
                            <img src="assets/projects/creative/tokyo-drift/metrics/what-impcts-ur-views.PNG" 
                                 class="w-full opacity-90 hover:opacity-100 transition-all duration-500 metrics-img-glow">
                        </div>
                        <div class="space-y-3 flex-1 font-medium">
                            <div class="flex justify-between border-b border-zinc-50 pb-1">
                                <span class="text-[9px] font-black uppercase text-zinc-400">Skip Rate</span>
                                <span class="text-xs font-black italic">39.4%</span>
                            </div>
                            <div class="flex justify-between border-b border-zinc-50 pb-1">
                                <span class="text-[9px] font-black uppercase text-zinc-400">Shares</span>
                                <span class="text-xs font-black italic text-blue-600">12</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-[9px] font-black uppercase text-zinc-400">Saves</span>
                                <span class="text-xs font-black italic text-purple-600">5</span>
                            </div>
                        </div>
                        <p class="text-[11px] text-zinc-400 mt-6 italic font-medium pt-4 border-t border-zinc-200">
                            Low skip rate and strong engagement signals
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <div class="lg:col-span-6 bg-zinc-200 border-2 border-zinc-200 p-8 rounded-[2.5rem] flex flex-col">
                         <h4 class="text-[12px] font-mono text-zinc-700 tracking-[0.4em] uppercase mb-6">Viewer Retention</h4>
                         <div class="rounded-2xl overflow-hidden shadow-lg border-2 border-white flex-1">
                            <img src="assets/projects/creative/tokyo-drift/metrics/how-long-ppl-watchd.PNG" 
                                 class="w-full opacity-90 hover:opacity-100 transition-all duration-500 metrics-img-glow">
                        </div>
                        <p class="text-[11px] text-zinc-700 mt-6 italic font-mono border-t border-zinc-200 pt-4">
                            Most viewers stayed through a large portion of the video
                        </p>
                    </div>

                    <div class="lg:col-span-6 bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-center">
                        <div class="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/10 blur-[60px]"></div>
                        <h4 class="text-[12px] font-mono text-blue-400 tracking-[0.4em] uppercase mb-4 opacity-60">Performance Summary</h4>
                        <p class="text-[14px] text-white/90 leading-relaxed font-medium italic">
                            This edit successfully reached new audiences and maintained strong viewer attention. 
                            It achieved a <span class="text-blue-400 font-bold underline decoration-blue-400/30 underline-offset-4">90.8% Discovery Rate</span>, 
                            with viewers watching an average of <span class="text-white font-black">10 seconds</span> and a high percentage choosing not to skip 
                            <span class="text-white font-black">(60.6%)</span>.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
    else if (node === 'growth_temporal') {
        content.innerHTML = `
            <div class="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div class="border-l-4 border-blue-600 pl-6">
                    <h2 class="text-4xl font-black tracking-tighter uppercase text-black">PERFORMANCE_AUDIT</h2>
                    <p class="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Asset_ID: FEB_14_CYCLING</p>
                </div>

                <div class="bg-zinc-200 border-2 border-zinc-200 p-8 rounded-[2.5rem]">
                    <div class="max-w-2xl mx-auto text-center py-2">
                        <h3 class="text-[12px] font-mono font-black text-zinc-600 tracking-[0.4em] uppercase mb-4">Strategic Premise</h3>
                        <p class="text-xl italic leading-tight text-zinc-800">
                            Timing a relatable concept around a high-traffic calendar moment can outperform typical reach constraints for small accounts.
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    <div class="lg:col-span-7 space-y-6">
                        <div class="bg-zinc-900 p-6 rounded-[2rem] border border-white/10">
                            <h4 class="text-[12px] font-mono font-black text-blue-400 tracking-[0.4em] uppercase mb-4 text-center">Discovery Sources</h4>
                            <img src="assets/projects/creative/feb-14-cycling/cycling-top-srcs-views.PNG" class="w-full rounded-xl opacity-90">
                            <p class="text-[12px] text-white/60 mt-4 italic text-center">84.4% Reels Tab success indicates strong algorithmic distribution</p>
                        </div>

                        <div class="bg-white border-2 border-zinc-200 p-6 rounded-[2rem]">
                            <h4 class="text-[12px] font-mono font-black text-blue-700 tracking-[0.4em] uppercase mb-4 text-center">Skip Rate Comparison</h4>
                            <img src="assets/projects/creative/feb-14-cycling/cycling-skip-rate.PNG" class="w-full rounded-xl">
                            <p class="text-[12px] text-zinc-700 mt-4 italic text-center">Lower skip rate compared to baseline indicates a stronger opening hook</p>
                        </div>
                    </div>

                    <div class="lg:col-span-5 flex flex-col gap-6">
                        <div class="bg-zinc-200 border-2 border-zinc-200 p-6 rounded-[2rem] flex-1">
                            <h4 class="text-[12px] font-mono font-black text-blue-500 tracking-[0.4em] uppercase mb-12 text-center">Retention Curve</h4>
                            <img src="assets/projects/creative/feb-14-cycling/cycling-retention.PNG" class="w-full rounded-xl shadow-md">
                            <p class="text-[12px] text-zinc-800 mt-12 italic text-center text-balance">Retention remained consistent across most of the clip duration 11 seconds out of 14 seconds duration</p>
                        </div>

                        <div class="bg-zinc-900 p-6 rounded-[2rem] text-white">
                            <h4 class="text-[12px] font-mono font-black text-blue-400 tracking-[0.4em] uppercase mb-4">Cross-Platform Validation</h4>
                            <div class="space-y-2 border-b border-white/5 pb-4 mb-4">
                                <div class="flex justify-between text-xs">
                                    <span class="opacity-70 uppercase">Facebook Views</span>
                                    <span class="font-black italic">1,624</span>
                                </div>
                                <div class="flex justify-between text-xs">
                                    <span class="opacity-70 uppercase">Facebook Reactions</span>
                                    <span class="font-black italic">40</span>
                                </div>
                            </div>
                            <p class="text-[11px] text-white/60 italic leading-relaxed">
                                Performance carried over to another platform, indicating the concept works beyond a single algorithm
                            </p>
                        </div>
                    </div>
                </div>

                <div class="bg-blue-600 p-8 rounded-[2.5rem] shadow-xl text-white">
                    <div class="max-w-3xl mx-auto text-center py-2">
                        <div>
                            <h4 class="text-[12px] font-mono font-black text-[#00F2FF] tracking-[0.4em] uppercase mb-4">Conclusion // Strategy Validation</h4>
                            <p class="text-base font-medium leading-relaxed italic">
                                Identified an emerging trend ahead of February 14 and built a concept around a familiar question, introducing a cycling-specific twist.
                                Timed deployment during the peak window resulted in strong distribution, reaching primarily non-followers and generating a high reach-to-follower ratio.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    else if (node === 'growth_retention') {
        content.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div class="border-l-4 border-purple-600 pl-6">
                <h2 class="text-4xl font-black tracking-tighter uppercase text-black">Production_Audit</h2>
                <p class="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Asset_ID: CEBU_DUMA_LONGFORM</p>
            </div>

            <div class="bg-zinc-200 p-8 rounded-3xl border border-zinc-200">
                <h3 class="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Section_01 // The Creative Brief</h3>
                <p class="text-lg font-medium leading-relaxed italic text-zinc-800">
                    <b>Objective</b>: Create a lasting visual record of a multi-city trip.<br>
                    <b>Requirement</b>: Balance dynamic pacing with meaningful storytelling to keep it rewatchable.
                </p>
            </div>

            <div class="space-y-10">
                <h3 class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Section_02 // Technical Evidence</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-3">
                        <img src="assets/projects/creative/day-trip/day-trip-thumbnail.png" class="rounded-2xl shadow-lg border border-zinc-200">
                        <p class="text-[13px] leading-relaxed text-zinc-600 font-medium">
                            <strong class="text-black">Visual Hook Strategy:</strong> High-contrast typography used to establish immediate context and attract the right audience.
                        </p>
                    </div>
                    <div class="space-y-3">
                        <img src="assets/projects/creative/day-trip/gender-distribution.PNG" class="rounded-2xl shadow-lg border border-zinc-200">
                        <p class="text-[13px] leading-relaxed text-zinc-600 font-medium">
                            <strong class="text-black">Balanced Audience:</strong> 49.2% men and 50.8% women, indicating strong broad appeal.
                        </p>
                    </div>
                </div>

                <div class="max-w-2xl mx-auto space-y-3">
                    <img src="assets/projects/creative/day-trip/intent-overview.PNG" class="rounded-2xl shadow-lg border border-zinc-200 w-full">
                    <p class="text-[13px] leading-relaxed text-zinc-600 font-medium text-center">
                        <strong class="text-black">Stakeholder Validation:</strong> 7.6% engagement rate, indicating strong audience connection and narrative resonance.
                    </p>
                </div>
            </div>

            <div class="border-y border-zinc-200 py-8 text-center">
                <p class="text-zinc-400 text-xs uppercase tracking-widest mb-4 italic">Client_Sentiment</p>
                <blockquote class="text-2xl font-bold tracking-tight text-black">
                    “The jump cuts were perfectly synced to the rhythm and really captured the group's energy. Definitely rewatchable.”
                </blockquote>
            </div>

            <div class="bg-black text-white p-10 rounded-[2.5rem] space-y-4 shadow-2xl">
                <h4 class="text-purple-400 font-mono text-[13px] font-bold uppercase tracking-[0.4em]">[STRATEGY_VALIDATION]</h4>
                <p class="text-sm font-medium leading-relaxed opacity-90">
                    Documented a multi-city trip through long-form editing, showcasing landscapes and key activities in a narrative-driven format. 
                    Prioritized compelling storytelling over viral optimization, achieving strong engagement and creating a rewatchable piece that 
                    serves as both shareable content and a visual record.
                </p>
            </div>
        </div>
    `;
    }
}

function closeOverlay() {
    toggleModal('workflowOverlay');
}


// ============================================================================
// VIDEO CONTROLS
// ============================================================================

function toggleVideoSound(videoElement) {
    videoElement.muted = !videoElement.muted;
    console.log("Audio state:", videoElement.muted ? "Muted" : "Unmuted");
}


// ============================================================================
// COMPARISON SLIDER
// ============================================================================

function moveSlider(e) {
    const sliderValue = e.value + '%';
    const container = e.closest('.comparison-slider-wrapper');

    if (container) {
        container.style.setProperty('--split', sliderValue);
    }
}


// ============================================================================
// EMAIL & CONTACT UTILITIES
// ============================================================================

function copyEmail(emailString = "kennclark.yb@gmail.com") {
    const toast = document.getElementById('copy-toast');

    navigator.clipboard.writeText(emailString).then(() => {
        // If the toast element exists on this page, show it
        if (toast) {
            // 1. Reveal: Remove the "up" offset (-translate-y-4) and add "zero" (translate-y-0)
            toast.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
            toast.classList.add('opacity-100', 'translate-y-0');

            setTimeout(() => {
                // 2. Hide: Slide back up to the ceiling
                toast.classList.add('opacity-0', '-translate-y-4');
                toast.classList.remove('opacity-100', 'translate-y-0');

                // 3. Reset pointer events after the 500ms transition finishes
                setTimeout(() => {
                    toast.classList.add('pointer-events-none');
                }, 500);
            }, 2000);
        }

        // This keeps your existing button-flip logic working if those IDs exist
        const btn = document.getElementById('copy-btn');
        if (btn) {
            const originalText = btn.innerText;
            btn.innerText = 'Copied';
            btn.classList.replace('bg-zinc-900', 'bg-blue-600');
            setTimeout(() => {
                btn.innerText = originalText;
                btn.classList.replace('bg-blue-600', 'bg-zinc-900');
            }, 2000);
        }
    });
}


// ============================================================================
// KEYBOARD & CLICK EVENT HANDLERS
// ============================================================================

window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        // Close workflow overlay
        const workflowOverlay = document.getElementById('workflowOverlay');
        if (workflowOverlay && !workflowOverlay.classList.contains('hidden')) {
            toggleModal('workflowOverlay');
        }

        // Close email modal
        const emailModal = document.getElementById('email-modal');
        if (emailModal && !emailModal.classList.contains('hidden')) {
            toggleEmailModal();
        }

        // Close LinkedIn modal
        const liModal = document.getElementById('linkedin-modal');
        if (liModal && !liModal.classList.contains('hidden')) {
            toggleLinkedInModal();
        }

        // Close triage modal
        const triageModal = document.getElementById('triage-modal');
        if (triageModal && !triageModal.classList.contains('hidden')) {
            closeTriage();
        }
    }
});

window.addEventListener('click', (event) => {
    const emailModal = document.getElementById('email-modal');
    const liModal = document.getElementById('linkedin-modal');

    // Close modals when clicking on the background overlay
    // Check if modal is visible (not hidden) before closing
    if (emailModal && !emailModal.classList.contains('hidden') && event.target === emailModal) {
        toggleEmailModal();
    }
    if (liModal && !liModal.classList.contains('hidden') && event.target === liModal) {
        toggleLinkedInModal();
    }
});


// ============================================================================
// ANCHOR NAVIGATION - Scroll to hash on page load
// ============================================================================

function scrollToAnchor() {
    const hash = window.location.hash.slice(1); // Remove the # symbol

    if (hash) {
        const target = document.getElementById(hash);

        if (target) {
            // Wait for all images and content to load before scrolling
            if (document.readyState === 'loading') {
                window.addEventListener('load', () => {
                    target.scrollIntoView({ behavior: 'auto', block: 'start' });
                }, { once: true });
            } else {
                // Page already loaded, scroll immediately
                target.scrollIntoView({ behavior: 'auto', block: 'start' });
            }
        }
    }
}

// Scroll to anchor when page loads
window.addEventListener('DOMContentLoaded', scrollToAnchor);

// Also handle hash changes (if user clicks anchor links on the same page)
window.addEventListener('hashchange', scrollToAnchor);

// ============================================================================
// ACTIVE PAGE PERSISTENCE
// ============================================================================

function updateActiveNav() {
    // Get current filename (e.g., 'about.html') or default to index
    const path = window.location.pathname;
    const page = path.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.nav-pill');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Remove existing active classes first to ensure a clean state
        link.classList.remove('active-nav');

        // Check if the link matches the current page
        // Logic handles both direct page links and index hash links
        if (href === page) {
            link.classList.add('active-nav');
        } else if (page === "index.html" && href.includes("#work") && window.location.hash === "#work") {
            link.classList.add('active-nav');
        }
    });
}

// Run on initial load
window.addEventListener('DOMContentLoaded', updateActiveNav);
// Update if the user clicks a hash link on the same page
window.addEventListener('hashchange', updateActiveNav);

// ============================================================================
// INDEX-SPECIFIC NAV HIGHLIGHTING
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    const workSection = document.getElementById('work');
    // This looks for any <a> tag whose href ends with #work
    const workLink = document.querySelector('a[href$="#work"]');

    if (workSection && workLink) {
        const observerOptions = {
            root: null,
            threshold: 0.3, // Highlights when 30% of the section is visible
            rootMargin: "0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Activate the blue pill style from your CSS
                    workLink.classList.add('active-nav');
                } else {
                    // Remove highlight when scrolling up to the portrait/hero
                    workLink.classList.remove('active-nav');
                }
            });
        }, observerOptions);

        observer.observe(workSection);
    }
});
