$body = [PSCustomObject]@{
    name = "Alex Smith"
    email = "alex@test.com"
    budgetRange = "<`$5k"
    message = "Testing the form endpoint with a long enough message"
} | ConvertTo-Json

Write-Host "Sending body: $body"

try {
    $res = Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/leads" -ContentType "application/json" -Body $body
    $res | ConvertTo-Json
} catch {
    Write-Host "Error: $_"
    $_.Exception.Response | ConvertTo-Json
}
