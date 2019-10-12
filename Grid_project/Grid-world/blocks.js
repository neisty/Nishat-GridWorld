/**
 * Blockly Games: Maze Blocks
 *
 * Copyright 2012 Google Inc.
 * https://github.com/google/blockly-games
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Blocks for Maze game.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Maze.Blocks');
goog.require('Blockly.JavaScript');



// Extensions to Blockly's existing blocks and JavaScript generator.

Blockly.defineBlocksWithJsonArray([
  {
    "type": "maze_moveForward",
    "message0": "move forward",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 105,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "maze_turn",
    "message0": "turn %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIR",
        "options": [
          [
            "left",
            "turnLeft"
          ],
          [
            "right",
            "turnRight"
          ]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 105,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "maze_if",
    "message0": "if path %1 %2 do %3",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIR",
        "options": [
          [
            "ahead",
            "isPathForward"
          ],
          [
            "to the left",
            "isPathLeft"
          ],
          [
            "to the right",
            "isPathRight"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 300,
    "tooltip": "",
    "helpUrl": ""
  },

  {
    "type": "maze_ifElse",
    "message0": "if path %1 %2 do %3 else %4",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIR",
        "options": [
          [
            "ahead",
            "path_ahead"
          ],
          [
            "to the left",
            "path_left"
          ],
          [
            "to the right",
            "path_right"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "DO"
      },
      {
        "type": "input_statement",
        "name": "ELSE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 300,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "maze_forever",
    "message0": "repeat until end %1 do %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180,
    "tooltip": "",
    "helpUrl": ""
  }

    ]);


Blockly.JavaScript['maze_moveForward'] = function(block) {
  // Generate JavaScript for moving forward.
  //return 'moveForward(\'block_id_' + block.id + '\');\n';
  return 'moveForward();\n';
};



Blockly.JavaScript['maze_turn'] = function(block) {
  // Generate JavaScript for turning left or right.
  var dir = block.getFieldValue('DIR');
  //return dir + '(\'block_id_' + block.id + '\');\n';
  return dir +';\n';
};


Blockly.JavaScript['maze_if'] = function(block) {
  // Generate JavaScript for 'if' conditional if there is a path.
  var argument = block.getFieldValue('DIR') +
      '(\'block_id_' + block.id + '\')';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  var code = 'if (' + argument + ') {\n' + branch + '}\n';
  return code;
};



Blockly.JavaScript['maze_ifElse'] = function(block) {
  // Generate JavaScript for 'if/else' conditional if there is a path.
  var argument = block.getFieldValue('DIR') +
      '(\'block_id_' + block.id + '\')';
  var branch0 = Blockly.JavaScript.statementToCode(block, 'DO');
  var branch1 = Blockly.JavaScript.statementToCode(block, 'ELSE');
  var code = 'if (' + argument + ') {\n' + branch0 +
             '} else {\n' + branch1 + '}\n';
  return code;
};


Blockly.JavaScript['maze_forever'] = function(block) {
  // Generate JavaScript for repeat loop.
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'block_id_' + block.id + '\'') + branch;
  }
  return 'while (notDone()) {\n' + branch + '}\n';
};
