import requests
from bs4 import BeautifulSoup
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Fetch doctor data
def fetchDoctors(location, query, mode, backupQuery, backupMode):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36"
    }

    def fetch_from_url(query, mode):
        url = f"https://www.practo.com/search/doctors?results_type=doctor&q=%5B%7B%22word%22%3A%22{query}%22%2C%22autocompleted%22%3Atrue%2C%22category%22%3A%22{mode}%22%7D%5D&city={location}"
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return [], response.status_code
        
        soup = BeautifulSoup(response.text, "html.parser")
        doctor_data = []
        
        for anchor in soup.find_all("a", href=True, class_=False):
            if "/doctor/" in anchor["href"]:
                name = anchor.find("h2", class_="doctor-name").get_text(strip=True) if anchor.find("h2", class_="doctor-name") else "Unknown"
                link = "https://www.practo.com" + anchor["href"]
                doctor_data.append({"name": name, "link": link})
        
        return doctor_data, response.status_code

    doctor_data, status_code = fetch_from_url(query, mode)

    if not doctor_data:
        doctor_data, status_code = fetch_from_url(backupQuery, backupMode)

    if not doctor_data:
        return {"error": f"Failed to fetch doctors. Status Code: {status_code}"}

    doctors_info = []

    for doctor in doctor_data:
        if doctor["name"] == "Unknown":
            continue

        profile_response = requests.get(doctor["link"], headers=headers)
        if profile_response.status_code != 200:
            continue

        profile_soup = BeautifulSoup(profile_response.text, "html.parser")
        qualifications = profile_soup.find("p", class_="c-profile__details", attrs={"data-qa-id": "doctor-qualifications"})
        specializations = profile_soup.find("div", class_="c-profile__details", attrs={"data-qa-id": "doctor-specializations"})
        experience = profile_soup.find("h2", string=lambda text: text and "Years Experience" in text)
        clinics = profile_soup.find_all("p", class_="c-profile--clinic__address")

        doctor_info = {
            "name": doctor['name'],
            "profile_link": doctor['link'],
            "qualifications": qualifications.get_text(strip=True) if qualifications else "Not available",
            "specializations": ", ".join([span.get_text(strip=True) for span in specializations.find_all("h2")]) if specializations else "Not available",
            "experience": experience.get_text(strip=True) if experience else "Not available",
            "clinics": [clinic.get_text(strip=True) for clinic in clinics] if clinics else ["No clinics listed"]
        }
        
        doctors_info.append(doctor_info)

    return doctors_info

# Routes
@app.route('/api/TextAi', methods=['POST'])
def GenResult():
    data = request.get_json()
    if 'inputText' not in data:
        return jsonify({'error': 'No input text provided'}), 400

    input_query = data['inputText']
    try:
        # Fetch disease and treatment plan (not modified in this code)
        # similar_disease = find_similar_disease(input_query)
        # treatment_plan = find_treatment_plan(similar_disease)

        # Just an example disease for testing
        similar_disease = "acne"  
        treatment_plan = "Follow a proper skincare routine including cleansing, exfoliating, and using acne medication."

        # Fetch doctor information
        location = "bangalore"
        query = similar_disease.replace(" ", "%20")
        mode = "symptom"
        backupQuery = "dermatologist"
        backupMode = "service"

        doctor_info = fetchDoctors(location, query, mode, backupQuery, backupMode)

        return jsonify({
            'result': similar_disease,
            'treatment': treatment_plan,
            'doctors': doctor_info
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
