export const allTiles = [
  {
    "id": "1a",
    "spaces": {
      0: [{
        "type": "timer",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down",
            "left",
          ],
          "isDisabled": false
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up"
          ]
        }
      },
      {
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "color": "orange",
          "exploreDirection": "up"
        }
      },
      {
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down",
            "right"
          ],
          "color": "purple"
        }
      }],
      1: [{
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down"
          ],
          "color": "purple",
          "exploreDirection": "left"
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false
        }
      },
      {
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down",
            "right"
          ],
          "color": "yellow"
        }
      }],
      2: [{
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down",
            "left"
          ],
          "color": "orange"
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right"
          ]
        }
      },
      {
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down",
            "left"
          ],
          "hasEscalator": true,
          "escalatorName": "a",
          "color": "green",
          "exploreDirection": "right",
          "specialAbility": "weCanTalkAgain",
          "hasLoudspeaker": true
        }
      }],
      3: [{
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down",
            "left"
          ],
          "color": "green"
        }
      },
      {
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "color": "yellow",
          "exploreDirection": "down"
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "down",
            "right"
          ],
          "hasEscalator": true,
          "escalatorName": "a"
        }
      },
      {
        "type": "barrier"
      }]
    }
  },
  {
    "id": "2",
    "entrySide": "right",
    "entryDirection": "left",
    "spaces": {
      0: [{
        "type": "exit",
        "details": {
          "sideWalls": [
            "up",
            "right",
            "left"
          ],
          "color": "purple"
        }
      },
      {
        "type": "barrier",
      },
      {
        "type": "barrier"
      },
      {
        "type": "barrier"
      }],
      1: [{
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down",
            "left"
          ],
          "hasEscalator": true,
          "escalatorName": "a"
        }
      },
      {
        "type": "barrier",
      },
      {
        "type": "barrier",
      },
      {
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right",
            "left"
          ],
          "color": "purple"
        }
      }],
      2: [{
        "type": "barrier"
      },
      {
        "type": "barrier",
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "left"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "down"
          ],
          "isEntry": true
        }
      }],
      3: [{
        "type": "barrier"
      },
      {
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "left"
          ],
          "exploreDirection": "down",
          "color": "orange",
          "hasEscalator": true,
          "escalatorName": "a"
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "down"
          ]
        }
      },
      {
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right",
            "down"
          ],
          "color": "green"
        }
      }]
    }
  },
  {
    "id": "3",
    "entrySide": "up",
    "entryDirection": "down",
    "spaces": {
      0: [{
        "type": "barrier",
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "left"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down"
          ],
          "isEntry": true
        }
      },
      {
        "type": "barrier"
      }],
      1: [{
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down"
          ],
          "isEntry": true,
          "exploreDirection": "left",
          "color": "yellow",
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "down"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up"
          ]
        }
      },
      {
        "type": "timer",
        "details": {
          "isOccupied": false,
          "isDisabled": false,
          "sideWalls": [
            "up",
            "right",
            "down"
          ]
        }
      }],
      2: [{
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down",
            "left"
          ],
          "color": "green"
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
          ]
        }
      },
      {
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "left"
          ],
          "exploreDirection": "right",
          "color": "purple"
        }
      }],
      3: [{
        "type": "barrier"
      },
      {
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down",
            "left"
          ],
          "color": "orange",
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "down",
            "left"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down"
          ]
        }
      }]
    }
  },
  {
    "id": "4",
    "entrySide": "left",
    "entryDirection": "right",
    "spaces": {
      0: [{
        "type": "barrier",
      },
      {
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right",
            "left"
          ],
          "color": "orange"
        }
      },
      {
        "type": "barrier"
      },
      {
        "type": "barrier"
      }],
      1: [{
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down"
          ],
          "isEntry": true
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false
        }
      },
      {
        "type": "timer",
        "details": {
          "isOccupied": false,
          "isDisabled": false,
          "sideWalls": [
            "up",
            "right",
            "down"
          ]
        }
      },
      {
        "type": "barrier"
      }],
      2:[{
        "type": "barrier"
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "left"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down"
          ]
        }
      },
      {
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up"
          ],
          "exploreDirection": "right",
          "color": "purple"
        }
      }],
      3: [{
        "type": "barrier"
      },
      {
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "left"
          ],
          "exploreDirection": "down",
          "color": "green",
          "hasLoudspeaker": true,
          "specialAbility": "weCanTalkAgain"
        }
      },
      {
        "type": "barrier"
      },
      {
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down",
            "left"
          ],
          "color": "yellow"
        }
      }]
    }
  },
  {
    "id": "5",
    "entrySide": "left",
    "entryDirection": "right",
    "spaces": {
      0: [{
        "type": "barrier",
      },
      {
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right",
            "left"
          ],
          "color": "purple"
        }
      },
      {
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "down",
            "left"
          ],
          "exploreDirection": "up",
          "color": "yellow"
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right"
          ]
        }
      }],
      1: [{
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right"
          ],
          "isEntry": true
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "left"
          ],
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down"
          ]
        }
      }],
      2: [{
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "down",
            "left"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false
        }
      },
      {
        "type": "timer",
        "details": {
          "isOccupied": false,
          "isDisabled": false,
          "sideWalls": [
            "up",
            "right",
            "down"
          ]
        }
      },
      {
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "left"
          ],
          "exploreDirection": "right",
          "color": "orange"
        }
      }],
      3: [{
        "type": "barrier"
      },
      {
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "left"
          ],
          "exploreDirection": "down",
          "color": "green",
          "hasLoudspeaker": true,
          "specialAbility": "weCanTalkAgain"
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down"
          ]
        }
      }]
    }
  },
  {
    "id": "6",
    "entrySide": "right",
    "entryDirection": "left",
    "spaces": {
      0: [{
        "type": "barrier",
      },
      {
        "type": "barrier",
      },
      {
        "type": "weapon",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right",
            "left"
          ],
          "color": "yellow",
          "weaponStolen": false
        }
      },
      {
        "type": "barrier"
      }],
      1: [{
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down"
          ],
          "exploreDirection": "left",
          "color": "green",
          "hasLoudspeaker": true,
          "ability": "weCanTalkAgain"
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up"
          ],
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right"
          ]
        }
      },
      {
        "type": "barrier"
      }],
      2: [{
        "type": "barrier"
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "left"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "down",
            "left"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up"
          ],
          "isEntry": true
        }
      }],
      3: [{
        "type": "barrier"
      },
      {
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "left",
            "right"
          ],
          "exploreDirection": "down",
          "color": "orange"
        }
      },
      {
        "type": "barrier"
      },
      {
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down",
            "left"
          ],
          "color": "purple"
        }
      }]
    }
  },
  {
    "id": "7",
    "entrySide": "down",
    "entryDirection": "up",
    "spaces": {
      0: [{
        "type": "barrier",
      },
      {
        "type": "barrier",
      },
      {
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right",
            "left"
          ],
          "color": "green"
        }
      },
      {
        "type": "barrier"
      }],
      1: [{
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "left"
          ],
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down"
          ],
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "down"
          ],
          "hasEscalator": true,
          "escalatorName": "a"
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right"
          ]
        }
      }],
      2: [{
        "type": "weapon",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down",
            "left"
          ],
          "color": "orange",
          "weaponStolen": false
        }
      },
      {
        "type": "barrier"
      },
      {
        "type": "barrier"
      },
      {
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "left"
          ],
          "exploreDirection": "right",
          "color": "purple"
        }
      }],
      3: [{
        "type": "barrier"
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right",
            "left"
          ],
          "isEntry": true,
          "hasEscalator": true,
          "escalatorName": "a"
        }
      },
      {
        "type": "barrier"
      },
      {
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down",
            "left"
          ],
          "color": "yellow"
        }
      }]
    }
  },
  {
    "id": "8",
    "entrySide": "down",
    "entryDirection": "up",
    "spaces": {
      0: [{
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "left"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right"
          ]
        }
      }],
      1: [{
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down"
          ],
          "exploreDirection": "left",
          "color": "orange"
        }
      },
      {
        "type": "barrier",
      },
      {
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down",
            "left"
          ],
          "color": "yellow"
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "left"
          ],
        }
      }],
      2: [{
          "type": "barrier"
        },
        {
          "type": "barrier"
        },
        {
          "type": "barrier"
        },
        {
          "type": "exploration",
          "details": {
            "isOccupied": false,
            "sideWalls": [
              "left"
            ],
            "exploreDirection": "right",
            "color": "purple"
          }
      }],
      3: [{
          "type": "weapon",
          "details": {
            "isOccupied": false,
            "sideWalls": [
              "up",
              "down",
              "left"
            ],
            "color": "green",
            "weaponStolen": false
          }
        },
        {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up"
          ],
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down"
          ],
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down"
          ],
          "isEntry": true
        }
      }]
    }
  },
  {
    "id": "9",
    "entrySide": "left",
    "entryDirection": "right",
    "spaces": {
      0: [{
        "type": "barrier"
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "left"
          ],
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down"
          ],
          "isEntry": true
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right"
          ]
        }
      }],
      1: [{
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down"
          ],
          "isEntry": true
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down"
          ]
        }
      },
      {
        "type": "barrier"
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "left"
          ]
        }
      }],
      2: [{
        "type": "barrier"
      },
      {
        "type": "barrier"
      },
      {
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right",
            "left"
          ],
          "color": "orange"
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "left"
          ]
        }
      }],
      3: [{
        "type": "weapon",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down",
            "left"
          ],
          "color": "purple",
          "weaponStolen": false
        }
      },
      {
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up"
          ],
          "exploreDirection": "down",
          "color": "yellow"
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "down"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down"
          ]
        }
      }]
    }
  },
  {
    "id": "10",
    "entrySide": "right",
    "entryDirection": "left",
    "spaces": {
      0: [{
        "type": "barrier"
      },
      {
        "type": "barrier",
      },
      {
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "left"
          ],
          "exploreDirection": "up",
          "color": "yellow",
        }
      },
      {
        "type": "barrier"
      }],
      1: [{
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right",
            "left"
          ],
          "color": "orange"
        }
      },
      {
        "type": "barrier",
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "down",
            "left"
          ],
          "hasEscalator": true,
          "escalatorName": "a"
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right"
          ]
        }
      }],
      2: [{
        "type": "blank",
        "details": {
          "isOccupied": false
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right"
          ],
          "hasEscalator": true,
          "escalatorName": "a"
        }
      },
      {
        "type": "barrier"
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "left"
          ],
          "isEntry": true
        }
      }],
      3: [{
        "type": "exit",
        "details": {
          "sideWalls": [
            "right",
            "down"
          ],
          "color": "green"
        }
      },
      {
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "left"
          ],
          "exploreDirection": "down",
          "color": "purple",
        }
      },
      {
        "type": "barrier"
      },
      {
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down",
            "left"
          ],
          "color": "green"
        }
      }]
    }
  },
  {
    "id": "11",
    "entrySide": "right",
    "entryDirection": "left",
    "spaces": {
      0: [{
        "type": "exit",
        "details": {
          "sideWalls": [
            "right",
            "left"
          ],
          "color": "yellow"
        }
      },
      {
        "type": "barrier",
      },
      {
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "left"
          ],
          "exploreDirection": "up",
          "color": "orange",
        }
      },
      {
        "type": "barrier"
      }],
      1: [{
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "left"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down"
          ]
        }
      },
      {
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right",
            "left"
          ],
          "color": "yellow"
        }
      }],
      2: [{
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "left"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "left"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "left"
          ],
          "isEntry": true
        }
      }],
      3: [{
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "down",
            "left"
          ]
        }
      },
      {
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right"
          ],
          "exploreDirection": "down",
          "color": "green",
          "hasLoudspeaker": true,
          "ability": "weCanTalkAgain"
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "down",
            "left"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down"
          ]
        }
      }]
    }
  },
  {
    "id": "12",
    "entrySide": "right",
    "entryDirection": "left",
    "spaces": {
      0: [{
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "left"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right",
            "down"
          ],
          "hasEscalator": true,
          "escalatorName": "b"
        }
      },
      {
        "type": "barrier",
      },
      {
        "type": "barrier"
      }],
      1: [{
        "type": "exploration",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right"
          ],
          "exploreDirection": "left",
          "color": "yellow"
        }
      },
      {
        "type": "barrier"
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right",
            "left"
          ],
          "hasEscalator": true,
          "escalatorName": "b"
        }
      },
      {
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "right",
            "left"
          ],
          "color": "orange"
        }
      }],
      2: [{
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "left"
          ],
          "hasEscalator": true,
          "escalatorName": "a"
        }
      },
      {
        "type": "barrier"
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "left"
          ]
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "isEntry": true
        }
      }],
      3: [{
        "type": "exit",
        "details": {
          "sideWalls": [
            "right",
            "down"
          ],
          "color": "orange"
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down",
            "left"
          ],
          "hasEscalator": true,
          "escalatorName": "a"
        }
      },
      {
        "type": "blank",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down"
          ]
        }
      },
      {
        "type": "teleporter",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "right",
            "down",
            "left"
          ],
          "color": "purple"
        }
      }]
    }
  }
]