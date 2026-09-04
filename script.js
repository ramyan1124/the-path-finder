/* ================= SCROLL ANIMATION ================= */
const fades = document.querySelectorAll('.fade');

window.addEventListener('scroll', () => {
    fades.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add('show');
        }
    });
});

/* ================= PAGE NAVIGATION ================= */
function goToSuggestion() {
    window.location.href = "suggestion.html";
}
// Logout function
function logoutUser() {
    // Clear login state
    localStorage.removeItem("loggedIn");

    // Redirect to home page
    window.location.href = "index.html";
}

// Bootstrap carousel auto control (optional)
const carouselElement = document.querySelector('#careerCarousel');

if (carouselElement) {
    new bootstrap.Carousel(carouselElement, {
        interval: 3000,
        pause: 'hover'
    });
}


/* ================= CAREER ANALYSIS (MAIN LOGIC) ================= */
async function analyzeCareer() {
    const level = document.getElementById("level").value;
    const stream = document.getElementById("stream").value;
    const interest = document.getElementById("interest").value;
    const result = document.getElementById("result");

    // Validation
    if (!level || !stream || !interest) {
        result.innerHTML = `
            <p class="text-danger text-center">
                Please select all fields.
            </p>`;
        return;
    }

    // Fetch career dataset
    const response = await fetch("./data/careers.json");
    const careers = await response.json();

    // Primary match (strict)
    const primaryMatches = careers.filter(c =>
        c.education.includes(level) &&
        c.stream.includes(stream) &&
        c.interest === interest
    );

    // Alternate matches (same interest)
    const alternateMatches = careers.filter(c =>
        c.interest === interest && !primaryMatches.includes(c)
    );

    const primary = primaryMatches[0] || alternateMatches[0];

    // No match safety
    if (!primary) {
        result.innerHTML = `
            <p class="text-center">
                No suitable career found. Try different options.
            </p>`;
        return;
    }

    // Render result
    result.innerHTML = `
    <div class="flow-container">

        <!-- PRIMARY CAREER -->
        <div class="flow-card">
            <h3>${primary.career}</h3>
            <span class="tag">Recommended Career</span>
        </div>

        <!-- TIMELINE -->
        <div class="timeline">
            ${primary.roadmap.map((step, i) => `
                <div class="timeline-item">
                    <span class="dot"></span>
                    <div class="content">
                        <strong>Step ${i + 1}</strong>
                        <p>${step}</p>
                    </div>
                </div>
            `).join("")}
        </div>

        <!-- ALTERNATE CAREERS -->
        <div class="flow-card alt-card">
            <h4>Alternate Career Options</h4>
            <ul>
                ${alternateMatches.slice(0, 3).map(a =>
                    `<li>${a.career}</li>`
                ).join("")}
            </ul>
        </div>

    </div>
    `;
}

async function analyzeCareer() {
    const level = document.getElementById("level").value;
    const stream = document.getElementById("stream").value;
    const interest = document.getElementById("interest").value;
    const result = document.getElementById("result");

    /* ---------- STEP 1: VALIDATION ---------- */
    if (!level || !stream || !interest) {
        result.innerHTML = `
            <div class="alert alert-danger text-center">
                Please select Education Level, Stream, and Interest.
            </div>`;
        return;
    }

    /* ---------- STEP 2: FETCH DATA ---------- */
    let careers;
    try {
        const response = await fetch("data/careers.json");
        careers = await response.json();
    } catch (err) {
        result.innerHTML = `
            <div class="alert alert-warning text-center">
                Unable to load career data. Run using Live Server.
            </div>`;
        return;
    }

    /* ---------- STEP 3: PRIMARY MATCH ---------- */
    const primaryMatch = careers.find(career =>
        career.education.includes(level) &&
        career.stream.includes(stream) &&
        career.interest === interest
    );

    /* ---------- STEP 4: ALTERNATE MATCHES ---------- */
    const alternateMatches = careers.filter(career =>
        career.interest === interest && career !== primaryMatch
    );

    /* ---------- STEP 5: NO MATCH ---------- */
    if (!primaryMatch) {
        result.innerHTML = `
            <div class="alert alert-info text-center">
                No exact career match found. Try changing your inputs.
            </div>`;
        return;
    }

    /* ---------- STEP 6: DISPLAY RESULT ---------- */
    result.innerHTML = `
        <div class="card p-4 shadow-lg">
            <h3 class="text-primary mb-2">${primaryMatch.career}</h3>
            <p class="fw-semibold">Recommended Career Path</p>

            <hr>

            <h5>Career Roadmap</h5>
            <ol>
                ${primaryMatch.roadmap.map(step => `<li>${step}</li>`).join("")}
            </ol>

            <hr>

            <h5>Alternate Career Options</h5>
            <ul>
                ${
                    alternateMatches.length > 0
                    ? alternateMatches.map(c => `<li>${c.career}</li>`).join("")
                    : "<li>No alternate careers available</li>"
                }
            </ul>
        </div>
    `;
}
