$body = [PSCustomObject]@{
    name = "A"
    email = "not-an-email"
    budgetRange = "invalid"
    message = "short"
} | ConvertTo-Json

Write-Host "Sending invalid body to test Zod validation..."

try {
    $res = Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/leads" -ContentType "application/json" -Body $body
    $res | ConvertTo-Json
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $rawResponse = $reader.ReadToEnd()
    Write-Host "HTTP $statusCode"
    Write-Host $rawResponse
}
