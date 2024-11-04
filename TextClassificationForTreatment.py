import torch
from datasets import load_dataset
from sklearn.metrics.pairwise import cosine_similarity
from transformers import (
    AutoModel,
    AutoModelForCausalLM,
    AutoTokenizer,
    GenerationConfig,
)

tokenizer1 = AutoTokenizer.from_pretrained("Unmeshraj/skin-disease-detection")
model1 = AutoModel.from_pretrained("Unmeshraj/skin-disease-detection")
tokenizer2 = AutoTokenizer.from_pretrained("Unmeshraj/skin-disease-treatment-plan")
model2 = AutoModel.from_pretrained("Unmeshraj/skin-disease-treatment-plan")

queries = []
diseases = []
embeddings = []

dataset = load_dataset("Mostafijur/Skin_disease_classify_data")

def embed_text(text, tokenizer, model):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
    embeddings = outputs.last_hidden_state.mean(dim=1)
    return embeddings

for example in dataset['train']:
    query = example['Skin_disease_classification']['query']
    disease = example['Skin_disease_classification']['disease']
    queries.append(query)
    diseases.append(disease)

    query_embedding = embed_text(query, tokenizer1, model1)
    embeddings.append(query_embedding)



def find_similar_disease(input_query, queries, embeddings, tokenizer, model):
    input_embedding = embed_text(input_query, tokenizer, model)
    similarities = [cosine_similarity(input_embedding.detach().numpy(), emb.detach().numpy())[0][0] for emb in embeddings]
    most_similar_idx = similarities.index(max(similarities))
    return diseases[most_similar_idx]

topics = []
information = []
topic_embeddings = []

dataset1 = load_dataset("brucewayne0459/Skin_diseases_and_care")

for example in dataset1['train']:
    topic = example['Topic']
    info = example['Information']
    topics.append(topic)
    information.append(info)

    topic_embedding = embed_text(topic, tokenizer2, model2)
    topic_embeddings.append(topic_embedding)

def find_treatment_plan(disease_name, topics, topic_embeddings, tokenizer2, model2):
    disease_embedding = embed_text(disease_name, tokenizer2, model2)
    similarities = [cosine_similarity(disease_embedding.detach().numpy(), topic_emb.detach().numpy())[0][0] for topic_emb in topic_embeddings]
    most_similar_idx = similarities.index(max(similarities))
    return information[most_similar_idx]

input_query = input("Enter your symptoms here: ")
similar_disease = find_similar_disease(input_query, queries, embeddings, tokenizer1, model1)
treatment_plan = find_treatment_plan(similar_disease, topics, topic_embeddings, tokenizer2, model2)
cleaned_treatment_plan = treatment_plan.replace("*", "").replace(":", ":\n").replace(". ", ".\n")
print(f"Treatment Plan for your similar disease:\n{cleaned_treatment_plan}")
for line in cleaned_treatment_plan.split("\n"):
    if line.strip():
        print(f"- {line.strip()}")