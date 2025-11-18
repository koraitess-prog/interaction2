// script.js - קוד סופי: 4 אובייקטים, מסך סיכום נקי, ומחזיר את Typewriter

const NUM_OBJECTS = 4; // רק 4 אובייקטים
const TOTAL_VIEWS = NUM_OBJECTS + 1; 
let currentViewIndex = 0; 
let currentImageIndex = 0; 
let typingTimeout; // 🚨 הוגדר מחדש לצורך Typewriter

// נתונים
const FILE_INDICES = [0, 1, 2, 3]; 
const OBJECT_LABELS = [
    "OBJECT 0: OLIVE TREE (WOOD)",     
    "OBJECT 1: EARTH (MODEL)",    
    "OBJECT 2: CANDLE (WAX)",     
    "OBJECT 3: HUMAN (SUBJECT)"     
];

// הוספתי תיאור ארוך ומפורט יותר כדי שהאפקט ייראה טוב יותר
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

// ------------------------------------------
// 1. UTILITY FUNCTIONS
// ------------------------------------------

// 🚨 פונקציית Typewriter חוזרת 🚨
function typewriterEffect(element, text, speed) {
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
    
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            typingTimeout = setTimeout(type, speed); 
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
    
    // 1. טעינת תמונה ראשית
    mainImage.src = getFileName(objIndex, stateIndex);
    
    // 2. הכנת אזור הטקסט
    researchTextElement.innerHTML = `
        <strong>[OBJECT DATA LOG] - ${objectLabel}</strong>
        <p>
            ${data.label} | Time: ${data.time}
        </p>
        <hr style="border-top: 1px solid #333; margin: 5px 0;">
        <div id="typewriter-output" style="color: #999; font-size: 0.9em;"></div>
    `;

    // 🚨 3. הפעלת Typewriter על התיאור הארוך 🚨
    const typewriterOutput = document.getElementById('typewriter-output');
    typewriterEffect(typewriterOutput, data.description, 15); 
    
    // 4. הדגשת התמונה הנכונה בסיידבאר
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
// 3. SUMMARY VIEW FUNCTIONS (4x4 תמונות בלבד)
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
}

// ------------------------------------------
// 4. VIEW MANAGEMENT & INITIALIZATION
// ------------------------------------------

function toggleView(index) {
    const normalView = document.getElementById('normal-view-container');
    const summaryView = document.getElementById('summary-view-container');

    if (index < NUM_OBJECTS) {
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