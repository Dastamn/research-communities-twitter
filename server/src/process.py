import numpy as np
import torch
import pandas as pd
import io
import os
from model.model import GNNStack


def edge_json_to_tensor(edge_list_json):
    df = pd.DataFrame(edge_list_json)
    edge_index = df.to_numpy().astype(np.int64)
    edge_index = torch.tensor(edge_index, dtype=torch.long).t()
    return edge_index


def process_features_string(features_string):
    data = io.StringIO(features_string)
    df = pd.read_csv(data, sep=',')
    filtered = df.drop(['id', 'researcher'], axis=1)
    ids = df['id'].to_numpy()
    labels = df['researcher'].to_numpy()
    x = filtered.to_numpy()
    x = torch.tensor(x, dtype=torch.float)
    return x, ids, labels


def predict(x, edge_index):
    dirname = os.path.dirname(__file__)
    model_state_path = os.path.join(dirname, 'model/gcn_model_state.pt')
    model = GNNStack()
    device = torch.device(
        'cuda') if torch.cuda.is_available() else torch.device('cpu')
    state_dict = torch.load(model_state_path, map_location=device)
    model.load_state_dict(state_dict)
    model.eval()
    _, out = model(x, edge_index)
    pred = out.argmax(dim=1)
    return pred
