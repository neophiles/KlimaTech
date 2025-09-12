import math 

def calculate_heat_index(temp_c, humidity):
    # Convert Celsius to Fahrenheit
    temp_f = temp_c * 9/5 + 32

    # NOAA Heat Index formula
    hi_f = (
        -42.379
        + 2.04901523 * temp_f
        + 10.14333127 * humidity
        - 0.22475541 * temp_f * humidity
        - 0.00683783 * temp_f**2
        - 0.05481717 * humidity**2
        + 0.00122874 * temp_f**2 * humidity
        + 0.00085282 * temp_f * humidity**2
        - 0.00000199 * temp_f**2 * humidity**2
    )

    # Convert back to Celsius
    hi_c = (hi_f - 32) * 5/9

    # Risk categories
    if hi_c < 27:
        risk = "Safe"
    elif 27 <= hi_c < 32:
        risk = "Caution"
    elif 32 <= hi_c < 41:
        risk = "Extreme Caution"
    elif 41 <= hi_c < 54:
        risk = "Danger"
    else:
        risk = "Extreme Danger"

    return round(hi_c, 1), risk
