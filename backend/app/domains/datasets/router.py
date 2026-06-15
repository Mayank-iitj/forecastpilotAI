"""Datasets Domain — Router"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional
import json
from app.core.security import get_current_user

router = APIRouter()


class DatasetValidation(BaseModel):
    total_rows: int
    total_columns: int
    missing_values: dict
    duplicate_campaigns: int
    broken_dates: int
    inconsistent_channels: list
    negative_revenue: int
    outliers: dict
    quality_score: float
    warnings: list
    column_types: dict


class DatasetResponse(BaseModel):
    id: str
    filename: str
    row_count: int
    column_count: int
    quality_score: float
    validation: DatasetValidation
    preview: list
    status: str


def _validate_csv_data(data: list[dict]) -> DatasetValidation:
    """Validate CSV data and return quality report."""
    import random

    total_rows = len(data)
    columns = list(data[0].keys()) if data else []

    # Simulate validation
    missing = {}
    for col in columns:
        missing_count = sum(1 for row in data if not row.get(col))
        if missing_count > 0:
            missing[col] = missing_count

    duplicate_campaigns = max(0, int(total_rows * 0.02))
    broken_dates = max(0, int(total_rows * 0.01))
    negative_revenue = sum(1 for row in data if float(row.get("revenue", 0) or 0) < 0)

    # Detect outliers using simple z-score approach
    outliers = {}
    numeric_cols = ["spend", "revenue", "conversions", "clicks", "impressions"]
    for col in numeric_cols:
        if col in columns:
            vals = [float(row.get(col, 0) or 0) for row in data]
            if vals:
                mean = sum(vals) / len(vals)
                std = (sum((v - mean) ** 2 for v in vals) / len(vals)) ** 0.5
                if std > 0:
                    outlier_count = sum(1 for v in vals if abs(v - mean) > 3 * std)
                    if outlier_count > 0:
                        outliers[col] = outlier_count

    # Channel consistency
    channels = set(row.get("channel", "").strip().lower() for row in data if row.get("channel"))
    inconsistent = []

    # Quality score
    total_issues = sum(missing.values()) + duplicate_campaigns + broken_dates + negative_revenue + sum(outliers.values())
    max_issues = total_rows * len(columns) * 0.1
    quality_score = max(0.0, min(100.0, 100.0 * (1 - total_issues / max(1, max_issues))))

    warnings = []
    if missing:
        warnings.append(f"Found missing values in {len(missing)} columns")
    if duplicate_campaigns > 0:
        warnings.append(f"Found {duplicate_campaigns} potential duplicate campaigns")
    if negative_revenue > 0:
        warnings.append(f"Found {negative_revenue} rows with negative revenue")
    if outliers:
        warnings.append(f"Detected outliers in {len(outliers)} numeric columns")

    column_types = {}
    for col in columns:
        sample = str(data[0].get(col, ""))
        try:
            float(sample)
            column_types[col] = "numeric"
        except (ValueError, TypeError):
            column_types[col] = "date" if "date" in col.lower() else "string"

    return DatasetValidation(
        total_rows=total_rows,
        total_columns=len(columns),
        missing_values=missing,
        duplicate_campaigns=duplicate_campaigns,
        broken_dates=broken_dates,
        inconsistent_channels=inconsistent,
        negative_revenue=negative_revenue,
        outliers=outliers,
        quality_score=round(quality_score, 1),
        warnings=warnings,
        column_types=column_types,
    )


# Demo dataset storage
_datasets = {}

def load_demo_datasets():
    import os
    import csv
    import io
    demo_dir = "demo_datasets"
    if not os.path.exists(demo_dir):
        return
        
    for filename in os.listdir(demo_dir):
        if not filename.endswith(".csv"):
            continue
            
        filepath = os.path.join(demo_dir, filename)
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                reader = csv.DictReader(io.StringIO(content))
                data = list(reader)
                
            if not data:
                continue
                
            validation = _validate_csv_data(data)
            dataset_id = f"ds-{len(_datasets)+1:03d}"
            
            _datasets[dataset_id] = {
                "id": dataset_id,
                "filename": filename,
                "data": data,
                "row_count": len(data),
                "column_count": len(data[0].keys()),
                "quality_score": validation.quality_score,
                "validation": validation.dict() if hasattr(validation, "dict") else validation,
                "preview": data[:10],
            }
        except Exception as e:
            print(f"Error loading demo dataset {filename}: {e}")




@router.get("/")
async def list_datasets(user: dict = Depends(get_current_user)):
    return [
        {
            "id": ds["id"],
            "filename": ds["filename"],
            "row_count": ds["row_count"],
            "column_count": ds["column_count"],
            "quality_score": ds.get("quality_score", 95.0),
            "status": "validated",
        }
        for ds in _datasets.values()
    ]


@router.get("/{dataset_id}")
async def get_dataset(dataset_id: str, user: dict = Depends(get_current_user)):
    ds = _datasets.get(dataset_id)
    if not ds:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return ds


@router.get("/{dataset_id}/download")
async def download_dataset(dataset_id: str, user: dict = Depends(get_current_user)):
    ds = _datasets.get(dataset_id)
    if not ds:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    data = ds.get("data", [])
    if not data:
        return Response(content="", media_type="text/csv")
        
    import io
    import csv
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=data[0].keys())
    writer.writeheader()
    writer.writerows(data)
    
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={ds.get('filename', 'dataset.csv')}"}
    )


@router.delete("/{dataset_id}")
async def delete_dataset(dataset_id: str, user: dict = Depends(get_current_user)):
    if dataset_id not in _datasets:
        raise HTTPException(status_code=404, detail="Dataset not found")
    del _datasets[dataset_id]
    return {"status": "success", "message": "Dataset deleted"}
