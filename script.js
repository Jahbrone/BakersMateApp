/* =========================
   INPUT ELEMENTS
========================= */

const inputs = {
  flour: document.getElementById("flour"),
  hydration: document.getElementById("hydration"),
  salt: document.getElementById("salt"),
  yeast: document.getElementById("yeast"),
  oil: document.getElementById("oil"),
  sugar: document.getElementById("sugar"),
};

/* =========================
   TOGGLE ELEMENTS
========================= */

const toggles = {
  yeast: document.getElementById("yeastToggle"),
  oil: document.getElementById("oilToggle"),
  sugar: document.getElementById("sugarToggle"),
};

/* =========================
   OPTIONAL FIELD ELEMENTS
========================= */

const fields = {
  yeast: document.getElementById("yeastField"),
  oil: document.getElementById("oilField"),
  sugar: document.getElementById("sugarField"),
};

/* =========================
   OUTPUT ELEMENTS
========================= */

const outputs = {
  flourAmount: document.getElementById("flourAmount"),
  waterAmount: document.getElementById("waterAmount"),
  saltAmount: document.getElementById("saltAmount"),
  yeastAmount: document.getElementById("yeastAmount"),
  oilAmount: document.getElementById("oilAmount"),
  sugarAmount: document.getElementById("sugarAmount"),
  totalDough: document.getElementById("totalDough"),
};

/* =========================
   VIEW ELEMENTS
========================= */

const calculatorView = document.getElementById("calculatorView");
const presetsView = document.getElementById("presetsView");
const presetDetailView = document.getElementById("presetDetailView");

const calculatorTab = document.getElementById("calculatorTab");
const presetsTab = document.getElementById("presetsTab");

/* =========================
   RESET BUTTON
========================= */

const resetButton = document.getElementById("resetButton");

/* =========================
   PRESET STATE
========================= */

let activePresetKey = null;
let activeSizeKey = null;

/* =========================
   HELPER FUNCTIONS
========================= */

function getNumber(input) {
  const value = Number(input.value);
  return Number.isFinite(value) ? value : 0;
}

function formatGrams(value) {
  const rounded = Math.round(value * 10) / 10;

  if (Number.isInteger(rounded)) {
    return `${rounded}g`;
  }

  return `${rounded.toFixed(1)}g`;
}

function isEnabled(ingredient) {
  return toggles[ingredient].checked;
}

/* =========================
   MAIN CALCULATION
========================= */

function calculateDough() {
  const flour = getNumber(inputs.flour);
  const hydration = getNumber(inputs.hydration);
  const saltPercent = getNumber(inputs.salt);

  const yeastPercent = isEnabled("yeast") ? getNumber(inputs.yeast) : 0;
  const oilPercent = isEnabled("oil") ? getNumber(inputs.oil) : 0;
  const sugarPercent = isEnabled("sugar") ? getNumber(inputs.sugar) : 0;

  const water = flour * (hydration / 100);
  const salt = flour * (saltPercent / 100);
  const yeast = flour * (yeastPercent / 100);
  const oil = flour * (oilPercent / 100);
  const sugar = flour * (sugarPercent / 100);

  const total = flour + water + salt + yeast + oil + sugar;

  outputs.flourAmount.textContent = formatGrams(flour);
  outputs.waterAmount.textContent = formatGrams(water);
  outputs.saltAmount.textContent = formatGrams(salt);
  outputs.yeastAmount.textContent = formatGrams(yeast);
  outputs.oilAmount.textContent = formatGrams(oil);
  outputs.sugarAmount.textContent = formatGrams(sugar);
  outputs.totalDough.textContent = formatGrams(total);
}

/* =========================
   TOGGLE UI
========================= */

function updateToggleUI() {
  Object.keys(toggles).forEach((ingredient) => {
    const enabled = isEnabled(ingredient);

    fields[ingredient].classList.toggle("hidden", !enabled);
  });

  calculateDough();
}

/* =========================
   RESET FUNCTION
========================= */

function resetCalculator() {
  inputs.flour.value = 1000;
  inputs.hydration.value = 70;
  inputs.salt.value = 2;
  inputs.yeast.value = 0.3;
  inputs.oil.value = 0;
  inputs.sugar.value = 0;

  toggles.yeast.checked = true;
  toggles.oil.checked = false;
  toggles.sugar.checked = false;

  updateToggleUI();
}

/* =========================
   VIEW SWITCHING
========================= */

function showView(viewName) {
  calculatorView.classList.add("hidden");
  presetsView.classList.add("hidden");
  presetDetailView.classList.add("hidden");

  calculatorTab.classList.remove("active");
  presetsTab.classList.remove("active");

  if (viewName === "calculator") {
    calculatorView.classList.remove("hidden");
    calculatorTab.classList.add("active");
  }

  if (viewName === "presets") {
    presetsView.classList.remove("hidden");
    presetsTab.classList.add("active");
  }

  if (viewName === "presetDetail") {
    presetDetailView.classList.remove("hidden");
    presetsTab.classList.add("active");
  }
}

/* =========================
   PRESET CALCULATION
========================= */

function calculatePresetBatch(preset, quantity, sizeKey, customFlour) {
  let flour = 0;

  if (preset.type === "fixed-unit") {
    flour = quantity * preset.flourPerUnit;
  }

  if (preset.type === "sized-unit" || preset.type === "sized-batch") {
    const size = preset.sizes[sizeKey];
    const flourPerItem = sizeKey === "custom" ? customFlour : size.flour;

    flour = quantity * flourPerItem;
  }

  const water = flour * (preset.hydration / 100);
  const salt = flour * (preset.salt / 100);
  const yeast = flour * (preset.yeast / 100);
  const oil = flour * (preset.oil / 100);
  const sugar = flour * (preset.sugar / 100);

  const total = flour + water + salt + yeast + oil + sugar;

  return {
    flour,
    water,
    salt,
    yeast,
    oil,
    sugar,
    total,
  };
}

/* =========================
   RENDER PRESET DETAIL
========================= */

function renderPresetDetail(presetKey) {
  const preset = presetLibrary[presetKey];

  activePresetKey = presetKey;
  activeSizeKey = preset.defaultSize || null;

  presetDetailView.innerHTML = `
    <section class="card">
      <div class="detail-header">
        <h2>${preset.name}</h2>
        <button id="backToPresetsButton" class="back-button" type="button">Back</button>
      </div>

      ${
        preset.sizes
          ? `
            <div class="size-options">
              ${Object.entries(preset.sizes)
                .map(
                  ([key, size]) => `
                    <button
                      class="size-button ${key === activeSizeKey ? "active" : ""}"
                      type="button"
                      data-size="${key}"
                    >
                      ${size.label}
                    </button>
                  `
                )
                .join("")}
            </div>

            <div id="customSizeRow" class="calculator-row custom-size-row hidden">
              <label for="customFlour">${preset.customLabel}</label>
              <div class="input-row">
                <input
                  id="customFlour"
                  type="number"
                  inputmode="decimal"
                  min="0"
                  value="${preset.sizes.custom.flour}"
                />
                <span>g</span>
              </div>
            </div>
          `
          : ""
      }

      <div class="calculator-row">
        <label for="presetQuantity">Quantity</label>
        <div class="input-row">
          <input
            id="presetQuantity"
            type="number"
            inputmode="decimal"
            min="1"
            value="${preset.defaultQuantity}"
          />
          <span>${preset.unitLabel}</span>
        </div>
      </div>
    </section>

    <section class="card results-card">
      <h2>Results</h2>

      <div class="result-row">
        <span>Flour</span>
        <strong id="presetFlourAmount">0g</strong>
      </div>

      <div class="result-row">
        <span>Water</span>
        <strong id="presetWaterAmount">0g</strong>
      </div>

      <div class="result-row">
        <span>Salt</span>
        <strong id="presetSaltAmount">0g</strong>
      </div>

      <div class="result-row">
        <span>Yeast</span>
        <strong id="presetYeastAmount">0g</strong>
      </div>

      <div class="result-row">
        <span>Oil</span>
        <strong id="presetOilAmount">0g</strong>
      </div>

      <div class="result-row">
        <span>Sugar</span>
        <strong id="presetSugarAmount">0g</strong>
      </div>

      <div class="total-row">
        <span>Total dough</span>
        <strong id="presetTotalAmount">0g</strong>
      </div>
    </section>
  `;

  showView("presetDetail");
  attachPresetDetailListeners();
  updatePresetDetailResults();
}

/* =========================
   TOGGLE PRESET ROW
========================= */

function togglePresetRow(id, value) {
  const amount = document.getElementById(id);

  if (!amount) return;

  const row = amount.closest(".result-row");

  if (!row) return;

  row.classList.toggle("hidden", value <= 0);
}

/* =========================
   UPDATE PRESET RESULTS
========================= */

function updatePresetDetailResults() {
  const preset = presetLibrary[activePresetKey];

  const quantityInput = document.getElementById("presetQuantity");
  const customFlourInput = document.getElementById("customFlour");
  const customSizeRow = document.getElementById("customSizeRow");

  const quantity = Number(quantityInput.value) || 0;
  const customFlour = customFlourInput ? Number(customFlourInput.value) || 0 : 0;

  if (customSizeRow) {
    customSizeRow.classList.toggle("hidden", activeSizeKey !== "custom");
  }

  const result = calculatePresetBatch(
    preset,
    quantity,
    activeSizeKey,
    customFlour
  );

  document.getElementById("presetFlourAmount").textContent =
    formatGrams(result.flour);

  document.getElementById("presetWaterAmount").textContent =
    formatGrams(result.water);

  document.getElementById("presetSaltAmount").textContent =
    formatGrams(result.salt);

  document.getElementById("presetYeastAmount").textContent =
    formatGrams(result.yeast);

  document.getElementById("presetOilAmount").textContent =
    formatGrams(result.oil);

  document.getElementById("presetSugarAmount").textContent =
    formatGrams(result.sugar);

  document.getElementById("presetTotalAmount").textContent =
    formatGrams(result.total);

  togglePresetRow("presetYeastAmount", result.yeast);
  togglePresetRow("presetOilAmount", result.oil);
  togglePresetRow("presetSugarAmount", result.sugar);
}

/* =========================
   PRESET DETAIL LISTENERS
========================= */

function attachPresetDetailListeners() {
  const backButton = document.getElementById("backToPresetsButton");
  const quantityInput = document.getElementById("presetQuantity");
  const customFlourInput = document.getElementById("customFlour");
  const sizeButtons = document.querySelectorAll(".size-button");

  backButton.addEventListener("click", () => {
    showView("presets");
  });

  quantityInput.addEventListener("input", updatePresetDetailResults);

  quantityInput.addEventListener("click", () => {
    quantityInput.select();
  });

  if (customFlourInput) {
    customFlourInput.addEventListener("input", updatePresetDetailResults);

    customFlourInput.addEventListener("click", () => {
      customFlourInput.select();
    });
  }

  sizeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeSizeKey = button.dataset.size;

      sizeButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      updatePresetDetailResults();
    });
  });
}

/* =========================
   LIVE INPUT LISTENERS
========================= */

Object.values(inputs).forEach((input) => {
  input.addEventListener("input", calculateDough);

  input.addEventListener("click", () => {
    input.select();
  });
});

/* =========================
   TOGGLE LISTENERS
========================= */

Object.values(toggles).forEach((toggle) => {
  toggle.addEventListener("change", updateToggleUI);
});

/* =========================
   NAV LISTENERS
========================= */

calculatorTab.addEventListener("click", () => {
  showView("calculator");
});

presetsTab.addEventListener("click", () => {
  showView("presets");
});

/* =========================
   PRESET CARD LISTENERS
========================= */

document.querySelectorAll(".preset-card").forEach((button) => {
  button.addEventListener("click", () => {
    const presetKey = button.dataset.preset;

    renderPresetDetail(presetKey);
  });
});

/* =========================
   RESET BUTTON LISTENER
========================= */

resetButton.addEventListener("click", resetCalculator);

/* =========================
   INITIAL LOAD
========================= */

updateToggleUI();
showView("calculator");