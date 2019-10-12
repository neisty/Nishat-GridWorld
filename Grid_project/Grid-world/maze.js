//<![CDATA[

  
goog.provide('Maze');

goog.require('Blockly.FieldDropdown');
goog.require('Blockly.utils.math');
goog.require('BlocklyGames');
goog.require('BlocklyInterface');
goog.require('Maze.Blocks');

/* Grid Construction and play


*/

function Position(x, y) {
  this.x = x;
  this.y = y;
  
}

Position.prototype.toString = function() {
  return this.x + ":" + this.y;
};



function Maze() {
  // bind to HTML elements
  this.mazeContainer = document.getElementById("maze");
  this.mazeOutputDiv = document.getElementById("maze_output");
  this.mazeMessage   = document.getElementById("maze_message");
  this.mazeScore     = document.getElementById("maze_score");
  this.heroScore     = this.mazeContainer.getAttribute("data-steps") - 2;

  this.maze = [];
  this.heroPos = {};
  this.heroHasKey = false;
  this.childMode = false;

  for(var i=0; i < this.mazeContainer.children.length; i++) {
    for(var j=0; j < this.mazeContainer.children[i].children.length; j++) {
      var el =  this.mazeContainer.children[i].children[j];
      this.maze[new Position(i, j)] = el;
      if(el.classList.contains("entrance")) {
        // place hero at entrance
        this.heroPos = new Position(i, j);
        this.maze[this.heroPos].classList.add("hero");
      }
    }
  }

  this.mazeOutputDiv.style.width = this.mazeContainer.scrollWidth + "px";
  this.setMessage("Please help me to find the castle");

  // activate control keys
  this.keyPressHandler = this.mazeKeyPressHandler.bind(this);
 document.addEventListener("keydown", this.keyPressHandler, false);
 this.codeHandler = this.mazeCodeHandler.bind(this);
 document.addEventListener("mousedown", this.codeHandler, false);
}



Maze.prototype.setMessage = function(text) {
  this.mazeMessage.innerHTML = text;
  this.mazeScore.innerHTML = this.heroScore;
};

Maze.prototype.heroTakeTreasure = function() {
  this.maze[this.heroPos].classList.remove("apple");
  this.heroScore += 10;
  this.setMessage("yay, treasure!");
};


Maze.prototype.gameOver = function(text) {
  // de-activate control keys
  document.removeEventListener("keydown", this.keyPressHandler, false);
  this.setMessage(text);
  this.mazeContainer.classList.add("finished");
};

Maze.prototype.heroWins = function() {
  
  this.heroScore += 50;
  this.gameOver("you finished !!!");
};

Maze.prototype.tryMoveHero = function(pos) {
  
  var nextStep = this.maze[pos].className;

  // before moving
  if(nextStep.match(/fire/)) {
    this.heroScore = Math.max(this.heroScore - 5, 0);
    if(!this.childMode && this.heroScore <= 0) {
      this.gameOver("sorry, you didn't make it");
    } else {
      this.setMessage("ow, that burns!");
    }
    return;
  }
  if(nextStep.match(/water/)) {
    this.heroScore = Math.max(this.heroScore - 5, 0);
    if(!this.childMode && this.heroScore <= 0) {
      this.gameOver("sorry, you didn't make it");
    } else {
      this.setMessage("oh no! I'm wet!");
    }
    return;
  }
  if(nextStep.match(/monster/)) {
    this.gameOver("sorry, you didn't make it");
  }
  if(nextStep.match(/castle/)) {
     
      this.heroWins();
      return;
    
  }

  // move hero one step
  this.maze[this.heroPos].classList.remove("hero");
  this.maze[pos].classList.add("hero");
  this.heroPos = pos;

  // after moving
  if(nextStep.match(/apple/)) {
    this.heroTakeTreasure();
    return;
  }
  
  if(nextStep.match(/exit/)) {
    return;
  }
  if(this.heroScore >= 1) {
    if(!this.childMode) {
      this.heroScore--;
    }
    if(!this.childMode && this.heroScore <= 0) {
      this.gameOver("sorry, you didn't make it");
    } else {
      this.setMessage("...");
    }
  }
};

Maze.prototype.mazeKeyPressHandler = function(e) {
  
  var tryPos = new Position(this.heroPos.x, this.heroPos.y);
  switch(e.keyCode)
  {
    case 37: // left
      this.mazeContainer.classList.add("face-left");
      tryPos.y--;
      break;

    case 38: // up
      tryPos.x--;
      break;

    case 39: // right
      this.mazeContainer.classList.remove("face-left");
      tryPos.y++;
      break;

    case 40: // down
      tryPos.x++;
      break;

    default:
      return;

  }
  this.tryMoveHero(tryPos);
  e.preventDefault();
};


var tryPos={};
Maze.prototype.mazeCodeHandler = function(e) {
tryPos = new Position(this.heroPos.x, this.heroPos.y);
return tryPos; 
}

Maze.prototype.mazeHandler = function(e) {
 
  alert("ihell");
  switch(e)
  {
    case 'left': // left
      alert("left");
      //this.mazeContainer.classList.add("face-left");
      tryPos.y--;
     
      break;

    case 'up': // up
      tryPos.x--;
      break;

    case 'right': // right
      alert("right");
      //this.mazeContainer.classList.remove("face-left");
      tryPos.y++;
      alert(tryPos);
      break;

    case 'down': // down
      tryPos.x++;
      break;

    default:
      return;

  }
  this.tryMoveHero(tryPos);
  //e.preventDefault();
};

Maze.prototype.setChildMode = function() {
  this.childMode = true;
  this.heroScore = 0;
  this.setMessage("collect all the treasure");
};

/* End of Grid Construction*/


/**
 * Inject the Maze API into a JavaScript interpreter.
 * @param {!Interpreter} interpreter The JS Interpreter.
 * @param {!Interpreter.Object} scope Global scope.
 */

Maze.initInterpreter = function(interpreter, scope) {
  // API
  var wrapper;
  
  wrapper = function(id) {
    Maze.prototype.mazeHandler('right');
    
  };

  interpreter.setProperty(scope, 'moveForward',
      interpreter.createNativeFunction(wrapper));


  wrapper = function(id) {
    Maze.prototype.mazeHandler('left');
    //Maze.move(2, id);
  };
  interpreter.setProperty(scope, 'moveBackward',
      interpreter.createNativeFunction(wrapper));
  wrapper = function(id) {
    Maze.prototype.mazeHandler('up');
    //Maze.turn(0, id);
  };
  interpreter.setProperty(scope, 'turnLeft',
      interpreter.createNativeFunction(wrapper));
  wrapper = function(id) {
    Maze.prototype.mazeHandler('down');
    //Maze.turn(1, id);
  };
  interpreter.setProperty(scope, 'turnRight',
      interpreter.createNativeFunction(wrapper));
      /*
  wrapper = function(id) {
    return Maze.isPath(0, id);
  };
  interpreter.setProperty(scope, 'isPathForward',
      interpreter.createNativeFunction(wrapper));
  wrapper = function(id) {
    return Maze.isPath(1, id);
  };
  interpreter.setProperty(scope, 'isPathRight',
      interpreter.createNativeFunction(wrapper));
  wrapper = function(id) {
    return Maze.isPath(2, id);
  };
  interpreter.setProperty(scope, 'isPathBackward',
      interpreter.createNativeFunction(wrapper));
  wrapper = function(id) {
    return Maze.isPath(3, id);
  };
  interpreter.setProperty(scope, 'isPathLeft',
      interpreter.createNativeFunction(wrapper));
  wrapper = function() {
    return Maze.notDone();
  };
  interpreter.setProperty(scope, 'notDone',
      interpreter.createNativeFunction(wrapper));
      */
};

/**
 * Execute the user's code.  Heaven help us...
 */
var runner;
function resetInterpreter() {
  
  interpreter = null;
  if (runner) {
    clearTimeout(runner);
    runner = null;
  }
}

function printHelo()
{

var m= execute();
}

function execute() {
  
  if (!('Interpreter' in window)) {
    
    // Interpreter lazy loads and hasn't arrived yet.  Try again later.
    setTimeout(execute(), 250);
    return;
  }

  
 // Blockly.selected && Blockly.selected.unselect();
  var code = Blockly.JavaScript.workspaceToCode(BlocklyGames.workspace);
  alert('Ready to execute the following code\n' +
            '===================================\n' +
            code);
 
  var interpreter = new Interpreter(code, Maze.initInterpreter);
  
  runner = function() { 
        
     
    if (interpreter) {
      var hasMore = interpreter.run();

      if (hasMore) {
        // Execution is currently blocked by some async call.
        // Try again later.
        setTimeout(runner, 10);
      } else {
        // Program is complete.
        //outputArea.value += '\n\n<< Program complete >>';
        
        resetInterpreter();
        //resetStepUi(false);
      }
    } 
  }; 
  runner();

  // Try running the user's code.  There are four possible outcomes:
  // 1. If pegman reaches the finish [SUCCESS], true is thrown.
  // 2. If the program is terminated due to running too long [TIMEOUT],
  //    false is thrown.
  // 3. If another error occurs [ERROR], that error is thrown.
  // 4. If the program ended normally but without solving the maze [FAILURE],
  //    no error or exception is thrown.

  
  try {
    var ticks = 10000;  // 10k ticks runs Pegman for about 8 minutes.
    while (interpreter.step()) {
      if (ticks-- == 0) {
        throw Infinity;
      }
    }
    
  } catch (e) {
    
    }


  }


  


