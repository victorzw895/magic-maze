export const tile6 = {
  "id": "6",
  "entrySide": "right",
  "spaces": [
    [{
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
    [{
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
    [{
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
    [{
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
  ]
}