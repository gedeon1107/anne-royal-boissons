# Rename product images: replace spaces, commas, special chars with hyphens
# and normalize to lowercase for web-friendly filenames

$dir = "f:\Projet-commerce\anne-royal-boissons\public\images\products"

$mapping = @{}

Get-ChildItem -Path $dir -File | ForEach-Object {
    $old = $_.Name
    # Replace special characters with hyphens, normalize
    $new = $old `
        -replace '[,=()%]', '-' `
        -replace '\s+', '-' `
        -replace "'", '' `
        -replace '&', 'and' `
        -replace 'é|è|ê|ë', 'e' `
        -replace 'à|â|ä', 'a' `
        -replace 'ô|ö', 'o' `
        -replace 'ù|û|ü', 'u' `
        -replace 'î|ï', 'i' `
        -replace 'ç', 'c' `
        -replace 'É|È|Ê|Ë', 'E' `
        -replace '-{2,}', '-' `
        -replace '^-|-$', '' `
        -replace '-\.', '.'
    
    # Lowercase
    $new = $new.ToLower()
    
    if ($old -ne $new) {
        $mapping[$old] = $new
        Write-Host "$old -> $new"
        Rename-Item -Path (Join-Path $dir $old) -NewName $new -ErrorAction SilentlyContinue
    }
}

Write-Host "`nDone. Renamed $($mapping.Count) files."

# Output mapping as JSON for updating seed
$mapping | ConvertTo-Json | Set-Content (Join-Path $dir "..\..\..\rename-mapping.json")
