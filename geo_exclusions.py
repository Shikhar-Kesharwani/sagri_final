"""
Geographic and agronomic exclusions for crop recommendation.
Based on:
  - ICAR Crop Zoning Guidelines
  - Botanical/climatic requirements (chill hours, coastal tropics, etc.)
  - Season constraints per crop
  - Soil texture compatibility

Rules:
  HARD_EXCLUSIONS     : crops that CANNOT grow in these states (climate impossibility)
  SEASON_CROPS        : which season each crop belongs to
  SOIL_COMPATIBILITY  : which soil textures are compatible with each crop
  IRRIGATION_REQUIRED : crops that MUST have irrigation to be viable
"""

# Crops that are climatically impossible in listed states
HARD_EXCLUSIONS = {
    "coconut":     ["Punjab", "Haryana", "Himachal Pradesh", "Uttarakhand",
                    "Rajasthan", "Uttar Pradesh", "Bihar"],
    "coffee":      ["Punjab", "Haryana", "Rajasthan", "Uttar Pradesh", "Bihar",
                    "West Bengal", "Madhya Pradesh", "Gujarat"],
    "apple":       ["Kerala", "Tamil Nadu", "Andhra Pradesh", "Telangana",
                    "Karnataka", "West Bengal", "Odisha", "Assam"],
    "jute":        ["Rajasthan", "Punjab", "Himachal Pradesh", "Gujarat",
                    "Madhya Pradesh"],
    "tea":         ["Rajasthan", "Punjab", "Haryana", "Gujarat",
                    "Uttar Pradesh", "Madhya Pradesh"],
    "grapes":      ["Assam", "West Bengal", "Bihar", "Jharkhand",
                    "Odisha", "Chhattisgarh"],
    "rice":        ["Rajasthan", "Himachal Pradesh"],
    "sugarcane":   ["Himachal Pradesh", "Uttarakhand", "Rajasthan"],
    "cardamom":    ["Rajasthan", "Punjab", "Haryana", "Gujarat",
                    "Uttar Pradesh", "Madhya Pradesh", "Bihar"],
    "rubber":      ["Rajasthan", "Punjab", "Haryana", "Gujarat",
                    "Uttar Pradesh", "Madhya Pradesh", "Bihar",
                    "Himachal Pradesh", "Uttarakhand"],
}

# Season each crop belongs to (for temporal filtering)
SEASON_CROPS = {
    "Kharif": [
        "rice", "maize", "jute", "cotton", "soybean", "groundnut",
        "pigeonpeas", "mungbean", "blackgram", "mothbeans",
        "kidneybeans", "banana", "coconut", "papaya", "sugarcane",
    ],
    "Rabi": [
        "wheat", "chickpea", "lentil", "mustard", "barley",
        "orange", "apple", "potato",
    ],
    "Zaid": [
        "watermelon", "muskmelon", "cucumber", "mango",
        "grapes", "pomegranate",
    ],
    "Perennial": [
        "coffee", "tea", "rubber", "cardamom",
    ],
}

# Reverse lookup: crop -> season
CROP_SEASON = {}
for season, crops in SEASON_CROPS.items():
    for crop in crops:
        CROP_SEASON[crop] = season

# Soil texture compatibility: crop -> list of compatible textures
# "Any" means compatible with all textures
SOIL_COMPATIBILITY = {
    "rice":        ["Clay"],
    "maize":       ["Loamy", "Clay"],
    "wheat":       ["Loamy", "Clay"],
    "jute":        ["Loamy", "Clay"],
    "cotton":      ["Loamy", "Clay"],
    "sugarcane":   ["Loamy", "Clay"],
    "coconut":     ["Sandy", "Loamy", "Laterite"],
    "banana":      ["Loamy", "Clay"],
    "mango":       ["Loamy", "Sandy"],
    "papaya":      ["Loamy"],
    "apple":       ["Loamy"],
    "orange":      ["Loamy"],
    "grapes":      ["Loamy", "Sandy"],
    "pomegranate": ["Loamy", "Sandy"],
    "coffee":      ["Laterite", "Loamy"],
    "watermelon":  ["Sandy", "Loamy"],
    "muskmelon":   ["Sandy", "Loamy"],
    "chickpea":    ["Loamy", "Clay"],
    "lentil":      ["Loamy", "Clay"],
    "pigeonpeas":  ["Loamy", "Sandy"],
    "mungbean":    ["Loamy", "Sandy"],
    "blackgram":   ["Loamy", "Clay"],
    "mothbeans":   ["Sandy"],
    "kidneybeans": ["Loamy"],
}

# Crops that require irrigation — rainfed cultivation is not viable
IRRIGATION_REQUIRED = {
    "rice", "banana", "sugarcane", "papaya", "cotton",
    "orange", "grapes", "pomegranate", "watermelon", "muskmelon",
}

def is_soil_compatible(crop: str, soil_texture: str) -> bool:
    """Returns True if crop is compatible with the given soil texture."""
    compatible = SOIL_COMPATIBILITY.get(crop, None)
    if compatible is None:
        return True  # unknown crop — do not exclude
    return soil_texture in compatible

def get_crop_season(crop: str) -> str:
    """Returns the growing season for a crop."""
    return CROP_SEASON.get(crop, "Kharif")  # default to Kharif if unknown
