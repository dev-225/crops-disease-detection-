"""Disease lookup data and simple CLI helper.

This module provides a DISEASE_INFO dictionary and a small helper to
retrieve disease entries. It fixes the malformed content the file
previously contained and makes the module executable for quick checks.
"""

DISEASE_INFO = {
    "disease1": {
        "crop": "Wheat",
        "disease_name": "Stripe Rust",
        "severity": "Very High",
        "symptoms": ["yellow stripes on leaves", "pustules rupture"],
        "treatment": ["systemic fungicide (Propiconazole)", "early detection and spray"],
    },
    "disease2": {
        "crop": "Maize",
        "disease_name": "Fall Armyworm",
        "severity": "Very High",
        "symptoms": ["large holes in leaves", "chewed whorls", "presence of larva and frass"],
        "treatment": ["Bt insecticide", "granular insecticide in whorl"],
    },
    "disease3": {
        "crop": "Potato",
        "disease_name": "Late Blight",
        "severity": "Very High",
        "symptoms": ["rapidly expanding dark lesions", "white fungal growth on leaf edges"],
        "treatment": ["Mancozeb fungicide", "systemic fungicides"],
    },
    "disease4": {
        "crop": "Tomato",
        "disease_name": "Leaf Curl Virus",
        "severity": "High",
        "symptoms": ["upward curling of leaves", "stunted growth", "vein thickening"],
        "treatment": ["remove infected plants", "insecticide for whitefly control"],
    },
    "disease6": {
        "crop": "Sugarcane",
        "disease_name": "Red Rot",
        "severity": "High",
        "symptoms": ["canes split open to show red interior with white patches", "sour smell"],
        "treatment": ["no chemical cure", "uproot and destroy infected clumps"],
    },
    "disease6": {
        "crop": "Cotton",
        "disease_name": "Bacterial Blight",
        "severity": "Medium",
        "symptoms": ["angular leaf spots", "black lesions on stem (black arm)"],
        "treatment": ["copper spray", "antibiotics (Streptocycline)"],
    },
    "disease7": {
        "crop": "Cashew",
        "disease_name": "Anthracnose",
        "severity": "High",
        "symptoms": ["dark brown spots on shoots and fruits", "blossom blight"],
        "treatment": ["copper-based fungicide", "prune infected parts"],
    },
    "disease8": {
        "crop": "Banana",
        "disease_name": "Panama Disease (Wilt)",
        "severity": "Very High",
        "symptoms": ["yellowing of older leaves and wilting", "reddish-brown discoloration inside corm"],
        "treatment": ["no chemical cure", "use disease-free tissue culture plants"],
    },
    "disease9": {
        "crop": "Soybean",
        "disease_name": "Rust",
        "severity": "High",
        "symptoms": ["small, reddish-brown pustules on underside of leaves", "premature leaf drop"],
        "treatment": ["Azoxystrobin fungicide", "early preventative spray"],
    },
    "disease10": {
        "crop": "Groundnut",
        "disease_name": "Tikka Disease (Leaf Spot)",
        "severity": "Medium",
        "symptoms": ["circular brown spots with yellow halo on leaves", "severe defoliation"],
        "treatment": ["Chlorothalonil fungicide", "Mancozeb spray"],
    },
    "disease11": {
        "crop": "Chickpea",
        "disease_name": "Fusarium Wilt",
        "severity": "High",
        "symptoms": ["sudden wilting and drying of plant", "vascular discoloration in stem"],
        "treatment": ["no chemical cure", "seed treatment with biological agents"],
    },
    "disease12": {
        "crop": "Citrus",
        "disease_name": "Citrus Canker",
        "severity": "Medium",
        "symptoms": ["raised, corky lesions on leaves, stems, and fruit", "yellow halo around spots"],
        "treatment": ["copper spray", "pruning infected branches"],
    },
    "disease13": {
        "crop": "Grape",
        "disease_name": "Downy Mildew",
        "severity": "High",
        "symptoms": ["pale yellow lesions on upper leaf surface", "white fungal growth on underside of leaves"],
        "treatment": ["Mancozeb or Copper oxychloride spray", "good air circulation"],
    },
    "disease14": {
        "crop": "Coffee",
        "disease_name": "Coffee Leaf Rust",
        "severity": "High",
        "symptoms": ["small yellow-orange powdery spots on the underside of leaves", "defoliation"],
        "treatment": ["systemic fungicides (e.g., Triadimefon)", "shade management"],
    },
    "disease15": {
        "crop": "Cotton",
        "disease_name": "Leaf Roll Virus (CLRV)",
        "severity": "Medium",
        "symptoms": ["rolling of top leaves", "reddening of older leaves"],
        "treatment": ["vector control (aphids)", "use certified virus-free seed"],
    },
}


def get_disease_info(key: str):
    """Return disease info dict for a given key or None if not found."""
    return DISEASE_INFO.get(key)


if __name__ == "__main__":
    
    import json
    import sys

    if len(sys.argv) > 1:
        key = sys.argv[1]
        info = get_disease_info(key)
        if info is None:
            print(f"No entry found for '{key}'")
        else:
            print(json.dumps(info, indent=2))
    else:
        print(f"Loaded {len(DISEASE_INFO)} disease entries")
        print("Available keys:", ", ".join(sorted(DISEASE_INFO.keys())))