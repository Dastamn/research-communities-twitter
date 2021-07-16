import numpy as np
from flask_cors import CORS
from flask import Flask, request, jsonify
from process import edge_json_to_tensor, process_features_string, predict

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.route('/api/predict', methods=['POST'])
def graph_data():
    data = request.json
    edges_json = data['links']
    edge_index = edge_json_to_tensor(edges_json)
    features_string = data['features_string']
    x, ids, _ = process_features_string(features_string)
    pred = predict(x, edge_index)
    pred_dict = dict(zip(ids.astype(str), pred.numpy().tolist()))
    y_pos = np.where(pred == 1)[0]
    y_neg = np.where(pred == 0)[0]
    return jsonify({
        "predictions": pred_dict,
        'count': {
            '0': len(y_neg),
            "1": len(y_pos)
        }
    })


app.run(host="0.0.0.0", port=5000, debug=True)
