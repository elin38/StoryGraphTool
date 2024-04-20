class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); 
    }
}

//flags and checks
let unlockedNorthern = false;
let hasQuest = false;

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; //use `key` to get the data object for the current story location
        this.engine.show(locationData.Body);
        if(locationData.Choices) { //check if the location has any Choices
            if(locationData.Clue) {
                let roll = Math.floor(Math.random() * 10);
                if (roll < 3) {
                    this.engine.show("Your vision suddenly blurs and the symbols: \"" + locationData.Clue + "\" suddenly appear in your mind.");
                }
            }
            for(let choice of locationData.Choices) { //loop over the location's Choices 
                if(key == "Accept") { //if player accepted the quest
                    hasQuest = true;
                    this.engine.addChoice(choice.Text, choice); //use the Text of the choice
                }
                else if (key == "Adventurers' Guild") {
                    if(!hasQuest) { //depending on if the player accepted the quest, the receptionist will say different things
                        if (choice.Target != "Receptionist(ongoing quest)") { 
                            this.engine.addChoice(choice.Text, choice);
                        }
                    } else {
                        if (choice.Target != "Receptionist") {
                            this.engine.addChoice(choice.Text, choice); //use the Text of the choice
                        }
                    }
                }
                else if (key == "Gridania Aetheryte Plaza" || key == "The Adders' Nest") {
                    if(!unlockedNorthern) { //checks if player has unlocked the northerngate
                        if (choice.Text != "Northern Gate") {
                            this.engine.addChoice(choice.Text, choice);
                        }
                    } else {
                        this.engine.addChoice(choice.Text, choice);
                    } 
                }
                else if (key == "Carpenters' Guild") {
                    if (!hasQuest) { //check to see if quest is activated
                        if (choice.Text != "Deliver Package") {
                            this.engine.addChoice(choice.Text, choice);
                        }
                    } else {
                        this.engine.addChoice(choice.Text, choice); 
                    }
                }
                else if (key == "Delivered Package") { //once the quest is complete, unlock new area
                    unlockedNorthern = true;
                    this.engine.addChoice(choice.Text, choice);
                }
                else {
                    this.engine.addChoice(choice.Text, choice);
                }
            }
        } else {
            this.engine.addChoice("Touch Stone.")
        }
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(Crystal);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("Congratulations! Thank you for exploring the city of Gridania with me. This of course was based on the MMORPG Final Fantasy XIV.");
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}


class Crystal extends Location {
    create() {
        let pass = prompt("What do the symbols say?");
        console.log(pass);
        if (pass == "XIV" || pass == "X I V") {
            this.engine.gotoScene(End);
        } else {
            this.engine.show("You vision distorts as you suddenly find yourself back in a familar place. Perhaps visiting the guilds again may prove helpful...");
            this.engine.gotoScene(Location, "Stillglade Fane");
        }
    } 
}

Engine.load(Start, 'myStory.json');