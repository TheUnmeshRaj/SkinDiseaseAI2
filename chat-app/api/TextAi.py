import re
import textwrap

# from langchain.llms import OpenAI
# from langchain.prompts import PromptTemplate
import torch
from datasets import load_dataset
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
from sklearn.metrics.pairwise import cosine_similarity
from torchvision import models, transforms
from transformers import AutoModel, AutoTokenizer

# import openai
app = Flask(__name__)
CORS(app)

dataset = load_dataset("Mostafijur/Skin_disease_classify_data")
dataset1 = load_dataset("brucewayne0459/Skin_diseases_and_care")

tokenizer1 = AutoTokenizer.from_pretrained("Unmeshraj/skin-disease-detection")
model1 = AutoModel.from_pretrained("Unmeshraj/skin-disease-detection")
tokenizer2 = AutoTokenizer.from_pretrained("Unmeshraj/skin-disease-treatment-plan")
model2 = AutoModel.from_pretrained("Unmeshraj/skin-disease-treatment-plan")
image_model = models.resnet18(weights=None)
image_model.fc = torch.nn.Linear(image_model.fc.in_features, 7)
image_model.load_state_dict(torch.load("chat-app/api/model.pth", map_location=torch.device('cpu')))
image_model.eval()

# llm = OpenAI(temperature=0.3, model="text-davinci-003")

disease_classes = {
    0: 'Acne and Rosacea',
    1: 'Actinic Keratosis Basal Cell Carcinoma',
    2: 'Nail Fungus',
    3: 'Psoriasis Lichen Planus',
    4: 'Seborrheic Keratoses',
    5: 'Tinea Ringworm Candidiasis',
    6: 'Warts Molluscum'
}

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5], [0.5])
])

def embed_text(text, tokenizer, model):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1)

queries, diseases, embeddings = [], [], []
for example in dataset['train']:
    query = example['Skin_disease_classification']['query']
    disease = example['Skin_disease_classification']['disease']
    queries.append(query)
    diseases.append(disease)
    query_embedding = embed_text(query, tokenizer1, model1)
    embeddings.append(query_embedding)

topics, information, topic_embeddings = [], [], []
for example in dataset1['train']:
    topic = example['Topic']
    info = example['Information']
    topics.append(topic)
    information.append(info)
    topic_embedding = embed_text(topic, tokenizer2, model2)
    topic_embeddings.append(topic_embedding)

def find_similar_disease(input_query):
    input_embedding = embed_text(input_query, tokenizer1, model1)
    similarities = [cosine_similarity(input_embedding.detach().numpy(), emb.detach().numpy())[0][0] for emb in embeddings]
    return diseases[similarities.index(max(similarities))]

def find_treatment_plan(disease_name):
    disease_embedding = embed_text(disease_name, tokenizer2, model2)
    similarities = [cosine_similarity(disease_embedding.detach().numpy(), topic_emb.detach().numpy())[0][0] for topic_emb in topic_embeddings]
    return information[similarities.index(max(similarities))]

def predict_disease_from_image(image):
    image_tensor = transform(image).unsqueeze(0)
    with torch.no_grad():
        outputs = image_model(image_tensor)
        _, predicted = torch.max(outputs, 1)
    return disease_classes[predicted.item()]

@app.route('/api/ImageAi', methods=['POST'])
def ImageResult():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        print(file.filename)  # Check if file is received
        img = Image.open(file.stream).convert('RGB')
        img_tensor = transform(img).unsqueeze(0)

        with torch.no_grad():
            outputs = image_model(img_tensor)
            _, predicted = outputs.max(1)

        predicted_class = predicted.item()
        predicted_disease = disease_classes[predicted_class]
        treatment_plan = find_treatment_plan(predicted_disease)

        cleaned_treatment_plan = treatment_plan.replace("*", "").replace(":", ":\n").replace(". ", ".\n")

        return jsonify({
            'result': predicted_disease,
            'treatment': cleaned_treatment_plan
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/api/TextAi', methods=['POST'])
def GenResult():
    data = request.get_json()
    if 'inputText' not in data:
        return jsonify({'error': 'No input text provided'}), 400

    input_query = data['inputText']
    try:
        similar_disease = find_similar_disease(input_query)
        treatment_plan = find_treatment_plan(similar_disease)
        cleaned_treatment_plan = treatment_plan.replace("*", "").replace(":", ":\n").replace(". ", ".\n")
        return jsonify({
            'result': similar_disease,
            'treatment': cleaned_treatment_plan
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
'''
----------------------------------------------------------------------------------------------------------
            Manual 
def format_manually(treatment_plan):
    cleaned_text = re.sub(r"\*", "", treatment_plan)
    sentences = re.split(r'\. |\n', cleaned_text)
    formatted_sentences = [
        textwrap.fill(sentence.strip(), width=80)
        for sentence in sentences if sentence.strip()
    ]
    return "\n".join(formatted_sentences)

@app.route('/api/TextAi', methods=['POST'])
def GenResult():
    data = request.get_json()
    if 'inputText' not in data:
        return jsonify({'error': 'No input text provided'}), 400

    input_query = data['inputText']
    try:
        similar_disease = find_similar_disease(input_query)
        treatment_plan = find_treatment_plan(similar_disease)
        
        cleaned_treatment_plan = format_manually(treatment_plan)
        
        return jsonify({
            'result': similar_disease,
            'treatment': cleaned_treatment_plan
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
----------------------------------------------------------------------------------------------------------
'''
'''
----------------------------------------------------------------------------------------------------------
        LANGCHAIN
----------------------------------------------------------------------------------------------------------
def format_with_langchain(treatment_plan):
    template = """
    Given the following treatment plan, format it into a clean, readable structure:
    {treatment_plan}
    """
    prompt = PromptTemplate(input_variables=["treatment_plan"], template=template)
    formatted_text = llm(prompt.format(treatment_plan=treatment_plan))
    return formatted_text
----------------------------------------------------------------------------------------------------------
'''
'''
openai.api_key = 'your-api-key-here'

def format_with_openai(treatment_plan):
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",  # You can use 'gpt-3.5-turbo' if preferred
            prompt=f"Format the following treatment plan neatly:\n{treatment_plan}",
            max_tokens=500,
            temperature=0.3
        )
        return response['choices'][0]['text'].strip()
    except Exception as e:
        return str(e)  # In case of an error, return the error message


@app.route('/api/TextAi', methods=['POST'])
def GenResult():
    data = request.get_json()
    if 'inputText' not in data:
        return jsonify({'error': 'No input text provided'}), 400

    input_query = data['inputText']
    try:
        similar_disease = find_similar_disease(input_query)
        treatment_plan = find_treatment_plan(similar_disease)
        cleaned_treatment_plan = format_with_openai(treatment_plan)
        
        return jsonify({
            'result': similar_disease,
            'treatment': cleaned_treatment_plan
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
'''

if __name__ == '__main__':
    app.run(debug=True)
