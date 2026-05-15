/* =========================
   IMPORTS
========================= */
import {
  getNumber,
  formatGrams,
  calculateDoughValues,
  calculatePresetBatch,
} from "./calculator.js";
import { presetLibrary } from "./presets.js";
import { getSavedRecipes, saveRecipe, deleteRecipe } from "./storage.js";
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
  starter: document.getElementById("starter"),
};
/* =========================
   TOGGLE ELEMENTS
========================= */
const toggles = {
  yeast: document.getElementById("yeastToggle"),
  oil: document.getElementById("oilToggle"),
  sugar: document.getElementById("sugarToggle"),
  starter: document.getElementById("starterToggle"),
};
/* =========================
   OPTIONAL FIELD ELEMENTS
========================= */
const fields = {
  yeast: document.getElementById("yeastField"),
  oil: document.getElementById("oilField"),
  sugar: document.getElementById("sugarField"),
  starter: document.getElementById("starterField"),
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
  starterAmount: document.getElementById("starterAmount"),
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
   BUTTON ELEMENTS
========================= */
const resetButton = document.getElementById("resetButton");
const saveRecipeButton = document.getElementById("saveRecipeButton");
const loadRecipeButton = document.getElementById("loadRecipeButton");
const savedRecipesPanel = document.getElementById("savedRecipesPanel");
const savedRecipesList = document.getElementById("savedRecipesList");
const closeSavedRecipesButton = document.getElementById(
  "closeSavedRecipesButton",
);
/* =========================
   PRESET STATE
========================= */
let activePresetKey = null;
let activeSizeKey = null;
/* =========================
   HELPER FUNCTIONS
========================= */
function isEnabled(ingredient) {
  return toggles[ingredient].checked;
}
/* =========================
   MAIN CALCULATION
========================= */
function calculateDough() {
  const result = calculateDoughValues({
    flour: getNumber(inputs.flour),
    hydration: getNumber(inputs.hydration),
    salt: getNumber(inputs.salt),
    yeast: getNumber(inputs.yeast),
    oil: getNumber(inputs.oil),
    sugar: getNumber(inputs.sugar),
    starter: getNumber(inputs.starter),
    yeastEnabled: isEnabled("yeast"),
    oilEnabled: isEnabled("oil"),
    sugarEnabled: isEnabled("sugar"),
    starterEnabled: isEnabled("starter"),
  });
  outputs.flourAmount.textContent = formatGrams(result.flour);
  outputs.waterAmount.textContent = formatGrams(result.water);
  outputs.saltAmount.textContent = formatGrams(result.salt);
  outputs.yeastAmount.textContent = formatGrams(result.yeast);
  outputs.oilAmount.textContent = formatGrams(result.oil);
  outputs.sugarAmount.textContent = formatGrams(result.sugar);
  outputs.starterAmount.textContent = formatGrams(result.starter);
  outputs.totalDough.textContent = formatGrams(result.total);
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
  inputs.starter.value = 20;
  toggles.yeast.checked = true;
  toggles.oil.checked = false;
  toggles.sugar.checked = false;
  toggles.starter.checked = false;
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
   RECIPE UI FUNCTIONS
========================= */
function getCurrentRecipeState(name) {
  return {
    name,
    flour: getNumber(inputs.flour),
    hydration: getNumber(inputs.hydration),
    salt: getNumber(inputs.salt),
    yeast: getNumber(inputs.yeast),
    oil: getNumber(inputs.oil),
    sugar: getNumber(inputs.sugar),
    starter: getNumber(inputs.starter),
    toggles: {
      yeast: toggles.yeast.checked,
      oil: toggles.oil.checked,
      sugar: toggles.sugar.checked,
      starter: toggles.starter.checked,
    },
  };
}
function applyRecipeState(recipe) {
  inputs.flour.value = recipe.flour;
  inputs.hydration.value = recipe.hydration;
  inputs.salt.value = recipe.salt;
  inputs.yeast.value = recipe.yeast;
  inputs.oil.value = recipe.oil;
  inputs.sugar.value = recipe.sugar;
  inputs.starter.value = recipe.starter;
  toggles.yeast.checked = recipe.toggles?.yeast ?? false;
  toggles.oil.checked = recipe.toggles?.oil ?? false;
  toggles.sugar.checked = recipe.toggles?.sugar ?? false;
  toggles.starter.checked = recipe.toggles?.starter ?? false;
  updateToggleUI();
  showView("calculator");
}
function handleSaveRecipe() {
  const name = prompt("Recipe name?");
  if (!name || !name.trim()) return;
  saveRecipe(getCurrentRecipeState(name.trim()));
}

function renderSavedRecipesPanel() {
  const recipes = getSavedRecipes();
  savedRecipesList.innerHTML = "";
  if (recipes.length === 0) {
    savedRecipesList.innerHTML = `<p class="empty-state">No saved recipes yet.</p>`;
    return;
  }
  recipes.forEach((recipe) => {
    const row = document.createElement("div");
    row.className = "saved-recipe-row";
    row.innerHTML = `
      <button class="saved-recipe-load" type="button">
        ${recipe.name}
      </button>
      <button class="saved-recipe-delete" type="button">
        🗑
      </button>
    `;
    row.querySelector(".saved-recipe-load").addEventListener("click", () => {
      applyRecipeState(recipe);
      savedRecipesPanel.classList.add("hidden");
    });
    row.querySelector(".saved-recipe-delete").addEventListener("click", () => {
      const confirmed = confirm(`Delete "${recipe.name}"?`);
      if (!confirmed) return;
      deleteRecipe(recipe.id);
      renderSavedRecipesPanel();
    });
    savedRecipesList.appendChild(row);
  });
}

function handleLoadRecipe() {
  renderSavedRecipesPanel();
  savedRecipesPanel.classList.remove("hidden");
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
                  `,
                )
                .join("")}
            </div>
            <div id="customSizeRow" class="preset-row custom-size-row hidden">
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
      <div class="preset-row">
        <label for="presetQuantity">Quantity</label>
        <div class="input-row">
          <input
            id="presetQuantity"
            type="number"
            inputmode="decimal"
            min="1"
            value="${preset.defaultQuantity}"
          />
        </div>
      </div>
      ${
        preset.editablePercentages
          ? `<div class="preset-row">
        <label for="presetHydration">Hydration</label>
        <div class="input-row">
          <input
            id="presetHydration"
            type="number"
            inputmode="decimal"
            min="0"
            step="0.1"
            value="${preset.hydration}"
          />
          <span>%</span>
        </div>
      </div>
      <div class="preset-row">
        <label for="presetSalt">Salt</label>
        <div class="input-row">
          <input
            id="presetSalt"
            type="number"
            inputmode="decimal"
            min="0"
            step="0.1"
            value="${preset.salt}"
          />
          <span>%</span>
        </div>
      </div>
      <div class="preset-row">
        <label for="presetStarter">Starter</label>
        <div class="input-row">
          <input
            id="presetStarter"
            type="number"
            inputmode="decimal"
            min="0"
            step="0.1"
            value="${preset.starter}"
          />
          <span>%</span>
        </div>
      </div>`
          : ""
      }
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
        <span>Yoghurt</span>
        <strong id="presetYogurtAmount">0g</strong>
      </div>
      <div class="result-row">
        <span>Starter</span>
        <strong id="presetStarterAmount">0g</strong>
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
  const customFlour = customFlourInput
    ? Number(customFlourInput.value) || 0
    : 0;
  if (customSizeRow) {
    customSizeRow.classList.toggle("hidden", activeSizeKey !== "custom");
  }
  if (preset.editablePercentages) {
    preset.hydration =
      Number(document.getElementById("presetHydration").value) || 0;
    preset.salt = Number(document.getElementById("presetSalt").value) || 0;
    preset.starter =
      Number(document.getElementById("presetStarter").value) || 0;
  }
  const result = calculatePresetBatch(
    preset,
    quantity,
    activeSizeKey,
    customFlour,
  );
  document.getElementById("presetFlourAmount").textContent = formatGrams(
    result.flour,
  );
  document.getElementById("presetWaterAmount").textContent = formatGrams(
    result.water,
  );
  document.getElementById("presetYogurtAmount").textContent = formatGrams(
    result.yogurt,
  );
  document.getElementById("presetStarterAmount").textContent = formatGrams(
    result.starter,
  );
  document.getElementById("presetSaltAmount").textContent = formatGrams(
    result.salt,
  );
  document.getElementById("presetYeastAmount").textContent = formatGrams(
    result.yeast,
  );
  document.getElementById("presetOilAmount").textContent = formatGrams(
    result.oil,
  );
  document.getElementById("presetSugarAmount").textContent = formatGrams(
    result.sugar,
  );
  document.getElementById("presetTotalAmount").textContent = formatGrams(
    result.total,
  );
  togglePresetRow("presetYeastAmount", result.yeast);
  togglePresetRow("presetOilAmount", result.oil);
  togglePresetRow("presetSugarAmount", result.sugar);
  togglePresetRow("presetYogurtAmount", result.yogurt);
  togglePresetRow("presetStarterAmount", result.starter);
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
  if (presetLibrary[activePresetKey].editablePercentages) {
    ["presetHydration", "presetSalt", "presetStarter"].forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;
      input.addEventListener("input", updatePresetDetailResults);
      input.addEventListener("click", () => {
        input.select();
      });
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
   INITIALISE UI
========================= */
export function initUI() {
  Object.values(inputs).forEach((input) => {
    input.addEventListener("input", calculateDough);
    input.addEventListener("click", () => {
      input.select();
    });
  });
  Object.values(toggles).forEach((toggle) => {
    toggle.addEventListener("change", updateToggleUI);
  });
  calculatorTab.addEventListener("click", () => {
    showView("calculator");
  });
  presetsTab.addEventListener("click", () => {
    showView("presets");
  });
  document.querySelectorAll(".preset-card").forEach((button) => {
    button.addEventListener("click", () => {
      const presetKey = button.dataset.preset;
      renderPresetDetail(presetKey);
    });
  });

  if (closeSavedRecipesButton) {
    closeSavedRecipesButton.addEventListener("click", () => {
      savedRecipesPanel.classList.add("hidden");
    });
  }

  if (savedRecipesPanel) {
    savedRecipesPanel.addEventListener("click", () => {
      savedRecipesPanel.classList.add("hidden");
    });
  }

  const savedRecipesCard = document.querySelector(".saved-recipes-card");
  if (savedRecipesCard) {
    savedRecipesCard.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  resetButton.addEventListener("click", resetCalculator);
  if (saveRecipeButton) {
    saveRecipeButton.addEventListener("click", handleSaveRecipe);
  }
  if (loadRecipeButton) {
    loadRecipeButton.addEventListener("click", handleLoadRecipe);
  }
  updateToggleUI();
  showView("calculator");
}
