// ===========================================
// The Dragon's Quest - Text Adventure Game
// A progression-based learning project
// ===========================================

// NOTE: NODE.JS MUST BE INSTALLED TO RUN THE GRAPHICS.
// GRAPHICS OPEN USING NODE.JS BUILT-IN child_process.
// Bash: npm install readline-sync

// Lazy-load readline for player input
let readline;

const { exec } = require("child_process");

function getReadline() {
    if (!readline) {
        readline = require("readline-sync");
    }
    return readline;
}

function openImage(imagePath) {
    exec(`start "" "${imagePath}"`);
}

// Game state variables
let gameRunning = true;
let playerName = "";
let playerHealth = 100;
let playerGold = 20;  // Starting gold
let currentLocation = "village";

// Weapon damage (starts at 0 until player buys a sword)
let weaponDamage = 0;      // Base weapon damage
let monsterDefense = 5;    // Monster's defense value
let healingPotionValue = 30;  // How much health is restored

// =========================================
// START Lab: Enhanced Item System
// =========================================
// Item templates with properties
const healthPotion = {
    name: "Health Potion",
    type: "potion",
    value: 5,     // Cost in gold
    effect: 30,   // Healing amount
    description: "Restores 30 health points"
};

const sword = {
    name: "Sword",
    type: "weapon",
    value: 10,    // Cost in gold
    effect: 10,   // Damage amount
    description: "A sturdy blade for combat"
};

const woodenShield = {
    name: "Wooden Shield",
    type: "armor",
    value: 8,     // Cost in gold
    effect: 5,    // Protection amount
    description: "Reduces damage taken in combat"
};

const steelSword = {
    name: "Steel Sword",
    type: "weapon",
    value: 25,    // Cost in gold
    effect: 20,   // Damage amount
    description: "A stronger blade for dangerous battles"
};

const ironShield = {
    name: "Iron Shield",
    type: "armor",
    value: 18,    // Cost in gold
    effect: 10,   // Protection amount
    description: "A stronger shield with better protection"
};

// Create empty inventory array (from previous lab)
let inventory = [];  // Will now store item objects instead of strings

// ===========================
// Display Functions
// Functions that show game information to the player
// ===========================

/**
 * Shows the player's current stats
 * Displays health, gold, and current location
 */
function showStatus() {
    console.log("\n=== " + playerName + "'s Status ===");
    console.log("❤️  Health: " + playerHealth);
    console.log("💰 Gold: " + playerGold);
    console.log("📍 Location: " + currentLocation);
    
    // Enhanced inventory display with item details
    console.log("🎒 Inventory: ");
    if (inventory.length === 0) {
        console.log("   Nothing in inventory");
    } else {
        inventory.forEach((item, index) => {
            console.log("   " + (index + 1) + ". " + item.name + " - " + item.description);
        });
    }
}

/**
 * Shows the current location's description and available choices
 */
function showLocation() {
    console.log("\n=== " + currentLocation.toUpperCase() + " ===");
    
    if (currentLocation === "village") {
        console.log("Open image: assets/village.png");
        
        console.log("You're in a bustling village. The blacksmith and market are nearby.");
        console.log("\nWhat would you like to do?");
        console.log("1: Go to blacksmith");
        console.log("2: Go to market");
        console.log("3: Enter forest");
        console.log("4: Go to mountains");
        console.log("5: Check status");
        console.log("6: Use item");
        console.log("7: Help");
        console.log("8: Quit game");
    } 
    else if (currentLocation === "blacksmith") {
        console.log("Open image: assets/blacksmith.png");

        console.log("The heat from the forge fills the air. Weapons and armor line the walls.");
        console.log("\nWhat would you like to do?");
        console.log("1: Buy sword (" + sword.value + " gold) - " + sword.description);
        console.log("2: Buy wooden shield (" + woodenShield.value + " gold) - " + woodenShield.description);
        console.log("3: Buy steel sword (" + steelSword.value + " gold) - " + steelSword.description);
        console.log("4: Buy iron shield (" + ironShield.value + " gold) - " + ironShield.description);
        console.log("5: Return to village");
        console.log("6: Check status");
        console.log("7: Use item");
        console.log("8: Help");
        console.log("9: Quit game");
    }
    else if (currentLocation === "market") {
        console.log("Open image: assets/market.png");

        console.log("Merchants sell their wares from colorful stalls. A potion seller catches your eye.");
        console.log("\nWhat would you like to do?");
        console.log("1: Buy potion (" + healthPotion.value + " gold)");
        console.log("2: Return to village");
        console.log("3: Check status");
        console.log("4: Use item");
        console.log("5: Help");
        console.log("6: Quit game");
    }
    else if (currentLocation === "forest") {
        console.log("Open image: assets/forest.png");

        console.log("The forest is dark and foreboding. You hear strange noises all around you.");
        console.log("\nWhat would you like to do?");
        console.log("1: Fight monster");
        console.log("2: Return to village");
        console.log("3: Check status");
        console.log("4: Use item");
        console.log("5: Help");
        console.log("6: Quit game");
    }
    else if (currentLocation === "mountains") {
        console.log("Open image: assets/mountains.png");

        console.log("The mountain air is cold. The dragon waits nearby.");
        console.log("\nWhat would you like to do?");
        console.log("1: Face the dragon");
        console.log("2: Return to village");
        console.log("3: Check status");
        console.log("4: Use item");
        console.log("5: Help");
        console.log("6: Quit game");
    }
}

// ===========================
// Combat Functions
// Functions that handle battles and health
// ===========================

/**
 * Gets all inventory items of a specified type
 * @param {string} type The type of item to get
 * @returns {Array} All items matching the type
 */
function getItemsByType(type) {
    return inventory.filter(item => item.type === type);
}

/**
 * Gets the strongest item of a specified type
 * @param {string} type The type of item to check for
 * @returns {object|null} The best item, or null if none found
 */
function getBestItem(type) {
    let items = getItemsByType(type);

    if (items.length === 0) {
        return null;
    }

    let bestItem = items[0];
    items.forEach((item) => {
        if (item.effect > bestItem.effect) {
            bestItem = item;
        }
    });

    return bestItem;
}

/**
 * Checks if player has an item of specified type 
 * @param {string} type The type of item to check for
 * @returns {boolean} True if player has the item type
 */
function hasItemType(type) {
    return inventory.some(item => item.type === type);
}

/**
 * Checks if player is ready to face the dragon
 * @returns {boolean} True if player has the steel sword and any armor
 */
function hasGoodEquipment() {
    return inventory.some(item => item.name === "Steel Sword") && hasItemType("armor");
}

/**
 * Handles monster battles
 * Checks if player has weapon and manages combat results
 * @param {boolean} isDragon Whether this is the dragon battle
 * @returns {boolean} true if player wins, false if they retreat
 */
function handleCombat(isDragon = false) {
    let enemyName = "monster";
    let enemyHealth = 20;
    let enemyDamage = 10;

    if (isDragon === true) {
        console.log("Open image: assets/face_the_dragon.png");
        openImage("assets/face_the_dragon.png");

        enemyName = "dragon";
        enemyHealth = 50;
        enemyDamage = 20;
    } else {
        console.log("Open image: assets/forest_monster.png");
        openImage("assets/forest_monster.png");
    }

    let weapon = getBestItem("weapon");
    let armor = getBestItem("armor");
    
    if (isDragon === true && !hasGoodEquipment()) {
        console.log("The dragon is too strong right now!");
        console.log("You need the Steel Sword and any armor before you can win.");
        return false;
    }

    if (weapon) {
        console.log("You attack with your " + weapon.name + "!");
        console.log("Best weapon: " + weapon.name + " (" + weapon.effect + " damage)");

        if (armor) {
            console.log("Best armor: " + armor.name + " (" + armor.effect + " protection)");
        } else {
            console.log("You have no armor for this fight.");
        }

        while (enemyHealth > 0 && playerHealth > 0) {
            enemyHealth -= weapon.effect;
            console.log("You deal " + weapon.effect + " damage!");

            if (enemyHealth > 0) {
                let damageTaken = enemyDamage;

                if (armor) {
                    damageTaken = enemyDamage - armor.effect;
                    if (damageTaken < 1) {
                        damageTaken = 1;
                    }
                    console.log("Your armor blocks " + (enemyDamage - damageTaken) + " damage.");
                }

                console.log("The " + enemyName + " attacks for " + enemyDamage + " damage.");
                updateHealth(-damageTaken);
            }
        }

        if (playerHealth <= 0) {
            return false;
        }

        if (isDragon === true) {
            console.log("Open image: assets/dragon_victory.png");
            openImage("assets/dragon_victory.png");
            
            console.log("Victory! You defeated the dragon and saved the kingdom!");
            console.log("Final stats:");
            showStatus();
            gameRunning = false;
        } else {
            console.log("Victory! You found 10 gold!");
            playerGold += 10;
        }
        return true;
    } else {
        console.log("Without a weapon, you must retreat!");
        let damageTaken = enemyDamage;

        if (armor) {
            damageTaken = enemyDamage - armor.effect;
            if (damageTaken < 1) {
                damageTaken = 1;
            }
            console.log("Your armor blocks " + (enemyDamage - damageTaken) + " damage.");
        }

        updateHealth(-damageTaken);
        return false;
    }
}

/**
 * Updates player health, keeping it between 0 and 100
 * @param {number} amount Amount to change health by (positive for healing, negative for damage)
 * @returns {number} The new health value
 */
function updateHealth(amount) {
    playerHealth += amount;
    
    if (playerHealth > 100) {
        playerHealth = 100;
        console.log("You're at full health!");
    }
    if (playerHealth < 0) {
        playerHealth = 0;
        console.log("You're gravely wounded!");
    }
    
    console.log("Health is now: " + playerHealth);
    return playerHealth;
}

// ===========================
// Item Functions
// Functions that handle item usage and inventory
// ===========================

/**
 * Handles using items like potions
 * @returns {boolean} true if item was used successfully, false if not
 */
function useItem() {
    if (inventory.length === 0) {
        console.log("\nYou have no items!");
        return false;
    }

    console.log("\n=== Inventory ===");
    inventory.forEach((item, index) => {
        console.log((index + 1) + ". " + item.name);
    });
    
    let choice = getReadline().question("Use which item? (number or 'cancel'): ");
    if (choice === 'cancel') return false;
    
    let index = parseInt(choice) - 1;
    if (index >= 0 && index < inventory.length) {
        let item = inventory[index];
        
        if (item.type === "potion") {
            console.log("\nYou drink the " + item.name + ".");
            updateHealth(item.effect);
            inventory.splice(index, 1);
            console.log("Health restored to: " + playerHealth);
            return true;
        } else if (item.type === "weapon") {
            console.log("\nYou ready your " + item.name + " for battle.");
            return true;
        } else if (item.type === "armor") {
            console.log("\nYou ready your " + item.name + " for protection.");
            return true;
        }
    } else {
        console.log("\nInvalid item number!");
    }
    return false;
}

/**
 * Displays the player's inventory
 */
function checkInventory() {
    console.log("\n=== INVENTORY ===");
    if (inventory.length === 0) {
        console.log("Your inventory is empty!");
        return;
    }
    
    // Display all inventory items with numbers and descriptions
    inventory.forEach((item, index) => {
        console.log((index + 1) + ". " + item.name + " - " + item.description);
    });
}

// ===========================
// Shopping Functions
// Functions that handle buying items
// ===========================

/**
 * Handles purchasing items at the blacksmith
 * @param {number} choiceNum The item choice to buy
 */
function buyFromBlacksmith(choiceNum) {
    let itemsForSale = [sword, woodenShield, steelSword, ironShield];
    let item = itemsForSale[choiceNum - 1];

    if (item && playerGold >= item.value) {
        console.log("Blacksmith: 'A good choice!'" );
        playerGold -= item.value;
        inventory.push({...item});
        console.log("You bought a " + item.name + " for " + item.value + " gold!");
        console.log("Gold remaining: " + playerGold);
    } else {
        console.log("\nBlacksmith: 'Come back when you have more gold!'" );
    }
}

/**
 * Handles purchasing items at the market
 */
function buyFromMarket() {
    if (playerGold >= healthPotion.value) {
        console.log("\nMerchant: 'This potion will heal your wounds!'" );
        playerGold -= healthPotion.value;
        
        // Add potion object to inventory instead of just the name
        inventory.push({...healthPotion}); // Create a copy of the potion object
        
        console.log("You bought a " + healthPotion.name + " for " + healthPotion.value + " gold!");
        console.log("Gold remaining: " + playerGold);
    } else {
        console.log("\nMerchant: 'No gold, no potion!'" );
    }
}

// ===========================
// Help System
// Provides information about available commands
// ===========================

/**
 * Shows all available game commands and how to use them
 */
function showHelp() {
    console.log("\n=== AVAILABLE COMMANDS ===");
    
    console.log("\nMovement Commands:");
    console.log("- In the village, choose 1-4 to travel to different locations");
    console.log("- In other locations, choose the return option to go back to the village");
    
    console.log("\nBattle Information:");
    console.log("- You need a weapon to win battles");
    console.log("- Weapons have different damage values");
    console.log("- Armor reduces damage taken in combat");
    console.log("- Monsters appear in the forest");
    console.log("- You need the Steel Sword and any armor to defeat the dragon");
    
    console.log("\nItem Usage:");
    console.log("- Health potions restore health based on their effect value");
    console.log("- You can buy potions at the market for " + healthPotion.value + " gold");
    console.log("- You can buy weapons and armor at the blacksmith");
    
    console.log("\nOther Commands:");
    console.log("- Choose the status option to see your health and gold");
    console.log("- Choose the help option to see this message again");
    console.log("- Choose the quit option to end the game");
    
    console.log("\nTips:");
    console.log("- Keep healing potions for dangerous areas");
    console.log("- Defeat monsters to earn gold");
    console.log("- Health can't go above 100");
}

// ===========================
// Movement Functions
// Functions that handle player movement
// ===========================

/**
 * Handles movement between locations
 * @param {number} choiceNum The chosen option number
 * @returns {boolean} True if movement was successful
 */
function move(choiceNum) {
    let validMove = false;
    
    if (currentLocation === "village") {
        if (choiceNum === 1) {
            currentLocation = "blacksmith";
            console.log("\nYou enter the blacksmith's shop.");
            openImage("assets/blacksmith.png");
            validMove = true;
        }
        else if (choiceNum === 2) {
            currentLocation = "market";
            console.log("\nYou enter the market.");
            openImage("assets/market.png");
            validMove = true;
        }
        else if (choiceNum === 3) {
            currentLocation = "forest";
            console.log("\nYou venture into the forest...");
            openImage("assets/forest.png");
            validMove = true;
        }
        else if (choiceNum === 4) {
            if (hasGoodEquipment()) {
                currentLocation = "mountains";
                console.log("\nYou travel to the mountains...");
                openImage("assets/mountains.png");
                validMove = true;
            } else {
                console.log("You should get the Steel Sword and some armor before going to the mountains.");
            }
        }
    }
    else if (currentLocation === "blacksmith") {
        if (choiceNum === 5) {
            currentLocation = "village";
            console.log("\nYou return to the village center.");
            validMove = true;
        }
    }
    else if (currentLocation === "market") {
        if (choiceNum === 2) {
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
            console.log("\nYou return to the village center.");
            validMove = true;
        }
    }
    
    return validMove;
}

// ===========================
// Input Validation
// Functions that validate player input
// ===========================

/**
 * Validates if a choice number is within valid range
 * @param {string} input The user input to validate
 * @param {number} max The maximum valid choice number
 * @returns {boolean} True if choice is valid
 */
function isValidChoice(input, max) {
    let inputString = String(input).trim();

    if (inputString === "") {
        return false;
    }

    let num = Number(inputString);

    return Number.isInteger(num) && num >= 1 && num <= max;
}

// ===========================
// Main Game Loop
// Controls the flow of the game
// ===========================

function startGame() {
    console.log("=================================");
    console.log("       THE DRAGON'S QUEST        ");
    console.log("=================================");
    console.log("\nYour quest: Defeat the dragon in the mountains!");

    console.log("NOTE: NODE.JS MUST BE INSTALLED TO RUN THE GRAPHICS.");
    console.log("GRAPHICS OPEN USING NODE.JS BUILT-IN child_process.");
    console.log("Bash: npm install readline-sync");
    
    console.log("Open image: assets/quest_begins.png");
    openImage("assets/quest_begins.png");

    // Get player's name
    playerName = getReadline().question("\nWhat is your name, brave adventurer? ");

    console.log("\n=================================");
    console.log("          YOUR QUEST BEGINS      ");
    console.log("=================================");
    console.log("\nWelcome, " + playerName + "!");
    console.log("You start with " + playerGold + " gold.");

    while (gameRunning) {
        // Show current location and choices
        showLocation();
        
        // Get and validate player choice
        let validChoice = false;
        while (!validChoice) {
            try {
                let choice = getReadline().question("\nEnter choice (number): ");

                let maxChoice;

                if (currentLocation === "village") {
                    maxChoice = 8;
                } 
                else if (currentLocation === "blacksmith") {
                    maxChoice = 9;
                } 
                else {
                    maxChoice = 6;
                }

                if (!isValidChoice(choice, maxChoice)) {
                    throw "Please enter a number between 1 and " + maxChoice + ".";
                }

                let choiceNum = Number(choice);
                
                // Handle choices based on location
                if (currentLocation === "village") {
                    validChoice = true;
                    
                    if (choiceNum <= 4) {
                        move(choiceNum);
                    }
                    else if (choiceNum === 5) {
                        showStatus();
                    }
                    else if (choiceNum === 6) {
                        useItem();
                    }
                    else if (choiceNum === 7) {
                        showHelp();
                    }
                    else if (choiceNum === 8) {
                        gameRunning = false;
                        console.log("\nThanks for playing!");
                    }
                }
                else if (currentLocation === "blacksmith") {
                    validChoice = true;
                    
                    if (choiceNum <= 4) {
                        buyFromBlacksmith(choiceNum);
                    }
                    else if (choiceNum === 5) {
                        move(choiceNum);
                    }
                    else if (choiceNum === 6) {
                        showStatus();
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
                else if (currentLocation === "market") {
                    validChoice = true;
                    
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
                        useItem();
                    }
                    else if (choiceNum === 5) {
                        showHelp();
                    }
                    else if (choiceNum === 6) {
                        gameRunning = false;
                        console.log("\nThanks for playing!");
                    }
                }
                else if (currentLocation === "forest") {
                    validChoice = true;
                    
                    if (choiceNum === 1) {
                        handleCombat();
                    }
                    else if (choiceNum === 2) {
                        move(choiceNum);
                    }
                    else if (choiceNum === 3) {
                        showStatus();
                    }
                    else if (choiceNum === 4) {
                        useItem();
                    }
                    else if (choiceNum === 5) {
                        showHelp();
                    }
                    else if (choiceNum === 6) {
                        gameRunning = false;
                        console.log("\nThanks for playing!");
                    }
                }
                else if (currentLocation === "mountains") {
                    validChoice = true;
                    
                    if (choiceNum === 1) {
                        handleCombat(true);
                    }
                    else if (choiceNum === 2) {
                        move(choiceNum);
                    }
                    else if (choiceNum === 3) {
                        showStatus();
                    }
                    else if (choiceNum === 4) {
                        useItem();
                    }
                    else if (choiceNum === 5) {
                        showHelp();
                    }
                    else if (choiceNum === 6) {
                        gameRunning = false;
                        console.log("\nThanks for playing!");
                    }
                }
                
            } catch (error) {
                console.log("\nError: " + error);
                console.log("Please try again!");
            }
        }

        // Check if player died
        if (playerHealth <= 0) {
            console.log("\nGame Over! Your health reached 0!");
            gameRunning = false;
        }
    }
}

// Start the game only when this file is run directly
if (require.main === module) {
    startGame();
}

// Export functions and objects for automated testing
module.exports = {
    startGame,
    healthPotion,
    sword,
    woodenShield,
    steelSword,
    ironShield,
    inventory,
    showStatus,
    showLocation,
    getItemsByType,
    getBestItem,
    hasItemType,
    hasGoodEquipment,
    handleCombat,
    updateHealth,
    useItem,
    checkInventory,
    buyFromBlacksmith,
    buyFromMarket,
    showHelp,
    move,
    isValidChoice
};

// =========================================
// END Lab: Enhanced Item System
// =========================================
