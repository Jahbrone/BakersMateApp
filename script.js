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
  waterAmount: document.getElementById("waterAmount"),
  saltAmount: document.getElementById("saltAmount"),
  yeastAmount: document.getElementById("yeastAmount"),
  oilAmount: document.getElementById("oilAmount"),
  sugarAmount: document.getElementById("sugarAmount"),
  totalDough: document.getElementById("totalDough"),
};


/* =========================
   RESULT ROW ELEMENTS
========================= */

const resultRows = {
  yeast: document.getElementById("yeastResult"),
  oil: document.getElementById("oilResult"),
  sugar: document.getElementById("sugarResult"),
};


/* =========================
   RESET BUTTON
========================= */

const resetButton = document.getElementById("resetButton");


/* =========================
   HELPER FUNCTIONS
========================= */

function getNumber(input) {
  return Number(input.value) || 0;
}

function formatGrams(value) {
  return `${Math.round(value * 10) / 10}g`;
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
    resultRows[ingredient].classList.toggle("hidden", !enabled);
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
   RESET BUTTON LISTENER
========================= */

resetButton.addEventListener("click", resetCalculator);


/* =========================
   INITIAL LOAD
========================= */

updateToggleUI();