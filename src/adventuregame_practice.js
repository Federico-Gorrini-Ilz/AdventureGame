// ===========================================
// The Dragon's Quest - Text Adventure Game
// Simplified Enhanced Item System
// ===========================================

const readline = require("readline-sync");

// Game state
let gameRunning = true;
let playerName = "";
let playerHealth = 100;
let playerGold = 20;
let currentLocation = "village";
let inventory = [];

// Battle values
let monsterDefense = 5;

// Item templates
const sword = {
    name: "Sword",
    type: "weapon",
    cost: 10,
    effect: 10,
    description: "A sturdy blade for combat"
};

const healthPotion = {
    name: "Health Potion",
    type: "potion",
    cost: 5,
    effect: 30,
    description: "Restores 30 health"
};

// Start game
console.log("=================================");
console.log("       The Dragon's Quest        ");
console.log("=================================");
console.log("\nYour quest: Defeat the dragon in the mountains!");

playerName = readline.question("\nWhat is your name, brave adventurer? ");
console.log("\nWelcome, " + playerName + "!");
console.log("You start with " + playerGold + " gold.");

// Display current location and options
function showLocation() {
    console.log("\n=== " + currentLocation.toUpperCase() + " ===");

    if (currentLocation === "village") {
        console.log("You are in a bustling village.");
        console.log("1: Go to blacksmith");
        console.log("2: Go to market");
        console.log("3: Enter forest");
        console.log("4: Check status");
        console.log("5: Use item");
        console.log("6: Help");
        console.log("7: Quit game");
    } else if (currentLocation === "blacksmith") {
        console.log("The blacksmith sells weapons.");
        console.log("1: Buy sword (" + sword.cost + " gold)");
        console.log("2: Return to village");
        console.log("3: Check status");
        console.log("4: Use item");
        console.log("5: Help");
        console.log("6: Quit game");
    } else if (currentLocation === "market") {
        console.log("The market sells useful supplies.");
        console.log("1: Buy potion (" + healthPotion.cost + " gold)");
        console.log("2: Return to village");
        console.log("3: Check status");
        console.log("4: Use item");
        console.log("5: Help");
        console.log("6: Quit game");
    } else if (currentLocation === "forest") {
        console.log("The forest is dark and dangerous.");
        console.log("1: Return to village");
        console.log("2: Check status");
        console.log("3: Use item");
        console.log("4: Help");
        console.log("5: Quit game");
    }
}

// Show player stats and inventory
function showStatus() {
    console.log("\n=== " + playerName + "'s Status ===");
    console.log("Health: " + playerHealth);
    console.log("Gold: " + playerGold);
    console.log("Location: " + currentLocation);
    checkInventory();
}

// Display inventory
function checkInventory() {
    console.log("\n=== INVENTORY ===");

    if (inventory.length === 0) {
        console.log("Your inventory is empty.");
        return;
    }

    inventory.forEach((item, index) => {
        console.log((index + 1) + ". " + item.name + " - " + item.description);
    });
}

// Update health and keep it between 0 and 100
function updateHealth(amount) {
    playerHealth += amount;

    if (playerHealth > 100) {
        playerHealth = 100;
    }

    if (playerHealth < 0) {
        playerHealth = 0;
    }

    console.log("Health is now: " + playerHealth);
}

// Check if player has an item type
function hasItemType(type) {
    return inventory.some(item => item.type === type);
}

// Buy an item
function buyItem(item) {
    if (playerGold >= item.cost) {
        playerGold -= item.cost;
        inventory.push({ ...item });

        console.log("\nYou bought a " + item.name + ".");
        console.log("Gold remaining: " + playerGold);
    } else {
        console.log("\nYou do not have enough gold.");
    }
}

// Use potion or ready weapon
function useItem() {
    if (inventory.length === 0) {
        console.log("\nYou have no items.");
        return;
    }

    checkInventory();

    let choice = readline.question("\nUse which item? Enter number or 'cancel': ");

    if (choice.toLowerCase() === "cancel") {
        return;
    }

    let index = parseInt(choice) - 1;

    if (isNaN(index) || index < 0 || index >= inventory.length) {
        console.log("\nInvalid item number.");
        return;
    }

    let item = inventory[index];

    if (item.type === "potion") {
        console.log("\nYou drink the " + item.name + ".");
        updateHealth(item.effect);
        inventory.splice(index, 1);
    } else if (item.type === "weapon") {
        console.log("\nYou ready your " + item.name + " for battle.");
    }
}

// Handle combat
function handleCombat() {
    if (!hasItemType("weapon")) {
        console.log("\nWithout a weapon, you retreat.");
        updateHealth(-20);
        currentLocation = "village";
        return;
    }

    let weapon = inventory.find(item => item.type === "weapon");
    let damage = weapon.effect - monsterDefense;

    if (damage < 1) {
        damage = 1;
    }

    console.log("\nA monster appears!");
    console.log("You attack with your " + weapon.name + ".");
    console.log("Monster defense: " + monsterDefense);
    console.log("Damage dealt: " + damage);
    console.log("Victory! You found 10 gold.");

    playerGold += 10;
}

// Move between locations
function move(choiceNum) {
    if (currentLocation === "village") {
        if (choiceNum === 1) {
            currentLocation = "blacksmith";
        } else if (choiceNum === 2) {
            currentLocation = "market";
        } else if (choiceNum === 3) {
            currentLocation = "forest";
            handleCombat();
        }
    } else if (choiceNum === 1 || choiceNum === 2) {
        currentLocation = "village";
    }
}

// Show help
function showHelp() {
    console.log("\n=== HELP ===");
    console.log("Buy a sword at the blacksmith to win battles.");
    console.log("Buy potions at the market to restore health.");
    console.log("Enter the forest to fight monsters and earn gold.");
    console.log("Health cannot go above 100.");
}

// Get valid menu choice
function getChoice(max) {
    while (true) {
        try {
            let input = readline.question("\nEnter choice: ");

            if (input.trim() === "") {
                throw "Please enter a number.";
            }

            let choiceNum = parseInt(input);

            if (isNaN(choiceNum)) {
                throw "That is not a number.";
            }

            if (choiceNum < 1 || choiceNum > max) {
                throw "Please enter a number between 1 and " + max + ".";
            }

            return choiceNum;
        } catch (error) {
            console.log("\nError: " + error);
        }
    }
}

// Main game loop
while (gameRunning) {
    showLocation();

    let maxChoice = currentLocation === "village" ? 7 : currentLocation === "forest" ? 5 : 6;
    let choiceNum = getChoice(maxChoice);

    if (currentLocation === "village") {
        if (choiceNum <= 3) move(choiceNum);
        else if (choiceNum === 4) showStatus();
        else if (choiceNum === 5) useItem();
        else if (choiceNum === 6) showHelp();
        else gameRunning = false;
    } else if (currentLocation === "blacksmith") {
        if (choiceNum === 1) buyItem(sword);
        else if (choiceNum === 2) move(choiceNum);
        else if (choiceNum === 3) showStatus();
        else if (choiceNum === 4) useItem();
        else if (choiceNum === 5) showHelp();
        else gameRunning = false;
    } else if (currentLocation === "market") {
        if (choiceNum === 1) buyItem(healthPotion);
        else if (choiceNum === 2) move(choiceNum);
        else if (choiceNum === 3) showStatus();
        else if (choiceNum === 4) useItem();
        else if (choiceNum === 5) showHelp();
        else gameRunning = false;
    } else if (currentLocation === "forest") {
        if (choiceNum === 1) move(choiceNum);
        else if (choiceNum === 2) showStatus();
        else if (choiceNum === 3) useItem();
        else if (choiceNum === 4) showHelp();
        else gameRunning = false;
    }

    if (playerHealth <= 0) {
        console.log("\nGame Over! Your health reached 0.");
        gameRunning = false;
    }
}

console.log("\nThanks for playing!");