import csv

with open('olympic_newdata.csv', mode='w', newline='') as new_csv:
    output_writer = csv.writer(new_csv, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    output_writer.writerow(['Year', 'MedalF', 'MedalM'])

    with open('olympics.csv', mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        line_count = 0
        attribute_count_0 = 0
        attribute_count_1 = 0
        key = "Year"
        current_year = ""
        for row in csv_reader:
            if line_count == 0:
                line_count += 1
            if current_year != row[key]:
                if line_count != 1:
                    output_writer.writerow([current_year, attribute_count_0, attribute_count_1])
                if row['Gender'] == 'W':
                    attribute_count_0 = 1
                    attribute_count_1 = 0
                elif row['Gender'] == 'M':
                    attribute_count_0 = 0
                    attribute_count_1 = 1
                else:
                    attribute_count_0 = 0
                    attribute_count_1 = 0
                current_year = row[key]
            else:
                if row['Gender'] == 'W':
                    attribute_count_0 += 1
                    attribute_count_1 += 0
                elif row['Gender'] == 'M':
                    attribute_count_0 += 0
                    attribute_count_1 += 1
            # print(f'\t{row["Year"]} works in the {row["City"]} department, and was born in {row["Event"]}.')
            line_count += 1
        # print(f'Processed {line_count} lines.')
