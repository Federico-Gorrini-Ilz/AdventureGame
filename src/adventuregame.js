// ===========================================
// The Dragon's Quest - Text Adventure Game
// A progression-based learning project
// ===========================================
/*
Adventure Game
This game will be a text-based adventure game where the player will be able
to make choices that affect the outcome of the game.
The player will be able to choose their own path and the story will change
based on their decisions.
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

// Display welcome message and starting stats
console.log("\nStarting Stats:");
console.log("Health: " + health);
console.log("Gold: " + gold);
console.log("Location: " + location);
console.log("Inventory: " + inventory.length + " items");