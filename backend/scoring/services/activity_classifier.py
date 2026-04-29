import re
from typing import Optional, Tuple


ACTIVITY_SCORES = {
    "INDUSTRIE_PRODUCTION": 1.00,
    "GRAND_COMPTE": 0.95,
    "CHANTIER_BTP": 0.90,
    "COMMERCE_SERVICE": 0.85,
    "SANTE": 0.85,
    "HOTEL_AUBERGE": 0.80,
    "AGRICOLE": 0.75,
    "PUBLIC_ADMIN": 0.60,
    "SNDE_INTERNE": 0.50,
    "DOMESTIQUE": 0.40,
    "SOCIAL": 0.25,
    "INCONNU": 0.50,
    "AUTRE": 0.50,
}

ACTIVITY_RULES = [
    (
        "INDUSTRIE_PRODUCTION",
        [
            "USINE",
            "INDUSTRIE",
            "PRODUCTION",
            "SIDERURGIE",
            "CIMENT",
            "ELECTRICITE",
            "CAOUTCHOUC",
            "PLASTIQUES",
            "PEINTURE",
            "EAU",
            "MECANIQUE",
            "METAUX",
            "FABRIQUE GLACE",
            "FRIGO",
        ],
    ),
    (
        "GRAND_COMPTE",
        [
            "SUPER-MARCHE",
            "HYPER",
            "GRANDS MAGASINS",
            "ENTREPOTS",
            "BANQ",
            "ASSURANCE",
            "AMBASSADE",
            "MINISTERES",
            "COMMUNES",
            "SIEGE",
            "ORGANISM",
            "FINANC",
            "HUMANITAIRES",
        ],
    ),
    (
        "CHANTIER_BTP",
        [
            "CHANTIER",
            "BATIMENT",
            "TRAVAUX PUBLICS",
            "BRIQUETER",
            "BRIQUETERIE",
            "FABRIQUE BETON",
        ],
    ),
    (
        "COMMERCE_SERVICE",
        [
            "RESTAURANT",
            "BOULANGERIE",
            "PATISSERIE",
            "COIFFEUR",
            "BEAUTE",
            "HAMAM",
            "LAVERIE",
            "PRESSING",
            "BOUCHERIE",
            "VENDEUR",
            "MAGASINS",
            "GARAGE",
            "STATIONS SERVICES",
            "LAVAGE",
            "ABATOIR",
            "ARTISANAT",
            "COMMERCE",
            "DOUCHE",
            "BAIN",
        ],
    ),
    ("SANTE", ["SANTE", "PHARMACIE", "MEDECIN", "DENTISTE"]),
    ("HOTEL_AUBERGE", ["HOTEL", "AUBERGE", "APPARTEMENTS ET AUBERGES"]),
    ("AGRICOLE", ["AGRICOLES", "PECHE", "MARAICH", "FERME", "CONCESSION RURALE"]),
    (
        "PUBLIC_ADMIN",
        [
            "PRISON",
            "CULTE",
            "MOSQUEE",
            "EGLISE",
            "MILITAIRES",
            "POLICE",
            "CASERNE",
            "COMMISSAR",
            "PUBLIC",
            "ENSEIGNEMENT",
            "STADE",
            "MUSEE",
            "BIBLIOTH",
            "EDIFICES PUBLICS",
            "AEROPORT",
            "PORT",
            "O. P. T.",
        ],
    ),
    ("SNDE_INTERNE", ["SNDE", "AGENT SNDE", "BUREAUX SNDE"]),
    ("DOMESTIQUE", ["DOMESTIQUES", "MAISON", "APPARTEMENT", "VILLA", "IMMEUBLE COMMUNAUTAIRE"]),
    ("SOCIAL", ["BRANCHEMENTS SOCIAUX", "BORNES FONTAINES", "POTENCE"]),
]


def _normalize_activity(value: Optional[object]) -> Optional[str]:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return None

    text = str(value).strip().upper()
    if text in {"", "ND", "NONE", "NULL", "NAN"}:
        return None
    if re.fullmatch(r"\d+(\.\d+)?", text):
        return None
    return text


def classer_activite(activite: Optional[object]) -> Tuple[str, float]:
    normalized = _normalize_activity(activite)
    if not normalized:
        return "INCONNU", ACTIVITY_SCORES["INCONNU"]

    for family, keywords in ACTIVITY_RULES:
        if any(keyword in normalized for keyword in keywords):
            return family, ACTIVITY_SCORES[family]

    return "AUTRE", ACTIVITY_SCORES["AUTRE"]
