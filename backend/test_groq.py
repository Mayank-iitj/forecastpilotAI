import sys
import os
sys.path.append(os.path.dirname(__file__))

from app.ml.llm_service import parse_what_if_scenario, generate_forecast_explanation

print("Testing parse_what_if_scenario...")
adj = parse_what_if_scenario("What if I double my google ads spend?")
print("Adjustments:", adj)

print("\nTesting generate_forecast_explanation...")
explanation = generate_forecast_explanation("What if I double my google ads spend?", 150000, 185000)
print("Explanation:", explanation)
