# Adds the Cloudflare Web Analytics snippet to every page that does not have it yet.
$tag = @'
<!-- Cloudflare Web Analytics --><script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "937d55df9d664d48a1ad148622c22bda"}'></script><!-- End Cloudflare Web Analytics -->
'@
$tag = $tag.Trim()
$pages = 'index.html','sudoku.html','maths-sprint.html','quiz.html','how-to-play.html','strategies.html','naked-pairs.html','pointing-pairs.html','x-wing.html','history-of-sudoku.html','about.html','privacy.html'
foreach ($f in $pages) {
  if (-not (Test-Path $f)) { Write-Host "MISSING: $f (run this from your games folder)"; continue }
  $c = Get-Content $f -Raw -Encoding UTF8
  if ($c -match 'cloudflareinsights') { Write-Host "already has it: $f"; continue }
  Set-Content $f ($c.Replace('</body>', "$tag`n</body>")) -Encoding UTF8 -NoNewline
  Write-Host "added: $f"
}
if (Test-Path privacy.html) {
  $p = Get-Content privacy.html -Raw -Encoding UTF8
  if ($p -notmatch 'Web Analytics') {
    $n = '<h2>Analytics</h2><p>We use Cloudflare Web Analytics to count visits and see which pages are popular. It does not use cookies or track individual visitors across sites.</p>'
    Set-Content privacy.html ($p.Replace('<h2>Advertising and cookies</h2>', "$n`n<h2>Advertising and cookies</h2>")) -Encoding UTF8 -NoNewline
    Write-Host "added analytics paragraph to privacy.html"
  }
}
