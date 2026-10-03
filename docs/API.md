# ECHO API Documentation

## Base URL
http://localhost:3000/api
## Authentication
All endpoints require JWT token in Authorization header:
Authorization: Bearer {token}
## Endpoints

### Research

#### Create Research
POST /research
Content-Type: application/json
{
"query": "Software engineers in San Francisco",
"prospects": ["prospect1", "prospect2"]
}
Response:
{
"id": "uuid",
"query": "...",
"created_at": "2026-10-03T...",
"status": "pending"
}
#### Get Research
POST /research
Content-Type: application/json
{
"query": "Software engineers in San Francisco",
"prospects": ["prospect1", "prospect2"]
}
Response:
{
"id": "uuid",
"query": "...",
"created_at": "2026-10-03T...",
"status": "pending"
}
#### Search Intelligence
POST /research/:queryId/search
Content-Type: application/json
{
"query": "search terms"
}
Response:
{
"results": [...],
"quality_score": 0.85,
"response_time_ms": 152
}
#### Get Patterns
GET /research/:queryId
Response:
{
"id": "uuid",
"query": "...",
"status": "completed",
"results_count": 150
}
### Search

#### Get Search Stats
GET /search/stats
Response:
{
"total_searches": 1250,
"avg_response_time": 152,
"quality_score": 0.85
}
#### Get Search Quality
GET /search/quality
Response:
{
"excellent": 0.85,
"good": 0.12,
"fair": 0.03
}
## Rate Limiting
- 5 requests per minute per IP
- Rate limit headers included in responses

## Error Handling

All errors return JSON with status code and message:

```json
{
  "error": "Failed to create research",
  "status": 500
}
Status Codes
200: Success
400: Bad request
401: Unauthorized
404: Not found
500: Server error
