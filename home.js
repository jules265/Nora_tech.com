document.addEventListener("DOMContentLoaded", () => {
    // Smooth scroll for navigation links
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            const targetId = event.target.getAttribute("href").substring(1);
            document.getElementById(targetId).scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    // Sticky navigation on scroll
    const nav = document.querySelector("nav");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            nav.classList.add("sticky");
        } else {
            nav.classList.remove("sticky");
        }
    });

    // Button hover effect
    const btn = document.querySelector(".btn");
    btn.addEventListener("mouseenter", () => {
        btn.style.transform = "scale(1.1)";
    });
    btn.addEventListener("mouseleave", () => {
        btn.style.transform = "scale(1)";
    });
});
