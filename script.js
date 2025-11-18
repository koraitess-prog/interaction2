// script.js - קוד סופי: 4 אובייקטים, Typewriter ב-Main View וב-Summary, מיפוי קבצים נכון

const NUM_OBJECTS = 4; // 4 אובייקטים
const TOTAL_VIEWS = NUM_OBJECTS + 1; // 4 אובייקטים + 1 סיכום
let currentViewIndex = 0; 
let currentImageIndex = 0; 
let typingTimeout; // טיימר לטקסט ב-Main View
let summaryTypingTimeout; // טיימר לטקסט ב-Summary View

// 🚨 המיפוי הסופי והמדויק 🚨
const FILE_INDICES = [
    0, // שורה 1 (עץ) משתמשת ב-object0
    1, // שורה 2 (כדור הארץ) משתמשת ב-object1
    3, // שורה 3 (אדם) משתמשת ב-object3
    2  // שורה 4 (נר) משתמשת ב-object2
];

const OBJECT_LABELS = [
    "OBJECT 0: OLIVE TREE (WOOD)",     
    "OBJECT 1: EARTH (MODEL)", 
    "OBJECT 2: HUMAN (SUBJECT)",     
    "OBJECT 3: CANDLE (WAX)"
];

const STATE_DATA = [
    { 
        label: "CLEAN (Baseline)", time: "0 Years", fileSuffix: "clean", 
        description: "Initial state. Minimal decay level, structural integrity and original color maintained. Measured strong resistance to extreme environmental conditions. The object is stable. Factor: 1.00x." 
    },
    { 
        label: "RUST-1 (Early Stage)", time: "1-5 Years", fileSuffix: "rust1",
        description: "Onset of oxidation reaction. Slight change in color hue (RGB Shift 15%). Surface shows localized pattern of early-stage corrosion and minor detail blurring. Factor: 1.85x."
    },
    { 
        label: "RUST-2 (Advanced Corrosion)", time: "5-15 Years", fileSuffix: "rust2",
        description: "Advanced corrosion observed. Significant loss of natural pigments and slight deformation. Decay has reached a measurable level in the material's secondary layer. Factor: 2.50x."
    },
    { 
        label: "RUST-3 (Maximum Decay)", time: "15-30+ Years", fileSuffix: "rust3",
        description: "Maximum decay observed. Internal structure is exposed. Color pattern shifts towards dark red-brown tones. Complete structural instability and substantial detail loss. Factor: 3.50x."
    }
];

const SCIENTIFIC_SUMMARY_TEXT = `
[DECAY ANALYSIS PROTOCOL - FINAL REPORT]

The decay array test successfully mapped the corrosion lifecycle across four distinct material categories (Wood, Model, Human, Wax).

**Oxidation & Rust Phases:**
Rust is the common term for iron oxide (Fe2O3), formed when iron reacts with oxygen and water. While the objects in this array represent varied base materials, the 'Rust' stages are used as a proxy for generalized material degradation due to exposure.

**PHASE I: CLEAN (Baseline)**
Oxidation Percentage: 0.0%
Structural Integrity: 100%
Characteristics: All objects maintained original spectral data. No measurable texture or molecular degradation.

**PHASE II: RUST-1 (Early Stage)**
Oxidation Percentage: 15-35%
Structural Integrity: 95%
Characteristics: Onset of molecular breakdown. Initial color shift is detectable, primarily in the UV spectrum. Surface corrosion is localized and highly dependent on material composition.

**PHASE III: RUST-2 (Advanced Corrosion)**
Oxidation Percentage: 35-75%
Structural Integrity: 70%
Characteristics: Advanced exposure leading to deep pigment loss and physical deformation. Decay penetrates the secondary structural layer, visible as blurring and erosion of fine details. Factor increase correlates directly with environmental temperature instability.

**PHASE IV: RUST-3 (Maximum Decay)**
Oxidation Percentage: 75-100%
Structural Integrity: <50%
Characteristics: Critical structural failure. Complete loss of original color profile. Exposed internal material structure. Total integrity compromised, representing the end-state of the observed decay cycle.
`;


// ------------------------------------------
// 1. UTILITY FUNCTIONS
// ------------------------------------------

function typewriterEffect(element, text, speed, timerRef) {
    if (timerRef === 'main') {
        if (typingTimeout) clearTimeout(typingTimeout);
    } else if (timerRef === 'summary') {
        if (summaryTypingTimeout) clearTimeout(summaryTypingTimeout);
    }
    
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            let timeoutID = setTimeout(type, speed); 
            if (timerRef === 'main') {
                typingTimeout = timeoutID;
            } else if (timerRef === 'summary') {
                summaryTypingTimeout = timeoutID;
            }
        }
    }
    type();
}

function getFileName(objIndex, stateIndex) {
    const suffix = STATE_DATA[stateIndex].fileSuffix;
    const fileNumber = FILE_INDICES[objIndex]; 
    return `object${fileNumber}_${suffix}.png`;
}

// ------------------------------------------
// 2. MAIN VIEW FUNCTIONS 
// ------------------------------------------

function updateMainDisplay(objIndex, stateIndex) {
    const data = STATE_DATA[stateIndex];
    const objectLabel = OBJECT_LABELS[objIndex];
    const mainImage = document.getElementById('main-image');
    const researchTextElement = document.getElementById('research-text');

    currentImageIndex = stateIndex;
    
    // שימוש ב-getFileName עם שמות הקבצים המדויקים
    mainImage.src = getFileName(objIndex, stateIndex); 
    
    researchTextElement.innerHTML = `
        <strong>[OBJECT DATA LOG] - ${objectLabel}</strong>
        <p>
            ${data.label} | Time: ${data.time}
        </p>
        <hr style="border-top: 1px solid #333; margin: 5px 0;">
        <div id="typewriter-output" style="color: #999; font-size: 0.9em;"></div>
    `;

    const typewriterOutput = document.getElementById('typewriter-output');
    typewriterEffect(typewriterOutput, data.description, 15, 'main'); 
    
    document.querySelectorAll('.thumb-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeThumb = document.querySelector(`.thumb-item[data-state='${stateIndex}']`);
    if (activeThumb) {
        activeThumb.classList.add('active');
    }
}

function buildSidebar(objIndex) {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = ''; 
    
    STATE_DATA.forEach((data, stateIndex) => {
        const item = document.createElement('div');
        item.classList.add('thumb-item');
        item.dataset.state = stateIndex;
        
        const img = document.createElement('img');
        img.src = getFileName(objIndex, stateIndex);
        img.alt = data.label;

        item.appendChild(img);
        
        item.addEventListener('click', () => {
            currentViewIndex = objIndex; 
            updateMainDisplay(objIndex, stateIndex);
        });
        
        sidebar.appendChild(item);
    });
}


// ------------------------------------------
// 3. SUMMARY VIEW FUNCTIONS
// ------------------------------------------

function buildSummaryGrid() {
    const grid = document.getElementById('summary-grid');
    grid.innerHTML = '';

    let summaryHTML = '';

    OBJECT_LABELS.forEach((label, objIndex) => {
        STATE_DATA.forEach((state, stateIndex) => {
            const fileName = getFileName(objIndex, stateIndex);
            
            summaryHTML += `
                <div class="summary-cell">
                    <div class="summary-image-wrapper">
                        <img src="${fileName}" alt="${label} - ${state.label}">
                    </div>
                </div>
            `;
        });
    });
    
    grid.innerHTML = summaryHTML;
    
    const summaryTextElement = document.getElementById('summary-info-text');
    typewriterEffect(summaryTextElement, SCIENTIFIC_SUMMARY_TEXT.trim(), 15, 'summary');
}

// ------------------------------------------
// 4. VIEW MANAGEMENT & INITIALIZATION
// ------------------------------------------

function toggleView(index) {
    const normalView = document.getElementById('normal-view-container');
    const summaryView = document.getElementById('summary-view-container');

    if (index < NUM_OBJECTS) {
        if (summaryTypingTimeout) clearTimeout(summaryTypingTimeout);
        normalView.classList.remove('hidden');
        summaryView.classList.add('hidden');
        cycleToObject(index);
    } else {
        summaryView.classList.remove('hidden');
        normalView.classList.add('hidden');
        buildSummaryGrid();
    }
}

function cycleView() {
    currentViewIndex = (currentViewIndex + 1) % TOTAL_VIEWS;
    toggleView(currentViewIndex);
}

document.getElementById('normal-view-container').addEventListener('dblclick', cycleView);
document.getElementById('summary-view-container').addEventListener('dblclick', () => {
    currentViewIndex = 0;
    toggleView(currentViewIndex);
});

function cycleToObject(newIndex) {
    currentObjectIndex = newIndex;
    buildSidebar(currentObjectIndex);
    updateMainDisplay(currentObjectIndex, 0); 
}

toggleView(0);