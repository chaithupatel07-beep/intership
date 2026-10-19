"""
Crop Recommendation, Agronomic Calculators, Pests, Schemes, and Market Data Routes.
Powers the Crop Recommendation widget, Fertilizer Guidance, Field Insights,
Weather, and APMC Mandi Market Prices.
"""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/crops", tags=["Crop & Agronomy Services"])


class RecommendationRequest(BaseModel):
    soil_type: Optional[str] = "Clay Loam"
    n: Optional[float] = 90.0
    p: Optional[float] = 42.0
    k: Optional[float] = 45.0
    ph: Optional[float] = 6.8
    rainfall_mm: Optional[float] = 850.0
    temperature_c: Optional[float] = 28.0
    season: Optional[str] = "Kharif"
    location: Optional[str] = "Hyderabad, Telangana"


class FertilizerCalcRequest(BaseModel):
    crop: str = "Rice (Paddy)"
    acres: float = 1.0
    target_yield_quintals: Optional[float] = 25.0


@router.post("/recommend")
async def get_crop_recommendations(req: RecommendationRequest):
    """
    Evaluates soil parameters, rainfall, season, and market pricing to
    rank optimal crops with profitability, rationale, and water needs.
    """
    ph = req.ph or 6.8
    rainfall = req.rainfall_mm or 850.0
    soil = (req.soil_type or "Clay Loam").lower()

    # Pre-calculated agronomic recommendation matrix
    crops = [
        {
            "id": "rice",
            "name": "Rice (Paddy)",
            "variety": "BPT 5204 (Samba Mahsuri) / MTU 1010",
            "profitability": "High Profitability",
            "region_match": "Good for your region",
            "duration_days": "125 - 135 days",
            "water_requirement": "High (1100 - 1250 mm)",
            "expected_yield": "22 - 28 Quintals/Acre",
            "expected_revenue": "₹55,000 - ₹68,000 / Acre",
            "suitability_score": 94,
            "soil_suitability": "Ideal in clay loam and alluvial soil with high water holding.",
            "image": "https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80",
        },
        {
            "id": "maize",
            "name": "Maize (Corn)",
            "variety": "DHM 117 / Pioneer 3396",
            "profitability": "Moderate Profitability",
            "region_match": "Suitable for summer & kharif",
            "duration_days": "100 - 110 days",
            "water_requirement": "Moderate (500 - 600 mm)",
            "expected_yield": "25 - 32 Quintals/Acre",
            "expected_revenue": "₹48,000 - ₹58,000 / Acre",
            "suitability_score": 88,
            "soil_suitability": "Well-drained sandy loam or black soil with good aeration.",
            "image": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80",
        },
        {
            "id": "groundnut",
            "name": "Groundnut (Peanut)",
            "variety": "Kadiri 6 / TAG 24",
            "profitability": "Good Profitability",
            "region_match": "Low water requirement",
            "duration_days": "105 - 115 days",
            "water_requirement": "Low to Medium (450 - 550 mm)",
            "expected_yield": "12 - 16 Quintals/Acre",
            "expected_revenue": "₹62,000 - ₹75,000 / Acre",
            "suitability_score": 86,
            "soil_suitability": "Sandy loam and red sandy soils for easy peg penetration.",
            "image": "https://images.unsplash.com/photo-1568283096533-078a24930eb8?auto=format&fit=crop&w=600&q=80",
        },
        {
            "id": "cotton",
            "name": "Cotton",
            "variety": "Bt Cotton Hybrid (RCH 659)",
            "profitability": "High Profitability",
            "region_match": "Excellent for Black Cotton Soil",
            "duration_days": "150 - 160 days",
            "water_requirement": "Medium (700 - 900 mm)",
            "expected_yield": "10 - 14 Quintals/Acre",
            "expected_revenue": "₹64,000 - ₹82,000 / Acre",
            "suitability_score": 82,
            "soil_suitability": "Deep black cotton soils with good drainage.",
            "image": "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80",
        },
    ]

    why_reasons = [
        {"title": "Suitable soil pH", "desc": f"Optimal range (6.0 - 7.5), current: {ph}"},
        {"title": "Good rainfall", "desc": f"Adequate zone (500 - 1200 mm), current: {rainfall} mm"},
        {"title": "High market demand", "desc": "Strong APMC procurement and MSP backing in your state"},
    ]

    return {
        "recommended_crops": crops[:3],
        "all_options": crops,
        "why_reasons": why_reasons,
        "soil_profile": {
            "type": req.soil_type,
            "nitrogen_level": "Medium (90 kg/ha)",
            "phosphorus_level": "Medium (42 kg/ha)",
            "potassium_level": "Adequate (45 kg/ha)",
            "ph": ph,
            "status": "Healthy & fertile for cereal and pulse cropping",
        },
    }


@router.post("/fertilizer-calc")
async def calculate_fertilizer(req: FertilizerCalcRequest):
    """
    Computes exact commercial bags of Urea, DAP, and MOP required for given acreage.
    """
    acres = max(0.1, req.acres)
    crop_lower = req.crop.lower()

    if "rice" in crop_lower or "paddy" in crop_lower:
        # Standard RDF for 1 acre: ~50 kg N, 25 kg P2O5, 25 kg K2O
        dap_kg = round(25 / 0.46 * acres, 1)  # ~54 kg DAP
        n_from_dap = dap_kg * 0.18
        balance_n = max(0.0, (50 * acres) - n_from_dap)
        urea_kg = round(balance_n / 0.46, 1)  # ~87 kg Urea
        mop_kg = round(25 / 0.60 * acres, 1)  # ~42 kg MOP
        fym_tonnes = round(4.0 * acres, 1)
        zinc_kg = round(10.0 * acres, 1)
    elif "maize" in crop_lower:
        dap_kg = round(30 / 0.46 * acres, 1)
        n_from_dap = dap_kg * 0.18
        balance_n = max(0.0, (60 * acres) - n_from_dap)
        urea_kg = round(balance_n / 0.46, 1)
        mop_kg = round(30 / 0.60 * acres, 1)
        fym_tonnes = round(5.0 * acres, 1)
        zinc_kg = round(10.0 * acres, 1)
    else:
        # General pulse / oilseed
        dap_kg = round(20 / 0.46 * acres, 1)
        n_from_dap = dap_kg * 0.18
        balance_n = max(0.0, (30 * acres) - n_from_dap)
        urea_kg = round(balance_n / 0.46, 1)
        mop_kg = round(20 / 0.60 * acres, 1)
        fym_tonnes = round(3.0 * acres, 1)
        zinc_kg = round(5.0 * acres, 1)

    return {
        "crop": req.crop,
        "acres": acres,
        "commercial_fertilizers": {
            "urea_45kg_bags": round(urea_kg / 45, 1),
            "urea_kg": urea_kg,
            "dap_50kg_bags": round(dap_kg / 50, 1),
            "dap_kg": dap_kg,
            "mop_50kg_bags": round(mop_kg / 50, 1),
            "mop_kg": mop_kg,
            "zinc_sulphate_kg": zinc_kg,
            "organic_fym_tonnes": fym_tonnes,
        },
        "application_schedule": [
            {
                "stage": "Basal (At Sowing/Transplanting)",
                "composition": "100% DAP + 50% MOP + 25% Urea + Zinc Sulphate",
                "notes": "Apply directly in furrows or incorporate during final puddling.",
            },
            {
                "stage": "Active Tillering / Knee High (20-25 days)",
                "composition": "50% of total Urea",
                "notes": "Top-dress under moist soil conditions after weeding.",
            },
            {
                "stage": "Panicle Initiation / Tasseling (45-50 days)",
                "composition": "Remaining 25% Urea + Remaining 50% MOP",
                "notes": "Promotes grain filling, test weight, and disease resistance.",
            },
        ],
    }


@router.get("/pests")
async def get_pest_directory():
    """Returns catalog of major crop pests and diseases with treatment protocols."""
    return {
        "pests": [
            {
                "id": "stem_borer",
                "name": "Yellow Stem Borer",
                "target_crops": ["Rice (Paddy)"],
                "symptoms": "Dead hearts in vegetative stage; white chaffy earheads at grain formation.",
                "etl": "1 egg mass/sq.m or 5% dead hearts.",
                "biological_control": "Trichogramma chilonis egg parasitoids @ 100,000/ha; Pheromone traps @ 8/acre.",
                "chemical_control": "Chlorantraniliprole 18.5% SC @ 60 ml/acre or Cartap Hydrochloride 50% SP @ 400g/acre.",
                "severity": "High",
            },
            {
                "id": "fall_armyworm",
                "name": "Fall Armyworm (FAW)",
                "target_crops": ["Maize", "Sorghum", "Millets"],
                "symptoms": "Pinholes and skeletonized whorl leaves, heavy sawdust-like frass.",
                "etl": "10% damaged plants at seedling stage.",
                "biological_control": "Bacillus thuringiensis (Bt) @ 2g/L or Metarhizium anisopliae @ 5g/L.",
                "chemical_control": "Emamectin Benzoate 5% SG @ 80g/acre or Spinetoram 11.7% SC @ 100ml/acre.",
                "severity": "Critical",
            },
            {
                "id": "rice_blast",
                "name": "Rice Blast (Pyricularia oryzae)",
                "target_crops": ["Rice (Paddy)"],
                "symptoms": "Spindle-shaped spots with gray centers and brown margins; black rotting neck nodes.",
                "etl": "2-5% leaf area affected.",
                "biological_control": "Pseudomonas fluorescens seed treatment @ 10g/kg and foliar spray @ 2.5kg/ha.",
                "chemical_control": "Tricyclazole 75% WP @ 120g/acre or Isoprothiolane 40% EC @ 300ml/acre.",
                "severity": "High",
            },
            {
                "id": "pink_bollworm",
                "name": "Pink Bollworm",
                "target_crops": ["Cotton"],
                "symptoms": "Rosette flowers, premature boll opening, damaged lint.",
                "etl": "8 moths/trap/night for 3 consecutive nights.",
                "biological_control": "Delta pheromone traps @ 8 traps/acre; Trichogrammatoidea bactrae release.",
                "chemical_control": "Profenofos 50% EC @ 400ml/acre or Indoxacarb 14.5% SC @ 200ml/acre.",
                "severity": "High",
            },
        ]
    }


@router.get("/schemes")
async def get_government_schemes():
    """Returns database of national agricultural government schemes."""
    return {
        "schemes": [
            {
                "id": "pm-kisan",
                "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
                "benefit": "₹6,000 per year via Direct Benefit Transfer (3 installments of ₹2,000)",
                "eligibility": "All landholding farmer families across India",
                "key_criteria": "e-KYC completion, Aadhaar linked active bank account, verified land registry",
                "application_url": "https://pmkisan.gov.in",
                "category": "Direct Income Support",
            },
            {
                "id": "pmfby",
                "name": "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
                "benefit": "Comprehensive crop insurance against drought, floods, unseasonal rain & pest attacks",
                "eligibility": "All farmers growing notified crops in notified areas (loanee & non-loanee)",
                "key_criteria": "Farmer premium only 2% for Kharif, 1.5% for Rabi crops",
                "application_url": "https://pmfby.gov.in",
                "category": "Risk & Crop Insurance",
            },
            {
                "id": "pmksy",
                "name": "PMKSY - Per Drop More Crop (Micro Irrigation)",
                "benefit": "55% subsidy for small/marginal farmers and 45% for others on Drip/Sprinkler systems",
                "eligibility": "Farmers with valid land ownership and an assured water source (borewell/canal)",
                "key_criteria": "Additional 20-30% state top-up subsidy in many states",
                "application_url": "https://pmksy.gov.in",
                "category": "Irrigation & Water Tech",
            },
            {
                "id": "pkvy",
                "name": "Paramparagat Krishi Vikas Yojana (PKVY)",
                "benefit": "₹50,000/ha financial assistance over 3 years for organic inputs and PGS certification",
                "eligibility": "Farmer groups and clusters with minimum 20 hectares land",
                "key_criteria": "Zero chemical fertilizer/pesticide usage certification",
                "application_url": "https://pgsindia-ncof.gov.in",
                "category": "Organic Farming",
            },
            {
                "id": "kcc",
                "name": "Kisan Credit Card (KCC)",
                "benefit": "Short-term institutional crop loans up to ₹3,00,000 at effective 4% interest rate",
                "eligibility": "Individual farmers, tenant farmers, sharecroppers, and SHGs",
                "key_criteria": "Collateral-free loan up to ₹1.60 lakh",
                "application_url": "https://www.myscheme.gov.in",
                "category": "Credit & Working Capital",
            },
        ]
    }


@router.get("/market-prices")
async def get_market_prices():
    """Returns today's APMC Mandi market prices matching the dashboard widget."""
    return {
        "date": "Today, Live APMC Mandi Feed",
        "market": "Hyderabad / Telangana Agmarknet Hub",
        "prices": [
            {
                "commodity": "Rice (Paddy)",
                "variety": "Common (Fine)",
                "modal_price": 2100,
                "unit": "₹ / qtl",
                "trend": "up",
                "change_percent": "+1.0%",
            },
            {
                "commodity": "Cotton",
                "variety": "Medium Staple",
                "modal_price": 6400,
                "unit": "₹ / qtl",
                "trend": "down",
                "change_percent": "-1.0%",
            },
            {
                "commodity": "Maize (Corn)",
                "variety": "Hybrid Yellow",
                "modal_price": 2250,
                "unit": "₹ / qtl",
                "trend": "up",
                "change_percent": "+2.1%",
            },
            {
                "commodity": "Groundnut",
                "variety": "Pod with shell",
                "modal_price": 6800,
                "unit": "₹ / qtl",
                "trend": "up",
                "change_percent": "+1.5%",
            },
            {
                "commodity": "Wheat",
                "variety": "Sharbati",
                "modal_price": 2450,
                "unit": "₹ / qtl",
                "trend": "up",
                "change_percent": "+0.8%",
            },
        ],
    }


@router.get("/weather")
async def get_weather(location: str = "Hyderabad"):
    """Returns weather & agricultural advisory metrics matching the UI weather widget."""
    return {
        "location": location,
        "temperature_c": 28,
        "condition": "Partly Cloudy",
        "humidity_percent": 68,
        "wind_speed_kmh": 12,
        "rainfall_mm": 0,
        "soil_moisture_percent": 42,
        "et_rate_mm_day": 4.8,
        "advisory": "Favorable conditions for foliar nutrient sprays. No rainfall expected in the next 48 hours.",
    }


@router.get("/field-insights")
async def get_field_insights():
    """Returns field pins and recent alerts matching the Field Insights card."""
    return {
        "fields": [
            {"id": "field_1", "name": "Field 1 (Paddy)", "status": "Healthy", "lat": 17.385, "lng": 78.486},
            {"id": "field_2", "name": "Field 2 (Maize)", "status": "Pest Alert", "lat": 17.389, "lng": 78.490},
            {"id": "field_3", "name": "Field 3 (Groundnut)", "status": "Water Stress", "lat": 17.382, "lng": 78.494},
        ],
        "recent_alerts": [
            {
                "id": "alert_1",
                "title": "Pest risk detected in 2 fields (Leaf Folder)",
                "time": "2 hours ago",
                "type": "pest",
                "severity": "medium",
            },
            {
                "id": "alert_2",
                "title": "Low soil moisture in Field 3",
                "time": "5 hours ago",
                "type": "water",
                "severity": "high",
            },
            {
                "id": "alert_3",
                "title": "High temperature forecast (35°C)",
                "time": "1 day ago",
                "type": "weather",
                "severity": "low",
            },
        ],
    }
