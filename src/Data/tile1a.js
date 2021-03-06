export const tile1a = {
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
        "isOccupied": false,
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
        "hasEscalator": true
      }
    },
    {
      "type": "barrier"
    }]
  }
}