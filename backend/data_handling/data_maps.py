"""
this dictionary maps my database's categories with Plaid's detailed field for transactions
"""
detailed_category_map = {
 'LOAN_PAYMENTS_CAR_PAYMENT': 'car_loans_and_lease',
 'LOAN_PAYMENTS_CREDIT_CARD_PAYMENT': 'credit_card_payments',
 'LOAN_PAYMENTS_PERSONAL_LOAN_PAYMENT': 'other_loans',
 'LOAN_PAYMENTS_MORTGAGE_PAYMENT': 'other_loans',
 'LOAN_PAYMENTS_STUDENT_LOAN_PAYMENT': 'student_loans',
 'LOAN_PAYMENTS_OTHER_PAYMENT': 'other_loans',
 'ENTERTAINMENT_CASINOS_AND_GAMBLING': 'other_entertainment',
 'ENTERTAINMENT_MUSIC_AND_AUDIO': 'streaming_services',
 'ENTERTAINMENT_SPORTING_EVENTS_AMUSEMENT_PARKS_AND_MUSEUMS': 'other_entertainment',
 'ENTERTAINMENT_TV_AND_MOVIES' : 'streaming_services',
 'ENTERTAINMENT_VIDEO_GAMES' : 'other_entertainment',
 'ENTERTAINMENT_OTHER_ENTERTAINMENT' : 'other_entertainment',
 'FOOD_AND_DRINK_BEER_WINE_AND_LIQUOR' : 'groceries',
 'FOOD_AND_DRINK_COFFEE' : 'restaurants',
 'FOOD_AND_DRINK_FAST_FOOD' : 'restaurants',
 'FOOD_AND_DRINK_GROCERIES' : 'groceries',
 'FOOD_AND_DRINK_RESTAURANT' : 'restaurants',
 'FOOD_AND_DRINK_VENDING_MACHINES' : 'groceries',
 'FOOD_AND_DRINK_OTHER_FOOD_AND_DRINK' : 'restaurants',
 'GENERAL_MERCHANDISE_BOOKSTORES_AND_NEWSSTANDS' : 'other_entertainment',
 'GENERAL_MERCHANDISE_CLOTHING_AND_ACCESSORIES' : 'apparel',
 'GENERAL_MERCHANDISE_CONVENIENCE_STORES' : 'other_merchandise',
 'GENERAL_MERCHANDISE_DEPARTMENT_STORES' : 'retail',
 'GENERAL_MERCHANDISE_DISCOUNT_STORES' : 'retail',
 'GENERAL_MERCHANDISE_ELECTRONICS' : 'electronics',
 'GENERAL_MERCHANDISE_GIFTS_AND_NOVELTIES' : 'other_merchandise',
 'GENERAL_MERCHANDISE_OFFICE_SUPPLIES' : 'other_merchandise',
 'GENERAL_MERCHANDISE_ONLINE_MARKETPLACES' : 'e_commerce',
 'GENERAL_MERCHANDISE_PET_SUPPLIES' : 'pet_supplies' , 
 'GENERAL_MERCHANDISE_SPORTING_GOODS' : 'other_merchandise',
 'GENERAL_MERCHANDISE_SUPERSTORES' : 'super_stores',
 'GENERAL_MERCHANDISE_TOBACCO_AND_VAPE' : 'other_merchandise',
 'GENERAL_MERCHANDISE_OTHER_GENERAL_MERCHANDISE' : 'other_merchandise',
 'MEDICAL_DENTAL_CARE' : 'medical_care',
 'MEDICAL_EYE_CARE' : 'medical_care', 
 'MEDICAL_NURSING_CARE' : 'medical_care',
 'MEDICAL_PHARMACIES_AND_SUPPLEMENTS' : 'medical_care',
 'MEDICAL_PRIMARY_CARE' : 'medical_care',
 'MEDICAL_VETERINARY_SERVICES' : 'medical_care',
 'MEDICAL_OTHER_MEDICAL' : 'medical_care',
 'PERSONAL_CARE_GYMS_AND_FITNESS_CENTERS' : 'gym_membership',
 'GENERAL_SERVICES_ACCOUNTING_AND_FINANCIAL_PLANNING' : 'financial_planning',
 'GENERAL_SERVICES_CONSULTING_AND_LEGAL' : 'legal_services',
 'GENERAL_SERVICES_INSURANCE' : 'insurance',
 'GOVERNMENT_AND_NON_PROFIT_TAX_PAYMENT' : 'tax_payments',
 'TRANSPORTATION_BIKES_AND_SCOOTERS' : 'other_transportation',
 'TRANSPORTATION_GAS' : 'gas',
 'TRANSPORTATION_PARKING' : 'parking',
 'TRANSPORTATION_PUBLIC_TRANSIT' : 'public_transit',
 'TRANSPORTATION_TAXIS_AND_RIDE_SHARES' : 'ride_share',
 'TRANSPORTATION_TOLLS' : 'other_transportation', 
 'TRANSPORTATION_OTHER_TRANSPORTATION' : 'other_transportation',
 'TRAVEL_FLIGHTS' : 'travel',
 'TRAVEL_LODGING' : 'travel',
 'TRAVEL_RENTAL_CARS' : 'travel',
 'TRAVEL_OTHER_TRAVEL' : 'travel',
 'RENT_AND_UTILITIES_GAS_AND_ELECTRICITY' : 'utilities', 
 'RENT_AND_UTILITIES_INTERNET_AND_CABLE' : 'utilities',
 'RENT_AND_UTILITIES_RENT' : 'rent',
 'RENT_AND_UTILITIES_SEWAGE_AND_WASTE_MANAGEMENT' : 'utilities', 
 'RENT_AND_UTILITIES_TELEPHONE' : 'utilities',
 'RENT_AND_UTILITIES_WATER' : 'utilities',
 'RENT_AND_UTILITIES_OTHER_UTILITIES' : 'utilities',
 'TRANSFER_OUT_INVESTMENT_AND_RETIREMENT_FUND' : 'investment',
 'TRANSFER_OUT_SAVINGS' : 'savings_account'
}


"""
this dictionary shows the relationship between my database's transaction categories and 
their child categories
"""
sum_category_map  = {
    'rent' :'housing',
    'utilities' : 'housing',
    'student_loans' : 'loans', 
    'car_loans_and_lease' : 'loans', 
    'credit_card_payments' : 'loans',
    'other_loans' : 'loans', 
    'streaming_services' : 'entertainment',
    'other_entertainment' : 'entertainment',
    'restaurants' : 'food', 
    'groceries' : 'food',
    'medical_care' : 'medical_care',
    'gas' : 'transportation',
    'parking' : 'transportation',
    'ride_share' : 'transportation',
    'public_transit' : 'transportation',
    'other_transportation' : 'transportation', 
    'retail' : 'merchandise', 
    'apparel' : 'merchandise',
    'e_commerce' : 'merchandise',
    'electronics' : 'merchandise',
    'pet_supplies' : 'merchandise', 
    'super_stores' : 'merchandise',
    'other_merchandise' : 'merchandise',
    'gym_membership' : 'other_expenses',
    'financial_planning' : 'other_expenses',
    'legal_services' : 'other_expenses', 
    'insurance' : 'other_expenses',
    'tax_payments' : 'other_expenses',
    'travel' : 'travel',
    'investment' : 'investment_and_saving',
    'savings_account' : 'investment_and_saving'
}