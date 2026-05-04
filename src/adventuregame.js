// ===========================================
// The Dragon's Quest - Text Adventure Game
// A progression-based learning project
// ===========================================
/*
Adventure Game
This game is a text-based adventure where the player makes choices
that affect the outcome of the game.
*/

// Import readline-sync to get user input
const readlineSync = require("readline-sync");

// Display the game title
console.log("=================================");
console.log("       The Dragon's Quest        ");
console.log("=================================");
console.log("Welcome to the Adventure Game!");
console.log("Prepare yourself for an epic journey!");

// Get player name
let playerName = readlineSync.question("What is your name, adventurer? ");

// Greet the player
console.log("Welcome, " + playerName + "! Your adventure begins now.");

// Define player stats
let health = 100;
let gold = 20;
let location = "village";
let gameRunning = true;
let inventory = [];

// Battle variables
let weaponDamage = 0;
let monsterDefense = 5;
let healingPotionValue = 30;

// Game progress variables
let hasSword = false;
let hasKey = false;
let dragonDefeated = false;

// Display welcome message and starting stats
console.log("\nStarting Stats:");
console.log("Health: " + health);
console.log("Gold: " + gold);
console.log("Location: " + location);
console.log("Inventory: " + inventory.length + " items");

// =========================================
// START Lab: Battle Calculator
// =========================================
console.log("\nStarting weapon damage: " + weaponDamage);
console.log("When you buy a sword, weapon damage will increase to 10!");

console.log("Monster defense: " + monsterDefense);
console.log("Monsters can withstand some damage in combat!");

console.log("Healing potion value: " + healingPotionValue);
console.log("A potion will restore 30 health!");
// =========================================
// END Lab: Battle Calculator
// =========================================

// Main game loop
while (gameRunning) {
  console.log("\n=================================");
  console.log("Current Location: " + location);
  console.log("Health: " + health);
  console.log("Gold: " + gold);
  console.log("Inventory: " + inventory.join(", "));
  console.log("=================================");

  if (health <= 0) {
    console.log("\nYou have fallen in battle.");
    console.log("Game Over.");
    gameRunning = false;
    break;
  }

  if (dragonDefeated) {
    console.log("\nCongratulations, " + playerName + "!");
    console.log("You defeated the dragon and saved the kingdom!");
    console.log("You win!");
    gameRunning = false;
    break;
  }

  if (location === "village") {
    showVillageMenu();
  } else if (location === "shop") {
    showShopMenu();
  } else if (location === "forest") {
    showForestMenu();
  } else if (location === "cave") {
    showCaveMenu();
  } else if (location === "castle") {
    showCastleMenu();
  } else {
    console.log("Unknown location. Returning to the village.");
    location = "village";
  }
}

// ===========================================
// Location Menus
// ===========================================

function showVillageMenu() {
  console.log("\nYou are in the village square.");
  console.log("1. Go to the shop");
  console.log("2. Travel to the forest");
  console.log("3. Travel to the cave");
  console.log("4. Travel to the castle");
  console.log("5. Use a healing potion");
  console.log("6. Quit game");

  let choice = readlineSync.question("What would you like to do? ");

  if (choice === "1") {
    location = "shop";
  } else if (choice === "2") {
    location = "forest";
  } else if (choice === "3") {
    location = "cave";
  } else if (choice === "4") {
    location = "castle";
  } else if (choice === "5") {
    useHealingPotion();
  } else if (choice === "6") {
    console.log("\nThank you for playing The Dragon's Quest!");
    gameRunning = false;
  } else {
    console.log("Invalid choice. Please try again.");
  }
}

function showShopMenu() {
  console.log("\nYou enter the village shop.");
  console.log("The shopkeeper greets you warmly.");
  console.log("1. Buy sword - 15 gold");
  console.log("2. Buy healing potion - 10 gold");
  console.log("3. Return to village");

  let choice = readlineSync.question("What would you like to do? ");

  if (choice === "1") {
    buySword();
  } else if (choice === "2") {
    buyPotion();
  } else if (choice === "3") {
    location = "village";
  } else {
    console.log("Invalid choice. Please try again.");
  }
}

function showForestMenu() {
  console.log("\nYou enter the dark forest.");
  console.log("You hear strange noises between the trees.");
  console.log("1. Explore the forest");
  console.log("2. Search for treasure");
  console.log("3. Return to village");

  let choice = readlineSync.question("What would you like to do? ");

  if (choice === "1") {
    fightMonster("Goblin", 30, 8, 10);
  } else if (choice === "2") {
    searchForestTreasure();
  } else if (choice === "3") {
    location = "village";
  } else {
    console.log("Invalid choice. Please try again.");
  }
}

function showCaveMenu() {
  console.log("\nYou stand before a cold, shadowy cave.");
  console.log("1. Enter deeper into the cave");
  console.log("2. Search the cave entrance");
  console.log("3. Return to village");

  let choice = readlineSync.question("What would you like to do? ");

  if (choice === "1") {
    fightMonster("Cave Troll", 50, 12, 20);
  } else if (choice === "2") {
    searchCave();
  } else if (choice === "3") {
    location = "village";
  } else {
    console.log("Invalid choice. Please try again.");
  }
}

function showCastleMenu() {
  console.log("\nYou arrive at the ancient castle.");
  console.log("The dragon waits inside.");

  if (!hasKey) {
    console.log("The castle gate is locked. You need a key.");
    location = "village";
    return;
  }

  console.log("1. Enter the castle and face the dragon");
  console.log("2. Return to village");

  let choice = readlineSync.question("What would you like to do? ");

  if (choice === "1") {
    fightDragon();
  } else if (choice === "2") {
    location = "village";
  } else {
    console.log("Invalid choice. Please try again.");
  }
}

// ===========================================
// Shop Functions
// ===========================================

function buySword() {
  if (hasSword) {
    console.log("You already have a sword.");
    return;
  }

  if (gold >= 15) {
    gold -= 15;
    hasSword = true;
    weaponDamage = 10;
    inventory.push("Sword");

    console.log("\nYou bought a sword!");
    console.log("Weapon damage increased to " + weaponDamage + ".");
  } else {
    console.log("\nYou do not have enough gold.");
  }
}

function buyPotion() {
  if (gold >= 10) {
    gold -= 10;
    inventory.push("Healing Potion");

    console.log("\nYou bought a healing potion.");
  } else {
    console.log("\nYou do not have enough gold.");
  }
}

// ===========================================
// Inventory Functions
// ===========================================

function useHealingPotion() {
  let potionIndex = inventory.indexOf("Healing Potion");

  if (potionIndex === -1) {
    console.log("\nYou do not have any healing potions.");
    return;
  }

  if (health >= 100) {
    console.log("\nYour health is already full.");
    return;
  }

  inventory.splice(potionIndex, 1);
  health += healingPotionValue;

  if (health > 100) {
    health = 100;
  }

  console.log("\nYou used a healing potion.");
  console.log("Your health is now " + health + ".");
}

// ===========================================
// Exploration Functions
// ===========================================

function searchForestTreasure() {
  console.log("\nYou search beneath the roots of an ancient tree.");

  let randomGold = Math.floor(Math.random() * 11) + 5;
  gold += randomGold;

  console.log("You found " + randomGold + " gold!");
}

function searchCave() {
  console.log("\nYou search the cave entrance carefully.");

  if (!hasKey) {
    hasKey = true;
    inventory.push("Castle Key");

    console.log("You found a Castle Key!");
    console.log("You can now enter the castle.");
  } else {
    console.log("You find nothing new.");
  }
}

// ===========================================
// Battle Functions
// ===========================================

function fightMonster(monsterName, monsterHealth, monsterAttack, rewardGold) {
  console.log("\nA " + monsterName + " appears!");

  while (monsterHealth > 0 && health > 0) {
    console.log("\nYour Health: " + health);
    console.log(monsterName + " Health: " + monsterHealth);
    console.log("1. Attack");
    console.log("2. Use healing potion");
    console.log("3. Run away");

    let choice = readlineSync.question("What will you do? ");

    if (choice === "1") {
      let playerDamage = calculatePlayerDamage();
      monsterHealth -= playerDamage;

      if (monsterHealth < 0) {
        monsterHealth = 0;
      }

      console.log("\nYou attack the " + monsterName + "!");
      console.log("You deal " + playerDamage + " damage.");

      if (monsterHealth > 0) {
        let damageTaken = calculateMonsterDamage(monsterAttack);
        health -= damageTaken;

        console.log("The " + monsterName + " attacks you!");
        console.log("You take " + damageTaken + " damage.");
      }
    } else if (choice === "2") {
      useHealingPotion();

      if (monsterHealth > 0) {
        let damageTaken = calculateMonsterDamage(monsterAttack);
        health -= damageTaken;

        console.log("The " + monsterName + " attacks while you recover!");
        console.log("You take " + damageTaken + " damage.");
      }
    } else if (choice === "3") {
      console.log("\nYou run back to the village.");
      location = "village";
      return;
    } else {
      console.log("Invalid choice. Please try again.");
    }
  }

  if (health > 0) {
    console.log("\nYou defeated the " + monsterName + "!");
    console.log("You earned " + rewardGold + " gold.");

    gold += rewardGold;
  }
}

function fightDragon() {
  console.log("\nYou enter the castle throne room.");
  console.log("The dragon rises before you!");

  if (!hasSword) {
    console.log("\nYou face the dragon without a sword.");
    console.log("The dragon is too powerful.");
    health = 0;
    return;
  }

  let dragonHealth = 100;
  let dragonAttack = 18;
  let dragonDefense = 8;

  while (dragonHealth > 0 && health > 0) {
    console.log("\nYour Health: " + health);
    console.log("Dragon Health: " + dragonHealth);
    console.log("1. Attack");
    console.log("2. Use healing potion");
    console.log("3. Retreat");

    let choice = readlineSync.question("What will you do? ");

    if (choice === "1") {
      let playerDamage = calculatePlayerDamage() - dragonDefense;

      if (playerDamage < 1) {
        playerDamage = 1;
      }

      dragonHealth -= playerDamage;

      if (dragonHealth < 0) {
        dragonHealth = 0;
      }

      console.log("\nYou strike the dragon!");
      console.log("You deal " + playerDamage + " damage.");

      if (dragonHealth > 0) {
        let damageTaken = calculateMonsterDamage(dragonAttack);
        health -= damageTaken;

        console.log("The dragon breathes fire!");
        console.log("You take " + damageTaken + " damage.");
      }
    } else if (choice === "2") {
      useHealingPotion();

      if (dragonHealth > 0) {
        let damageTaken = calculateMonsterDamage(dragonAttack);
        health -= damageTaken;

        console.log("The dragon attacks while you heal!");
        console.log("You take " + damageTaken + " damage.");
      }
    } else if (choice === "3") {
      console.log("\nYou retreat from the castle.");
      location = "village";
      return;
    } else {
      console.log("Invalid choice. Please try again.");
    }
  }

  if (health > 0) {
    dragonDefeated = true;
  }
}

function calculatePlayerDamage() {
  let baseDamage = Math.floor(Math.random() * 11) + 5;
  let totalDamage = baseDamage + weaponDamage - monsterDefense;

  if (totalDamage < 1) {
    totalDamage = 1;
  }

  return totalDamage;
}

function calculateMonsterDamage(monsterAttack) {
  let damage = Math.floor(Math.random() * monsterAttack) + 1;
  return damage;
}