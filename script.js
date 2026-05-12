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

/* =========================

   AUTO-SELECT INPUT ON TAP

========================= */

Object.values(inputs).forEach((input) => {

  input.addEventListener("focus", () => {

    input.select();

  });

});

/* =========================
   MAIN CALCULATION
========================= */

function calculateDough() {

  // INPUT VALUES
  const flour = getNumber(inputs.flour);
  const hydration = getNumber(inputs.hydration);
  const saltPercent = getNumber(inputs.salt);
  const yeastPercent = getNumber(inputs.yeast);
  const oilPercent = getNumber(inputs.oil);
  const sugarPercent = getNumber(inputs.sugar);

  // CALCULATIONS
  const water = flour * (hydration / 100);
  const salt = flour * (saltPercent / 100);
  const yeast = flour * (yeastPercent / 100);
  const oil = flour * (oilPercent / 100);
  const sugar = flour * (sugarPercent / 100);

  // TOTAL DOUGH
  const total = flour + water + salt + yeast + oil + sugar;

  // UPDATE UI
  outputs.waterAmount.textContent = formatGrams(water);
  outputs.saltAmount.textContent = formatGrams(salt);
  outputs.yeastAmount.textContent = formatGrams(yeast);
  outputs.oilAmount.textContent = formatGrams(oil);
  outputs.sugarAmount.textContent = formatGrams(sugar);
  outputs.totalDough.textContent = formatGrams(total);
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

  calculateDough();
}


/* =========================
   LIVE INPUT LISTENERS
========================= */

Object.values(inputs).forEach((input) => {
  input.addEventListener("input", calculateDough);
});


/* =========================
   RESET BUTTON LISTENER
========================= */

resetButton.addEventListener("click", resetCalculator);


/* =========================
   INITIAL LOAD
========================= */

calculateDough();