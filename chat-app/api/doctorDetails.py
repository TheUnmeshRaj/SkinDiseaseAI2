import requests
from bs4 import BeautifulSoup


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
        print(f"No doctors found for '{query}'. Trying the backup query: '{backupQuery}'.")
        doctor_data, status_code = fetch_from_url(backupQuery, backupMode)

    
    if not doctor_data:
        return f"Failed to fetch doctors. Status Code: {status_code}"

    
    for doctor in doctor_data:
        if doctor["name"] == "Unknown":
            continue  

        print(f"Doctor: {doctor['name']}")
        
        profile_response = requests.get(doctor["link"], headers=headers)
        if profile_response.status_code != 200:
            print("   Failed to fetch doctor's profile page.")
            print("-" * 30)
            continue

        profile_soup = BeautifulSoup(profile_response.text, "html.parser")

        
        qualifications = profile_soup.find("p", class_="c-profile__details", attrs={"data-qa-id": "doctor-qualifications"})
        specializations = profile_soup.find("div", class_="c-profile__details", attrs={"data-qa-id": "doctor-specializations"})
        experience = profile_soup.find("h2", string=lambda text: text and "Years Experience" in text)

        
        clinics = profile_soup.find_all("p", class_="c-profile--clinic__address")
        
        
        if qualifications:
            print(f"   Qualifications: {qualifications.get_text(strip=True)}")
        if specializations:
            spec_list = [span.get_text(strip=True) for span in specializations.find_all("h2")]
            print(f"   Specializations: {', '.join(spec_list)}")
        if experience:
            print(f"   {experience.get_text(strip=True)}")
        print()
     
        
        if clinics:
            for idx, clinic in enumerate(clinics, start=1):
                clinic_address = clinic.get_text(strip=True)
                print(f"   Clinic {idx}: {clinic_address}")
        else:
            print("   No clinic addresses found.")
        print()
        print(f"For more details and to book a slot please visit the link: {doctor['link']}")
        
        print("-" * 70)


location = "patna"  
query = "acne"
backupQuery = "dermatologist"
backupMode = "service"
query = query.replace(" ", "%20")
mode = "symptom"
fetchDoctors(location, query, mode, backupQuery, backupMode)
