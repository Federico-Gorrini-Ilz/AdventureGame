// ===========================================
// The Dragon's Quest - Text Adventure Game
// A progression-based learning project
// ===========================================

// Include readline for player input
const readline = require('readline-sync');

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
// START Lab: Inventory System
// =========================================
// Item variables - replaced with inventory array
// let hasWeapon = false;
// let hasPotion = false;
// let hasArmor = false;

// Create empty inventory array
let inventory = [];  // Will store all player items

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
    
    // Display inventory in status
    console.log("🎒 Inventory: ");
    if (inventory.length === 0) {
        console.log("   Nothing in inventory");
    } else {
        inventory.forEach((item, index) => {
            console.log("   " + (index + 1) + ". " + item);
        });
    }
}

/**
 * Shows the current location's description and available choices
 */
function showLocation() {
    console.log("\n=== " + currentLocation.toUpperCase() + " ===");
    
    if (currentLocation === "village") {
        console.log("You're in a bustling village. The blacksmith and market are nearby.");
        console.log("\nWhat would you like to do?");
        console.log("1: Go to blacksmith");
        console.log("2: Go to market");
        console.log("3: Enter forest");
        console.log("4: Check status");
        console.log("5: Use item");
        console.log("6: Help");
        console.log("7: Quit game");
    } 
    else if (currentLocation === "blacksmith") {
        console.log("The heat from the forge fills the air. Weapons and armor line the walls.");
        console.log("\nWhat would you like to do?");
        console.log("1: Buy sword (10 gold)");
        console.log("2: Return to village");
        console.log("3: Check status");
        console.log("4: Use item");
        console.log("5: Help");
        console.log("6: Quit game");
    }
    else if (currentLocation === "market") {
        console.log("Merchants sell their wares from colorful stalls. A potion seller catches your eye.");
        console.log("\nWhat would you like to do?");
        console.log("1: Buy potion (5 gold)");
        console.log("2: Return to village");
        console.log("3: Check status");
        console.log("4: Use item");
        console.log("5: Help");
        console.log("6: Quit game");
    }
    else if (currentLocation === "forest") {
        console.log("The forest is dark and foreboding. You hear strange noises all around you.");
        console.log("\nWhat would you like to do?");
        console.log("1: Return to village");
        console.log("2: Check status");
        console.log("3: Use item");
        console.log("4: Help");
        console.log("5: Quit game");
    }
}

// ===========================
// Combat Functions
// Functions that handle battles and health
// ===========================

/**
 * Handles monster battles
 * Checks if player has weapon and manages combat results
 * @returns {boolean} true if player wins, false if they retreat
 */
function handleCombat() {
    // Now using inventory.includes instead of hasWeapon
    if (inventory.includes("sword")) {
        console.log("You have a sword! You attack!");
        console.log("Victory! You found 10 gold!");
        playerGold += 10;
        return true;
    } else {
        console.log("Without a weapon, you must retreat!");
        updateHealth(-20);
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
    // Updated to use inventory array
    if (inventory.includes("potion")) {
        console.log("You drink the healing potion.");
        updateHealth(30);
        
        // Remove the potion from inventory
        let potionIndex = inventory.indexOf("potion");
        inventory.splice(potionIndex, 1);
        
        return true;
    }
    console.log("You don't have any usable items!");
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
    
    // Display all inventory items with numbers
    inventory.forEach((item, index) => {
        console.log((index + 1) + ". " + item);
    });
}

// ===========================
// Shopping Functions
// Functions that handle buying items
// ===========================

/**
 * Handles purchasing items at the blacksmith
 */
function buyFromBlacksmith() {
    if (playerGold >= 10) {
        console.log("\nBlacksmith: 'A fine blade for a brave adventurer!'");
        playerGold -= 10;
        
        // Add sword to inventory array instead of setting hasWeapon flag
        inventory.push("sword");
        
        console.log("You bought a sword for 10 gold!");
        console.log("Gold remaining: " + playerGold);
    } else {
        console.log("\nBlacksmith: 'Come back when you have more gold!'");
    }
}

/**
 * Handles purchasing items at the market
 */
function buyFromMarket() {
    if (playerGold >= 5) {
        console.log("\nMerchant: 'This potion will heal your wounds!'");
        playerGold -= 5;
        
        // Add potion to inventory array instead of setting hasPotion flag
        inventory.push("potion");
        
        console.log("You bought a health potion for 5 gold!");
        console.log("Gold remaining: " + playerGold);
    } else {
        console.log("\nMerchant: 'No gold, no potion!'");
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
    console.log("- In the village, choose 1-3 to travel to different locations");
    console.log("- In other locations, choose the return option to go back to the village");
    
    console.log("\nBattle Information:");
    console.log("- You need a sword to win battles");
    console.log("- Monsters appear in the forest");
    console.log("- Without a weapon, you'll lose health when retreating");
    
    console.log("\nItem Usage:");
    console.log("- Health potions restore 30 health");
    console.log("- You can buy potions at the market for 5 gold");
    console.log("- You can buy a sword at the blacksmith for 10 gold");
    
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
            
            // Trigger combat when entering forest
            console.log("\nA monster appears!");
            if (!handleCombat()) {
                currentLocation = "village";
            }
        }
    }
    else if (currentLocation === "blacksmith") {
        if (choiceNum === 2) {
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
        if (choiceNum === 1) {
            currentLocation = "village";
            console.log("\nYou hurry back to the safety of the village.");
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
    if (input === "") return false;
    let num = parseInt(input);
    return num >= 1 && num <= max;
}

// ===========================
// Main Game Loop
// Controls the flow of the game
// ===========================

console.log("=================================");
console.log("       The Dragon's Quest        ");
console.log("=================================");
console.log("\nYour quest: Defeat the dragon in the mountains!");

// Get player's name
playerName = readline.question("\nWhat is your name, brave adventurer? ");
console.log("\nWelcome, " + playerName + "!");
console.log("You start with " + playerGold + " gold.");

while (gameRunning) {
    // Show current location and choices
    showLocation();
    
    // Get and validate player choice
    let validChoice = false;
    while (!validChoice) {
        try {
            let choice = readline.question("\nEnter choice (number): ");
            
            // Check for empty input
            if (choice.trim() === "") {
                throw "Please enter a number!";
            }
            
            // Convert to number and check if it's a valid number
            let choiceNum = parseInt(choice);
            if (isNaN(choiceNum)) {
                throw "That's not a number! Please enter a number.";
            }
            
            // Handle choices based on location
            if (currentLocation === "village") {
                if (choiceNum < 1 || choiceNum > 7) {
                    throw "Please enter a number between 1 and 7.";
                }
                
                validChoice = true;
                
                if (choiceNum <= 3) {
                    move(choiceNum);
                }
                else if (choiceNum === 4) {
                    showStatus();
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
            else if (currentLocation === "blacksmith") {
                if (choiceNum < 1 || choiceNum > 6) {
                    throw "Please enter a number between 1 and 6.";
                }
                
                validChoice = true;
                
                if (choiceNum === 1) {
                    buyFromBlacksmith();
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
            else if (currentLocation === "market") {
                if (choiceNum < 1 || choiceNum > 6) {
                    throw "Please enter a number between 1 and 6.";
                }
                
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
                if (choiceNum < 1 || choiceNum > 5) {
                    throw "Please enter a number between 1 and 5.";
                }
                
                validChoice = true;
                
                if (choiceNum === 1) {
                    move(choiceNum);
                }
                else if (choiceNum === 2) {
                    showStatus();
                }
                else if (choiceNum === 3) {
                    useItem();
                }
                else if (choiceNum === 4) {
                    showHelp();
                }
                else if (choiceNum === 5) {
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

// =========================================
// END Lab: Inventory System Part 1
// =========================================
