// ===========================================
// The Dragon's Quest - Text Adventure Game
// A progression-based learning project
// ===========================================

// Include readline for player input
const readline = require('readline-sync');

// ===========================
// Game State Variables
// ===========================
let gameRunning = true;
let playerName = "";
let playerHealth = 100;
let playerGold = 20;
let currentLocation = "village";

const MAX_HEALTH = 100;
const REGULAR_MONSTER_REWARD = 10;

// =========================================
// START Lab: Expanded Item and Combat System
// =========================================

// ===========================
// Item Templates
// ===========================
const healthPotion = {
    name: "Health Potion",
    type: "potion",
    value: 5,
    effect: 30,
    description: "Restores 30 health points"
};

const sword = {
    name: "Sword",
    type: "weapon",
    value: 10,
    effect: 10,
    description: "A sturdy blade for combat"
};

const woodenShield = {
    name: "Wooden Shield",
    type: "armor",
    value: 8,
    effect: 5,
    description: "Reduces damage taken in combat"
};

const steelSword = {
    name: "Steel Sword",
    type: "weapon",
    value: 25,
    effect: 20,
    description: "An advanced blade strong enough to challenge the dragon"
};

const ironShield = {
    name: "Iron Shield",
    type: "armor",
    value: 18,
    effect: 10,
    description: "Provides better protection than a wooden shield"
};

// Inventory now stores item objects
let inventory = [];

// ===========================
// Display Functions
// ===========================

/**
 * Shows the player's current stats.
 */
function showStatus() {
    console.log("\n=== " + playerName + "'s Status ===");
    console.log("❤️  Health: " + playerHealth + "/" + MAX_HEALTH);
    console.log("💰 Gold: " + playerGold);
    console.log("📍 Location: " + currentLocation);

    let bestWeapon = getBestItem("weapon");
    let bestArmor = getBestItem("armor");

    console.log("⚔️  Best Weapon: " + (bestWeapon ? bestWeapon.name + " (Damage: " + bestWeapon.effect + ")" : "None"));
    console.log("🛡️  Best Armor: " + (bestArmor ? bestArmor.name + " (Protection: " + bestArmor.effect + ")" : "None"));

    console.log("🎒 Inventory:");
    if (inventory.length === 0) {
        console.log("   Nothing in inventory");
    } else {
        inventory.forEach((item, index) => {
            console.log("   " + (index + 1) + ". " + item.name + " - " + item.description);
        });
    }
}

/**
 * Shows the current location's description and available choices.
 */
function showLocation() {
    console.log("\n=== " + currentLocation.toUpperCase() + " ===");

    if (currentLocation === "village") {
        console.log("You're in a bustling village. The blacksmith, market, forest, and mountain path are nearby.");
        console.log("\nWhat would you like to do?");
        console.log("1: Go to blacksmith");
        console.log("2: Go to market");
        console.log("3: Enter forest");
        console.log("4: Travel to the mountains and face the dragon");
        console.log("5: Check status");
        console.log("6: Check inventory");
        console.log("7: Use item");
        console.log("8: Help");
        console.log("9: Quit game");
    }
    else if (currentLocation === "blacksmith") {
        console.log("The heat from the forge fills the air. Weapons and armor line the walls.");
        console.log("\nItems for sale:");
        console.log("1: Buy " + sword.name + " (" + sword.value + " gold) - " + sword.description + " | Damage: " + sword.effect);
        console.log("2: Buy " + woodenShield.name + " (" + woodenShield.value + " gold) - " + woodenShield.description + " | Protection: " + woodenShield.effect);
        console.log("3: Buy " + steelSword.name + " (" + steelSword.value + " gold) - " + steelSword.description + " | Damage: " + steelSword.effect);
        console.log("4: Buy " + ironShield.name + " (" + ironShield.value + " gold) - " + ironShield.description + " | Protection: " + ironShield.effect);
        console.log("5: Return to village");
        console.log("6: Check status");
        console.log("7: Check inventory");
        console.log("8: Use item");
        console.log("9: Help");
        console.log("10: Quit game");
    }
    else if (currentLocation === "market") {
        console.log("Merchants sell their wares from colorful stalls. A potion seller catches your eye.");
        console.log("\nWhat would you like to do?");
        console.log("1: Buy " + healthPotion.name + " (" + healthPotion.value + " gold) - " + healthPotion.description);
        console.log("2: Return to village");
        console.log("3: Check status");
        console.log("4: Check inventory");
        console.log("5: Use item");
        console.log("6: Help");
        console.log("7: Quit game");
    }
    else if (currentLocation === "forest") {
        console.log("The forest is dark and foreboding. Monsters lurk between the trees.");
        console.log("\nWhat would you like to do?");
        console.log("1: Search for a monster to fight");
        console.log("2: Return to village");
        console.log("3: Check status");
        console.log("4: Check inventory");
        console.log("5: Use item");
        console.log("6: Help");
        console.log("7: Quit game");
    }
    else if (currentLocation === "mountains") {
        console.log("Cold winds howl around the mountain peak. The dragon waits above.");
        console.log("\nWhat would you like to do?");
        console.log("1: Face the dragon");
        console.log("2: Return to village");
        console.log("3: Check status");
        console.log("4: Check inventory");
        console.log("5: Use item");
        console.log("6: Help");
        console.log("7: Quit game");
    }
}

// ===========================
// Item Management Functions
// ===========================

/**
 * Gets all items in the inventory that match a given item type.
 * @param {string} type The item type to find, such as "weapon" or "armor".
 * @returns {Array} An array of matching item objects.
 */
function getItemsByType(type) {
    return inventory.filter(item => item.type === type);
}

/**
 * Finds the strongest item of a given type based on effect value.
 * @param {string} type The item type to search for.
 * @returns {Object|null} The best item object, or null if no matching item exists.
 */
function getBestItem(type) {
    let matchingItems = getItemsByType(type);

    if (matchingItems.length === 0) {
        return null;
    }

    return matchingItems.reduce((bestItem, currentItem) => {
        return currentItem.effect > bestItem.effect ? currentItem : bestItem;
    });
}

/**
 * Checks whether the player has a specific item by name.
 * @param {string} itemName The item name to search for.
 * @returns {boolean} True if the item is in the inventory.
 */
function hasItemNamed(itemName) {
    return inventory.some(item => item.name === itemName);
}

/**
 * Checks if the player has an item of a specified type.
 * @param {string} type The item type to check for.
 * @returns {boolean} True if the player has the item type.
 */
function hasItemType(type) {
    return inventory.some(item => item.type === type);
}

/**
 * Checks whether the player has good enough equipment to face the dragon.
 * Requires the Steel Sword and any armor.
 * @returns {boolean} True if the player is well-equipped.
 */
function hasGoodEquipment() {
    let hasAdvancedWeapon = hasItemNamed(steelSword.name);
    let hasAnyArmor = hasItemType("armor");

    return hasAdvancedWeapon && hasAnyArmor;
}

/**
 * Adds a copy of an item template to the player's inventory.
 * @param {Object} itemTemplate The item template to copy.
 */
function addItemToInventory(itemTemplate) {
    inventory.push({ ...itemTemplate });
}

// ===========================
// Combat Functions
// ===========================

/**
 * Updates player health, keeping it between 0 and MAX_HEALTH.
 * @param {number} amount Amount to change health by.
 * @returns {number} The new health value.
 */
function updateHealth(amount) {
    playerHealth += amount;

    if (playerHealth > MAX_HEALTH) {
        playerHealth = MAX_HEALTH;
        console.log("You're at full health!");
    }

    if (playerHealth < 0) {
        playerHealth = 0;
        console.log("You're gravely wounded!");
    }

    console.log("Health is now: " + playerHealth);
    return playerHealth;
}

/**
 * Calculates how much damage the player takes after armor protection.
 * @param {number} baseDamage The enemy's base damage.
 * @param {Object|null} armor The armor item being used.
 * @returns {number} Final damage taken.
 */
function calculateIncomingDamage(baseDamage, armor) {
    let protection = armor ? armor.effect : 0;
    let finalDamage = Math.max(1, baseDamage - protection);
    let blockedDamage = baseDamage - finalDamage;

    if (armor) {
        console.log("Your " + armor.name + " blocks " + blockedDamage + " damage.");
    } else {
        console.log("You have no armor to reduce the damage.");
    }

    return finalDamage;
}

/**
 * Handles monster and dragon battles.
 * @param {boolean} isDragon True for the dragon boss battle, false for a regular monster.
 * @returns {boolean} True if the player wins, false otherwise.
 */
function handleCombat(isDragon = false) {
    let monsterName = isDragon ? "Dragon" : "Monster";
    let monsterHealth = isDragon ? 50 : 20;
    let monsterDamage = isDragon ? 20 : 10;
    let goldReward = isDragon ? 0 : REGULAR_MONSTER_REWARD;

    console.log("\nA " + monsterName.toLowerCase() + " appears!");
    console.log(monsterName + " Health: " + monsterHealth);
    console.log(monsterName + " Damage: " + monsterDamage);

    let bestWeapon = getBestItem("weapon");
    let bestArmor = getBestItem("armor");

    if (!bestWeapon) {
        console.log("\nWithout a weapon, you cannot win this fight. You retreat!");
        let damageTaken = calculateIncomingDamage(monsterDamage, bestArmor);
        updateHealth(-damageTaken);
        return false;
    }

    if (isDragon && !hasGoodEquipment()) {
        console.log("\nThe dragon is too powerful for your current equipment!");
        console.log("You need the " + steelSword.name + " and at least one piece of armor before you can defeat it.");
        let damageTaken = calculateIncomingDamage(monsterDamage, bestArmor);
        updateHealth(-damageTaken);
        return false;
    }

    console.log("\nYou ready your best equipment:");
    console.log("Weapon: " + bestWeapon.name + " (Damage: " + bestWeapon.effect + ")");
    console.log("Armor: " + (bestArmor ? bestArmor.name + " (Protection: " + bestArmor.effect + ")" : "None"));

    let round = 1;

    while (monsterHealth > 0 && playerHealth > 0) {
        console.log("\n--- Combat Round " + round + " ---");

        monsterHealth -= bestWeapon.effect;
        if (monsterHealth < 0) {
            monsterHealth = 0;
        }

        console.log("You strike with your " + bestWeapon.name + " for " + bestWeapon.effect + " damage.");
        console.log(monsterName + " Health: " + monsterHealth);

        if (monsterHealth <= 0) {
            break;
        }

        console.log("The " + monsterName.toLowerCase() + " attacks!");
        let damageTaken = calculateIncomingDamage(monsterDamage, bestArmor);
        console.log("You take " + damageTaken + " damage.");
        updateHealth(-damageTaken);

        round++;
    }

    if (playerHealth <= 0) {
        console.log("\nYou were defeated by the " + monsterName.toLowerCase() + "!");
        return false;
    }

    if (isDragon) {
        completeGame();
        return true;
    }

    console.log("\nVictory! You defeated the monster and found " + goldReward + " gold!");
    playerGold += goldReward;
    console.log("Gold is now: " + playerGold);
    return true;
}

// ===========================
// Item Functions
// ===========================

/**
 * Handles using items like potions.
 * @returns {boolean} True if an item was used successfully, false if not.
 */
function useItem() {
    if (inventory.length === 0) {
        console.log("\nYou have no items!");
        return false;
    }

    console.log("\n=== Inventory ===");
    inventory.forEach((item, index) => {
        console.log((index + 1) + ". " + item.name + " - " + item.description);
    });

    let choice = readline.question("Use which item? (number or 'cancel'): ").trim().toLowerCase();
    if (choice === "cancel") {
        console.log("\nCancelled item use.");
        return false;
    }

    let index = parseInt(choice) - 1;

    if (index >= 0 && index < inventory.length) {
        let item = inventory[index];

        if (item.type === "potion") {
            if (playerHealth >= MAX_HEALTH) {
                console.log("\nYou are already at full health. Save the potion for later.");
                return false;
            }

            console.log("\nYou drink the " + item.name + ".");
            updateHealth(item.effect);
            inventory.splice(index, 1);
            return true;
        }
        else if (item.type === "weapon") {
            console.log("\nYou inspect your " + item.name + ". Weapons are selected automatically during combat.");
            return true;
        }
        else if (item.type === "armor") {
            console.log("\nYou inspect your " + item.name + ". Armor is selected automatically during combat.");
            return true;
        }
    }

    console.log("\nInvalid item number!");
    return false;
}

/**
 * Displays the player's inventory.
 */
function checkInventory() {
    console.log("\n=== INVENTORY ===");

    if (inventory.length === 0) {
        console.log("Your inventory is empty!");
        return;
    }

    inventory.forEach((item, index) => {
        let effectLabel = "Effect";

        if (item.type === "weapon") {
            effectLabel = "Damage";
        }
        else if (item.type === "armor") {
            effectLabel = "Protection";
        }
        else if (item.type === "potion") {
            effectLabel = "Healing";
        }

        console.log((index + 1) + ". " + item.name + " [" + item.type + "] - " + item.description + " | " + effectLabel + ": " + item.effect);
    });
}

// ===========================
// Shopping Functions
// ===========================

/**
 * Handles purchasing an item.
 * @param {Object} itemTemplate The item template being purchased.
 */
function buyItem(itemTemplate) {
    let isEquipment = itemTemplate.type === "weapon" || itemTemplate.type === "armor";

    if (isEquipment && hasItemNamed(itemTemplate.name)) {
        console.log("\nYou already own a " + itemTemplate.name + ".");
        return;
    }

    if (playerGold >= itemTemplate.value) {
        playerGold -= itemTemplate.value;
        addItemToInventory(itemTemplate);

        console.log("\nYou bought a " + itemTemplate.name + " for " + itemTemplate.value + " gold!");
        console.log(itemTemplate.description);
        console.log("Gold remaining: " + playerGold);
    } else {
        console.log("\nYou do not have enough gold for the " + itemTemplate.name + ".");
        console.log("Cost: " + itemTemplate.value + " gold | Your gold: " + playerGold);
    }
}

/**
 * Handles purchases at the blacksmith.
 * @param {number} choiceNum The chosen blacksmith item option.
 */
function buyFromBlacksmith(choiceNum) {
    if (choiceNum === 1) {
        console.log("\nBlacksmith: 'A fine blade for a brave adventurer!'");
        buyItem(sword);
    }
    else if (choiceNum === 2) {
        console.log("\nBlacksmith: 'This shield may save your life.'");
        buyItem(woodenShield);
    }
    else if (choiceNum === 3) {
        console.log("\nBlacksmith: 'Steel is what you need for a dragon.'");
        buyItem(steelSword);
    }
    else if (choiceNum === 4) {
        console.log("\nBlacksmith: 'Iron will serve you better than wood.'");
        buyItem(ironShield);
    }
}

/**
 * Handles purchases at the market.
 */
function buyFromMarket() {
    console.log("\nMerchant: 'This potion will heal your wounds!'");
    buyItem(healthPotion);
}

// ===========================
// Help System
// ===========================

/**
 * Shows all available game commands and how to use them.
 */
function showHelp() {
    console.log("\n=== AVAILABLE COMMANDS ===");

    console.log("\nMovement:");
    console.log("- Use numbered choices to travel between locations.");
    console.log("- Visit the forest to fight monsters and earn gold.");
    console.log("- Travel to the mountains when you are ready to face the dragon.");

    console.log("\nEquipment Progression:");
    console.log("- Basic Sword: useful against forest monsters.");
    console.log("- Wooden Shield: reduces damage from attacks.");
    console.log("- Steel Sword: required to defeat the dragon.");
    console.log("- Iron Shield: stronger protection than the Wooden Shield.");

    console.log("\nCombat:");
    console.log("- Combat automatically uses your best weapon and best armor.");
    console.log("- Weapons deal damage based on their effect value.");
    console.log("- Armor reduces incoming damage based on its effect value.");
    console.log("- You always take at least 1 damage from an attack.");

    console.log("\nDragon Requirement:");
    console.log("- You need the " + steelSword.name + " and any armor to defeat the dragon.");

    console.log("\nItems:");
    console.log("- Health potions restore " + healthPotion.effect + " health.");
    console.log("- Health cannot go above " + MAX_HEALTH + ".");
}

// ===========================
// Movement Functions
// ===========================

/**
 * Handles movement between locations.
 * @param {number} choiceNum The chosen option number.
 * @returns {boolean} True if movement was successful.
 */
function move(choiceNum) {
    let validMove = false;

    if (currentLocation === "village") {
        if (choiceNum === 1) {
            currentLocation = "blacksmith";
            console.log("\nYou enter the blacksmith's shop.");
            validMove = true;
        }
        else if (choiceNum === 2) {
            currentLocation = "market";
            console.log("\nYou enter the market.");
            validMove = true;
        }
        else if (choiceNum === 3) {
            currentLocation = "forest";
            console.log("\nYou venture into the forest...");
            validMove = true;
        }
        else if (choiceNum === 4) {
            if (!hasGoodEquipment()) {
                console.log("\nThe mountain path is too dangerous right now.");
                console.log("You need the " + steelSword.name + " and at least one armor item before facing the dragon.");
                return false;
            }

            currentLocation = "mountains";
            console.log("\nYou climb toward the dragon's mountain lair...");
            validMove = true;
        }
    }
    else if (currentLocation === "blacksmith" || currentLocation === "market") {
        if (choiceNum === 5 && currentLocation === "blacksmith") {
            currentLocation = "village";
            console.log("\nYou return to the village center.");
            validMove = true;
        }
        else if (choiceNum === 2 && currentLocation === "market") {
            currentLocation = "village";
            console.log("\nYou return to the village center.");
            validMove = true;
        }
    }
    else if (currentLocation === "forest") {
        if (choiceNum === 2) {
            currentLocation = "village";
            console.log("\nYou hurry back to the safety of the village.");
            validMove = true;
        }
    }
    else if (currentLocation === "mountains") {
        if (choiceNum === 2) {
            currentLocation = "village";
            console.log("\nYou descend from the mountains and return to the village.");
            validMove = true;
        }
    }

    return validMove;
}

// ===========================
// Victory Functions
// ===========================

/**
 * Displays the victory ending and ends the game.
 */
function completeGame() {
    console.log("\n=================================");
    console.log("           VICTORY!              ");
    console.log("=================================");
    console.log("You defeated the dragon and saved the kingdom!");
    console.log("The villagers will tell stories of " + playerName + " for generations.");

    console.log("\n=== FINAL STATS ===");
    console.log("Health Remaining: " + playerHealth + "/" + MAX_HEALTH);
    console.log("Gold Remaining: " + playerGold);

    let bestWeapon = getBestItem("weapon");
    let bestArmor = getBestItem("armor");

    console.log("Best Weapon: " + (bestWeapon ? bestWeapon.name : "None"));
    console.log("Best Armor: " + (bestArmor ? bestArmor.name : "None"));
    console.log("Items Remaining: " + inventory.length);

    gameRunning = false;
}

// ===========================
// Input Validation
// ===========================

/**
 * Gets the maximum valid choice number for the current location.
 * @returns {number} The maximum valid choice.
 */
function getMaxChoiceForLocation() {
    if (currentLocation === "village") return 9;
    if (currentLocation === "blacksmith") return 10;
    if (currentLocation === "market") return 7;
    if (currentLocation === "forest") return 7;
    if (currentLocation === "mountains") return 7;
    return 0;
}

/**
 * Validates if a choice number is within the valid range.
 * @param {string} input The user input to validate.
 * @param {number} max The maximum valid choice number.
 * @returns {boolean} True if choice is valid.
 */
function isValidChoice(input, max) {
    if (input.trim() === "") return false;
    if (!/^\d+$/.test(input.trim())) return false;

    let num = parseInt(input);
    return num >= 1 && num <= max;
}

/**
 * Handles a valid player choice based on the current location.
 * @param {number} choiceNum The validated player choice.
 */
function handlePlayerChoice(choiceNum) {
    if (currentLocation === "village") {
        if (choiceNum >= 1 && choiceNum <= 4) {
            move(choiceNum);
        }
        else if (choiceNum === 5) {
            showStatus();
        }
        else if (choiceNum === 6) {
            checkInventory();
        }
        else if (choiceNum === 7) {
            useItem();
        }
        else if (choiceNum === 8) {
            showHelp();
        }
        else if (choiceNum === 9) {
            gameRunning = false;
            console.log("\nThanks for playing!");
        }
    }
    else if (currentLocation === "blacksmith") {
        if (choiceNum >= 1 && choiceNum <= 4) {
            buyFromBlacksmith(choiceNum);
        }
        else if (choiceNum === 5) {
            move(choiceNum);
        }
        else if (choiceNum === 6) {
            showStatus();
        }
        else if (choiceNum === 7) {
            checkInventory();
        }
        else if (choiceNum === 8) {
            useItem();
        }
        else if (choiceNum === 9) {
            showHelp();
        }
        else if (choiceNum === 10) {
            gameRunning = false;
            console.log("\nThanks for playing!");
        }
    }
    else if (currentLocation === "market") {
        if (choiceNum === 1) {
            buyFromMarket();
        }
        else if (choiceNum === 2) {
            move(choiceNum);
        }
        else if (choiceNum === 3) {
            showStatus();
        }
        else if (choiceNum === 4) {
            checkInventory();
        }
        else if (choiceNum === 5) {
            useItem();
        }
        else if (choiceNum === 6) {
            showHelp();
        }
        else if (choiceNum === 7) {
            gameRunning = false;
            console.log("\nThanks for playing!");
        }
    }
    else if (currentLocation === "forest") {
        if (choiceNum === 1) {
            handleCombat(false);
        }
        else if (choiceNum === 2) {
            move(choiceNum);
        }
        else if (choiceNum === 3) {
            showStatus();
        }
        else if (choiceNum === 4) {
            checkInventory();
        }
        else if (choiceNum === 5) {
            useItem();
        }
        else if (choiceNum === 6) {
            showHelp();
        }
        else if (choiceNum === 7) {
            gameRunning = false;
            console.log("\nThanks for playing!");
        }
    }
    else if (currentLocation === "mountains") {
        if (choiceNum === 1) {
            handleCombat(true);

            if (gameRunning && playerHealth > 0) {
                currentLocation = "village";
                console.log("\nYou retreat from the mountains and return to the village.");
            }
        }
        else if (choiceNum === 2) {
            move(choiceNum);
        }
        else if (choiceNum === 3) {
            showStatus();
        }
        else if (choiceNum === 4) {
            checkInventory();
        }
        else if (choiceNum === 5) {
            useItem();
        }
        else if (choiceNum === 6) {
            showHelp();
        }
        else if (choiceNum === 7) {
            gameRunning = false;
            console.log("\nThanks for playing!");
        }
    }
}

// ===========================
// Main Game Loop
// ===========================

console.log("=================================");
console.log("       The Dragon's Quest        ");
console.log("=================================");
console.log("\nYour quest: Defeat the dragon in the mountains!");
console.log("Earn gold in the forest, buy better equipment, and prepare for the final battle.");

// Get player's name
playerName = readline.question("\nWhat is your name, brave adventurer? ").trim();

if (playerName === "") {
    playerName = "Adventurer";
}

console.log("\nWelcome, " + playerName + "!");
console.log("You start with " + playerGold + " gold.");

while (gameRunning) {
    showLocation();

    let validChoice = false;

    while (!validChoice && gameRunning) {
        try {
            let maxChoice = getMaxChoiceForLocation();
            let choice = readline.question("\nEnter choice (number): ");

            if (!isValidChoice(choice, maxChoice)) {
                throw "Please enter a number between 1 and " + maxChoice + ".";
            }

            validChoice = true;
            let choiceNum = parseInt(choice);
            handlePlayerChoice(choiceNum);

        } catch (error) {
            console.log("\nError: " + error);
            console.log("Please try again!");
        }
    }

    if (playerHealth <= 0) {
        console.log("\nGame Over! Your health reached 0!");
        gameRunning = false;
    }
}

// =========================================
// END Lab: Expanded Item and Combat System
// =========================================
