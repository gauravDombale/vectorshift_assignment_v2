from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from collections import deque
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="VectorShift Pipeline API",
    description="API for parsing and validating pipeline configurations",
    version="1.0.0"
)

# Add CORS middleware to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class Node(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any] = Field(default_factory=dict)

class PipelineRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

@app.get('/')
def read_root():
    """Health check endpoint."""
    return {'status': 'healthy', 'message': 'Pipeline API is running'}

@app.get('/health')
def health_check():
    """Health check endpoint for monitoring."""
    return {'status': 'healthy'}

def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Check if the graph formed by nodes and edges is a Directed Acyclic Graph (DAG).
    Uses topological sort algorithm.
    """
    if not nodes or not edges:
        return True
    
    # Build adjacency list and in-degree count
    node_ids = {node.id for node in nodes}
    adjacency = {node_id: [] for node_id in node_ids}
    in_degree = {node_id: 0 for node_id in node_ids}
    
    for edge in edges:
        source = edge.source
        target = edge.target
        
        # Only process edges where both nodes exist
        if source in node_ids and target in node_ids:
            adjacency[source].append(target)
            in_degree[target] = in_degree.get(target, 0) + 1
    
    # Find all nodes with in-degree 0 (use deque for O(1) pops)
    queue = deque([node_id for node_id in node_ids if in_degree.get(node_id, 0) == 0])
    processed_count = 0

    # Process nodes with no incoming edges
    while queue:
        current = queue.popleft()
        processed_count += 1

        # Reduce in-degree of neighbors
        for neighbor in adjacency.get(current, []):
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If we processed all nodes, it's a DAG (no cycles)
    # If there are cycles, some nodes will have in-degree > 0
    return processed_count == len(node_ids)

@app.post('/pipelines/parse')
async def parse_pipeline(pipeline: PipelineRequest):
    """
    Parse the pipeline and return statistics.
    
    Args:
        pipeline: The pipeline configuration containing nodes and edges
        
    Returns:
        dict: Pipeline statistics including node count, edge count, and DAG status
    """
    try:
        logger.info(f"Parsing pipeline with {len(pipeline.nodes)} nodes and {len(pipeline.edges)} edges")

        num_nodes = len(pipeline.nodes)
        num_edges = len(pipeline.edges)

        # Lightweight payload size guard
        if num_nodes > 5000 or num_edges > 20000:
            raise HTTPException(status_code=413, detail='Pipeline payload too large')

        # Validate edges reference known nodes
        node_ids = {node.id for node in pipeline.nodes}
        unknown_refs = set()
        for edge in pipeline.edges:
            if edge.source not in node_ids:
                unknown_refs.add(edge.source)
            if edge.target not in node_ids:
                unknown_refs.add(edge.target)

        if unknown_refs:
            logger.warning(f"Pipeline contains edges referencing unknown node ids: {unknown_refs}")
            raise HTTPException(status_code=400, detail=f"Edges reference unknown node ids: {sorted(list(unknown_refs))}")

        is_dag_result = is_dag(pipeline.nodes, pipeline.edges)
        
        logger.info(f"Pipeline analysis complete: is_dag={is_dag_result}")
        
        return {
            'num_nodes': num_nodes,
            'num_edges': num_edges,
            'is_dag': is_dag_result
        }
    except Exception as e:
        logger.error(f"Error parsing pipeline: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error parsing pipeline: {str(e)}")
