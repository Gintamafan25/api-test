
import csv
import os
from flask import json
from datetime import datetime

input_folder = "nasdaq_etfs_txt"
output_folder = "nasdaq_etfs_csv"

# Create output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

for filename in os.listdir(input_folder):
    if filename.endswith(".txt"):
        
        input_path = os.path.join(input_folder, filename)
        output_path = os.path.join(
            output_folder,
            filename.replace(".txt", ".csv")
        )
        
        with open(input_path, "r") as infile:
            reader = csv.reader(infile)

        
            try:
                headers = next(reader)  # try to read header
            except StopIteration:
                print(f"⚠️ Skipping empty file: {filename}")
                continue  # move to next file

            
            with open(output_path, "w", newline="") as outfile:
                writer = csv.writer(outfile)

                cleaned_headers = [h.replace("<", "").replace(">", "") for h in headers]
                writer.writerow(cleaned_headers)

                for row in reader:
                    if not row:  # skip empty rows
                        continue
                    writer.writerow(row)

            print(f"✅ Processed: {filename}")

print("✅ All files processed.")




all_nasdaq_dict = {}
input_folder = "nasdaq_etfs_csv"

for filename in os.listdir(input_folder):
    ticker = None
    file_data = []
    with open(os.path.join(input_folder,filename),"r") as r:
        reader = csv.DictReader(r)
        
        for row in reader:
            if ticker is None:
                ticker = row["TICKER"]
            
            date_str = row["DATE"]

            date_obj = datetime.strptime(date_str, "%Y%m%d")
            file_data.append({
                "date": date_obj,
                "close": float(row["CLOSE"]),
                "open": float(row["OPEN"]),
            })
    if ticker is not None:
        all_nasdaq_dict[ticker] = file_data


with open("nasdaq_data.json", "w") as f:
    json.dump(all_nasdaq_dict, f, default=str)

