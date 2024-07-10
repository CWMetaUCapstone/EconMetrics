import pandas as pd
from data_handling.data_maps import detailed_category_map, sum_category_map
import random


"""
helper function to filter and simplify the JSON returned by the 
[transactions/sync] endpoint into the relevant fields of
amount, date, currency, primary, and detailed categories. 
"""
def clean_transaction_data(transaction_json):
    cleaned_data = []
    # check to ensure each transaction has the expected fields, if not something is wrong with the data and we need to prevent a total crash
    try :
        for transaction in transaction_json['transactions']:
                # filter out transactions where money is deposited to account since we're concerned with expenditures
                if transaction["amount"] > 0 :
                    clean_transaction = {
                        # for the sake of the demo, amount spent on transactions is random to provide differeneces to analyze
                        "amount": round(random.uniform(0.01, 5000), 2),
                        "date": transaction["date"],
                        "currency": transaction["iso_currency_code"],
                        "detailed": transaction["personal_finance_category"]["detailed"],
                        "primary": transaction["personal_finance_category"]["primary"]
                    }
                    cleaned_data.append(clean_transaction)
        return cleaned_data
    except Exception as e:
        raise (f"Error cleaning transaction data: {e}")
         


"""
returns a JSON object representing a user's transactions by category in terms of 
percentage of total expenditure tracked.
precondition: [data] is a dictionary of transactions
"""
def aggregate_user_data(data):
    data_frame = pd.DataFrame(data)
    total_amount = data_frame['amount'].sum()
    # map detailed categories to sum categories
    data_frame['category'] = data_frame['detailed'].map(detailed_category_map)
    # map sum categories to primary categories
    data_frame['category_group'] = data_frame['category'].map(sum_category_map)
    # aggregate data at the detailed  /  category level
    category_grouped = data_frame.groupby('category')['amount'].sum()
    category_percentages = (category_grouped / total_amount * 100).reset_index()
    category_percentages.columns = ['category', 'percent']
    # Aggregate data at the sum /category group level
    group_grouped = data_frame.groupby('category_group')['amount'].sum()
    group_percentages = (group_grouped / total_amount * 100).reset_index()
    group_percentages.columns = ['category_group', 'percent']
    # refactor the data into a dictionary for JSON handling 
    return format_json_output(group_percentages, category_percentages, data_frame)


"""
Helper function to format aggregated transaction data into a structured JSON format.
Parameters:
    group_percentages: A DataFrame containing the percentage 
    of total expenditure for each category group. 
    category_percentages: A DataFrame containing the percentage of total expenditure 
    for each category. 
    data_frame: The original DataFrame used for data aggregation. 
returns a dictionary object representing the structured JSON output. 
"""
def format_json_output(group_percentages, category_percentages, data_frame):
    result = {}
    for _, group_row in group_percentages.iterrows():
        # filter the detailed percentages for the current category group
        sub_categories = category_percentages[category_percentages['category'].isin(
            data_frame[data_frame['category_group'] == group_row['category_group']]['category'].unique()
        )].to_dict(orient='records')
        
        # simplify sub_categories structure
        for sub in sub_categories:
            # rename to category for clarity and consistency with the rest of the program
            sub['name'] = sub.pop('category') 
        
        result[group_row['category_group']] = {
            'total_percent': group_row['percent'],
            'details': sub_categories
        }
    return result