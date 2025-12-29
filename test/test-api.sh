#!/bin/bash

API_URL="http://localhost:3000/api/assets"
CREATED_ID=""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║       INDUSTRIAL IOT ASSET MAINTENANCE API TEST SUITE          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "📡 Server Health Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s http://localhost:3000/health | jq '.'
echo ""
read -p "Press Enter to continue..."
clear

echo "📋 GET All Assets"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s $API_URL | jq '{success, total, sample_asset: .data[0]}'
echo ""
read -p "Press Enter to continue..."
clear

echo "➕ POST Create New Asset"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Request Payload:"
cat << 'EOF' | jq '.'
{
  "asset_name": "Plasma Cutting Machine Theta",
  "serial_number": "PCM-T-009",
  "status": "RUNNING",
  "last_maintenance_date": "2024-12-28",
  "oee_score": 89.45
}
EOF
echo ""
echo "Response:"
RESPONSE=$(curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{
    "asset_name": "Plasma Cutting Machine Theta",
    "serial_number": "PCM-T-009",
    "status": "RUNNING",
    "last_maintenance_date": "2024-12-28",
    "oee_score": 89.45
  }')
echo $RESPONSE | jq '.'
CREATED_ID=$(echo $RESPONSE | jq -r '.data.id')
echo ""
echo "✅ Created Asset ID: $CREATED_ID"
echo ""
read -p "Press Enter to continue..."
clear

echo "🔍 GET Single Asset"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Fetching: $CREATED_ID"
curl -s $API_URL/$CREATED_ID | jq '.'
echo ""
read -p "Press Enter to continue..."
clear

echo "✏️  PUT Update Asset"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Updating: $CREATED_ID"
echo "Request Payload:"
cat << 'EOF' | jq '.'
{
  "asset_name": "Plasma Cutting Machine Theta Pro",
  "serial_number": "PCM-T-009",
  "status": "MAINTENANCE",
  "last_maintenance_date": "2024-12-28",
  "oee_score": 92.75
}
EOF
echo ""
echo "Response:"
curl -s -X PUT $API_URL/$CREATED_ID \
  -H "Content-Type: application/json" \
  -d '{
    "asset_name": "Plasma Cutting Machine Theta Pro",
    "serial_number": "PCM-T-009",
    "status": "MAINTENANCE",
    "last_maintenance_date": "2024-12-28",
    "oee_score": 92.75
  }' | jq '.'
echo ""
read -p "Press Enter to continue..."
clear

echo "🗑️  DELETE Asset"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Deleting: $CREATED_ID"
curl -s -X DELETE $API_URL/$CREATED_ID | jq '.'
echo ""
read -p "Press Enter to continue..."
clear

echo "📊 GET All Assets (After Delete)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s $API_URL | jq '{success, total, assets: [.data[] | {serial: .serial_number, status}]}'
echo ""
echo "✅ API Test Suite Complete!"