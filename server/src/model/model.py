import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GCNConv


class GNNStack(torch.nn.Module):
    def __init__(self):
        super(GNNStack, self).__init__()
        input_dim = 22
        self.num_layers = 1
        hidden_dim = 64
        self.dropout = 0.5
        self.weights = None
        self.conv_layers = nn.ModuleList()
        self.conv_layers.append(GCNConv(input_dim, hidden_dim))
        if self.num_layers > 1:
            for i in range(self.num_layers - 1):
                self.conv_layers.append(GCNConv(hidden_dim, hidden_dim))
        self.post_mp = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Dropout(self.dropout),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Dropout(self.dropout),
            nn.Linear(hidden_dim, 2)
        )

    def forward(self, x, edge_index):
        for i in range(self.num_layers):
            x = self.conv_layers[i](x, edge_index)
            x = F.relu(x)
            x = F.dropout(x, p=self.dropout, training=self.training)
        out = self.post_mp(x)
        return x, F.log_softmax(out, dim=1)

    def loss(self, pred, labels):
        return F.nll_loss(pred, labels, weight=self.weights)
