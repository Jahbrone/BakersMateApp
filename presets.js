const presetLibrary = {
  bagels: {
    name: "Bagels",
    type: "fixed-unit",
    unitLabel: "bagels",
    defaultQuantity: 10,
    flourPerUnit: 70,
    hydration: 58,
    salt: 2.5,
    yeast: 0.8,
    oil: 0,
    sugar: 4,
  },

  pizzaBalls: {
    name: "Pizza Balls",
    type: "sized-unit",
    unitLabel: "balls",
    defaultQuantity: 2,
    defaultSize: "medium",
    sizes: {
      small: {
        label: "Small",
        doughWeight: 200,
      },
      medium: {
        label: "Medium",
        doughWeight: 250,
      },
      large: {
        label: "Large",
        doughWeight: 280,
      },
    },
    hydration: 65,
    salt: 2.5,
    yeast: 0.2,
    oil: 0,
    sugar: 0,
  },

  focaccia: {
    name: "Focaccia",
    type: "sized-batch",
    unitLabel: "trays",
    defaultQuantity: 1,
    defaultSize: "medium",
    sizes: {
      small: {
        label: "Small",
        flour: 300,
      },
      medium: {
        label: "Medium",
        flour: 500,
      },
      large: {
        label: "Large",
        flour: 750,
      },
    },
    hydration: 80,
    salt: 2.5,
    yeast: 0.5,
    oil: 5,
    sugar: 0,
  },
};